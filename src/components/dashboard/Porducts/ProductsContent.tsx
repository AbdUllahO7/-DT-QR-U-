import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Plus, Filter, ArrowUp,  Package, Utensils, Loader2,
  ChevronDown, Check, X, SortAsc, SortDesc, Eye, EyeOff, DollarSign, Hash, Users,
  Trash2
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
import { useLanguage } from '../../../contexts/LanguageContext';
import { useClickOutside } from '../../../hooks';
import { productService } from '../../../services/productService';
import { branchService } from '../../../services/branchService';
import { logger } from '../../../utils/logger';
import CreateCategoryModal from './CreateCategoryModal';
import CreateProductModal from './CreateProductModal';
import { SortableCategory } from './SortableCategory';
import { EditCategoryModal } from './EditCategoryModal';
import { EditProductModal } from './EditProductModal';
import ProductIngredientSelectionModal from './ProductIngredientSelectionModal';
import ProductIngredientUpdateModal from './ProductIngredientUpdateModal';
import ProductAddonsModal from './ProductAddonsModal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { useTheme } from '../../../contexts/ThemeContext';
import { Category, Product } from '../../../types/BranchManagement/type';
import { useNavigate } from 'react-router-dom';
import ProductExtrasModal from './ProductExtrasModal';

// Branch dropdown item interface
interface BranchDropdownItem {
  branchId: number;
  branchName: string;
}

// Special constant for "Select All" option
const SELECT_ALL_BRANCH_ID = -1;

// Filter and Sort Types
type SortOption = 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'created_asc' | 'created_desc' | 'order_asc' | 'order_desc';
type FilterStatus = 'all' | 'active' | 'inactive';

interface FilterOptions {
  status: FilterStatus;
  categories: number[];
  priceRange: {
    min: number;
    max: number;
  };
}

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
  const { t, isRTL } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState<number | null>(null);
  const navigate = useNavigate()
  // Branch Management States
  const [branches, setBranches] = useState<BranchDropdownItem[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<BranchDropdownItem | null>(null);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  
  // Filter and Sort States
  const [sortBy, setSortBy] = useState<SortOption>('order_asc');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    categories: [],
    priceRange: { min: 0, max: 1000 }
  });
  
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const branchDropdownRef = useRef<HTMLDivElement>(null);

  // Modal States
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
  const [isProductExtrasModalOpen, setIsProductExtrasModalOpen] = useState(false);
const [selectedProductForExtras, setSelectedProductForExtras] = useState<{
  productId: number;
  productName: string;
} | null>(null);

const handleOpenProductExtras = (productId: number, productName: string) => {


  if (!productId || productId === 0 || isNaN(productId)) {
    console.error('❌ Invalid productId provided:', productId);
    alert(t('productsContent.error.invalidData'));
    return;
  }
  
  if (!productName || productName.trim() === '') {
    console.error('❌ Invalid productName provided:', productName);
    alert(t('productsContent.error.invalidData'));
    return;
  }
  
  setSelectedProductForExtras({ 
    productId: productId, 
    productName: productName 
  });
  setIsProductExtrasModalOpen(true);
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

  // Close dropdowns when clicking outside
  useClickOutside(filterRef, () => setShowFilterDropdown(false));
  useClickOutside(sortRef, () => setShowSortDropdown(false));
  useClickOutside(branchDropdownRef, () => setIsBranchDropdownOpen(false));

  // Load branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      setIsLoadingBranches(true);
      try {
        const branchList = await branchService.getBranchesDropdown();
        
        // Add "Select All" option at the beginning
        const selectAllOption: BranchDropdownItem = {
          branchId: SELECT_ALL_BRANCH_ID,
          branchName: t('productsContent.branch.selectAll') || 'All Branches'
        };
        
        const branchesWithSelectAll = [selectAllOption, ...branchList];
        setBranches(branchesWithSelectAll);
        
        // Auto-select "Select All" option if no branch is selected
        if (!selectedBranch) {
          setSelectedBranch(selectAllOption);
        }
        
        logger.info('Şube listesi başarıyla yüklendi', { branchCount: branchList.length });
      } catch (error) {
        logger.error('Şube listesi yüklenirken hata:', error);
        // Handle error - you might want to show a toast or error message
      } finally {
        setIsLoadingBranches(false);
      }
    };

    fetchBranches();
  }, []);

  // Load categories when branch changes
  useEffect(() => {
    if (selectedBranch) {
      loadCategories();
    }
  }, [selectedBranch]);

  const handleBranchSelect = (branch: BranchDropdownItem) => {
    setSelectedBranch(branch);
    setIsBranchDropdownOpen(false);
  };

  const handleOpenAddonsManagement = (productId: number, productName: string) => {
    if (!productId || productId === 0 || isNaN(productId)) {
      console.error('❌ Invalid productId provided:', productId);
      alert(t('productsContent.error.invalidData'));
      return;
    }
    
    if (!productName || productName.trim() === '') {
      console.error('❌ Invalid productName provided:', productName);
      alert(t('productsContent.error.invalidData'));
      return;
    }
    
    setSelectedProductForAddons({ 
      productId: productId, 
      productName: productName 
    });
    setIsAddonsModalOpen(true);
  };

  const handleOpenIngredientSelection = (productId: number, productName: string) => {
    setSelectedProductForIngredients({ productId: productId, productName: productName });
    setIsIngredientSelectionModalOpen(true);
  };

  const handleOpenIngredientUpdate = (productId: number, productName: string) => {
    if (!productId || productId === 0 || isNaN(productId)) {
      console.error('❌ Invalid productId provided:', productId);
      alert(t('productsContent.error.invalidData'));
      return;
    }
    
    if (!productName || productName.trim() === '') {
      console.error('❌ Invalid productName provided:', productName);
      alert(t('productsContent.error.invalidData'));
      return;
    }
    
    setSelectedProductForIngredientUpdate({ 
      productId: productId, 
      productName: productName 
    });
    setIsIngredientUpdateModalOpen(true);
  };
  
  const loadCategories = async () => {
    if (!selectedBranch) return;
    
    try {
      setLoading(true);
      
      let fetchedCategories: Category[];
      // Check if "Select All" is selected
      if (selectedBranch.branchId === SELECT_ALL_BRANCH_ID) {
        // Use getCategories for all branches
        fetchedCategories = await productService.getCategories();
        logger.info('Tüm kategori verileri başarıyla yüklendi', { 
          categoryCount: fetchedCategories.length 
        });
      } else {
        // Use getBranchCategories for specific branch
        fetchedCategories = await productService.getBranchCategories(selectedBranch.branchId);
        logger.info('Şube kategori verileri başarıyla yüklendi', { 
          branchId: selectedBranch.branchId,
          categoryCount: fetchedCategories.length 
        });
      }
      
      setCategories(fetchedCategories);
      
    } catch (error) {
      logger.error('Kategori verileri alınamadı:', error);
      // Handle error - you might want to show a toast or error message
    } finally {
      setLoading(false);
    }
  };

  // Sort categories and products
  const applySorting = (categoriesToSort: Category[]): Category[] => {
    const sortedCategories = [...categoriesToSort];

    // Sort categories
    sortedCategories.sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':
          return a.categoryName.localeCompare(b.categoryName);
        case 'name_desc':
          return b.categoryName.localeCompare(a.categoryName);
        case 'order_asc':
          return a.displayOrder - b.displayOrder;
        case 'order_desc':
          return b.displayOrder - a.displayOrder;
        default:
          return a.displayOrder - b.displayOrder;
      }
    });

    // Sort products within each category
    return sortedCategories.map(category => ({
      ...category,
      products: [...category.products].sort((a, b) => {
        switch (sortBy) {
          case 'name_asc':
            return a.name.localeCompare(b.name);
          case 'name_desc':
            return b.name.localeCompare(a.name);
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'order_asc':
            return a.displayOrder - b.displayOrder;
          case 'order_desc':
            return b.displayOrder - a.displayOrder;
          default:
            return a.displayOrder - b.displayOrder;
        }
      })
    }));
  };

  // Apply filters
  const applyFilters = (categoriesToFilter: Category[]): Category[] => {
    return categoriesToFilter.map(category => {
      // Filter products within category
      let filteredProducts = category?.products?.filter(product => {
        // Status filter
        if (filters.status === 'active' && !product.isAvailable) return false;
        if (filters.status === 'inactive' && product.isAvailable) return false;
        
        // Price range filter
        if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) return false;
        
        // Category filter (if specific categories are selected)
        if (filters.categories.length > 0 && !filters.categories.includes(category.categoryId)) return false;
        
        return true;
      });

      return {
        ...category,
        products: filteredProducts
      };
    }).filter(category => 
      // Show category if it has products or if no search/filter is applied
      category?.products?.length > 0 || (searchQuery === '' && filters.status === 'all' && filters.categories.length === 0)
    );
  };

  // Apply search
  const applySearch = (categoriesToSearch: Category[]): Category[] => {
    if (!searchQuery.trim()) return categoriesToSearch;

    return categoriesToSearch.map(category => ({
      ...category,
      products: category?.products?.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    })).filter(category => 
      category?.products?.length > 0 || 
      category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Get filtered and sorted categories
  const processedCategories = applySorting(applyFilters(applySearch(categories)));

  // Filter options
  const sortOptions = [
    { value: 'order_asc', label: t('sort.order.asc') || 'Order (A-Z)', icon: Hash },
    { value: 'order_desc', label: t('sort.order.desc') || 'Order (Z-A)', icon: Hash },
    { value: 'name_asc', label: t('sort.name.asc') || 'Name (A-Z)', icon: SortAsc },
    { value: 'name_desc', label: t('sort.name.desc') || 'Name (Z-A)', icon: SortDesc },
    { value: 'price_asc', label: t('sort.price.asc') || 'Price (Low-High)', icon: DollarSign },
    { value: 'price_desc', label: t('sort.price.desc') || 'Price (High-Low)', icon: DollarSign },
  ];

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
      title: t('productsContent.delete.product.title'),
      message: t('productsContent.delete.product.message', { productName: product.name }),
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          await productService.deleteProduct(productId);
          setCategories(categories.map(cat => ({
            ...cat,
            products: cat.products?.filter(product => product.id !== productId)
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
      alert(t('productsContent.error.productNotFound') + ' ' + t('productsContent.error.refreshPage'));
    }
  };

  const handleDeleteCategory = (categoryId: number) => {
    const category = categories.find(cat => cat.categoryId === categoryId);
    
    if (!category) {
      alert(t('productsContent.error.categoryNotFound'));
      return;
    }

    setDeleteConfig({
      type: 'category',
      id: categoryId,
      title: t('productsContent.delete.category.title'),
      message: category?.products?.length > 0
        ? t('products.delete.category.messageWithProducts', { 
            categoryName: category.categoryName, 
            productCount: category?.products?.length 
          })
        : t('productsContent.delete.category.messageEmpty', { categoryName: category.categoryName }),
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
      alert(t('productsContent.error.categoryNotFound') + ' ' + t('productsContent.error.refreshPage'));
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: 'all',
      categories: [],
      priceRange: { min: 0, max: 1000 }
    });
    setSearchQuery('');
    setSortBy('order_asc');
  };

  // Check if filters are active
  const hasActiveFilters = filters.status !== 'all' || filters.categories.length > 0 || 
    filters.priceRange.min > 0 || filters.priceRange.max < 1000 || searchQuery !== '';

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
            cat.products?.some(product => product.id === activeId)
          );
          if (sourceCategory) {
            sourceCategory.products = sourceCategory.products?.filter(
              product => product.id !== activeId
            );
          }

          const targetCategory = newCategories.find(cat => cat.categoryId === overId);
          if (targetCategory) {
            const updatedProduct = { ...activeProduct, categoryId: overId };
            targetCategory.products?.push(updatedProduct);
          }

          return newCategories;
        });
      } else if (overProduct && activeProduct.categoryId !== overProduct.categoryId) {
        setCategories(prev => {
          const newCategories = [...prev];
          const sourceCategory = newCategories.find(cat =>
            cat.products?.some(product => product.id === activeId)
          );
          if (sourceCategory) {
            sourceCategory.products = sourceCategory.products?.filter(
              product => product.id !== activeId
            );
          }

          const targetCategory = newCategories.find(cat => cat.categoryId === overProduct.categoryId);
          if (targetCategory) {
            const updatedProduct = { ...activeProduct, categoryId: overProduct.categoryId };
            const overIndex = targetCategory.products?.findIndex(product => product.id === overId);
            targetCategory.products?.splice(overIndex, 0, updatedProduct);
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

    // CASE 1: Category to Category - Reorder categories
    if (activeCategory && overCategory) {
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
      } catch (error: any) {
        console.error('❌ Category reordering failed:', error);
        setCategories(categories); // Revert
        alert(t('productsContent.dragDrop.categoryOrderSaveError'));
      } finally {
        setIsReorderingCategories(false);
      }
      return;
    }

    // CASE 2: Product to Product (Same Category) - Reorder products
    if (activeProduct && overProduct && activeProduct.categoryId === overProduct.categoryId) {
      const categoryId = activeProduct.categoryId;
      const categoryIndex = categories.findIndex(cat => cat.categoryId === categoryId);
      const category = categories[categoryIndex];
      
      const oldIndex = category?.products?.findIndex(product => product.id === activeId);
      const newIndex = category?.products?.findIndex(product => product.id === overId);

      // Update local state
      const newCategories = [...categories];
      const newProducts = arrayMove(category?.products, oldIndex, newIndex);
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
      } catch (error: any) {
        console.error('❌ Product reordering failed:', error);
        setCategories(categories); // Revert
        alert(t('productsContent.dragDrop.productOrderSaveError'));
      } finally {
        setIsReorderingProducts(false);
        setReorderingCategoryId(null);
      }
      return;
    }

    // CASE 3: Product to Category - Move product to different category
    if (activeProduct && overCategory) {
      if (activeProduct.categoryId === overCategory.categoryId) {
        return;
      }

      setIsReorderingProducts(true);
      setReorderingCategoryId(overCategory.categoryId);

      try {
        await productService.updateProduct(activeProduct.id, {
          categoryId: overCategory.categoryId
        });
        
        await loadCategories();
      } catch (error: any) {
        console.error('❌ Product category move failed:', error);
        alert(t('productsContent.dragDrop.productMoveError'));
      } finally {
        setIsReorderingProducts(false);
        setReorderingCategoryId(null);
      }
      return;
    }

    // CASE 4: Product to Product (Different Categories) - Move to different category at specific position
    if (activeProduct && overProduct && activeProduct.categoryId !== overProduct.categoryId) {
      const targetCategoryId = overProduct.categoryId;
      setIsReorderingProducts(true);
      setReorderingCategoryId(targetCategoryId);

      try {
        await productService.updateProduct(activeProduct.id, {
          categoryId: targetCategoryId
        });

        const updatedCategories = await productService.getBranchCategories(selectedBranch!.branchId);
        setCategories(updatedCategories);
        
        const targetCategory = updatedCategories.find(cat => cat.categoryId === targetCategoryId);
        if (targetCategory) {
          const movedProduct = targetCategory.products?.find((p: { id: number; }) => p.id === activeProduct.id);
          const targetProduct = targetCategory.products?.find((p: { id: number; }) => p.id === overProduct.id);
          
          if (movedProduct && targetProduct) {
            const currentIndex = targetCategory.products?.findIndex((p: { id: number; }) => p.id === activeProduct.id);
            const targetIndex = targetCategory.products?.findIndex((p: { id: number; }) => p.id === overProduct.id);
            
            if (currentIndex !== targetIndex) {
              const reorderedProducts = arrayMove(targetCategory.products, currentIndex, targetIndex);
              
              const finalCategories = [...updatedCategories];
              const catIndex = finalCategories.findIndex(cat => cat.categoryId === targetCategoryId);
              finalCategories[catIndex] = { ...targetCategory, products: reorderedProducts };
              setCategories(finalCategories);
              
              const productOrders = reorderedProducts.map((product, index) => ({
                productId: product.id,
                newDisplayOrder: index + 1
              }));
              
              await productService.reorderProducts(productOrders);
            }
          }
        }
      } catch (error: any) {
        console.error('❌ Cross-category product move failed:', error);
        loadCategories();
        alert(t('productsContent.dragDrop.productMoveError'));
      } finally {
        setIsReorderingProducts(false);
        setReorderingCategoryId(null);
      }
      return;
    }
  };

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

  // No branch selected state (this shouldn't happen now since we auto-select "Select All")
  if (!selectedBranch) {
    return (
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`} />
              <input
                type="text"
                placeholder={t('productsContent.search.placeholder')}
                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                disabled
              />
            </div>

            {/* Branch Selector */}
            <div className="relative" ref={branchDropdownRef}>
              <button
                onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                className={`flex items-center justify-between min-w-[200px] px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isRTL ? 'flex-row-reverse' : ''}`}
                disabled={isLoadingBranches}
              >
                <span className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Users className={`h-4 w-4 text-gray-500 dark:text-gray-400 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isLoadingBranches ? t('productsContent.branch.loading') : t('productsContent.branch.selectBranch')}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isBranchDropdownOpen ? 'transform rotate-180' : ''} ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </button>

              {isBranchDropdownOpen && (
                <div className={`absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 max-h-60 overflow-auto ${isRTL ? 'right-0' : 'left-0'}`}>
                  {branches.length === 0 ? (
                    <div className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                      {t('productsContent.branch.noBranches')}
                    </div>
                  ) : (
                    branches.map(branch => (
                      <button
                        key={branch.branchId}
                        onClick={() => handleBranchSelect(branch)}
                        className={`w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 ${isRTL ? 'text-right' : 'text-left'}`}
                      >
                        {branch.branchName}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {t('productsContent.branch.selectBranchMessage')}
            </p>
          </div>
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
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`} />
              <input
                type="text"
                placeholder={t('productsContent.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                disabled
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Branch Selector */}
              <div className="relative" ref={branchDropdownRef}>
                <button
                  onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                  className={`flex items-center justify-between min-w-[200px] px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <span className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Users className={`h-4 w-4 text-gray-500 dark:text-gray-400 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {selectedBranch ? selectedBranch.branchName : t('productsContent.branch.selectBranch')}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isBranchDropdownOpen ? 'transform rotate-180' : ''} ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </button>

                {isBranchDropdownOpen && (
                  <div className={`absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 max-h-60 overflow-auto ${isRTL ? 'right-0' : 'left-0'}`}>
                    {branches.map(branch => (
                      <button
                        key={branch.branchId}
                        onClick={() => handleBranchSelect(branch)}
                        className={`w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          selectedBranch?.branchId === branch.branchId
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-200'
                        } ${isRTL ? 'text-right' : 'text-left'}`}
                      >
                        {branch.branchName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsCreateCategoryModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/50 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/70 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>{t('productsContent.actions.addFirstCategory')}</span>
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
            {t('productsContent.emptyState.noCategories.title')}
          </h3>
          
       
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setIsCreateCategoryModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 text-white bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              {t('productsContent.emptyState.noCategories.addFirstCategory')}
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
          <div className={`fixed top-4 ${isRTL ? 'left-4' : 'right-4'} z-50 bg-primary-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2`}>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">
              {isReorderingCategories 
                ? t('productsContent.dragDrop.categoryReordering') 
                : reorderingCategoryId 
                  ? t('productsContent.dragDrop.productMoving')
                  : t('productsContent.dragDrop.productReordering')
              }
            </span>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`} />
              <input
                type="text"
                placeholder={t('productsContent.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
              />
            </div>

            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* Branch Selector */}
              <div className="relative" ref={branchDropdownRef}>
                <button
                  onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                  className={`flex items-center justify-between min-w-[200px] px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <span className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Users className={`h-4 w-4 text-gray-500 dark:text-gray-400 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {selectedBranch ? selectedBranch.branchName : t('productsContent.branch.selectBranch')}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isBranchDropdownOpen ? 'transform rotate-180' : ''} ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </button>

                {isBranchDropdownOpen && (
                  <div className={`absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 max-h-60 overflow-auto ${isRTL ? 'right-0' : 'left-0'}`}>
                    {branches.map(branch => (
                      <button
                        key={branch.branchId}
                        onClick={() => handleBranchSelect(branch)}
                        className={`w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${
                          selectedBranch?.branchId === branch.branchId
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-200'
                        } ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}`}
                      >
                        {branch.branchId === SELECT_ALL_BRANCH_ID && (
                          <Users className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        )}
                        <span>{branch.branchName}</span>
                        {selectedBranch?.branchId === branch.branchId && (
                          <Check className={`h-4 w-4 ${isRTL ? 'mr-auto' : 'ml-auto'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('clear.filters') || 'Clear'}</span>
                </button>
              )}

            
              {/* Filter Dropdown */}
              <div className="relative" ref={filterRef}>
                <button 
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg transition-colors duration-200 ${
                    hasActiveFilters 
                      ? 'text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800' 
                      : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                  title={t('productsContent.search.filter')}
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('productsContent.search.filter')}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showFilterDropdown && (
                  <div className="absolute top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('filter.status') || 'Status'}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: 'all', label: t('filter.all') || 'All', icon: Package },
                            { value: 'active', label: t('filter.active') || 'Active', icon: Eye },
                            { value: 'inactive', label: t('filter.inactive') || 'Inactive', icon: EyeOff }
                          ].map((status) => {
                            const Icon = status.icon;
                            return (
                              <button
                                key={status.value}
                                onClick={() => setFilters(prev => ({ ...prev, status: status.value as FilterStatus }))}
                                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                                  filters.status === status.value
                                    ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                                <span>{status.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('filter.categories') || 'Categories'}
                        </label>
                        <div className="max-h-32 overflow-y-auto space-y-2">
                          {categories.map((category) => (
                            <label key={category.categoryId} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={filters.categories.includes(category.categoryId)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFilters(prev => ({
                                      ...prev,
                                      categories: [...prev.categories, category.categoryId]
                                    }));
                                  } else {
                                    setFilters(prev => ({
                                      ...prev,
                                      categories: prev.categories.filter(id => id !== category.categoryId)
                                    }));
                                  }
                                }}
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {category.categoryName} ({category?.products?.length})
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('filter.price.range') || 'Price Range'}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={filters.priceRange.min}
                            onChange={(e) => setFilters(prev => ({
                              ...prev,
                              priceRange: { ...prev.priceRange, min: parseFloat(e.target.value) || 0 }
                            }))}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={filters.priceRange.max}
                            onChange={(e) => setFilters(prev => ({
                              ...prev,
                              priceRange: { ...prev.priceRange, max: parseFloat(e.target.value) || 1000 }
                            }))}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative" ref={sortRef}>
                <button 
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                  title={t('productsContent.search.sort')}
                >
                  <ArrowUp className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('productsContent.search.sort')}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showSortDropdown && (
                  <div className="absolute top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      {sortOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value as SortOption);
                              setShowSortDropdown(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                              sortBy === option.value
                                ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{option.label}</span>
                            {sortBy === option.value && <Check className="h-4 w-4 ml-auto" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsCreateCategoryModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/50 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/70 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">{t('productsContent.actions.newCategory')}</span>
              </button>

              <button 
                onClick={() => {
                  setSelectedCategoryForProduct(''); 
                  setIsCreateProductModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>{t('productsContent.actions.newProduct')}</span>
              </button>
                  <button 
                    onClick={() => {
                      navigate('/dashboard/RecycleBin', { state: { source: 'products' } })
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{t('productsContent.actions.RecycleBin')}</span>
                  </button>
            </div>
          </div>
        </div>

        <SortableContext items={processedCategories.map(cat => cat.categoryId)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {processedCategories.map((category) => (
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
                    onOpenProductExtras={handleOpenProductExtras}
                    allCategories={categories}
                    isReorderingProducts={isReorderingProducts && reorderingCategoryId === category.categoryId}
                    viewMode="list"
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
                    <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {t('productsContent.currency.format', { amount: activeProduct.price.toFixed(2) })}
                        </span>
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
        onOpenIngredientSelection={handleOpenIngredientSelection}
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
          onOpenIngredientUpdate={handleOpenIngredientUpdate}
        />
      )}

      {isIngredientUpdateModalOpen && selectedProductForIngredientUpdate && (
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

      {isProductExtrasModalOpen && selectedProductForExtras && (
        <ProductExtrasModal
          isOpen={isProductExtrasModalOpen}
          onClose={() => {
            setIsProductExtrasModalOpen(false);
            setSelectedProductForExtras(null);
          }}
          onSuccess={loadCategories}
          productId={selectedProductForExtras.productId}
          productName={selectedProductForExtras.productName}
        />
      )}
    </DndContext>
  );
};

export default ProductsContent;