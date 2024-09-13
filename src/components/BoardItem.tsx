import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Board } from '@/types';
import { Edit2, Eye, Trash2, Pin } from 'lucide-react';

interface BoardItemProps {
  board: Board;
  index: number;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (board: Board) => void;
  onView: (boardId: string) => void;
  onDelete: (boardId: string) => void;
  onPin: (boardId: string) => void;
}

const BoardItem: React.FC<BoardItemProps> = ({ board, index, onMove, onEdit, onView, onDelete, onPin }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'BOARD',
    item: { type: 'BOARD', id: board.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'BOARD',
    hover: (item: { type: string; id: string; index: number }, monitor) => {
      if (item.index === index) {
        return;
      }
      onMove(item.index, index);
      item.index = index;
    },
  });

  return (
    <div 
      ref={(node) => drag(drop(node))} 
      className={`bg-solarized-base02 p-4 rounded-lg transition-colors ${
        isDragging ? 'opacity-50 shadow-lg outline outline-2 outline-solarized-blue' : 'hover:bg-solarized-base01'
      }`}
      style={{ transform: isDragging ? 'rotate(3deg)' : 'none' }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-solarized-base1">{board.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onView(board.id)}
            className="text-solarized-blue hover:text-solarized-cyan transition-colors p-1 rounded-full hover:bg-solarized-base00"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => onEdit(board)}
            className="text-solarized-blue hover:text-solarized-cyan transition-colors p-1 rounded-full hover:bg-solarized-base00"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(board.id)}
            className="text-solarized-red hover:text-solarized-orange transition-colors p-1 rounded-full hover:bg-solarized-base00"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => onPin(board.id)}
            className={`transition-colors p-1 rounded-full hover:bg-solarized-base00 ${
              board.isPinned ? 'text-solarized-yellow' : 'text-solarized-base1'
            }`}
          >
            <Pin size={18} />
          </button>
        </div>
      </div>
      {board.type && (
        <span className="text-xs text-solarized-base0 bg-solarized-base01 px-2 py-1 rounded">
          {board.type}
        </span>
      )}
    </div>
  );
};

export default BoardItem;