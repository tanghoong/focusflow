'use client'

import React, { useState } from 'react';
import { useAddBoard } from '@/hooks/useData';
import { v4 as uuidv4 } from 'uuid';
import { X, Plus } from 'lucide-react';

interface NewBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewBoardModal: React.FC<NewBoardModalProps> = ({ isOpen, onClose }) => {
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const addBoard = useAddBoard();

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBoardTitle.trim()) {
      addBoard.mutate({
        id: uuidv4(),
        title: newBoardTitle.trim(),
      });
      setNewBoardTitle('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-solarized-base03 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-solarized-blue">Create New Board</h2>
          <button onClick={onClose} className="text-solarized-base1 hover:text-solarized-base0">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleCreateBoard}>
          <input
            type="text"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            placeholder="Enter board title"
            className="bg-solarized-base02 text-solarized-base0 px-3 py-2 rounded w-full mb-4"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-solarized-red text-solarized-base3 px-4 py-2 rounded hover:bg-opacity-80 transition-colors flex items-center"
            >
              <X size={18} className="mr-2" /> Cancel
            </button>
            <button
              type="submit"
              className="bg-solarized-blue text-solarized-base3 px-4 py-2 rounded hover:bg-opacity-80 transition-colors flex items-center"
            >
              <Plus size={18} className="mr-2" /> Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBoardModal;