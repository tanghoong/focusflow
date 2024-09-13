'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useBoards } from '@/hooks/useData';
import { ChevronDown, User, Settings, Sun, Moon, Layout, RefreshCw } from 'lucide-react';
import { useTheme } from 'next-themes';
import ResetDatabaseButton from './ResetDatabaseButton';

const Navbar: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: boards } = useBoards();
  const [currentBoard, setCurrentBoard] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const boardId = pathname.split('/').pop();
    if (boardId && boardId !== 'board') {
      setCurrentBoard(boardId);
    } else {
      setCurrentBoard(null);
    }
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBoardSelect = (boardId: string) => {
    router.push(`/board/${boardId}`);
    setIsDropdownOpen(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="bg-solarized-base02 p-2">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-lg font-bold text-solarized-blue mr-2 flex items-center">
            <Layout size={20} className="mr-1" />
            FocusFlow
          </Link>
          {currentBoard && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-base font-semibold text-solarized-base1 flex items-center bg-solarized-base01 px-2 py-1 rounded-lg hover:bg-opacity-80 transition-colors"
              >
                {boards?.find(b => b.id === currentBoard)?.title || 'Select Board'}
                <ChevronDown size={16} className="ml-1" />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-solarized-base02 rounded shadow-lg z-10 w-48">
                  {boards?.map((board) => (
                    <button
                      key={board.id}
                      onClick={() => handleBoardSelect(board.id)}
                      className="block w-full text-left px-4 py-2 hover:bg-solarized-base01 text-solarized-base1 text-sm"
                    >
                      {board.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <ResetDatabaseButton />
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-solarized-base1 hover:text-solarized-base0 p-1 rounded-full hover:bg-solarized-base00"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="text-solarized-base1 hover:text-solarized-base0 p-1 rounded-full hover:bg-solarized-base00">
            <User size={16} />
          </button>
          <button className="text-solarized-base1 hover:text-solarized-base0 p-1 rounded-full hover:bg-solarized-base00">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;