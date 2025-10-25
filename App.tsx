import React, { useState, useEffect, useMemo } from 'react';
import { AutomationsModal } from './components/AutomationsModal';
import { AgentHubModal } from './components/AgentHubModal';
import type { FileItem, View, Service, Notification, AutomationLogEntry, Project, AgentProfile } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { NotificationsPanel } from './components/NotificationsPanel';
import { FileExplorer } from './components/FileExplorer';
import { FilePreviewModal } from './components/FilePreviewModal';
import { UploadModal } from './components/UploadModal';
import { GenerateReadmeModal } from './components/GenerateReadmeModal';
import { CodeEditorModal } from './components/CodeEditorModal';
import { ProjectAnalyzerModal } from './components/ProjectAnalyzerModal';
import { EcosystemAnalyzerModal } from './components/EcosystemAnalyzerModal';
import { GitHubModal } from './components/GitHubModal';
import { SyncModal } from './components/SyncModal';
import { SettingsModal } from './components/SettingsModal';
import { MOCK_FILES, SERVICES, PROJECTS, AGENT_PROFILES } from './constants';
import { DiskIcon, GitHubIcon } from './components/icons';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [files, setFiles] = useState<FileItem[]>(MOCK_FILES);
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [localDrives, setLocalDrives] = useState<Service[]>([]);
  const [agents, setAgents] = useState<AgentProfile[]>(AGENT_PROFILES);
  const [currentView, setCurrentView] = useState<View>({ type: 'service', id: 'all' });
  const [previewingFile, setPreviewingFile] = useState<FileItem | null>(null);
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isReadmeModalOpen, setReadmeModalOpen] = useState(false);
  const [isAnalyzerModalOpen, setAnalyzerModalOpen] = useState<Service | null>(null);
  const [isEcosystemAnalyzerModalOpen, setEcosystemAnalyzerModalOpen] = useState(false);
  const [isGitHubModalOpen, setGitHubModalOpen] = useState(false);
  const [isSyncModalOpen, setSyncModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isNotificationsPanelOpen, setNotificationsPanelOpen] = useState(false);
  const [isAutomationsModalOpen, setAutomationsModalOpen] = useState(false);
  const [isAgentHubOpen, setAgentHubOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [automationLogs, setAutomationLogs] = useState<AutomationLogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const addNotification = (message: string, type: Notification['type']) => {
    const newNotification: Notification = {
      id: new Date().getTime().toString(),
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };
  
  const addAutomationLog = (message: string, status: AutomationLogEntry['status']) => {
    const newLog: AutomationLogEntry = {
      id: new Date().getTime().toString(),
      message,
      status,
      timestamp: new Date().toISOString(),
    };
    setAutomationLogs(prev => [newLog, ...prev]);
  };

  const filteredFiles = useMemo(() => {
    let tempFiles = files;
    if (searchQuery) {
        return tempFiles.filter(file => file.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    switch(currentView.type) {
        case 'service':
            if (currentView.id === 'all') return tempFiles;
            return tempFiles.filter(file => file.service === currentView.id);
        case 'project':
            return tempFiles.filter(file => file.projectId === currentView.id);
        case 'local':
            return tempFiles.filter(file => file.service === currentView.id);
        default:
            return tempFiles;
    }
  }, [files, searchQuery, currentView]);

  const handleFileUpload = (newFile: Omit<FileItem, 'id'>) => {
    const fileToAdd: FileItem = {
      ...newFile,
      id: new Date().getTime().toString(),
    };
    setFiles(prev => [fileToAdd, ...prev]);
    addNotification(`File "${fileToAdd.name}" uploaded successfully.`, 'success');
  };

  const handleReadmeGenerated = (readmeContent: string, projectId: string) => {
    const existingReadme = files.find(f => f.projectId === projectId && f.name.toLowerCase() === 'readme.md');
    if (existingReadme) {
      setFiles(files.map(f => f.id === existingReadme.id ? { ...f, content: readmeContent, modified: new Date().toISOString().split('T')[0] } : f));
      addNotification(`README.md for project updated.`, 'success');
    } else {
      const newReadme: FileItem = {
        id: new Date().getTime().toString(),
        name: 'README.md',
        type: 'file',
        size: `${(readmeContent.length / 1024).toFixed(2)} KB`,
        modified: new Date().toISOString().split('T')[0],
        service: 'gdrive',
        projectId: projectId,
        content: readmeContent,
      };
      setFiles(prev => [newReadme, ...prev]);
      addNotification(`README.md generated for project.`, 'success');
    }
  };

  const handleFileSave = (fileId: string, newContent: string) => {
    setFiles(files.map(f => f.id === fileId ? { ...f, content: newContent, size: `${(newContent.length / 1024).toFixed(2)} KB`, modified: new Date().toISOString().split('T')[0] } : f));
    addNotification(`File "${files.find(f=>f.id===fileId)?.name}" saved.`, 'success');
  };

  const handleAddLocalDrive = () => {
    const driveName = prompt("Enter a name for the new local drive (e.g., C_DRIVE):");
    if (driveName) {
      const newDrive: Service = {
        id: driveName.toLowerCase().replace(/\s/g, '_'),
        name: driveName,
        icon: DiskIcon,
      };
      setLocalDrives(prev => [...prev, newDrive]);
      addNotification(`Local drive "${driveName}" added.`, 'info');
    }
  };

  const handleDeployAgent = (agentId: string, newStatus: 'active' | 'idle') => {
      setAgents(prev => {
          const updatedAgents = prev.map(agent => (agent.id === agentId) ? { ...agent, status: newStatus } : agent);
          const toggledAgent = updatedAgents.find(a => a.id === agentId);
          if (toggledAgent) {
              const action = newStatus === 'active' ? 'Deployed' : 'Retired';
              addAutomationLog(`Agent ${action}: ${toggledAgent.name}`, newStatus === 'active' ? 'success' : 'info');
              addNotification(`${toggledAgent.name} has been ${action}.`, 'info');
          }
          return updatedAgents;
      });
  };
  
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const currentProject = currentView.type === 'project' ? projects.find(p => p.id === currentView.id) : undefined;
  
  const getHeaderTitle = () => {
    if (searchQuery) return `Searching for "${searchQuery}"`;
    switch(currentView.type) {
      case 'service':
        if (currentView.id === 'all') return 'All Files';
        return services.find(s => s.id === currentView.id)?.name || 'Files';
      case 'project':
        return projects.find(p => p.id === currentView.id)?.name || 'Project Files';
      case 'local':
        return localDrives.find(d => d.id === currentView.id)?.name || 'Local Files';
      default:
        return 'DevCloud Hub';
    }
  }

  return (
    <div className="flex h-screen font-sans">
      <Sidebar
        services={services}
        projects={projects}
        localDrives={localDrives}
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          setSearchQuery('');
        }}
        onAddLocalDrive={handleAddLocalDrive}
        onAnalyze={setAnalyzerModalOpen}
        onAnalyzeEcosystem={() => setEcosystemAnalyzerModalOpen(true)}
        onOpenGitHub={() => setGitHubModalOpen(true)}
        onOpenSync={() => setSyncModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenAutomations={() => setAutomationsModalOpen(true)}
        onOpenAgentHub={() => setAgentHubOpen(true)}
      />
      <main className="flex flex-col flex-1 w-full overflow-hidden bg-white dark:bg-gray-900 relative">
        <Header 
          title={getHeaderTitle()}
          onUploadClick={() => setUploadModalOpen(true)}
          onGenerateReadmeClick={currentProject ? () => setReadmeModalOpen(true) : undefined}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          unreadNotifications={unreadNotifications}
          onToggleNotifications={() => setNotificationsPanelOpen(!isNotificationsPanelOpen)}
        />
        {isNotificationsPanelOpen && (
          <NotificationsPanel
            notifications={notifications}
            onClose={() => setNotificationsPanelOpen(false)}
            onMarkAllAsRead={() => setNotifications(notifications.map(n => ({...n, read: true})))}
          />
        )}
        <FileExplorer files={filteredFiles} onFileClick={setPreviewingFile} isSearching={!!searchQuery} />
      </main>
      
      {previewingFile && (
        <FilePreviewModal 
          file={previewingFile} 
          onClose={() => setPreviewingFile(null)}
          onEdit={(file) => {
            setPreviewingFile(null);
            setEditingFile(file);
          }}
        />
      )}
      
      {editingFile && (
        <CodeEditorModal
          file={editingFile}
          onClose={() => setEditingFile(null)}
          onSave={handleFileSave}
        />
      )}
      
      {isUploadModalOpen && (
        <UploadModal
          onClose={() => setUploadModalOpen(false)}
          onUpload={handleFileUpload}
          services={services}
          projects={projects}
          localDrives={localDrives}
        />
      )}
      
      {isReadmeModalOpen && currentProject && (
        <GenerateReadmeModal
          project={currentProject}
          onClose={() => setReadmeModalOpen(false)}
          onReadmeGenerated={handleReadmeGenerated}
        />
      )}
      
      {isAnalyzerModalOpen && (
        <ProjectAnalyzerModal
          drive={isAnalyzerModalOpen}
          files={files.filter(f => f.service === isAnalyzerModalOpen.id)}
          onClose={() => setAnalyzerModalOpen(null)}
          onAnalysisComplete={(driveName) => {
            addNotification(`Analysis complete for ${driveName}.`, 'success');
          }}
        />
      )}

      {isEcosystemAnalyzerModalOpen && (
          <EcosystemAnalyzerModal onClose={() => setEcosystemAnalyzerModalOpen(false)} />
      )}
      
      {isGitHubModalOpen && (
        <GitHubModal 
          onClose={() => setGitHubModalOpen(false)}
          onClone={(repoUrl, localName) => {
            const newDrive: Service = {
              id: localName.toLowerCase().replace(/\s/g, '_'),
              name: localName,
              icon: GitHubIcon,
            };
            setLocalDrives(prev => [...prev, newDrive]);
            addNotification(`Cloned "${repoUrl}" to "${localName}".`, 'success');
            setGitHubModalOpen(false);
          }}
          localDrives={localDrives}
        />
      )}

      {isSyncModalOpen && (
        <SyncModal 
          onClose={() => setSyncModalOpen(false)}
          onSync={(sourceId, destId) => {
            const sourceName = [...services, ...localDrives].find(s => s.id === sourceId)?.name;
            const destName = [...services, ...localDrives].find(s => s.id === destId)?.name;
            addNotification(`Sync started from ${sourceName} to ${destName}.`, 'info');
            setSyncModalOpen(false);
          }}
          services={[...services, ...localDrives]}
        />
      )}
      
      {isSettingsModalOpen && (
        <SettingsModal 
          onClose={() => setSettingsModalOpen(false)}
          theme={theme}
          onThemeChange={setTheme}
        />
      )}

      {isAutomationsModalOpen && (
        <AutomationsModal
            onClose={() => setAutomationsModalOpen(false)}
            onAutomationToggled={(title, status) => {
              addAutomationLog(`Flow ${status === 'active' ? 'Activated' : 'Deactivated'}: ${title}`, status === 'active' ? 'success' : 'info');
              // Simulate a follow-up action
              if (status === 'active') {
                setTimeout(() => {
                    addAutomationLog(`[${title}] Monitoring for trigger event...`, 'info');
                }, 1500);
              }
            }}
            logs={automationLogs}
        />
      )}
      
      {isAgentHubOpen && (
        <AgentHubModal
          agents={agents}
          onClose={() => setAgentHubOpen(false)}
          onDeployAgent={handleDeployAgent}
        />
      )}
    </div>
  );
}

export default App;