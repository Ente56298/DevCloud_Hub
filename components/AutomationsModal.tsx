import React, { useState } from 'react';
import type { AutomationTemplate } from '../types';
import { BoltIcon, CpuChipIcon, TelegramIcon, NotionIcon, ZapierIcon, ArrowPathIcon } from './icons';

interface AutomationsModalProps {
  onClose: () => void;
  onAutomationActivated: (title: string) => void;
}

const INITIAL_AUTOMATIONS: AutomationTemplate[] = [
    {
        id: '1',
        title: 'Post Analysis Summary to Telegram',
        description: 'Automatically send a concise summary to a Telegram channel whenever an Ecosystem Analysis is completed.',
        source: { name: 'Analyzer', icon: CpuChipIcon },
        target: { name: 'Telegram', icon: TelegramIcon },
        status: 'inactive',
    },
    {
        id: '2',
        title: 'Archive README to Notion',
        description: 'When a new README.md is generated for a project, create a new page in a Notion database with its content.',
        source: { name: 'DevCloud Hub', icon: BoltIcon },
        target: { name: 'Notion', icon: NotionIcon },
        status: 'inactive',
    },
    {
        id: '3',
        title: 'Create Task from Duplicate File Alert',
        description: 'Use Zapier to create a new task in your favorite project management tool (e.g., Trello, Asana, Tollify) when a potential duplicate file is flagged.',
        source: { name: 'Analyzer', icon: CpuChipIcon },
        target: { name: 'Zapier', icon: ZapierIcon },
        status: 'inactive',
    },
    {
        id: '4',
        title: 'Trigger Website Rebuild on Content Push',
        description: 'When files are pushed to a specific GitHub repository, trigger a rebuild and deployment on a platform like 10Web or Vercel.',
        source: { name: 'GitHub', icon: ArrowPathIcon },
        target: { name: '10Web', icon: ZapierIcon },
        status: 'inactive',
    },
];


const AutomationCard: React.FC<{
  automation: AutomationTemplate;
  onToggle: (id: string, newStatus: 'active' | 'inactive') => void;
}> = ({ automation, onToggle }) => {
    const { id, title, description, source, target, status } = automation;
    const isActive = status === 'active';

    const handleToggle = () => {
        const newStatus = isActive ? 'inactive' : 'active';
        onToggle(id, newStatus);
    }
  
    return (
        <div className="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
            <div>
                <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                            <source.icon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                             <target.icon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
                        </div>
                    </div>
                    <h3 className="text-md font-semibold text-gray-900 dark:text-white">{title}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
            </div>
            <div className="flex justify-end items-center">
                {isActive && <span className="text-xs font-medium text-green-500 mr-3">Active</span>}
                <button
                    onClick={handleToggle}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        isActive
                            ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900'
                            : 'bg-blue-600 text-white hover:bg-blue-500'
                    }`}
                >
                    {isActive ? 'Deactivate' : 'Activate'}
                </button>
            </div>
        </div>
    );
};

export const AutomationsModal: React.FC<AutomationsModalProps> = ({ onClose, onAutomationActivated }) => {
  const [automations, setAutomations] = useState<AutomationTemplate[]>(INITIAL_AUTOMATIONS);

  const handleToggleAutomation = (id: string, newStatus: 'active' | 'inactive') => {
      setAutomations(prev => prev.map(auto => {
          if (auto.id === id) {
              if(newStatus === 'active') {
                  onAutomationActivated(auto.title);
              }
              return { ...auto, status: newStatus };
          }
          return auto;
      }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl m-4 transform transition-all flex flex-col" style={{height: '90vh'}}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <BoltIcon className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Automation Hub</h2>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl leading-none">&times;</button>
          </div>
           <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Activate workflows to connect your tools and automate repetitive tasks.</p>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {automations.map(auto => (
              <AutomationCard key={auto.id} automation={auto} onToggle={handleToggleAutomation} />
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg flex justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};