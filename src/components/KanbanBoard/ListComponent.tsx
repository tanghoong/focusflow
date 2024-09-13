import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { List, Task } from '@/types';
import { GripVertical, Plus, Edit2, Trash2 } from 'lucide-react';
import TaskComponent from './TaskComponent';

interface ListComponentProps {
  list: List;
  index: number;
  tasks: Task[];
  onMoveList: (dragIndex: number, hoverIndex: number) => void;
  onMoveTask: (dragListId: string, dragIndex: number, hoverListId: string, hoverIndex: number) => void;
  onOpenCardDetailModal: (listId: string) => void;
  setSelectedCard: React.Dispatch<React.SetStateAction<Task | null>>;
}

const ListComponent: React.FC<ListComponentProps> = ({
  list,
  index,
  tasks,
  onMoveList,
  onMoveTask,
  onOpenCardDetailModal,
  setSelectedCard
}) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'LIST',
    item: { type: 'LIST', id: list.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ['LIST', 'TASK'],
    hover: (item: { type: string; id: string; index: number; listId?: string }, monitor) => {
      if (item.type === 'LIST') {
        if (item.index === index) {
          return;
        }
        onMoveList(item.index, index);
        item.index = index;
      } else if (item.type === 'TASK' && item.listId !== list.id) {
        onMoveTask(item.listId!, item.index, list.id, tasks.length);
        item.index = tasks.length;
        item.listId = list.id;
      }
    },
  });

  return (
    <div
      ref={(node) => preview(drop(node))}
      className={`bg-solarized-base02 p-2 rounded-lg w-72 flex-shrink-0 snap-center flex flex-col max-h-full ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div
        ref={(node) => drag(node)}
        className="flex justify-between items-center mb-2 px-2 cursor-move"
      >
        <div className="flex items-center">
          <GripVertical size={16} className="text-solarized-base1 mr-2" />
          <h3 className="font-bold text-solarized-base1">{list.title}</h3>
        </div>
        <div className="flex space-x-1">
          <button onClick={() => onOpenCardDetailModal(list.id)} className="text-solarized-blue p-1 rounded hover:bg-solarized-base01">
            <Plus size={14} />
          </button>
          <button className="text-solarized-blue p-1 rounded hover:bg-solarized-base01">
            <Edit2 size={14} />
          </button>
          <button className="text-solarized-red p-1 rounded hover:bg-solarized-base01">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className="overflow-y-auto flex-grow custom-scrollbar pr-2 min-h-[50px]">
        {tasks.map((task, taskIndex) => (
          <TaskComponent
            key={task.id}
            task={task}
            index={taskIndex}
            listId={list.id}
            onMoveTask={onMoveTask}
            setSelectedCard={setSelectedCard}
          />
        ))}
      </div>
    </div>
  );
};

export default ListComponent;