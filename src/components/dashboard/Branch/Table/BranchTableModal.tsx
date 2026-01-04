import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Table, Users } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { logger } from '../../../../utils/logger';
import { languageService } from '../../../../services/LanguageService';
import { MultiLanguageInput } from '../../../common/MultiLanguageInput';
import { useTranslatableFields, TranslatableFieldValue } from '../../../../hooks/useTranslatableFields';
import { tableTranslationService } from '../../../../services/Translations/TableTranslationService';
import { TableData } from '../../../../types/BranchManagement/type';

interface TableFormData {
  menuTableName: string;
  capacity: number;
  isActive: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categoryId: number;
  onSuccess?: () => void;
  editingTable?: TableData | null;
  isEditMode?: boolean;
  onSubmit: (categoryId: number, formData: TableFormData, translations: TranslatableFieldValue, defaultLanguage: string) => Promise<void>;
}

const BranchTableModal: React.FC<Props> = ({
  isOpen,
  onClose,
  categoryId,
  onSuccess,
  editingTable = null,
  isEditMode = false,
  onSubmit
}) => {
  const { t, isRTL } = useLanguage();
  const translationHook = useTranslatableFields();

  // Supported languages - dynamically loaded
  const [supportedLanguages, setSupportedLanguages] = useState<any[]>([]);
  const [defaultLanguage, setDefaultLanguage] = useState<string>('en');

  // Translation states
  const [tableNameTranslations, setTableNameTranslations] = useState<TranslatableFieldValue>({});

  const [formData, setFormData] = useState<TableFormData>({
    menuTableName: '',
    capacity: 4,
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.menuTableName.trim()) {
      newErrors.menuTableName = t('BranchTableModal.tableNameRequired') || 'Table name is required';
    }
    if (formData.capacity < 1) {
      newErrors.capacity = t('BranchTableModal.capacityRequired') || 'Capacity must be at least 1';
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
        setTableNameTranslations(translationHook.getEmptyTranslations(languageCodes));
      } catch (error) {
        console.error('Failed to load languages:', error);
      }
    };
    loadLanguages();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const loadTableData = async () => {
      if (isEditMode && editingTable) {
        setFormData({
          menuTableName: editingTable.menuTableName,
          capacity: editingTable.capacity,
          isActive: editingTable.isActive,
        });

        // Load existing translations
        try {
          const response = await tableTranslationService.getTableTranslations(editingTable.id);
          console.log("translations response", response);

          const tableNameTrans: TranslatableFieldValue = {
            [defaultLanguage]: editingTable.menuTableName
          };

          // Handle the API response structure: { baseValues: {...}, translations: [...] }
          const translationsArray = response.translations || [];

          translationsArray.forEach(translation => {
            if (translation.menuTableName) {
              tableNameTrans[translation.languageCode] = translation.menuTableName;
            }
          });

          setTableNameTranslations(tableNameTrans);
        } catch (error) {
          logger.error('Failed to load table translations', error, { prefix: 'BranchTableModal' });
          // Initialize with default language value on error
          const tableNameTrans: TranslatableFieldValue = {
            [defaultLanguage]: editingTable.menuTableName
          };
          setTableNameTranslations(tableNameTrans);
        }
      } else {
        setFormData({
          menuTableName: '',
          capacity: 4,
          isActive: true,
        });

        // Reset translations for new table - initialize with empty default language value
        const emptyTranslations: TranslatableFieldValue = {
          [defaultLanguage]: ''
        };
        setTableNameTranslations(emptyTranslations);
      }
      setErrors({});
    };

    loadTableData();
  }, [isOpen, isEditMode, editingTable, supportedLanguages, defaultLanguage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, type } = target;
    const value = type === 'checkbox' ? target.checked : type === 'number' ? parseInt(target.value) : target.value;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(categoryId, formData, tableNameTranslations, defaultLanguage);

      onSuccess && onSuccess();
      onClose();

      setFormData({
        menuTableName: '',
        capacity: 4,
        isActive: true,
      });
      setErrors({});
    } catch (error: any) {
      logger.error('Error saving table:', error);

      if (error.response?.status === 400) {
        const apiErrors = error.response?.data?.errors;
        if (apiErrors) {
          const fieldErrors: Record<string, string> = {};
          Object.keys(apiErrors).forEach(key => {
            const fieldName = key.toLowerCase();
            if (fieldName.includes('menutablename')) {
              fieldErrors.menuTableName = apiErrors[key][0] || t('BranchTableModal.tableNameRequired');
            } else if (fieldName.includes('capacity')) {
              fieldErrors.capacity = t('BranchTableModal.capacityRequired');
            } else {
              fieldErrors.general = apiErrors[key][0] || t('BranchTableModal.invalidData');
            }
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: error.response?.data?.message || t('BranchTableModal.invalidData') });
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
          aria-label={t('BranchTableModal.accessibility.modal') || 'Table Modal'}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/40 to-indigo-900/30 backdrop-blur-md"
            onClick={onClose}
          />

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
              <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 dark:from-primary-600 dark:via-primary-700 dark:to-purple-700 p-8 text-white overflow-hidden">
                <button
                  onClick={onClose}
                  className={`absolute top-6 p-2.5 hover:bg-white/25 dark:hover:bg-white/15 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90 group z-10 ${isRTL ? 'left-6' : 'right-6'}`}
                  aria-label={t('BranchTableModal.accessibility.close') || 'Close'}
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
                    <Table className="w-7 h-7 drop-shadow-lg" />
                  </motion.div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-2xl font-bold drop-shadow-md"
                    >
                      {isEditMode ? t('BranchTableModal.editTitle') || 'Edit Table' : t('BranchTableModal.addTitle') || 'Add New Table'}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-primary-50/90 text-sm mt-1 drop-shadow"
                    >
                      {isEditMode ? t('BranchTableModal.editSubtitle') || 'Update table details' : t('BranchTableModal.addSubtitle') || 'Create a new table'}
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
                    label={t('BranchTableModal.tableName') || 'Table Name'}
                    value={tableNameTranslations}
                    onChange={(newTranslations) => {
                      setTableNameTranslations(newTranslations);
                      // Update base formData with default language value for validation
                      const val = newTranslations[defaultLanguage] || '';
                      setFormData(prev => ({ ...prev, menuTableName: val }));

                      // Clear error if exists
                      if (errors.menuTableName && val) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.menuTableName;
                          return newErrors;
                        });
                      }
                    }}
                    languages={supportedLanguages}
                    placeholder={t('BranchTableModal.tableNamePlaceholder') || 'Enter table name'}
                    defaultLanguage={defaultLanguage}
                    required={true}
                  />
                  {errors.menuTableName && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-1"
                    >
                      {errors.menuTableName}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 ${isRTL ? 'text-right' : ''}`}>
                    <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    {t('BranchTableModal.capacity') || 'Capacity'}
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      min="1"
                      max="20"
                      placeholder={t('BranchTableModal.capacityPlaceholder') || 'Enter capacity'}
                      className={`
                        w-full px-5 py-3.5 rounded-2xl border-2 transition-all duration-300
                        bg-white dark:bg-gray-800/50
                        text-gray-900 dark:text-gray-100
                        placeholder-gray-400 dark:placeholder-gray-500
                        border-gray-200 dark:border-gray-600
                        hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg hover:shadow-primary-500/10
                        focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 focus:shadow-xl focus:shadow-primary-500/20
                        ${errors.capacity
                          ? 'border-red-400 dark:border-red-500 focus:border-red-500 focus:ring-red-500/30'
                          : ''
                        }
                        ${isRTL ? 'text-right' : 'text-left'}
                      `}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>
                  {errors.capacity && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-1"
                    >
                      {errors.capacity}
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
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t('BranchTableModal.status') || 'Table Status'}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {formData.isActive ? t('BranchTableModal.active') || 'Table is active' : t('BranchTableModal.inactive') || 'Table is inactive'}
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
                    {t('BranchTableModal.cancel') || 'Cancel'}
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
                        {t('BranchTableModal.saving') || 'Saving...'}
                      </div>
                    ) : (
                      isEditMode ? t('BranchTableModal.update') || 'Update Table' : t('BranchTableModal.add') || 'Add Table'
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

export default BranchTableModal;
