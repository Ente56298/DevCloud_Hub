import React from 'react';
import type { FileItem } from '../types';
import { FolderIcon, DocumentIcon } from './icons';

interface FileBrowserProps {
  files: FileItem[];
  onItemClick: (file: FileItem) => void;
}

const getFileIcon = (file: FileItem) => {
  if (file.type === 'folder') {
    return <FolderIcon className="w-6 h-6 text-blue-400" />;
  }
  // Could add more logic for different file types
  return <DocumentIcon className="w-6 h-6 text-gray-400" />;
}

export const FileBrowser: React.FC<FileBrowserProps> = ({ files, onItemClick }) => {
  return (
    <div className="flex-1 p-5 overflow-y-auto">
      <table className="w-full text-left">
        <thead className="border-b border-gray-700">
          <tr>
            <th className="p-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">Name</th>
            <th className="p-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">Size</th>
            <th className="p-3 text-sm font-semibold text-gray-400 uppercase tracking-wider">Date Modified</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr
              key={file.id}
              className="border-b border-gray-800 hover:bg-gray-800 cursor-pointer"
              onClick={() => onItemClick(file)}
            >
              <td className="p-3 whitespace-nowrap">
                <div className="flex items-center">
                  {getFileIcon(file)}
                  <span className="ml-4 font-medium text-white">{file.name}</span>
                </div>
              </td>
              <td className="p-3 whitespace-nowrap text-gray-400">{file.size}</td>
              <td className="p-3 whitespace-nowrap text-gray-400">{file.modified}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {files.length === 0 && (
        <div className="flex justify-center items-center h-full pt-16">
            <p className="text-gray-500">No files found.</p>
        </div>
      )}
    </div>
  );
};