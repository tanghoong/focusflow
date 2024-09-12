'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useBoards } from '@/hooks/useData';
import { ChevronDown, User, Settings, Sun, Moon, Layout } from 'lucide-react';
import { useTheme } from 'next-themes';

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: boards } = useBoards();
  const [currentBoard, setCurrentBoard] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  return (
    <nav className="bg-solarized-base02 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-solarized-blue mr-2 flex items-center">
            <Layout className="mr-2" />
            FocusFlow
          </Link>
          {currentBoard && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-xl font-semibold text-solarized-base1 flex items-center bg-solarized-base01 px-3 py-1 rounded"
              >
                {boards?.find(b => b.id === currentBoard)?.title || 'Select Board'}
                <ChevronDown size={20} className="ml-2" />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-solarized-base02 rounded shadow-lg z-10 w-48">
                  {boards?.map((board) => (
                    <button
                      key={board.id}
                      onClick={() => handleBoardSelect(board.id)}
                      className="block w-full text-left px-4 py-2 hover:bg-solarized-base01 text-solarized-base1"
                    >
                      {board.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-solarized-base1 hover:text-solarized-base0"
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button className="text-solarized-base1 hover:text-solarized-base0">
            <User size={24} />
          </button>
          <button className="text-solarized-base1 hover:text-solarized-base0">
            <Settings size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;