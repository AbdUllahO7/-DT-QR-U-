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
      // NEW STYLES: Increased minimum height, more pronounced dashed border, and a stronger shadow.
      className={`
        w-full h-full min-h-[220px] 
        bg-white dark:bg-gray-800 
        rounded-2xl 
        shadow-lg hover:shadow-xl transition-shadow duration-300 
        border-2 border-dashed border-gray-300 dark:border-gray-600 
        p-6 
        hover:border-blue-600 dark:hover:border-blue-500 
        transition-all duration-200 
        flex flex-col items-center justify-center gap-4 
        group focus:outline-none focus:ring-4 focus:ring-blue-500/50
        ${isRTL ? 'text-right' : 'text-left'}
      `}
      aria-label={t('AddQRCodeCard.accessibility.addButton') || 'Add New QR Code Table'}
      role="button"
    >
      {/* Icon Container: Larger and uses group-hover for a dynamic color change */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-xl group-hover:bg-blue-100 dark:group-hover:bg-blue-900/70 transition-colors duration-300">
        <Plus className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300" />
      </div>
      
      <div className="text-center">
        {/* Title: Slightly larger and uses group-hover for visibility */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {t('AddQRCodeCard.title') || 'Create New Table'}
        </h3>
        {/* Subtitle: Consistent styling */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('AddQRCodeCard.subtitle') || 'Click to set up a new table and generate its QR code.'}
        </p>
      </div>
    </button>
  );
};

export default AddQRCodeCard;