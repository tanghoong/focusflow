import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Task } from '@/types';

interface TaskComponentProps {
  task: Task;
  index: number;
  listId: string;
  onMoveTask: (dragListId: string, dragIndex: number, hoverListId: string, hoverIndex: number) => void;
  setSelectedCard: React.Dispatch<React.SetStateAction<Task | null>>;
}

const TaskComponent: React.FC<TaskComponentProps> = ({ task, index, listId, onMoveTask, setSelectedCard }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { type: 'TASK', id: task.id, listId, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'TASK',
    hover: (item: { type: string; id: string; listId: string; index: number }, monitor) => {
      if (item.listId === listId && item.index === index) {
        return;
      }
      onMoveTask(item.listId, item.index, listId, index);
      item.listId = listId;
      item.index = index;
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`bg-solarized-base01 p-2 mb-2 rounded-lg shadow text-sm cursor-move ${
        isDragging ? 'opacity-50 border-2 border-solarized-blue' : ''
      }`}
      onDoubleClick={() => setSelectedCard(task)}
    >
      <div className="whitespace-pre-wrap break-words">{task.title}</div>
    </div>
  );
};

export default TaskComponent;