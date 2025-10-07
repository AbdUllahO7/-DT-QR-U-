import React, { useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' 
    ? 'bg-green-100 dark:bg-green-900 border-green-400 text-green-700 dark:text-green-300'
    : 'bg-red-100 dark:bg-red-900 border-red-400 text-red-700 dark:text-red-300';

  return (
    <div className={`mb-6 p-4 border rounded-lg ${bgColor}`}>
      {message}
    </div>
  );
};