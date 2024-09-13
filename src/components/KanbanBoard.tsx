'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useLists, useAddList, useUpdateList, useDeleteList, useTasks, useAddTask, useUpdateTask, useDeleteTask } from '@/hooks/useData';
import { List, Task } from '@/types';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CardModal from './CardModal';
import CardDetailModal from './CardDetailModal';
import AddListForm from './KanbanBoard/AddListForm';

interface KanbanBoardProps {
  boardId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ boardId }) => {
  const { data: lists, isLoading: listsLoading } = useLists(boardId);
  const { data: tasks, isLoading: tasksLoading } = useTasks(boardId);
  const addList = useAddList();
  const updateList = useUpdateList();
  const deleteList = useDeleteList();
  const addTask = useAddTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [orderedLists, setOrderedLists] = useState<List[]>([]);
  const [orderedTasks, setOrderedTasks] = useState<{ [listId: string]: Task[] }>({});
  const [newListTitle, setNewListTitle] = useState('');
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingListTitle, setEditingListTitle] = useState('');
  const [newTaskTitles, setNewTaskTitles] = useState<{ [listId: string]: string }>({});
  const [focusedListId, setFocusedListId] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<Task | null>(null);
  const [isCardDetailModalOpen, setIsCardDetailModalOpen] = useState(false);
  const [selectedListForNewCard, setSelectedListForNewCard] = useState<string | null>(null);

  useEffect(() => {
    if (lists) {
      setOrderedLists(lists.sort((a, b) => a.order - b.order));
    }
  }, [lists]);

  useEffect(() => {
    if (tasks) {
      const tasksByList = tasks.reduce((acc, task) => {
        if (!acc[task.listId]) {
          acc[task.listId] = [];
        }
        acc[task.listId].push(task);
        return acc;
      }, {} as { [listId: string]: Task[] });

      Object.keys(tasksByList).forEach(listId => {
        tasksByList[listId].sort((a, b) => a.order - b.order);
      });

      setOrderedTasks(tasksByList);
    }
  }, [tasks]);

  const moveList = useCallback((dragIndex: number, hoverIndex: number) => {
    const newLists = Array.from(orderedLists);
    const [reorderedList] = newLists.splice(dragIndex, 1);
    newLists.splice(hoverIndex, 0, reorderedList);
    setOrderedLists(newLists);
    newLists.forEach((list, index) => {
      updateList.mutate({ ...list, order: index });
    });
  }, [orderedLists, updateList]);

  const moveTask = useCallback((dragListId: string, dragIndex: number, hoverListId: string, hoverIndex: number) => {
    const newOrderedTasks = { ...orderedTasks };
    const sourceTasks = Array.from(newOrderedTasks[dragListId] || []);
    const destTasks = dragListId === hoverListId
      ? sourceTasks
      : Array.from(newOrderedTasks[hoverListId] || []);

    const [movedTask] = sourceTasks.splice(dragIndex, 1);
    destTasks.splice(hoverIndex, 0, { ...movedTask, listId: hoverListId });

    newOrderedTasks[dragListId] = sourceTasks;
    newOrderedTasks[hoverListId] = destTasks;

    setOrderedTasks(newOrderedTasks);

    // Update tasks in the database
    const updatedTasks = [
      ...sourceTasks.map((task, index) => ({ ...task, order: index })),
      ...destTasks.map((task, index) => ({ ...task, listId: hoverListId, order: index })),
    ];

    updatedTasks.forEach(task => {
      updateTask.mutate(task);
    });
  }, [orderedTasks, updateTask]);

  const handleAddList = useCallback(() => {
    if (newListTitle.trim()) {
      const newList: List = {
        id: `list-${Date.now()}`,
        boardId,
        title: newListTitle.trim(),
        order: orderedLists.length,
      };
      addList.mutate(newList);
      setOrderedLists(prev => [...prev, newList]);
      setNewListTitle('');
      toast.success('New list added');
    }
  }, [addList, boardId, newListTitle, orderedLists.length]);

  const handleEditList = useCallback((list: List) => {
    setEditingListId(list.id);
    setEditingListTitle(list.title);
  }, []);

  const handleSaveListTitle = useCallback(() => {
    if (editingListId && editingListTitle.trim()) {
      const listToUpdate = orderedLists.find(list => list.id === editingListId);
      if (listToUpdate) {
        const updatedList = {
          ...listToUpdate,
          title: editingListTitle.trim(),
        };
        updateList.mutate(updatedList);
        setOrderedLists(prev => prev.map(list => list.id === editingListId ? updatedList : list));
        setEditingListId(null);
        setEditingListTitle('');
        toast.success('List title updated');
      }
    }
  }, [editingListId, editingListTitle, orderedLists, updateList]);

  const handleDeleteList = useCallback((listId: string) => {
    const listTasks = tasks?.filter(task => task.listId === listId) || [];
    if (listTasks.length > 0) {
      toast.error('Cannot delete list with tasks');
      return;
    }
    if (confirm('Are you sure you want to delete this list?')) {
      deleteList.mutate(listId);
      setOrderedLists(prev => prev.filter(list => list.id !== listId));
      toast.success('List deleted');
    }
  }, [deleteList, tasks]);

  const handleQuickAddTask = useCallback((listId: string) => {
    const taskTitle = newTaskTitles[listId]?.trim();
    if (taskTitle) {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        listId,
        boardId,
        title: taskTitle,
        order: orderedTasks[listId]?.length || 0,
      };
      addTask.mutate(newTask);
      setNewTaskTitles(prev => ({ ...prev, [listId]: '' }));
      setOrderedTasks(prev => ({
        ...prev,
        [listId]: [...(prev[listId] || []), newTask],
      }));
      toast.success('New task added');
    }
  }, [addTask, boardId, newTaskTitles, orderedTasks]);

  const handleOpenCardDetailModal = useCallback((listId: string) => {
    setSelectedListForNewCard(listId);
    setIsCardDetailModalOpen(true);
  }, []);

  const handleCardDetailSubmit = useCallback((newTask: Task) => {
    addTask.mutate(newTask);
    setOrderedTasks(prev => ({
      ...prev,
      [newTask.listId]: [...(prev[newTask.listId] || []), newTask],
    }));
    setIsCardDetailModalOpen(false);
    setSelectedListForNewCard(null);
    toast.success('New task added');
  }, [addTask]);

  const handleCardUpdate = useCallback((updatedTask: Task) => {
    updateTask.mutate(updatedTask);
    setOrderedTasks(prev => ({
      ...prev,
      [updatedTask.listId]: prev[updatedTask.listId].map(task =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    }));
    setSelectedCard(null);
  }, [updateTask]);

  const handleCardDelete = useCallback((taskId: string) => {
    const listId = Object.keys(orderedTasks).find(listId =>
      orderedTasks[listId].some(task => task.id === taskId)
    );
    if (listId) {
      deleteTask.mutate(taskId);
      setOrderedTasks(prev => ({
        ...prev,
        [listId]: prev[listId].filter(task => task.id !== taskId),
      }));
      setSelectedCard(null);
    }
  }, [deleteTask, orderedTasks]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (listsLoading || tasksLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex overflow-x-auto p-2 space-x-2 custom-scrollbar min-h-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)] snap-x snap-mandatory">
        <AddListForm
          onAddList={handleAddList}
          totalLists={orderedLists.length}
          totalTasks={tasks?.length || 0}
        />
        {orderedLists.map((list, index) => (
          <ListComponent
            key={list.id}
            list={list}
            index={index}
            tasks={orderedTasks[list.id] || []}
            onMoveList={moveList}
            onMoveTask={moveTask}
            onAddTask={handleQuickAddTask}
            onEditList={handleEditList}
            onDeleteList={handleDeleteList}
            onOpenCardDetailModal={handleOpenCardDetailModal}
            editingListId={editingListId}
            editingListTitle={editingListTitle}
            setEditingListTitle={setEditingListTitle}
            handleSaveListTitle={handleSaveListTitle}
            newTaskTitles={newTaskTitles}
            setNewTaskTitles={setNewTaskTitles}
            setSelectedCard={setSelectedCard}
          />
        ))}
      </div>
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onUpdate={handleCardUpdate}
          onDelete={handleCardDelete}
        />
      )}
      {isCardDetailModalOpen && (
        <CardDetailModal
          listId={selectedListForNewCard!}
          boardId={boardId}
          onClose={() => setIsCardDetailModalOpen(false)}
          onSubmit={handleCardDetailSubmit}
        />
      )}
    </DndProvider>
  );
};

interface ListComponentProps {
  list: List;
  index: number;
  tasks: Task[];
  onMoveList: (dragIndex: number, hoverIndex: number) => void;
  onMoveTask: (dragListId: string, dragIndex: number, hoverListId: string, hoverIndex: number) => void;
  onAddTask: (listId: string) => void;
  onEditList: (list: List) => void;
  onDeleteList: (listId: string) => void;
  onOpenCardDetailModal: (listId: string) => void;
  editingListId: string | null;
  editingListTitle: string;
  setEditingListTitle: React.Dispatch<React.SetStateAction<string>>;
  handleSaveListTitle: () => void;
  newTaskTitles: { [listId: string]: string };
  setNewTaskTitles: React.Dispatch<React.SetStateAction<{ [listId: string]: string }>>;
  setSelectedCard: React.Dispatch<React.SetStateAction<Task | null>>;
}

const ListComponent: React.FC<ListComponentProps> = ({
  list,
  index,
  tasks,
  onMoveList,
  onMoveTask,
  onAddTask,
  onEditList,
  onDeleteList,
  onOpenCardDetailModal,
  editingListId,
  editingListTitle,
  setEditingListTitle,
  handleSaveListTitle,
  newTaskTitles,
  setNewTaskTitles,
  setSelectedCard
}) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'LIST',
    item: { type: 'LIST', id: list.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ['LIST', 'TASK'],
    hover: (item: { type: string; id: string; index: number; listId?: string }, monitor) => {
      if (item.type === 'LIST') {
        if (item.index === index) {
          return;
        }
        onMoveList(item.index, index);
        item.index = index;
      } else if (item.type === 'TASK' && item.listId !== list.id) {
        onMoveTask(item.listId!, item.index, list.id, tasks.length);
        item.index = tasks.length;
        item.listId = list.id;
      }
    },
  });

  return (
    <div
      ref={(node) => preview(drop(node))}
      className={`bg-solarized-base02 p-2 rounded-lg w-72 flex-shrink-0 snap-center flex flex-col max-h-full ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div
        ref={(node) => drag(node)}
        className="flex justify-between items-center mb-2 px-2 cursor-move"
      >
        <div className="flex items-center">
          <GripVertical size={16} className="text-solarized-base1 mr-2" />
          {editingListId === list.id ? (
            <input
              type="text"
              value={editingListTitle}
              onChange={(e) => setEditingListTitle(e.target.value)}
              onBlur={handleSaveListTitle}
              onKeyPress={(e) => e.key === 'Enter' && handleSaveListTitle()}
              className="bg-solarized-base01 text-solarized-base3 px-2 py-1 rounded"
            />
          ) : (
            <h3 className="font-bold text-solarized-base1">{list.title}</h3>
          )}
        </div>
        <div className="flex space-x-1">
          <button onClick={() => onOpenCardDetailModal(list.id)} className="text-solarized-blue p-1 rounded hover:bg-solarized-base01">
            <Plus size={14} />
          </button>
          <button onClick={() => onEditList(list)} className="text-solarized-blue p-1 rounded hover:bg-solarized-base01">
            <Edit2 size={14} />
          </button>
          <button onClick={() => onDeleteList(list.id)} className="text-solarized-red p-1 rounded hover:bg-solarized-base01">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className="mb-2 px-2">
        <textarea
          value={newTaskTitles[list.id] || ''}
          onChange={(e) => setNewTaskTitles(prev => ({ ...prev, [list.id]: e.target.value }))}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && onAddTask(list.id)}
          placeholder="Add quick card..."
          className="bg-solarized-base01 text-solarized-base3 px-2 py-1 rounded w-full resize-none text-sm"
          rows={2}
        />
      </div>
      <div className="overflow-y-auto flex-grow custom-scrollbar pr-2 min-h-[50px]">
        {tasks.map((task, taskIndex) => (
          <TaskComponent
            key={task.id}
            task={task}
            index={taskIndex}
            listId={list.id}
            onMoveTask={onMoveTask}
            setSelectedCard={setSelectedCard}
          />
        ))}
      </div>
    </div>
  );
};

interface TaskComponentProps {
  task: Task;
  index: number;
  listId: string;
  onMoveTask: (dragListId: string, dragIndex: number, hoverListId: string, hoverIndex: number) => void;
  setSelectedCard: React.Dispatch<React.SetStateAction<Task | null>>;
}

const TaskComponent: React.FC<TaskComponentProps> = ({ task, index, listId, onMoveTask, setSelectedCard }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { type: 'TASK', id: task.id, listId, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'TASK',
    hover: (item: { type: string; id: string; listId: string; index: number }, monitor) => {
      if (item.listId === listId && item.index === index) {
        return;
      }
      onMoveTask(item.listId, item.index, listId, index);
      item.listId = listId;
      item.index = index;
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`bg-solarized-base01 p-2 mb-2 rounded-lg shadow text-sm cursor-move ${
        isDragging ? 'opacity-50 border-2 border-solarized-blue' : ''
      }`}
      onDoubleClick={() => setSelectedCard(task)}
    >
      <div className="whitespace-pre-wrap break-words">{task.title}</div>
    </div>
  );
};

export default KanbanBoard;