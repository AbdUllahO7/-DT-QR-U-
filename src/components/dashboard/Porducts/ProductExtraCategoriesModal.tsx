import React, { useState, useEffect } from 'react';
import {
  X, Plus, Edit2, Trash2, Save, Loader2, Package, 
  AlertCircle, ChevronRight, Layers
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { logger } from '../../../utils/logger';
import { CreateProductExtraCategoryData, ProductExtraCategory, UpdateProductExtraCategoryData, ExtraCategory } from '../../../types/Extras/type';
import { productExtraCategoriesService } from '../../../services/Extras/ProductExtraCategoriesService';
import { extraCategoriesService } from '../../../services/Extras/ExtraCategoriesService';
import { ConfirmationModal } from './ConfirmationModal';

interface ProductExtraCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productName: string;
  onSelectCategory: (categoryId: number, categoryName: string, isRemoval: boolean) => void;
}

const ProductExtraCategoriesModal: React.FC<ProductExtraCategoriesModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  onSelectCategory
}) => {
  const { t, isRTL } = useLanguage();
  const { isDark } = useTheme();

  // State
  const [productExtraCategories, setProductExtraCategories] = useState<ProductExtraCategory[]>([]);
  const [allExtraCategories, setAllExtraCategories] = useState<ExtraCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null
  });

  // Form state
  const [formData, setFormData] = useState({
    extraCategoryId: 0,
    isRequiredOverride: false,
    minSelectionCount: 0,
    maxSelectionCount: 1,
    minTotalQuantity: 0,
    maxTotalQuantity: 10,
    isMaxSelectionUnlimited: false
  });

  const [editFormData, setEditFormData] = useState({
    isRequiredOverride: false,
    minSelectionCount: 0,
    maxSelectionCount: 1,
    minTotalQuantity: 0,
    maxTotalQuantity: 10,
    isMaxSelectionUnlimited: false
  });

  // Load data
  useEffect(() => {
    if (isOpen && productId) {
      loadData();
    }
    return () => setError(null);
  }, [isOpen, productId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const allCategories = await extraCategoriesService.getExtraCategories();
      setAllExtraCategories(allCategories.filter(cat => cat.status));
      
      const productCategories = await productExtraCategoriesService.getProductExtraCategories();
      const filtered = productCategories.filter(cat => cat.productId === productId);
      setProductExtraCategories(filtered);
    } catch (error) {
      logger.error('Failed to load data:', error);
      setError(t('error.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!formData.extraCategoryId) {
      setError(t('extrasManagement.productExtras.selectCategory'));
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Check if removal to sanitize data before sending
      const selectedCategory = allExtraCategories.find(c => c.id === formData.extraCategoryId);
      const isRemoval = selectedCategory?.isRemovalCategory || false;

      const data: CreateProductExtraCategoryData = {
        productId: productId,
        extraCategoryId: formData.extraCategoryId,
        isRequiredOverride: formData.isRequiredOverride,
        // If removal, min selection is 0
        minSelectionCount: isRemoval ? 0 : formData.minSelectionCount,
        // If unlimited, send null or a very high number depending on backend, 
        // assuming backend accepts null for unlimited or we handle it in UI logic
        maxSelectionCount: formData.isMaxSelectionUnlimited ? null : formData.maxSelectionCount,
        // If removal, quantities are 0/null
        minTotalQuantity: isRemoval ? 0 : formData.minTotalQuantity,
        maxTotalQuantity: isRemoval ? null : formData.maxTotalQuantity
      };

      await productExtraCategoriesService.createProductExtraCategory(data);
      await loadData();
      
      setFormData({
        extraCategoryId: 0,
        isRequiredOverride: false,
        minSelectionCount: 0,
        maxSelectionCount: 1,
        minTotalQuantity: 0,
        maxTotalQuantity: 10,
        isMaxSelectionUnlimited: false
      });
      setShowAddForm(false);
    } catch (error:any) {
      logger.error('Failed to add product extra category:', error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async (id: number) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Find original category to check if removal
      const existingRecord = productExtraCategories.find(p => p.id === id);
      const originalCategory = allExtraCategories.find(c => c.id === existingRecord?.extraCategoryId);
      const isRemoval = originalCategory?.isRemovalCategory || false;

      const data: UpdateProductExtraCategoryData = {
        id: id,
        isRequiredOverride: editFormData.isRequiredOverride,
        minSelectionCount: isRemoval ? 0 : editFormData.minSelectionCount,
        maxSelectionCount: editFormData.isMaxSelectionUnlimited ? null : editFormData.maxSelectionCount,
        minTotalQuantity: isRemoval ? 0 : editFormData.minTotalQuantity,
        maxTotalQuantity: isRemoval ? null : editFormData.maxTotalQuantity
      };

      await productExtraCategoriesService.updateProductExtraCategory(data);
      await loadData();
      setEditingId(null);
    } catch (error :any) {
      logger.error('Failed to update product extra category:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteConfirm({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      setIsSubmitting(true);
      setError(null);
      await productExtraCategoriesService.deleteProductExtraCategory(deleteConfirm.id);
      await loadData();
      setDeleteConfirm({ isOpen: false, id: null });
    } catch (error) {
      logger.error('Failed to delete product extra category:', error);
      setError(t('error.deleteFailed'));
      setDeleteConfirm({ isOpen: false, id: null });
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (category: ProductExtraCategory) => {
    setError(null);
    setEditingId(category.id);
    
    // Check if max selection suggests unlimited
    const isUnlimited = category.maxSelectionCount === null || category.maxSelectionCount > 1000;

    setEditFormData({
      isRequiredOverride: category.isRequiredOverride,
      minSelectionCount: category.minSelectionCount,
      maxSelectionCount: isUnlimited ? 0 : category.maxSelectionCount,
      minTotalQuantity: category.minTotalQuantity,
      maxTotalQuantity: category.maxTotalQuantity,
      isMaxSelectionUnlimited: isUnlimited
    });
  };

  const getCategoryName = (extraCategoryId: number): string => {
    const category = allExtraCategories.find(cat => cat.id === extraCategoryId);
    return category ? category.categoryName : t('extrasManagement.productExtras.unknownCategory');
  };

  const getAvailableCategoriesToAdd = () => {
    const usedCategoryIds = productExtraCategories.map(cat => cat.extraCategoryId);
    return allExtraCategories.filter(cat => !usedCategoryIds.includes(cat.id));
  };

  const handleCategorySelect = (categoryId: number) => {
    const category = allExtraCategories.find(cat => cat.id === categoryId);
    if (category) {
      const isRemoval = category.isRemovalCategory;
      setFormData({
        ...formData,
        extraCategoryId: categoryId,
        isRequiredOverride: category.isRequired,
        minSelectionCount: isRemoval ? 0 : category.defaultMinSelectionCount,
        maxSelectionCount: category.defaultMaxSelectionCount,
        minTotalQuantity: isRemoval ? 0 : category.defaultMinTotalQuantity,
        maxTotalQuantity: isRemoval ? 10 : category.defaultMaxTotalQuantity,
        isMaxSelectionUnlimited: false
      });
    }
  };

  // Helper to determine if the currently selected (for Add) or currently edited category is removal
  const isSelectedCategoryRemoval = () => {
    if (!formData.extraCategoryId) return false;
    const cat = allExtraCategories.find(c => c.id === formData.extraCategoryId);
    return cat?.isRemovalCategory || false;
  };

  const isEditingCategoryRemoval = (categoryId: number) => {
     // We need to look up the extraCategoryId from the ProductExtraCategory record
     const productCat = productExtraCategories.find(pc => pc.id === categoryId);
     if(!productCat) return false;
     const cat = allExtraCategories.find(c => c.id === productCat.extraCategoryId);
     return cat?.isRemovalCategory || false;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4 animate-in fade-in duration-200">
        <div 
          className={`bg-white dark:bg-gray-800 rounded-none sm:rounded-2xl shadow-2xl w-full max-w-4xl h-full sm:h-auto sm:max-h-[85vh] overflow-hidden flex flex-col ${
            isRTL ? 'rtl' : 'ltr'
          }`}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 z-10 shrink-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Layers className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                {t('extrasManagement.productExtras.manageCategories')}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 pl-7 sm:pl-8 truncate max-w-[200px] sm:max-w-md">
                {productName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-900/50">
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
                {/* Add New Category Button */}
                {!showAddForm && getAvailableCategoriesToAdd().length > 0 && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="group w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all duration-200"
                  >
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-1 group-hover:bg-primary-100 dark:group-hover:bg-primary-900 transition-colors">
                      <Plus className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-lg">{t('extrasManagement.productExtras.addCategory')}</span>
                  </button>
                )}

                {/* Add Form */}
                {showAddForm && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('extrasManagement.productExtras.addCategory')}
                      </h3>
                      <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {/* Column 1 */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            {t('extrasManagement.productExtras.selectCategory')} <span className="text-red-500">*</span>
                          </label>
                          <select
                            title={t('extrasManagement.productExtras.selectCategory')}
                            value={formData.extraCategoryId}
                            onChange={(e) => handleCategorySelect(parseInt(e.target.value))}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                          >
                            <option value={0}>{t('extrasManagement.productExtras.chooseCategory')}</option>
                            {getAvailableCategoriesToAdd().map(cat => (
                              <option key={cat.id} value={cat.id}>
                                {cat.categoryName} {cat.isRemovalCategory ? `(${t('extrasManagement.categoryConfigModal.badges.removal')})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <input
                            id="add-required"
                            type="checkbox"
                            checked={formData.isRequiredOverride}
                            onChange={(e) => setFormData({ ...formData, isRequiredOverride: e.target.checked })}
                            className="w-5 h-5 rounded dark:text-gray-300 border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <label htmlFor="add-required" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                            {t('extrasManagement.productExtras.required')}
                          </label>
                        </div>
                      </div>

                      {/* Column 2: Selection Logic */}
                      <div className="space-y-4">
                        {isSelectedCategoryRemoval() ? (
                           // REMOVAL UI: Only Max Selection with Unlimited
                           <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-white mb-1 uppercase tracking-wider">
                                  {t('extrasManagement.productExtras.maxSelection')}
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    title={t('extrasManagement.productExtras.maxSelection')}
                                    type="number"
                                    min={1}
                                    value={formData.isMaxSelectionUnlimited ? '' : formData.maxSelectionCount}
                                    onChange={(e) => setFormData({ ...formData, maxSelectionCount: parseInt(e.target.value) || 1 })}
                                    disabled={formData.isMaxSelectionUnlimited}
                                    className="w-full px-3 py-2 border dark:text-gray-300 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                  />
                                  <label className="flex items-center gap-2 whitespace-nowrap cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={formData.isMaxSelectionUnlimited}
                                      onChange={(e) => setFormData({ ...formData, isMaxSelectionUnlimited: e.target.checked })}
                                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      {t('extrasManagement.categories.fields.unlimited')}
                                    </span>
                                  </label>
                                </div>
                               
                              </div>
                           </div>
                        ) : (
                           // STANDARD UI: Full Grid
                           <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-white mb-1 uppercase tracking-wider">
                                  {t('extrasManagement.productExtras.minSelection')}
                                </label>
                                <input
                                  title={t('extrasManagement.productExtras.minSelection')}
                                  type="number"
                                  min={0}
                                  value={formData.minSelectionCount}
                                  onChange={(e) => setFormData({ ...formData, minSelectionCount: parseInt(e.target.value) || 0 })}
                                  className="w-full px-3 py-2 border border-gray-300  dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-white mb-1 uppercase tracking-wider">
                                  {t('extrasManagement.productExtras.maxSelection')}
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    title={t('extrasManagement.productExtras.maxSelection')}
                                    type="number"
                                    min={1}
                                    value={formData.isMaxSelectionUnlimited ? '' : formData.maxSelectionCount}
                                    onChange={(e) => setFormData({ ...formData, maxSelectionCount: parseInt(e.target.value) || 1 })}
                                    disabled={formData.isMaxSelectionUnlimited}
                                    className="w-full px-3 py-2 border dark:text-gray-300 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                  />
                                   <label className="flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={formData.isMaxSelectionUnlimited}
                                      onChange={(e) => setFormData({ ...formData, isMaxSelectionUnlimited: e.target.checked })}
                                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                    />
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                      {t('extrasManagement.categories.fields.unlimited')}
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-white mb-1 uppercase tracking-wider">
                                  {t('extrasManagement.productExtras.minQuantity')}
                                </label>
                                <input
                                  title={t('extrasManagement.productExtras.minQuantity')}
                                  type="number"
                                  min={0}
                                  value={formData.minTotalQuantity}
                                  onChange={(e) => setFormData({ ...formData, minTotalQuantity: parseInt(e.target.value) || 0 })}
                                  className="w-full px-3 py-2 border dark:text-gray-300 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-white mb-1 uppercase tracking-wider">
                                  {t('extrasManagement.productExtras.maxQuantity')}
                                </label>
                                <input
                                  title={t('extrasManagement.productExtras.maxQuantity')}
                                  type="number"
                                  min={1}
                                  value={formData.maxTotalQuantity}
                                  onChange={(e) => setFormData({ ...formData, maxTotalQuantity: parseInt(e.target.value) || 10 })}
                                  className="w-full px-3 py-2 border dark:text-gray-300 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700"
                                />
                              </div>
                            </div>
                           </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        disabled={isSubmitting}
                      >
                        {t('extrasManagement.buttons.cancel')}
                      </button>
                      <button
                        onClick={handleAddCategory}
                        disabled={isSubmitting || !formData.extraCategoryId}
                        className="w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {t('extrasManagement.buttons.save')}
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            {t('extrasManagement.buttons.save')}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Categories List */}
                {productExtraCategories.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <div className="bg-gray-50 dark:bg-gray-700 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      {t('extrasManagement.productExtras.noCategoriesYet')}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                       {t('extrasManagement.categories.tryAdjusting')}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {productExtraCategories.map((category) => {
                      const isRemoval = isEditingCategoryRemoval(category.id);
                      
                      return (
                      <div
                        key={category.id}
                        className={`bg-white dark:bg-gray-800 rounded-xl border transition-all duration-200 ${
                          editingId === category.id 
                            ? 'border-primary-500 ring-2 ring-primary-500/10 shadow-lg z-10' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md'
                        }`}
                      >
                        {editingId === category.id ? (
                          // Edit Mode
                          <div className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6">
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                  {t('extrasManagement.buttons.edit')}: {getCategoryName(category.extraCategoryId)}
                                </h3>
                                {isRemoval && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                                    {t('extrasManagement.categoryConfigModal.badges.removal')}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded w-fit">
                                <input
                                  id={`edit-req-${category.id}`}
                                  type="checkbox"
                                  checked={editFormData.isRequiredOverride}
                                  onChange={(e) => setEditFormData({ ...editFormData, isRequiredOverride: e.target.checked })}
                                  className="rounded border-gray-300 dark:text-white text-primary-600 focus:ring-primary-500"
                                />
                                <label htmlFor={`edit-req-${category.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
                                  {t('extrasManagement.productExtras.required')}
                                </label>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                               {isRemoval ? (
                                  // REMOVAL EDIT UI
                                  <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg col-span-1 md:col-span-2">
                                     <h4 className="text-xs font-bold text-gray-500 uppercase dark:text-white tracking-wider mb-2">
                                        {t('extrasManagement.productExtras.selectionLimits')}
                                     </h4>
                                     <div className="grid grid-cols-1 gap-4 max-w-md">
                                        <div>
                                          <label className="block text-xs dark:text-white mb-1">
                                            {t('extrasManagement.productExtras.maxSelectLabel')}
                                          </label>
                                          <div className="flex items-center gap-2">
                                            <input
                                              title={t('extrasManagement.productExtras.maxSelectLabel')}
                                              type="number"
                                              min={1}
                                              value={editFormData.isMaxSelectionUnlimited ? '' : editFormData.maxSelectionCount}
                                              onChange={(e) => setEditFormData({ ...editFormData, maxSelectionCount: parseInt(e.target.value) || 1 })}
                                              disabled={editFormData.isMaxSelectionUnlimited}
                                              className="w-full px-3 py-2 dark:text-white border rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                                            />
                                            <label className="flex items-center gap-2 whitespace-nowrap cursor-pointer">
                                              <input
                                                type="checkbox"
                                                checked={editFormData.isMaxSelectionUnlimited}
                                                onChange={(e) => setEditFormData({ ...editFormData, isMaxSelectionUnlimited: e.target.checked })}
                                                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                              />
                                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                                {t('extrasManagement.categories.fields.unlimited')}
                                              </span>
                                            </label>
                                          </div>
                                        </div>
                                     </div>
                                  </div>
                               ) : (
                                  // STANDARD EDIT UI
                                  <>
                                    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase dark:text-white tracking-wider mb-2">
                                          {t('extrasManagement.productExtras.selectionLimits')}
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                          <div>
                                            <label className="block text-xs dark:text-white text-gray-500 mb-1">
                                              {t('extrasManagement.productExtras.minSelectLabel')}
                                            </label>
                                            <input
                                              title={t('extrasManagement.productExtras.minSelectLabel')}
                                              type="number"
                                              min={0}
                                              value={editFormData.minSelectionCount}
                                              onChange={(e) => setEditFormData({ ...editFormData, minSelectionCount: parseInt(e.target.value) || 0 })}
                                              className="w-full px-3 py-2 border dark:text-white rounded-md dark:bg-gray-700 dark:border-gray-600"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-xs dark:text-white mb-1">
                                              {t('extrasManagement.productExtras.maxSelectLabel')}
                                            </label>
                                            <div className="flex items-center gap-2">
                                              <input
                                                title={t('extrasManagement.productExtras.maxSelectLabel')}
                                                type="number"
                                                min={1}
                                                value={editFormData.isMaxSelectionUnlimited ? '' : editFormData.maxSelectionCount}
                                                onChange={(e) => setEditFormData({ ...editFormData, maxSelectionCount: parseInt(e.target.value) || 1 })}
                                                disabled={editFormData.isMaxSelectionUnlimited}
                                                className="w-full px-3 py-2 dark:text-white border rounded-md dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50"
                                              />
                                              <label className="flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
                                                <input
                                                  type="checkbox"
                                                  checked={editFormData.isMaxSelectionUnlimited}
                                                  onChange={(e) => setEditFormData({ ...editFormData, isMaxSelectionUnlimited: e.target.checked })}
                                                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                                />
                                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                                  {t('extrasManagement.categories.fields.unlimited')}
                                                </span>
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                        <h4 className="text-xs font-bold dark:text-white text-gray-500 uppercase tracking-wider mb-2">
                                          {t('extrasManagement.productExtras.quantityLimits')}
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                          <div>
                                            <label className="block text-xs dark:text-white mb-1">
                                              {t('extrasManagement.productExtras.minTotalLabel')}
                                            </label>
                                            <input
                                              title={t('extrasManagement.productExtras.minTotalLabel')}
                                              type="number"
                                              min={0}
                                              value={editFormData.minTotalQuantity}
                                              onChange={(e) => setEditFormData({ ...editFormData, minTotalQuantity: parseInt(e.target.value) || 0 })}
                                              className="w-full px-3 py-2 dark:text-white border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-xs text-gray-500 dark:text-white mb-1">
                                              {t('extrasManagement.productExtras.maxTotalLabel')}
                                            </label>
                                            <input
                                              title={t('extrasManagement.productExtras.maxTotalLabel')}
                                              type="number"
                                              min={1}
                                              value={editFormData.maxTotalQuantity}
                                              onChange={(e) => setEditFormData({ ...editFormData, maxTotalQuantity: parseInt(e.target.value) || 10 })}
                                              className="w-full px-3 py-2 border dark:text-white rounded-md dark:bg-gray-700 dark:border-gray-600"
                                            />
                                          </div>
                                        </div>
                                    </div>
                                  </>
                               )}
                            </div>

                            <div className="flex gap-3 justify-end">
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                disabled={isSubmitting}
                              >
                                {t('extrasManagement.buttons.cancel')}
                              </button>
                              <button
                                onClick={() => handleUpdateCategory(category.id)}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm"
                              >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {t('extrasManagement.buttons.save')}
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 group">
                            <div className="flex-1 w-full">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                  {getCategoryName(category.extraCategoryId)}
                                </h3>
                                {isRemoval && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-medium">
                                    {t('extrasManagement.categoryConfigModal.badges.removal')}
                                  </span>
                                )}
                                {category.isRequiredOverride ? (
                                  <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-full">
                                    {t('extrasManagement.productExtras.required')}
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                                    {t('extrasManagement.productExtras.optional')}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex flex-row flex-wrap gap-4 sm:gap-6 text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-0">
                                <div className="flex flex-col">
                                  <span className="text-xs text-gray-400 uppercase">{t('extrasManagement.productExtras.selection')}</span>
                                  <span className="font-medium text-gray-900 dark:text-gray-200">
                                    {category.minSelectionCount} - {
                                      (category.maxSelectionCount === null || category.maxSelectionCount > 1000) 
                                      ? t('extrasManagement.categories.fields.unlimited') 
                                      : category.maxSelectionCount
                                    }
                                  </span>
                                </div>
                                {!isRemoval && (
                                  <>
                                    <div className="hidden sm:block w-px bg-gray-200 dark:bg-gray-700 h-8"></div>
                                    <div className="flex flex-col">
                                      <span className="text-xs text-gray-400 uppercase">{t('extrasManagement.productExtras.quantity')}</span>
                                      <span className="font-medium text-gray-900 dark:text-gray-200">{category.minTotalQuantity} - {category.maxTotalQuantity}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2 w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-700 pt-3 sm:pt-0">
                              <button
                                onClick={() => onSelectCategory(category.extraCategoryId, getCategoryName(category.extraCategoryId), isRemoval)}
                                className="flex justify-center sm:justify-start items-center gap-1 px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors sm:mr-2"
                              >
                                {t('extrasManagement.productExtras.manageExtras')}
                                <ChevronRight className="h-4 w-4" />
                              </button>
                              
                              <div className="flex justify-center sm:justify-start items-center gap-1 sm:border-l border-gray-200 dark:border-gray-700 sm:pl-3">
                                <button
                                  onClick={() => startEdit(category)}
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                  title={t('extrasManagement.buttons.edit')}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(category.id)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                  title={t('extrasManagement.buttons.delete')}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )})}
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
        title={t('extrasManagement.deleteModal.titleCategory')}
        message={t('extrasManagement.productExtras.confirmDelete')}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default ProductExtraCategoriesModal;