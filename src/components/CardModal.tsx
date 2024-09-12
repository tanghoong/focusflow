import React, { useState } from 'react';
import { Task } from '@/types';
import { X } from 'lucide-react';

interface CardModalProps {
  card: Task;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
}

const CardModal: React.FC<CardModalProps> = ({ card, onClose, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(card.title);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...card, title });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-solarized-base03 p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-solarized-blue">Edit Card</h2>
          <button onClick={onClose} className="text-solarized-base1 hover:text-solarized-base0">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-solarized-base02 text-solarized-base0 px-3 py-2 rounded w-full mb-4"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => onDelete(card.id)}
              className="bg-solarized-red text-solarized-base3 px-4 py-2 rounded hover:bg-opacity-80 transition-colors"
            >
              Delete
            </button>
            <button
              type="submit"
              className="bg-solarized-blue text-solarized-base3 px-4 py-2 rounded hover:bg-opacity-80 transition-colors"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardModal;