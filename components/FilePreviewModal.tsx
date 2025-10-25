import React from 'react';
import type { FileItem } from '../types';
import { DocumentIcon } from './icons';

interface FilePreviewModalProps {
  file: FileItem;
  onClose: () => void;
  onEdit: (file: FileItem) => void;
}

const TEXT_FILE_EXTENSIONS = [
  'txt', 'md', 'json', 'html', 'css', 'js', 'jsx', 'ts', 'tsx', 'xml', 'yaml', 
  'yml', 'ini', 'cfg', 'log', 'sh', 'bat', 'py', 'rb', 'php', 'java', 'c', 
  'h', 'cpp', 'cs', 'go', 'rs', 'swift', 'sql', 'env'
];

const IMAGE_FILE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];

const isTextBasedFile = (fileName: string): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? TEXT_FILE_EXTENSIONS.includes(extension) : false;
};

const isImageFile = (fileName: string): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? IMAGE_FILE_EXTENSIONS.includes(extension) : false;
};


export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ file, onClose, onEdit }) => {
  const canPreviewText = isTextBasedFile(file.name) && file.content;
  const canPreviewImage = isImageFile(file.name) && file.content?.startsWith('data:image');
  
  const handleEditClick = () => {
      onEdit(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl m-4 transform transition-all flex flex-col" style={{maxHeight: '85vh'}}>
        <div className="p-4 border-b border-gray-700 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-semibold text-white truncate pr-4">Preview: {file.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none flex-shrink-0">&times;</button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto flex items-center justify-center">
          {canPreviewText ? (
            <pre className="w-full h-full bg-gray-900 text-gray-300 p-4 rounded-md whitespace-pre-wrap font-mono text-sm overflow-auto">
              <code>{file.content}</code>
            </pre>
          ) : canPreviewImage ? (
            <img src={file.content} alt={file.name} className="max-w-full max-h-full object-contain rounded-md" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
              <DocumentIcon className="w-24 h-24 text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{file.name}</h3>
              <p>Size: {file.size} | Modified: {file.modified}</p>
              <p className="mt-4">
                Preview is not available for this file type.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-end space-x-3 bg-gray-800 rounded-b-lg shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">
            Close
          </button>
          <button
            type="button"
            onClick={handleEditClick}
            disabled={!isTextBasedFile(file.name)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Open in Editor
          </button>
        </div>
      </div>
    </div>
  );
};
