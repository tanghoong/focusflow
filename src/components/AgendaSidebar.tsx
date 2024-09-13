import React from 'react';
import { X, Calendar, Clock, CheckSquare } from 'lucide-react';

interface AgendaSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AgendaSidebar: React.FC<AgendaSidebarProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 mt-16 right-0 w-96 bg-solarized-base02 shadow-lg z-10 transform transition-all duration-300 ease-in-out">
      <div className="flex flex-col h-full p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-solarized-base1">Agenda</h2>
          <button
            onClick={onClose}
            className="text-solarized-base1 hover:text-solarized-base0 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto flex-grow">
          <AgendaSection
            title="Today's Schedule"
            icon={<Calendar size={16} />}
            color="text-solarized-blue"
            items={[
              { time: '9:00 AM', description: 'Team Meeting' },
              { time: '11:00 AM', description: 'Client Call' },
              { time: '2:00 PM', description: 'Project Review' },
            ]}
          />

          <AgendaSection
            title="Upcoming Deadlines"
            icon={<Clock size={16} />}
            color="text-solarized-cyan"
            items={[
              { time: '2 days', description: 'Project A' },
              { time: 'Tomorrow', description: 'Task B' },
              { time: 'Next week', description: 'Presentation' },
            ]}
          />

          <AgendaSection
            title="Quick Tasks"
            icon={<CheckSquare size={16} />}
            color="text-solarized-green"
            items={[
              { description: 'Send follow-up email' },
              { description: 'Prepare meeting notes' },
              { description: 'Update project timeline' },
            ]}
            isCheckList
          />
        </div>
      </div>
    </div>
  );
};

interface AgendaSectionProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  items: Array<{ time?: string; description: string }>;
  isCheckList?: boolean;
}

const AgendaSection: React.FC<AgendaSectionProps> = ({ title, icon, color, items, isCheckList }) => (
  <section>
    <h3 className={`text-sm font-semibold ${color} mb-2 flex items-center`}>
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
    <ul className="space-y-1 text-sm text-solarized-base1">
      {items.map((item, index) => (
        <li key={index} className="flex items-center">
          {isCheckList ? (
            <input type="checkbox" className="mr-2 form-checkbox h-3 w-3 text-solarized-blue rounded" />
          ) : (
            <span className="w-16 text-xs text-solarized-base0">{item.time}</span>
          )}
          <span className="truncate">{item.description}</span>
        </li>
      ))}
    </ul>
  </section>
);

export default AgendaSidebar;