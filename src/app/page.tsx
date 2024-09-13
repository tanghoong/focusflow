'use client'

import React, { useState, useCallback, useMemo } from 'react';
import { useBoards, useUpdateBoard, useDeleteBoard, useAddBoard, useReorderBoards } from '@/hooks/useData';
import { Board } from '@/types';
import NewBoardModal from '@/components/NewBoardModal';
import BoardList from '@/components/BoardList';
import TemplateList from '@/components/TemplateList';
import Accordion from '@/components/Accordion';
import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const boardTemplates = [
  {
    name: 'Business Overview',
    type: 'business',
    description: 'A comprehensive snapshot of your company\'s mission, vision, values, history, and key personnel.',
    lists: ['Company Profile', 'Mission & Vision', 'Key Personnel', 'Products/Services', 'History', 'Action Items']
  },
  {
    name: 'OKR Template',
    type: 'management',
    description: 'Set and track measurable goals using the Objectives and Key Results (OKR) framework.',
    lists: ['Objectives', 'Key Results', 'Initiatives', 'Metrics', 'Reviews']
  },
  {
    name: 'Team Goal Setting',
    type: 'management',
    description: 'Centralized space for setting, tracking, and reviewing team goals using SMART criteria.',
    lists: ['Specific', 'Measurable', 'Achievable', 'Relevant', 'Time-bound', 'Progress']
  },
  {
    name: 'Business Plan',
    type: 'business',
    description: 'Detailed plan outlining business goals, strategies, market analysis, and financial projections.',
    lists: ['Executive Summary', 'Market Analysis', 'Competitive Analysis', 'Marketing Strategy', 'Financial Projections', 'Action Items']
  },
  {
    name: 'Weekly Meeting',
    type: 'management',
    description: 'Structured template for organizing and conducting effective weekly team meetings.',
    lists: ['Agenda', 'Previous Action Items', 'Updates', 'Decisions', 'New Action Items', 'Parking Lot']
  },
  {
    name: 'Grant Tracking',
    type: 'business',
    description: 'System for tracking grant applications, deadlines, statuses, and outcomes.',
    lists: ['Prospective Grants', 'In Progress', 'Submitted', 'Approved', 'Rejected', 'Reporting']
  },
  {
    name: 'Design Project',
    type: 'design',
    description: 'Comprehensive template for managing design projects from concept to delivery.',
    lists: ['Project Brief', 'Research', 'Ideation', 'Design', 'Feedback', 'Revisions', 'Delivery']
  },
  {
    name: 'Game Design',
    type: 'design',
    description: 'Framework for game design projects, covering all aspects from concept to playtesting.',
    lists: ['Concept', 'Mechanics', 'Story', 'Characters', 'Levels', 'Art', 'Sound', 'Playtesting']
  },
  {
    name: 'Web Design & Development',
    type: 'design',
    description: 'Comprehensive template for web design and development projects.',
    lists: ['Requirements', 'Wireframes', 'Design', 'Development', 'Testing', 'Content', 'Launch', 'Maintenance']
  },
  {
    name: 'Teaching Weekly Planning',
    type: 'education',
    description: 'Template for weekly teaching plans to organize lessons and activities.',
    lists: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Resources', 'Notes']
  },
  {
    name: 'Academic Research',
    type: 'education',
    description: 'Framework for organizing academic research projects and literature reviews.',
    lists: ['Research Questions', 'Literature Review', 'Methodology', 'Data Collection', 'Analysis', 'Writing', 'Review']
  },
  {
    name: 'Engineering Project',
    type: 'engineering',
    description: 'Comprehensive template for managing engineering projects from conception to completion.',
    lists: ['Requirements', 'Design', 'Implementation', 'Testing', 'Documentation', 'Review', 'Deployment']
  },
  {
    name: 'Agile Sprint Planning',
    type: 'engineering',
    description: 'Template for planning and managing Agile sprints in software development.',
    lists: ['Backlog', 'To Do', 'In Progress', 'Testing', 'Done', 'Sprint Review']
  },
  {
    name: 'Product Development',
    type: 'engineering',
    description: 'Framework for product development in engineering, from ideation to production.',
    lists: ['Ideation', 'Research', 'Design', 'Prototyping', 'Testing', 'Production', 'Launch']
  },
  {
    name: 'Short Story Kanban',
    type: 'writer',
    description: 'A template for managing the creation process of short stories from ideation to submission.',
    lists: ['Ideas', 'Planning', 'Drafting', 'Editing', 'Polishing', 'Submission']
  },
  {
    name: 'Long Story (Novel/Non-Fiction Book) Kanban',
    type: 'writer',
    description: 'A comprehensive template for managing long-form writing projects, including novels and non-fiction books.',
    lists: ['Ideation', 'Research', 'Planning', 'Drafting', 'Revising', 'Editing', 'Polishing', 'Publishing Preparation', 'Marketing and Promotion']
  }
];

export default function Home() {
  const router = useRouter();
  const { data: boards, isLoading, error } = useBoards();
  const updateBoard = useUpdateBoard();
  const deleteBoard = useDeleteBoard();
  const addBoard = useAddBoard();
  const reorderBoards = useReorderBoards();
  const [isNewBoardModalOpen, setIsNewBoardModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof boardTemplates[0] | null>(null);
  const [newBoardName, setNewBoardName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('all');
  const [expandedSection, setExpandedSection] = useState<string | null>('pinned');

  const handleEditBoard = useCallback((board: Board) => {
    // Implement edit functionality
  }, []);

  const handleViewBoard = useCallback((boardId: string) => {
    router.push(`/board/${boardId}`);
  }, [router]);

  const handleDeleteBoard = useCallback((boardId: string) => {
    if (confirm('Are you sure you want to delete this board?')) {
      deleteBoard.mutate(boardId);
    }
  }, [deleteBoard]);

  const handlePinBoard = useCallback((boardId: string) => {
    const board = boards?.find(b => b.id === boardId);
    if (board) {
      updateBoard.mutate({ ...board, isPinned: !board.isPinned });
    }
  }, [boards, updateBoard]);

  const handleCreateTemplateBoard = useCallback(() => {
    if (selectedTemplate && newBoardName.trim()) {
      const newBoard: Board = {
        id: `board-${Date.now()}`,
        title: newBoardName.trim(),
        type: selectedTemplate.type,
        lists: selectedTemplate.lists,
      };
      addBoard.mutate(newBoard, {
        onSuccess: (boardId) => {
          router.push(`/board/${boardId}`);
        },
      });
      setSelectedTemplate(null);
      setNewBoardName('');
    }
  }, [selectedTemplate, newBoardName, addBoard, router]);

  const handleMoveBoard = useCallback((dragIndex: number, hoverIndex: number) => {
    const newBoards = Array.from(boards || []);
    const [reorderedItem] = newBoards.splice(dragIndex, 1);
    newBoards.splice(hoverIndex, 0, reorderedItem);
    reorderBoards.mutate(newBoards);
  }, [boards, reorderBoards]);

  const pinnedBoards = useMemo(() => boards?.filter(board => board.isPinned) || [], [boards]);
  const allBoards = useMemo(() => boards || [], [boards]);

  const filteredTemplates = useMemo(() => {
    return boardTemplates.filter(template => 
      (activeTag === 'all' || template.type === activeTag) &&
      (template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       template.type.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, activeTag]);

  const tags = ['all', ...Array.from(new Set(boardTemplates.map(template => template.type)))];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-solarized-cyan">Welcome, Charlie</h1>
          <button
            onClick={() => setIsNewBoardModalOpen(true)}
            className="bg-solarized-blue text-solarized-base3 px-4 py-2 rounded-full hover:bg-opacity-80 transition-colors flex items-center text-sm"
          >
            <Plus size={18} className="mr-2" /> New Board
          </button>
        </div>
        
        {/* Board Lists */}
        {isLoading ? (
          <p className="text-solarized-base1">Loading boards...</p>
        ) : error ? (
          <p className="text-solarized-red">Error loading boards: {error.message}</p>
        ) : (
          <>
            <Accordion 
              title="Pinned Boards" 
              isExpanded={expandedSection === 'pinned'}
              onToggle={() => setExpandedSection(expandedSection === 'pinned' ? null : 'pinned')}
            >
              {pinnedBoards.length > 0 ? (
                <BoardList
                  boards={pinnedBoards}
                  onMoveBoard={handleMoveBoard}
                  onEditBoard={handleEditBoard}
                  onViewBoard={handleViewBoard}
                  onDeleteBoard={handleDeleteBoard}
                  onPinBoard={handlePinBoard}
                />
              ) : (
                <p className="text-solarized-base1">No pinned boards yet. Pin a board to see it here!</p>
              )}
            </Accordion>
            <Accordion 
              title="All Boards"
              isExpanded={expandedSection === 'all'}
              onToggle={() => setExpandedSection(expandedSection === 'all' ? null : 'all')}
            >
              {allBoards.length > 0 ? (
                <BoardList
                  boards={allBoards}
                  onMoveBoard={handleMoveBoard}
                  onEditBoard={handleEditBoard}
                  onViewBoard={handleViewBoard}
                  onDeleteBoard={handleDeleteBoard}
                  onPinBoard={handlePinBoard}
                />
              ) : (
                <p className="text-solarized-base1">No boards yet. Create a new board to get started!</p>
              )}
            </Accordion>
          </>
        )}

        {/* Templates Section */}
        <Accordion 
          title="Board Templates"
          isExpanded={expandedSection === 'templates'}
          onToggle={() => setExpandedSection(expandedSection === 'templates' ? null : 'templates')}
        >
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates..."
                className="bg-solarized-base01 text-solarized-base3 px-4 py-2 rounded-full w-full pl-10"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-solarized-base1" />
            </div>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeTag === tag
                    ? 'bg-solarized-blue text-solarized-base3'
                    : 'bg-solarized-base01 text-solarized-base0 hover:bg-solarized-base00'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <TemplateList templates={filteredTemplates} onSelectTemplate={setSelectedTemplate} />
        </Accordion>

        <NewBoardModal isOpen={isNewBoardModalOpen} onClose={() => setIsNewBoardModalOpen(false)} />

        {/* Template selection modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-solarized-base03 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold text-solarized-blue mb-4">Create Board from Template</h2>
              <p className="text-solarized-base1 mb-4">Template: {selectedTemplate.name}</p>
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="Enter board name"
                className="bg-solarized-base01 text-solarized-base3 px-3 py-2 rounded-full w-full mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="bg-solarized-red text-solarized-base3 px-4 py-2 rounded-full hover:bg-opacity-80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTemplateBoard}
                  disabled={!newBoardName.trim()}
                  className="bg-solarized-blue text-solarized-base3 px-4 py-2 rounded-full hover:bg-opacity-80 transition-colors disabled:opacity-50"
                >
                  Create Board
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}