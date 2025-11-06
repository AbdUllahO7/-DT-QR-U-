import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Lock, Unlock, Trash2 } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  actionType: 'delete' | 'lock' | 'unlock' | 'generic';
  isLoading: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  actionType,
  isLoading,
}) => {
  const { t } = useLanguage();

  const getIcon = () => {
    switch (actionType) {
      case 'delete':
        return <Trash2 className="h-6 w-6 text-red-600" />;
      case 'lock':
        return <Lock className="h-6 w-6 text-yellow-600" />;
      case 'unlock':
        return <Unlock className="h-6 w-6 text-green-600" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-blue-600" />;
    }
  };

  const getButtonClass = () => {
    switch (actionType) {
      case 'delete':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'lock':
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
      case 'unlock':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose}></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md rounded-xl bg-white dark:bg-gray-800 shadow-2xl"
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${getButtonClass().replace('bg-', 'bg-').replace('600', '100').replace('hover:bg-','')} dark:bg-gray-700`}>
                {getIcon()}
              </div>
              <div className="mt-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white" id="modal-title">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 bg-gray-50 dark:bg-gray-700/50 px-6 py-4 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none disabled:opacity-50"
            >
              {t('userManagementPage.createRole.cancel')}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`inline-flex items-center justify-center rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${getButtonClass()}`}
            >
              {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ConfirmationModal;