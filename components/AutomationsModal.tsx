import React, { useState } from 'react';
import type { AutomationTemplate, AutomationLogEntry } from '../types';
import { BoltIcon, CpuChipIcon, TelegramIcon, NotionIcon, ZapierIcon, GitHubIcon, TerminalIcon, TenWebIcon, NerdIcon, TollifyIcon, ManusIcon } from './icons';

interface AutomationsModalProps {
  onClose: () => void;
  onAutomationToggled: (title: string, status: 'active' | 'inactive') => void;
  logs: AutomationLogEntry[];
}

const INITIAL_AUTOMATIONS: AutomationTemplate[] = [
    {
        id: '1',
        title: 'Post Analysis to Telegram',
        description: 'Automatically send a summary to a Telegram channel when an Ecosystem Analysis is completed.',
        source: { name: 'Analyzer', icon: CpuChipIcon },
        target: { name: 'Telegram', icon: TelegramIcon },
        status: 'inactive',
    },
    {
        id: '2',
        title: 'Archive Report to Notion',
        description: 'When a new README or analysis is generated, create a page in a Notion database with its content.',
        source: { name: 'DevCloud Hub', icon: BoltIcon },
        target: { name: 'Notion', icon: NotionIcon },
        status: 'inactive',
    },
    {
        id: '3',
        title: 'Create Task in Tollify',
        description: 'When the analyzer flags critical duplicates, automatically create a "Consolidate Files" task in Tollify.',
        source: { name: 'Analyzer', icon: CpuChipIcon },
        target: { name: 'Tollify', icon: TollifyIcon },
        status: 'inactive',
    },
    {
        id: '4',
        title: 'Trigger Web Publish via 10Web',
        description: 'When a final report is approved, trigger a new blog post publication via the 10Web API.',
        source: { name: 'DevCloud Hub', icon: BoltIcon },
        target: { name: '10Web', icon: TenWebIcon },
        status: 'inactive',
    },
    {
        id: '5',
        title: 'Orchestrate Archiving with Nerd AI',
        description: 'Use Nerd AI to run a complex workflow that identifies, versions, and archives old projects to a designated cold storage drive.',
        source: { name: 'Analyzer', icon: CpuChipIcon },
        target: { name: 'Nerd', icon: NerdIcon },
        status: 'inactive',
    },
    {
        id: '6',
        title: 'Connect Gestures via Manus',
        description: 'Enable gestural navigation in "El Núcleo Visualizer" by activating the Manus VR integration for immersive interaction.',
        source: { name: 'El Núcleo', icon: CpuChipIcon },
        target: { name: 'Manus', icon: ManusIcon },
        status: 'inactive',
    },
];

const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 5) return "just now";
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

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
        <div className="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col justify-between h-full">
            <div>
                <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center -space-x-2">
                        <div className="w-8 h-8 z-10 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                            <source.icon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                             <target.icon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
                        </div>
                    </div>
                    <h3 className="text-md font-semibold text-gray-900 dark:text-white">{title}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
            </div>
            <div className="flex justify-end items-center mt-auto pt-2">
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

export const AutomationsModal: React.FC<AutomationsModalProps> = ({ onClose, onAutomationToggled, logs }) => {
  const [automations, setAutomations] = useState<AutomationTemplate[]>(INITIAL_AUTOMATIONS);
  const [activeTab, setActiveTab] = useState<'templates' | 'active' | 'logs'>('templates');

  const handleToggleAutomation = (id: string, newStatus: 'active' | 'inactive') => {
      setAutomations(prev => {
        const updatedAutomations = prev.map(auto => (auto.id === id) ? { ...auto, status: newStatus } : auto);
        const toggledAutomation = updatedAutomations.find(a => a.id === id);
        if (toggledAutomation) {
          onAutomationToggled(toggledAutomation.title, newStatus);
        }
        return updatedAutomations;
      });
  };
  
  const activeAutomations = automations.filter(a => a.status === 'active');

  const TabButton: React.FC<{tabId: typeof activeTab; label: string; count: number}> = ({tabId, label, count}) => (
      <button 
        onClick={() => setActiveTab(tabId)}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tabId ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'}`}
      >
        {label} <span className="text-xs bg-gray-300 dark:bg-gray-600 rounded-full px-2 py-0.5">{count}</span>
      </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl m-4 transform transition-all flex flex-col" style={{height: '90vh'}}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <BoltIcon className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cognitive Integration Bus</h2>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl leading-none">&times;</button>
          </div>
           <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Orchestrate, monitor, and audit automated workflows across your digital ecosystem.</p>
        </div>
        
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
                <TabButton tabId="templates" label="Templates" count={automations.length} />
                <TabButton tabId="active" label="Active Flows" count={activeAutomations.length} />
                <TabButton tabId="logs" label="Activity Log" count={logs.length} />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'templates' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {automations.map(auto => (
                        <AutomationCard key={auto.id} automation={auto} onToggle={handleToggleAutomation} />
                    ))}
                </div>
            )}
            {activeTab === 'active' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeAutomations.length > 0 ? activeAutomations.map(auto => (
                        <AutomationCard key={auto.id} automation={auto} onToggle={handleToggleAutomation} />
                    )) : (
                        <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                            <BoltIcon className="w-12 h-12 mx-auto mb-2" />
                            <h3 className="text-lg font-medium">No Active Flows</h3>
                            <p className="text-sm">Activate an automation from the Templates tab to see it here.</p>
                        </div>
                    )}
                </div>
            )}
            {activeTab === 'logs' && (
                <div className="font-mono text-xs text-gray-700 dark:text-gray-300 space-y-2">
                    {logs.length > 0 ? logs.map(log => (
                        <div key={log.id} className="flex items-start">
                            <span className="text-gray-500 dark:text-gray-500 mr-3">{timeSince(log.timestamp)}</span>
                            <span className={`mr-2 font-bold ${log.status === 'success' ? 'text-green-500' : 'text-blue-500'}`}>
                                [{log.status.toUpperCase()}]
                            </span>
                            <span>{log.message}</span>
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400 font-sans">
                            <TerminalIcon className="w-12 h-12 mx-auto mb-2" />
                            <h3 className="text-lg font-medium">Activity Log is Empty</h3>
                            <p className="text-sm">Activate or deactivate a flow to see log entries here.</p>
                        </div>
                    )}
                </div>
            )}
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
