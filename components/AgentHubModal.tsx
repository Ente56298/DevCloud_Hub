import React from 'react';
import type { AgentProfile } from '../types';
import { CubeTransparentIcon } from './icons';

interface AgentHubModalProps {
  agents: AgentProfile[];
  onClose: () => void;
  onDeployAgent: (agentId: string, newStatus: 'active' | 'idle') => void;
}

const AgentCard: React.FC<{
  agent: AgentProfile;
  onDeploy: (id: string, newStatus: 'active' | 'idle') => void;
}> = ({ agent, onDeploy }) => {
    const { id, name, description, icon: Icon, status } = agent;
    const isActive = status === 'active';

    const handleToggle = () => {
        const newStatus = isActive ? 'idle' : 'active';
        onDeploy(id, newStatus);
    }
  
    return (
        <div className="bg-gray-100 dark:bg-gray-900/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col justify-between h-full transition-all hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300"/>
                        </div>
                        <h3 className="text-md font-semibold text-gray-900 dark:text-white">{name}</h3>
                    </div>
                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${isActive ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                        {isActive ? 'Active' : 'Idle'}
                    </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
            </div>
            <div className="flex justify-end items-center mt-auto pt-2">
                <button
                    onClick={handleToggle}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors w-full ${
                        isActive
                            ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900'
                            : 'bg-blue-600 text-white hover:bg-blue-500'
                    }`}
                >
                    {isActive ? 'Retire Agent' : 'Deploy Agent'}
                </button>
            </div>
        </div>
    );
};

export const AgentHubModal: React.FC<AgentHubModalProps> = ({ agents, onClose, onDeployAgent }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl m-4 transform transition-all flex flex-col" style={{height: '90vh'}}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <CubeTransparentIcon className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Agent Command Center</h2>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl leading-none">&times;</button>
          </div>
           <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Deploy, monitor, and manage specialized cognitive agents for your ecosystem.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {agents.map(agent => (
                    <AgentCard key={agent.id} agent={agent} onDeploy={onDeployAgent} />
                ))}
            </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800/50 rounded-b-lg flex justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};