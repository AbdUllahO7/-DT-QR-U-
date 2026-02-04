import { useState, useEffect } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { logger } from "../../../utils/logger";
import { httpClient } from "../../../utils/http";
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X, AlertCircle, CheckCircle2, Loader2, Tag } from "lucide-react";
import { CreateCategoryFormData, CreateCategoryModalProps } from "../../../types/BranchManagement/type";
import { languageService } from "../../../services/LanguageService";
import { MultiLanguageInput } from "../../common/MultiLanguageInput";
import { useTranslatableFields, TranslatableFieldValue } from "../../../hooks/useTranslatableFields";
import { categoryTranslationService } from "../../../services/Translations/CategoryTranslationService";

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t, isRTL } = useLanguage();
  const translationHook = useTranslatableFields();

  // Supported languages - dynamically loaded
  const [supportedLanguages, setSupportedLanguages] = useState<any[]>([]);
  const [defaultLanguage, setDefaultLanguage] = useState<string>('en');

  // Translation states
  const [categoryNameTranslations, setCategoryNameTranslations] = useState<TranslatableFieldValue>({});

  const [formData, setFormData] = useState<CreateCategoryFormData>({
    categoryName: '',
    status: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFocused, setIsFocused] = useState<Record<string, boolean>>({});

  // Load languages on mount
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const languagesData = await languageService.getRestaurantLanguages();

        // Deduplicate languages by code
        const uniqueLanguages = (languagesData.availableLanguages || []).reduce((acc: any[], lang: any) => {
          if (!acc.find((l: any) => l.code === lang.code)) {
            acc.push(lang);
          }
          return acc;
        }, []);

        setSupportedLanguages(uniqueLanguages);
        setDefaultLanguage(languagesData.defaultLanguage || 'en');

        // Initialize empty translations
        const languageCodes = uniqueLanguages.map((lang: any) => lang.code);
        setCategoryNameTranslations(translationHook.getEmptyTranslations(languageCodes));
      } catch (error) {
        logger.error('Failed to load languages', error, { prefix: 'CreateCategoryModal' });
      }
    };
    loadLanguages();
  }, []);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        categoryName: '',
        status: true,
      });

      // Reset translations
      const languageCodes = supportedLanguages.map((lang: any) => lang.code);
      setCategoryNameTranslations(translationHook.getEmptyTranslations(languageCodes));
      setErrors({});
    }
  }, [isOpen, supportedLanguages]);

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = t('createCategoryModal.form.categoryName.required');
    } else if (formData.categoryName.trim().length < 2) {
      newErrors.categoryName = t('createCategoryModal.validation.nameMinLength');
    } else if (formData.categoryName.trim().length > 50) {
      newErrors.categoryName = t('createCategoryModal.validation.nameMaxLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof CreateCategoryFormData, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        categoryName: formData.categoryName.trim(),
        status: formData.status,
      };

      logger.info('Kategori ekleme isteği gönderiliyor', { payload });

      const response = await httpClient.post('/api/categories', payload);

      logger.info('Kategori başarıyla eklendi', { data: response.data });

      // WORKAROUND: API might return malformed ID, so we need to fetch the category list to get the real ID
      let categoryId: number | null = null;

      if (response.data?.id && typeof response.data.id === 'number') {
        categoryId = response.data.id;
      } else {
        logger.info('Fetching categories to get newly created category ID', { prefix: 'CreateCategoryModal' });

        // Fetch all categories to find the newly created one
        const categoriesResponse = await httpClient.get('/api/categories');
        const categories = categoriesResponse.data;

        // Find the newly created category by matching properties
        const newCategory = categories.find((cat: any) =>
          cat.categoryName === formData.categoryName.trim() &&
          cat.status === formData.status
        );

        if (newCategory?.categoryId && typeof newCategory.categoryId === 'number') {
          categoryId = newCategory.categoryId;
          logger.info('Found newly created category', { categoryId }, { prefix: 'CreateCategoryModal' });
        }
      }

      // Save translations if we have a valid category ID
      if (categoryId) {
        try {
          const translationData = Object.keys(categoryNameTranslations)
            .filter(lang => lang !== defaultLanguage)
            .filter(lang => categoryNameTranslations[lang])
            .map(languageCode => ({
              categoryId: categoryId!,
              languageCode,
              categoryName: categoryNameTranslations[languageCode] || undefined,
            }));

          if (translationData.length > 0) {
            await categoryTranslationService.batchUpsertCategoryTranslations({
              translations: translationData
            });
            logger.info('Category translations saved', null, { prefix: 'CreateCategoryModal' });
          }
        } catch (error) {
          logger.error('Failed to save category translations', error, { prefix: 'CreateCategoryModal' });
          // Don't fail the whole operation if translations fail
        }
      } else {
        logger.warn('Could not get category ID, skipping translation save', { prefix: 'CreateCategoryModal' });
      }

      // Success callback'i çağır
      onSuccess();

      // Form'u sıfırla
      setFormData({
        categoryName: '',
        status: true,
      });
      setErrors({});
      onClose();
    } catch (error: any) {
      logger.error('❌ Kategori eklenirken hata:', error);
      logger.error('❌ Kategori eklenirken detaylı hata:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // API'den gelen spesifik hataları işle
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;
        setErrors(apiErrors);
      } else if (error.response?.data?.message) {
        const apiMessage = error.response.data.message;
        
        if (error.response?.status === 400) {
          if (apiMessage.toLowerCase().includes('already exists') || 
              apiMessage.toLowerCase().includes('zaten mevcut') ||
              apiMessage.toLowerCase().includes('duplicate')) {
            setErrors({
              categoryName: t('createCategoryModal.errors.categoryExists')
            });
          } else if (apiMessage.toLowerCase().includes('invalid') || 
                     apiMessage.toLowerCase().includes('geçersiz')) {
            setErrors({
              general: t('createCategoryModal.errors.invalidData')
            });
          } else {
            setErrors({
              general: apiMessage || t('createCategoryModal.errors.general')
            });
          }
        } else if (error.response?.status === 500) {
          setErrors({
            general: t('createCategoryModal.errors.serverError')
          });
        } else {
          setErrors({
            general: apiMessage || t('createCategoryModal.errors.general')
          });
        }
      } else if (error.message?.includes('network') || error.message?.includes('Network')) {
        setErrors({
          general: t('createCategoryModal.errors.networkError')
        });
      } else {
        setErrors({
          general: t('createCategoryModal.errors.unknownError')
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
          {/* Enhanced Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-lg"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-3xl"></div>
              
              {/* Modal */}
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Header - Enhanced Design */}
                <div className="relative overflow-hidden">
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600"></div>
                  
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative px-8 py-8">
                    <button
                      onClick={onClose}
                      type="button"
                      className={`absolute top-6 z-50 ${isRTL ? 'left-6' : 'right-6'} p-2.5 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110 text-white`}
                      aria-label={t('createCategoryModal.accessibility.closeModal')}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  
                    <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {/* Icon Container */}
                      <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", delay: 0.2, duration: 0.6 }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-white/30 blur-xl rounded-2xl"></div>
                        <div className="relative p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg">
                          <Sparkles className="w-8 h-8 text-white" />
                        </div>
                      </motion.div>
                      
                      {/* Text */}
                      <div className="flex-1 pt-1">
                        <motion.h3 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-2xl font-bold text-white mb-2"
                        >
                          {t('createCategoryModal.title')}
                        </motion.h3>
                        <motion.p 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                          className="text-white/80 text-sm leading-relaxed"
                        >
                          {t('createCategoryModal.subtitle')}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Content - Enhanced Design */}
                <div 
                  className="p-8 space-y-6"
                  aria-label={t('createCategoryModal.accessibility.formTitle')}
                >
                  
                  {/* General Error - Enhanced */}
                  <AnimatePresence>
                    {errors.general && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="relative overflow-hidden rounded-2xl"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10"></div>
                        <div className="relative p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
                          <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="p-1.5 bg-red-100 dark:bg-red-800/30 rounded-lg">
                              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
                                {t('createCategoryModal.errors.errorLabel')}
                              </p>
                              <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Category categoryName - Multi-language Input */}
                  <div className="space-y-2">
                    <MultiLanguageInput
                      label={t('createCategoryModal.form.categoryName.label')}
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
                      placeholder={t('createCategoryModal.form.categoryName.placeholder')}
                      defaultLanguage={defaultLanguage}
                      required={true}
                    />

                    {/* Error Message */}
                    <AnimatePresence>
                      {errors.categoryName && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          id="categoryName-error"
                          className={`flex items-center gap-2 text-sm text-red-600 dark:text-red-400 ${isRTL ? 'flex-row-reverse' : ''}`}
                          role="alert"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.categoryName}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Status Toggle - Enhanced */}
                  <div className="relative rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 p-5 border border-gray-200 dark:border-gray-600">
                    <label className={`flex items-center gap-4 cursor-pointer group ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={formData.status}
                          onChange={(e) => handleChange('status', e.target.checked)}
                          className="sr-only peer"
                          aria-describedby="status-description"
                        />
                        {/* Custom Toggle Switch */}
                        <div className="w-14 h-7 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-600 shadow-inner"></div>
                      </div>
                      
                      <div className="flex-1">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white block mb-1">
                          {t('createCategoryModal.form.status.label')}
                        </span>
                        <p 
                          id="status-description" 
                          className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed"
                        >
                          {t('createCategoryModal.form.status.description')}
                        </p>
                      </div>
                      
                     
                    </label>
                  </div>

                  {/* Actions - Enhanced Buttons */}
                  <div className={`flex gap-3 pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-4 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('createCategoryModal.buttons.cancel')}
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting || !formData.categoryName.trim()}
                      className="flex-1 px-6 py-4 text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-primary-500/50 disabled:hover:shadow-none relative overflow-hidden group"
                      aria-describedby={isSubmitting ? 'submit-loading' : undefined}
                    >
                      {/* Button Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      
                      <span className={`relative flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span id="submit-loading">{t('createCategoryModal.buttons.creating')}</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            <span>{t('createCategoryModal.buttons.create')}</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateCategoryModal;