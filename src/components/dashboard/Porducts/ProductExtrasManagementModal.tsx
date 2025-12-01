import React, { useState, useEffect } from 'react';
import {
  X, Plus, Edit2, Trash2, Save, Loader2, Package,
  DollarSign, Check, AlertCircle, ArrowLeft, Layers
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { logger } from '../../../utils/logger';
import { CreateProductExtraData, ProductExtra, UpdateProductExtraData, Extra } from '../../../types/Extras/type';
import { productExtrasService } from '../../../services/Extras/ProductExtrasService';
import { extrasService } from '../../../services/Extras/ExtrasService';
import { ConfirmationModal } from './ConfirmationModal';
// Import ConfirmationModal here

interface ProductExtrasManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  productId: number;
  productName: string;
  extraCategoryId: number;
  extraCategoryName: string;
}

const ProductExtrasManagementModal: React.FC<ProductExtrasManagementModalProps> = ({
  isOpen,
  onClose,
  onBack,
  productId,
  productName,
  extraCategoryId,
  extraCategoryName
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

  // Delete Confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null
  });

  // Form state
  const [formData, setFormData] = useState({
    extraId: 0,
    selectionMode: 0, // 0: Single, 1: Multiple
    defaultQuantity: 1,
    defaultMinQuantity: 0,
    defaultMaxQuantity: 10,
    unitPrice: 0,
    isRequired: false
  });

  const [editFormData, setEditFormData] = useState({
    selectionMode: 0,
    defaultQuantity: 1,
    defaultMinQuantity: 0,
    defaultMaxQuantity: 10,
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
        selectionMode: formData.selectionMode,
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
        defaultMaxQuantity: 10,
        unitPrice: 0,
        isRequired: false
      });
      setShowAddForm(false);
    } catch (error) {
      logger.error('Failed to add product extra:', error);
      setError(t('error.saveFailed'));
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
        selectionMode: editFormData.selectionMode,
        defaultQuantity: editFormData.defaultQuantity,
        defaultMinQuantity: editFormData.defaultMinQuantity,
        defaultMaxQuantity: editFormData.defaultMaxQuantity,
        unitPrice: editFormData.unitPrice,
        isRequired: editFormData.isRequired
      };

      await productExtrasService.updateProductExtra(data);
      await loadData();
      setEditingId(null);
    } catch (error) {
      logger.error('Failed to update product extra:', error);
      setError(t('error.updateFailed'));
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col ${
            isRTL ? 'rtl' : 'ltr'
          }`}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 z-10">
            <div className="flex items-center gap-4">
               <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
                  title={t('common.back')}
                >
                  <ArrowLeft className={`h-6 w-6 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Layers className="h-6 w-6 text-primary-600" />
                  {t('extrasManagement.productExtras.manageExtras')}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>{productName}</span>
                  <span className="text-gray-300 mx-1">•</span>
                  <span className="font-medium text-primary-600 dark:text-primary-400">{extraCategoryName}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900/50">
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
                    className="group w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all duration-200"
                  >
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-1 group-hover:bg-primary-100 dark:group-hover:bg-primary-900 transition-colors">
                      <Plus className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-lg">{t('extrasManagement.productExtras.addExtra')}</span>
                  </button>
                )}

                {/* Add Form */}
                {showAddForm && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg animate-in fade-in slide-in-from-bottom-4">
                     <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t('extrasManagement.productExtras.addExtra')}
                      </h3>
                      <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Left Side: Basic Info */}
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            {t('extrasManagement.productExtras.selectExtra')} <span className="text-red-500">*</span>
                          </label>
                          <select
                            title='Select Extra'
                            value={formData.extraId}
                            onChange={(e) => handleExtraSelect(parseInt(e.target.value))}
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                          >
                            <option value={0}>{t('extrasManagement.productExtras.chooseExtra')}</option>
                            {getAvailableExtrasToAdd().map(extra => (
                              <option key={extra.id} value={extra.id}>
                                {extra.name} ({t('extrasManagement.productExtras.basePrice')}: ${extra.basePrice.toFixed(2)})
                              </option>
                            ))}
                          </select>
                          {formData.extraId > 0 && (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-100 dark:border-gray-700">
                              {getExtraDetails(formData.extraId)?.description || "No description available"}
                            </p>
                          )}
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('extrasManagement.productExtras.unitPrice')} <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <DollarSign className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                            <input
                              title='Unit Price'
                              type="number"
                              min={0}
                              step={0.01}
                              value={formData.unitPrice}
                              onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                              className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-medium text-lg`}
                            />
                          </div>
                        </div>

                        <div className="space-y-3 pt-2">
                           <label className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <input
                              type="checkbox"
                              checked={formData.isRequired}
                              onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                              className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                              {t('extrasManagement.productExtras.requiredExtra')}
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Right Side: Logic */}
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('extrasManagement.productExtras.selectionMode')}
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${formData.selectionMode === 0 ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-gray-200 hover:border-gray-300'}`}>
                              <input
                                type="radio"
                                value={0}
                                checked={formData.selectionMode === 0}
                                onChange={() => setFormData({ ...formData, selectionMode: 0 })}
                                className="hidden"
                              />
                              <span className="font-medium">{t('extrasManagement.productExtras.single')}</span>
                            </label>
                            <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${formData.selectionMode === 1 ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-gray-200 hover:border-gray-300'}`}>
                              <input
                                type="radio"
                                value={1}
                                checked={formData.selectionMode === 1}
                                onChange={() => setFormData({ ...formData, selectionMode: 1 })}
                                className="hidden"
                              />
                              <span className="font-medium">{t('extrasManagement.productExtras.multiple')}</span>
                            </label>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl space-y-4">
                           <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity Configuration</h4>
                           <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Default</label>
                              <input
                                title='Default'
                                type="number"
                                min={1}
                                value={formData.defaultQuantity}
                                onChange={(e) => setFormData({ ...formData, defaultQuantity: parseInt(e.target.value) || 1 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Min</label>
                              <input
                                title='Min'
                                type="number"
                                min={0}
                                value={formData.defaultMinQuantity}
                                onChange={(e) => setFormData({ ...formData, defaultMinQuantity: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Max</label>
                              <input
                                title='Max'
                                type="number"
                                min={1}
                                value={formData.defaultMaxQuantity}
                                onChange={(e) => setFormData({ ...formData, defaultMaxQuantity: parseInt(e.target.value) || 10 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        disabled={isSubmitting}
                      >
                        {t('common.cancel')}
                      </button>
                      <button
                        onClick={handleAddExtra}
                        disabled={isSubmitting || !formData.extraId}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50"
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
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      {t('extrasManagement.productExtras.noExtrasYet')}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">Add extras to this category using the button above.</p>
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
                            <div className="p-6">
                              <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                  {t('common.edit')}: {getExtraName(extra.extraId)}
                                </h3>
                                <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                  <input
                                    id={`edit-req-${extra.id}`}
                                    type="checkbox"
                                    checked={editFormData.isRequired}
                                    onChange={(e) => setEditFormData({ ...editFormData, isRequired: e.target.checked })}
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                  />
                                  <label htmlFor={`edit-req-${extra.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
                                    {t('extrasManagement.productExtras.requiredExtra')}
                                  </label>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price & Selection</label>
                                    <div className="relative mb-3">
                                      <DollarSign className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`} />
                                      <input
                                        title='Unit Price'
                                        type="number"
                                        min={0}
                                        step={0.01}
                                        value={editFormData.unitPrice}
                                        onChange={(e) => setEditFormData({ ...editFormData, unitPrice: parseFloat(e.target.value) || 0 })}
                                        className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 rounded-lg`}
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                       <button 
                                        onClick={() => setEditFormData({...editFormData, selectionMode: 0})}
                                        className={`flex-1 py-2 text-xs font-medium rounded border ${editFormData.selectionMode === 0 ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-white border-gray-200'}`}
                                       >
                                         Single Select
                                       </button>
                                       <button 
                                        onClick={() => setEditFormData({...editFormData, selectionMode: 1})}
                                        className={`flex-1 py-2 text-xs font-medium rounded border ${editFormData.selectionMode === 1 ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-white border-gray-200'}`}
                                       >
                                         Multi Select
                                       </button>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Quantities</h4>
                                  <div className="grid grid-cols-3 gap-2">
                                    <div>
                                      <label className="block text-xs text-gray-500 mb-1">Def.</label>
                                      <input
                                        title='Default'
                                        type="number"
                                        value={editFormData.defaultQuantity}
                                        onChange={(e) => setEditFormData({ ...editFormData, defaultQuantity: parseInt(e.target.value) || 1 })}
                                        className="w-full px-2 py-1.5 text-sm border rounded"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-500 mb-1">Min</label>
                                      <input
                                        title='Min'
                                        type="number"
                                        value={editFormData.defaultMinQuantity}
                                        onChange={(e) => setEditFormData({ ...editFormData, defaultMinQuantity: parseInt(e.target.value) || 0 })}
                                        className="w-full px-2 py-1.5 text-sm border rounded"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-500 mb-1">Max</label>
                                      <input
                                        title='Max'
                                        type="number"
                                        value={editFormData.defaultMaxQuantity}
                                        onChange={(e) => setEditFormData({ ...editFormData, defaultMaxQuantity: parseInt(e.target.value) || 10 })}
                                        className="w-full px-2 py-1.5 text-sm border rounded"
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
                            <div className="p-5 flex items-center justify-between group">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {getExtraName(extra.extraId)}
                                  </h3>
                                  <div className="flex gap-2">
                                    {extra.isRequired && (
                                      <span className="px-2 py-0.5 text-xs font-bold uppercase bg-red-100 text-red-700 rounded">
                                        Req
                                      </span>
                                    )}
                                    <span className="px-2 py-0.5 text-xs font-bold uppercase bg-blue-100 text-blue-700 rounded">
                                      {extra.selectionMode === 0 ? 'Single' : 'Multi'}
                                    </span>
                                  </div>
                                </div>
                                
                                {extraDetails?.description && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">
                                    {extraDetails.description}
                                  </p>
                                )}

                                <div className="flex items-center gap-6 text-sm">
                                  <div className="flex items-center gap-1.5 text-gray-900 dark:text-white font-semibold bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full border border-green-100 dark:border-green-900/30">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                    <span>{extra.unitPrice.toFixed(2)}</span>
                                  </div>
                                  <div className="text-gray-500">
                                    Qty: <span className="font-medium text-gray-700 dark:text-gray-300">{extra.defaultQuantity}</span> ({extra.defaultMinQuantity}-{extra.defaultMaxQuantity})
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 border-l border-gray-200 dark:border-gray-700 pl-4 ml-4">
                                <button
                                  onClick={() => startEdit(extra)}
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(extra.id)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
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