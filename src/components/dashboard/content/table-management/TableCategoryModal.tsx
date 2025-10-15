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
        await tableService.updateCategory(editingCategory.id,branchId ,   {
          id: editingCategory.id,
          categoryName: formData.categoryName.trim(),
          colorCode: formData.colorCode,
          iconClass: formData.iconClass,
          isActive: formData.isActive,
          rowVersion: editingCategory.rowVersion,
        });
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
              className="relative w-full max-w-md bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 p-6 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <button
                  onClick={onClose}
                  className={`absolute top-4 p-2 hover:bg-white/20 dark:hover:bg-white/10 rounded-full transition-colors duration-200 ${isRTL ? 'left-4' : 'right-4'}`}
                  aria-label={t('TableCategoryModal.accessibility.close')}
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className={`flex items-center gap-3 relative ${isRTL ? 'text-right' : ''}`}>
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="text-xl font-bold">
                      {isEditMode ? 'Edit Category' : t('TableCategoryModal.title')}
                    </h3>
                    <p className="text-primary-100 text-sm">
                      {isEditMode ? 'Update category details' : t('TableCategoryModal.subtitle')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6" role="form" aria-label={t('TableCategoryModal.accessibility.form')}>
                {/* General Error */}
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm"
                  >
                    {errors.general}
                  </motion.div>
                )}

                {/* Category Name */}
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : ''}`}>
                    <Tag className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    {t('TableCategoryModal.categoryName')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="categoryName"
                      value={formData.categoryName}
                      onChange={handleChange}
                      placeholder={t('TableCategoryModal.categoryNamePlaceholder')}
                      className={`
                        w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
                        bg-white dark:bg-gray-900 
                        text-gray-900 dark:text-gray-100
                        placeholder-gray-400 dark:placeholder-gray-500
                        border-gray-200 dark:border-gray-600
                        hover:border-gray-300 dark:hover:border-gray-500
                        focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500
                        ${errors.categoryName 
                          ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20' 
                          : ''
                        }
                        ${isRTL ? 'text-right' : 'text-left'}
                      `}
                      aria-describedby={errors.categoryName ? 'category-name-error' : undefined}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>
                  {errors.categoryName && (
                    <p id="category-name-error" className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1">
                      {errors.categoryName}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : ''}`}>
                    <FileText className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    {t('TableCategoryModal.description')}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder={t('TableCategoryModal.descriptionPlaceholder')}
                    className={`
                      w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none
                      bg-white dark:bg-gray-900 
                      text-gray-900 dark:text-gray-100
                      placeholder-gray-400 dark:placeholder-gray-500
                      border-gray-200 dark:border-gray-600
                      hover:border-gray-300 dark:hover:border-gray-500
                      focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500
                      ${isRTL ? 'text-right' : 'text-left'}
                    `}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                {/* Color Selection */}
                <div className="space-y-3">
                  <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : ''}`}>
                    <Palette className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    {t('TableCategoryModal.colorSelection')}
                  </label>
                  
                  {/* Color Presets */}
                  <div 
                    className="grid grid-cols-8 gap-2"
                    role="group"
                    aria-label={t('TableCategoryModal.accessibility.colorPalette')}
                  >
                    {colorPresets.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorSelect(color)}
                        className={`
                          w-8 h-8 rounded-lg border-2 transition-all duration-200 hover:scale-110
                          ${formData.colorCode === color 
                            ? 'border-white dark:border-gray-200 ring-2 ring-gray-400 dark:ring-gray-300' 
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400'
                          }
                        `}
                        style={{ backgroundColor: color }}
                        aria-label={`${t('TableCategoryModal.accessibility.colorPreset')} ${color}`}
                      />
                    ))}
                  </div>

                  {/* Custom Color Picker */}
                  <div className={`flex items-center gap-3 pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div
                      className="w-10 h-10 rounded-xl border-2 border-gray-300 dark:border-gray-600 overflow-hidden"
                      style={{ backgroundColor: formData.colorCode }}
                    />
                    <input
                      type="color"
                      name="colorCode"
                      value={formData.colorCode}
                      onChange={handleChange}
                      className="w-10 h-10 border-0 bg-transparent cursor-pointer rounded-lg"
                      aria-label={t('TableCategoryModal.accessibility.customColorPicker')}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                      {formData.colorCode}
                    </span>
                  </div>
                </div>

                {/* Icon Selection */}
                <div className="space-y-3">
                  <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : ''}`}>
                    <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    {t('TableCategoryModal.iconSelection')}
                  </label>
                  <div 
                    className="grid grid-cols-5 gap-2"
                    role="group"
                    aria-label={t('TableCategoryModal.accessibility.iconGrid')}
                  >
                    {iconOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, iconClass: option.value }))}
                        className={`
                          p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1
                          hover:scale-105 hover:shadow-lg
                          ${formData.iconClass === option.value
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                          }
                        `}
                        aria-label={`${t('TableCategoryModal.accessibility.iconOption')} ${t(option.label)}`}
                      >
                        <option.icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{t(option.label)}</span>
                      </button>
                    ))}
                  </div>
                  {errors.iconClass && (
                    <p className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1">
                      {errors.iconClass}
                    </p>
                  )}
                </div>

                {/* Active Status Toggle (only in edit mode) */}
                {isEditMode && (
                  <div className={`flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Status</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formData.isActive ? 'Category is active and visible' : 'Category is inactive and hidden'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.isActive ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      aria-label="Toggle active status"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                )}

                {/* Branch Selection (if needed and not in edit mode) */}
                {!isEditMode && !selectedBranch && branches.length > 0 && (
                  <div className="space-y-2">
                    <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : ''}`}>
                      <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      {t('TableCategoryModal.branchSelection')}
                    </label>
                    <select
                      value={branchId ?? ''}
                      onChange={(e) => setBranchId(Number(e.target.value))}
                      className={`
                        w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
                        bg-white dark:bg-gray-900 
                        text-gray-900 dark:text-gray-100
                        border-gray-200 dark:border-gray-600
                        hover:border-gray-300 dark:hover:border-gray-500
                        focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500
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
                  </div>
                )}

                {/* Action Buttons */}
                <div className={`flex gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all duration-200 hover:scale-[1.02] border border-gray-200 dark:border-gray-600"
                  >
                    {t('TableCategoryModal.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 dark:hover:from-primary-600 dark:hover:to-primary-700 rounded-xl transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  >
                    {isSubmitting ? (
                      <div className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {isEditMode ? 'Updating...' : t('TableCategoryModal.saving')}
                      </div>
                    ) : (
                      isEditMode ? 'Update Category' : t('TableCategoryModal.addCategory')
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

export default TableCategoryModal;