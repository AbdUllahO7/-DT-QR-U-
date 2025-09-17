import React from 'react';
import { XCircle } from 'lucide-react';

interface RejectModalProps {
  show: boolean;
  loading: boolean;
  rejectReason: string;
  onReasonChange: (reason: string) => void;
  onReject: () => void;
  onClose: () => void;
  t: (key: string) => string;
}

const RejectModal: React.FC<RejectModalProps> = ({
  show,
  loading,
  rejectReason,
  onReasonChange,
  onReject,
  onClose,
  t
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center mb-4">
          <XCircle className="w-6 h-6 text-red-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('ordersManager.rejectOrderTitle')}
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t('ordersManager.rejectOrderPrompt')}
        </p>
        <textarea
          value={rejectReason}
          onChange={(e) => onReasonChange(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 mb-6"
          rows={4}
          placeholder={t('ordersManager.rejectReasonPlaceholder')}
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
          >
            {t('ordersManager.cancel')}
          </button>
          <button
            onClick={onReject}
            className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200"
            disabled={!rejectReason.trim() || loading}
          >
            {loading ? t('ordersManager.rejecting') : t('ordersManager.rejectAction')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;