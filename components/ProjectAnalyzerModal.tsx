import React, { useState, useCallback } from 'react';
import { analyzeProject } from '../services/geminiService';
import type { Service, FileItem } from '../types';
import { MagnifyingGlassIcon } from './icons';

interface ProjectAnalyzerModalProps {
  onClose: () => void;
  drive: Service;
  files: FileItem[];
}

export const ProjectAnalyzerModal: React.FC<ProjectAnalyzerModalProps> = ({ onClose, drive, files }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (files.length === 0) {
      setError('This drive has no files to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const fileSummary = files.map(f => ({ name: f.name, type: f.type, size: f.size }));
      const result = await analyzeProject(fileSummary);
      setAnalysisResult(result);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [files]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl m-4 transform transition-all flex flex-col" style={{maxHeight: '90vh'}}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Project Analyzer: {drive.name}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl leading-none">&times;</button>
          </div>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          {!analysisResult && !isLoading && (
             <div className="text-center">
                <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Analyze Project Files</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Get an AI-powered summary of the project type, key files, and suggestions for next steps based on the files in this drive.
                </p>
                {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
             </div>
          )}
          
          {isLoading && (
             <div className="flex flex-col items-center justify-center h-full">
                <svg className="animate-spin h-10 w-10 text-gray-800 dark:text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-800 dark:text-white">Analyzing project files...</p>
             </div>
          )}

          {analysisResult && (
             <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Analysis Report</h3>
                <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 p-4 rounded-md whitespace-pre-wrap font-sans text-sm">
                   {analysisResult.split('\n').map((line, index) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                            return <p key={index} className="font-bold text-gray-900 dark:text-white mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>
                        }
                        return <p key={index}>{line}</p>
                   })}
                </div>
             </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3 bg-white dark:bg-gray-800 rounded-b-lg">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
            {analysisResult ? 'Close' : 'Cancel'}
          </button>
          {!analysisResult && (
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Project'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};