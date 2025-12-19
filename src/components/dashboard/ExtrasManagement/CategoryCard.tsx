import React from 'react';
import { ChevronDown, Plus, Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Extra, ExtraCategory } from '../../../types/Extras/type';
import { ExtraCard } from './ExtraCard';

interface CategoryCardProps {
  category: ExtraCategory;
  extras: Extra[];
  isExpanded: boolean;
  onToggle: () => void;
  onAddExtra: () => void;
  onEditCategory: () => void;
  onDeleteCategory: () => void;
  onEditExtra: (extra: Extra) => void;
  onDeleteExtra: (extra: Extra) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  extras,
  isExpanded,
  onToggle,
  onAddExtra,
  onEditCategory,
  onDeleteCategory,
  onEditExtra,
  onDeleteExtra,
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Category Header */}
      <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4 flex-1 cursor-pointer select-none" onClick={onToggle}>
          <div className={`p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{category.categoryName}</h3>
              {!category.status && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                  {t('extrasManagement.categories.inactive')}
                </span>
              )}
              {category.isRequired && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  {t('extrasManagement.categories.required')}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap gap-x-4">
              <span>
                {t('extrasManagement.categories.select')} {category.defaultMinSelectionCount}-{category.defaultMaxSelectionCount}
              </span>
              <span className="hidden sm:inline text-gray-300">|</span>
              <span>
                {t('extrasManagement.categories.qtyLimit')} {category.defaultMinTotalQuantity}-{category.defaultMaxTotalQuantity}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={onAddExtra}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" /> {t('extrasManagement.buttons.addItem')}
          </button>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
          <button
            onClick={onEditCategory}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDeleteCategory}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Extras List */}
      {isExpanded && (
        <div className="p-4 md:p-6 bg-white dark:bg-gray-800">
          {extras.length === 0 ? (
            <div className="text-center py-8 px-4 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-lg">
              <p className="text-gray-400 text-sm">{t('extrasManagement.extras.noItems')}</p>
              <button
                onClick={onAddExtra}
                className="text-blue-500 text-sm font-medium hover:underline mt-1"
              >
                {t('extrasManagement.buttons.createFirst')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {extras.map((extra) => (
                <ExtraCard
                  key={extra.id}
                  extra={extra}
                  onEdit={onEditExtra}
                  onDelete={onDeleteExtra}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
