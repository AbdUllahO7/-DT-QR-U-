import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { CreateExtraData, ExtraCategory, Extra } from '../../../types/Extras/type';

interface ExtraModalProps {
  isEditMode: boolean;
  formData: CreateExtraData;
  categories: ExtraCategory[];
  allExtras: Extra[];
  imagePreview: string;
  loading: boolean;
  uploading: boolean;
  selectedCategoryId?: number;
  onChange: (data: CreateExtraData) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageClear: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const ExtraModal: React.FC<ExtraModalProps> = ({
  isEditMode,
  formData,
  categories,
  allExtras,
  imagePreview,
  loading,
  uploading,
  selectedCategoryId,
  onChange,
  onFileSelect,
  onImageClear,
  onSubmit,
  onClose,
}) => {
  const { t } = useLanguage();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredExtras, setFilteredExtras] = useState<Extra[]>([]);
  const [duplicateInSameCategory, setDuplicateInSameCategory] = useState(false);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter extras based on input
  useEffect(() => {
    if (formData.name && !isEditMode) {
      // Only validate if category is selected (not 0)
      if (formData.extraCategoryId && formData.extraCategoryId !== 0) {
        // Filter extras for suggestions (show all matching extras)
        const filtered = allExtras.filter(extra =>
          extra.name.toLowerCase().includes(formData.name.toLowerCase())
        );
        setFilteredExtras(filtered);

        // Check for exact duplicate ONLY in the same category
        const duplicateInSameCategory = allExtras.some(extra =>
          extra.name.toLowerCase().trim() === formData.name.toLowerCase().trim() &&
          extra.extraCategoryId === formData.extraCategoryId
        );

        // Debug logging
        console.log('Duplicate Check:', {
          name: formData.name,
          categoryId: formData.extraCategoryId,
          isDuplicate: duplicateInSameCategory,
          allExtrasInCategory: allExtras.filter(e => e.extraCategoryId === formData.extraCategoryId).map(e => e.name)
        });

        setDuplicateInSameCategory(duplicateInSameCategory);

        // Show warning with animation when duplicate is detected
        if (duplicateInSameCategory) {
          setShowDuplicateWarning(true);
        } else {
          setShowDuplicateWarning(false);
        }
      } else {
        const filtered = allExtras.filter(extra =>
          extra.name.toLowerCase().includes(formData.name.toLowerCase())
        );
        setFilteredExtras(filtered);
        setDuplicateInSameCategory(false);
        setShowDuplicateWarning(false);
      }
    } else {
      setFilteredExtras([]);
      setDuplicateInSameCategory(false);
      setShowDuplicateWarning(false);
    }
  }, [formData.name, formData.extraCategoryId, allExtras, isEditMode]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectExtra = (extra: Extra) => {
    // Check if this extra already exists in the current category
    const isDuplicate = extra.extraCategoryId === formData.extraCategoryId;

    onChange({
      ...formData,
      name: extra.name,
      description: extra.description || '',
      basePrice: extra.basePrice,
      isRemoval: extra.isRemoval,
      imageUrl: extra.imageUrl || '',
      status: extra.status,
    });
    setShowSuggestions(false);

    // If it's a duplicate, show warning
    if (isDuplicate) {
      setDuplicateInSameCategory(true);
      setShowDuplicateWarning(true);
    } else {
      setDuplicateInSameCategory(false);
      setShowDuplicateWarning(false);
    }
  };

  const handleNameChange = (value: string) => {
    onChange({ ...formData, name: value });
    setShowSuggestions(value.length > 0);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (duplicateInSameCategory && !isEditMode) {
      return; // Prevent submission if duplicate in same category
    }
    onSubmit(e);
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
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
            <form id="extraForm" onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('extrasManagement.extras.fields.parentCategory')}
                </label>
                <select
                  title="Parent Category"
                  value={formData.extraCategoryId}
                  onChange={(e) => onChange({ ...formData, extraCategoryId: parseInt(e.target.value) })}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5"
                  disabled={!!selectedCategoryId}
                >
                  <option value={0}>{t('extrasManagement.extras.fields.selectCategory')}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duplicate Warning Banner with Transition */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  showDuplicateWarning ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                        {t('extrasManagement.extras.duplicateWarning') || 'Extra Already Exists'}
                      </h3>
                      <div className="mt-1 text-sm text-red-700 dark:text-red-400">
                        {t('extrasManagement.extras.duplicateMessage') || 'This extra already exists in the selected category. Please choose a different name.'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('extrasManagement.extras.fields.itemName')}
                  </label>
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      onFocus={() => formData.name && !isEditMode && setShowSuggestions(true)}
                      className={`w-full rounded-lg border ${
                        duplicateInSameCategory
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 px-3 ${
                        duplicateInSameCategory ? 'focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      placeholder={t('extrasManagement.extras.fields.itemNamePlaceholder')}
                    />
                    {duplicateInSameCategory && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>

                 

                  {/* Autocomplete Suggestions */}
                  {showSuggestions && filteredExtras.length > 0 && !isEditMode && (
                    <div
                      ref={suggestionsRef}
                      className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto"
                    >
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
                        Select from existing extras or create new
                      </div>
                      {filteredExtras.map((extra) => {
                        const extraCategory = categories.find(cat => cat.id === extra.extraCategoryId);
                        const isSameCategory = extra.extraCategoryId === formData.extraCategoryId;

                        return (
                          <button
                            key={extra.id}
                            type="button"
                            onClick={() => handleSelectExtra(extra)}
                            disabled={isSameCategory && extra.name.toLowerCase() === formData.name.toLowerCase()}
                            className={`w-full text-left px-3 py-2 border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors ${
                              isSameCategory && extra.name.toLowerCase() === formData.name.toLowerCase()
                                ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
                                : 'hover:bg-blue-50 dark:hover:bg-gray-600'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {extra.name}
                                  </div>
                                  {isSameCategory && extra.name.toLowerCase() === formData.name.toLowerCase() && (
                                    <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-0.5 rounded">
                                      Already in Category
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 font-medium">
                                  {extraCategory?.categoryName || 'Unknown Category'}
                                </div>
                                {extra.description && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {extra.description}
                                  </div>
                                )}
                              </div>
                              <div className="ml-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                                {extra.basePrice.toFixed(2)}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('extrasManagement.extras.fields.price')}
                  </label>
                  <div className="relative">
                    <input
                      title="Price"
                      type="text"
                      inputMode="decimal"
                      required
                      value={formData.basePrice}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*\.?\d*$/.test(val)) {
                          onChange({ ...formData, basePrice: val === '' ? 0 : parseFloat(val) || 0 });
                        }
                      }}
                      className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 pl-2 pr-3"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('extrasManagement.extras.fields.description')}
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => onChange({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-3"
                  placeholder={t('extrasManagement.extras.fields.descriptionPlaceholder')}
                />
              </div>

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
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
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

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status}
                    onChange={(e) => onChange({ ...formData, status: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t('extrasManagement.extras.fields.activeLabel')}
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isRemoval}
                    onChange={(e) => onChange({ ...formData, isRemoval: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
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
              disabled={loading || uploading || (duplicateInSameCategory && !isEditMode)}
              className={`inline-flex justify-center rounded-lg border border-transparent shadow-sm px-5 py-2.5 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm transition-all duration-200 ${
                duplicateInSameCategory && !isEditMode
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-60'
                  : 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
              title={duplicateInSameCategory && !isEditMode ? t('extrasManagement.extras.duplicateWarning') || 'Extra already exists in this category' : ''}
            >
              {loading || uploading
                ? t('extrasManagement.processing')
                : duplicateInSameCategory && !isEditMode
                ? t('extrasManagement.extras.alreadyExists') || 'Already Exists'
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
