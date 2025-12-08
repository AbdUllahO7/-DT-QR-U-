import React from 'react';

interface ViewModeToggleProps {
  viewMode: 'pending' | 'branch' | 'deletedOrders';
  pendingCount: number;
  branchCount: number;
  onModeChange: (mode: 'pending' | 'branch') => void;
  t: (key: string) => string;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  pendingCount,
  branchCount,
  onModeChange,
  t
}) => {

  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex space-x-2">
        <button
          onClick={() => onModeChange('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            viewMode === 'pending'
              ? 'bg-blue-600 text-white dark:bg-blue-500'
              : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
          }`}
        >
          {t('ordersManager.pendingOrders')} ({pendingCount})
        </button>
        <button
          onClick={() => onModeChange('branch')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            viewMode === 'branch'
              ? 'bg-blue-600 text-white dark:bg-blue-500'
              : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
          }`}
        >
          {t('ordersManager.branchOrders')} ({branchCount})
        </button>
      </div>
    </div>
  );
};

export default ViewModeToggle;