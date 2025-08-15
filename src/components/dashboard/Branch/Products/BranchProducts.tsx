import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Search, 
  Store, 
  Plus,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  Trash2,
  ArrowLeft,
  GripVertical,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ShoppingCart,
  Package,
  ChevronDown,
  ChevronUp,
  Star,
  Grid3X3,
  List,
  Filter,
  SortAsc,
  Users,
  Calendar,
  DollarSign
} from 'lucide-react';
import { branchCategoryService } from '../../../../services/Branch/BranchCategoryService';
import { ConfirmDeleteModal } from '../../../ConfirmDeleteModal';
import { branchProductService } from '../../../../services/Branch/BranchProductService';
import { Category, Product } from '../../../../types/dashboard';
import { useLanguage } from '../../../../contexts/LanguageContext';


interface BranchCategory {
  branchCategoryId: number;
  branchId: number;
  categoryId: number;
  category: {
    categoryId: number;
    categoryName: string;
    status: boolean;
    displayOrder: number;
    restaurantId: number;
  };
  isActive: boolean;
  displayName: string;
  displayOrder: number;
  products?: (Product & { 
    isSelected?: boolean; 
    branchProductId?: number; 
  })[]; 
  selectedProductsCount?: number;
  unselectedProductsCount?: number;
}


interface BranchCategoriesProps {
  branchId?: number;
}

// Step enum for the multi-step process
enum AdditionStep {
  SELECT_CATEGORIES = 'select_categories',
  SELECT_PRODUCTS = 'select_products',
  REVIEW_SELECTION = 'review_selection'
}

const BranchCategories: React.FC<BranchCategoriesProps> = ({ branchId = 1 }) => {
  // Translation hook
  const { t, isRTL } = useLanguage();

  // State management
  const [categories, setCategories] = useState<Category[]>([]);
  const [branchCategories, setBranchCategories] = useState<BranchCategory[]>([]);
  const [originalBranchCategories, setOriginalBranchCategories] = useState<BranchCategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [managedSelectedProducts, setManagedSelectedProducts] = useState<Set<number>>(new Set());
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add');
  const [currentStep, setCurrentStep] = useState<AdditionStep>(AdditionStep.SELECT_CATEGORIES);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [expandedBranchCategories, setExpandedBranchCategories] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Reordering states
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  
  // Modal states
  const [selectedCategoryForView, setSelectedCategoryForView] = useState<Category | null>(null);
  const [isViewingCategory, setIsViewingCategory] = useState(false);
  
  // Delete confirmation modal states
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    branchCategoryId: number | null;
    categoryName: string;
  }>({
    isOpen: false,
    branchCategoryId: null,
    categoryName: ''
  });
  
  // Loading and status states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingBranchProducts, setIsLoadingBranchProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchAvailableCategories();
    fetchBranchCategories();
  }, []);

  // Fetch products for existing branch categories
  useEffect(() => {
    if (activeTab === 'manage' && branchCategories.length > 0) {
      fetchBranchCategoriesWithProducts();
    }
  }, [activeTab, branchCategories.length]);

  // Auto-clear messages
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = branchCategories.some((cat, index) => {
      const original = originalBranchCategories[index];
      return !original || cat.displayOrder !== original.displayOrder;
    });
    setHasUnsavedChanges(hasChanges);
  }, [branchCategories, originalBranchCategories]);

  const fetchAvailableCategories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const availableCategories = await branchCategoryService.getAvailableCategoriesForBranch();
      setCategories(availableCategories);
    } catch (err: any) {
      console.error('Error fetching available categories:', err);
      setError(t('branchCategories.error.loadCategories'));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBranchCategories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await branchCategoryService.getBranchCategories();
      const existingCategories = Array.isArray(response) ? response : response.count || [];
      const sortedCategories = existingCategories.sort((a: { displayOrder: number; }, b: { displayOrder: number; }) => a.displayOrder - b.displayOrder);
      setBranchCategories(sortedCategories);
      setOriginalBranchCategories([...sortedCategories]);
    } catch (err: any) {
      console.error('Error fetching existing branch categories:', err);
      setError(t('branchCategories.error.loadBranchCategories'));
    } finally {
      setIsLoading(false);
    }
  };

const fetchBranchCategoriesWithProducts = async () => {
  setIsLoadingBranchProducts(true);
  
  try {
    console.log('=== FETCHING BRANCH CATEGORIES WITH PRODUCTS ===');
    
    // Get all branch products (products actually added to the branch)
    const branchProducts = await branchProductService.getBranchProducts();
    console.log("Branch products from API:", branchProducts);
    console.log("Number of branch products:", branchProducts.length);

    // Enhanced categories with both selected and available products
    const categoriesWithProducts = await Promise.all(
      branchCategories.map(async (branchCategory) => {
        try {
          console.log(`\n--- Processing category: ${branchCategory.displayName} (ID: ${branchCategory.categoryId}) ---`);
          
          // Get branch products for this category (SELECTED products)
          // Fix: Use branchCategory.categoryId to match with branchCategory.categoryId from API
          const selectedProducts = branchProducts.filter(branchProduct => {
            const matches = branchProduct.branchCategory.categoryId === branchCategory.categoryId;
            if (matches) {
              console.log(`Found branch product: ${branchProduct.product.name} in category ${branchCategory.categoryId}`);
            }
            return matches;
          });

          console.log(`Selected products for category ${branchCategory.categoryId}:`, selectedProducts.length);

          // Transform selected branch products to expected format
          const transformedSelectedProducts = selectedProducts.map(branchProduct => {
            const transformed = {
              id: branchProduct.productId, // Original product ID
              branchProductId: branchProduct.branchProductId, // Branch product ID for deletion
              name: branchProduct.product.name,
              description: branchProduct.product.description || '',
              price: branchProduct.price, // Use branch-specific price
              imageUrl: branchProduct.product.imageUrl || '',
              isAvailable: branchProduct.isActive,
              status: branchProduct.isActive,
              displayOrder: branchProduct.displayOrder,
              categoryId: branchCategory.categoryId,
              isSelected: true
            };
            console.log(`Transformed selected product:`, transformed);
            return transformed;
          });

          // Get all available products for this category
          console.log(`Fetching available products for category ${branchCategory.categoryId}...`);
          const allAvailableProducts = await branchCategoryService.getAvailableProductsForBranch({
            categoryId: branchCategory.categoryId,
            onlyActive: true,
            includes: 'category,ingredients,allergens,addons'
          });

          console.log(`Available products for category ${branchCategory.categoryId}:`, allAvailableProducts.length);

          // Transform available products to expected format
          const transformedAvailableProducts = allAvailableProducts.map(product => ({
            id: product.productId,
            name: product.name,
            description: product.description || '',
            price: product.price,
            imageUrl: product.imageUrl || '',
            isAvailable: product.status,
            status: product.status,
            displayOrder: product.displayOrder,
            categoryId: branchCategory.categoryId,
            isSelected: false
          }));

          // Filter out products that are already selected (to get UNSELECTED products)
          const selectedProductIds = new Set(transformedSelectedProducts.map(p => p.id));
          console.log(`Selected product IDs for category ${branchCategory.categoryId}:`, Array.from(selectedProductIds));
          
          const unselectedProducts = transformedAvailableProducts.filter(product => {
            const isNotSelected = !selectedProductIds.has(product.id);
            if (!isNotSelected) {
              console.log(`Product ${product.name} (ID: ${product.id}) is already selected, filtering out`);
            }
            return isNotSelected;
          });

          console.log(`Unselected products for category ${branchCategory.categoryId}:`, unselectedProducts.length);

          // Combine selected and unselected products
          const allProducts = [
            ...transformedSelectedProducts,
            ...unselectedProducts
          ];

          // Sort products: selected first, then by display order
          allProducts.sort((a, b) => {
            if (a.isSelected && !b.isSelected) return -1;
            if (!a.isSelected && b.isSelected) return 1;
            return (a.displayOrder || 0) - (b.displayOrder || 0);
          });

          console.log(`Final products for category ${branchCategory.categoryId}:`, {
            selectedFromBranch: transformedSelectedProducts.length,
            unselectedAvailable: unselectedProducts.length,
            total: allProducts.length
          });

          return {
            ...branchCategory,
            products: allProducts,
            selectedProductsCount: transformedSelectedProducts.length,
            unselectedProductsCount: unselectedProducts.length
          };
        } catch (err) {
          console.error(`Error fetching products for category ${branchCategory.categoryId}:`, err);
          return {
            ...branchCategory,
            products: [],
            selectedProductsCount: 0,
            unselectedProductsCount: 0
          };
        }
      })
    );

    console.log('=== FINAL CATEGORIES WITH PRODUCTS ===');
    categoriesWithProducts.forEach(cat => {
      console.log(`${cat.displayName}: ${cat.selectedProductsCount} selected, ${cat.unselectedProductsCount} available`);
    });

    setBranchCategories(categoriesWithProducts);
    setOriginalBranchCategories([...categoriesWithProducts]);
  } catch (err: any) {
    console.error('Error fetching branch categories with products:', err);
    // Fallback: set categories without products if fetch fails
    setBranchCategories(prev => prev.map(cat => ({ 
      ...cat, 
      products: [], 
      selectedProductsCount: 0,
      unselectedProductsCount: 0 
    })));
    setOriginalBranchCategories(prev => prev.map(cat => ({ 
      ...cat, 
      products: [], 
      selectedProductsCount: 0,
      unselectedProductsCount: 0 
    })));
  } finally {
    setIsLoadingBranchProducts(false);
  }
};

  // Add function to handle adding products to existing categories
const handleAddProductToCategory = async (productId: number, branchCategoryId: number) => {
  try {
    // Save scroll position
    const scrollPosition = window.scrollY;
    
    // Find the product details
    let productToAdd = null;
    let categoryIndex = -1;
    
    for (let i = 0; i < branchCategories.length; i++) {
      const product = branchCategories[i].products?.find(p => p.id === productId);
      if (product) {
        productToAdd = product;
        categoryIndex = i;
        break;
      }
    }
    
    if (!productToAdd || categoryIndex === -1) {
      setError(t('branchCategories.error.productNotFound'));
      return;
    }
    
    // Optimistic update: Update UI immediately
    const updatedCategories = [...branchCategories];
    const updatedProducts = updatedCategories[categoryIndex].products?.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          isSelected: true,
          branchProductId: 999999 // Temporary ID, will be replaced with real one
        };
      }
      return product;
    }) || [];
    
    // Update counts
    updatedCategories[categoryIndex] = {
      ...updatedCategories[categoryIndex],
      products: updatedProducts,
      selectedProductsCount: (updatedCategories[categoryIndex].selectedProductsCount || 0) + 1,
      unselectedProductsCount: (updatedCategories[categoryIndex].unselectedProductsCount || 0) - 1
    };
    
    // Apply optimistic update
    setBranchCategories(updatedCategories);
    
    // Show loading state briefly
    setIsLoading(true);
    
    try {
      const productData = {
        price: productToAdd.price,
        isActive: true,
        productId: productToAdd.id,
        branchCategoryId: branchCategoryId
      };
      
      // Make API call
      const createdBranchProduct = await branchProductService.createBranchProduct(productData);
      
      // Update with real data from API
      const finalUpdatedCategories = [...branchCategories];
      const finalUpdatedProducts = finalUpdatedCategories[categoryIndex].products?.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            isSelected: true,
            branchProductId: createdBranchProduct.branchProductId || createdBranchProduct.id
          };
        }
        return product;
      }) || [];
      
      finalUpdatedCategories[categoryIndex] = {
        ...finalUpdatedCategories[categoryIndex],
        products: finalUpdatedProducts
      };
      
      setBranchCategories(finalUpdatedCategories);
      setSuccessMessage(t('branchCategories.success.productAdded', { name: productToAdd.name }));
      
    } catch (apiError) {
      console.error('API call failed, reverting optimistic update:', apiError);
      
      // Revert optimistic update on API failure
      const revertedCategories = [...branchCategories];
      const revertedProducts = revertedCategories[categoryIndex].products?.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            isSelected: false,
            branchProductId: undefined
          };
        }
        return product;
      }) || [];
      
      revertedCategories[categoryIndex] = {
        ...revertedCategories[categoryIndex],
        products: revertedProducts,
        selectedProductsCount: (revertedCategories[categoryIndex].selectedProductsCount || 1) - 1,
        unselectedProductsCount: (revertedCategories[categoryIndex].unselectedProductsCount || 0) + 1
      };
      
      setBranchCategories(revertedCategories);
      setError(t('branchCategories.error.addProduct'));
    } finally {
      setIsLoading(false);
      
      // Restore scroll position after a brief delay
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 100);
    }
    
  } catch (err: any) {
    console.error('Error adding product to category:', err);
    setError(t('branchCategories.error.addProduct'));
    setIsLoading(false);
  }
};

  // Add function to handle removing products from categories
const handleRemoveProductFromCategory = async (branchProductId: number, productName?: string) => {
  try {
    // Save scroll position
    const scrollPosition = window.scrollY;
    
    // Find the product details
    let productToRemove = null;
    let categoryIndex = -1;
    
    for (let i = 0; i < branchCategories.length; i++) {
      const product = branchCategories[i].products?.find(p => p.branchProductId === branchProductId);
      if (product) {
        productToRemove = product;
        categoryIndex = i;
        break;
      }
    }
    
    if (!productToRemove || categoryIndex === -1) {
      setError(t('branchCategories.error.productNotFound'));
      return;
    }
    
    // Optimistic update: Update UI immediately
    const updatedCategories = [...branchCategories];
    const updatedProducts = updatedCategories[categoryIndex].products?.map(product => {
      if (product.branchProductId === branchProductId) {
        return {
          ...product,
          isSelected: false,
          branchProductId: undefined
        };
      }
      return product;
    }) || [];
    
    // Update counts
    updatedCategories[categoryIndex] = {
      ...updatedCategories[categoryIndex],
      products: updatedProducts,
      selectedProductsCount: Math.max(0, (updatedCategories[categoryIndex].selectedProductsCount || 1) - 1),
      unselectedProductsCount: (updatedCategories[categoryIndex].unselectedProductsCount || 0) + 1
    };
    
    // Apply optimistic update
    setBranchCategories(updatedCategories);
    
    // Show loading state briefly
    setIsLoading(true);
    
    try {
      // Make API call
      await branchProductService.deleteBranchProduct(branchProductId);
      
      setSuccessMessage(t('branchCategories.success.productRemoved', { name: productName || productToRemove.name }));
      
    } catch (apiError) {
      console.error('API call failed, reverting optimistic update:', apiError);
      
      // Revert optimistic update on API failure
      const revertedCategories = [...branchCategories];
      const revertedProducts = revertedCategories[categoryIndex].products?.map(product => {
        if (product.id === productToRemove.id) {
          return {
            ...product,
            isSelected: true,
            branchProductId: branchProductId
          };
        }
        return product;
      }) || [];
      
      revertedCategories[categoryIndex] = {
        ...revertedCategories[categoryIndex],
        products: revertedProducts,
        selectedProductsCount: (revertedCategories[categoryIndex].selectedProductsCount || 0) + 1,
        unselectedProductsCount: Math.max(0, (revertedCategories[categoryIndex].unselectedProductsCount || 1) - 1)
      };
      
      setBranchCategories(revertedCategories);
      setError(t('branchCategories.error.removeProduct'));
    } finally {
      setIsLoading(false);
      
      // Restore scroll position after a brief delay
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 100);
    }
    
  } catch (err: any) {
    console.error('Error removing product from category:', err);
    setError(t('branchCategories.error.removeProduct'));
    setIsLoading(false);
  }
};

  const fetchProductsForSelectedCategories = async () => {
    if (selectedCategories.size === 0) return;
    
    setIsLoadingProducts(true);
    setError(null);
    
    try {
      const allProducts: any[] = [];
      
      for (const categoryId of selectedCategories) {
        const productsData = await branchCategoryService.getAvailableProductsForBranch({
          categoryId,
          onlyActive: true,
          includes: 'category,ingredients,allergens,addons'
        });
        
        console.log(`Products for category ${categoryId}:`, productsData);
        
        if (productsData.length > 0) {
          allProducts.push(...productsData);
        }
      }
      
      console.log('All products fetched:', allProducts);
      
      // Group products by category
      const categoriesMap = new Map<number, Category>();
      
      allProducts.forEach(product => {
        const categoryId = product.category.categoryId;
        
        if (!categoriesMap.has(categoryId)) {
          // Create category object
          categoriesMap.set(categoryId, {
            categoryId: categoryId,
            categoryName: product.category.categoryName,
            description: '',
            status: product.category.status,
            displayOrder: product.category.displayOrder,
            restaurantId: product.category.restaurantId,
            products: [],
            productId: undefined,
            name: undefined,
            isExpanded: false
          });
        }
        
        // Transform product to expected format
        const transformedProduct = {
          id: product.productId,
          name: product.name,
          description: product.description || '',
          price: product.price,
          imageUrl: product.imageUrl || '',
          isAvailable: product.status,
          status: product.status,
          displayOrder: product.displayOrder,
          categoryId: categoryId,
        };
        
        categoriesMap.get(categoryId)!.products.push(transformedProduct);
      });
      
      const categoriesWithProductsData = Array.from(categoriesMap.values());
      console.log('Grouped categories with products:', categoriesWithProductsData);
      setCategoriesWithProducts(categoriesWithProductsData);
      
      // Auto-expand all categories
      setExpandedCategories(new Set(categoriesWithProductsData.map(cat => cat.categoryId)));
    } catch (err: any) {
      console.error('Error fetching products for categories:', err);
      setError(t('branchCategories.error.loadProducts'));
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Navigation functions
  const proceedToProductSelection = async () => {
    if (selectedCategories.size === 0) {
      setError(t('branchCategories.error.selectCategory'));
      return;
    }
    
    await fetchProductsForSelectedCategories();
    setCurrentStep(AdditionStep.SELECT_PRODUCTS);
    setSearchTerm('');
  };

  const proceedToReview = () => {
    setCurrentStep(AdditionStep.REVIEW_SELECTION);
    setSearchTerm('');
  };

  const backToCategorySelection = () => {
    setCurrentStep(AdditionStep.SELECT_CATEGORIES);
    setSelectedProducts(new Set());
    setCategoriesWithProducts([]);
    setSearchTerm('');
  };

  const backToProductSelection = () => {
    setCurrentStep(AdditionStep.SELECT_PRODUCTS);
    setSearchTerm('');
  };

  // Helper functions
  const toggleCategoryExpansion = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleBranchCategoryExpansion = (categoryId: number) => {
    const newExpanded = new Set(expandedBranchCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedBranchCategories(newExpanded);
  };

  const handleCategorySelect = (categoryId: number) => {
    const newSelectedCategories = new Set(selectedCategories);
    
    if (newSelectedCategories.has(categoryId)) {
      newSelectedCategories.delete(categoryId);
      // Remove all products from this category from selection
      const categoryProducts = categoriesWithProducts.find(cat => cat.categoryId === categoryId)?.products || [];
      const newSelectedProducts = new Set(selectedProducts);
      categoryProducts.forEach(product => newSelectedProducts.delete(product.id));
      setSelectedProducts(newSelectedProducts);
    } else {
      newSelectedCategories.add(categoryId);
    }
    
    setSelectedCategories(newSelectedCategories);
  };

  const handleProductSelect = (productId: number) => {
    const newSelectedProducts = new Set(selectedProducts);
    
    if (newSelectedProducts.has(productId)) {
      newSelectedProducts.delete(productId);
    } else {
      newSelectedProducts.add(productId);
    }
    
    setSelectedProducts(newSelectedProducts);
  };

  const handleSelectAllProducts = () => {
    const allProductIds = new Set(
      categoriesWithProducts.flatMap(cat => cat.products.map(product => product.id))
    );
    setSelectedProducts(allProductIds);
  };

  const handleClearAllProducts = () => {
    setSelectedProducts(new Set());
  };

  // Delete functions
  const openDeleteModal = (branchCategoryId: number, categoryName: string) => {
    setDeleteModal({
      isOpen: true,
      branchCategoryId,
      categoryName
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      branchCategoryId: null,
      categoryName: ''
    });
  };

  const performDelete = async () => {
    if (!deleteModal.branchCategoryId) return;

    setIsDeleting(true);
    setError(null);
    
    try {
      await branchCategoryService.deleteBranchCategory(deleteModal.branchCategoryId);
      
      const updatedCategories = branchCategories
        .filter(cat => cat.branchCategoryId !== deleteModal.branchCategoryId)
        .map((cat, index) => ({ ...cat, displayOrder: index + 1 }));
      
      setBranchCategories(updatedCategories);
      setOriginalBranchCategories(updatedCategories);
      
      // Refresh available categories so the deleted category appears in "Add New"
      await fetchAvailableCategories();
      
      setSuccessMessage(t('branchCategories.success.categoryRemoved', { name: deleteModal.categoryName }));
      closeDeleteModal();
      
    } catch (err: any) {
      console.error('Error deleting branch category:', err);
      
      if (err.status === 404) {
        setError(t('branchCategories.error.categoryNotFound', { name: deleteModal.categoryName }));
        // Refresh both lists if category was already deleted
        await fetchBranchCategories();
        await fetchAvailableCategories();
      } else if (err.status === 403) {
        setError(t('branchCategories.error.noPermission', { name: deleteModal.categoryName }));
      } else if (err.status === 409) {
        setError(t('branchCategories.error.categoryInUse', { name: deleteModal.categoryName }));
      } else {
        setError(t('branchCategories.error.deleteCategory', { name: deleteModal.categoryName }));
      }
    } finally {
      setIsDeleting(false);
    }
  };

 const handleSave = async () => {
  if (!branchId) {
    setError(t('branchCategories.error.branchIdRequired'));
    return;
  }

  if (selectedCategories.size === 0) {
    setError(t('branchCategories.error.selectAtLeastOne'));
    return;
  }

  setIsSaving(true);
  setError(null);
  setSuccessMessage(null);
  
  try {
    let createdCount = 0;
    const createdBranchCategories = new Map(); // To store categoryId -> branchCategoryId mapping
    
    console.log('=== STARTING SAVE PROCESS ===');
    console.log('Selected categories:', Array.from(selectedCategories));
    console.log('Selected products:', Array.from(selectedProducts));
    
    // Step 1: Create branch categories and capture their IDs
    for (const categoryId of selectedCategories) {
      const category = categories.find(cat => cat.categoryId === categoryId);
      
      if (!category) {
        console.warn('Category not found:', categoryId);
        continue;
      }

      try {
        const categoryData = {
          categoryId: category.categoryId,
          displayName: category.categoryName,
          isActive: true,
          displayOrder: branchCategories.length + createdCount + 1
        };

        console.log('Creating branch category:', categoryData);
        const createdBranchCategory = await branchCategoryService.createBranchCategory(categoryData);
        console.log('Created branch category response:', createdBranchCategory);
        
        // Store the mapping of categoryId to branchCategoryId
        if ( createdBranchCategory.id) {
          createdBranchCategories.set(categoryId, createdBranchCategory.id);
          console.log(`Mapped categoryId ${categoryId} -> branchCategoryId ${createdBranchCategory.id}`);
        } else {
          console.error('No branchCategoryId returned for category:', categoryId);
        }
        
        createdCount++;
        
      } catch (err: any) {
        console.error('Error creating branch category:', categoryId, err);
        throw new Error(t('branchCategories.error.createCategory', { name: category.categoryName }));
      }
    }
    
    console.log('=== CATEGORY CREATION COMPLETE ===');
    console.log('Created branch categories mapping:', Object.fromEntries(createdBranchCategories));
    
    // Step 2: Create branch products for selected products
    let createdProductsCount = 0;
    
    if (selectedProducts.size > 0) {
      console.log('=== STARTING PRODUCT CREATION ===');
      
      for (const productId of selectedProducts) {
        // Find the product details from categoriesWithProducts
        let productToCreate = null;
        let categoryId = null;
        
        for (const category of categoriesWithProducts) {
          const product = category.products.find(p => p.id === productId);
          if (product) {
            productToCreate = product;
            categoryId = category.categoryId;
            break;
          }
        }
        
        if (!productToCreate || !categoryId) {
          console.warn('Product not found:', productId);
          continue;
        }
        
        // Get the branchCategoryId for this product's category
        const branchCategoryId = createdBranchCategories.get(categoryId);
        
        if (!branchCategoryId) {
          console.warn('Branch category ID not found for category:', categoryId);
          console.warn('Available mappings:', Object.fromEntries(createdBranchCategories));
          continue;
        }
        
        try {
          const productData = {
            price: productToCreate.price,
            isActive: true,
            productId: productToCreate.id, // This is the original productId from the API
            branchCategoryId: branchCategoryId
          };
          
          console.log('Creating branch product with data:', productData);
          const createdBranchProduct = await branchProductService.createBranchProduct(productData);
          console.log('Created branch product response:', createdBranchProduct);
          
          createdProductsCount++;
          
        } catch (err: any) {
          console.error('Error creating branch product:', productId, err);
          console.error('Product data that failed:', {
            productId: productToCreate.id,
            productName: productToCreate.name,
            categoryId,
            branchCategoryId
          });
          // Continue with other products rather than failing completely
        }
      }
    }
    
    console.log('=== PRODUCT CREATION COMPLETE ===');
    console.log(`Created ${createdProductsCount} products out of ${selectedProducts.size} selected`);
    
    // Step 3: Show success message
    const categoryText = createdCount === 1 ? t('branchCategories.common.category') : t('branchCategories.common.categories');
    const productText = createdProductsCount === 1 ? t('branchCategories.common.product') : t('branchCategories.common.products');
    
    let successMsg = t('branchCategories.success.categoriesAdded', { count: createdCount, branchId });
    
    if (createdProductsCount > 0) {
      successMsg = t('branchCategories.success.categoriesAndProductsAdded', { 
        categoryCount: createdCount, 
        productCount: createdProductsCount 
      });
    }
    
    // Add warning if some products failed
    if (selectedProducts.size > 0 && createdProductsCount < selectedProducts.size) {
      const failedCount = selectedProducts.size - createdProductsCount;
      successMsg += ` ${t('branchCategories.success.someProductsFailed', { count: failedCount })}`;
    }
    
    setSuccessMessage(successMsg);
    
    // Reset form
    setSelectedCategories(new Set());
    setSelectedProducts(new Set());
    setCategoriesWithProducts([]);
    setCurrentStep(AdditionStep.SELECT_CATEGORIES);
    
    console.log('=== REFRESHING DATA ===');
    
    // Wait a bit for backend to persist the data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Refresh both lists to ensure UI is in sync
    await fetchBranchCategories();
    await fetchAvailableCategories();
    
    console.log('=== SAVE PROCESS COMPLETE ===');
    
  } catch (err: any) {
    console.error('Error saving branch categories and products:', err);
    setError(err.message || 'Failed to add categories and products to branch');
  } finally {
    setIsSaving(false);
  }
};

  // Reordering functions
  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newCategories = [...branchCategories];
      [newCategories[index], newCategories[index - 1]] = [newCategories[index - 1], newCategories[index]];
      newCategories.forEach((cat, idx) => {
        cat.displayOrder = idx + 1;
      });
      setBranchCategories(newCategories);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < branchCategories.length - 1) {
      const newCategories = [...branchCategories];
      [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
      newCategories.forEach((cat, idx) => {
        cat.displayOrder = idx + 1;
      });
      setBranchCategories(newCategories);
    }
  };

  const handleSaveOrder = async () => {
    setIsReordering(true);
    setError(null);
    
    try {
      const categoryOrders = branchCategories.map(cat => ({
        branchCategoryId: cat.branchCategoryId,
        newDisplayOrder: cat.displayOrder
      }));

      await branchCategoryService.reorderBranchCategories(categoryOrders);
      
      setOriginalBranchCategories([...branchCategories]);
      setIsReorderMode(false);
      setSuccessMessage(t('branchCategories.success.orderSaved'));
      
    } catch (err: any) {
      console.error('Error saving category order:', err);
      setError(t('branchCategories.error.saveOrder'));
    } finally {
      setIsReordering(false);
    }
  };

  // Filter functions
  const filteredCategories = categories.filter(category => 
    category?.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBranchCategories = branchCategories.filter(branchCategory => 
    branchCategory?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branchCategory?.category?.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategoriesWithProducts = categoriesWithProducts.filter(category =>
    category?.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.products?.some(product => 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Get categories that are not already in branch
  const availableCategoriesNotInBranch = filteredCategories.filter(category => 
    !branchCategories.some(bc => bc.categoryId === category.categoryId)
  );

  // Get selected categories with their selected products
  const getSelectedCategoriesWithProducts = () => {
    return categoriesWithProducts.map(category => ({
      ...category,
      selectedProducts: category.products.filter(product => selectedProducts.has(product.id))
    })).filter(category => selectedCategories.has(category.categoryId));
  };

  // Enhanced Products Section for Manage Existing Tab
  const renderManageProductsSection = (branchCategory: BranchCategory) => {
    if (isReorderMode || !expandedBranchCategories.has(branchCategory.categoryId) || !branchCategory.products || branchCategory.products.length === 0) {
      return null;
    }

    return (
      <div className="border-t border-gray-200 dark:border-gray-600 p-6 bg-gray-50 dark:bg-gray-700/50">
        <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h5 className="font-medium text-gray-900 dark:text-white">
            {t('branchCategories.manage.productsInCategory')}
          </h5>
          <div className={`flex items-center space-x-4 text-sm ${isRTL ? 'space-x-reverse' : ''}`}>
            <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-300">
                {branchCategory.selectedProductsCount || 0} {t('branchCategories.manage.addedLabel')}
              </span>
            </div>
            <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-300">
                {branchCategory.unselectedProductsCount || 0} {t('branchCategories.manage.availableLabel')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branchCategory.products.map((product) => {
            const isSelected = product.isSelected;
            
            return (
              <div 
                key={product.id} 
                className={`relative flex items-center space-x-3 p-4 rounded-xl border-2 transition-all ${
                  isSelected 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                } ${isRTL ? 'space-x-reverse' : ''}`}
              >
                {/* Status indicator */}
                <div className={`absolute -top-2 ${isRTL ? '-left-2' : '-right-2'} w-6 h-6 rounded-full flex items-center justify-center ${
                  isSelected 
                    ? 'bg-green-600 dark:bg-green-500' 
                    : 'bg-gray-400 dark:bg-gray-500'
                }`}>
                  {isSelected ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <Plus className="h-4 w-4 text-white" />
                  )}
                </div>

                {/* Product image */}
                {product.imageUrl && (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                
                {/* Product details */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white truncate">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    ${product.price.toFixed(2)}
                  </div>
                  {product.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {product.description}
                    </div>
                  )}
                </div>
                
                {/* Status badge */}
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.status 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {product.status ? t('branchCategories.common.available') : t('branchCategories.common.unavailable')}
                  </span>
                  
                  {/* Action button */}
                  {isSelected ? (
                    <button
                      onClick={() => handleRemoveProductFromCategory(product.branchProductId || product.id)}
                      disabled={isLoading}
                      className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-xs disabled:opacity-50"
                      title={t('branchCategories.manage.removeFromBranch')}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddProductToCategory(product.id, branchCategory.branchCategoryId)}
                      disabled={isLoading}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-xs disabled:opacity-50"
                      title={t('branchCategories.manage.addToBranch')}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Category summary */}
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
          <div className={`flex items-center justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center space-x-6 ${isRTL ? 'space-x-reverse' : ''}`}>
              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">{branchCategory.selectedProductsCount || 0}</span> {t('branchCategories.manage.productsAddedToBranch')}
                </span>
              </div>
              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Package className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">{branchCategory.unselectedProductsCount || 0}</span> {t('branchCategories.manage.moreAvailableToAdd')}
                </span>
              </div>
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              {t('branchCategories.manage.total')} {branchCategory.products.length} {t('branchCategories.manage.products')}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Step Progress Component - keeping the original implementation
  const StepProgress = () => (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center space-x-8 ${isRTL ? 'space-x-reverse' : ''}`}>
          {/* Step 1 */}
          <div className={`flex items-center ${
            currentStep === AdditionStep.SELECT_CATEGORIES 
              ? 'text-blue-600 dark:text-blue-400' 
              : currentStep === AdditionStep.SELECT_PRODUCTS || currentStep === AdditionStep.REVIEW_SELECTION
              ? 'text-green-600 dark:text-green-400' 
              : 'text-gray-400 dark:text-gray-500'
          } ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'} font-semibold ${
              currentStep === AdditionStep.SELECT_CATEGORIES 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : currentStep === AdditionStep.SELECT_PRODUCTS || currentStep === AdditionStep.REVIEW_SELECTION
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
            }`}>
              {currentStep === AdditionStep.SELECT_CATEGORIES ? '1' : <Check className="h-5 w-5" />}
            </div>
            <div>
              <div className="font-medium">{t('branchCategories.steps.chooseCategories')}</div>
              <div className="text-sm opacity-70">{selectedCategories.size} {t('branchCategories.steps.selected')}</div>
            </div>
          </div>

          {/* Arrow */}
          <ArrowRight className={`h-5 w-5 text-gray-300 dark:text-gray-600 ${isRTL ? 'rotate-180' : ''}`} />

          {/* Step 2 */}
          <div className={`flex items-center ${
            currentStep === AdditionStep.SELECT_PRODUCTS 
              ? 'text-blue-600 dark:text-blue-400' 
              : currentStep === AdditionStep.REVIEW_SELECTION
              ? 'text-green-600 dark:text-green-400' 
              : 'text-gray-400 dark:text-gray-500'
          } ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'} font-semibold ${
              currentStep === AdditionStep.SELECT_PRODUCTS 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : currentStep === AdditionStep.REVIEW_SELECTION
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
            }`}>
              {currentStep === AdditionStep.SELECT_PRODUCTS ? '2' : 
               currentStep === AdditionStep.REVIEW_SELECTION ? <Check className="h-5 w-5" /> : '2'}
            </div>
            <div>
              <div className="font-medium">{t('branchCategories.steps.selectProducts')}</div>
              <div className="text-sm opacity-70">{selectedProducts.size} {t('branchCategories.steps.selected')}</div>
            </div>
          </div>

          {/* Arrow */}
          <ArrowRight className={`h-5 w-5 text-gray-300 dark:text-gray-600 ${isRTL ? 'rotate-180' : ''}`} />

          {/* Step 3 */}
          <div className={`flex items-center ${
            currentStep === AdditionStep.REVIEW_SELECTION 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-gray-400 dark:text-gray-500'
          } ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'} font-semibold ${
              currentStep === AdditionStep.REVIEW_SELECTION 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
            }`}>
              3
            </div>
            <div>
              <div className="font-medium">{t('branchCategories.steps.reviewAdd')}</div>
              <div className="text-sm opacity-70">{t('branchCategories.steps.finalStep')}</div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className={`flex space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
          {currentStep === AdditionStep.SELECT_PRODUCTS && (
            <button
              onClick={backToCategorySelection}
              className={`px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
              {t('branchCategories.steps.back')}
            </button>
          )}
          {currentStep === AdditionStep.REVIEW_SELECTION && (
            <button
              onClick={backToProductSelection}
              className={`px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
              {t('branchCategories.steps.back')}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Main Component Render
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {t('branchCategories.title')}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('branchCategories.subtitle', { branchId })}
              </p>
            </div>
            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 px-4 py-2">
                <div className={`flex items-center space-x-2 text-sm ${isRTL ? 'space-x-reverse' : ''}`}>
                  <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-300">{t('branchCategories.lastUpdated')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t('branchCategories.stats.availableCategories')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('branchCategories.stats.readyToAdd')}</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                <Store className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t('branchCategories.stats.activeCategories')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{branchCategories.length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('branchCategories.stats.currentlyInBranch')}</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t('branchCategories.stats.selectedCategories')}</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{selectedCategories.size}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('branchCategories.stats.toBeAdded')}</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                <Plus className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t('branchCategories.stats.selectedProducts')}</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{selectedProducts.size}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('branchCategories.stats.fromCategories')}</p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-xl">
                <Package className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setActiveTab('add')}
              className={`flex-1 py-6 px-8 text-lg font-semibold transition-all ${
                activeTab === 'add'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-4 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className={`flex items-center justify-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Plus className="h-6 w-6" />
                <span>{t('branchCategories.tabs.addNew')}</span>
                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                  {availableCategoriesNotInBranch.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex-1 py-6 px-8 text-lg font-semibold transition-all ${
                activeTab === 'manage'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-4 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className={`flex items-center justify-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Grid3X3 className="h-6 w-6" />
                <span>{t('branchCategories.tabs.manageExisting')}</span>
                <span className="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                  {branchCategories.length}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <AlertCircle className={`h-5 w-5 text-red-600 dark:text-red-400 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                <span className="text-red-700 dark:text-red-300 font-medium">{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CheckCircle className={`h-5 w-5 text-green-600 dark:text-green-400 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                <span className="text-green-700 dark:text-green-300 font-medium">{successMessage}</span>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {activeTab === 'add' ? (
          <>
            {/* Step Progress */}
            <StepProgress />

            {/* Content Based on Current Step */}
            {currentStep === AdditionStep.SELECT_CATEGORIES && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('branchCategories.categorySelection.title')}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{t('branchCategories.categorySelection.subtitle')}</p>
                    </div>
                    <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                      <div className="relative">
                        <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5`} />
                        <input
                          type="text"
                          placeholder={t('branchCategories.categorySelection.searchPlaceholder')}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                        />
                      </div>
                      <button
                        onClick={fetchAvailableCategories}
                        disabled={isLoading}
                        className={`px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300 ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        {t('branchCategories.categorySelection.refresh')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Categories Grid */}
                <div className="p-6">
                  {isLoading ? (
                    <div className="text-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">{t('branchCategories.loading.categories')}</p>
                    </div>
                  ) : availableCategoriesNotInBranch.length === 0 ? (
                    <div className="text-center py-12">
                      <Store className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{t('branchCategories.categorySelection.noCategories')}</h3>
                      <p className="text-gray-500 dark:text-gray-400">{t('branchCategories.categorySelection.allCategoriesAdded')}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {availableCategoriesNotInBranch.map((category) => {
                        const isSelected = selectedCategories.has(category.categoryId);
                        
                        return (
                          <div
                            key={category.categoryId}
                            className={`relative rounded-2xl border-2 transition-all cursor-pointer hover:shadow-lg ${
                              isSelected 
                                ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
                                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                            onClick={() => handleCategorySelect(category.categoryId)}
                          >
                            {/* Selection indicator */}
                            {isSelected && (
                              <div className={`absolute -top-2 ${isRTL ? '-left-2' : '-right-2'} w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center`}>
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            )}

                            <div className="p-6">
                              <div className={`flex items-start justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className="flex-1">
                                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {category.categoryName}
                                  </h4>
                                  {category.description && (
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                                      {category.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                                  <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                                    <Package className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                      {category.products?.length || 0} {t('branchCategories.categorySelection.products')}
                                    </span>
                                  </div>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    category.status 
                                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                  }`}>
                                    {category.status ? t('branchCategories.categorySelection.active') : t('branchCategories.categorySelection.inactive')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Actions */}
                {selectedCategories.size > 0 && (
                  <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">{selectedCategories.size}</span> {t('branchCategories.categorySelection.categoriesSelected')}
                      </div>
                      <div className={`flex space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                        <button
                          onClick={() => setSelectedCategories(new Set())}
                          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                          {t('branchCategories.categorySelection.clearSelection')}
                        </button>
                        <button
                          onClick={proceedToProductSelection}
                          className={`px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                          {t('branchCategories.categorySelection.nextSelectProducts')}
                          <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === AdditionStep.SELECT_PRODUCTS && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('branchCategories.productSelection.title')}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{t('branchCategories.productSelection.subtitle')}</p>
                    </div>
                    <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                      <div className="relative">
                        <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5`} />
                        <input
                          type="text"
                          placeholder={t('branchCategories.productSelection.searchPlaceholder')}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                        />
                      </div>
                      <div className={`flex space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                        <button
                          onClick={handleSelectAllProducts}
                          className="px-4 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                        >
                          {t('branchCategories.productSelection.selectAll')}
                        </button>
                        <button
                          onClick={handleClearAllProducts}
                          className="px-4 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        >
                          {t('branchCategories.productSelection.clearAll')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products by Category */}
                <div className="p-6">
                  {isLoadingProducts ? (
                    <div className="text-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">{t('branchCategories.productSelection.loadingProducts')}</p>
                    </div>
                  ) : filteredCategoriesWithProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{t('branchCategories.productSelection.noProductsFound')}</h3>
                      <p className="text-gray-500 dark:text-gray-400">{t('branchCategories.productSelection.selectedCategoriesNoProducts')}</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {filteredCategoriesWithProducts.map((category) => (
                        <div key={category.categoryId} className="border border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden">
                          {/* Category Header */}
                          <div 
                            className="p-6 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => toggleCategoryExpansion(category.categoryId)}
                          >
                            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                  <Store className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">{category.categoryName}</h4>
                                  <p className="text-gray-600 dark:text-gray-300">{category.products.length} {t('branchCategories.productSelection.available')}</p>
                                </div>
                              </div>
                              <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {category.products.filter(p => selectedProducts.has(p.id)).length} {t('branchCategories.productSelection.selectedText')}
                                </span>
                                {expandedCategories.has(category.categoryId) ? (
                                  <ChevronUp className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Products Grid */}
                          {expandedCategories.has(category.categoryId) && (
                            <div className="p-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {category.products.map((product) => {
                                  const isSelected = selectedProducts.has(product.id);
                                  
                                  return (
                                    <div
                                      key={product.id}
                                      className={`relative rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
                                        isSelected 
                                          ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20' 
                                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
                                      }`}
                                      onClick={() => handleProductSelect(product.id)}
                                    >
                                      {isSelected && (
                                        <div className={`absolute -top-2 ${isRTL ? '-left-2' : '-right-2'} w-6 h-6 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center`}>
                                          <Check className="h-4 w-4 text-white" />
                                        </div>
                                      )}

                                      <div className="p-4">
                                        <div className={`flex items-start justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                          <div className="flex-1">
                                            <h5 className="font-bold text-gray-900 dark:text-white mb-1">{product.name}</h5>
                                            {product.description && (
                                              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                                                {product.description}
                                              </p>
                                            )}
                                          </div>
                                          {product.imageUrl && (
                                            <img 
                                              src={product.imageUrl} 
                                              alt={product.name}
                                              className={`w-12 h-12 rounded-lg object-cover ${isRTL ? 'mr-3' : 'ml-3'}`}
                                            />
                                          )}
                                        </div>

                                        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                                          <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                              ${product.price.toFixed(2)}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              product.status 
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                            }`}>
                                              {product.status ? t('branchCategories.productSelection.available') : t('branchCategories.productSelection.unavailable')}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">{selectedProducts.size}</span> {t('branchCategories.productSelection.productsSelectedFrom')}{' '}
                      <span className="font-medium">{selectedCategories.size}</span> {t('branchCategories.productSelection.categories')}
                    </div>
                    <div className={`flex space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                      <button
                        onClick={proceedToReview}
                        className={`px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        {t('branchCategories.productSelection.reviewSelection')}
                        <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === AdditionStep.REVIEW_SELECTION && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('branchCategories.review.title')}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{t('branchCategories.review.subtitle')}</p>
                    </div>
                  </div>
                </div>

                {/* Selection Summary */}
                <div className="p-6">
                  <div className="space-y-8">
                    {getSelectedCategoriesWithProducts().map((category) => (
                      <div key={category.categoryId} className="border border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden">
                        {/* Category Header */}
                        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                              <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center">
                                <Store className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{category.categoryName}</h4>
                                <p className="text-gray-600 dark:text-gray-300">
                                  {category.selectedProducts.length > 0 
                                    ? `${category.selectedProducts.length} ${t('branchCategories.review.of')} ${category.products.length} ${t('branchCategories.review.productsSelected')}`
                                    : `${t('branchCategories.review.allProducts')} ${category.products.length} ${t('branchCategories.review.productsWillBeAdded')}`
                                  }
                                </p>
                              </div>
                            </div>
                            <div className={`text-${isRTL ? 'left' : 'right'}`}>
                              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                ${category.selectedProducts.length > 0 
                                  ? category.selectedProducts.reduce((sum, product) => sum + product.price, 0).toFixed(2)
                                  : category.products.reduce((sum, product) => sum + product.price, 0).toFixed(2)
                                }
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{t('branchCategories.review.totalValue')}</div>
                            </div>
                          </div>
                        </div>

                        {/* Selected Products */}
                        {category.selectedProducts.length > 0 && (
                          <div className="p-6">
                            <h5 className="font-medium text-gray-900 dark:text-white mb-4">{t('branchCategories.review.selectedProducts')}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {category.selectedProducts.map((product) => (
                                <div key={product.id} className={`flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 ${isRTL ? 'space-x-reverse' : ''}`}>
                                  {product.imageUrl && (
                                    <img 
                                      src={product.imageUrl} 
                                      alt={product.name}
                                      className="w-10 h-10 rounded-lg object-cover"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300">${product.price.toFixed(2)}</div>
                                  </div>
                                  <div className="w-5 h-5 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center">
                                    <Check className="h-3 w-3 text-white" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Actions */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {t('branchCategories.review.readyToAdd')} {selectedCategories.size} {t('branchCategories.review.categories')}
                        {selectedProducts.size > 0 && ` ${t('branchCategories.review.with')} ${selectedProducts.size} ${t('branchCategories.review.products')}`}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {t('branchCategories.review.availableInBranch')} {branchId}
                      </div>
                    </div>
                    <div className={`flex space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                      <button
                        onClick={() => {
                          setSelectedCategories(new Set());
                          setSelectedProducts(new Set());
                          setCategoriesWithProducts([]);
                          setCurrentStep(AdditionStep.SELECT_CATEGORIES);
                        }}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        {t('branchCategories.review.startOver')}
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`px-8 py-3 bg-green-600 dark:bg-green-500 text-white rounded-xl hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50 ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {isSaving ? t('branchCategories.review.adding') : t('branchCategories.review.addToBranch')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Enhanced Manage Existing Categories Tab */
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('branchCategories.manage.title')}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">{t('branchCategories.manage.subtitle')}</p>
                </div>
                <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                  {hasUnsavedChanges && isReorderMode && (
                    <button
                      onClick={handleSaveOrder}
                      disabled={isReordering}
                      className={`px-4 py-3 bg-green-600 dark:bg-green-500 text-white rounded-xl hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      {isReordering ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {isReordering ? t('branchCategories.manage.saving') : t('branchCategories.manage.saveOrder')}
                    </button>
                  )}
                  <button
                    onClick={() => setIsReorderMode(!isReorderMode)}
                    className={`px-4 py-3 rounded-xl transition-colors flex items-center gap-2 ${
                      isReorderMode
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    } ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <GripVertical className="h-4 w-4" />
                    {isReorderMode ? t('branchCategories.manage.exitReorder') : t('branchCategories.manage.reorder')}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {isLoadingBranchProducts ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">{t('branchCategories.manage.loadingCategoriesProducts')}</p>
                </div>
              ) : branchCategories.length === 0 ? (
                <div className="text-center py-12">
                  <Store className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{t('branchCategories.manage.noCategoriesAdded')}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">{t('branchCategories.manage.noCategoriesYet')}</p>
                  <button
                    onClick={() => setActiveTab('add')}
                    className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    {t('branchCategories.manage.addCategories')}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {branchCategories.map((branchCategory, index) => (
                    <div
                      key={branchCategory.branchCategoryId}
                      className={`border-2 rounded-2xl transition-all ${
                        isReorderMode 
                          ? 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 cursor-move' 
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      {/* Category Header */}
                      <div className="p-6">
                        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                            {isReorderMode && (
                              <GripVertical className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                            )}
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                              {branchCategory.displayOrder}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-gray-900 dark:text-white">{branchCategory.displayName}</h4>
                              <p className="text-gray-600 dark:text-gray-300">{t('branchCategories.manage.original')} {branchCategory.category.categoryName}</p>
                              <div className={`flex items-center space-x-4 mt-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-medium text-green-600 dark:text-green-400">
                                    {branchCategory.selectedProductsCount || 0}
                                  </span> {t('branchCategories.manage.added')}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-medium text-blue-600 dark:text-blue-400">
                                    {branchCategory.unselectedProductsCount || 0}
                                  </span> {t('branchCategories.manage.available')}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {t('branchCategories.manage.total')} {branchCategory.products?.length || 0}
                                </p>
                              </div>
                            </div>
                            {!isReorderMode && branchCategory.products && branchCategory.products.length > 0 && (
                              <button
                                onClick={() => toggleBranchCategoryExpansion(branchCategory.categoryId)}
                                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                              >
                                {expandedBranchCategories.has(branchCategory.categoryId) ? (
                                  <ChevronUp className="h-5 w-5" />
                                ) : (
                                  <ChevronDown className="h-5 w-5" />
                                )}
                              </button>
                            )}
                          </div>
                          
                          <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              branchCategory.isActive 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            }`}>
                              {branchCategory.isActive ? t('branchCategories.common.active') : t('branchCategories.common.inactive')}
                            </span>
                            
                            {isReorderMode ? (
                              <div className={`flex space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                                <button
                                  onClick={() => handleMoveUp(index)}
                                  disabled={index === 0}
                                  className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleMoveDown(index)}
                                  disabled={index === branchCategories.length - 1}
                                  className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => openDeleteModal(branchCategory.branchCategoryId, branchCategory.displayName)}
                                className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                title={t('branchCategories.delete.title')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Products Section */}
                      {renderManageProductsSection(branchCategory)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={performDelete}
          title={t('branchCategories.delete.title')}
          message={t('branchCategories.delete.confirmMessage', { categoryName: deleteModal.categoryName })}
          isSubmitting={isDeleting}
          itemType={t('branchCategories.delete.category')}
          itemName={deleteModal.categoryName}
        />
      </div>
    </div>
  );
};

export default BranchCategories;