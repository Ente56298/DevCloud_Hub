import React, { useState } from 'react';
import type { Service } from '../types';
import { GitHubIcon } from './icons';

interface GitHubModalProps {
  onClose: () => void;
  onClone: (repoUrl: string, localName: string) => void;
  localDrives: Service[];
}

export const GitHubModal: React.FC<GitHubModalProps> = ({ onClose, onClone, localDrives }) => {
  const [activeTab, setActiveTab] = useState<'clone' | 'push'>('clone');
  const [repoUrl, setRepoUrl] = useState('');
  const [localName, setLocalName] = useState('');
  const [pushDrive, setPushDrive] = useState<string>(localDrives[0]?.id || '');
  const [commitMessage, setCommitMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl || !localName) return;
    setIsProcessing(true);
    setTimeout(() => {
        onClone(repoUrl, localName);
        setIsProcessing(false);
    }, 1500);
  };

  const handlePush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushDrive || !commitMessage) return;
    setIsProcessing(true);
    setTimeout(() => {
        alert(`Pushed changes from "${localDrives.find(d => d.id === pushDrive)?.name}" with commit message: "${commitMessage}"`);
        setIsProcessing(false);
        onClose();
    }, 1500);
  };

  const renderCloneTab = () => (
    <form onSubmit={handleClone} className="space-y-6">
      <div>
        <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-300">Repository URL</label>
        <input
          type="url"
          id="repoUrl"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white p-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://github.com/user/repo.git"
          required
        />
      </div>
      <div>
        <label htmlFor="localName" className="block text-sm font-medium text-gray-300">Local Directory Name</label>
        <input
          type="text"
          id="localName"
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white p-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="my-awesome-project"
          required
        />
      </div>
      <div className="flex justify-end pt-2">
        <button type="submit" disabled={isProcessing} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center">
          {isProcessing ? 'Cloning...' : 'Clone Repository'}
        </button>
      </div>
    </form>
  );

  const renderPushTab = () => (
    <form onSubmit={handlePush} className="space-y-6">
      <div>
        <label htmlFor="pushDrive" className="block text-sm font-medium text-gray-300">Local Repository</label>
        <select
          id="pushDrive"
          value={pushDrive}
          onChange={e => setPushDrive(e.target.value)}
          className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white p-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {localDrives.length === 0 && <option disabled>No local drives available</option>}
          {localDrives.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="commitMessage" className="block text-sm font-medium text-gray-300">Commit Message</label>
        <input
          type="text"
          id="commitMessage"
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white p-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="feat: add new feature"
          required
        />
      </div>
      <div className="flex justify-end pt-2">
        <button type="submit" disabled={isProcessing || localDrives.length === 0} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center">
          {isProcessing ? 'Pushing...' : 'Push to Repository'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg m-4 transform transition-all">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <GitHubIcon className="w-6 h-6" />
              <h2 className="text-xl font-semibold text-white">GitHub Integration</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
          </div>
        </div>
        
        <div className="p-6">
            <div className="border-b border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveTab('clone')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'clone' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                        Clone Repository
                    </button>
                    <button onClick={() => setActiveTab('push')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'push' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                        Push to Repository
                    </button>
                </nav>
            </div>
            {activeTab === 'clone' ? renderCloneTab() : renderPushTab()}
        </div>

        <div className="p-6 bg-gray-800 rounded-b-lg flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">
                Close
            </button>
        </div>
      </div>
    </div>
  );
};