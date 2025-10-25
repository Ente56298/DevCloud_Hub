import React from 'react';
import type { Service, Project, View } from '../types';
import { AllFilesIcon, MagnifyingGlassIcon, PlusIcon, CpuChipIcon, GitHubIcon, ArrowPathIcon, SettingsIcon, BoltIcon, CubeTransparentIcon } from './icons';

interface SidebarProps {
  services: Service[];
  projects: Project[];
  localDrives: Service[];
  currentView: View;
  onViewChange: (view: View) => void;
  onAnalyze: (drive: Service) => void;
  onAddLocalDrive: () => void;
  onAnalyzeEcosystem: () => void;
  onOpenGitHub: () => void;
  onOpenSync: () => void;
  onOpenSettings: () => void;
  onOpenAutomations: () => void;
  onOpenAgentHub: () => void;
}

const NavItem: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
  onClick: () => void;
  onAnalyze?: () => void;
}> = ({ icon: Icon, label, isActive, onClick, onAnalyze }) => (
  <div className="group relative">
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-2 text-sm text-left rounded-md transition-colors duration-150 ${
        isActive
          ? 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span>{label}</span>
    </button>
    {onAnalyze && (
      <button 
        onClick={onAnalyze}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-500 dark:text-gray-400 bg-gray-300 dark:bg-gray-700 opacity-0 group-hover:opacity-100 hover:bg-gray-400 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-white transition-opacity"
        aria-label={`Analyze ${label}`}
      >
        <MagnifyingGlassIcon className="w-4 h-4" />
      </button>
    )}
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({ services, projects, localDrives, currentView, onViewChange, onAnalyze, onAddLocalDrive, onAnalyzeEcosystem, onOpenGitHub, onOpenSync, onOpenSettings, onOpenAutomations, onOpenAgentHub }) => {
  return (
    <aside className="w-64 bg-gray-200 dark:bg-gray-800 p-4 shrink-0 flex flex-col space-y-6">
      <div className="text-2xl font-bold text-gray-900 dark:text-white px-2">DevCloud Hub</div>
      <nav className="flex-1 space-y-4">
        <div>
          <NavItem
            label="All Files"
            icon={AllFilesIcon}
            isActive={currentView.type === 'service' && currentView.id === 'all'}
            onClick={() => onViewChange({ type: 'service', id: 'all' })}
          />
        </div>
        <div>
          <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cloud Services</h3>
          <div className="space-y-1">
            {services.map(service => (
              <NavItem
                key={service.id}
                label={service.name}
                icon={service.icon}
                isActive={currentView.type === 'service' && currentView.id === service.id}
                onClick={() => onViewChange({ type: 'service', id: service.id })}
              />
            ))}
          </div>
        </div>
        <div>
          <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Projects</h3>
          <div className="space-y-1">
            {projects.map(project => (
              <NavItem
                key={project.id}
                label={project.name}
                icon={project.icon}
                isActive={currentView.type === 'project' && currentView.id === project.id}
                onClick={() => onViewChange({ type: 'project', id: project.id })}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Local Drives</h3>
            <button 
              onClick={onAddLocalDrive}
              className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white transition-colors mr-2"
              aria-label="Add Local Drive"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1">
            {localDrives.map(drive => (
              <NavItem
                key={drive.id}
                label={drive.name}
                icon={drive.icon}
                isActive={currentView.type === 'local' && currentView.id === drive.id}
                onClick={() => onViewChange({ type: 'local', id: drive.id })}
                onAnalyze={() => onAnalyze(drive)}
              />
            ))}
          </div>
        </div>
         <div>
          <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tools</h3>
          <div className="space-y-1">
            <NavItem
              label="Ecosystem Analyzer"
              icon={CpuChipIcon}
              isActive={false}
              onClick={onAnalyzeEcosystem}
            />
             <NavItem
              label="GitHub Integration"
              icon={GitHubIcon}
              isActive={false}
              onClick={onOpenGitHub}
            />
            <NavItem
              label="Synchronization"
              icon={ArrowPathIcon}
              isActive={false}
              onClick={onOpenSync}
            />
            <NavItem
              label="Integration Bus"
              icon={BoltIcon}
              isActive={false}
              onClick={onOpenAutomations}
            />
            <NavItem
              label="Cognitive Agents"
              icon={CubeTransparentIcon}
              isActive={false}
              onClick={onOpenAgentHub}
            />
          </div>
        </div>
      </nav>
      <div className="mt-auto">
         <NavItem
            label="Settings"
            icon={SettingsIcon}
            isActive={false}
            onClick={onOpenSettings}
          />
      </div>
    </aside>
  );
};