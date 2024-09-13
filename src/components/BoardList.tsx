import React from 'react';
import { Board } from '@/types';
import BoardItem from './BoardItem';

interface BoardListProps {
  title: string;
  boards: Board[];
  onMoveBoard: (dragIndex: number, hoverIndex: number) => void;
  onEditBoard: (board: Board) => void;
  onViewBoard: (boardId: string) => void;
  onDeleteBoard: (boardId: string) => void;
  onPinBoard: (boardId: string) => void;
}

const BoardList: React.FC<BoardListProps> = ({ title, boards, onMoveBoard, onEditBoard, onViewBoard, onDeleteBoard, onPinBoard }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {boards.map((board, index) => (
        <BoardItem
          key={board.id}
          board={board}
          index={index}
          onMove={onMoveBoard}
          onEdit={onEditBoard}
          onView={onViewBoard}
          onDelete={onDeleteBoard}
          onPin={onPinBoard}
        />
      ))}
    </div>
  );
};

export default BoardList;