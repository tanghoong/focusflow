import React, { useState, useMemo } from 'react';
import Accordion from '@/components/Accordion';
import TemplateList from '@/components/TemplateList';
import { Search } from 'lucide-react';

interface TemplateSectionProps {
  expandedSection: string | null;
  onToggleSection: (section: string) => void;
  boardTemplates: Array<{
    name: string;
    type: string;
    description: string;
    lists: string[];
  }>;
  onSelectTemplate: (template: any) => void;
}

const TemplateSection: React.FC<TemplateSectionProps> = ({
  expandedSection,
  onToggleSection,
  boardTemplates,
  onSelectTemplate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('all');

  const filteredTemplates = useMemo(() => {
    return boardTemplates.filter(template => 
      (activeTag === 'all' || template.type === activeTag) &&
      (template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       template.type.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, activeTag, boardTemplates]);

  const tags = ['all', ...Array.from(new Set(boardTemplates.map(template => template.type)))];

  return (
    <Accordion 
      title="Board Templates"
      isExpanded={expandedSection === 'templates'}
      onToggle={() => onToggleSection('templates')}
    >
      <div className="p-4">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search templates..."
            className="w-full px-4 py-2 border rounded-md pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map(tag => (
            <button
              key={tag}
              className={`px-3 py-1 rounded-full text-sm ${
                activeTag === tag ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <TemplateList
          templates={filteredTemplates}
          onSelectTemplate={onSelectTemplate}
        />
      </div>
    </Accordion>
  );
};

export default TemplateSection;