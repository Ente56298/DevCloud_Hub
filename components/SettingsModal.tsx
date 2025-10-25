import React from 'react';

interface SettingsModalProps {
  onClose: () => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, theme, onThemeChange }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4 transform transition-all">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl leading-none">&times;</button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
            <div className="mt-2 flex rounded-md shadow-sm">
              <button
                onClick={() => onThemeChange('light')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-l-md border transition-colors ${
                  theme === 'light'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => onThemeChange('dark')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-r-md border-t border-b border-r transition-colors ${
                   theme === 'dark'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Dark
              </button>
            </div>
          </div>
          {/* Future settings can be added here */}
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