import React, { useState, useEffect } from 'react';
import { Task } from '@/types';
import { X, Plus, Check, Clock, Repeat } from 'lucide-react';

interface CardDetailModalProps {
  card?: Task;
  listId?: string;
  boardId?: string;
  onClose: () => void;
  onSubmit?: (task: Task) => void;
  onUpdate?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  listId,
  boardId,
  onClose,
  onSubmit,
  onUpdate,
  onDelete,
}) => {
  const [title, setTitle] = useState(card?.title || '');
  const [description, setDescription] = useState(card?.description || '');
  const [isRepeated, setIsRepeated] = useState(card?.isRepeated || false);
  const [isCompleted, setIsCompleted] = useState(card?.isCompleted || false);
  const [pomodoroCount, setPomodoroCount] = useState(card?.pomodoroCount || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTask: Task = {
      id: card?.id || `task-${Date.now()}`,
      title,
      description,
      listId: card?.listId || listId!,
      boardId: card?.boardId || boardId!,
      order: card?.order || 0,
      isRepeated,
      isCompleted,
      pomodoroCount,
    };
    if (card) {
      onUpdate?.(updatedTask);
    } else {
      onSubmit?.(updatedTask);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-solarized-base03 p-6 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-solarized-blue">{card ? 'Edit Card' : 'New Card'}</h2>
          <button onClick={onClose} className="text-solarized-base1 hover:text-solarized-base0">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Card title"
            className="bg-solarized-base02 text-solarized-base0 px-3 py-2 rounded w-full mb-4"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Card description"
            className="bg-solarized-base02 text-solarized-base0 px-3 py-2 rounded w-full mb-4 h-32 resize-none"
          />
          <div className="flex items-center space-x-4 mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isRepeated}
                onChange={(e) => setIsRepeated(e.target.checked)}
                className="mr-2"
              />
              <Repeat size={16} className="mr-1" />
              Repeated
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={(e) => setIsCompleted(e.target.checked)}
                className="mr-2"
              />
              <Check size={16} className="mr-1" />
              Completed
            </label>
          </div>
          <div className="flex items-center mb-4">
            <Clock size={16} className="mr-2" />
            <span className="mr-2">Pomodoro Count:</span>
            <input
              type="number"
              value={pomodoroCount}
              onChange={(e) => setPomodoroCount(parseInt(e.target.value) || 0)}
              min="0"
              className="bg-solarized-base02 text-solarized-base0 px-2 py-1 rounded w-16"
            />
          </div>
          <div className="flex justify-end space-x-2">
            {card && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(card.id)}
                className="bg-solarized-red text-solarized-base3 px-4 py-2 rounded hover:bg-opacity-80 transition-colors"
              >
                Delete
              </button>
            )}
            <button
              type="submit"
              className="bg-solarized-blue text-solarized-base3 px-4 py-2 rounded hover:bg-opacity-80 transition-colors"
            >
              {card ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardDetailModal;