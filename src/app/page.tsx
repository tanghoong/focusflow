'use client'

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useBoards, useUpdateBoard, useDeleteBoard, useAddBoard, useReorderBoards } from '@/hooks/useData';
import { Board } from '@/types';
import dynamic from 'next/dynamic';
import NewBoardModal from '@/components/NewBoardModal';
import BoardList from '@/components/BoardList';
import TemplateList from '@/components/TemplateList';
import Accordion from '@/components/Accordion';
import AgendaSidebar from '@/components/AgendaSidebar';
import { Plus, Search, Calendar, PanelRight, Trophy, Target, TrendingUp, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ResetDatabaseButton from '@/components/ResetDatabaseButton';
import Header from './components/Header';
import GetThingsDone from './components/GetThingsDone';
import RecentActivities from './components/RecentActivities';
import BoardLists from './components/BoardLists';
import TemplateSection from './components/TemplateSection';

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

const HomeContent: React.FC = () => {
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
  const [isAgendaOpen, setIsAgendaOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('isAgendaOpen');
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('isAgendaOpen', JSON.stringify(isAgendaOpen));
  }, [isAgendaOpen]);

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

  // Updated dummy data with more variation
  const gamifyData = {
    tasksCompleted: 42,
    streakDays: 7,
    productivityScore: 85,
    productivityTrend: [65, 78, 62, 85, 71, 90, 85], // More varied data for last 7 days
  };

  // Function to generate points for the line chart
  const generateChartPoints = (data: number[], width: number, height: number) => {
    const linePoints = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - (value / 100) * height;
      return `${x},${y}`;
    }).join(' ');

    const curvedLinePoints = `M${linePoints}`;

    const areaPoints = `${curvedLinePoints} L ${width},${height} L 0,${height} Z`;

    return { curvedLinePoints, areaPoints };
  };

  // Dummy data for Recent Activities
  const recentActivities = [
    { id: '1', type: 'task', description: 'Completed task "Update presentation"', timestamp: '2 hours ago' },
    { id: '2', type: 'board', description: 'Created new board "Q2 Planning"', timestamp: '1 day ago' },
    { id: '3', type: 'comment', description: 'Commented on "Budget Review"', timestamp: '3 days ago' },
  ];

  return (
    <div className={`transition-all duration-300 ease-in-out ${isAgendaOpen ? 'mr-96' : ''}`}>
      <div className="w-full max-w-6xl mx-auto px-4">
        <Header 
          onNewBoard={() => setIsNewBoardModalOpen(true)} 
          onToggleAgenda={() => setIsAgendaOpen(!isAgendaOpen)} 
        />
        <GetThingsDone gamifyData={gamifyData} />
        {/* <RecentActivities activities={recentActivities} /> */}
        <BoardLists 
          isLoading={isLoading}
          error={error}
          pinnedBoards={pinnedBoards}
          allBoards={allBoards}
          expandedSection={expandedSection}
          onToggleSection={setExpandedSection}
          onMoveBoard={handleMoveBoard}
          onEditBoard={handleEditBoard}
          onViewBoard={handleViewBoard}
          onDeleteBoard={handleDeleteBoard}
          onPinBoard={handlePinBoard}
        />
        <TemplateSection expandedSection={null} onToggleSection={function (section: string): void {
          throw new Error('Function not implemented.');
        } } boardTemplates={[]} onSelectTemplate={function (template: any): void {
          throw new Error('Function not implemented.');
        } }          // Add necessary props
        />
        <NewBoardModal isOpen={isNewBoardModalOpen} onClose={() => setIsNewBoardModalOpen(false)} />
        <AgendaSidebar isOpen={isAgendaOpen} onClose={() => setIsAgendaOpen(false)} />
      </div>
    </div>
  );
};

const DndProviderWithNoSSR = dynamic(
  () => import('react-dnd').then((mod) => mod.DndProvider),
  { ssr: false }
);

export default function Home() {
  return (
    <DndProviderWithNoSSR backend={HTML5Backend}>
      <HomeContent />
    </DndProviderWithNoSSR>
  );
}