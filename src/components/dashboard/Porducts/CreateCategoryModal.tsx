import { useState } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { logger } from "../../../utils/logger";
import { httpClient } from "../../../utils/http";
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X } from "lucide-react";
import { CreateCategoryFormData, CreateCategoryModalProps } from "../../../types/BranchManagement/type";

// CreateCategoryModal Component


const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState<CreateCategoryFormData>({
    categoryName: '',
    status: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        // Field-specific validation errors
        const apiErrors = error.response.data.errors;
        setErrors(apiErrors);
      } else if (error.response?.data?.message) {
        // API'den gelen genel hata mesajı
        const apiMessage = error.response.data.message;
        
        // Özel hata durumları için lokalize mesajlar
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
                <div className="absolute bg-gradient-to-br from-white/10 to-transparent" />
                <button
                  onClick={onClose}
                  type="button"
                  className={`absolute top-4 z-50 ${isRTL ? 'left-4' : 'right-4'} p-2 hover:bg-white/20 rounded-full transition-colors duration-200`}
                  aria-label={t('createCategoryModal.accessibility.closeModal')}
                >
                  <X className="w-5 h-5" />
                </button>
              
                <div className={`flex items-center gap-3 relative ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{t('createCategoryModal.title')}</h3>
                    <p className="text-primary-100 text-sm">{t('createCategoryModal.subtitle')}</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form 
                onSubmit={handleSubmit} 
                className="p-6 space-y-6"
                aria-label={t('createCategoryModal.accessibility.formTitle')}
              >
                
                {/* General Error */}
                {errors.general && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                      {t('createCategoryModal.errors.errorLabel')}
                    </p>
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.general}</p>
                  </div>
                )}

                {/* Category Name */}
                <div>
                  <label 
                    htmlFor="categoryName" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {t('createCategoryModal.form.categoryName.label')}
                  </label>
                  <input
                    type="text"
                    id="categoryName"
                    value={formData.categoryName}
                    onChange={(e) => handleChange('categoryName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                      errors.categoryName
                        ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                    placeholder={t('createCategoryModal.form.categoryName.placeholder')}
                    aria-describedby={errors.categoryName ? 'categoryName-error' : undefined}
                    aria-required="true"
                  />
                  {errors.categoryName && (
                    <p 
                      id="categoryName-error" 
                      className="mt-1 text-sm text-red-600 dark:text-red-400"
                      role="alert"
                    >
                      {errors.categoryName}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className={`flex items-center gap-3 cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <input
                      type="checkbox"
                      checked={formData.status}
                      onChange={(e) => handleChange('status', e.target.checked)}
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      aria-describedby="status-description"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('createCategoryModal.form.status.label')}
                    </span>
                  </label>
                  <p 
                    id="status-description" 
                    className={`mt-1 text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    {t('createCategoryModal.form.status.description')}
                  </p>
                </div>

                {/* Actions */}
                <div className={`flex gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
                  >
                    {t('createCategoryModal.buttons.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed rounded-lg font-medium transition-colors duration-200"
                    aria-describedby={isSubmitting ? 'submit-loading' : undefined}
                  >
                    {isSubmitting ? (
                      <span id="submit-loading">{t('createCategoryModal.buttons.creating')}</span>
                    ) : (
                      t('createCategoryModal.buttons.create')
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateCategoryModal;