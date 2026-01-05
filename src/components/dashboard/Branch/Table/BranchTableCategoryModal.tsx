import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Tag,
  Palette,
  FileText,
  Building2,
  Sparkles,
  Home,
  Trees,
  CloudSun,
  Umbrella
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { logger } from '../../../../utils/logger';
import { tableService } from '../../../../services/Branch/branchTableService';
import { colorPresets } from '../../../../types/BranchManagement/type';
import { languageService } from '../../../../services/LanguageService';
import { MultiLanguageInput } from '../../../common/MultiLanguageInput';
import { MultiLanguageTextArea } from '../../../common/MultiLanguageTextArea';
import { useTranslatableFields, TranslatableFieldValue } from '../../../../hooks/useTranslatableFields';
import { tableCategoryTranslationService } from '../../../../services/Translations/TableCategoryTranslationService';

interface TableCategoryFormData {
  categoryName: string;
  description: string;
  colorCode: string;
  iconClass: string;
  displayOrder: number;
  isActive: boolean;
}

interface TableCategory {
  id: number;
  categoryName: string;
  description?: string;
  colorCode: string;
  iconClass: string;
  displayOrder: number;
  isActive: boolean;
  rowVersion?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  branchId: number;
  onSuccess?: () => void;
  editingCategory?: TableCategory | null;
  isEditMode?: boolean;
}

const areaOptions = [
  { value: 'indoor', label: 'Indoor', icon: Home },
  { value: 'outdoor', label: 'Outdoor', icon: Umbrella },
  { value: 'terrace', label: 'Terrace', icon: CloudSun },
  { value: 'garden', label: 'Garden', icon: Trees },
];

const BranchTableCategoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  branchId,
  onSuccess,
  editingCategory = null,
  isEditMode = false
}) => {
  const { t, isRTL } = useLanguage();
  const translationHook = useTranslatableFields();

  // Supported languages - dynamically loaded
  const [supportedLanguages, setSupportedLanguages] = useState<any[]>([]);
  const [defaultLanguage, setDefaultLanguage] = useState<string>('en');

  // Translation states
  const [categoryNameTranslations, setCategoryNameTranslations] = useState<TranslatableFieldValue>({});
  const [descriptionTranslations, setDescriptionTranslations] = useState<TranslatableFieldValue>({});

  const [formData, setFormData] = useState<TableCategoryFormData>({
    categoryName: '',
    description: '',
    colorCode: '#3b82f6',
    iconClass: 'indoor',
    displayOrder: 0,
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = t('TableCategoryModal.categoryNameRequired') || 'Category name is required';
    }
    if (!formData.iconClass) {
      newErrors.iconClass = t('TableCategoryModal.iconRequired') || 'Icon is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const languagesData = await languageService.getRestaurantLanguages();
        console.log("languagesData", languagesData);

        // Deduplicate languages by code
        const uniqueLanguages = (languagesData.availableLanguages || []).reduce((acc: any[], lang: any) => {
          if (!acc.find((l: any) => l.code === lang.code)) {
            acc.push(lang);
          }
          return acc;
        }, []);

        console.log("uniqueLanguages", uniqueLanguages);
        setSupportedLanguages(uniqueLanguages);
        setDefaultLanguage(languagesData.defaultLanguage || 'en');

        // Initialize empty translations
        const languageCodes = uniqueLanguages.map((lang: any) => lang.code);
        setCategoryNameTranslations(translationHook.getEmptyTranslations(languageCodes));
        setDescriptionTranslations(translationHook.getEmptyTranslations(languageCodes));
      } catch (error) {
        console.error('Failed to load languages:', error);
      }
    };
    loadLanguages();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const loadCategoryData = async () => {
      if (isEditMode && editingCategory) {
        setFormData({
          categoryName: editingCategory.categoryName,
          description: editingCategory.description || '',
          colorCode: editingCategory.colorCode || '#3b82f6',
          iconClass: editingCategory.iconClass || 'indoor',
          displayOrder: editingCategory.displayOrder || 0,
          isActive: editingCategory.isActive,
        });

        // Load existing translations
        try {
          const response = await tableCategoryTranslationService.getTableCategoryTranslations(editingCategory.id);
          console.log("category translations response", response);

          const categoryNameTrans: TranslatableFieldValue = {
            [defaultLanguage]: editingCategory.categoryName
          };
          const descriptionTrans: TranslatableFieldValue = {
            [defaultLanguage]: editingCategory.description || ''
          };

          // Handle the API response structure: { baseValues: {...}, translations: [...] }
          const translationsArray = response.translations || [];

          translationsArray.forEach(translation => {
            if (translation.categoryName) {
              categoryNameTrans[translation.languageCode] = translation.categoryName;
            }
            if (translation.description) {
              descriptionTrans[translation.languageCode] = translation.description;
            }
          });

          setCategoryNameTranslations(categoryNameTrans);
          setDescriptionTranslations(descriptionTrans);
        } catch (error) {
          logger.error('Failed to load table category translations', error, { prefix: 'BranchTableCategoryModal' });
          // Initialize with default language values on error
          const categoryNameTrans: TranslatableFieldValue = {
            [defaultLanguage]: editingCategory.categoryName
          };
          const descriptionTrans: TranslatableFieldValue = {
            [defaultLanguage]: editingCategory.description || ''
          };
          setCategoryNameTranslations(categoryNameTrans);
          setDescriptionTranslations(descriptionTrans);
        }
      } else {
        setFormData({
          categoryName: '',
          description: '',
          colorCode: '#3b82f6',
          iconClass: 'indoor',
          displayOrder: 0,
          isActive: true,
        });

        // Reset translations for new category
        const languageCodes = supportedLanguages.map((lang: any) => lang.code);
        setCategoryNameTranslations(translationHook.getEmptyTranslations(languageCodes));
        setDescriptionTranslations(translationHook.getEmptyTranslations(languageCodes));
      }
      setErrors({});
    };

    loadCategoryData();
  }, [isOpen, isEditMode, editingCategory, supportedLanguages]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, type } = target;
    const value = type === 'checkbox' ? target.checked : target.value;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleColorSelect = (color: string) => {
    setFormData(prev => ({ ...prev, colorCode: color }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let categoryId: number;

      if (isEditMode && editingCategory) {
        await tableService.updateCategory(editingCategory.id, {
          id: editingCategory.id,
          categoryName: formData.categoryName.trim(),
          colorCode: formData.colorCode,
          iconClass: formData.iconClass,
          displayOrder: editingCategory.displayOrder,
          isActive: formData.isActive,
          rowVersion: editingCategory.rowVersion,
        }, branchId);
        logger.info('Category updated successfully', { categoryId: editingCategory.id });
        categoryId = editingCategory.id;
      } else {
        const payload = {
          categoryName: formData.categoryName.trim(),
          colorCode: formData.colorCode,
          iconClass: formData.iconClass,
          displayOrder: formData.displayOrder,
          isActive: formData.isActive
        };

        await tableService.createCategory(payload);
        logger.info('Category created successfully', { prefix: 'BranchTableCategoryModal' });

        // WORKAROUND: API returns malformed ID (empty object), so we need to fetch
        // the category list to get the real ID of the newly created category
        logger.info('Fetching categories to get the newly created category ID', { prefix: 'BranchTableCategoryModal' });

        const categories = await tableService.getCategories(false, false);

        // Find the newly created category by matching all properties
        const newCategory = categories.find(cat =>
          cat.categoryName === formData.categoryName.trim() &&
          cat.colorCode === formData.colorCode &&
          cat.iconClass === formData.iconClass &&
          cat.isActive === formData.isActive
        );

        if (!newCategory || !newCategory.id || typeof newCategory.id !== 'number') {
          throw new Error('Could not find the newly created category');
        }

        categoryId = newCategory.id;
        logger.info('Found newly created category', { categoryId }, { prefix: 'BranchTableCategoryModal' });
      }

      // Save translations for table category
      try {
        // Log and validate categoryId before creating translations
        console.log('About to save translations - categoryId:', categoryId, 'type:', typeof categoryId);

        // Additional validation: ensure categoryId is a valid number
        if (!categoryId || typeof categoryId !== 'number' || isNaN(categoryId)) {
          console.error('Invalid categoryId detected:', categoryId);
          throw new Error(`Invalid category ID (${categoryId}) - cannot save translations`);
        }

        const translationData = Object.keys(categoryNameTranslations)
          .filter(lang => lang !== defaultLanguage)
          .filter(lang =>
            categoryNameTranslations[lang] ||
            descriptionTranslations[lang]
          )
          .map(languageCode => ({
            menuTableCategoryId: categoryId,
            languageCode,
            categoryName: categoryNameTranslations[languageCode] || undefined,
            description: descriptionTranslations[languageCode] || undefined,
          }));

        console.log('Translation data prepared:', translationData);

        if (translationData.length > 0) {
          await tableCategoryTranslationService.batchUpsertTableCategoryTranslations({
            translations: translationData
          });
          logger.info('Table category translations saved', null, { prefix: 'BranchTableCategoryModal' });
        }
      } catch (error) {
        console.error('Translation save failed:', error);
        logger.error('Failed to save table category translations', error, { prefix: 'BranchTableCategoryModal' });
        // Don't fail the whole operation if translations fail
      }

      onSuccess && onSuccess();
      onClose();

      setFormData({
        categoryName: '',
        description: '',
        colorCode: '#3b82f6',
        iconClass: 'indoor',
        displayOrder: 0,
        isActive: true,
      });
      setErrors({});
    } catch (error: any) {
      logger.error('Error saving category:', error);

      if (error.response?.status === 400) {
        const apiErrors = error.response?.data?.errors;
        if (apiErrors) {
          const fieldErrors: Record<string, string> = {};
          Object.keys(apiErrors).forEach(key => {
            const fieldName = key.toLowerCase();
            if (fieldName.includes('categoryname')) {
              fieldErrors.categoryName = apiErrors[key][0] || t('TableCategoryModal.categoryNameRequired');
            } else if (fieldName.includes('iconclass')) {
              fieldErrors.iconClass = t('TableCategoryModal.iconRequired');
            } else {
              fieldErrors.general = apiErrors[key][0] || t('TableCategoryModal.invalidData');
            }
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: error.response?.data?.message || t('TableCategoryModal.invalidData') });
        }
      } else {
        setErrors({ general: error.response?.data?.message || 'An error occurred' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={t('TableCategoryModal.accessibility.modal') || 'Table Category Modal'}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/40 to-indigo-900/30 backdrop-blur-md"
            onClick={onClose}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 8, repeat: Infinity, delay: 2, ease: "easeInOut" }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            />
          </motion.div>

          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
              className="relative w-full max-w-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400/30 to-purple-500/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/30 to-primary-500/30 rounded-full blur-3xl" />

              <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 dark:from-primary-600 dark:via-primary-700 dark:to-purple-700 p-8 text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
                </div>

                <button
                  onClick={onClose}
                  className={`absolute top-6 p-2.5 hover:bg-white/25 dark:hover:bg-white/15 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90 group z-10 ${isRTL ? 'left-6' : 'right-6'}`}
                  aria-label={t('TableCategoryModal.accessibility.close') || 'Close'}
                >
                  <X className="w-5 h-5 group-hover:drop-shadow-lg" />
                </button>

                <div className={`flex items-center gap-4 relative ${isRTL ? 'text-right' : ''}`}>
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="p-4 bg-white/25 backdrop-blur-sm rounded-2xl shadow-lg"
                  >
                    <Sparkles className="w-7 h-7 drop-shadow-lg" />
                  </motion.div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-2xl font-bold drop-shadow-md"
                    >
                      {isEditMode ? t('TableCategoryModal.addCategoryTitle') || 'Edit Area' : t('TableCategoryModal.addCategoryTitle') || 'Add New Area'}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-primary-50/90 text-sm mt-1 drop-shadow"
                    >
                      {isEditMode ? t('TableCategoryModal.addCategorySubtitle') || 'Update area details' : t('TableCategoryModal.addCategorySubtitle') || 'Create a new area for your tables'}
                    </motion.p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="relative p-8 space-y-6" role="form">
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/30 dark:to-red-800/20 border-l-4 border-red-500 dark:border-red-400 rounded-xl text-red-700 dark:text-red-300 text-sm font-medium shadow-sm"
                  >
                    {errors.general}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <MultiLanguageInput
                    label={t('TableCategoryModal.categoryName') || 'Area Name'}
                    value={categoryNameTranslations}
                    onChange={(newTranslations) => {
                      setCategoryNameTranslations(newTranslations);
                      // Update base formData with default language value for validation
                      const val = newTranslations[defaultLanguage] || '';
                      setFormData(prev => ({ ...prev, categoryName: val }));

                      // Clear error if exists
                      if (errors.categoryName && val) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.categoryName;
                          return newErrors;
                        });
                      }
                    }}
                    languages={supportedLanguages}
                    placeholder={t('TableCategoryModal.categoryNamePlaceholder') || 'Enter area name'}
                    defaultLanguage={defaultLanguage}
                    required={true}
                  />
                  {errors.categoryName && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-1"
                    >
                      {errors.categoryName}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <MultiLanguageTextArea
                    label={t('TableCategoryModal.description') || 'Description'}
                    value={descriptionTranslations}
                    onChange={(newTranslations) => {
                      setDescriptionTranslations(newTranslations);
                      // Update base formData with default language value
                      const val = newTranslations[defaultLanguage] || '';
                      setFormData(prev => ({ ...prev, description: val }));
                    }}
                    languages={supportedLanguages}
                    placeholder={t('TableCategoryModal.descriptionPlaceholder') || 'Enter description (optional)'}
                    defaultLanguage={defaultLanguage}
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <label className={`flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 ${isRTL ? 'text-right' : ''}`}>
                    <Palette className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    {t('TableCategoryModal.colorSelection') || 'Color Selection'}
                  </label>

                  <div
                    className="grid grid-cols-8 gap-2.5 p-4 bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-800/30 dark:to-gray-700/30 rounded-2xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
                    role="group"
                  >
                    {colorPresets.map((color) => (
                      <motion.button
                        key={color}
                        type="button"
                        onClick={() => handleColorSelect(color)}
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          w-9 h-9 rounded-xl border-2 transition-all duration-300 shadow-lg
                          ${formData.colorCode === color
                            ? 'border-white dark:border-gray-200 ring-4 ring-primary-500/50 shadow-2xl scale-110'
                            : 'border-gray-300/50 dark:border-gray-600/50 hover:border-white dark:hover:border-gray-300 hover:shadow-2xl'
                          }
                        `}
                        style={{
                          backgroundColor: color,
                          boxShadow: `0 4px 20px ${color}40`
                        }}
                      />
                    ))}
                  </div>

                  <div className={`flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/30 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="w-12 h-12 rounded-xl border-3 border-white dark:border-gray-600 overflow-hidden shadow-xl"
                      style={{
                        backgroundColor: formData.colorCode,
                        boxShadow: `0 8px 25px ${formData.colorCode}60`
                      }}
                    />
                    <input
                      title='Select color'
                      type="color"
                      name="colorCode"
                      value={formData.colorCode}
                      onChange={handleChange}
                      className="w-12 h-12 border-0 bg-transparent cursor-pointer rounded-xl"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-mono font-semibold bg-white/50 dark:bg-gray-900/50 px-3 py-1.5 rounded-lg">
                      {formData.colorCode}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className={`flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 ${isRTL ? 'text-right' : ''}`}>
                    <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    {t('TableCategoryModal.iconSelection') || 'Area Type'}
                  </label>
                  <div
                    className="grid grid-cols-4 gap-3"
                    role="group"
                  >
                    {areaOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, iconClass: option.value }))}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 shadow-md
                          ${formData.iconClass === option.value
                            ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/40 dark:to-primary-800/30 text-primary-700 dark:text-primary-300 shadow-xl shadow-primary-500/30 scale-105'
                            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-xl hover:shadow-primary-500/20'
                          }
                        `}
                      >
                        <option.icon className="w-8 h-8 mb-1" />
                        <span className="text-xs font-semibold">{t(option.label) || option.label}</span>
                      </motion.button>
                    ))}
                  </div>
                  {errors.iconClass && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-1"
                    >
                      {errors.iconClass}
                    </motion.p>
                  )}
                </div>

                {isEditMode && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100/80 dark:from-gray-800/50 dark:to-gray-700/30 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t('tableManagement.categories.deleteCategory') || 'Area Status'}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {formData.isActive ? t('tableManagement.descriptionActive') || 'Area is active' : t('tableManagement.descriptionInActive') || 'Area is inactive'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 shadow-lg ${
                        formData.isActive
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 shadow-primary-500/50'
                          : 'bg-gray-300 dark:bg-gray-600 shadow-gray-400/30'
                      }`}
                    >
                      <motion.span
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ${
                          isRTL
                            ? (formData.isActive ? 'translate-x-1' : 'translate-x-8')
                            : (formData.isActive ? 'translate-x-8' : 'translate-x-1')
                        }`}
                      />
                    </button>
                  </motion.div>
                )}

                <div className={`flex gap-4 pt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 shadow-md hover:shadow-lg"
                  >
                    {t('TableCategoryModal.cancel') || 'Cancel'}
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="flex-1 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 via-primary-500 to-purple-600 hover:from-primary-700 hover:via-primary-600 hover:to-purple-700 dark:from-primary-500 dark:via-primary-600 dark:to-purple-600 dark:hover:from-primary-600 dark:hover:via-primary-700 dark:hover:to-purple-700 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none shadow-xl hover:shadow-2xl shadow-primary-500/50 hover:shadow-primary-500/60"
                  >
                    {isSubmitting ? (
                      <div className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        {t('TableCategoryModal.saving') || 'Saving...'}
                      </div>
                    ) : (
                      isEditMode ? t('TableCategoryModal.update') || 'Update Area' : t('TableCategoryModal.addCategory') || 'Add Area'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BranchTableCategoryModal;
