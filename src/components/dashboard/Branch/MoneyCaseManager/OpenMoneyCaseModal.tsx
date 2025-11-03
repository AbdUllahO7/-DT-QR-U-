import React from 'react';
// Import Info icon and the new type
import { X, Unlock, Info } from 'lucide-react';
import { PreviousCloseInfo } from '../../../../types/BranchManagement/MoneyCase';

interface Props {
  show: boolean;
  loading: boolean;
  openingBalance: number;
  onOpeningBalanceChange: (value: number) => void;
  onConfirm: () => void;
  onClose: () => void;
  t: (key: string) => string;
  isRTL: boolean;
  // Add new prop to receive previous close data
  previousCloseInfo: PreviousCloseInfo | null;
}

const OpenMoneyCaseModal: React.FC<Props> = ({
  show,
  loading,
  openingBalance,
  onOpeningBalanceChange,
  onConfirm,
  onClose,
  t,
  isRTL,
  previousCloseInfo,
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
            
            {/* NEW: Previous Close Info Box */}
            {previousCloseInfo && previousCloseInfo.hasPreviousClose && (
              <div className={`mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Info className={`h-5 w-5 text-blue-600 dark:text-blue-400 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300">
                    {t('moneyCase.previousCloseInfo')}
                  </h4>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  {t('moneyCase.suggestedBalance')}:{' '}
                  <strong className="font-bold text-gray-900 dark:text-white">
                    {previousCloseInfo.suggestedOpeningBalance.toFixed(2)}
                  </strong>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  ({t('moneyCase.lastClosed')}: {new Date(previousCloseInfo.previousClosedAt).toLocaleString()})
                </p>
              </div>
            )}

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