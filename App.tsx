import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FileExplorer } from './components/FileExplorer';
import { UploadModal } from './components/UploadModal';
import { GenerateReadmeModal } from './components/GenerateReadmeModal';
import { CodeEditorModal } from './components/CodeEditorModal';
import { ProjectAnalyzerModal } from './components/ProjectAnalyzerModal';
import { FilePreviewModal } from './components/FilePreviewModal';
import { EcosystemAnalyzerModal } from './components/EcosystemAnalyzerModal';
import { GitHubModal } from './components/GitHubModal';
import { SyncModal } from './components/SyncModal';
import { SettingsModal } from './components/SettingsModal';
import type { FileItem, View, Service } from './types';
import { SERVICES, PROJECTS, MOCK_FILES } from './constants';
import { FolderIcon } from './components/icons';

function App() {
  const [files, setFiles] = useState<FileItem[]>(MOCK_FILES);
  const [localDrives, setLocalDrives] = useState<Service[]>([]);
  const [currentView, setCurrentView] = useState<View>({ type: 'service', id: 'all' });
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isReadmeModalOpen, setReadmeModalOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [previewingFile, setPreviewingFile] = useState<FileItem | null>(null);
  const [analyzingDrive, setAnalyzingDrive] = useState<Service | null>(null);
  const [isEcosystemAnalyzerOpen, setEcosystemAnalyzerOpen] = useState(false);
  const [isGitHubModalOpen, setGitHubModalOpen] = useState(false);
  const [isSyncModalOpen, setSyncModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const currentProject = useMemo(() => {
    if (currentView.type === 'project') {
      return PROJECTS.find(p => p.id === currentView.id);
    }
    return undefined;
  }, [currentView]);

  const allServices = useMemo(() => [...SERVICES, ...localDrives], [localDrives]);

  const filteredFiles = useMemo(() => {
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      // When searching, we return a flat list of all matching files, regardless of directory.
      return files.filter(f =>
        f.name.toLowerCase().includes(lowercasedQuery) ||
        (f.content && f.type === 'file' && !f.content.startsWith('data:image') && f.content.toLowerCase().includes(lowercasedQuery))
      );
    }

    if (currentView.type === 'service' || currentView.type === 'local') {
      if (currentView.id === 'all') return files;
      return files.filter(f => f.service === currentView.id);
    }
    if (currentView.type === 'project') {
      return files.filter(f => f.projectId === currentView.id);
    }
    return [];
  }, [files, currentView, searchQuery]);
  
  const handleViewChange = (view: View) => {
    setSearchQuery('');
    setCurrentView(view);
  };
  
  const handleAddLocalDrive = () => {
    const driveName = prompt("Enter the name for the new local drive/folder:");
    if (driveName) {
      const newDriveId = `local-${Date.now()}`;
      const newDrive: Service = {
        id: newDriveId,
        name: driveName,
        icon: FolderIcon,
      };
      setLocalDrives(prev => [...prev, newDrive]);

      // Add some mock files for the new drive to simulate content
      const newMockFiles: FileItem[] = [
        { id: `${newDriveId}-1`, name: 'index.html', type: 'file', size: '3 KB', modified: new Date().toISOString().split('T')[0], service: newDriveId, content: `<h1>Welcome to ${driveName}</h1>` },
        { id: `${newDriveId}-2`, name: 'styles.css', type: 'file', size: '1 KB', modified: new Date().toISOString().split('T')[0], service: newDriveId, content: `body { font-family: sans-serif; }` },
        { id: `${newDriveId}-3`, name: 'app.js', type: 'file', size: '2 KB', modified: new Date().toISOString().split('T')[0], service: newDriveId, content: `console.log('Hello, ${driveName}!');` },
      ];
      setFiles(prev => [...prev, ...newMockFiles]);
      
      // Switch view to the newly added drive
      setCurrentView({ type: 'local', id: newDriveId });
    }
  };

  const handleUpload = (newFile: Omit<FileItem, 'id'>) => {
    const fileWithId: FileItem = {
      ...newFile,
      id: new Date().getTime().toString(),
    };
    setFiles(prev => [...prev, fileWithId]);
  };

  const handleReadmeGenerated = (readmeContent: string, projectId: string) => {
    const readmeFile: FileItem = {
      id: new Date().getTime().toString(),
      name: 'README.md',
      type: 'file',
      size: `${(readmeContent.length / 1024).toFixed(2)} KB`,
      modified: new Date().toISOString().split('T')[0],
      service: 'gdrive', // default to gdrive
      projectId: projectId,
      content: readmeContent,
    };

    // Replace existing README or add new one
    const existingReadmeIndex = files.findIndex(f => f.projectId === projectId && f.name === 'README.md');
    if (existingReadmeIndex > -1) {
      setFiles(prev => {
        const newFiles = [...prev];
        const oldFile = newFiles[existingReadmeIndex];
        newFiles[existingReadmeIndex] = { ...oldFile, ...readmeFile, id: oldFile.id };
        return newFiles;
      });
    } else {
      setFiles(prev => [...prev, readmeFile]);
    }
  };

  const handleFileSave = (fileId: string, newContent: string) => {
    setFiles(files.map(f => f.id === fileId ? { ...f, content: newContent, size: `${(newContent.length / 1024).toFixed(2)} KB`, modified: new Date().toISOString().split('T')[0] } : f));
  };
  
  const getHeaderTitle = () => {
    if (searchQuery) {
        return `Search Results`;
    }
    if (currentView.type === 'service' || currentView.type === 'local') {
      if (currentView.id === 'all') return 'All Files';
      const service = allServices.find(s => s.id === currentView.id);
      return service?.name || 'Files';
    }
    if (currentView.type === 'project') {
      const project = PROJECTS.find(p => p.id === currentView.id);
      return project?.name || 'Project';
    }
    return 'Files';
  }

  const handleCloneRepo = (repoUrl: string, localName: string) => {
    const newDriveId = `local-${Date.now()}`;
    const newDrive: Service = {
        id: newDriveId,
        name: localName,
        icon: FolderIcon,
    };
    setLocalDrives(prev => [...prev, newDrive]);

    const repoName = repoUrl.split('/').pop()?.replace('.git', '') || 'repository';

    const newRepoFiles: FileItem[] = [
        { id: `${newDriveId}-1`, name: 'README.md', type: 'file', size: '1 KB', modified: new Date().toISOString().split('T')[0], service: newDriveId, content: `# ${repoName}\n\nCloned from ${repoUrl}` },
        { id: `${newDriveId}-2`, name: 'package.json', type: 'file', size: '1 KB', modified: new Date().toISOString().split('T')[0], service: newDriveId, content: `{ "name": "${repoName}", "version": "1.0.0" }` },
        { id: `${newDriveId}-3`, name: '.gitignore', type: 'file', size: '1 KB', modified: new Date().toISOString().split('T')[0], service: newDriveId, content: `node_modules\n.env` },
        { id: `${newDriveId}-4`, name: 'src', type: 'folder', size: '0 KB', modified: new Date().toISOString().split('T')[0], service: newDriveId },
        { id: `${newDriveId}-5`, name: 'index.js', type: 'file', size: '1 KB', modified: new Date().toISOString().split('T')[0], service: newDriveId, parentId: `${newDriveId}-4`, content: `console.log('Hello, ${repoName}!');` },
    ];
    setFiles(prev => [...prev, ...newRepoFiles]);
    
    setCurrentView({ type: 'local', id: newDriveId });
    setGitHubModalOpen(false);
  };

  const handleSync = (sourceId: string, destinationId: string) => {
      const sourceFiles = files.filter(f => f.service === sourceId && !f.parentId); // Sync top-level only for simplicity
      
      const newSyncedFiles: FileItem[] = sourceFiles.map(file => ({
          ...file,
          id: `${destinationId}-${file.id}-${Date.now()}`,
          service: destinationId,
      }));

      setFiles(prev => [...prev, ...newSyncedFiles]);
      setSyncModalOpen(false);
      alert(`Sync complete! ${newSyncedFiles.length} files copied from ${allServices.find(s => s.id === sourceId)?.name} to ${allServices.find(s => s.id === destinationId)?.name}.`);
  };

  return (
    <div className="flex h-screen font-sans">
      <Sidebar
        services={SERVICES}
        projects={PROJECTS}
        localDrives={localDrives}
        currentView={currentView}
        onViewChange={handleViewChange}
        onAnalyze={setAnalyzingDrive}
        onAddLocalDrive={handleAddLocalDrive}
        onAnalyzeEcosystem={() => setEcosystemAnalyzerOpen(true)}
        onOpenGitHub={() => setGitHubModalOpen(true)}
        onOpenSync={() => setSyncModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
      />
      <main className="flex flex-col flex-1 w-full overflow-hidden bg-white dark:bg-gray-900">
        <Header 
          title={getHeaderTitle()}
          onUploadClick={() => setUploadModalOpen(true)}
          onGenerateReadmeClick={currentProject ? () => setReadmeModalOpen(true) : undefined}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <FileExplorer files={filteredFiles} onFileClick={setPreviewingFile} isSearching={!!searchQuery} />
      </main>
      
      {isUploadModalOpen && (
        <UploadModal
          onClose={() => setUploadModalOpen(false)}
          onUpload={handleUpload}
          services={SERVICES}
          projects={PROJECTS}
          localDrives={localDrives}
        />
      )}
      
      {isReadmeModalOpen && currentProject && (
        <GenerateReadmeModal
          onClose={() => setReadmeModalOpen(false)}
          onReadmeGenerated={handleReadmeGenerated}
          project={currentProject}
        />
      )}

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

      {analyzingDrive && (
        <ProjectAnalyzerModal
          drive={analyzingDrive}
          files={files.filter(f => f.service === analyzingDrive.id)}
          onClose={() => setAnalyzingDrive(null)}
        />
      )}

      {isEcosystemAnalyzerOpen && (
        <EcosystemAnalyzerModal
          onClose={() => setEcosystemAnalyzerOpen(false)}
        />
      )}

      {isGitHubModalOpen && (
        <GitHubModal
          onClose={() => setGitHubModalOpen(false)}
          onClone={handleCloneRepo}
          localDrives={localDrives}
        />
      )}

      {isSyncModalOpen && (
        <SyncModal
          onClose={() => setSyncModalOpen(false)}
          onSync={handleSync}
          services={allServices}
        />
      )}

      {isSettingsModalOpen && (
        <SettingsModal
          onClose={() => setSettingsModalOpen(false)}
          theme={theme}
          onThemeChange={setTheme}
        />
      )}
    </div>
  );
}

export default App;