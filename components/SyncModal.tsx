import React, { useState } from 'react';
import type { Service } from '../types';
import { ArrowPathIcon } from './icons';

interface SyncModalProps {
  onClose: () => void;
  onSync: (sourceId: string, destinationId: string) => void;
  services: Service[];
}

export const SyncModal: React.FC<SyncModalProps> = ({ onClose, onSync, services }) => {
  const [sourceId, setSourceId] = useState<string>(services[0]?.id || '');
  const [destinationId, setDestinationId] = useState<string>(services[1]?.id || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSync = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceId === destinationId) {
        setError('Source and Destination cannot be the same.');
        return;
    }
    setError('');
    setIsProcessing(true);
    setTimeout(() => {
        onSync(sourceId, destinationId);
        setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg m-4 transform transition-all">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <ArrowPathIcon className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Setup Synchronization</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
          </div>
        </div>
        
        <form onSubmit={handleSync}>
            <div className="p-6 space-y-6">
            <div>
                <label htmlFor="source" className="block text-sm font-medium text-gray-300">Source</label>
                <select
                id="source"
                value={sourceId}
                onChange={e => setSourceId(e.target.value)}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>

            <div>
                <label htmlFor="destination" className="block text-sm font-medium text-gray-300">Destination</label>
                <select
                id="destination"
                value={destinationId}
                onChange={e => setDestinationId(e.target.value)}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>
            
            {error && <p className="text-red-400 text-sm">{error}</p>}
            
            <p className="text-xs text-gray-400">
                This will perform a one-way sync, copying all top-level files from the source to the destination. Existing files in the destination will not be overwritten in this simulation.
            </p>
            </div>

            <div className="p-6 bg-gray-800 rounded-b-lg flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">
                    Cancel
                </button>
                <button type="submit" disabled={isProcessing || !sourceId || !destinationId} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center">
                    {isProcessing ? 'Syncing...' : 'Run Sync'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};