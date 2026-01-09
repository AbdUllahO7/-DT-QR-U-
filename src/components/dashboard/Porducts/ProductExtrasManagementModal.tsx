import React, { useState, useEffect, useRef } from 'react';
import {
  X, Plus, Edit2, Trash2, Save, Loader2, Package,
  AlertCircle, ArrowLeft, Layers, ChevronDown, Check, Search
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { logger } from '../../../utils/logger';
import { productExtrasService } from '../../../services/Extras/ProductExtrasService';
import { extrasService } from '../../../services/Extras/ExtrasService';
import { ConfirmationModal } from './ConfirmationModal';
import { CreateProductExtraData, Extra, ProductExtra, UpdateProductExtraData } from '../../../types/Extras/type';
import { useCurrency } from '../../../hooks/useCurrency';
import { motion, AnimatePresence } from 'framer-motion';

// --- Custom Select Component ---
interface SelectOption {
  value: number;
  label: string;
  subLabel?: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: number;
  onChange: (value: number) => void;
  placeholder: string;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, placeholder, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { isRTL } = useLanguage();

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-left transition-all duration-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
          disabled ? 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800' : 'hover:border-primary-400 cursor-pointer shadow-sm'
        } ${isOpen ? 'ring-2 ring-primary-500/20 border-primary-500' : ''}`}
      >
        <span className={`block truncate ${!selectedOption ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
          {selectedOption ? (
            <span className="flex flex-col text-left">
              <span className="font-medium">{selectedOption.label}</span>
              {selectedOption.subLabel && (
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{selectedOption.subLabel}</span>
              )}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[300px]"
          >
            {/* Search Input */}
            <div className="p-2 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <div className="relative">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500`}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Options List */}
            <div className="overflow-y-auto flex-1 p-1 custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between group transition-colors ${
                      value === option.value
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{option.label}</span>
                      {option.subLabel && (
                        <span className={`text-xs mt-0.5 ${value === option.value ? 'text-primary-600/80 dark:text-primary-400/80' : 'text-gray-500 dark:text-gray-400'}`}>
                          {option.subLabel}
                        </span>
                      )}
                    </div>
                    {value === option.value && (
                      <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    )}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No options found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
// --- End Custom Select ---

interface ProductExtrasManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  productId: number;
  productName: string;
  extraCategoryId: number;
  extraCategoryName: string;
  isRemoval?: boolean; 
}

const ProductExtrasManagementModal: React.FC<ProductExtrasManagementModalProps> = ({
  isOpen,
  onClose,
  onBack,
  productId,
  productName,
  extraCategoryId,
  extraCategoryName,
  isRemoval = false 
}) => {
  const { t, isRTL } = useLanguage();
  const { isDark } = useTheme();

  // State
  const [productExtras, setProductExtras] = useState<ProductExtra[]>([]);
  const [allExtras, setAllExtras] = useState<Extra[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const currency = useCurrency();

  // Delete Confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null
  });

  // Form state
  const [formData, setFormData] = useState({
    extraId: 0,
    selectionMode: 0, 
    defaultQuantity: 1,
    defaultMinQuantity: 0,
    defaultMaxQuantity: 1,
    unitPrice: 0,
    isRequired: false
  });

  const [editFormData, setEditFormData] = useState({
    selectionMode: 0,
    defaultQuantity: 1,
    defaultMinQuantity: 0,
    defaultMaxQuantity: 1,
    unitPrice: 0,
    isRequired: false
  });

  // Load data
  useEffect(() => {
    if (isOpen && productId && extraCategoryId) {
      loadData();
    }
    return () => setError(null);
  }, [isOpen, productId, extraCategoryId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const allExtrasData = await extrasService.getExtras();
      const categoryExtras = allExtrasData.filter(
        extra => extra.extraCategoryId === extraCategoryId && extra.status
      );
      setAllExtras(categoryExtras);
      
      const productExtrasData = await productExtrasService.getProductExtrasByProductId(productId);
      const filtered = productExtrasData.filter(pe => {
        const extra = allExtrasData.find(e => e.id === pe.extraId);
        return extra && extra.extraCategoryId === extraCategoryId;
      });
      
      setProductExtras(filtered);
    } catch (error) {
      logger.error('Failed to load product extras:', error);
      setError(t('error.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddExtra = async () => {
    if (!formData.extraId) {
      setError(t('extrasManagement.productExtras.selectExtra'));
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const data: CreateProductExtraData = {
        productId: productId,
        extraId: formData.extraId,
        selectionMode: isRemoval ? 0 : formData.selectionMode,
        defaultQuantity: formData.defaultQuantity,
        defaultMinQuantity: formData.defaultMinQuantity,
        defaultMaxQuantity: formData.defaultMaxQuantity,
        unitPrice: formData.unitPrice,
        isRequired: formData.isRequired
      };

      await productExtrasService.createProductExtra(data);
      await loadData();

      setFormData({
        extraId: 0,
        selectionMode: 0,
        defaultQuantity: 1,
        defaultMinQuantity: 0,
        defaultMaxQuantity: 1,
        unitPrice: 0,
        isRequired: false
      });
      setShowAddForm(false);
    } catch (error:any) {
      logger.error('Failed to add product extra:', error);
      setError(error.response?.data?.message );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateExtra = async (id: number) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const data: UpdateProductExtraData = {
        id: id,
        selectionMode: isRemoval ? 0 : editFormData.selectionMode,
        defaultQuantity: editFormData.defaultQuantity,
        defaultMinQuantity: editFormData.defaultMinQuantity,
        defaultMaxQuantity: editFormData.defaultMaxQuantity,
        unitPrice: editFormData.unitPrice,
        isRequired: editFormData.isRequired
      };

      await productExtrasService.updateProductExtra(data);
      await loadData();
      setEditingId(null);
    } catch (error :any) {
      logger.error('Failed to update product extra:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteConfirm({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if(!deleteConfirm.id) return;
    try {
      setIsSubmitting(true);
      setError(null);
      await productExtrasService.deleteProductExtra(deleteConfirm.id);
      await loadData();
      setDeleteConfirm({ isOpen: false, id: null });
    } catch (error) {
      logger.error('Failed to delete product extra:', error);
      setError(t('error.deleteFailed'));
      setDeleteConfirm({ isOpen: false, id: null });
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (extra: ProductExtra) => {
    setError(null);
    setEditingId(extra.id);
    setEditFormData({
      selectionMode: extra.selectionMode,
      defaultQuantity: extra.defaultQuantity,
      defaultMinQuantity: extra.defaultMinQuantity,
      defaultMaxQuantity: extra.defaultMaxQuantity,
      unitPrice: extra.unitPrice,
      isRequired: extra.isRequired
    });
  };

  const getExtraName = (extraId: number): string => {
    const extra = allExtras.find(e => e.id === extraId);
    return extra ? extra.name : t('extrasManagement.productExtras.unknownExtra');
  };

  const getExtraDetails = (extraId: number) => {
    return allExtras.find(e => e.id === extraId);
  };

  const getAvailableExtrasToAdd = () => {
    const usedExtraIds = productExtras.map(e => e.extraId);
    return allExtras.filter(e => !usedExtraIds.includes(e.id));
  };

  const handleExtraSelect = (extraId: number) => {
    const extra = allExtras.find(e => e.id === extraId);
    if (extra) {
      setFormData({
        ...formData,
        extraId: extraId,
        unitPrice: extra.basePrice
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in duration-200">
        <div
          className={`bg-white dark:bg-gray-800 rounded-none sm:rounded-2xl shadow-2xl w-full max-w-5xl h-full sm:h-auto sm:max-h-[85vh] overflow-hidden flex flex-col ${
            isRTL ? 'rtl' : 'ltr'
          }`}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 z-10 shrink-0">
            <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
               <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 hover:text-gray-700 transition-colors shrink-0"
                  title={t('common.back')}
                >
                  <ArrowLeft className={`h-5 w-5 sm:h-6 sm:w-6 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 truncate">
                    <Layers className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 shrink-0" />
                    <span className="truncate">{t('extrasManagement.productExtras.manageExtras')}</span>
                  </h2>
                  {isRemoval && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-medium border border-red-200 dark:border-red-800 shrink-0">
                      {t('extrasManagement.categoryConfigModal.badges.removal')}
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-300 mt-1 truncate">
                  <span className="truncate max-w-[200px]">{productName}</span>
                  <span className="hidden sm:inline text-gray-300 mx-1">•</span>
                  <span className="font-medium text-primary-600 dark:text-primary-400 truncate">{extraCategoryName}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors shrink-0"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-900/50 custom-scrollbar">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400 animate-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Add New Extra Button */}
                {!showAddForm && getAvailableExtrasToAdd().length > 0 && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="group w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-300 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all duration-200"
                  >
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-1 group-hover:bg-primary-100 dark:group-hover:bg-primary-900 transition-colors">
                      <Plus className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-lg">{t('extrasManagement.productExtras.addExtra')}</span>
                  </button>
                )}

                {/* Add Form */}
                {showAddForm && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg animate-in fade-in slide-in-from-bottom-4">
                     <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('extrasManagement.productExtras.addExtra')}
                      </h3>
                      <button onClick={() => setShowAddForm(false)} className="text-gray-300 hover:text-gray-600">
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                      {/* Left Side: Basic Info */}
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('extrasManagement.productExtras.selectExtra')} <span className="text-red-500">*</span>
                          </label>
                          
                          {/* --- New Custom Select --- */}
                          <div className="relative z-20">
                            <CustomSelect
                              placeholder={t('extrasManagement.productExtras.chooseExtra')}
                              value={formData.extraId}
                              onChange={(val) => handleExtraSelect(val)}
                              options={getAvailableExtrasToAdd().map(extra => ({
                                value: extra.id,
                                label: extra.name,
                                subLabel: `${t('extrasManagement.productExtras.basePrice')}: ${currency.symbol}${extra.basePrice.toFixed(2)}`
                              }))}
                            />
                          </div>
                          
                          {formData.extraId > 0 && (
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                {getExtraDetails(formData.extraId)?.description || t('extrasManagement.productExtras.noDescription')}
                              </p>
                            </div>
                          )}
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('extrasManagement.productExtras.unitPrice')} <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`}>
                              {currency.symbol}
                            </span>
                            <input
                              title='Unit Price'
                              type="number"
                              min={0}
                              step={0.01}
                              value={formData.unitPrice}
                              onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                              className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-medium text-lg transition-all`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Logic */}
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('extrasManagement.productExtras.selectionMode')}
                          </label>
                          
                          {/* Conditional Rendering based on isRemoval */}
                          {isRemoval ? (
                            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg">
                              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                {t('extrasManagement.productExtras.single')} ({t('extrasManagement.categoryConfigModal.badges.removal')})
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-3">
                              <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${formData.selectionMode === 0 ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-400 ring-1 ring-primary-500' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700'}`}>
                                <input
                                  type="radio"
                                  value={0}
                                  checked={formData.selectionMode === 0}
                                  onChange={() => setFormData({ ...formData, selectionMode: 0 })}
                                  className="hidden"
                                />
                                <span className="font-medium text-sm sm:text-base">{t('extrasManagement.productExtras.single')}</span>
                              </label>
                              <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${formData.selectionMode === 1 ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-400 ring-1 ring-primary-500' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700'}`}>
                                <input
                                  type="radio"
                                  value={1}
                                  checked={formData.selectionMode === 1}
                                  onChange={() => setFormData({ ...formData, selectionMode: 1 })}
                                  className="hidden"
                                />
                                <span className="font-medium text-sm sm:text-base">{t('extrasManagement.productExtras.multiple')}</span>
                              </label>
                            </div>
                          )}
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700 space-y-4">
                           <h4 className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('extrasManagement.productExtras.quantityConfiguration')}</h4>
                           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">{t('extrasManagement.productExtras.default')}</label>
                              <input
                                title='Default'
                                type="number"
                                min={1}
                                value={formData.defaultQuantity}
                                onChange={(e) => setFormData({ ...formData, defaultQuantity: parseInt(e.target.value) || 1 })}
                                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">{t('extrasManagement.productExtras.min')}</label>
                              <input
                                title='Min'
                                type="number"
                                min={0}
                                value={formData.defaultMinQuantity}
                                onChange={(e) => setFormData({ ...formData, defaultMinQuantity: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">{t('extrasManagement.productExtras.max')}</label>
                              <input
                                title='Max'
                                type="number"
                                min={1}
                                value={formData.defaultMaxQuantity}
                                onChange={(e) => setFormData({ ...formData, defaultMaxQuantity: parseInt(e.target.value) || 10 })}
                                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        disabled={isSubmitting}
                      >
                        {t('common.cancel')}
                      </button>
                      <button
                        onClick={handleAddExtra}
                        disabled={isSubmitting || !formData.extraId}
                        className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {t('common.saving')}
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            {t('common.save')}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Extras List */}
                {productExtras.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <div className="bg-gray-50 dark:bg-gray-700 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="h-8 w-8 text-gray-400 dark:text-gray-300" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-300 font-medium">
                      {t('extrasManagement.productExtras.noExtrasYet')}
                    </p>
                    <p className="text-sm text-gray-400  dark:text-gray-300 mt-1">{t('extrasManagement.productExtras.addExtrasHint')}</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {productExtras.map((extra) => {
                      const extraDetails = getExtraDetails(extra.extraId);
                      return (
                        <div
                          key={extra.id}
                           className={`bg-white dark:bg-gray-800 rounded-xl border transition-all duration-200 ${
                            editingId === extra.id 
                              ? 'border-primary-500 ring-2 ring-primary-500/10 shadow-lg z-10' 
                              : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md'
                          }`}
                        >
                          {editingId === extra.id ? (
                            // Edit Mode
                            <div className="p-4 sm:p-6">
                              <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                  {t('common.edit')}: {getExtraName(extra.extraId)}
                                </h3>
                               
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('extrasManagement.productExtras.priceAndSelection')}</label>
                                    <div className="relative mb-3">
                                      <span className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-300`}>
                                        {currency.symbol}
                                      </span>
                                      <input
                                        title='Unit Price'
                                        type="number"
                                        min={0}
                                        step={0.01}
                                        value={editFormData.unitPrice}
                                        onChange={(e) => setEditFormData({ ...editFormData, unitPrice: parseFloat(e.target.value) || 0 })}
                                        className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500`}
                                      />
                                    </div>
                                    
                                    {/* Conditional Selection Mode in Edit */}
                                    {isRemoval ? (
                                      <div className="p-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-600 dark:text-gray-400">
                                         {t('extrasManagement.productExtras.single')} ({t('extrasManagement.categoryConfigModal.badges.removal')})
                                      </div>
                                    ) : (
                                      <div className="flex gap-2">
                                         <button
                                          onClick={() => setEditFormData({...editFormData, selectionMode: 0})}
                                          className={`flex-1 py-2 text-xs font-medium rounded border transition-colors ${editFormData.selectionMode === 0 ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-400' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'}`}
                                         >
                                           {t('extrasManagement.productExtras.singleSelect')}
                                         </button>
                                         <button
                                          onClick={() => setEditFormData({...editFormData, selectionMode: 1})}
                                          className={`flex-1 py-2 text-xs font-medium rounded border transition-colors ${editFormData.selectionMode === 1 ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-400' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'}`}
                                         >
                                           {t('extrasManagement.productExtras.multiSelect')}
                                         </button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                  <h4 className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-2">{t('extrasManagement.productExtras.quantities')}</h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div>
                                      <label className="block text-xs text-gray-500 dark:text-gray-300 mb-1">{t('extrasManagement.productExtras.defaultShort')}</label>
                                      <input
                                        title='Default'
                                        type="number"
                                        value={editFormData.defaultQuantity}
                                        onChange={(e) => setEditFormData({ ...editFormData, defaultQuantity: parseInt(e.target.value) || 1 })}
                                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:ring-2 focus:ring-primary-500/20"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-500 dark:text-gray-300 mb-1">{t('extrasManagement.productExtras.min')}</label>
                                      <input
                                        title='Min'
                                        type="number"
                                        value={editFormData.defaultMinQuantity}
                                        onChange={(e) => setEditFormData({ ...editFormData, defaultMinQuantity: parseInt(e.target.value) || 1 })}
                                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:ring-2 focus:ring-primary-500/20"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-500 dark:text-gray-300 mb-1">{t('extrasManagement.productExtras.max')}</label>
                                      <input
                                        title='Max'
                                        type="number"
                                        value={editFormData.defaultMaxQuantity}
                                        onChange={(e) => setEditFormData({ ...editFormData, defaultMaxQuantity: parseInt(e.target.value) || 1 })}
                                        className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:ring-2 focus:ring-primary-500/20"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2 justify-end mt-6">
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                  disabled={isSubmitting}
                                >
                                  {t('common.cancel')}
                                </button>
                                <button
                                  onClick={() => handleUpdateExtra(extra.id)}
                                  disabled={isSubmitting}
                                  className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm"
                                >
                                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                  {t('common.save')}
                                </button>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between group gap-4 sm:gap-0">
                              <div className="flex-1 w-full">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {getExtraName(extra.extraId)}
                                  </h3>
                                  <div className="flex gap-2">
                                    {extra.isRequired && (
                                      <span className="px-2 py-0.5 text-xs font-bold uppercase bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded">
                                        {t('extrasManagement.productExtras.requiredShort')}
                                      </span>
                                    )}
                                    <span className="px-2 py-0.5 text-xs font-bold uppercase bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                                      {extra.selectionMode === 0 ? t('extrasManagement.productExtras.single') : t('extrasManagement.productExtras.multiple')}
                                    </span>
                                  </div>
                                </div>
                                
                                {extraDetails?.description && (
                                  <p className="text-sm text-gray-500 dark:text-gray-300 mb-3 line-clamp-1">
                                    {extraDetails.description}
                                  </p>
                                )}

                                <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm">
                                  <div className="flex items-center gap-1.5 text-gray-900 dark:text-white font-semibold bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full border border-green-100 dark:border-green-900/30">
                                    <span className="h-4 w-4 text-green-600 dark:text-green-400">{currency.symbol}</span>
                                    <span>{extra.unitPrice.toFixed(2)}</span>
                                  </div>
                                  <div className="text-gray-500 dark:text-gray-300">
                                    {t('extrasManagement.productExtras.qty')}: <span className="font-medium text-gray-700 dark:text-gray-300">{extra.defaultQuantity}</span> ({extra.defaultMinQuantity}-{extra.defaultMaxQuantity})
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 justify-end sm:border-l border-gray-200 dark:border-gray-700 sm:pl-4 sm:ml-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                                <button
                                  onClick={() => startEdit(extra)}
                                  className="p-2 text-gray-400 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(extra.id)}
                                  className="p-2 text-gray-400 dark:text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

       <ConfirmationModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Delete Extra Assignment"
        message={t('extrasManagement.productExtras.confirmDeleteExtra')} 
        
        />
    </>
  );
};

export default ProductExtrasManagementModal;