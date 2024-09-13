'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useLists, useAddList, useTasks, useAddTask, useUpdateTask, useDeleteTask } from '@/hooks/useData';
import { List, Task } from '@/types';
import { toast } from 'react-hot-toast';
import AddListForm from './AddListForm';
import ListComponent from './ListComponent';
import CardDetailModal from '../CardDetailModal';
import { updateList } from '@/lib/db';


interface KanbanBoardProps {
  boardId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ boardId }) => {
  const { data: lists, isLoading: listsLoading } = useLists(boardId);
  const { data: tasks, isLoading: tasksLoading } = useTasks(boardId);
  const addList = useAddList();
  const addTask = useAddTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [orderedLists, setOrderedLists] = useState<List[]>([]);
  const [orderedTasks, setOrderedTasks] = useState<{ [listId: string]: Task[] }>({});
  const [selectedCard, setSelectedCard] = useState<Task | null>(null);
  const [isCardDetailModalOpen, setIsCardDetailModalOpen] = useState(false);
  const [selectedListForNewCard, setSelectedListForNewCard] = useState<string | null>(null);

  // ... (keep the existing useEffects for orderedLists and orderedTasks)

  const moveList = useCallback((dragIndex: number, hoverIndex: number) => {
    // ... (keep the existing moveList logic)
  }, [orderedLists, updateList]);

  const moveTask = useCallback((dragListId: string, dragIndex: number, hoverListId: string, hoverIndex: number) => {
    // ... (keep the existing moveTask logic)
  }, [orderedTasks, updateTask]);

  const handleAddList = useCallback((newListTitle: string) => {
    console.log('Attempting to add new list:', newListTitle); // Debug log
    const newList: List = {
      id: `list-${Date.now()}`,
      boardId,
      title: newListTitle.trim(),
      order: orderedLists.length,
    };
    addList.mutate(newList, {
      onSuccess: () => {
        console.log('New list added successfully:', newList); // Debug log
        setOrderedLists(prev => {
          const updatedLists = [...prev, newList];
          console.log('Updated ordered lists:', updatedLists); // Debug log
          return updatedLists;
        });
        toast.success('New list added');
      },
      onError: (error) => {
        console.error('Failed to add new list:', error); // Debug log
        toast.error('Failed to add new list');
      }
    });
  }, [addList, boardId, orderedLists.length]);

  const handleOpenCardDetailModal = useCallback((listId: string) => {
    setSelectedListForNewCard(listId);
    setIsCardDetailModalOpen(true);
  }, []);

  const handleCardDetailSubmit = useCallback((newTask: Task) => {
    // ... (keep the existing handleCardDetailSubmit logic)
  }, [addTask]);

  const handleCardUpdate = useCallback((updatedTask: Task) => {
    // ... (keep the existing handleCardUpdate logic)
  }, [updateTask]);

  const handleCardDelete = useCallback((taskId: string) => {
    // ... (keep the existing handleCardDelete logic)
  }, [deleteTask, orderedTasks]);

  const totalTasks = useMemo(() => {
    return Object.values(orderedTasks).reduce((sum, tasks) => sum + tasks.length, 0);
  }, [orderedTasks]);

  if (listsLoading || tasksLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col min-h-screen">
        <div className="flex justify-center my-4">
        </div>
        <div className="flex overflow-x-auto p-2 space-x-2 custom-scrollbar min-h-[calc(100vh-12rem)] max-h-[calc(100vh-12rem)] snap-x snap-mandatory">
          <AddListForm 
            onAddList={handleAddList} 
            totalLists={orderedLists.length} 
            totalTasks={totalTasks}
          />
          {orderedLists.map((list, index) => (
            <ListComponent
              key={list.id}
              list={list}
              index={index}
              tasks={orderedTasks[list.id] || []}
              onMoveList={moveList}
              onMoveTask={moveTask}
              onOpenCardDetailModal={handleOpenCardDetailModal}
              setSelectedCard={setSelectedCard}
            />
          ))}
        </div>
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

export default KanbanBoard;