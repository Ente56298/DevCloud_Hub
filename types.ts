import React from 'react';

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

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size: string;
  modified: string;
  service: string;
  projectId?: string;
  content?: string;
  parentId?: string;
}

export type View =
  | { type: 'service'; id: string }
  | { type: 'project'; id: string }
  | { type: 'local'; id: string };

export interface ChatMessage {
  author: 'user' | 'ai';
  content: string;
}

export interface Agent {
  id: string;
  name: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface AutomationTemplate {
  id: string;
  title: string;
  description: string;
  source: { name: string; icon: React.ComponentType<{ className?: string }> };
  target: { name: string; icon: React.ComponentType<{ className?: string }> };
  status: 'active' | 'inactive';
}