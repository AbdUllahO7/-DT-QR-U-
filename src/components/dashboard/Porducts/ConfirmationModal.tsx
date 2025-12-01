import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext'; // Adjust path as needed

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isSubmitting?: boolean;
  // Optional overrides if you want different button text than the defaults
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isSubmitting,
  confirmButtonText,
  cancelButtonText
}) => {
  const { t, isRTL } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden scale-100 transform transition-all ${
          isRTL ? 'text-right' : 'text-left'
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {message}
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium"
            >
              {cancelButtonText || t('extrasManagement.buttons.cancel')}
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md hover:shadow-lg transition-all font-medium flex items-center gap-2"
            >
              {isSubmitting 
                ? t('extrasManagement.deleteModal.processingButton') 
                : (confirmButtonText || t('extrasManagement.deleteModal.confirmButton'))
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};