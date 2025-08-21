import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Store, 
  Plus,
  AlertCircle,
  CheckCircle,
  Calendar,
  Package,
  Edit3,
  Save,
  DollarSign
} from 'lucide-react';
import { branchCategoryService } from '../../../../services/Branch/BranchCategoryService';
import { ConfirmDeleteModal } from '../../../ConfirmDeleteModal';
import { branchProductService } from '../../../../services/Branch/BranchProductService';
import { Category, Product } from '../../../../types/dashboard';
import { useLanguage } from '../../../../contexts/LanguageContext';
import ProductDetailsModal from './ProductDetailsModal';
import CategoriesContent from './CategoriesContent';

// Enhanced interfaces for detailed product information
import type { APIIngredient, APIAllergen } from '../../../../types/dashboard';

interface APIProduct {
  productId: number;
  name: string;
  price: number;
  imageUrl?: string;
  status: boolean;
  displayOrder: number;
}

export interface DetailedProduct extends Product {
  branchProductId?: number;
  originalProductId?: number;
  product?: APIProduct;
  branchCategory?: Category;
  ingredients?: APIIngredient[];
  allergens?: APIAllergen[];
  orderDetails?: any;
  isSelected?: boolean;
}

export interface BranchCategory {
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

enum AdditionStep {
  SELECT_CATEGORIES = 'select_categories',
  SELECT_PRODUCTS = 'select_products',
  REVIEW_SELECTION = 'review_selection'
}

interface EditedProductPrice {
  productId: number;
  originalPrice: number;
  newPrice: number;
}

interface EditedCategoryName {
  categoryId: number;
  originalName: string;
  newName: string;
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
  
  // New state for tracking edited values
  const [editedProductPrices, setEditedProductPrices] = useState<Map<number, EditedProductPrice>>(new Map());
  const [editedCategoryNames, setEditedCategoryNames] = useState<Map<number, EditedCategoryName>>(new Map());
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  
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

  // Price editing functions
  const handleProductPriceEdit = (productId: number, originalPrice: number) => {
    setEditingProductId(productId);
    
    const newEditedPrices = new Map(editedProductPrices);
    
    // For existing branch products, use the current branch product price as starting point
    let currentPrice = originalPrice;
    if (activeTab === 'manage') {
      for (const branchCategory of branchCategories) {
        const product = branchCategory.products?.find(p => p.productId === productId && p.isSelected);
        if (product) {
          currentPrice = product.price;
          break;
        }
      }
    }
    
    
    newEditedPrices.set(productId, {
      productId,
      originalPrice,
      newPrice: currentPrice
    });
    setEditedProductPrices(newEditedPrices);
  };

  const handleProductPriceChange = (productId: number, newPrice: string) => {
    const priceValue = parseFloat(newPrice) || 0;
    const newEditedPrices = new Map(editedProductPrices);
    const existing = newEditedPrices.get(productId);
    if (existing) {
      newEditedPrices.set(productId, {
        ...existing,
        newPrice: priceValue
      });
      setEditedProductPrices(newEditedPrices);
    } else {
      console.warn('No existing edit state found for product:', productId);
    }
  };

  const handleProductPriceSave = async (productId: number) => {
    if (activeTab === 'manage') {
      // For manage tab: save immediately to API
      const editedPrice = editedProductPrices.get(productId);
      if (editedPrice && Math.abs(editedPrice.newPrice - editedPrice.originalPrice) > 0.001) {
        await saveBranchProductPrice(productId, editedPrice.newPrice);
      }
    }
    setEditingProductId(null);
    // For add tab: the edited price is already saved in state, will be used when saving the final form
  };

  const handleProductPriceCancel = (productId: number) => {
    setEditingProductId(null);
    const newEditedPrices = new Map(editedProductPrices);
    const existing = newEditedPrices.get(productId);
    if (existing) {
      newEditedPrices.set(productId, {
        ...existing,
        newPrice: existing.originalPrice
      });
      setEditedProductPrices(newEditedPrices);
    }
  };

  // Category name editing functions
  const handleCategoryNameEdit = (categoryId: number, originalName: string) => {
    setEditingCategoryId(categoryId);
    
    const newEditedNames = new Map(editedCategoryNames);
    
    // For existing branch categories, use the current display name as the starting point
    const currentName = activeTab === 'manage' 
      ? branchCategories.find(bc => bc.categoryId === categoryId)?.displayName || originalName
      : originalName;
    
    
    newEditedNames.set(categoryId, {
      categoryId,
      originalName,
      newName: currentName
    });
    setEditedCategoryNames(newEditedNames);
  };

  const handleCategoryNameChange = (categoryId: number, newName: string) => {

    // Create a new Map to ensure immutability
    const newEditedNames = new Map(editedCategoryNames);

    // Get the existing entry or create a new one
    const existing = newEditedNames.get(categoryId) || {
      categoryId,
      originalName: categories.find(cat => cat.categoryId === categoryId)?.categoryName || '',
      newName: '',
    };

    // Update the Map with the new entry
    newEditedNames.set(categoryId, {
      ...existing,
      newName: newName.trim(),
    });

    // Update state and ensure the change is applied
    setEditedCategoryNames(newEditedNames);

 
  };

 const handleCategoryNameSave = async (categoryId: number, newName?: string) => {

  // Use functional state update to get the most current state
  let nameToSave: string | undefined;
  let originalName: string = '';

  setEditedCategoryNames((currentEditedNames) => {
    const editedName = currentEditedNames.get(categoryId);
    nameToSave = newName?.trim() || editedName?.newName?.trim();
    originalName = editedName?.originalName || categories.find(cat => cat.categoryId === categoryId)?.categoryName || '';
    

    
    // Return the same state (we're just reading it)
    return currentEditedNames;
  });

  // Add a small delay to ensure state has been read
  await new Promise(resolve => setTimeout(resolve, 0));

  // Validate the name to save
  if (!nameToSave) {
    setEditingCategoryId(null);
    return;
  }

  // Check if the name has changed
  if (nameToSave === originalName) {
    console.warn('No changes to save:', { categoryId, nameToSave, originalName });
    setEditingCategoryId(null);
    return;
  }

  try {
    await saveBranchCategoryName(categoryId, nameToSave);

    setEditedCategoryNames((prev) => {
      const newMap = new Map(prev);
      newMap.set(categoryId, {
        categoryId,
        originalName: nameToSave ?? '', 
        newName: nameToSave ?? '',
      });
      return newMap;
    });

    setCategories((prev) =>
      prev.map((cat) =>
        cat.categoryId === categoryId
          ? { ...cat, categoryName: nameToSave ?? '' }
          : cat
      )
    );
  } catch (error) {
    console.error('Failed to save category name:', error);
   
    return; 
  }

  setEditingCategoryId(null);
};
  
  const handleCategoryNameCancel = (categoryId: number) => {
    setEditingCategoryId(null);
    const newEditedNames = new Map(editedCategoryNames);
    const existing = newEditedNames.get(categoryId);
    if (existing) {
      newEditedNames.set(categoryId, {
        ...existing,
        newName: existing.originalName
      });
      setEditedCategoryNames(newEditedNames);
    }
  };

  // Helper function to get edited price or original price
  const getProductPrice = (productId: number, originalPrice: number): number => {
    const editedPrice = editedProductPrices.get(productId);
    if (editedPrice) {
      return editedPrice.newPrice;
    }
    
    // For existing branch products in manage tab, use the current price
    if (activeTab === 'manage') {
      for (const branchCategory of branchCategories) {
        const product = branchCategory.products?.find(p => p.productId === productId && p.isSelected);
        if (product) {
          return product.price;
        }
      }
    }
    
    return originalPrice;
  };

  // Helper function to get edited category name or original name
  const getCategoryName = (categoryId: number, originalName: string): string => {
    const editedName = editedCategoryNames.get(categoryId);
    if (editedName) {
      return editedName.newName;
    }
    
    // For existing branch categories in manage tab, use the current display name
    if (activeTab === 'manage') {
      const branchCategory = branchCategories.find(bc => bc.categoryId === categoryId);
      return branchCategory?.displayName || originalName;
    }
    
    return originalName;
  };

  // Save functions for existing branch items
 const saveBranchCategoryName = async (categoryId: number, newName: string) => {
  try {
    // Find the branch category
    const branchCategory = branchCategories.find(bc => bc.categoryId === categoryId);
    if (!branchCategory) {
      setError('Branch category not found');
      return;
    }

    setIsLoading(true);
    
    // Update the branch category name using the branchCategoryId (not categoryId)
    await branchCategoryService.updateBranchCategory( {
      displayName: newName,
       branchCategoryId :branchCategory.branchCategoryId,
    });

    // Update local state
    setBranchCategories(prev => 
      prev.map(bc => 
        bc.categoryId === categoryId 
          ? { ...bc, displayName: newName }
          : bc
      )
    );

    setSuccessMessage(`Category name updated to "${newName}"`);
    
    // Clear the edited state
    const newEditedNames = new Map(editedCategoryNames);
    newEditedNames.delete(categoryId);
    setEditedCategoryNames(newEditedNames);

  } catch (err: any) {
    console.error('Error updating category name:', err);
    setError('Failed to update category name');
  } finally {
    setIsLoading(false);
  }
};


  const saveBranchProductPrice = async (productId: number, newPrice: number) => {
    try {
      // Find the branch product and its associated data
      let branchProductId: number | null = null;
      let categoryIndex = -1;
      let isActive: boolean | undefined = undefined;
      let displayOrder: number | undefined = undefined;
      let branchCategoryId: number | undefined = undefined;

      for (let i = 0; i < branchCategories.length; i++) {
        const product = branchCategories[i].products?.find(p => p.productId === productId && p.isSelected);
        if (product && product.branchProductId) {
          branchProductId = product.branchProductId;
          categoryIndex = i;
          isActive = product.status; // Assuming `status` represents `isActive`
          displayOrder = product.displayOrder; // Assuming `displayOrder` is available in product
          branchCategoryId = branchCategories[i].branchCategoryId; // Get from branch category
          break;
        }
      }

      if (!branchProductId || branchCategoryId === undefined) {
        setError('Branch product or category not found');
        return;
      }

      setIsLoading(true);

      // Prepare the payload with all required fields
      const productData = {
        branchProductId: branchProductId,
        price: newPrice,
        isActive: isActive ?? true, // Default to true if not found
        displayOrder: displayOrder ?? 0, // Default to 0 if not found
        branchCategoryId: branchCategoryId, // Required field
      };

      // Update the branch product price with all fields
      await branchProductService.updateBranchProduct(branchProductId, productData);

      // Update local state
      setBranchCategories(prev => {
        const updated = [...prev];
        if (categoryIndex >= 0 && updated[categoryIndex].products) {
          updated[categoryIndex] = {
            ...updated[categoryIndex],
            products: updated[categoryIndex].products!.map(product =>
              product.productId === productId
                ? { ...product, price: newPrice }
                : product
            ),
          };
        }
        return updated;
      });

      setSuccessMessage(`Product price updated to $${newPrice.toFixed(2)}`);

      // Clear the edited state
      const newEditedPrices = new Map(editedProductPrices);
      newEditedPrices.delete(productId);
      setEditedProductPrices(newEditedPrices);
    } catch (err: any) {
      console.error('Error updating product price:', err);
      setError('Failed to update product price');
    } finally {
      setIsLoading(false);
    }
  };

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
                branchProductId: branchProduct.branchProductId, 
                originalProductId: branchProduct.productId || branchProduct.productId,
                name: branchProduct.name,
                description: branchProduct?.description,
                price: branchProduct.price, 
                imageUrl: branchProduct?.imageUrl,
                status: branchProduct.status,
                displayOrder: branchProduct.displayOrder,
                categoryId: branchCategory.categoryId,
                isSelected: true,
                allergens: branchProduct.allergens
                  ? branchProduct.allergens.map((a: any, idx: number) => ({
                      id: a.id ?? a.allergenId ?? idx + 1,
                      allergenId: a.allergenId ?? idx + 1,
                      allergenCode: a.code ?? '',
                      code: typeof a.code === 'string' ? a.code : a.code ?? '',
                      name: a.name ?? '',
                      icon: a.icon ?? '',
                      note: a.note ?? '',
                      description: a.description ?? null,
                      productCount: a.productCount ?? 0,
                      containsAllergen: a.containsAllergen ?? false,
                      presence: a.presence ?? '',
                    }))
                  : [],
                ingredients: branchProduct.ingredients
                  ? branchProduct.ingredients.map((i: any, idx: number) => ({
                      id: i.id ?? idx + 1,
                      ingredientId: i.ingredientId ?? 0,
                      name: i.ingredientName ?? '',
                      ingredientName: i.ingredientName ?? '',
                      productId: i.productId ?? branchProduct.productId,
                      quantity: i.quantity ?? 0,
                      unit: i.unit ?? '',
                      isAllergenic: i.isAllergenic ?? false,
                      isAvailable: i.isAvailable ?? true,
                      allergenIds: i.allergenIds ?? [],
                      allergens: i.allergens
                        ? i.allergens.map((a: any, aidx: number) => ({
                            id: a.id ?? a.allergenId ?? aidx + 1,
                            allergenId: a.allergenId ?? aidx + 1,
                            allergenCode: a.code ?? '',
                            code: typeof a.code === 'string' ? a.code : a.code ?? '',
                            name: a.name ?? '',
                            icon: a.icon ?? '',
                            note: a.note ?? '',
                            description: a.description ?? null,
                            productCount: a.productCount ?? 0,
                            containsAllergen: a.containsAllergen ?? false,
                            presence: a.presence ?? '',
                          }))
                        : [],
                      restaurantId: i.restaurantId ?? 0,
                      products: i.products ?? [],
                      productIngredients: i.productIngredients ?? [],
                    }))
                  : [],
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
              description: product.description,
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
    // Reset edited values when going back
    setEditedProductPrices(new Map());
    setEditedCategoryNames(new Map());
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
      // Remove edited price when deselecting product
      const newEditedPrices = new Map(editedProductPrices);
      newEditedPrices.delete(productId);
      setEditedProductPrices(newEditedPrices);
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
    // Clear all edited prices when clearing selection
    setEditedProductPrices(new Map());
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
      
      // Step 1: Create branch categories with edited names and capture their IDs
      for (const categoryId of selectedCategories) {
        const category = categories.find(cat => cat.categoryId === categoryId);
        
        if (!category) {
          continue;
        }

        try {
          const editedName = getCategoryName(categoryId, category.categoryName);
          const categoryData = {
            categoryId: category.categoryId,
            displayName: editedName, // Use edited name if available
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
      
      // Step 2: Create branch products with edited prices for selected products
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
            const editedPrice = getProductPrice(productId, productToCreate.price);
            const productData = {
              price: editedPrice, // Use edited price if available
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
      
      // Reset form and edited values
      setSelectedCategories(new Set());
      setSelectedProducts(new Set());
      setCategoriesWithProducts([]);
      setEditedProductPrices(new Map());
      setEditedCategoryNames(new Map());
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



  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
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
          setEditingProductId={setEditingProductId}
          setEditingCategoryId={setEditingCategoryId}
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
          // New props for editing functionality
          editedProductPrices={editedProductPrices}
          editedCategoryNames={editedCategoryNames}
          editingProductId={editingProductId}
          editingCategoryId={editingCategoryId}
          onProductPriceEdit={handleProductPriceEdit}
          onProductPriceChange={handleProductPriceChange}
          onProductPriceSave={handleProductPriceSave}
          onProductPriceCancel={handleProductPriceCancel}
          onCategoryNameEdit={handleCategoryNameEdit}
          onCategoryNameChange={handleCategoryNameChange}
          onCategoryNameSave={handleCategoryNameSave}
          onCategoryNameCancel={handleCategoryNameCancel}
          getProductPrice={getProductPrice}
          getCategoryName={getCategoryName}
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