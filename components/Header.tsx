import React from 'react';
import { MagnifyingGlassIcon, BellIcon } from './icons';

interface HeaderProps {
  title: string;
  onUploadClick: () => void;
  onGenerateReadmeClick?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  unreadNotifications: number;
  onToggleNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onUploadClick, onGenerateReadmeClick, searchQuery, onSearchChange, unreadNotifications, onToggleNotifications }) => {
  return (
    <header className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 shrink-0 gap-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white truncate">{title}</h1>
      
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-lg">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </span>
            <input
              type="search"
              placeholder="Search all files..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {onGenerateReadmeClick && (
          <button
            onClick={onGenerateReadmeClick}
            className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors"
          >
            Generate README
          </button>
        )}
        <button
          onClick={onUploadClick}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors"
        >
          Upload File
        </button>
        <div className="relative">
          <button
            onClick={onToggleNotifications}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors"
            aria-label="Notifications"
          >
            <BellIcon className="w-6 h-6" />
            {unreadNotifications > 0 && (
              <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center transform -translate-y-1/2 translate-x-1/2">
                {unreadNotifications}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};