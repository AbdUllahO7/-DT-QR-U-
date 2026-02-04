import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { CreateExtraCategoryData } from '../../../types/Extras/type';
import { MultiLanguageInput } from '../../common/MultiLanguageInput';
import { TranslatableFieldValue } from '../../../hooks/useTranslatableFields';

interface LanguageOption {
  code: string;
  displayName: string;
  nativeName: string;
  isRtl: boolean;
}

interface CategoryModalProps {
  isEditMode: boolean;
  formData: CreateExtraCategoryData;
  loading: boolean;
  error: string | null;
  onChange: (data: CreateExtraCategoryData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  nameTranslations: TranslatableFieldValue;
  onNameTranslationsChange: (value: TranslatableFieldValue) => void;
  supportedLanguages: LanguageOption[];
  defaultLanguage: string;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isEditMode,
  formData,
  loading,
  error,
  onChange,
  onSubmit,
  onClose,
  nameTranslations,
  onNameTranslationsChange,
  supportedLanguages,
  defaultLanguage,
}) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-0 sm:px-4 sm:pt-4 sm:pb-20 text-center">
        <div className="fixed inset-0 transition-opacity bg-gray-900/75 backdrop-blur-sm" onClick={onClose}></div>
        
        {/* Modal Panel - Full screen on mobile, rounded card on desktop */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-none sm:rounded-2xl text-left overflow-hidden shadow-xl transform transition-all w-full h-full sm:h-auto sm:my-8 sm:align-middle sm:max-w-2xl flex flex-col">

          {/* Modal Header */}
          <div className="bg-white dark:bg-gray-800 px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? t('extrasManagement.categories.editCategory') : t('extrasManagement.categories.addCategory')}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none p-1">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400" />
                  </div>
                  <div className="ml-3">
                    <div className="mt-1 text-sm text-red-700 dark:text-red-400">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form id="categoryForm" onSubmit={onSubmit} className="space-y-5">
              <div 
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2"
                style={{ 
                  maxHeight: '300px', 
                  overflowY: 'auto',
                  display: 'block' 
                }}
              >
                <MultiLanguageInput
                  label={t('extrasManagement.categories.fields.categoryName')}
                  value={nameTranslations}
                  onChange={onNameTranslationsChange}
                  languages={supportedLanguages}
                  required={true}
                  requiredLanguages={[defaultLanguage]}
                  placeholder={t('extrasManagement.categories.fields.categoryNamePlaceholder')}
                  disabled={loading}
                />
              </div>

              {/* Settings Checkboxes - Stack on mobile, Row on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.status}
                      onChange={(e) => onChange({ ...formData, status: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('extrasManagement.categories.fields.statusLabel')}
                    </span>
                  </label>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isRequired}
                      onChange={(e) => onChange({ ...formData, isRequired: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('extrasManagement.categories.fields.requiredLabel')}
                    </span>
                  </label>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isRemovalCategory}
                      onChange={(e) => {
                        const isRemoval = e.target.checked;
                        onChange({ 
                          ...formData, 
                          isRemovalCategory: isRemoval,
                          // If removal, reset quantities
                          defaultMinSelectionCount: isRemoval ? 0 : formData.defaultMinSelectionCount,
                          defaultMinTotalQuantity: isRemoval ? 0 : formData.defaultMinTotalQuantity,
                          defaultMaxTotalQuantity: isRemoval ? null : formData.defaultMaxTotalQuantity, // Set null as requested
                          isMaxQuantityUnlimited: isRemoval ? false : formData.isMaxQuantityUnlimited
                        });
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('extrasManagement.categories.fields.removalCategoryLabel')}
                    </span>
                  </label>
                </div>
              </div>

              {/* Selection Rules */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
                  {t('extrasManagement.categories.fields.selectionRules')}
                </h4>
                
                {/* Row 1: Min/Max Selection - Stack on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {!formData.isRemovalCategory && (
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t('extrasManagement.categories.fields.minSelection')}
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        title={t('extrasManagement.categories.fields.minSelection')}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3"
                        value={formData.defaultMinSelectionCount}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          onChange({ ...formData, defaultMinSelectionCount: val === '' ? 0 : parseInt(val) });
                        }}
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {t('extrasManagement.categories.fields.maxSelection')}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        title={t('extrasManagement.categories.fields.maxSelection')}
                        type="text"
                        inputMode="numeric"
                        className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={formData.isMaxSelectionUnlimited ? '' : (formData.defaultMaxSelectionCount ?? '')}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          onChange({ ...formData, defaultMaxSelectionCount: val === '' ? 0 : parseInt(val) });
                        }}
                        disabled={formData.isMaxSelectionUnlimited}
                      />
                      <label className="flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isMaxSelectionUnlimited || false}
                          onChange={(e) => onChange({ ...formData, isMaxSelectionUnlimited: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">{t('extrasManagement.categories.fields.unlimited')}</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Row 2: Min/Max Quantity (Completely HIDDEN if isRemovalCategory is true) */}
                {!formData.isRemovalCategory && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t('extrasManagement.categories.fields.minQuantity')}
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        title={t('extrasManagement.categories.fields.minQuantity')}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3"
                        value={formData.defaultMinTotalQuantity}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          onChange({ ...formData, defaultMinTotalQuantity: val === '' ? 0 : parseInt(val) });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t('extrasManagement.categories.fields.maxQuantity')}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          title={t('extrasManagement.categories.fields.maxQuantity')}
                          type="text"
                          inputMode="numeric"
                          className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
                          value={formData.isMaxQuantityUnlimited ? '' : (formData.defaultMaxTotalQuantity ?? '')}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            onChange({ ...formData, defaultMaxTotalQuantity: val === '' ? 0 : parseInt(val) });
                          }}
                          disabled={formData.isMaxQuantityUnlimited}
                        />
                        <label className="flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isMaxQuantityUnlimited || false}
                            onChange={(e) => onChange({ ...formData, isMaxQuantityUnlimited: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">{t('extrasManagement.categories.fields.unlimited')}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Footer Buttons - Fixed to bottom on mobile or normal flow on desktop */}
          <div className="bg-gray-50 dark:bg-gray-800/50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 border-t border-gray-100 dark:border-gray-700 shrink-0">
            <button
              type="submit"
              form="categoryForm"
              disabled={loading}
              className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-transparent shadow-sm px-5 py-2.5 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('extrasManagement.processing') : (isEditMode ? t('extrasManagement.buttons.save') : t('extrasManagement.buttons.add'))}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm px-5 py-2.5 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              {t('extrasManagement.buttons.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};