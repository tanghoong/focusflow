import React from 'react';
import { Plus, PanelRight } from 'lucide-react';
import ResetDatabaseButton from '@/components/ResetDatabaseButton';

interface HeaderProps {
  onNewBoard: () => void;
  onToggleAgenda: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewBoard, onToggleAgenda }) => (
  <div className="flex justify-between items-center mb-8">
    <h1 className="text-3xl font-bold text-solarized-cyan">Welcome, Charlie</h1>
    <div className="flex items-center space-x-4">
      <ResetDatabaseButton />
      <button
        onClick={onNewBoard}
        className="bg-solarized-blue text-solarized-base3 hover:bg-opacity-80 transition-colors p-1 rounded-full"
      >
        <Plus size={16} />
      </button>
      <button
        onClick={onToggleAgenda}
        className="text-solarized-base1 hover:text-solarized-base0 p-2 rounded-full hover:bg-solarized-base02"
      >
        <PanelRight size={24} />
      </button>
    </div>
  </div>
);

export default Header;