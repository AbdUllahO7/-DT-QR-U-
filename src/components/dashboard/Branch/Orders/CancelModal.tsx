import React from 'react';
import { X, Ban } from 'lucide-react';

interface CancelModalProps {
  show: boolean;
  loading: boolean;
  onCancel: () => void;
  onClose: () => void;
  t: (key: string) => string;
}

const CancelModal: React.FC<CancelModalProps> = ({
  show,
  loading,
  onCancel,
  onClose,
  t
}) => {
  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Ban className="w-6 h-6 text-orange-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('ordersManager.cancelOrder')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              {t('ordersManager.cancelOrderConfirmation')}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              ) : (
                <>
                  <Ban className="w-4 h-4 mr-2" />
                  {t('ordersManager.cancelOrder')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelModal;