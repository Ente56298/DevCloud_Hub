// Fix: Add import for React to resolve "Cannot find namespace 'React'" error.
import React from 'react';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: string;
  modified: string;
  service: string;
  projectId?: string;
  content?: string;
  parentId?: string;
}

export interface Service {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface Project {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export type View = { type: 'service'; id: string } | { type: 'project'; id: string } | { type: 'local'; id: string };

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  timestamp: string;
  read: boolean;
}

export interface AiAssistant {
    id: string;
    name: string;
}

export interface ChatMessage {
    author: 'user' | 'ai';
    content: string;
}

export interface AutomationTemplate {
    id: string;
    title: string;
    description: string;
    source: { name: string; icon: React.ComponentType<{ className?: string }> };
    target: { name: string; icon: React.ComponentType<{ className?: string }> };
    status: 'active' | 'inactive';
}

export interface AutomationLogEntry {
  id: string;
  timestamp: string;
  message: string;
  status: 'info' | 'success' | 'warning';
}

export interface AgentProfile {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    status: 'idle' | 'active';
}
