import React from 'react';
import { X, Lock, AlertTriangle, AlertCircle } from 'lucide-react';
import { ActiveMoneyCase } from '../../../../types/BranchManagement/MoneyCase';

interface Props {
  show: boolean;
  loading: boolean;
  activeCase: ActiveMoneyCase | null;
  actualCash: number;
  closingNotes: string;
  onActualCashChange: (value: number) => void;
  onNotesChange: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
  t: (key: string) => string;
  isRTL: boolean;
  error?: string | null;
}

const CloseMoneyCaseModal: React.FC<Props> = ({
  show,
  loading,
  activeCase,
  actualCash,
  closingNotes,
  onActualCashChange,
  onNotesChange,
  onConfirm,
  onClose,
  t,
  isRTL,
  error,
}) => {
  if (!show) return null;
  const expectedCash = activeCase?.totalAmount || activeCase?.currentBalance || 0;
  const difference = actualCash - expectedCash;


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
          <div className="bg-red-600 px-6 py-4">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Lock className={`h-6 w-6 text-white ${isRTL ? 'ml-3' : 'mr-3'}`} />
                <h3 className="text-lg font-medium text-white">
                  {t('moneyCase.closeCase')}
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
          <div className="px-6 py-4 space-y-4">
            {/* Error Message */}
            {error && (
              <div className={`p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <AlertCircle className={`h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 ${isRTL ? 'ml-3' : 'mr-3'} mt-0.5`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {/* Expected Cash */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                {t('moneyCase.expectedCash')}
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${expectedCash.toFixed(2)}
              </p>
            </div>

            {/* Actual Cash */}
            <div>
              <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('moneyCase.actualCash')}
              </label>
              <input
                type="number"
                value={actualCash}
                onChange={(e) => onActualCashChange(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            {/* Difference Alert */}
            {difference !== 0 && (
              <div className={`p-4 rounded-lg ${
                difference > 0 
                  ? 'bg-green-50 dark:bg-green-900/20' 
                  : 'bg-red-50 dark:bg-red-900/20'
              }`}>
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <AlertTriangle className={`h-5 w-5 ${
                    difference > 0 ? 'text-green-500' : 'text-red-500'
                  } ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  <div>
                    <p className={`text-sm font-medium ${
                      difference > 0 
                        ? 'text-green-900 dark:text-green-300' 
                        : 'text-red-900 dark:text-red-300'
                    }`}>
                      {difference > 0 ? t('moneyCase.surplus') : t('moneyCase.shortage')}
                    </p>
                    <p className={`text-lg font-bold ${
                      difference > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {Math.abs(difference).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('moneyCase.notes')}
              </label>
              <textarea
                value={closingNotes}
                onChange={(e) => onNotesChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                rows={3}
                placeholder={t('moneyCase.notesPlaceholder')}
              />
            </div>
          </div>

          {/* Footer */}
          <div className={`bg-gray-50 dark:bg-gray-700 px-6 py-4 flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('common.loading') : t('moneyCase.confirmClose')}
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

export default CloseMoneyCaseModal;