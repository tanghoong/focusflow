import React from 'react';
import { List, Layout } from 'lucide-react';

interface Template {
  name: string;
  type: string;
  description: string;
  lists: string[];
}

interface TemplateListProps {
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
}

const TemplateList: React.FC<TemplateListProps> = ({ templates, onSelectTemplate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template, index) => (
        <div key={index} className="bg-solarized-base02 p-4 rounded-lg transition-colors hover:bg-solarized-base01">
          <h3 className="text-lg font-semibold text-solarized-base1 mb-2">{template.name}</h3>
          <span className="text-xs text-solarized-base0 bg-solarized-base01 px-2 py-1 rounded-full mb-2 inline-block">
            {template.type}
          </span>
          <p className="text-sm text-solarized-base0 mb-4">{template.description}</p>
          <ul className="text-sm text-solarized-base0 mb-4">
            {template.lists.map((list, listIndex) => (
              <li key={listIndex} className="flex items-center">
                <List size={14} className="mr-2" /> {list}
              </li>
            ))}
          </ul>
          <button
            onClick={() => onSelectTemplate(template)}
            className="bg-solarized-green text-solarized-base3 px-3 py-1 rounded-full hover:bg-opacity-80 transition-colors flex items-center text-sm w-full justify-center"
          >
            <Layout size={14} className="mr-2" /> Use Template
          </button>
        </div>
      ))}
    </div>
  );
};

export default TemplateList;