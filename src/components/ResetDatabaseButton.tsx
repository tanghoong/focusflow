'use client'

import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { resetDatabase } from '@/lib/db';
import { RefreshCw } from 'lucide-react';

const ResetDatabaseButton: React.FC = () => {
  const queryClient = useQueryClient();

  const handleResetDatabase = async () => {
    if (confirm('Are you sure you want to reset the database? This action cannot be undone.')) {
      await resetDatabase();
      queryClient.invalidateQueries();
    }
  };

  return (
    <button
      onClick={handleResetDatabase}
      className="bg-solarized-red text-solarized-base3 px-4 py-2 rounded hover:bg-opacity-80 transition-colors flex items-center"
    >
      <RefreshCw size={18} className="mr-2" /> Reset Database
    </button>
  );
};

export default ResetDatabaseButton;