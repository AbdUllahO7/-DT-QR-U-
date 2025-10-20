import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Tag, 
  Palette, 
  FileText, 
  Building2, 
  Users, 
  Sparkles 
} from 'lucide-react';
import { httpClient } from '../../../../utils/http';
import { restaurantService } from '../../../../services/restaurantService';
import { logger } from '../../../../utils/logger';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { colorPresets, iconOptions, RestaurantBranchDropdownItem, TableCategoryFormData, TableCategoryPayload, TableCategory } from '../../../../types/BranchManagement/type';
import { tableService } from '../../../../services/Branch/branchTableService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedBranch: RestaurantBranchDropdownItem | null;
  onSuccess?: () => void;
  editingCategory?: TableCategory | null;
  isEditMode?: boolean;
}

const TableCategoryModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  selectedBranch, 
  onSuccess,
  editingCategory = null,
  isEditMode = false
}) => {
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState<TableCategoryFormData>({
    categoryName: '',
    description: '',
    colorCode: '#3b82f6',
    iconClass: '',
    displayOrder: 0,
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [branches, setBranches] = useState<RestaurantBranchDropdownItem[]>([]);
  const [branchId, setBranchId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.categoryName.trim()) {
      newErrors.categoryName = t('TableCategoryModal.categoryNameRequired');
    }
    if (!formData.iconClass) {
      newErrors.iconClass = t('TableCategoryModal.iconRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Initialize form data when modal opens or editing category changes
  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && editingCategory) {
      // Populate form with existing category data
      setFormData({
        categoryName: editingCategory.categoryName,
        description: editingCategory.description || '',
        colorCode: editingCategory.colorCode || '#3b82f6',
        iconClass: editingCategory.iconClass || '',
        displayOrder: editingCategory.displayOrder || 0,
        isActive: editingCategory.isActive,
      });
    } else {
      // Reset form for new category
      setFormData({
        categoryName: '',
        description: '',
        colorCode: '#3b82f6',
        iconClass: '',
        displayOrder: 0,
        isActive: true,
      });
    }
    setErrors({});
  }, [isOpen, isEditMode, editingCategory]);

  // Determine branchId or fetch branches if main selected
  useEffect(() => {
    if (!isOpen) return;

    if (selectedBranch) {
      setBranchId(selectedBranch.id);
    } else {
      // Ana restoran ise branchları çek
      (async () => {
        try {
          const dropdownItems = await restaurantService.getRestaurantBranchesDropdown();
          setBranches(dropdownItems);
          if (dropdownItems.length > 0) {
            setBranchId(dropdownItems[0].id);
          }
        } catch (err) {
          logger.error('Şubeler alınamadı:', err);
        }
      })();
    }
  }, [isOpen, selectedBranch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, type } = target;
    const value = type === 'checkbox' ? target.checked : target.value;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
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
    
    // BranchId kontrolü
    if (!branchId) {
      setErrors({ general: t('TableCategoryModal.branchRequired') });
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && editingCategory) {
        // UPDATE existing category
        await tableService.updateCategory(editingCategory.id,   {
          id: editingCategory.id,
          categoryName: formData.categoryName.trim(),
          colorCode: formData.colorCode,
          iconClass: formData.iconClass,
          isActive: formData.isActive,
          rowVersion: editingCategory.rowVersion,
        },branchId );
        logger.info('Kategori başarıyla güncellendi', { categoryId: editingCategory.id });
      } else {
        // CREATE new category
        const payload: TableCategoryPayload = {
          categoryName: formData.categoryName.trim() || null,
          description: formData.description?.trim() || null,
          colorCode: formData.colorCode || null,
          iconClass: formData.iconClass || null,
          displayOrder: formData.displayOrder,
          isActive: formData.isActive
        };
        
        logger.info('Gönderilen payload', { payload, branchId });
        
        // LocalStorage'a branchId'yi kaydet
        if (branchId) {
          localStorage.setItem('menutable_create_selected_branchId', String(branchId));
        }
        
        // BranchId'yi query parameter olarak kullan
        const response = await httpClient.post(`/api/branches/table-categories?branchId=${branchId}`, payload);
        logger.info('Kategori başarıyla eklendi', { data: response.data });
        
        // Kategori oluşturulduktan sonra kategorileri yeniden yükle
        if (branchId) {
          try {
            await httpClient.get(`/api/branches/table-categories?branchId=${branchId}`);
            logger.info('Kategoriler yeniden yüklendi');
          } catch (error) {
            logger.error('Kategoriler yeniden yüklenirken hata', error);
          }
        }
      }
      
      // Success callback'i çağır
      onSuccess && onSuccess();
      onClose();
      
      // Form'u sıfırla
      setFormData({
        categoryName: '',
        description: '',
        colorCode: '#3b82f6',
        iconClass: '',
        displayOrder: 0,
        isActive: true,
      });
      setErrors({});
    } catch (error: any) {
      console.error('❌ Kategori işlemi sırasında hata:', error);
      
      // API'den gelen spesifik hataları işle
      if (error.response?.status === 400) {
        const apiErrors = error.response?.data?.errors;
        if (apiErrors) {
          // Field specific hatalar
          const fieldErrors: Record<string, string> = {};
          Object.keys(apiErrors).forEach(key => {
            const fieldName = key.toLowerCase();
            if (fieldName.includes('categoryname')) {
              fieldErrors.categoryName = apiErrors[key][0] || t('TableCategoryModal.categoryNameRequired');
            } else if (fieldName.includes('colorcode')) {
              fieldErrors.general = t('TableCategoryModal.invalidData');
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
      } else if (error.response?.status === 401) {
        setErrors({ general: t('TableCategoryModal.unauthorized') });
      } else if (error.response?.status === 403) {
        setErrors({ general: t('TableCategoryModal.forbidden') });
      } else if (error.response?.status === 404) {
        setErrors({ general: t('TableCategoryModal.branchNotFound') });
      } else if (error.response?.status >= 500) {
        setErrors({ general: t('TableCategoryModal.serverError') });
      } else {
        setErrors({ general: t('TableCategoryModal.unexpectedError') });
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
          aria-label={t('TableCategoryModal.accessibility.modal')}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Enhanced Backdrop with gradient overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/40 to-indigo-900/30 backdrop-blur-md"
            onClick={onClose}
          >
            {/* Animated background orbs */}
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
          
          {/* Modal */}
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
              className="relative w-full max-w-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {/* Decorative glow effect */}
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400/30 to-purple-500/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/30 to-primary-500/30 rounded-full blur-3xl" />
              
              {/* Enhanced Header with mesh gradient */}
              <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 dark:from-primary-600 dark:via-primary-700 dark:to-purple-700 p-8 text-white overflow-hidden">
                {/* Animated mesh pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
                </div>
                
                {/* Close button with better styling */}
              <button
                onClick={onClose}
                className={`absolute top-6 p-2.5 hover:bg-white/25 dark:hover:bg-white/15 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90 group z-10 ${isRTL ? 'left-6' : 'right-6'}`}
                aria-label={t('TableCategoryModal.accessibility.close')}
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
                      {isEditMode ? 'Edit Category' : t('TableCategoryModal.title')}
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-primary-50/90 text-sm mt-1 drop-shadow"
                    >
                      {isEditMode ? 'Update category details' : t('TableCategoryModal.subtitle')}
                    </motion.p>
                  </div>
                </div>
              </div>

              {/* Form with better spacing */}
              <form onSubmit={handleSubmit} className="relative p-8 space-y-6" role="form" aria-label={t('TableCategoryModal.accessibility.form')}>
                {/* General Error */}
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/30 dark:to-red-800/20 border-l-4 border-red-500 dark:border-red-400 rounded-xl text-red-700 dark:text-red-300 text-sm font-medium shadow-sm"
                  >
                    {errors.general}
                  </motion.div>
                )}

                {/* Category Name with floating label effect */}
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 ${isRTL ? 'text-right' : ''}`}>
                    <Tag className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    {t('TableCategoryModal.categoryName')}
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="categoryName"
                      value={formData.categoryName}
                      onChange={handleChange}
                      placeholder={t('TableCategoryModal.categoryNamePlaceholder')}
                      className={`
                        w-full px-5 py-3.5 rounded-2xl border-2 transition-all duration-300
                        bg-white dark:bg-gray-800/50 
                        text-gray-900 dark:text-gray-100
                        placeholder-gray-400 dark:placeholder-gray-500
                        border-gray-200 dark:border-gray-600
                        hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg hover:shadow-primary-500/10
                        focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 focus:shadow-xl focus:shadow-primary-500/20
                        ${errors.categoryName 
                          ? 'border-red-400 dark:border-red-500 focus:border-red-500 focus:ring-red-500/30' 
                          : ''
                        }
                        ${isRTL ? 'text-right' : 'text-left'}
                      `}
                      aria-describedby={errors.categoryName ? 'category-name-error' : undefined}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-purple-500/0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                  </div>
                  {errors.categoryName && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      id="category-name-error" 
                      className="text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-1"
                    >
                      {errors.categoryName}
                    </motion.p>
                  )}
                </div>

                {/* Description with better styling */}
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 ${isRTL ? 'text-right' : ''}`}>
                    <FileText className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    {t('TableCategoryModal.description')}
                  </label>
                  <div className="relative group">
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder={t('TableCategoryModal.descriptionPlaceholder')}
                      className={`
                        w-full px-5 py-3.5 rounded-2xl border-2 transition-all duration-300 resize-none
                        bg-white dark:bg-gray-800/50 
                        text-gray-900 dark:text-gray-100
                        placeholder-gray-400 dark:placeholder-gray-500
                        border-gray-200 dark:border-gray-600
                        hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg hover:shadow-primary-500/10
                        focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 focus:shadow-xl focus:shadow-primary-500/20
                        ${isRTL ? 'text-right' : 'text-left'}
                      `}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-purple-500/0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>

                {/* Color Selection with glassmorphism */}
                <div className="space-y-3">
                  <label className={`flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 ${isRTL ? 'text-right' : ''}`}>
                    <Palette className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    {t('TableCategoryModal.colorSelection')}
                  </label>
                  
                  {/* Enhanced Color Presets */}
                  <div 
                    className="grid grid-cols-8 gap-2.5 p-4 bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-800/30 dark:to-gray-700/30 rounded-2xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
                    role="group"
                    aria-label={t('TableCategoryModal.accessibility.colorPalette')}
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
                        aria-label={`${t('TableCategoryModal.accessibility.colorPreset')} ${color}`}
                      />
                    ))}
                  </div>

                  {/* Custom Color Picker with better design */}
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
                      type="color"
                      name="colorCode"
                      value={formData.colorCode}
                      onChange={handleChange}
                      className="w-12 h-12 border-0 bg-transparent cursor-pointer rounded-xl"
                      aria-label={t('TableCategoryModal.accessibility.customColorPicker')}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-mono font-semibold bg-white/50 dark:bg-gray-900/50 px-3 py-1.5 rounded-lg">
                      {formData.colorCode}
                    </span>
                  </div>
                </div>

                {/* Icon Selection with cards */}
                <div className="space-y-3">
                  <label className={`flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 ${isRTL ? 'text-right' : ''}`}>
                    <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    {t('TableCategoryModal.iconSelection')}
                  </label>
                  <div 
                    className="grid grid-cols-4 gap-3"
                    role="group"
                    aria-label={t('TableCategoryModal.accessibility.iconGrid')}
                  >
                    {iconOptions.map((option) => (
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
                        aria-label={`${t('TableCategoryModal.accessibility.iconOption')} ${t(option.label)}`}
                      >
                        <option.icon className="w-6 h-6" />
                        <span className="text-xs font-semibold">{t(option.label)}</span>
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

                {/* Active Status Toggle (only in edit mode) */}
                {isEditMode && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100/80 dark:from-gray-800/50 dark:to-gray-700/30 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Active Status</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {formData.isActive ? 'Category is active and visible' : 'Category is inactive and hidden'}
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
                      aria-label="Toggle active status"
                    >
                      <motion.span
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ${
                          formData.isActive ? 'translate-x-8' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </motion.div>
                )}

                {/* Branch Selection (if needed and not in edit mode) */}
                {!isEditMode && !selectedBranch && branches.length > 0 && (
                  <div className="space-y-2">
                    <label className={`flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 ${isRTL ? 'text-right' : ''}`}>
                      <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      {t('TableCategoryModal.branchSelection')}
                    </label>
                    <div className="relative group">
                      <select
                        value={branchId ?? ''}
                        onChange={(e) => setBranchId(Number(e.target.value))}
                        className={`
                          w-full px-5 py-3.5 rounded-2xl border-2 transition-all duration-300 appearance-none cursor-pointer
                          bg-white dark:bg-gray-800/50 
                          text-gray-900 dark:text-gray-100
                          border-gray-200 dark:border-gray-600
                          hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg hover:shadow-primary-500/10
                          focus:outline-none focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 focus:shadow-xl focus:shadow-primary-500/20
                          ${isRTL ? 'text-right' : 'text-left'}
                        `}
                        aria-label={t('TableCategoryModal.accessibility.branchDropdown')}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      >
                        {branches.map(branch => (
                          <option key={branch.id} value={branch.id} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                            {branch.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-purple-500/0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                )}

                {/* Enhanced Action Buttons */}
                <div className={`flex gap-4 pt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 shadow-md hover:shadow-lg"
                  >
                    {t('TableCategoryModal.cancel')}
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
                        {isEditMode ? 'Updating...' : t('TableCategoryModal.saving')}
                      </div>
                    ) : (
                      isEditMode ? 'Update Category' : t('TableCategoryModal.addCategory')
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

export default TableCategoryModal;