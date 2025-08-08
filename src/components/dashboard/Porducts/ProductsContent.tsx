import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Filter, ArrowUp, List, Grid3X3,Package, Utensils,   Loader2,
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
} from '@dnd-kit/sortable';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { Category, Product } from '../../../types/dashboard';
import { productService } from '../../../services/productService';
import { logger } from '../../../utils/logger';
import CreateCategoryModal from './CreateCategoryModal';
import CreateProductModal from './CreateProductModal';
import { SortableCategory } from './SortableCategory';
import { EditCategoryModal } from './EditCategoryModal';
import { EditProductModal } from './EditProductModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import ProductIngredientSelectionModal from './ProductIngredientSelectionModal';
import ProductIngredientUpdateModal from './ProductIngredientUpdateModal';
import ProductAddonsModal from './ProductAddonsModal';

// Add custom styles for line clamping
const customStyles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = customStyles;
  document.head.appendChild(styleElement);
}


// Main ProductsContent Component
const ProductsContent: React.FC = () => {
  const { isDark } = useTheme();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [isReorderingCategories, setIsReorderingCategories] = useState(false);
  const [isReorderingProducts, setIsReorderingProducts] = useState(false);
  const [reorderingCategoryId, setReorderingCategoryId] = useState<number | null>(null);
  const [isIngredientUpdateModalOpen, setIsIngredientUpdateModalOpen] = useState(false);
  const [selectedProductForIngredientUpdate, setSelectedProductForIngredientUpdate] = useState<{
    productId: number;
    productName: string;
  } | null>(null);

 const [isAddonsModalOpen, setIsAddonsModalOpen] = useState(false);
  const [selectedProductForAddons, setSelectedProductForAddons] = useState<{
    productId: number;
    productName: string;
  } | null>(null);
  const handleOpenAddonsManagement = (productId: number, productName: string) => {
    console.log('🔍 handleOpenAddonsManagement called with:', {
      productId,
      productName,
      productIdType: typeof productId,
      isValidId: productId && productId !== 0 && !isNaN(productId)
    });
    
    if (!productId || productId === 0 || isNaN(productId)) {
      console.error('❌ Invalid productId provided:', productId);
      alert('Geçersiz ürün ID - eklenti yönetimi açılamıyor');
      return;
    }
    
    if (!productName || productName.trim() === '') {
      console.error('❌ Invalid productName provided:', productName);
      alert('Geçersiz ürün adı - eklenti yönetimi açılamıyor');
      return;
    }
    
    console.log('✅ Setting addons state with valid data');
    setSelectedProductForAddons({ 
      productId: productId, 
      productName: productName 
    });
    setIsAddonsModalOpen(true);
  };  
  const [deleteConfig, setDeleteConfig] = useState<{
    type: 'product' | 'category';
    id: number;
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
  } | null>(null);
  const [selectedCategoryForProduct, setSelectedCategoryForProduct] = useState<string>('');
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState<Category | null>(null);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isIngredientSelectionModalOpen, setIsIngredientSelectionModalOpen] = useState(false);
  const [selectedProductForIngredients, setSelectedProductForIngredients] = useState<{
    productId: number;
    productName: string;
  } | null>(null);

  const handleOpenIngredientSelection = (productId: number, productName: string) => {
      setSelectedProductForIngredients({ productId: productId, productName: productName });
      setIsIngredientSelectionModalOpen(true);
    };

  const handleOpenIngredientUpdate = (productId: number, productName: string) => {
  console.log('🔍 handleOpenIngredientUpdate called with:', {
    productId,
    productName,
    productIdType: typeof productId,
    isValidId: productId && productId !== 0 && !isNaN(productId)
  });
  
  // Add validation
  if (!productId || productId === 0 || isNaN(productId)) {
    console.error('❌ Invalid productId provided:', productId);
    alert('Geçersiz ürün ID - malzeme güncelleme açılamıyor');
    return;
  }
  
  if (!productName || productName.trim() === '') {
    console.error('❌ Invalid productName provided:', productName);
    alert('Geçersiz ürün adı - malzeme güncelleme açılamıyor');
    return;
  }
  
  console.log('✅ Setting state with valid data');
  setSelectedProductForIngredientUpdate({ 
    productId: productId, 
    productName: productName 
  });
  setIsIngredientUpdateModalOpen(true);
  
  // Use setTimeout to see the updated state (for debugging)
  setTimeout(() => {
    console.log('🔍 State after update:', selectedProductForIngredientUpdate);
  }, 100);
};
  const loadCategories = async () => {
    try {
      setLoading(true);
      const fetchedCategories = await productService.getCategories();
      setCategories(fetchedCategories);
      
    } catch (error) {
      logger.error('Kategori verileri alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const toggleCategory = (categoryId: number) => {
    setCategories(categories.map(cat =>
      cat.categoryId === categoryId
        ? { ...cat, isExpanded: !cat.isExpanded }
        : cat
    ));
  };

  const handleDeleteProduct = (productId: number) => {
    const product = categories
      .flatMap(cat => cat.products)
      .find(product => product.id === productId);

    if (!product) {
      logger.error('Silinecek ürün bulunamadı:', { productId });
      return;
    }

    setDeleteConfig({
      type: 'product',
      id: productId,
      title: t('Ürünü Sil'),
      message: t(`"${product.name}" adlı ürünü silmek istediğinizden emin misiniz?`),
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          await productService.deleteProduct(productId);
          setCategories(categories.map(cat => ({
            ...cat,
            products: cat.products.filter(product => product.id !== productId)
          })));
          logger.info('Ürün başarıyla silindi', { productId });
        } finally {
          setIsDeleting(false);
        }
      }
    });
    setIsConfirmDeleteModalOpen(true);
  };

  const handleEditProduct = (productId: number) => {
    const productToEdit = categories
      .flatMap(cat => cat.products)
      .find(product => product.id === productId);
    
    if (productToEdit) {
      setSelectedProductForEdit(productToEdit);
      setIsEditProductModalOpen(true);
    } else {
      logger.error('Düzenlenecek ürün bulunamadı:', { productId });
      alert(t('Ürün bulunamadı. Lütfen sayfayı yenileyin ve tekrar deneyin.'));
    }
  };

  console.log("selectedProductForIngredientUpdate.productId",selectedProductForIngredientUpdate?.productId)

  const handleDeleteCategory = (categoryId: number) => {
    const category = categories.find(cat => cat.categoryId === categoryId);
    
    if (!category) {
      alert(t('Kategori bulunamadı.'));
      return;
    }

    setDeleteConfig({
      type: 'category',
      id: categoryId,
      title: t('Kategoriyi Sil'),
      message: category.products.length > 0
        ? t(`"${category.categoryName}" kategorisinde ${category.products.length} ürün bulunuyor. Bu kategoriyi silmek tüm ürünleri de silecektir. Devam etmek istediğinizden emin misiniz?`)
        : t(`"${category.categoryName}" kategorisini silmek istediğinizden emin misiniz?`),
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          await productService.deleteCategory(categoryId);
          setCategories(categories.filter(cat => cat.categoryId !== categoryId));
          logger.info('Kategori başarıyla silindi', { categoryId });
        } finally {
          setIsDeleting(false);
        }
      }
    });
    setIsConfirmDeleteModalOpen(true);
  };

  const handleEditCategory = (categoryId: number) => {
    const categoryToEdit = categories.find(cat => cat.categoryId === categoryId);
    
    if (categoryToEdit) {
      setSelectedCategoryForEdit(categoryToEdit);
      setIsEditCategoryModalOpen(true);
    } else {
      logger.error('Düzenlenecek kategori bulunamadı:', { categoryId });
      alert(t('Kategori bulunamadı. Lütfen sayfayı yenileyin ve tekrar deneyin.'));
    }
  };

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as number;

    if (activeId === overId) return;

    const activeProduct = categories
      .flatMap(cat => cat.products)
      .find(product => product.id === activeId);

    if (activeProduct) {
      const overCategory = categories.find(cat => cat.categoryId === overId);
      const overProduct = categories
        .flatMap(cat => cat.products)
        .find(product => product.id === overId);

      if (overCategory) {
        setCategories(prev => {
          const newCategories = [...prev];
          const sourceCategory = newCategories.find(cat =>
            cat.products.some(product => product.id === activeId)
          );
          if (sourceCategory) {
            sourceCategory.products = sourceCategory.products.filter(
              product => product.id !== activeId
            );
          }

          const targetCategory = newCategories.find(cat => cat.categoryId === overId);
          if (targetCategory) {
            const updatedProduct = { ...activeProduct, categoryId: overId };
            targetCategory.products.push(updatedProduct);
          }

          return newCategories;
        });
      } else if (overProduct && activeProduct.categoryId !== overProduct.categoryId) {
        setCategories(prev => {
          const newCategories = [...prev];
          const sourceCategory = newCategories.find(cat =>
            cat.products.some(product => product.id === activeId)
          );
          if (sourceCategory) {
            sourceCategory.products = sourceCategory.products.filter(
              product => product.id !== activeId
            );
          }

          const targetCategory = newCategories.find(cat => cat.categoryId === overProduct.categoryId);
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeId = active.id as number;
    const overId = over.id as number;

    // Identify what we're dealing with
    const activeCategory = categories.find(cat => cat.categoryId === activeId);
    const overCategory = categories.find(cat => cat.categoryId === overId);
    const activeProduct = categories.flatMap(cat => cat.products).find(product => product.id === activeId);
    const overProduct = categories.flatMap(cat => cat.products).find(product => product.id === overId);

    console.log('🔄 Drag & Drop:', {
      activeType: activeCategory ? 'category' : activeProduct ? 'product' : 'unknown',
      overType: overCategory ? 'category' : overProduct ? 'product' : 'unknown',
      activeItem: activeCategory?.categoryName || activeProduct?.name || 'unknown',
      overItem: overCategory?.categoryName || overProduct?.name || 'unknown'
    });

    // CASE 1: Category to Category - Reorder categories
    if (activeCategory && overCategory) {
      console.log('📂↔️📂 Category Reordering');
      
      const oldIndex = categories.findIndex(cat => cat.categoryId === activeId);
      const newIndex = categories.findIndex(cat => cat.categoryId === overId);
      
      const newCategories = arrayMove(categories, oldIndex, newIndex);
      setCategories(newCategories);
      setIsReorderingCategories(true);

      try {
        const categoryOrders = newCategories.map((category, index) => ({
          categoryId: category.categoryId,
          newDisplayOrder: index + 1
        }));

        await productService.reorderCategories(categoryOrders);
        console.log('✅ Category reordering successful');
        
      } catch (error: any) {
        console.error('❌ Category reordering failed:', error);
        setCategories(categories); // Revert
        alert(t('Kategori sıralaması kaydedilirken bir hata oluştu.'));
      } finally {
        setIsReorderingCategories(false);
      }
      return;
    }

    // CASE 2: Product to Product (Same Category) - Reorder products
    if (activeProduct && overProduct && activeProduct.categoryId === overProduct.categoryId) {
      console.log('📦↔️📦 Product Reordering (Same Category)');
      
      const categoryId = activeProduct.categoryId;
      const categoryIndex = categories.findIndex(cat => cat.categoryId === categoryId);
      const category = categories[categoryIndex];
      
      const oldIndex = category.products.findIndex(product => product.id === activeId);
      const newIndex = category.products.findIndex(product => product.id === overId);

      // Update local state
      const newCategories = [...categories];
      const newProducts = arrayMove(category.products, oldIndex, newIndex);
      newCategories[categoryIndex] = { ...category, products: newProducts };
      
      setCategories(newCategories);
      setIsReorderingProducts(true);
      setReorderingCategoryId(categoryId);

      try {
        const productOrders = newProducts.map((product, index) => ({
          productId: product.id,
          newDisplayOrder: index + 1
        }));

        await productService.reorderProducts(productOrders);
        console.log('✅ Product reordering successful');
        
      } catch (error: any) {
        console.error('❌ Product reordering failed:', error);
        setCategories(categories); // Revert
        alert(t('Ürün sıralaması kaydedilirken bir hata oluştu.'));
      } finally {
        setIsReorderingProducts(false);
        setReorderingCategoryId(null);
      }
      return;
    }

    // CASE 3: Product to Category - Move product to different category
    if (activeProduct && overCategory) {
      console.log('📦➡️📂 Product to Category Move');
      console.log(`Moving "${activeProduct.name}" to "${overCategory.categoryName}"`);
      
      // Skip if same category
      if (activeProduct.categoryId === overCategory.categoryId) {
        console.log('❌ Same category, no action needed');
        return;
      }

      setIsReorderingProducts(true);
      setReorderingCategoryId(overCategory.categoryId);

      try {
        // Update product's category via API
        await productService.updateProduct(activeProduct.id, {
          categoryId: overCategory.categoryId
        });
        
        console.log('✅ Product moved to new category successfully');
        
        // Reload categories to get updated data from server
        await loadCategories();
        
      } catch (error: any) {
        console.error('❌ Product category move failed:', error);
        alert(t('Ürün kategori değişikliği kaydedilirken bir hata oluştu.'));
      } finally {
        setIsReorderingProducts(false);
        setReorderingCategoryId(null);
      }
      return;
    }

    // CASE 4: Product to Product (Different Categories) - Move to different category at specific position
    if (activeProduct && overProduct && activeProduct.categoryId !== overProduct.categoryId) {
      console.log('📦↔️📦 Cross-Category Product Move');
      console.log(`Moving "${activeProduct.name}" to "${overProduct.name}"'s category`);
      
      const targetCategoryId = overProduct.categoryId;
      setIsReorderingProducts(true);
      setReorderingCategoryId(targetCategoryId);

      try {
        // First, move the product to the new category
        await productService.updateProduct(activeProduct.id, {
          categoryId: targetCategoryId
        });
        
        console.log('✅ Product moved to target category');
        
        // Reload categories to get updated data
        const updatedCategories = await productService.getCategories();
        setCategories(updatedCategories);
        
        // Now reorder products in the target category to place it at the correct position
        const targetCategory = updatedCategories.find(cat => cat.categoryId === targetCategoryId);
        if (targetCategory) {
          // Find the moved product in the new category
          const movedProduct = targetCategory.products.find(p => p.id === activeProduct.id);
          const targetProduct = targetCategory.products.find(p => p.id === overProduct.id);
          
          if (movedProduct && targetProduct) {
            // Reorder: move the product to the position of the target product
            const currentIndex = targetCategory.products.findIndex(p => p.id === activeProduct.id);
            const targetIndex = targetCategory.products.findIndex(p => p.id === overProduct.id);
            
            if (currentIndex !== targetIndex) {
              const reorderedProducts = arrayMove(targetCategory.products, currentIndex, targetIndex);
              
              // Update local state with new order
              const finalCategories = [...updatedCategories];
              const catIndex = finalCategories.findIndex(cat => cat.categoryId === targetCategoryId);
              finalCategories[catIndex] = { ...targetCategory, products: reorderedProducts };
              setCategories(finalCategories);
              
              // Save the new order to backend
              const productOrders = reorderedProducts.map((product, index) => ({
                productId: product.id,
                newDisplayOrder: index + 1
              }));
              
              await productService.reorderProducts(productOrders);
              console.log('✅ Products reordered in target category');
            }
          }
        }
        
      } catch (error: any) {
        console.error('❌ Cross-category product move failed:', error);
        // Reload to ensure consistent state
        loadCategories();
        alert(t('Ürün taşıma işlemi kaydedilirken bir hata oluştu.'));
      } finally {
        setIsReorderingProducts(false);
        setReorderingCategoryId(null);
      }
      return;
    }

    // If we get here, it's an unsupported combination
    console.log('❌ Unsupported drag combination:', {
      activeType: activeCategory ? 'category' : activeProduct ? 'product' : 'unknown',
      overType: overCategory ? 'category' : overProduct ? 'product' : 'unknown'
    });
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    products: category.products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(category => category.products.length > 0 || searchQuery === '');

  if (loading) {
    return (
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('Menü öğelerini ara...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                disabled
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCreateCategoryModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/50 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/70 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>{t('İlk Kategori Ekle')}</span>
              </button>
            </div>
          </div>
        </div>

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
            {t('Henüz menü kategoriniz bulunmuyor')}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {t('Restoranınızın menüsünü oluşturmaya başlamak için ilk kategoriyi ekleyin. Örneğin "Ana Yemekler", "İçecekler" veya "Tatlılar" gibi.')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setIsCreateCategoryModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 text-white bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              {t('İlk Kategoriyi Ekle')}
            </button>
            
            <button className="flex items-center gap-2 px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200">
              <Package className="h-5 w-5" />
              {t('Örnek Menü İçe Aktar')}
            </button>
          </div>
        </div>

        <CreateCategoryModal
          isOpen={isCreateCategoryModalOpen}
          onClose={() => setIsCreateCategoryModalOpen(false)}
          onSuccess={loadCategories}
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
         {(isReorderingCategories || isReorderingProducts) && (
        <div className="fixed top-4 right-4 z-50 bg-primary-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">
            {isReorderingCategories 
              ? t('Kategori sıralaması kaydediliyor...') 
              : reorderingCategoryId 
                ? t('Ürün taşınıyor...')
                : t('Ürün sıralaması kaydediliyor...')
            }
          </span>
        </div>
      )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('Menü öğelerini ara...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div className="flex items-center gap-3">
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

              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">{t('Filtrele')}</span>
              </button>

              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                <ArrowUp className="h-4 w-4" />
                <span className="hidden sm:inline">{t('Sırala')}</span>
              </button>

              <button
                onClick={() => setIsCreateCategoryModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/50 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/70 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">{t('Yeni Kategori')}</span>
              </button>

             <button 
              onClick={() => {
                setSelectedCategoryForProduct(''); 
                setIsCreateProductModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>{t('Yeni Ürün')}</span>
            </button>
            </div>
          </div>
        </div>

    <SortableContext items={filteredCategories.map(cat => cat.categoryId)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <SortableCategory
              key={category.categoryId}
              category={category}
              isDark={isDark}
              onToggle={toggleCategory}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
              activeId={activeId}
              onOpenAddonsManagement={handleOpenAddonsManagement}
              allCategories={categories}
              isReorderingProducts={isReorderingProducts && reorderingCategoryId === category.categoryId}
            />
          ))}
        </div>
      </SortableContext>

        <DragOverlay>
          {activeId ? (
            (() => {
              const activeCategory = categories.find(cat => cat.categoryId === activeId);
              const activeProduct = categories
                .flatMap(cat => cat.products)
                .find(product => product.id === activeId);

              if (activeCategory) {
                return (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 rotate-3 scale-105">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{activeCategory.categoryName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activeCategory.description}</p>
                  </div>
                );
              } else if (activeProduct) {
                const hasValidImage = activeProduct.imageUrl && activeProduct.imageUrl !== 'string' && activeProduct.imageUrl.trim() !== '';
                return (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-600 rotate-3 scale-105">
                    <div className="flex items-start gap-3">
                      {hasValidImage ? (
                        <img
                          src={activeProduct.imageUrl}
                          alt={activeProduct.name}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-200 dark:bg-gray-600 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white">{activeProduct.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{activeProduct.description}</p>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{activeProduct.price.toFixed(2)} ₺</span>
                      </div>
                    </div>
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
        onSuccess={loadCategories}
      />
      
      <CreateProductModal
          isOpen={isCreateProductModalOpen}
          onClose={() => {
            setIsCreateProductModalOpen(false);
            setSelectedCategoryForProduct('');
          }}
          onSuccess={loadCategories}
          categories={categories}
          onOpenIngredientSelection={handleOpenIngredientSelection} // Keep original for creation
        />

      {isEditCategoryModalOpen && selectedCategoryForEdit && (
        <EditCategoryModal
          isOpen={isEditCategoryModalOpen}
          onClose={() => {
            setIsEditCategoryModalOpen(false);
            setSelectedCategoryForEdit(null);
          }}
          onSuccess={loadCategories}
          category={selectedCategoryForEdit}
        />
      )}

       {isEditProductModalOpen && selectedProductForEdit && (
        <EditProductModal
          isOpen={isEditProductModalOpen}
          onClose={() => {
            setIsEditProductModalOpen(false);
            setSelectedProductForEdit(null);
          }}
          onSuccess={loadCategories}
          product={selectedProductForEdit}
          categories={categories}
          onOpenIngredientUpdate={handleOpenIngredientUpdate} // New prop name
        />
      )}

     {isIngredientUpdateModalOpen && selectedProductForIngredientUpdate && (
  <>
    {/* Debug logging */}
    {console.log('🔍 Rendering modal with:', {
      modalOpen: isIngredientUpdateModalOpen,
      selectedProduct: selectedProductForIngredientUpdate,
      productId: selectedProductForIngredientUpdate.productId,
      productName: selectedProductForIngredientUpdate.productName,
      productIdType: typeof selectedProductForIngredientUpdate.productId,
      isValidProductId: selectedProductForIngredientUpdate.productId && 
                       selectedProductForIngredientUpdate.productId !== 0 && 
                       !isNaN(selectedProductForIngredientUpdate.productId)
    })}
    
    <ProductIngredientUpdateModal
      isOpen={isIngredientUpdateModalOpen}
      onClose={() => {
        setIsIngredientUpdateModalOpen(false);
        setSelectedProductForIngredientUpdate(null);
      }}
      onSuccess={loadCategories}
      productId={selectedProductForIngredientUpdate.productId}
      productName={selectedProductForIngredientUpdate.productName}
    />
  </>
)}
      {isConfirmDeleteModalOpen && deleteConfig && (
        <ConfirmDeleteModal
          isOpen={isConfirmDeleteModalOpen}
          onClose={() => {
            setIsConfirmDeleteModalOpen(false);
            setDeleteConfig(null);
          }}
          onConfirm={deleteConfig.onConfirm}
          title={deleteConfig.title}
          message={deleteConfig.message}
          isSubmitting={isDeleting}
        />
      )}
      {isAddonsModalOpen && selectedProductForAddons && (
        <ProductAddonsModal
          isOpen={isAddonsModalOpen}
          onClose={() => {
            setIsAddonsModalOpen(false);
            setSelectedProductForAddons(null);
          }}
          onSuccess={loadCategories}
          productId={selectedProductForAddons.productId}
          productName={selectedProductForAddons.productName}
        />
      )}
      {isIngredientSelectionModalOpen && selectedProductForIngredients && (
      <ProductIngredientSelectionModal
        isOpen={isIngredientSelectionModalOpen}
        onClose={() => {
          setIsIngredientSelectionModalOpen(false);
          setSelectedProductForIngredients(null);
        }}
        onSuccess={loadCategories}
        productId={selectedProductForIngredients.productId}
        productName={selectedProductForIngredients.productName}
      />
    )}

    </DndContext>
  );
};

export default ProductsContent;