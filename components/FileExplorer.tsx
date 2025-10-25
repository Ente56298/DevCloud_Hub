import React, { useState, useEffect } from 'react';
import type { FileItem } from '../types';
import { FileBrowser } from './FileBrowser';
import { ChevronLeftIcon } from './icons';

interface FileExplorerProps {
  files: FileItem[];
  onFileClick: (file: FileItem) => void;
  isSearching: boolean;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ files, onFileClick, isSearching }) => {
  const [folderHistory, setFolderHistory] = useState<FileItem[]>([]);

  // Reset folder history if the user starts a search
  useEffect(() => {
    if (isSearching) {
      setFolderHistory([]);
    }
  }, [isSearching]);

  const currentFolder = folderHistory.length > 0 ? folderHistory[folderHistory.length - 1] : null;
  
  const displayedFiles = isSearching ? files : files.filter(file => {
    if (currentFolder) {
      return file.parentId === currentFolder.id;
    }
    return !file.parentId;
  });

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      setFolderHistory(prev => [...prev, item]);
    } else {
      onFileClick(item);
    }
  };

  const handleBack = () => {
    setFolderHistory(prev => prev.slice(0, -1));
  };

  const handleBreadcrumbClick = (index: number) => {
    setFolderHistory(prev => prev.slice(0, index));
  };
  
  const breadcrumbs = [ { name: 'Files', index: -1 }, ...folderHistory.map((f, i) => ({name: f.name, index: i}))];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {!isSearching && (
        <div className="flex items-center p-5 py-3 border-b border-gray-700 shrink-0">
          {folderHistory.length > 0 && (
            <button
              onClick={handleBack}
              className="mr-3 p-1 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-300" />
            </button>
          )}
          <div className="text-gray-400 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={i}>
                {i > 0 && <span className="mx-2">/</span>}
                <button 
                  onClick={() => handleBreadcrumbClick(i)}
                  className={`hover:text-white ${i === breadcrumbs.length - 1 ? 'text-white font-medium' : ''}`}
                >
                  {crumb.name}
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
      <FileBrowser files={displayedFiles} onItemClick={handleItemClick} />
    </div>
  );
};