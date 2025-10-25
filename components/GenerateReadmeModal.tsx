import React, { useState, useCallback } from 'react';
import { generateReadme } from '../services/geminiService';
import type { Project } from '../types';

interface GenerateReadmeModalProps {
  onClose: () => void;
  onReadmeGenerated: (readmeContent: string, projectId: string) => void;
  project: Project;
}

export const GenerateReadmeModal: React.FC<GenerateReadmeModalProps> = ({ onClose, onReadmeGenerated, project }) => {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!description) {
      setError('Please provide a project description.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    try {
      const content = await generateReadme(project.name, description);
      setGeneratedContent(content);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [description, project.name]);

  const handleSave = () => {
    if (generatedContent) {
      onReadmeGenerated(generatedContent, project.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl m-4 transform transition-all flex flex-col" style={{maxHeight: '90vh'}}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Generate README for {project.name}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl leading-none">&times;</button>
          </div>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {!generatedContent ? (
            <>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Description
                </label>
                <textarea
                  id="description"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md p-2 border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., A React application for managing cloud storage files for development projects."
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Generated README.md</h3>
              <pre className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-300 p-4 rounded-md whitespace-pre-wrap font-mono text-sm overflow-x-auto">
                <code>{generatedContent}</code>
              </pre>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3 bg-white dark:bg-gray-800 rounded-b-lg">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
          {!generatedContent ? (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-500"
            >
              Save as README.md
            </button>
          )}
        </div>
      </div>
    </div>
  );
};