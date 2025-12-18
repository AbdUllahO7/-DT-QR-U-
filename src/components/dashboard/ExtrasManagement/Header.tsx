import React from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddCategory: () => void;
  onNavigateToRecycleBin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onAddCategory,
  onNavigateToRecycleBin,
}) => {
  const { t } = useLanguage();

  return (
    <>
      {/* Title and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t('extrasManagement.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('extrasManagement.description')}</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onNavigateToRecycleBin}
            className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 dark:text-gray-400"
            title={t('extrasManagement.recycleBin.title')}
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={onAddCategory}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all hover:shadow-md font-medium"
          >
            <Plus className="w-5 h-5" />
            {t('extrasManagement.categories.addNew')}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={t('extrasManagement.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
        />
      </div>
    </>
  );
};
