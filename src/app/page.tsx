'use client'

import React, { useState, useCallback, useEffect } from 'react';
import { useBoards, useUpdateBoard, useDeleteBoard } from '@/hooks/useData';
import { Board } from '@/types';
import NewBoardModal from '@/components/NewBoardModal';
import ResetDatabaseButton from '@/components/ResetDatabaseButton';
import { Plus, Edit2, Trash2, Eye, List } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { data: boards, isLoading, error } = useBoards();
  const updateBoard = useUpdateBoard();
  const deleteBoard = useDeleteBoard();
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editingBoardTitle, setEditingBoardTitle] = useState('');
  const [isNewBoardModalOpen, setIsNewBoardModalOpen] = useState(false);

  const handleEditBoard = useCallback((board: Board) => {
    setEditingBoardId(board.id);
    setEditingBoardTitle(board.title);
  }, []);

  const handleSaveBoard = useCallback(() => {
    if (editingBoardId && editingBoardTitle.trim()) {
      updateBoard.mutate({
        id: editingBoardId,
        title: editingBoardTitle.trim(),
      });
      setEditingBoardId(null);
      setEditingBoardTitle('');
    }
  }, [editingBoardId, editingBoardTitle, updateBoard]);

  const handleDeleteBoard = useCallback((boardId: string) => {
    if (confirm('Are you sure you want to delete this board?')) {
      deleteBoard.mutate(boardId);
    }
  }, [deleteBoard]);

  const handleViewBoard = useCallback((boardId: string) => {
    router.push(`/board/${boardId}`);
  }, [router]);

  const renderBoard = useCallback((board: Board, index: number) => (
    <Draggable key={board.id} draggableId={board.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-solarized-base02 p-4 rounded-lg hover:bg-solarized-base01 transition-colors flex items-center ${
            snapshot.isDragging ? 'shadow-lg' : ''
          }`}
        >
          <div {...provided.dragHandleProps} className="flex-grow flex items-center cursor-move">
            <GripVertical size={20} className="text-solarized-base1 mr-3" />
            {editingBoardId === board.id ? (
              <input
                type="text"
                value={editingBoardTitle}
                onChange={(e) => setEditingBoardTitle(e.target.value)}
                className="bg-solarized-base01 text-solarized-base3 px-2 py-1 rounded mr-2 flex-grow"
              />
            ) : (
              <span className="text-lg font-semibold text-solarized-base1">{board.title}</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {editingBoardId === board.id ? (
              <button
                onClick={handleSaveBoard}
                className="bg-solarized-blue text-solarized-base3 p-2 rounded-full hover:bg-opacity-80 transition-colors"
              >
                Save
              </button>
            ) : (
              <>
                <button
                  onClick={() => router.push(`/board/${board.id}`)}
                  className="bg-solarized-base01 text-solarized-blue hover:text-solarized-cyan transition-colors p-2 rounded-full hover:bg-solarized-base00"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => handleEditBoard(board)}
                  className="bg-solarized-base01 text-solarized-blue hover:text-solarized-cyan transition-colors p-2 rounded-full hover:bg-solarized-base00"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteBoard(board.id)}
                  className="bg-solarized-base01 text-solarized-red hover:text-solarized-orange transition-colors p-2 rounded-full hover:bg-solarized-base00"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </Draggable>
  ), [editingBoardId, editingBoardTitle, handleDeleteBoard, handleEditBoard, handleSaveBoard, router]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-solarized-cyan">Your Boards</h2>
        <div className="space-x-4">
          <button
            onClick={() => setIsNewBoardModalOpen(true)}
            className="bg-solarized-blue text-solarized-base3 px-4 py-2 rounded hover:bg-opacity-80 transition-colors flex items-center"
          >
            <Plus size={18} className="mr-2" /> New Board
          </button>
          <ResetDatabaseButton />
        </div>
      </div>
      
      {isLoading ? (
        <p className="text-solarized-base1">Loading boards...</p>
      ) : error ? (
        <p className="text-solarized-red">Error loading boards: {error.message}</p>
      ) : (
        <div className="space-y-4">
          {boards?.map((board) => (
            <div
              key={board.id}
              className="bg-solarized-base02 p-4 rounded-lg hover:bg-solarized-base01 transition-colors flex items-center"
            >
              <List size={20} className="text-solarized-base1 mr-3" />
              <span className="text-lg font-semibold text-solarized-base1 flex-grow">{board.title}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleViewBoard(board.id)}
                  className="bg-solarized-base01 text-solarized-blue hover:text-solarized-cyan transition-colors p-2 rounded-full hover:bg-solarized-base00"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => handleEditBoard(board)}
                  className="bg-solarized-base01 text-solarized-blue hover:text-solarized-cyan transition-colors p-2 rounded-full hover:bg-solarized-base00"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteBoard(board.id)}
                  className="bg-solarized-base01 text-solarized-red hover:text-solarized-orange transition-colors p-2 rounded-full hover:bg-solarized-base00"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <NewBoardModal isOpen={isNewBoardModalOpen} onClose={() => setIsNewBoardModalOpen(false)} />
    </div>
  );
}