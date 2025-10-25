import React from 'react';
import type { Notification } from '../types';
import { CheckCircleIcon, InformationCircleIcon, BellIcon } from './icons';

interface NotificationsPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
}

const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
  switch (type) {
    case 'success':
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    case 'info':
      return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
    default:
      return <BellIcon className="w-5 h-5 text-gray-500" />;
  }
};

const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "just now";
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onClose, onMarkAllAsRead }) => {
  return (
    <div 
      className="absolute top-full right-5 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 transform transition-all duration-200 ease-out origin-top-right"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-panel-title"
    >
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 id="notification-panel-title" className="text-md font-semibold text-gray-900 dark:text-white">Notifications</h2>
        <button
          onClick={onMarkAllAsRead}
          className="text-xs text-blue-500 hover:text-blue-600 disabled:text-gray-400"
          disabled={notifications.every(n => n.read)}
        >
          Mark all as read
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          <ul>
            {notifications.map(notification => (
              <li
                key={notification.id}
                className={`flex items-start p-3 border-b border-gray-100 dark:border-gray-700/50 transition-colors ${
                  notification.read ? 'opacity-60' : 'bg-blue-50 dark:bg-blue-900/20'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                    <NotificationIcon type={notification.type} />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{notification.message}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{timeSince(notification.timestamp)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 px-4">
            <BellIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600"/>
            <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No new notifications</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">You're all caught up!</p>
          </div>
        )}
      </div>
       <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg flex justify-end">
        <button
            onClick={onClose}
            className="text-xs px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
        >
            Close
        </button>
       </div>
    </div>
  );
};