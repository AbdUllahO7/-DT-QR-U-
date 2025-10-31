import React from 'react';
import { X, Unlock } from 'lucide-react';

interface Props {
  show: boolean;
  loading: boolean;
  openingBalance: number;
  onOpeningBalanceChange: (value: number) => void;
  onConfirm: () => void;
  onClose: () => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const OpenMoneyCaseModal: React.FC<Props> = ({
  show,
  loading,
  openingBalance,
  onOpeningBalanceChange,
  onConfirm,
  onClose,
  t,
  isRTL
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-green-600 px-6 py-4">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Unlock className={`h-6 w-6 text-white ${isRTL ? 'ml-3' : 'mr-3'}`} />
                <h3 className="text-lg font-medium text-white">
                  {t('moneyCase.openCase')}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            <div className="mb-4">
              <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('moneyCase.openingBalance')}
              </label>
              <input
                type="number"
                value={openingBalance}
                onChange={(e) => onOpeningBalanceChange(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('moneyCase.openingBalanceDescription')}
            </p>
          </div>

          {/* Footer */}
          <div className={`bg-gray-50 dark:bg-gray-700 px-6 py-4 flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('common.loading') : t('moneyCase.confirm')}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenMoneyCaseModal;