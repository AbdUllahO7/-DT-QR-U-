import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ConfirmModalProps {
  show: boolean;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
  t: (key: string) => string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  loading,
  onConfirm,
  onClose,
  t
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center mb-4">
          <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('ordersManager.confirmOrderTitle')}
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('ordersManager.confirmOrderPrompt')}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
          >
            {t('ordersManager.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200"
            disabled={loading}
          >
            {loading ? t('ordersManager.confirming') : t('ordersManager.confirmAction')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;