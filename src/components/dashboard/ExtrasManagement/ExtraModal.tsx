import React from 'react';
import { X, Upload } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { CreateExtraData, ExtraCategory } from '../../../types/Extras/type';
import { MultiLanguageInput } from '../../common/MultiLanguageInput';
import { MultiLanguageTextArea } from '../../common/MultiLanguageTextArea';
import { TranslatableFieldValue } from '../../../hooks/useTranslatableFields';

interface LanguageOption {
  code: string;
  displayName: string;
  nativeName: string;
  isRtl: boolean;
}

interface ExtraModalProps {
  isEditMode: boolean;
  formData: CreateExtraData;
  categories: ExtraCategory[];
  imagePreview: string;
  loading: boolean;
  uploading: boolean;
  selectedCategoryId?: number;
  onChange: (data: CreateExtraData) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageClear: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  nameTranslations: TranslatableFieldValue;
  descriptionTranslations: TranslatableFieldValue;
  onNameTranslationsChange: (value: TranslatableFieldValue) => void;
  onDescriptionTranslationsChange: (value: TranslatableFieldValue) => void;
  supportedLanguages: LanguageOption[];
  defaultLanguage: string;
  error: string | null;
}


export const ExtraModal: React.FC<ExtraModalProps> = ({
  isEditMode,
  formData,
  error,
  categories,
  imagePreview,
  loading,
  uploading,
  selectedCategoryId,
  onChange,
  onFileSelect,
  onImageClear,
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

  console.log("categories",categories)

  // Helper to find the currently selected category object
  const currentCategory = categories.find((c) => c.id === formData.extraCategoryId);

  // Helper to check if removal is allowed for the current selection
  const isRemovalAllowed = currentCategory?.isRemovalCategory === true;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategoryId = parseInt(e.target.value);
    const newCategory = categories.find((c) => c.id === newCategoryId);

    // If switching to a category that DOES NOT support removal, force isRemoval to false
    const shouldResetRemoval = formData.isRemoval && newCategory && !newCategory.isRemovalCategory;

    onChange({
      ...formData,
      extraCategoryId: newCategoryId,
      isRemoval: shouldResetRemoval ? false : formData.isRemoval,
      // If we forced removal off, we don't necessarily need to reset price, 
      // but if we turned it ON (not handled here), we would.
    });
  };

  const handleRemovalCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    // 1. Validation: If trying to check it, ensure a category is selected
    if (isChecked && !formData.extraCategoryId) {
      alert(t('extrasManagement.errors.selectCategoryFirst') || 'Please select a category first.');
      return;
    }

    // 2. Validation: Ensure the selected category allows removal
    if (isChecked && !isRemovalAllowed) {
      alert(t('extrasManagement.errors.categoryNotRemoval') || 'The selected category does not support removal items.');
      return;
    }

    // 3. Update state
    onChange({
      ...formData,
      isRemoval: isChecked,
      basePrice: isChecked ? 0 : formData.basePrice,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900/75 backdrop-blur-sm" onClick={onClose}></div>


        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          
          {/* Modal Header */}
          <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? t('extrasManagement.extras.editExtra') : t('extrasManagement.extras.addExtra')}
            </h3>
                    {error ? <div className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded">{error}</div> : null}

            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Content - Scrollable Area */}
          <div className="px-6 py-6 max-h-[calc(100vh-16rem)] overflow-y-auto custom-scrollbar">
            <form id="extraForm" onSubmit={handleFormSubmit} className="space-y-5">
              
              {/* Parent Category Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('extrasManagement.extras.fields.parentCategory')}
                </label>
                <select
                  title="Parent Category"
                  value={formData.extraCategoryId}
                  onChange={handleCategoryChange}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5"
                  disabled={!!selectedCategoryId}
                >
                  <option value={0}>{t('extrasManagement.extras.fields.selectCategory')}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.categoryName} {c.isRemovalCategory ? `(${t('common.removal') || 'Removal'})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                <div className="sm:col-span-2">
                  <MultiLanguageInput
                    label={t('extrasManagement.extras.fields.itemName')}
                    value={nameTranslations}
                    onChange={onNameTranslationsChange}
                    languages={supportedLanguages}
                    required={true}
                    requiredLanguages={[defaultLanguage]}
                    placeholder={t('extrasManagement.extras.fields.itemNamePlaceholder')}
                    disabled={loading || uploading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('extrasManagement.extras.fields.price')}
                  </label>
                  <div className="relative">
                    <input
                      title="Price"
                      type="number"
                      step="1"
                      min="0"
                      value={formData.basePrice || ''}
                      // Disable input if removal is checked
                      disabled={formData.isRemoval}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange({ ...formData, basePrice: val === '' ? 0 : parseFloat(val) || 0 });
                      }}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 px-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Multi-Language Description TextArea */}
              <MultiLanguageTextArea
                label={t('extrasManagement.extras.fields.description')}
                value={descriptionTranslations}
                onChange={onDescriptionTranslationsChange}
                languages={supportedLanguages}
                required={false}
                placeholder={t('extrasManagement.extras.fields.descriptionPlaceholder')}
                disabled={loading || uploading}
                rows={3}
              />

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('extrasManagement.extras.fields.imageLabel')}
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
                    imagePreview
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                      : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
                  }`}
                >
                  {imagePreview ? (
                    <div className="relative h-40 w-full">
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-contain rounded" />
                      <button
                        type="button"
                        onClick={onImageClear}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-32 cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">{t('extrasManagement.extras.fields.uploadText')}</span>
                      <input type="file" className="hidden" accept="image/*" onChange={onFileSelect} />
                    </label>
                  )}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex gap-4 p-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.status}
                    onChange={(e) => onChange({ ...formData, status: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {t('extrasManagement.extras.fields.activeLabel')}
                  </span>
                </label>
                
                {/* Removal Checkbox */}
                <label className={`flex items-center gap-2 group ${!isRemovalAllowed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <input
                    type="checkbox"
                    checked={formData.isRemoval}
                    onChange={handleRemovalCheckboxChange}
                    // Optional: Physically disable the input if the category doesn't support it
                    disabled={!isRemovalAllowed && !formData.isRemoval} 
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {t('extrasManagement.extras.fields.removalLabel')}
                  </span>
                </label>
              </div>
            </form>
          </div>

          {/* Footer Buttons */}
          <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex flex-row-reverse gap-3 border-t border-gray-100 dark:border-gray-700">
            <button
              type="submit"
              form="extraForm"
              disabled={loading || uploading}
              className="inline-flex justify-center rounded-lg border border-transparent shadow-sm px-5 py-2.5 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm transition-all duration-200 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || uploading
                ? t('extrasManagement.processing')
                : isEditMode
                ? t('extrasManagement.buttons.save')
                : t('extrasManagement.buttons.add')}
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