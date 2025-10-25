
import React, { useState, useCallback } from 'react';
import { analyzeEcosystem } from '../services/geminiService';
import { CpuChipIcon } from './icons';

interface EcosystemAnalyzerModalProps {
  onClose: () => void;
}

export const EcosystemAnalyzerModal: React.FC<EcosystemAnalyzerModalProps> = ({ onClose }) => {
  const [directoryInput, setDirectoryInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!directoryInput.trim()) {
      setError('Please paste your directory listing into the text area.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await analyzeEcosystem(directoryInput);
      setAnalysisResult(result);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [directoryInput]);
  
  const renderAnalysis = (result: string) => {
    // A simple markdown-to-jsx renderer
    return result.split('\n').map((line, index) => {
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-semibold text-white mt-4 mb-2">{line.substring(4)}</h3>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-bold text-white mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
      }
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const isHeader = /\|.*:--.*\|/g.test(result.split('\n')[index + 1]);
        const cells = line.trim().slice(1, -1).split('|').map(c => c.trim());
        return (
            <tr key={index} className={isHeader ? 'border-b border-gray-600' : ''}>
                {cells.map((cell, i) => isHeader 
                    ? <th key={i} className="p-2 text-left">{cell}</th>
                    : <td key={i} className="p-2 align-top">{cell}</td>
                )}
            </tr>
        );
      }
      if (line.includes('|-') && line.includes('-|')) {
          return null; // Don't render markdown table dividers
      }
      if (line.trim() === '') {
          return <br key={index} />;
      }
      return <p key={index} className="my-1">{line}</p>;
    })
    .filter(Boolean)
    // Fix: Replaced JSX.Element with React.ReactElement and added explicit types to fix "Cannot find namespace 'JSX'" error.
    .reduce((acc: (React.ReactElement | React.ReactElement[])[], line: React.ReactElement) => {
        const last = acc[acc.length - 1];
        if (Array.isArray(last) && last[0].type === 'tr' && line.type === 'tr') {
            last.push(line);
        } else if (line.type === 'tr') {
            acc.push([<table key={acc.length} className="w-full my-4 text-sm table-auto border-collapse border border-gray-700"><tbody>{line}</tbody></table>]);
        }
        else {
            acc.push(line);
        }
        return acc;
    }, [] as (React.ReactElement | React.ReactElement[])[]);
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl m-4 transform transition-all flex flex-col" style={{height: '90vh'}}>
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <CpuChipIcon className="w-6 h-6 text-blue-400"/>
                <h2 className="text-xl font-semibold text-white">Ecosystem Analyzer</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
          </div>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Input Panel */}
          <div className="w-1/2 p-6 flex flex-col border-r border-gray-700">
            <label htmlFor="directoryInput" className="block text-sm font-medium text-gray-300 mb-2">
              Paste Ecosystem Data
            </label>
            <textarea
              id="directoryInput"
              value={directoryInput}
              onChange={(e) => setDirectoryInput(e.target.value)}
              className="w-full flex-1 bg-gray-900 text-white rounded-md p-3 border border-gray-600 focus:ring-blue-500 focus:border-blue-500 font-mono text-xs resize-none"
              placeholder="e.g., Paste directory listings, AI Studio app lists, or exported browser history (CSV/JSON) here..."
              disabled={isLoading}
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          {/* Output Panel */}
          <div className="w-1/2 p-6 overflow-y-auto">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full">
                  <svg className="animate-spin h-10 w-10 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-white">Analyzing ecosystem...</p>
              </div>
            )}
            {!isLoading && !analysisResult && (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <CpuChipIcon className="w-16 h-16 mb-4"/>
                    <h3 className="text-lg font-medium text-white">Analysis Report</h3>
                    <p className="mt-1 text-sm">The AI-generated report will appear here once the analysis is complete.</p>
                </div>
            )}
            {analysisResult && (
                <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                    {renderAnalysis(analysisResult)}
                </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 flex justify-end space-x-3 bg-gray-800 rounded-b-lg">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">
            {analysisResult ? 'Close' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Ecosystem'}
          </button>
        </div>
      </div>
    </div>
  );
};
