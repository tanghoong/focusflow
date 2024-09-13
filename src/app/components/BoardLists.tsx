import React from 'react';
import Accordion from '@/components/Accordion';
import BoardList from '@/components/BoardList';
import { Board } from '@/types';

interface BoardListsProps {
  isLoading: boolean;
  error: Error | null;
  pinnedBoards: Board[];
  allBoards: Board[];
  expandedSection: string | null;
  onToggleSection: (section: string) => void;
  onMoveBoard: (dragIndex: number, hoverIndex: number) => void;
  onEditBoard: (board: Board) => void;
  onViewBoard: (boardId: string) => void;
  onDeleteBoard: (boardId: string) => void;
  onPinBoard: (boardId: string) => void;
}

const BoardLists: React.FC<BoardListsProps> = ({
  isLoading,
  error,
  pinnedBoards,
  allBoards,
  expandedSection,
  onToggleSection,
  onMoveBoard,
  onEditBoard,
  onViewBoard,
  onDeleteBoard,
  onPinBoard
}) => {
  if (isLoading) return <p className="text-solarized-base1">Loading boards...</p>;
  if (error) return <p className="text-solarized-red">Error loading boards: {error instanceof Error ? error.message : 'Unknown error'}</p>;

  return (
    <>
      <Accordion
        title="Pinned Boards"
        isExpanded={expandedSection === 'pinned'}
        onToggle={() => onToggleSection('pinned')}
      >
        <BoardList
                  boards={pinnedBoards}
                  onMoveBoard={onMoveBoard}
                  onEditBoard={onEditBoard}
                  onViewBoard={onViewBoard}
                  onDeleteBoard={onDeleteBoard}
                  onPinBoard={onPinBoard} title={''}        />
      </Accordion>
      <Accordion
        title="All Boards"
        isExpanded={expandedSection === 'all'}
        onToggle={() => onToggleSection('all')}
      >
        <BoardList
                  boards={allBoards}
                  onMoveBoard={onMoveBoard}
                  onEditBoard={onEditBoard}
                  onViewBoard={onViewBoard}
                  onDeleteBoard={onDeleteBoard}
                  onPinBoard={onPinBoard} title={''}        />
      </Accordion>
    </>
  );
};

export default BoardLists;