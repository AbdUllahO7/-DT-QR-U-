import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Search, Check, Plus, Trash2, Star,
  Loader2, AlertCircle, Package,
  GripVertical, Edit3, Save, XCircle, Sparkles
} from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useLanguage } from '../../../contexts/LanguageContext';
import { logger } from '../../../utils/logger';
import { productService } from '../../../services/productService';
import { AvailableAddonProduct, ProductAddon, productAddonsService } from '../../../services/ProductAddonsService';
import { ProductAddonsModalProps, SelectedProductData } from '../../../types/BranchManagement/type';
import { useCurrency } from '../../../hooks/useCurrency';

// Sortable Addon Component
const SortableAddonItem: React.FC<{
  addon: ProductAddon & { addonProduct?: AvailableAddonProduct };
  onUpdate: (id: number, updates: Partial<ProductAddon>) => void;
  onRemove: (id: number) => void;
  isEditing: boolean;
  onEdit: (id: number) => void;
  onSaveEdit: (id: number) => void;
  onCancelEdit: () => void;
  editingData: { marketingText: string; isRecommended: boolean };
  onEditingDataChange: (field: string, value: any) => void;
}> = ({
  addon, onRemove, isEditing, onEdit, onSaveEdit,
  onCancelEdit, editingData, onEditingDataChange
}) => {
    const { t } = useLanguage();
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({ id: addon.id });
    const currency = useCurrency();

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      zIndex: isDragging ? 999 : 'auto',
      position: 'relative' as const,
      touchAction: 'none' // Important for mobile dragging
    };

    const addonProduct = addon.addonProduct;
    const hasValidImage = addonProduct?.imageUrl && addonProduct.imageUrl.trim() !== '';

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`group relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 ${isDragging
          ? 'shadow-2xl shadow-primary-500/20 ring-2 ring-primary-500 scale-105'
          : 'shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-700'
          }`}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        <div className="p-3 sm:p-4 flex items-start gap-3 sm:gap-4">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="mt-2 p-1.5 sm:p-2 text-gray-400 hover:text-primary-800 dark:hover:text-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-110 flex-shrink-0"
          >
            <GripVertical className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Product Image */}
          <div className="flex-shrink-0 hidden xs:block">
            {hasValidImage ? (
              <div className="relative group/image">
                <img
                  src={addonProduct.imageUrl}
                  alt={addonProduct?.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl object-cover bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 ring-2 ring-gray-200 dark:ring-gray-700"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 truncate text-sm sm:text-base">
                  {addonProduct?.name || `Product ID: ${addon.addonProductId}`}
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs sm:text-sm font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg">
                    {currency.symbol}
                    {addonProduct?.price?.toFixed(2) || '0.00'}
                  </span>
                  {addon.isRecommended && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg whitespace-nowrap">
                      <Star className="h-3 w-3 fill-current" />
                      {t('productAddonsModal.form.isRecommended.badge')}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1 self-start">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => onSaveEdit(addon.id)}
                      className="p-1.5 sm:p-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={onCancelEdit}
                      className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onEdit(addon.id)}
                      className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onRemove(addon.id)}
                      className="p-1.5 sm:p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Marketing Text */}
            {isEditing ? (
              <div className="space-y-3 mt-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <textarea
                  value={editingData.marketingText}
                  onChange={(e) => onEditingDataChange('marketingText', e.target.value)}
                  placeholder={t('productAddonsModal.form.marketingText.placeholder')}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none transition-all duration-200"
                  rows={2}
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingData.isRecommended}
                    onChange={(e) => onEditingDataChange('isRecommended', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-300 dark:bg-gray-600 peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-500 peer-checked:to-yellow-600"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {t('productAddonsModal.form.isRecommended.label')}
                  </span>
                </label>
              </div>
            ) : (
              <>
                {addon.marketingText && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg line-clamp-2">
                    "{addon.marketingText}"
                  </p>
                )}
                {addonProduct?.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1.5">
                    {addonProduct.description}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

const ProductAddonsModal: React.FC<ProductAddonsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  productId,
  productName
}) => {
  const { t, isRTL } = useLanguage();
  const currency = useCurrency();

  const [currentAddons, setCurrentAddons] = useState<ProductAddon[]>([]);
  const [availableProducts, setAvailableProducts] = useState<AvailableAddonProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductsData, setSelectedProductsData] = useState<Map<number, SelectedProductData>>(new Map());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingAddonId, setEditingAddonId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({ marketingText: '', isRecommended: false });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const loadData = async () => {
    if (!isOpen) return;

    setLoading(true);
    setError(null);

    try {
      const [addonsResponse, categoriesResponse] = await Promise.all([
        productAddonsService.getProductAddons(productId),
        productService.getCategories()
      ]);

      const allProducts: AvailableAddonProduct[] = categoriesResponse.flatMap(category =>
        category.products.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl || '',
          description: product.description || '',
          isAvailable: product.isAvailable,
          categoryId: category.categoryId,
          categoryName: category.categoryName
        }))
      );

      setCurrentAddons(addonsResponse);
      setAvailableProducts(allProducts);

      const newSelectedProductsData = new Map<number, SelectedProductData>();
      addonsResponse.forEach(addon => {
        newSelectedProductsData.set(addon.addonProductId, {
          productId: addon.addonProductId,
          marketingText: addon.marketingText || '',
          isRecommended: addon.isRecommended
        });
      });
      setSelectedProductsData(newSelectedProductsData);

      logger.info('Eklenti verileri yüklendi', {
        productId,
        currentAddons: addonsResponse.length,
        availableProducts: allProducts.length
      });

    } catch (err: any) {
      logger.error('Eklenti verileri yüklenirken hata:', err);
      setError(t('productAddonsModal.errors.loadingData'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
      setSearchQuery('');
      setEditingAddonId(null);
    }
  }, [isOpen, productId]);

  const toggleProductSelection = (productId: number) => {
    const newSelectedProductsData = new Map(selectedProductsData);
    if (newSelectedProductsData.has(productId)) {
      newSelectedProductsData.delete(productId);
    } else {
      newSelectedProductsData.set(productId, {
        productId,
        marketingText: '',
        isRecommended: false
      });
    }
    setSelectedProductsData(newSelectedProductsData);
  };

  const updateSelectedProductData = (productId: number, field: 'marketingText' | 'isRecommended', value: string | boolean) => {
    const newSelectedProductsData = new Map(selectedProductsData);
    const existingData = newSelectedProductsData.get(productId);
    if (existingData) {
      newSelectedProductsData.set(productId, { ...existingData, [field]: value });
      setSelectedProductsData(newSelectedProductsData);
    }
  };

  const handleUpdateAddon = async (addonId: number, updates: Partial<ProductAddon>) => {
    try {
      await productAddonsService.updateProductAddon({ id: addonId, ...updates });
      setCurrentAddons(prev => prev.map(addon => addon.id === addonId ? { ...addon, ...updates } : addon));
    } catch (error: any) {
      logger.error('Eklenti güncellenirken hata:', error);
      setError(t('productAddonsModal.errors.updatingAddon'));
    }
  };

  const handleRemoveAddon = async (addonId: number) => {
    try {
      const addon = currentAddons.find(a => a.id === addonId);
      if (!addon) return;

      await productAddonsService.deleteProductAddon(addonId);
      setCurrentAddons(prev => prev.filter(a => a.id !== addonId));
      const newSelectedProductsData = new Map(selectedProductsData);
      newSelectedProductsData.delete(addon.addonProductId);
      setSelectedProductsData(newSelectedProductsData);
    } catch (error: any) {
      logger.error('Eklenti silinirken hata:', error);
      setError(t('productAddonsModal.errors.deletingAddon'));
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = currentAddons.findIndex(addon => addon.id === active.id);
    const newIndex = currentAddons.findIndex(addon => addon.id === over.id);

    const reorderedAddons = arrayMove(currentAddons, oldIndex, newIndex);
    setCurrentAddons(reorderedAddons);

    try {
      const addonOrders = reorderedAddons.map((addon, index) => ({
        addonId: addon.id,
        newDisplayOrder: index + 1
      }));
      await productAddonsService.reorderProductAddons(productId, addonOrders);
    } catch (error: any) {
      logger.error('Eklenti sıralaması kaydedilirken hata:', error);
      setError(t('productAddonsModal.errors.savingOrder'));
      loadData();
    }
  };

  const handleEditAddon = (addonId: number) => {
    const addon = currentAddons.find(a => a.id === addonId);
    if (addon) {
      setEditingAddonId(addonId);
      setEditingData({ marketingText: addon.marketingText || '', isRecommended: addon.isRecommended });
    }
  };

  const handleSaveEdit = async (addonId: number) => {
    await handleUpdateAddon(addonId, editingData);
    setEditingAddonId(null);
  };

  const handleCancelEdit = () => {
    setEditingAddonId(null);
    setEditingData({ marketingText: '', isRecommended: false });
  };

  const handleEditingDataChange = (field: string, value: any) => {
    setEditingData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const currentAddonProductIds = new Set(currentAddons.map(addon => addon.addonProductId));
      const selectedProductIds = new Set(selectedProductsData.keys());

      const toAdd = Array.from(selectedProductIds).filter(id => !currentAddonProductIds.has(id));
      const toRemove = currentAddons.filter(addon => !selectedProductIds.has(addon.addonProductId));

      for (const addon of toRemove) {
        await productAddonsService.deleteProductAddon(addon.id);
      }

      if (toAdd.length > 0) {
        const addRequests = toAdd.map(productId => {
          const productData = selectedProductsData.get(productId);
          return {
            addonProductId: productId,
            isRecommended: productData?.isRecommended || false,
            marketingText: productData?.marketingText || ''
          };
        });
        await productAddonsService.addMultipleAddons(productId, addRequests);
      }

      for (const addon of currentAddons) {
        const selectedData = selectedProductsData.get(addon.addonProductId);
        if (selectedData && selectedData.productId === addon.addonProductId) {
          if (addon.marketingText !== selectedData.marketingText || addon.isRecommended !== selectedData.isRecommended) {
            await productAddonsService.updateProductAddon({
              id: addon.id,
              marketingText: selectedData.marketingText,
              isRecommended: selectedData.isRecommended
            });
          }
        }
      }

      logger.info('Ürün eklentileri başarıyla kaydedildi', { productId, added: toAdd.length, removed: toRemove.length });
      onSuccess();
      onClose();
    } catch (err: any) {
      logger.error('Eklentiler kaydedilirken hata:', err);
      setError(t('productAddonsModal.errors.savingAddons'));
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = availableProducts.filter(product => {
    if (product.id === productId) return false;
    return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const addonsWithProductDetails = currentAddons.map(addon => {
    const addonProduct = availableProducts.find(p => p.id === addon.addonProductId);
    return { ...addon, addonProduct };
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          <div className="flex h-full sm:min-h-screen items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full h-full sm:h-[90vh] max-w-7xl flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-3xl hidden sm:block"></div>

              <div className="relative bg-white dark:bg-gray-800 sm:rounded-3xl shadow-2xl border-0 sm:border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
                {/* Header */}
                <div className="relative overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600"></div>
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                  </div>

                  <div className="relative px-4 sm:px-8 py-4 sm:py-6">
                    <button
                      onClick={onClose}
                      className={`absolute top-4 sm:top-6 ${isRTL ? 'left-4 sm:left-6' : 'right-4 sm:right-6'} p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110 text-white z-10`}
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", delay: 0.2, duration: 0.6 }}
                        className="relative hidden sm:block"
                      >
                        <div className="absolute inset-0 bg-white/30 blur-xl rounded-2xl"></div>
                        <div className="relative p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg">
                          <Sparkles className="w-8 h-8 text-white" />
                        </div>
                      </motion.div>

                      <div className="flex-1 pt-1 pr-8 sm:pr-0">
                        <motion.h3
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2"
                        >
                          {t('productAddonsModal.title')}
                        </motion.h3>
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                          className="text-white/80 text-xs sm:text-sm leading-relaxed"
                        >
                          <strong>{productName}</strong> {t('productAddonsModal.subtitle')}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content - Responsive Stack */}
                <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

                  {/* Current Addons Panel */}
                  <div className="w-full lg:w-1/2 h-1/2 lg:h-auto border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50/50 dark:bg-gray-900/30">
                    <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 lg:bg-transparent">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                        {t('productAddonsModal.panels.currentAddons.title')}
                        <span className="inline-flex items-center px-2 py-0.5 sm:py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                          {currentAddons.length}
                        </span>
                      </h3>
                      {currentAddons.length > 0 && (
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {t('productAddonsModal.panels.currentAddons.dragInstruction')}
                        </p>
                      )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 sm:p-6">
                      {loading ? (
                        <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary-800 mb-3" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{t('productAddonsModal.loading.addons')}</span>
                        </div>
                      ) : addonsWithProductDetails.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-gray-500 dark:text-gray-400">
                          <div className="relative mb-4">
                            <div className="absolute inset-0 bg-primary-500/10 blur-2xl rounded-full"></div>
                            <Package className="relative w-10 h-10 sm:w-12 sm:h-12 opacity-50" />
                          </div>
                          <p className="text-center font-medium mb-1 text-sm sm:text-base">{t('productAddonsModal.panels.currentAddons.emptyState.title')}</p>
                          <p className="text-xs sm:text-sm text-center px-4">{t('productAddonsModal.panels.currentAddons.emptyState.subtitle')}</p>
                        </div>
                      ) : (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                          <SortableContext items={addonsWithProductDetails.map(addon => addon.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-3">
                              {addonsWithProductDetails.map((addon) => (
                                <SortableAddonItem
                                  key={addon.id}
                                  addon={addon}
                                  onUpdate={handleUpdateAddon}
                                  onRemove={handleRemoveAddon}
                                  isEditing={editingAddonId === addon.id}
                                  onEdit={handleEditAddon}
                                  onSaveEdit={handleSaveEdit}
                                  onCancelEdit={handleCancelEdit}
                                  editingData={editingData}
                                  onEditingDataChange={handleEditingDataChange}
                                />
                              ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                      )}
                    </div>
                  </div>

                  {/* Available Products Panel */}
                  <div className="w-full lg:w-1/2 h-1/2 lg:h-auto flex flex-col">
                    <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                        {t('productAddonsModal.panels.availableProducts.title')}
                      </h3>

                      {/* Search */}
                      <div className="relative">
                        <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${isRTL ? 'right-3 sm:right-4' : 'left-3 sm:left-4'}`} />
                        <input
                          type="text"
                          placeholder={t('productAddonsModal.panels.availableProducts.searchPlaceholder')}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`w-full py-2 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 text-sm ${isRTL ? 'pr-9 sm:pr-11 pl-4' : 'pl-9 sm:pl-11 pr-4'}`}
                        />
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 sm:p-6">
                      {loading ? (
                        <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary-800 mb-3" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{t('productAddonsModal.loading.products')}</span>
                        </div>
                      ) : filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-gray-500 dark:text-gray-400">
                          <div className="relative mb-4">
                            <div className="absolute inset-0 bg-primary-500/10 blur-2xl rounded-full"></div>
                            <Package className="relative w-10 h-10 sm:w-12 sm:h-12 opacity-50" />
                          </div>
                          <p className="text-sm sm:text-base text-center px-4">
                            {searchQuery
                              ? t('productAddonsModal.panels.availableProducts.emptyState.noResults')
                              : t('productAddonsModal.panels.availableProducts.emptyState.noProducts')
                            }
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {filteredProducts.map((product) => {
                            const isSelected = selectedProductsData.has(product.id);
                            const productData = selectedProductsData.get(product.id);
                            const hasValidImage = product.imageUrl && product.imageUrl.trim() !== '';

                            return (
                              <div
                                key={product.id}
                                className={`rounded-xl sm:rounded-2xl transition-all duration-300 ${isSelected
                                  ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
                                  : 'bg-white dark:bg-gray-700 hover:shadow-md border border-gray-200 dark:border-gray-600'
                                  } ${!product.isAvailable ? 'opacity-60' : ''}`}
                              >
                                <div className="p-3 sm:p-4">
                                  <div className="flex items-start gap-3">
                                    {/* Selection Checkbox */}
                                    <div className="pt-1">
                                      <button
                                        onClick={() => toggleProductSelection(product.id)}
                                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isSelected
                                          ? 'text-primary-800 border-primary-800 text-white scale-110'
                                          : 'border-gray-300 dark:border-gray-600 hover:border-primary-800 hover:scale-105'
                                          }`}
                                      >
                                        {isSelected && <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                      </button>
                                    </div>

                                    {/* Product Image */}
                                    <div className="flex-shrink-0 hidden xs:block">
                                      {hasValidImage ? (
                                        <img
                                          src={product.imageUrl}
                                          alt={product.name}
                                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl object-cover bg-gray-200 dark:bg-gray-600 ring-2 ring-gray-200 dark:ring-gray-700"
                                          loading="lazy"
                                        />
                                      ) : (
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700">
                                          <Package className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                                        </div>
                                      )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-gray-900 dark:text-white truncate mb-0.5 sm:mb-1 text-sm sm:text-base">
                                        {product.name}
                                      </h4>
                                      {product.description && (
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-1.5 sm:mb-2">
                                          {product.description}
                                        </p>
                                      )}
                                      <div className="flex items-center justify-between">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs sm:text-sm font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg">
                                          {currency.symbol}
                                          {product.price.toFixed(2)}
                                        </span>
                                        <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 px-2 py-0.5 sm:py-1 bg-gray-100 dark:bg-gray-600 rounded-lg">
                                          {product.categoryName}
                                        </span>
                                      </div>

                                      {!product.isAvailable && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 mt-2">
                                          {t('productAddonsModal.status.outOfStock')}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Additional Fields */}
                                {isSelected && (
                                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-gray-200 dark:border-gray-600">
                                    <div className="pt-3 sm:pt-4 space-y-3">
                                      <div>
                                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                                          {t('productAddonsModal.form.marketingText.label')}
                                        </label>
                                        <textarea
                                          value={productData?.marketingText || ''}
                                          onChange={(e) => updateSelectedProductData(product.id, 'marketingText', e.target.value)}
                                          placeholder={t('productAddonsModal.form.marketingText.placeholder')}
                                          className="w-full px-3 py-2 text-xs sm:text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none transition-all duration-200"
                                          rows={2}
                                        />
                                      </div>

                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={productData?.isRecommended || false}
                                          onChange={(e) => updateSelectedProductData(product.id, 'isRecommended', e.target.checked)}
                                          className="sr-only peer"
                                        />
                                        <div className="w-8 h-4 sm:w-10 sm:h-5 bg-gray-300 dark:bg-gray-600 peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-4 sm:peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 sm:after:h-4 sm:after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-500 peer-checked:to-yellow-600"></div>
                                        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1 font-medium">
                                          <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                          {t('productAddonsModal.form.isRecommended.label')}
                                        </span>
                                      </label>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="mx-4 sm:mx-8 mb-4">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl sm:rounded-2xl flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-red-700 dark:text-red-400">{error}</span>
                    </motion.div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex-shrink-0 px-4 sm:px-8 py-4 sm:py-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
                      <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-medium whitespace-nowrap">
                        {t('productAddonsModal.counters.selectedProducts', { count: selectedProductsData.size })}
                      </span>
                      <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg whitespace-nowrap">
                        {t('productAddonsModal.counters.availableProducts', { count: filteredProducts.length })}
                      </span>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-sm sm:text-base disabled:opacity-50"
                      >
                        {t('productAddonsModal.buttons.cancel')}
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || loading}
                        className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {t('productAddonsModal.loading.saving')}
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            {t('productAddonsModal.buttons.saveAddons')}
                          </>
                        )}
                      </button>
                    </div>
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

export default ProductAddonsModal;