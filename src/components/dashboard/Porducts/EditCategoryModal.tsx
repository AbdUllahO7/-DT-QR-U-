import { useState } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { productService } from "../../../services/productService";
import { logger } from "../../../utils/logger";
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, Tag, FileText, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Category } from "../../../types/BranchManagement/type";

export const EditCategoryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category: Category;
}> = ({ isOpen, onClose, onSuccess, category }) => {
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState({
    categoryName: category.categoryName,
    description: category.description || '',
    status: category.status
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string>('');

  const handleSubmit = async () => {
    if (!formData.categoryName.trim()) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      await productService.updateCategory(category.categoryId, {
        categoryName: formData.categoryName,
        description: formData.description,
        status: formData.status
      });
      logger.info('Kategori başarıyla güncellendi', { categoryId: category.categoryId });
      onSuccess();
      onClose();
    } catch (err: any) {
      logger.error('Kategori güncelleme hatası:', err);
      setError(t('editCategoryModal.errors.updateFailed'));
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
  const descriptionLength = formData.description.length;
  const maxNameLength = 50;
  const maxDescLength = 200;
  const isNameValid = nameLength >= 2 && nameLength <= maxNameLength;

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
                      aria-label={t('editCategoryModal.accessibility.closeModal')}
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
                          <Edit3 className="w-8 h-8 text-white" />
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
                          {t('editCategoryModal.title')}
                        </motion.h3>
                        <motion.p 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                          className="text-white/80 text-sm leading-relaxed"
                        >
                          {t('editCategoryModal.subtitle') || 'Update category information'}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div 
                  className="p-8 space-y-6"
                  aria-label={t('editCategoryModal.accessibility.formTitle')}
                >
                  
                  {/* Error Display */}
                  <AnimatePresence>
                    {error && (
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
                                {t('editCategoryModal.errors.errorLabel') || 'Error'}
                              </p>
                              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Category Name */}
                  <div className="space-y-2">
                    <label 
                      htmlFor="categoryName" 
                      className={`flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <Tag className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      <span>{t('editCategoryModal.form.categoryName.label')}</span>
                      <span className="text-red-500">*</span>
                    </label>
                    
                    <div className="relative">
                      <input
                        type="text"
                        id="categoryName"
                        value={formData.categoryName}
                        onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                        onFocus={() => setFocusedField('categoryName')}
                        onBlur={() => setFocusedField('')}
                        onKeyPress={handleKeyPress}
                        maxLength={maxNameLength}
                        className={`w-full px-5 py-4 border-2 rounded-2xl transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                          focusedField === 'categoryName'
                            ? 'border-primary-500 dark:border-primary-400 bg-primary-50/50 dark:bg-primary-900/10 focus:ring-4 focus:ring-primary-500/20'
                            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-gray-400 dark:hover:border-gray-500'
                        } focus:outline-none`}
                        placeholder={t('editCategoryModal.form.categoryName.placeholder')}
                        aria-required="true"
                      />
                      
                      {/* Character Counter */}
                      <div className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 flex items-center gap-2`}>
                        {formData.categoryName && isNameValid && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </motion.div>
                        )}
                        <span className={`text-xs font-medium ${
                          nameLength > maxNameLength 
                            ? 'text-red-600 dark:text-red-400' 
                            : nameLength >= maxNameLength * 0.8 
                            ? 'text-yellow-600 dark:text-yellow-400' 
                            : 'text-gray-400 dark:text-gray-500'
                        }`}>
                          {nameLength}/{maxNameLength}
                        </span>
                      </div>
                    </div>

                
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label 
                      htmlFor="description" 
                      className={`flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <FileText className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      <span>{t('editCategoryModal.form.description.label')}</span>
                    </label>
                    
                    <div className="relative">
                      <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        onFocus={() => setFocusedField('description')}
                        onBlur={() => setFocusedField('')}
                        maxLength={maxDescLength}
                        rows={4}
                        className={`w-full px-5 py-4 border-2 rounded-2xl transition-all duration-300 resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                          focusedField === 'description'
                            ? 'border-primary-500 dark:border-primary-400 bg-primary-50/50 dark:bg-primary-900/10 focus:ring-4 focus:ring-primary-500/20'
                            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-gray-400 dark:hover:border-gray-500'
                        } focus:outline-none`}
                        placeholder={t('editCategoryModal.form.description.placeholder')}
                      />
                      
                      {/* Character Counter */}
                      <div className={`absolute ${isRTL ? 'left-4' : 'right-4'} bottom-3 text-xs text-gray-400`}>
                        {descriptionLength}/{maxDescLength}
                      </div>
                    </div>

                   
                  </div>

                  {/* Status Toggle - Enhanced */}
                  <div className="relative rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 p-5 border border-gray-200 dark:border-gray-600">
                    <label className={`flex items-center gap-4 cursor-pointer group ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                          className="sr-only peer"
                          aria-describedby="status-description"
                        />
                        {/* Custom Toggle Switch */}
                        <div className="w-14 h-7 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-600 shadow-inner"></div>
                      </div>
                      
                      <div className="flex-1">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white block mb-1">
                          {t('editCategoryModal.form.status.label')}
                        </span>
                        <p 
                          id="status-description" 
                          className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed"
                        >
                          {t('editCategoryModal.form.status.description')}
                        </p>
                      </div>
                      
                      {/* Status Badge */}
                     
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
                      {t('editCategoryModal.buttons.cancel')}
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
                            <span id="submit-loading">{t('editCategoryModal.buttons.saving')}</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            <span>{t('editCategoryModal.buttons.save')}</span>
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