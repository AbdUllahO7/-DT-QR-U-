import React from 'react';
import { XCircle } from 'lucide-react';

interface ErrorNotificationProps {
  error: string | null;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
      <div className="flex items-center">
        <XCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    </div>
  );
};

export default ErrorNotification;