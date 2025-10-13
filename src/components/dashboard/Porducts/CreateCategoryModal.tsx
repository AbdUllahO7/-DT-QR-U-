import { useState } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { logger } from "../../../utils/logger";
import { httpClient } from "../../../utils/http";
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X, AlertCircle, CheckCircle2, Loader2, Tag } from "lucide-react";
import { CreateCategoryFormData, CreateCategoryModalProps } from "../../../types/BranchManagement/type";

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState<CreateCategoryFormData>({
    categoryName: '',
    status: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFocused, setIsFocused] = useState<Record<string, boolean>>({});

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

  const nameLength = formData.categoryName.length;
  const maxLength = 50;
  const isNameValid = nameLength >= 2 && nameLength <= maxLength;

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

                  {/* Category Name - Enhanced Input */}
                  <div className="space-y-2">
                    <label 
                      htmlFor="categoryName" 
                      className={`flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <Tag className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      <span>{t('createCategoryModal.form.categoryName.label')}</span>
                      <span className="text-red-500">*</span>
                    </label>
                    
                    <div className="relative">
                      <input
                        type="text"
                        id="categoryName"
                        value={formData.categoryName}
                        onChange={(e) => handleChange('categoryName', e.target.value)}
                        onFocus={() => setIsFocused({ ...isFocused, categoryName: true })}
                        onBlur={() => setIsFocused({ ...isFocused, categoryName: false })}
                        onKeyPress={handleKeyPress}
                        maxLength={maxLength}
                        className={`w-full px-5 py-4 border-2 rounded-2xl transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                          errors.categoryName
                            ? 'border-red-300 dark:border-red-600 bg-red-50/50 dark:bg-red-900/10 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                            : isFocused.categoryName
                            ? 'border-primary-500 dark:border-primary-400 bg-primary-50/50 dark:bg-primary-900/10 focus:ring-4 focus:ring-primary-500/20'
                            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-gray-400 dark:hover:border-gray-500'
                        } focus:outline-none`}
                        placeholder={t('createCategoryModal.form.categoryName.placeholder')}
                        aria-describedby={errors.categoryName ? 'categoryName-error' : undefined}
                        aria-required="true"
                      />
                      
                      {/* Character Counter */}
                      <div className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 flex items-center gap-2`}>
                        {formData.categoryName && isNameValid && !errors.categoryName && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </motion.div>
                        )}
                        <span className={`text-xs font-medium ${
                          nameLength > maxLength 
                            ? 'text-red-600 dark:text-red-400' 
                            : nameLength >= maxLength * 0.8 
                            ? 'text-yellow-600 dark:text-yellow-400' 
                            : 'text-gray-400 dark:text-gray-500'
                        }`}>
                          {nameLength}/{maxLength}
                        </span>
                      </div>
                    </div>
                    
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