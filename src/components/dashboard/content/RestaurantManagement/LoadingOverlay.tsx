import React from 'react';
import { RefreshCw } from 'lucide-react';

export const LoadingOverlay: React.FC = () => (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg flex items-center gap-3">
      <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
      <span className="text-gray-900 dark:text-white">Loading...</span>
    </div>
  </div>
);