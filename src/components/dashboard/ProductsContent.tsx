import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Filter, ArrowUp, List, Grid3X3, Edit2, Trash2,
  GripVertical, Eye, EyeOff, Package, Utensils, X, Sparkles
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Category, Product } from '../../types/dashboard';
import { productService } from '../../services/productService';
import { logger } from '../../utils/logger';
import { httpClient } from '../../utils/http';

// CreateCategoryModal Component
interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CreateCategoryFormData {
  categoryName: string;
  status: boolean;
  displayOrder: number;
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreateCategoryFormData>({
    categoryName: '',
    status: true,
    displayOrder: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'Kategori adı gereklidir';
    }
    
    if (formData.displayOrder < 0) {
      newErrors.displayOrder = 'Görüntüleme sırası 0 veya daha büyük olmalıdır';
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
        displayOrder: formData.displayOrder
      };
      
      logger.info('Kategori ekleme isteği gönderiliyor', { payload });
      
      const response = await httpClient.post('/api/Products/categories', payload);
      
      logger.info('Kategori başarıyla eklendi', { data: response.data });
      
      // Success callback'i çağır
      onSuccess();
      
      // Form'u sıfırla
      setFormData({
        categoryName: '',
        status: true,
        displayOrder: 0,
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
        const apiErrors = error.response.data.errors;
        setErrors(apiErrors);
      } else if (error.message) {
        setErrors({
          general: error.message || 'Kategori eklenirken bir hata oluştu. Lütfen tekrar deneyin.'
        });
      } else {
        setErrors({
          general: 'Kategori eklenirken bir hata oluştu. Lütfen tekrar deneyin.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
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
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-3 relative">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Yeni Kategori Ekle</h3>
                    <p className="text-primary-100 text-sm">Menü kategorisi oluşturun</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* General Error */}
                {errors.general && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium">Hata:</p>
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.general}</p>
                  </div>
                )}

                {/* Category Name */}
                <div>
                  <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kategori Adı *
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
                    placeholder="Örn: Ana Yemekler, İçecekler, Tatlılar"
                  />
                  {errors.categoryName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.categoryName}</p>
                  )}
                </div>

                {/* Display Order */}
                <div>
                  <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Görüntüleme Sırası
                  </label>
                  <input
                    type="number"
                    id="displayOrder"
                    value={formData.displayOrder}
                    onChange={(e) => handleChange('displayOrder', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                      errors.displayOrder
                        ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                    placeholder="0"
                    min="0"
                  />
                  {errors.displayOrder && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.displayOrder}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Düşük sayılar önce görüntülenir
                  </p>
                </div>

                {/* Status */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.status}
                      onChange={(e) => handleChange('status', e.target.checked)}
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Kategoriyi aktif et
                    </span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Aktif kategoriler menüde görünür
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed rounded-lg font-medium transition-colors duration-200"
                  >
                    {isSubmitting ? 'Ekleniyor...' : 'Kategori Ekle'}
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

// SortableProduct Component
const SortableProduct: React.FC<{
  product: Product;
  isDark: boolean;
}> = ({ product, isDark }) => {
  const { t } = useLanguage();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const handleEditProduct = (productId: string) => {
    logger.info('Edit product', { productId });
  };

  const handleDeleteProduct = (productId: string) => {
    logger.info('Delete product', { productId });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
        isDragging ? 'shadow-lg ring-2 ring-primary-500' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <button
              {...attributes}
              {...listeners}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900 dark:text-white">{product.name}</h4>
                {!product.isAvailable && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                    <EyeOff className="h-3 w-3 mr-1" />
                    {t('products.status.outOfStock')}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{product.description}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {product.price.toFixed(2)} ₺
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditProduct(product.id)}
                    className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// SortableCategory Component
const SortableCategory: React.FC<{
  category: Category;
  isDark: boolean;
  onToggle: (categoryId: string) => void;
  activeId: string | null;
  allCategories: Category[];
}> = ({ category, isDark, onToggle, activeId, allCategories }) => {
  const { t } = useLanguage();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${
        isDragging ? 'shadow-lg ring-2 ring-primary-500' : ''
      }`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              {...attributes}
              {...listeners}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-5 w-5" />
            </button>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {category.products.length} {t('products.count')}
            </span>
            <button
              onClick={() => onToggle(category.id)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              {category.isExpanded ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {category.isExpanded && (
        <div className="p-4">
          <SortableContext items={category.products.map(p => p.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {category.products.map((product) => (
                <SortableProduct
                  key={product.id}
                  product={product}
                  isDark={isDark}
                />
              ))}

              {category.products.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">{t('products.empty')}</p>
                  <button className="mt-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium">
                    {t('products.actions.addFirst')}
                  </button>
                </div>
              )}
            </div>
          </SortableContext>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
              <Plus className="h-4 w-4" />
              {t('products.actions.addFirst')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main ProductsContent Component
const ProductsContent: React.FC = () => {
  const { isDark } = useTheme();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);

  // İlk yüklemede kategori listesini getir
  useEffect(() => {
    productService
      .getCategories()
      .then(setCategories)
      .catch((err: unknown) => {
        logger.error('Kategori verileri alınamadı:', err);
      });
  }, []);

  const toggleCategory = (categoryId: string) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? { ...cat, isExpanded: !cat.isExpanded }
        : cat
    ));
  };

  const handleDeleteProduct = (productId: string) => {
    setCategories(categories.map(cat => ({
      ...cat,
      products: cat.products.filter(product => product.id !== productId)
    })));
  };

  const handleEditProduct = (productId: string) => {
    logger.info('Edit product', { productId });
  };

  // Sensors for drag and drop
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

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Check if active item is a product
    const activeProduct = categories
      .flatMap(cat => cat.products)
      .find(product => product.id === activeId);

    if (activeProduct) {
      // Find the target category
      const overCategory = categories.find(cat => cat.id === overId);
      const overProduct = categories
        .flatMap(cat => cat.products)
        .find(product => product.id === overId);

      if (overCategory) {
        // Moving product to a different category
        setCategories(prev => {
          const newCategories = [...prev];

          // Remove product from its current category
          const sourceCategory = newCategories.find(cat =>
            cat.products.some(product => product.id === activeId)
          );
          if (sourceCategory) {
            sourceCategory.products = sourceCategory.products.filter(
              product => product.id !== activeId
            );
          }

          // Add product to target category
          const targetCategory = newCategories.find(cat => cat.id === overId);
          if (targetCategory) {
            const updatedProduct = { ...activeProduct, categoryId: overId };
            targetCategory.products.push(updatedProduct);
          }

          return newCategories;
        });
      } else if (overProduct && activeProduct.categoryId !== overProduct.categoryId) {
        // Moving product to a different category by dropping on another product
        setCategories(prev => {
          const newCategories = [...prev];

          // Remove product from its current category
          const sourceCategory = newCategories.find(cat =>
            cat.products.some(product => product.id === activeId)
          );
          if (sourceCategory) {
            sourceCategory.products = sourceCategory.products.filter(
              product => product.id !== activeId
            );
          }

          // Add product to target category
          const targetCategory = newCategories.find(cat => cat.id === overProduct.categoryId);
          if (targetCategory) {
            const updatedProduct = { ...activeProduct, categoryId: overProduct.categoryId };
            const overIndex = targetCategory.products.findIndex(product => product.id === overId);
            targetCategory.products.splice(overIndex, 0, updatedProduct);
          }

          return newCategories;
        });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Check if we're reordering categories
    const activeCategory = categories.find(cat => cat.id === activeId);
    const overCategory = categories.find(cat => cat.id === overId);

    if (activeCategory && overCategory) {
      // Reorder categories
      setCategories(prev => {
        const oldIndex = prev.findIndex(cat => cat.id === activeId);
        const newIndex = prev.findIndex(cat => cat.id === overId);
        return arrayMove(prev, oldIndex, newIndex);
      });
      return;
    }

    // Check if we're reordering products within the same category
    const activeProduct = categories
      .flatMap(cat => cat.products)
      .find(product => product.id === activeId);
    const overProduct = categories
      .flatMap(cat => cat.products)
      .find(product => product.id === overId);

    if (activeProduct && overProduct && activeProduct.categoryId === overProduct.categoryId) {
      // Reorder products within the same category
      setCategories(prev => {
        const newCategories = [...prev];
        const category = newCategories.find(cat => cat.id === activeProduct.categoryId);

        if (category) {
          const oldIndex = category.products.findIndex(product => product.id === activeId);
          const newIndex = category.products.findIndex(product => product.id === overId);
          category.products = arrayMove(category.products, oldIndex, newIndex);
        }

        return newCategories;
      });
    }
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    products: category.products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.products.length > 0 || searchQuery === '');

  // Empty state when no categories exist
  if (categories.length === 0) {
    return (
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header with Search and Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Menü öğelerini ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                disabled
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* New Category Button */}
              <button
                onClick={() => setIsCreateCategoryModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/50 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/70 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>İlk Kategori Ekle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Utensils className="h-12 w-12 text-gray-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <Plus className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Henüz menü kategoriniz bulunmuyor
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Restoranınızın menüsünü oluşturmaya başlamak için ilk kategoriyi ekleyin. 
            Örneğin "Ana Yemekler", "İçecekler" veya "Tatlılar" gibi.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setIsCreateCategoryModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 text-white bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              İlk Kategoriyi Ekle
            </button>
            
            <button className="flex items-center gap-2 px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200">
              <Package className="h-5 w-5" />
              Örnek Menü İçe Aktar
            </button>
          </div>
        </div>

        <CreateCategoryModal
          isOpen={isCreateCategoryModalOpen}
          onClose={() => setIsCreateCategoryModalOpen(false)}
          onSuccess={() => {
            productService.getCategories().then(setCategories);
            setIsCreateCategoryModalOpen(false);
          }}
        />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header with Search and Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Menü öğelerini ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>

              {/* Filter Button */}
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filtrele</span>
              </button>

              {/* Sort Button */}
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                <ArrowUp className="h-4 w-4" />
                <span className="hidden sm:inline">Sırala</span>
              </button>

              {/* New Category Button */}
              <button
                onClick={() => setIsCreateCategoryModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/50 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/70 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Yeni Kategori</span>
              </button>

              {/* New Product Button */}
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200">
                <Plus className="h-4 w-4" />
                <span>Yeni Ürün</span>
              </button>
            </div>
          </div>
        </div>

        {/* Categories and Products */}
        <SortableContext items={filteredCategories.map(cat => cat.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {filteredCategories.map((category) => (
              <SortableCategory
                key={category.id}
                category={category}
                isDark={isDark}
                onToggle={toggleCategory}
                activeId={activeId}
                allCategories={categories}
              />
            ))}

            {filteredCategories.length === 0 && searchQuery && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Arama sonucu bulunamadı
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  "{searchQuery}" araması için ürün bulunamadı. Farklı bir arama terimi deneyin.
                </p>
              </div>
            )}
          </div>
        </SortableContext>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeId ? (
            (() => {
              const activeCategory = categories.find(cat => cat.id === activeId);
              const activeProduct = categories
                .flatMap(cat => cat.products)
                .find(product => product.id === activeId);

              if (activeCategory) {
                return (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 rotate-3 scale-105">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{activeCategory.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activeCategory.description}</p>
                  </div>
                );
              } else if (activeProduct) {
                return (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-600 rotate-3 scale-105">
                    <h4 className="font-medium text-gray-900 dark:text-white">{activeProduct.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activeProduct.description}</p>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{activeProduct.price.toFixed(2)} ₺</span>
                  </div>
                );
              }
              return null;
            })()
          ) : null}
        </DragOverlay>
      </div>

      <CreateCategoryModal
        isOpen={isCreateCategoryModalOpen}
        onClose={() => setIsCreateCategoryModalOpen(false)}
        onSuccess={() => {
          productService.getCategories().then(setCategories);
          setIsCreateCategoryModalOpen(false);
        }}
      />
    </DndContext>
  );
};

export default ProductsContent; 