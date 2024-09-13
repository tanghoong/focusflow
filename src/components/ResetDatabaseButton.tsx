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
      className="text-solarized-base1 hover:text-solarized-red p-1 rounded-full hover:bg-solarized-base00"
    >
      <RefreshCw size={16} />
    </button>
  );
};

export default ResetDatabaseButton;