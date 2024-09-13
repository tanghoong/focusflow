import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, isExpanded, onToggle }) => {
  return (
    <div className="mb-4">
      <button
        className="flex justify-between items-center w-full p-4 bg-solarized-base02 rounded-lg text-left"
        onClick={onToggle}
      >
        <h2 className="text-2xl font-bold text-solarized-cyan">{title}</h2>
        {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </button>
      {isExpanded && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default Accordion;