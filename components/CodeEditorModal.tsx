import React, { useState, useEffect, useRef } from 'react';
import type { FileItem, ChatMessage, Agent } from '../types';
import { getAiAssistance, AssistanceMode } from '../services/geminiService';
import { AI_AGENTS } from '../constants';
import { SparklesIcon, CodeBracketIcon, ArrowPathIcon, BeakerIcon, BugAntIcon, PaperAirplaneIcon } from './icons';

interface CodeEditorModalProps {
  file: FileItem;
  onClose: () => void;
  onSave: (fileId: string, newContent: string) => void;
}

const AiActionButton: React.FC<{ icon: React.ComponentType<{className?: string}>, label: string, onClick: () => void, disabled?: boolean }> = ({ icon: Icon, label, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);

const extractCode = (text: string): string | null => {
  const codeBlockRegex = /```(?:\w+\n)?([\s\S]+?)```/;
  const match = text.match(codeBlockRegex);
  return match ? match[1].trim() : null;
};

export const CodeEditorModal: React.FC<CodeEditorModalProps> = ({ file, onClose, onSave }) => {
  const [content, setContent] = useState(file.content || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const [selectedAgent, setSelectedAgent] = useState<Agent>(AI_AGENTS[0]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setContent(file.content || '');
    setChatHistory([{ author: 'ai', content: `Hello! I'm ${selectedAgent.name}, your AI assistant. How can I help you with ${file.name}?` }]);
  }, [file, selectedAgent]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave(file.id, content);
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  const handleAiRequest = async (prompt: string, mode: AssistanceMode) => {
    const userMessage: ChatMessage = { author: 'user', content: prompt };
    setChatHistory(prev => [...prev, userMessage]);
    setIsAiLoading(true);
    setUserInput('');
    
    try {
      const aiResponse = await getAiAssistance(content, prompt, mode);
      const aiMessage: ChatMessage = { author: 'ai', content: aiResponse };
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error: any) {
      const errorMessage: ChatMessage = { author: 'ai', content: `Sorry, I encountered an error: ${error.message}` };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() && !isAiLoading) {
      handleAiRequest(userInput, 'chat');
    }
  };

  const handleApplyCode = (codeToApply: string) => {
    setContent(codeToApply);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full h-full max-w-7xl transform transition-all flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Editing: {file.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-2xl leading-none">&times;</button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Panel */}
          <div className="flex-1 flex flex-col w-2/3">
            <div className="flex-1 p-1 overflow-hidden">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-300 p-4 rounded-md border-none focus:ring-0 font-mono resize-none"
                placeholder="File is empty or content cannot be displayed."
              />
            </div>
             {/* AI Actions Footer */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-2">
                <AiActionButton icon={CodeBracketIcon} label="Explain Code" onClick={() => handleAiRequest('Explain this code', 'explain')} disabled={isAiLoading} />
                <AiActionButton icon={ArrowPathIcon} label="Refactor Code" onClick={() => handleAiRequest('Refactor this code', 'refactor')} disabled={isAiLoading} />
                <AiActionButton icon={BeakerIcon} label="Generate Tests" onClick={() => handleAiRequest('Generate tests for this code', 'test')} disabled={isAiLoading} />
                <AiActionButton icon={BugAntIcon} label="Find Bugs" onClick={() => handleAiRequest('Find bugs in this code', 'debug')} disabled={isAiLoading} />
            </div>
          </div>

          {/* AI Assistant Panel */}
          <div className="w-1/3 border-l border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-900/50">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-2">
                <SparklesIcon className="w-5 h-5 text-purple-400" />
                <h3 className="text-md font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
                <select value={selectedAgent.id} onChange={(e) => setSelectedAgent(AI_AGENTS.find(a => a.id === e.target.value) || AI_AGENTS[0])} className="ml-auto text-xs bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 text-gray-900 dark:text-white focus:ring-blue-500">
                    {AI_AGENTS.map(agent => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
                </select>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatHistory.map((msg, index) => {
                const codeInMessage = extractCode(msg.content);
                const textContent = msg.content.replace(/```(?:\w+\n)?[\s\S]+?```/, '').trim();

                return (
                  <div key={index} className={`flex flex-col ${msg.author === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`rounded-lg p-3 max-w-sm ${msg.author === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                      {textContent && <p className="text-sm whitespace-pre-wrap">{textContent}</p>}
                      {codeInMessage && (
                        <div className="mt-2">
                           <pre className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 p-2 rounded-md whitespace-pre-wrap font-mono text-xs overflow-x-auto"><code>{codeInMessage}</code></pre>
                           <button onClick={() => handleApplyCode(codeInMessage)} className="mt-2 w-full text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded">
                               Replace in editor
                           </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              {isAiLoading && (
                  <div className="flex items-start">
                      <div className="rounded-lg p-3 max-w-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                          <div className="flex items-center space-x-2 text-sm">
                            <svg className="animate-spin h-4 w-4 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Thinking...</span>
                          </div>
                      </div>
                  </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleChatSubmit} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={isAiLoading}
                  placeholder="Ask a follow-up question..."
                  className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md p-2 border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <button type="submit" disabled={isAiLoading || !userInput.trim()} className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed">
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3 bg-white dark:bg-gray-800 rounded-b-lg shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};