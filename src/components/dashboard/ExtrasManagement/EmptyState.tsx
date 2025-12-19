import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface EmptyStateProps {
  isLoading?: boolean;
  isEmpty?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ isLoading, isEmpty }) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-500">{t('extrasManagement.loading')}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
        <LayoutGrid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-xl font-medium text-gray-900 dark:text-white">
          {t('extrasManagement.categories.noCategories')}
        </p>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('extrasManagement.categories.tryAdjusting')}</p>
      </div>
    );
  }

  return null;
};
