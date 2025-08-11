import React from 'react';
import { Plus } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface AddQRCodeCardProps {
  onClick: () => void;
}

const AddQRCodeCard: React.FC<AddQRCodeCardProps> = ({ onClick }) => {
  const { t, isRTL } = useLanguage();

  return (
    <button
      onClick={onClick}
      className={`w-full h-full min-h-[200px] bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center gap-4 ${isRTL ? 'text-right' : 'text-left'}`}
      aria-label={t('AddQRCodeCard.accessibility.addButton')}
      role="button"
    >
      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
        <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {t('AddQRCodeCard.title')}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('AddQRCodeCard.subtitle')}
        </p>
      </div>
    </button>
  );
};

export default AddQRCodeCard;