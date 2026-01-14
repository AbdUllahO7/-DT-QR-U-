import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, ChevronDown, Check, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { CreateExtraData, ExtraCategory } from '../../../types/Extras/type';
import { MultiLanguageInput } from '../../common/MultiLanguageInput';
import { MultiLanguageTextArea } from '../../common/MultiLanguageTextArea';
import { TranslatableFieldValue } from '../../../hooks/useTranslatableFields';
import { CustomSelect } from '../../common/CustomSelect';

// --- Custom Select Component ---
interface SelectOption {
  value: number;
  label: string;
  subLabel?: string;
}



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
  const { t, isRTL } = useLanguage();

  // Helper to find the currently selected category object
  const currentCategory = categories.find((c) => c.id === formData.extraCategoryId);

  // Helper to check if removal is allowed for the current selection
  const isRemovalAllowed = currentCategory?.isRemovalCategory === true;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  const handleCategoryChange = (newCategoryId: string | number) => {
    const categoryId = Number(newCategoryId);
    const newCategory = categories.find((c) => c.id === categoryId);

    // If switching to a category that DOES NOT support removal, force isRemoval to false
    const shouldResetRemoval = formData.isRemoval && newCategory && !newCategory.isRemovalCategory;

    onChange({
      ...formData,
      extraCategoryId: categoryId,
      isRemoval: shouldResetRemoval ? false : formData.isRemoval,
      // Reset price if we were in removal mode and got switched out?
      // Usually better to keep price if user typed it, unless they were forced out of removal mode.
      basePrice: shouldResetRemoval ? formData.basePrice : (formData.isRemoval ? 0 : formData.basePrice)
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
      <div className="flex items-center justify-center min-h-screen p-0 sm:px-4 sm:pt-4 sm:pb-20 text-center">
        <div className="fixed inset-0 transition-opacity bg-gray-900/75 backdrop-blur-sm" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-none sm:rounded-2xl text-left overflow-hidden shadow-xl transform transition-all w-full h-full sm:h-auto sm:my-8 sm:align-middle sm:max-w-lg flex flex-col">
          
          {/* Modal Header */}
          <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? t('extrasManagement.extras.editExtra') : t('extrasManagement.extras.addExtra')}
            </h3>
            
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-6 pt-4">
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div className="ml-3 text-sm text-red-700 dark:text-red-400 font-medium">
                  {error}
                </div>
              </div>
            </div>
          )}

          {/* Modal Content - Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <form id="extraForm" onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* Parent Category Select - Custom Component */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('extrasManagement.extras.fields.parentCategory')} <span className="text-red-500">*</span>
                </label>
                <div className="relative z-20">
                  <CustomSelect
                    placeholder={t('extrasManagement.extras.fields.selectCategory')}
                    value={formData.extraCategoryId}
                    onChange={handleCategoryChange}
                    options={categories.map(c => ({
                      value: c.id,
                      label: c.categoryName,
                      subLabel: c.isRemovalCategory ? t('common.removal') || 'Removal Category' : undefined
                    }))}
                    disabled={!!selectedCategoryId}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                      step="0.01"
                      min="0"
                      value={formData.basePrice || ''}
                      // Disable input if removal is checked
                      disabled={formData.isRemoval}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange({ ...formData, basePrice: val === '' ? 0 : parseFloat(val) || 0 });
                      }}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800"
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
                  className={`relative border-2 border-dashed rounded-xl p-6 transition-colors group cursor-pointer ${
                    imagePreview
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
                      : 'border-gray-300 hover:border-primary-400 dark:border-gray-600 dark:hover:border-primary-500'
                  }`}
                >
                  {imagePreview ? (
                    <div className="relative h-48 w-full flex items-center justify-center">
                      <img src={imagePreview} alt="Preview" className="h-full object-contain rounded-lg shadow-sm" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onImageClear(); }}
                        className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-32 cursor-pointer w-full">
                      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-3 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                        <Upload className="w-6 h-6 text-gray-400 group-hover:text-primary-600 dark:text-gray-500 dark:group-hover:text-primary-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {t('extrasManagement.extras.fields.uploadText')}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</span>
                      <input type="file" className="hidden" accept="image/*" onChange={onFileSelect} />
                    </label>
                  )}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.status}
                      onChange={(e) => onChange({ ...formData, status: e.target.checked })}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 transition-colors"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {t('extrasManagement.extras.fields.activeLabel')}
                  </span>
                </label>
                
                <div className="hidden sm:block w-px bg-gray-200 dark:bg-gray-600 h-6 self-center"></div>

                <label className={`flex items-center gap-3 group transition-opacity ${!isRemovalAllowed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isRemoval}
                      onChange={handleRemovalCheckboxChange}
                      disabled={!isRemovalAllowed && !formData.isRemoval} 
                      className="w-5 h-5 text-red-600 rounded focus:ring-red-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 transition-colors disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium transition-colors ${formData.isRemoval ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      {t('extrasManagement.extras.fields.removalLabel')}
                    </span>
                    
                  </div>
                </label>
              </div>
            </form>
          </div>

          {/* Footer Buttons */}
          <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end border-t border-gray-100 dark:border-gray-700 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-gray-300 dark:border-gray-600 px-6 py-3 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors shadow-sm"
            >
              {t('extrasManagement.buttons.cancel')}
            </button>
            <button
              type="submit"
              form="extraForm"
              disabled={loading || uploading}
              className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-transparent px-6 py-3 text-sm font-medium text-white shadow-sm bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              {loading || uploading
                ? t('extrasManagement.processing')
                : isEditMode
                ? t('extrasManagement.buttons.save')
                : t('extrasManagement.buttons.add')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};