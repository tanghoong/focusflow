'use client'

import KanbanBoard from '@/components/KanbanBoard';

export default function BoardPage({ params }: { params: { id: string } }) {
  return <KanbanBoard boardId={params.id} />;
}