'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useLists, useAddList, useUpdateList, useDeleteList, useTasks, useAddTask, useUpdateTask, useDeleteTask } from '@/hooks/useData';
import { List, Task } from '@/types';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CardModal from './CardModal';

interface KanbanBoardProps {
  boardId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ boardId }) => {
  console.log('Rendering KanbanBoard with boardId:', boardId);

  const { data: lists, isLoading: listsLoading } = useLists(boardId);
  const { data: tasks, isLoading: tasksLoading } = useTasks(boardId);
  const addList = useAddList();
  const updateList = useUpdateList();
  const deleteList = useDeleteList();
  const addTask = useAddTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [orderedLists, setOrderedLists] = useState<List[]>([]);
  const [newListTitle, setNewListTitle] = useState('');
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingListTitle, setEditingListTitle] = useState('');
  const [newTaskTitles, setNewTaskTitles] = useState<{ [listId: string]: string }>({});
  const [focusedListId, setFocusedListId] = useState<string | null>(null);

  const [selectedCard, setSelectedCard] = useState<Task | null>(null);

  useEffect(() => {
    if (lists) {
      console.log('Updating orderedLists with:', lists);
      setOrderedLists(lists.sort((a, b) => a.order - b.order));
    }
  }, [lists]);

  const handleDragEnd = useCallback((result: DropResult) => {
    console.log('Drag ended:', result);
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === 'LIST') {
      const newLists = Array.from(orderedLists);
      const [reorderedList] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, reorderedList);
      setOrderedLists(newLists);
      newLists.forEach((list, index) => {
        updateList.mutate({ ...list, order: index });
      });
    } else if (type === 'TASK') {
      const sourceList = orderedLists.find(list => list.id === source.droppableId);
      const destList = orderedLists.find(list => list.id === destination.droppableId);
      
      if (sourceList && destList && tasks) {
        const sourceTasks = Array.from(tasks.filter(task => task.listId === sourceList.id));
        const destTasks = source.droppableId === destination.droppableId
          ? sourceTasks
          : Array.from(tasks.filter(task => task.listId === destList.id));

        const [movedTask] = sourceTasks.splice(source.index, 1);
        destTasks.splice(destination.index, 0, { ...movedTask, listId: destList.id });

        const updatedTasks = [
          ...tasks.filter(task => task.listId !== sourceList.id && task.listId !== destList.id),
          ...sourceTasks.map((task, index) => ({ ...task, order: index })),
          ...destTasks.map((task, index) => ({ ...task, order: index })),
        ];

        updatedTasks.forEach(task => {
          updateTask.mutate(task);
        });
      }
    }
  }, [orderedLists, tasks, updateList, updateTask]);

  const handleAddList = useCallback(() => {
    if (newListTitle.trim()) {
      console.log('Adding new list:', newListTitle);
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
      console.log('Saving list title:', editingListTitle);
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
      console.log('Deleting list:', listId);
      deleteList.mutate(listId);
      setOrderedLists(prev => prev.filter(list => list.id !== listId));
      toast.success('List deleted');
    }
  }, [deleteList, tasks]);

  const handleAddTask = useCallback((listId: string) => {
    const taskTitle = newTaskTitles[listId]?.trim();
    if (taskTitle) {
      console.log('Adding new task:', taskTitle, 'to list:', listId);
      const newTask: Task = {
        id: `task-${Date.now()}`,
        listId,
        boardId,
        title: taskTitle,
        order: 0, // Add at the top
      };
      addTask.mutate(newTask);
      setNewTaskTitles(prev => ({ ...prev, [listId]: '' }));
      toast.success('New task added');
    }
  }, [addTask, boardId, newTaskTitles]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>, listId: string) => {
    if (e.key === 'Enter' && !e.ctrlKey) {
      e.preventDefault();
      handleAddTask(listId);
    }
  }, [handleAddTask]);

  const handleCardDoubleClick = (task: Task) => {
    setSelectedCard(task);
  };

  const handleCardUpdate = (updatedTask: Task) => {
    updateTask.mutate(updatedTask);
    setSelectedCard(null);
  };

  const handleCardDelete = (taskId: string) => {
    deleteTask.mutate(taskId);
    setSelectedCard(null);
  };

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
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="board" type="LIST" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex overflow-x-auto p-4 space-x-4 custom-scrollbar min-h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)] snap-x snap-mandatory"
            >
              {orderedLists.map((list, index) => (
                <Draggable key={list.id} draggableId={list.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-solarized-base02 p-2 rounded-md w-80 flex-shrink-0 snap-center flex flex-col max-h-full"
                    >
                      <div {...provided.dragHandleProps} className="flex justify-between items-center mb-2">
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
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditList(list)} className="text-solarized-blue">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDeleteList(list.id)} className="text-solarized-red">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="mb-2 relative">
                        <textarea
                          value={newTaskTitles[list.id] || ''}
                          onChange={(e) => setNewTaskTitles(prev => ({ ...prev, [list.id]: e.target.value }))}
                          onKeyPress={(e) => handleKeyPress(e, list.id)}
                          onFocus={() => setFocusedListId(list.id)}
                          onBlur={() => setFocusedListId(null)}
                          placeholder="Add a card..."
                          className="bg-solarized-base01 text-solarized-base3 px-2 py-1 rounded w-full resize-none"
                          rows={2}
                        />
                        {focusedListId === list.id && (
                          <button
                            onClick={() => handleAddTask(list.id)}
                            className="absolute right-2 bottom-2 bg-solarized-blue text-solarized-base3 p-1 rounded hover:bg-opacity-80 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        )}
                      </div>
                      <Droppable droppableId={list.id} type="TASK">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="min-h-[50px] overflow-y-auto flex-grow custom-scrollbar pr-2">
                            {tasks
                              ?.filter(task => task.listId === list.id)
                              .sort((a, b) => a.order - b.order)
                              .map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`bg-solarized-base01 p-2 mb-2 rounded shadow ${
                                        snapshot.isDragging ? 'opacity-50' : ''
                                      }`}
                                      onDoubleClick={() => handleCardDoubleClick(task)}
                                    >
                                      <div className="whitespace-pre-wrap break-words">{task.title}</div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <div className="w-80 flex-shrink-0 snap-center">
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddList()}
                  placeholder="Enter list title"
                  className="bg-solarized-base01 text-solarized-base3 px-2 py-1 rounded w-full mb-2"
                />
                <button
                  onClick={handleAddList}
                  className="bg-solarized-blue text-solarized-base3 p-2 rounded hover:bg-opacity-80 transition-colors w-full flex items-center justify-center"
                >
                  <Plus size={20} className="mr-2" /> Add List
                </button>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onUpdate={handleCardUpdate}
          onDelete={handleCardDelete}
        />
      )}
    </>
  );
};

export default KanbanBoard;