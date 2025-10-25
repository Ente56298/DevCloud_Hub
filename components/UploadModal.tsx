import React, { useState } from 'react';
import type { FileItem, Service, Project } from '../types';
import { UploadIcon } from './icons';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (newFile: Omit<FileItem, 'id'>) => void;
  services: Service[];
  projects: Project[];
  localDrives: Service[];
}

export const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload, services, projects, localDrives }) => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedService, setSelectedService] = useState<string>(services[0]?.id || '');
  const [selectedProject, setSelectedProject] = useState<string>('none');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedService) return;

    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      const newFile: Omit<FileItem, 'id'> = {
        name: file.name,
        type: 'file',
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        modified: new Date().toISOString().split('T')[0],
        service: selectedService,
        projectId: selectedProject !== 'none' ? selectedProject : undefined,
      };
      onUpload(newFile);
      setIsUploading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4 transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Upload a File</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-2">File</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <UploadIcon className="mx-auto h-12 w-12 text-gray-500" />
                  <div className="flex text-sm text-gray-400">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-blue-400 hover:text-blue-500 focus-within:outline-none">
                      <span>{file ? 'Change file' : 'Upload a file'}</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">{file ? '' : 'or drag and drop'}</p>
                  </div>
                  <p className="text-xs text-gray-500">{file ? file.name : 'PNG, JPG, PDF up to 10MB'}</p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-300">Destination</label>
              <select id="service" value={selectedService} onChange={e => setSelectedService(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-white">
                <optgroup label="Cloud Services">
                  {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </optgroup>
                <optgroup label="Local Drives">
                  {localDrives.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </optgroup>
              </select>
            </div>
            
            <div>
              <label htmlFor="project" className="block text-sm font-medium text-gray-300">Assign to Project (Optional)</label>
              <select id="project" value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-white">
                <option value="none">None</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancel</button>
              <button type="submit" disabled={!file || isUploading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center">
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : 'Upload'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};