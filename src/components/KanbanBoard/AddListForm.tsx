import React, { useState, useCallback } from 'react';
import { Plus, List, Clock, Star, BarChart2, Filter, Users, Calendar, Pin } from 'lucide-react';

interface AddListFormProps {
  onAddList: (title: string) => void;
  totalLists: number;
  totalTasks: number;
}

const AddListForm: React.FC<AddListFormProps> = ({ onAddList, totalLists, totalTasks }) => {
  const [newListTitle, setNewListTitle] = useState('');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleSubmit = useCallback(() => {
    if (newListTitle.trim()) {
      onAddList(newListTitle.trim());
      setNewListTitle('');
    }
  }, [newListTitle, onAddList]);

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="bg-solarized-base02 p-3 rounded-lg w-72 flex-shrink-0 snap-center flex flex-col max-h-full shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-solarized-base1 flex items-center">
        <Pin size={16} className="mr-2 text-solarized-blue" />
        Board Summary
      </h3>
      <div className="mb-3 text-sm text-solarized-base1">
        <div className="flex justify-between mb-1">
          <span>Lists: {totalLists}</span>
          <span>Tasks: {totalTasks}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Members: 5</span>
          <span>Due Soon: 3</span>
        </div>
        <div className="flex justify-between">
          <span>Completed: 65%</span>
          <span>Updated: 2h ago</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button onClick={() => openModal('timer')} className="bg-solarized-cyan text-solarized-base3 px-2 py-1 rounded text-xs hover:bg-opacity-80 transition-colors flex items-center justify-center">
          <Clock size={12} className="mr-1" /> Timer
        </button>
        <button onClick={() => openModal('starred')} className="bg-solarized-yellow text-solarized-base3 px-2 py-1 rounded text-xs hover:bg-opacity-80 transition-colors flex items-center justify-center">
          <Star size={12} className="mr-1" /> Starred
        </button>
        <button onClick={() => openModal('analytics')} className="bg-solarized-green text-solarized-base3 px-2 py-1 rounded text-xs hover:bg-opacity-80 transition-colors flex items-center justify-center">
          <BarChart2 size={12} className="mr-1" /> Analytics
        </button>
        <button onClick={() => openModal('filter')} className="bg-solarized-violet text-solarized-base3 px-2 py-1 rounded text-xs hover:bg-opacity-80 transition-colors flex items-center justify-center">
          <Filter size={12} className="mr-1" /> Filter
        </button>
        <button onClick={() => openModal('members')} className="bg-solarized-blue text-solarized-base3 px-2 py-1 rounded text-xs hover:bg-opacity-80 transition-colors flex items-center justify-center">
          <Users size={12} className="mr-1" /> Members
        </button>
        <button onClick={() => openModal('calendar')} className="bg-solarized-magenta text-solarized-base3 px-2 py-1 rounded text-xs hover:bg-opacity-80 transition-colors flex items-center justify-center">
          <Calendar size={12} className="mr-1" /> Calendar
        </button>
      </div>
      <div>
        <input
          type="text"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Enter list title"
          className="bg-solarized-base01 text-solarized-base3 px-2 py-1 rounded w-full mb-2 text-sm focus:outline-none focus:ring-1 focus:ring-solarized-blue"
        />
        <button
          onClick={handleSubmit}
          className="bg-solarized-blue text-solarized-base3 px-2 py-1 rounded w-full text-sm hover:bg-opacity-80 transition-colors flex items-center justify-center"
        >
          <Plus size={14} className="mr-1" /> Add New List
        </button>
      </div>

      {activeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-solarized-base03 p-4 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-solarized-base1">{activeModal} Modal</h2>
            <p className="text-solarized-base1 mb-4">This is a placeholder for the {activeModal} functionality.</p>
            <button
              onClick={closeModal}
              className="bg-solarized-red text-solarized-base3 px-3 py-2 rounded text-sm hover:bg-opacity-80 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddListForm;