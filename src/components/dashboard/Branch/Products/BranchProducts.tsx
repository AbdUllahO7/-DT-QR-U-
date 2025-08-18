import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Store, 
  Plus,
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign,
  Package
} from 'lucide-react';
import { branchCategoryService } from '../../../../services/Branch/BranchCategoryService';
import { ConfirmDeleteModal } from '../../../ConfirmDeleteModal';
import { branchProductService } from '../../../../services/Branch/BranchProductService';
import { Category, Product } from '../../../../types/dashboard';
import { useLanguage } from '../../../../contexts/LanguageContext';
import ProductDetailsModal from './ProductDetailsModal';
import CategoriesContent from './CategoriesContent';

// Enhanced interfaces for detailed product information
interface APIAllergen {
  id?: number;
  allergenId: number;
  code: string;
  allergenCode?: string;
  name: string;
  icon: string;
  description?: string | null;
  productCount?: number;
  containsAllergen?: boolean;
  presence?: number;
  note: string;
}

interface APIIngredient {
  id: number;
  productId: number;
  ingredientId: number;
  ingredientName: string;
  quantity: number;
  unit: string;
  isAllergenic: boolean;
  isAvailable: boolean;
  allergenIds: number[];
  allergens: APIAllergen[];
}

interface APIProduct {
  productId: number;
  name: string;
  price: number;
  imageUrl?: string;
  status: boolean;
  displayOrder: number;
}

interface DetailedProduct extends Product {
  branchProductId?: number;
  originalProductId?: number;
  product?: APIProduct;
  branchCategory?: Category;
  ingredients?: APIIngredient[];
  allergens?: APIAllergen[];
  orderDetails?: any;
  isSelected?: boolean;
}

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
  products?: DetailedProduct[]; 
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
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add');
  const [currentStep, setCurrentStep] = useState<AdditionStep>(AdditionStep.SELECT_CATEGORIES);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [expandedBranchCategories, setExpandedBranchCategories] = useState<Set<number>>(new Set());
  
  // Product details modal state
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<DetailedProduct | null>(null);
  const [isProductDetailsModalOpen, setIsProductDetailsModalOpen] = useState(false);
  
  // Reordering states
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  
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

  // Product details modal functions
  const handleShowProductDetails = (product: DetailedProduct) => {
    setSelectedProductForDetails(product);
    setIsProductDetailsModalOpen(true);
  };

  const handleCloseProductDetails = () => {
    setSelectedProductForDetails(null);
    setIsProductDetailsModalOpen(false);
  };

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
      setError(t('branchCategories.messages.error.loadingCategories'));
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
      setError(t('branchCategories.messages.error.loadingCategories'));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBranchCategoriesWithProducts = async () => {
    setIsLoadingBranchProducts(true);
    
    try {
      // Get all branch products with full details including ingredients and allergens
      const branchProducts = await branchProductService.getBranchProductsWithDetails();

      // Enhanced categories with both selected and available products
      const categoriesWithProducts = await Promise.all(
        branchCategories.map(async (branchCategory) => {
          try {
            // Get branch products for this category (SELECTED products)
            const selectedProducts = branchProducts.filter(branchProduct => {
              const matches = branchProduct.branchCategory?.categoryId === branchCategory.categoryId;
              return matches;
            });

            // Transform selected branch products to expected format with full details
            const transformedSelectedProducts: DetailedProduct[] = selectedProducts.map(branchProduct => {
              const transformed: DetailedProduct = {
                productId: branchProduct.productId,
                isAvailable: branchProduct.status,
                branchProductId: branchProduct.branchProductId, // Branch product ID for deletion
                originalProductId: branchProduct.productId || branchProduct.productId,
                name: branchProduct.name,
                description: branchProduct?.description,
                price: branchProduct.price, // Use branch-specific price
                imageUrl: branchProduct?.imageUrl,
                status: branchProduct.status,
                displayOrder: branchProduct.displayOrder,
                categoryId: branchCategory.categoryId,
                isSelected: true,
              };
              return transformed;
            });

            // Get all available products for this category
            const allAvailableProducts = await branchCategoryService.getAvailableProductsForBranch({
              categoryId: branchCategory.categoryId,
              onlyActive: true,
              includes: 'category,ingredients,allergens,addons'
            });

            // Transform available products to expected format
            const transformedAvailableProducts: DetailedProduct[] = allAvailableProducts.map(product => ({
              id: product.productId,
              productId: product.productId,
              name: product.name,
              description: product.description ,
              price: product.price,
              imageUrl: product.imageUrl,
              isAvailable: product.status,
              status: product.status,
              displayOrder: product.displayOrder,
              categoryId: branchCategory.categoryId,
              isSelected: false,
              originalProductId: product.productId
            }));

            // Filter out products that are already selected (to get UNSELECTED products)
            const selectedProductIds = new Set(transformedSelectedProducts.map(p => p.productId));
            const unselectedProducts = transformedAvailableProducts.filter(product => {
              return !selectedProductIds.has(product.productId);
            });

            // Combine selected and unselected products
            const allProducts: DetailedProduct[] = [
              ...transformedSelectedProducts,
              ...unselectedProducts
            ];

            // Sort products: selected first, then by display order
            allProducts.sort((a, b) => {
              if (a.isSelected && !b.isSelected) return -1;
              if (!a.isSelected && b.isSelected) return 1;
              return (a.displayOrder || 0) - (b.displayOrder || 0);
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

      setBranchCategories(categoriesWithProducts);
      setOriginalBranchCategories([...categoriesWithProducts]);
    } catch (err: any) {
      console.error('Error fetching branch categories with detailed products:', err);
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
        
        if (productsData.length > 0) {
          allProducts.push(...productsData);
        }
      }
      
      // Group products by category
      const categoriesMap = new Map<number, Category>();
      
      allProducts.forEach(product => {
        const categoryId = product.category.categoryId;
        
        if (!categoriesMap.has(categoryId)) {
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
        
        const transformedProduct = {
          productId: product.productId,
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
      setCategoriesWithProducts(categoriesWithProductsData);
      
      // Auto-expand all categories
      setExpandedCategories(new Set(categoriesWithProductsData.map(cat => cat.categoryId)));
    } catch (err: any) {
      console.error('Error fetching products for categories:', err);
      setError(t('branchCategories.messages.error.loadingProducts'));
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Navigation functions
  const proceedToProductSelection = async () => {
    if (selectedCategories.size === 0) {
      setError(t('branchCategories.error.selectCategory') || 'Please select at least one category');
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

  const handleCategorySelect = (categoryId: number) => {
    const newSelectedCategories = new Set(selectedCategories);
    
    if (newSelectedCategories.has(categoryId)) {
      newSelectedCategories.delete(categoryId);
      const categoryProducts = categoriesWithProducts.find(cat => cat.categoryId === categoryId)?.products || [];
      const newSelectedProducts = new Set(selectedProducts);
      categoryProducts.forEach(product => newSelectedProducts.delete(product.productId));
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
      categoriesWithProducts.flatMap(cat => cat.products.map(product => product.productId))
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
      
      await fetchAvailableCategories();
      
      setSuccessMessage(t('branchCategories.messages.success.categoryDeleted'));
      closeDeleteModal();
      
    } catch (err: any) {
      console.error('Error deleting branch category:', err);
      setError(t('branchCategories.messages.error.deletingCategory'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!branchId) {
      setError(t('branchCategories.error.branchIdRequired') || 'Branch ID is required');
      return;
    }

    if (selectedCategories.size === 0) {
      setError(t('branchCategories.error.selectAtLeastOne') || 'Please select at least one category');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      let createdCount = 0;
      const createdBranchCategories = new Map();
      
      // Step 1: Create branch categories and capture their IDs
      for (const categoryId of selectedCategories) {
        const category = categories.find(cat => cat.categoryId === categoryId);
        
        if (!category) {
          continue;
        }

        try {
          const categoryData = {
            categoryId: category.categoryId,
            displayName: category.categoryName,
            isActive: true,
            displayOrder: branchCategories.length + createdCount + 1
          };

          const createdBranchCategory = await branchCategoryService.createBranchCategory(categoryData);
          
          if (createdBranchCategory.id) {
            createdBranchCategories.set(categoryId, createdBranchCategory.id);
          }
          
          createdCount++;
          
        } catch (err: any) {
          console.error('Error creating branch category:', categoryId, err);
          throw new Error(t('branchCategories.error.createCategory', { name: category.categoryName }) || `Error creating category ${category.categoryName}`);
        }
      }
      
      // Step 2: Create branch products for selected products
      let createdProductsCount = 0;
      
      if (selectedProducts.size > 0) {
        for (const productId of selectedProducts) {
          let productToCreate = null;
          let categoryId = null;
          
          for (const category of categoriesWithProducts) {
            const product = category.products.find(p => p.productId === productId);
            if (product) {
              productToCreate = product;
              categoryId = category.categoryId;
              break;
            }
          }
          
          if (!productToCreate || !categoryId) {
            continue;
          }
          
          const branchCategoryId = createdBranchCategories.get(categoryId);
          
          if (!branchCategoryId) {
            continue;
          }
          
          try {
            const productData = {
              price: productToCreate.price,
              isActive: true,
              productId: productToCreate.productId,
              branchCategoryId: branchCategoryId
            };
            
            await branchProductService.createBranchProduct(productData);
            createdProductsCount++;
            
          } catch (err: any) {
            console.error('Error creating branch product:', productId, err);
          }
        }
      }
      
      const categoryText = createdCount === 1 ? 'category' : 'categories';
      const productText = createdProductsCount === 1 ? 'product' : 'products';
      
      let successMsg = `Added ${createdCount} ${categoryText} to branch`;
      
      if (createdProductsCount > 0) {
        successMsg = `Added ${createdCount} ${categoryText} and ${createdProductsCount} ${productText} to branch`;
      }
      
      setSuccessMessage(successMsg);
      
      // Reset form
      setSelectedCategories(new Set());
      setSelectedProducts(new Set());
      setCategoriesWithProducts([]);
      setCurrentStep(AdditionStep.SELECT_CATEGORIES);
      
      // Wait a bit for backend to persist the data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh both lists to ensure UI is in sync
      await fetchBranchCategories();
      await fetchAvailableCategories();
      
    } catch (err: any) {
      console.error('Error saving branch categories and products:', err);
      setError(err.message || 'Failed to add categories and products to branch');
    } finally {
      setIsSaving(false);
    }
  };

  // Add function to handle adding products to existing categories
  const handleAddProductToCategory = async (productId: number, branchCategoryId: number) => {
    try {
      const scrollPosition = window.scrollY;
      
      let productToAdd = null;
      let categoryIndex = -1;
      
      for (let i = 0; i < branchCategories.length; i++) {
        const product = branchCategories[i].products?.find(p => p.productId === productId);
        if (product) {
          productToAdd = product;
          categoryIndex = i;
          break;
        }
      }
      
      if (!productToAdd || categoryIndex === -1) {
        setError(t('branchCategories.messages.error.productNotFound'));
        return;
      }
      
      // Optimistic update
      const updatedCategories = [...branchCategories];
      const updatedProducts = updatedCategories[categoryIndex].products?.map(product => {
        if (product.productId === productId) {
          return {
            ...product,
            isSelected: true,
            branchProductId: 999999
          };
        }
        return product;
      }) || [];
      
      updatedCategories[categoryIndex] = {
        ...updatedCategories[categoryIndex],
        products: updatedProducts,
        selectedProductsCount: (updatedCategories[categoryIndex].selectedProductsCount || 0) + 1,
        unselectedProductsCount: Math.max(0, (updatedCategories[categoryIndex].unselectedProductsCount || 0) - 1)
      };
      
      setBranchCategories(updatedCategories);
      setIsLoading(true);
      
      try {
        const productData = {
          price: productToAdd.price,
          isActive: true,
          productId: productToAdd.productId,
          branchCategoryId: branchCategoryId
        };
        
        const createdBranchProduct = await branchProductService.createBranchProduct(productData);
        
        setBranchCategories(prevCategories => {
          const finalUpdatedCategories = [...prevCategories];
          const finalUpdatedProducts = finalUpdatedCategories[categoryIndex].products?.map(product => {
            if (product.productId === productId) {
              return {
                ...product,
                isSelected: true,
                branchProductId: createdBranchProduct.branchProductId || createdBranchProduct.productId
              };
            }
            return product;
          }) || [];
          
          finalUpdatedCategories[categoryIndex] = {
            ...finalUpdatedCategories[categoryIndex],
            products: finalUpdatedProducts
          };
          
          return finalUpdatedCategories;
        });
        
        setSuccessMessage(t('branchCategories.messages.success.productAdded', { name: productToAdd.name }));
        
      } catch (apiError) {
        console.error('API call failed, reverting optimistic update:', apiError);
        
        // Revert optimistic update on API failure
        setBranchCategories(prevCategories => {
          const revertedCategories = [...prevCategories];
          const revertedProducts = revertedCategories[categoryIndex].products?.map(product => {
            if (product.productId === productId) {
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
            selectedProductsCount: Math.max(0, (revertedCategories[categoryIndex].selectedProductsCount || 1) - 1),
            unselectedProductsCount: (revertedCategories[categoryIndex].unselectedProductsCount || 0) + 1
          };
          
          return revertedCategories;
        });
        
        setError(t('branchCategories.messages.error.addingProduct'));
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          window.scrollTo(0, scrollPosition);
        }, 100);
      }
      
    } catch (err: any) {
      console.error('Error adding product to category:', err);
      setError(t('branchCategories.messages.error.addingProduct'));
      setIsLoading(false);
    }
  };

  // Add function to handle removing products from categories
  const handleRemoveProductFromCategory = async (branchProductId: number, productName?: string) => {
    try {
      const scrollPosition = window.scrollY;
      
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
        setError(t('branchCategories.messages.error.productNotFound'));
        return;
      }
      
      // Optimistic update
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
      
      updatedCategories[categoryIndex] = {
        ...updatedCategories[categoryIndex],
        products: updatedProducts,
        selectedProductsCount: Math.max(0, (updatedCategories[categoryIndex].selectedProductsCount || 1) - 1),
        unselectedProductsCount: (updatedCategories[categoryIndex].unselectedProductsCount || 0) + 1
      };
      
      setBranchCategories(updatedCategories);
      setIsLoading(true);
      
      try {
        await branchProductService.deleteBranchProduct(branchProductId);
        setSuccessMessage(t('branchCategories.messages.success.productRemoved', { name: productName || productToRemove.name }));
        
      } catch (apiError) {
        console.error('API call failed, reverting optimistic update:', apiError);
        
        // Revert optimistic update on API failure
        const revertedCategories = [...branchCategories];
        const revertedProducts = revertedCategories[categoryIndex].products?.map(product => {
          if (product.productId === productToRemove.productId) {
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
        setError(t('branchCategories.messages.error.removingProduct'));
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          window.scrollTo(0, scrollPosition);
        }, 100);
      }
      
    } catch (err: any) {
      console.error('Error removing product from category:', err);
      setError(t('branchCategories.messages.error.removingProduct'));
      setIsLoading(false);
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
      setSuccessMessage(t('branchCategories.messages.success.orderSaved'));
      
    } catch (err: any) {
      console.error('Error saving category order:', err);
      setError(t('branchCategories.messages.error.savingOrder'));
    } finally {
      setIsReordering(false);
    }
  };

  // Get categories that are not already in branch
  const filteredCategories = categories.filter(category => 
    category?.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableCategoriesNotInBranch = filteredCategories.filter(category => 
    !branchCategories.some(bc => bc.categoryId === category.categoryId)
  );

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {t('branchCategories.header')}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('branchCategories.subheader', { branchId })}
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
        <CategoriesContent
          activeTab={activeTab}
          branchId={branchId}
          categories={categories}
          branchCategories={branchCategories}
          selectedCategories={selectedCategories}
          selectedProducts={selectedProducts}
          categoriesWithProducts={categoriesWithProducts}
          currentStep={currentStep}
          expandedCategories={expandedCategories}
          expandedBranchCategories={expandedBranchCategories}
          isReorderMode={isReorderMode}
          hasUnsavedChanges={hasUnsavedChanges}
          isReordering={isReordering}
          isLoading={isLoading}
          isSaving={isSaving}
          isLoadingProducts={isLoadingProducts}
          isLoadingBranchProducts={isLoadingBranchProducts}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setSelectedCategories={setSelectedCategories}
          setSelectedProducts={setSelectedProducts}
          setCurrentStep={setCurrentStep}
          setExpandedCategories={setExpandedCategories}
          setExpandedBranchCategories={setExpandedBranchCategories}
          setIsReorderMode={setIsReorderMode}
          handleShowProductDetails={handleShowProductDetails}
          onCategorySelect={handleCategorySelect}
          onProductSelect={handleProductSelect}
          onSelectAllProducts={handleSelectAllProducts}
          onClearAllProducts={handleClearAllProducts}
          onProceedToProductSelection={proceedToProductSelection}
          onProceedToReview={proceedToReview}
          onBackToCategorySelection={backToCategorySelection}
          onBackToProductSelection={backToProductSelection}
          onSave={handleSave}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onSaveOrder={handleSaveOrder}
          onAddProduct={handleAddProductToCategory}
          onRemoveProduct={handleRemoveProductFromCategory}
          onDeleteCategory={openDeleteModal}
          onRefresh={fetchAvailableCategories}
          setActiveTab={setActiveTab}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={performDelete}
          title={t('branchCategories.deleteModal.title')}
          message={t('branchCategories.deleteModal.message', { name: deleteModal.categoryName })}
          isSubmitting={isDeleting}
          itemType="category"
          itemName={deleteModal.categoryName}
        />

        {/* Product Details Modal */}
        <ProductDetailsModal
          isOpen={isProductDetailsModalOpen}
          onClose={handleCloseProductDetails}
          product={selectedProductForDetails}
        />
      </div>
    </div>
  );
};

export default BranchCategories;