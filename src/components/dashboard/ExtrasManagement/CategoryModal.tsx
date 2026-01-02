import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { CreateExtraCategoryData } from '../../../types/Extras/type';
import { MultiLanguageInput } from '../../common/MultiLanguageInput';
import { MultiLanguageTextArea } from '../../common/MultiLanguageTextArea';
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
  descriptionTranslations: TranslatableFieldValue;
  onNameTranslationsChange: (value: TranslatableFieldValue) => void;
  onDescriptionTranslationsChange: (value: TranslatableFieldValue) => void;
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
  descriptionTranslations,
  onNameTranslationsChange,
  onDescriptionTranslationsChange,
  supportedLanguages,
  defaultLanguage,
}) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900/75 backdrop-blur-sm" onClick={onClose}></div>
        <div className="inline-block  align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">

          {/* Modal Header */}
          <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? t('extrasManagement.categories.editCategory') : t('extrasManagement.categories.addCategory')}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="max-w-9xl px-6 py-6 max-h-[70vh] ">
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
              {/* Multi-Language Category Name */}
              <div>
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

              {/* Multi-Language Description */}
              <div>
                <MultiLanguageTextArea
                  label={t('extrasManagement.categories.fields.description') || 'Description'}
                  value={descriptionTranslations}
                  onChange={onDescriptionTranslationsChange}
                  languages={supportedLanguages}
                  required={false}
                  placeholder={t('extrasManagement.categories.fields.descriptionPlaceholder') || 'Enter description'}
                  disabled={loading}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
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
                      onChange={(e) => onChange({ ...formData, isRemovalCategory: e.target.checked })}
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
                <div className="grid grid-cols-2 gap-4">
                  {!formData.isRemovalCategory && (
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t('extrasManagement.categories.fields.minSelection')}
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
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
                <div className="grid grid-cols-2 gap-4">
                  {!formData.isRemovalCategory && (
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t('extrasManagement.categories.fields.minQuantity')}
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3"
                        value={formData.defaultMinTotalQuantity}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          onChange({ ...formData, defaultMinTotalQuantity: val === '' ? 0 : parseInt(val) });
                        }}
                      />
                    </div>
                  )}
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
              </div>
            </form>
          </div>

          {/* Footer Buttons */}
          <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex flex-row-reverse gap-3 border-t border-gray-100 dark:border-gray-700">
            <button
              type="submit"
              form="categoryForm"
              disabled={loading}
              className="inline-flex justify-center rounded-lg border border-transparent shadow-sm px-5 py-2.5 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('extrasManagement.processing') : (isEditMode ? t('extrasManagement.buttons.save') : t('extrasManagement.buttons.add'))}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm px-5 py-2.5 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
            >
              {t('extrasManagement.buttons.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
