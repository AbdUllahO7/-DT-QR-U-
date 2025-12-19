import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { DeleteConfig } from './types';

interface DeleteModalProps {
  config: DeleteConfig;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({ config, loading, onConfirm, onClose }) => {
  const { t, isRTL } = useLanguage();

  if (!config.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900/75 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
              </div>
              <div className={`mt-3 text-center sm:mt-0 sm:text-left ${isRTL ? 'sm:mr-4' : 'sm:ml-4'}`}>
                <h3 className="text-lg leading-6 font-bold text-gray-900 dark:text-white" id="modal-title">
                  {config.type === 'category'
                    ? t('extrasManagement.deleteModal.titleCategory')
                    : t('extrasManagement.deleteModal.titleItem')}
                </h3>

                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('extrasManagement.deleteModal.confirmMessage').replace('{name}', config.name)}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t('extrasManagement.deleteModal.warningMessage')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
            <button
              type="button"
              disabled={loading}
              className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              onClick={onConfirm}
            >
              {loading ? t('extrasManagement.deleteModal.processingButton') : t('extrasManagement.deleteModal.confirmButton')}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              {t('extrasManagement.deleteModal.cancelButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
