import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Tag, 
  Palette, 
  FileText, 
  Building2, 
  Users, 
  Utensils, 
  Layers, 
  Table,
  Armchair,
  Sparkles 
} from 'lucide-react';
import { httpClient } from '../../../../utils/http';
import { restaurantService } from '../../../../services/restaurantService';
import { logger } from '../../../../utils/logger';
import { RestaurantBranchDropdownItem } from '../../../../types/api';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedBranch: RestaurantBranchDropdownItem | null;
  onSuccess?: () => void;
}

// CreateMenuTableCategoryDto formatına uygun interface
interface TableCategoryPayload {
  categoryName: string | null;
  description: string | null;
  colorCode: string | null;
  iconClass: string | null;
  displayOrder: number;
  isActive: boolean;
}

const iconOptions = [
  { value: 'table', label: 'TableCategoryModal.table', icon: Table },
  { value: 'chair', label: 'TableCategoryModal.chair', icon: Armchair },
  { value: 'utensils', label: 'TableCategoryModal.service', icon: Utensils },
  { value: 'tag', label: 'TableCategoryModal.label', icon: Tag },
  { value: 'layers', label: 'TableCategoryModal.layer', icon: Layers },
];

const colorPresets = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', 
  '#84cc16', '#22c55e', '#10b981', '#14b8a6', 
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', 
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
];

// Form için ayrı interface
interface TableCategoryFormData {
  categoryName: string;
  description: string;
  colorCode: string;
  iconClass: string;
  displayOrder: number;
  isActive: boolean;
}

const TableCategoryModal: React.FC<Props> = ({ isOpen, onClose, selectedBranch, onSuccess }) => {
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
      // API DTO formatına uygun payload hazırla
      const payload: TableCategoryPayload = {
        categoryName: formData.categoryName.trim() || null,
        description: formData.description?.trim() || null,
        colorCode: formData.colorCode || null,
        iconClass: formData.iconClass || null,
        displayOrder: formData.displayOrder,
        isActive: formData.isActive
      };
      
      // Debug için payload'ı logla
      logger.info('Gönderilen payload', { payload, branchId });
      
      // LocalStorage'a branchId'yi kaydet
      if (branchId) {
        localStorage.setItem('menutable_create_selected_branchId', String(branchId));
      }
      
      // BranchId'yi query parameter olarak kullan
      const response = await httpClient.post(`/api/branches/table-categories?branchId=${branchId}`, payload);
      logger.info('Kategori başarıyla eklendi', { data: response.data });
      
      // Success callback'i çağır
      onSuccess && onSuccess();
      
      // Kategori oluşturulduktan sonra kategorileri yeniden yükle
      if (branchId) {
        try {
          await httpClient.get(`/api/branches/table-categories?branchId=${branchId}`);
          logger.info('Kategoriler yeniden yüklendi');
        } catch (error) {
          logger.error('Kategoriler yeniden yüklenirken hata', error);
        }
      }
      
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
      console.error('❌ Kategori eklenirken hata:', error);
      
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
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-label={t('TableCategoryModal.accessibility.modal')}>
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
              className={`relative w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <button
                  onClick={onClose}
                  className={`absolute top-4 p-2 hover:bg-white/20 rounded-full transition-colors duration-200 ${isRTL ? 'left-4' : 'right-4'}`}
                  aria-label={t('TableCategoryModal.accessibility.modal')}
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className={`flex items-center gap-3 relative ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{t('TableCategoryModal.title')}</h3>
                    <p className="text-primary-100 text-sm">{t('TableCategoryModal.subtitle')}</p>
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
                  <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                        w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 rounded-xl
                        transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500
                        focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500
                        hover:border-gray-300 dark:hover:border-gray-600
                        ${errors.categoryName 
                          ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-gray-200 dark:border-gray-600'
                        }
                      `}
                      aria-describedby={errors.categoryName ? 'category-name-error' : undefined}
                    />
                  </div>
                  {errors.categoryName && (
                    <p id="category-name-error" className="text-red-500 text-xs flex items-center gap-1">
                      {errors.categoryName}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <FileText className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    {t('TableCategoryModal.description')}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder={t('TableCategoryModal.descriptionPlaceholder')}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 hover:border-gray-300 dark:hover:border-gray-600 resize-none"
                  />
                </div>

                {/* Color Selection */}
                <div className="space-y-3">
                  <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                            ? 'border-white dark:border-gray-800 ring-2 ring-gray-400 dark:ring-gray-500' 
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
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
                  <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
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
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      {errors.iconClass}
                    </p>
                  )}
                </div>

                {/* Branch Selection (if needed) */}
                {!selectedBranch && branches.length > 0 && (
                  <div className="space-y-2">
                    <label className={`flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      {t('TableCategoryModal.branchSelection')}
                    </label>
                    <select
                      value={branchId ?? ''}
                      onChange={(e) => setBranchId(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 hover:border-gray-300 dark:hover:border-gray-600"
                      aria-label={t('TableCategoryModal.accessibility.branchDropdown')}
                    >
                      {branches.map(branch => (
                        <option key={branch.id} value={branch.id}>
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
                    className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                  >
                    {t('TableCategoryModal.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-xl transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t('TableCategoryModal.saving')}
                      </div>
                    ) : (
                      t('TableCategoryModal.addCategory')
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