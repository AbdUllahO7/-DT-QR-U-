// src/components/dashboard/Products/ProductAddonsModal.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Search, Check, Plus, Trash2, Star, StarOff, 
  Loader2, AlertCircle, Package, DollarSign, 
  GripVertical, Edit3, Save, XCircle 
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

interface ProductAddonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productId: number;
  productName: string;
}

// Interface for selected product data
interface SelectedProductData {
  productId: number;
  marketingText: string;
  isRecommended: boolean;
}

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
  addon,  onRemove, isEditing, onEdit, onSaveEdit, 
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const addonProduct = addon.addonProduct;
  const hasValidImage = addonProduct?.imageUrl && addonProduct.imageUrl.trim() !== '';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border ${
        isDragging ? 'border-primary-500 shadow-lg' : 'border-gray-200 dark:border-gray-600'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing mt-2"
          aria-label={t('productAddonsModal.accessibility.dragHandle')}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Product Image */}
        <div className="flex-shrink-0">
          {hasValidImage ? (
            <img
              src={addonProduct.imageUrl}
              alt={addonProduct?.name}
              className="w-16 h-16 rounded-lg object-cover bg-gray-200 dark:bg-gray-600"
              loading="lazy"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
              <Package className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {addonProduct?.name || `Product ID: ${addon.addonProductId}`}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {addonProduct?.price?.toFixed(2) || '0.00'} ₺
                </span>
                {addon.isRecommended && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                    <Star className="h-3 w-3 mr-1" />
                    {t('productAddonsModal.form.isRecommended.badge')}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              {isEditing ? (
                <>
                  <button
                    onClick={() => onSaveEdit(addon.id)}
                    className="p-1.5 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                    title={t('productAddonsModal.actions.save')}
                    aria-label={t('productAddonsModal.actions.save')}
                  >
                    <Save className="h-4 w-4" />
                  </button>
                  <button
                    onClick={onCancelEdit}
                    className="p-1.5 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    title={t('productAddonsModal.actions.cancel')}
                    aria-label={t('productAddonsModal.actions.cancel')}
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onEdit(addon.id)}
                    className="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    title={t('productAddonsModal.actions.edit')}
                    aria-label={t('productAddonsModal.accessibility.editAddon')}
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onRemove(addon.id)}
                    className="p-1.5 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    title={t('productAddonsModal.actions.remove')}
                    aria-label={t('productAddonsModal.accessibility.removeAddon')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Marketing Text */}
          <div className="mb-2">
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editingData.marketingText}
                  onChange={(e) => onEditingDataChange('marketingText', e.target.value)}
                  placeholder={t('productAddonsModal.form.marketingText.placeholder')}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  rows={2}
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingData.isRecommended}
                    onChange={(e) => onEditingDataChange('isRecommended', e.target.checked)}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    aria-label={t('productAddonsModal.accessibility.toggleRecommended')}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t('productAddonsModal.form.isRecommended.label')}
                  </span>
                </label>
              </div>
            ) : (
              addon.marketingText && (
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  "{addon.marketingText}"
                </p>
              )
            )}
          </div>

          {/* Product Description */}
          {addonProduct?.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {addonProduct.description}
            </p>
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

  // State
  const [currentAddons, setCurrentAddons] = useState<ProductAddon[]>([]);
  const [availableProducts, setAvailableProducts] = useState<AvailableAddonProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductsData, setSelectedProductsData] = useState<Map<number, SelectedProductData>>(new Map());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingAddonId, setEditingAddonId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({ marketingText: '', isRecommended: false });

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load data when modal opens
  const loadData = async () => {
    if (!isOpen) return;

    setLoading(true);
    setError(null);

    try {
      // Load current addons and all available products in parallel
      const [addonsResponse, categoriesResponse] = await Promise.all([
        productAddonsService.getProductAddons(productId),
        productService.getCategories() // Use the same method as ProductsContent
      ]);

      // Extract all products from categories and transform to AvailableAddonProduct format
      const allProducts: AvailableAddonProduct[] = categoriesResponse.flatMap(category => 
        category.products.map(product => ({
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
      
      // Pre-populate selected products data with current addons
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
        availableProducts: allProducts.length,
        categoriesCount: categoriesResponse.length
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

  // Handle product selection
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

  // Handle updating selected product data
  const updateSelectedProductData = (productId: number, field: 'marketingText' | 'isRecommended', value: string | boolean) => {
    const newSelectedProductsData = new Map(selectedProductsData);
    const existingData = newSelectedProductsData.get(productId);
    if (existingData) {
      newSelectedProductsData.set(productId, {
        ...existingData,
        [field]: value
      });
      setSelectedProductsData(newSelectedProductsData);
    }
  };

  // Handle addon updates
  const handleUpdateAddon = async (addonId: number, updates: Partial<ProductAddon>) => {
    try {
      await productAddonsService.updateProductAddon({
        id: addonId,
        ...updates
      });
      
      // Update local state
      setCurrentAddons(prev => 
        prev.map(addon => 
          addon.id === addonId ? { ...addon, ...updates } : addon
        )
      );
    } catch (error: any) {
      logger.error('Eklenti güncellenirken hata:', error);
      setError(t('productAddonsModal.errors.updatingAddon'));
    }
  };

  // Handle addon removal
  const handleRemoveAddon = async (addonId: number) => {
    try {
      const addon = currentAddons.find(a => a.id === addonId);
      if (!addon) return;

      await productAddonsService.deleteProductAddon(addonId);
      
      // Update local state
      setCurrentAddons(prev => prev.filter(a => a.id !== addonId));
      const newSelectedProductsData = new Map(selectedProductsData);
      newSelectedProductsData.delete(addon.addonProductId);
      setSelectedProductsData(newSelectedProductsData);
    } catch (error: any) {
      logger.error('Eklenti silinirken hata:', error);
      setError(t('productAddonsModal.errors.deletingAddon'));
    }
  };

  // Handle drag and drop reordering
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = currentAddons.findIndex(addon => addon.id === active.id);
    const newIndex = currentAddons.findIndex(addon => addon.id === over.id);

    const reorderedAddons = arrayMove(currentAddons, oldIndex, newIndex);
    setCurrentAddons(reorderedAddons);

    // Save new order
    try {
      const addonOrders = reorderedAddons.map((addon, index) => ({
        addonId: addon.id,
        newDisplayOrder: index + 1
      }));

      await productAddonsService.reorderProductAddons(productId, addonOrders);
    } catch (error: any) {
      logger.error('Eklenti sıralaması kaydedilirken hata:', error);
      setError(t('productAddonsModal.errors.savingOrder'));
      // Revert the reorder
      loadData();
    }
  };

  // Handle editing
  const handleEditAddon = (addonId: number) => {
    const addon = currentAddons.find(a => a.id === addonId);
    if (addon) {
      setEditingAddonId(addonId);
      setEditingData({
        marketingText: addon.marketingText || '',
        isRecommended: addon.isRecommended
      });
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

  // Save changes
  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      // Get current addon product IDs
      const currentAddonProductIds = new Set(currentAddons.map(addon => addon.addonProductId));
      
      // Get selected product IDs
      const selectedProductIds = new Set(selectedProductsData.keys());
      
      // Find products to add and remove
      const toAdd = Array.from(selectedProductIds).filter(id => !currentAddonProductIds.has(id));
      const toRemove = currentAddons.filter(addon => !selectedProductIds.has(addon.addonProductId));

      // Remove unselected addons
      for (const addon of toRemove) {
        await productAddonsService.deleteProductAddon(addon.id);
      }

      // Add new addons with their respective data
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

      // Update existing addons that have changed
      for (const addon of currentAddons) {
        const selectedData = selectedProductsData.get(addon.addonProductId);
        if (selectedData && selectedData.productId === addon.addonProductId) {
          // Check if anything changed
          if (addon.marketingText !== selectedData.marketingText || 
              addon.isRecommended !== selectedData.isRecommended) {
            await productAddonsService.updateProductAddon({
              id: addon.id,
              marketingText: selectedData.marketingText,
              isRecommended: selectedData.isRecommended
            });
          }
        }
      }

      logger.info('Ürün eklentileri başarıyla kaydedildi', { 
        productId, 
        added: toAdd.length,
        removed: toRemove.length 
      });
      
      onSuccess();
      onClose();
    } catch (err: any) {
      logger.error('Eklentiler kaydedilirken hata:', err);
      setError(t('productAddonsModal.errors.savingAddons'));
    } finally {
      setSaving(false);
    }
  };

  // Filter available products
  const filteredProducts = availableProducts.filter(product => {
    // Don't show the current product as an addon option
    if (product.id === productId) return false;
    
    return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Combine current addons with product details
  const addonsWithProductDetails = currentAddons.map(addon => {
    const addonProduct = availableProducts.find(p => p.id === addon.addonProductId);
    return { ...addon, addonProduct };
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {t('productAddonsModal.title')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <strong>{productName}</strong> {t('productAddonsModal.subtitle')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label={t('productAddonsModal.accessibility.closeModal')}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex">
            {/* Current Addons Panel */}
            <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {t('productAddonsModal.panels.currentAddons.title')} ({currentAddons.length})
                </h3>
                {currentAddons.length > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('productAddonsModal.panels.currentAddons.dragInstruction')}
                  </p>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {t('productAddonsModal.loading.addons')}
                    </span>
                  </div>
                ) : addonsWithProductDetails.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                    <Package className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-center">{t('productAddonsModal.panels.currentAddons.emptyState.title')}</p>
                    <p className="text-sm text-center mt-1">{t('productAddonsModal.panels.currentAddons.emptyState.subtitle')}</p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext 
                      items={addonsWithProductDetails.map(addon => addon.id)} 
                      strategy={verticalListSortingStrategy}
                    >
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
            <div className="w-1/2 flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  {t('productAddonsModal.panels.availableProducts.title')}
                </h3>
                
                {/* Search */}
                <div className="relative">
                  <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    type="text"
                    placeholder={t('productAddonsModal.panels.availableProducts.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {t('productAddonsModal.loading.products')}
                    </span>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                    <Package className="w-8 h-8 mb-2 opacity-50" />
                    <p>
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
                          className={`rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-sm'
                              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary-300 hover:shadow-sm'
                          } ${!product.isAvailable ? 'opacity-60' : ''}`}
                        >
                          <div className="p-4">
                            <div className="flex items-start gap-3">
                              {/* Selection Checkbox */}
                              <div className="pt-1">
                                <button
                                  onClick={() => toggleProductSelection(product.id)}
                                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                    isSelected
                                      ? 'bg-primary-600 border-primary-600 text-white'
                                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                                  }`}
                                  aria-label={isSelected ? 'Deselect product' : 'Select product'}
                                >
                                  {isSelected && <Check className="w-3 h-3" />}
                                </button>
                              </div>

                              {/* Product Image */}
                              <div className="flex-shrink-0">
                                {hasValidImage ? (
                                  <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-12 h-12 rounded-lg object-cover bg-gray-200 dark:bg-gray-600"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                    <Package className="h-5 w-5 text-gray-400" />
                                  </div>
                                )}
                              </div>

                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                  {product.name}
                                </h4>
                                {product.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                                    {product.description}
                                  </p>
                                )}
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />
                                    {product.price.toFixed(2)} ₺
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {product.categoryName}
                                  </span>
                                </div>
                                
                                {!product.isAvailable && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 mt-2">
                                    {t('productAddonsModal.status.outOfStock')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Additional Fields for Selected Products */}
                          {isSelected && (
                            <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
                              <div className="pt-3 space-y-3">
                                {/* Marketing Text */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('productAddonsModal.form.marketingText.label')}
                                  </label>
                                  <textarea
                                    value={productData?.marketingText || ''}
                                    onChange={(e) => updateSelectedProductData(product.id, 'marketingText', e.target.value)}
                                    placeholder={t('productAddonsModal.form.marketingText.placeholder')}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                                    rows={2}
                                  />
                                </div>

                                {/* Is Recommended */}
                                <div>
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={productData?.isRecommended || false}
                                      onChange={(e) => updateSelectedProductData(product.id, 'isRecommended', e.target.checked)}
                                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                      aria-label={t('productAddonsModal.accessibility.toggleRecommended')}
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                      <Star className="h-3 w-3" />
                                      {t('productAddonsModal.form.isRecommended.label')}
                                    </span>
                                  </label>
                                </div>
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

          {/* Error Display */}
          {error && (
            <div className="mx-6 mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <span className="text-red-700 dark:text-red-400">{error}</span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('productAddonsModal.counters.selectedProducts', { count: selectedProductsData.size })} • {t('productAddonsModal.counters.availableProducts', { count: filteredProducts.length })}
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {t('productAddonsModal.buttons.cancel')}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('productAddonsModal.loading.saving')}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 w-4" />
                    {t('productAddonsModal.buttons.saveAddons')}
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductAddonsModal;