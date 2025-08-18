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
  DollarSign,
  Info,
  Heart,
  Clock,
  Tag,
  MapPin,
  Utensils,
  ExternalLink
} from 'lucide-react';
import { branchCategoryService } from '../../../../services/Branch/BranchCategoryService';
import { ConfirmDeleteModal } from '../../../ConfirmDeleteModal';
import { branchProductService } from '../../../../services/Branch/BranchProductService';
import { Category, Product } from '../../../../types/dashboard';
import { useLanguage } from '../../../../contexts/LanguageContext';

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

interface APIBranchCategory {
  id: number;
  branchCategoryId: number;
  branchId: number;
  categoryId: number;
  displayName: string;
  displayOrder: number;
  isActive: boolean;
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

// Product Details Modal Component
const ProductDetailsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  product: DetailedProduct | null;
}> = ({ isOpen, onClose, product }) => {
  const { t, isRTL } = useLanguage();

  if (!isOpen || !product) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className={`bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-600 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-white dark:border-gray-700 shadow-md"
                />
              )}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {product.name}
                </h3>
                <div className={`flex items-center space-x-3 mt-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    ${product.price.toFixed(2)}
                  </span>
                
                  {product.isSelected && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                      Added to Branch
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-8">
         
            {/* Allergens Section */}
            {product.allergens && product.allergens.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
                <div className={`flex items-center space-x-3 mb-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Allergens
                  </h4>
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
                    {product.allergens.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {product.allergens.map((allergen) => (
                    <div 
                      key={allergen.allergenId} 
                      className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-red-200 dark:border-red-800"
                    >
                      <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                        <span className="text-2xl">{allergen.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white text-sm">
                            {allergen.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {allergen.code}
                          </div>
                          {allergen.presence && (
                            <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                              allergen.presence === 1 
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                            }`}>
                              {allergen.presence === 1 ? 'Contains' : 'May Contain'}
                            </div>
                          )}
                        </div>
                      </div>
                      {allergen.note && (
                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                          {allergen.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients Section */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                <div className={`flex items-center space-x-3 mb-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Utensils className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Ingredients
                  </h4>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                    {product.ingredients.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {product.ingredients.map((ingredient) => (
                    <div 
                      key={ingredient.id} 
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-800"
                    >
                      <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="flex-1">
                          <div className={`flex items-center space-x-3 mb-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {ingredient.ingredientName}
                            </h5>
                            {ingredient.isAllergenic && (
                              <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs font-medium">
                                Allergenic
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              ingredient.isAvailable 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            }`}>
                              {ingredient.isAvailable ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                          <div className={`flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 ${isRTL ? 'space-x-reverse' : ''}`}>
                            <span>Quantity: {ingredient.quantity} {ingredient.unit}</span>
                            <span>Ingredient ID: {ingredient.ingredientId}</span>
                          </div>
                          
                          {/* Ingredient Allergens */}
                          {ingredient.allergens && ingredient.allergens.length > 0 && (
                            <div className="mt-3">
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                Allergen Information:
                              </div>
                              <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                {ingredient.allergens.map((allergen) => (
                                  <span 
                                    key={allergen.id}
                                    className={`inline-flex items-center space-x-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs ${isRTL ? 'space-x-reverse' : ''}`}
                                  >
                                    <span>{allergen.icon}</span>
                                    <span>{allergen.name}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Details */}
            {(product.product || product.orderDetails) && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <div className={`flex items-center space-x-3 mb-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Package className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Additional Information
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.product && (
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                        Original Product
                      </h5>
                      <div className="space-y-2">
                        <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-gray-600 dark:text-gray-300">Original Price:</span>
                          <span className="font-medium text-gray-900 dark:text-white">${product.product.price.toFixed(2)}</span>
                        </div>
                        <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-gray-600 dark:text-gray-300">Original Status:</span>
                          <span className={`font-medium ${product.product.status ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {product.product.status ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-gray-600 dark:text-gray-300">Original Display Order:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{product.product.displayOrder}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {product.orderDetails && (
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                        Order Details
                      </h5>
                      <pre className="text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded-lg border">
                        {JSON.stringify(product.orderDetails, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Last Updated: {new Date().toLocaleDateString()}
            </div>
            <button
              onClick={onClose}
              className={`px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Check className="h-4 w-4" />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  
  // Product details modal state
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<DetailedProduct | null>(null);
  const [isProductDetailsModalOpen, setIsProductDetailsModalOpen] = useState(false);
  
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
      setError(t('branchCategories.error.loadCategories') || 'Error loading categories');
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
      setError(t('branchCategories.error.loadBranchCategories') || 'Error loading branch categories');
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

          console.log(`Selected products for category ${branchCategory.categoryId}:`, selectedProducts.length);
          console.log("selectedProducts",selectedProducts)
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
          console.log(`Fetching available products for category ${branchCategory.categoryId}...`);
          const allAvailableProducts = await branchCategoryService.getAvailableProductsForBranch({
            categoryId: branchCategory.categoryId,
            onlyActive: true,
            includes: 'category,ingredients,allergens,addons'
          });

          console.log(`Available products for category ${branchCategory.categoryId}:`, allAvailableProducts.length);

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
            // Add any additional product details if available
            originalProductId: product.productId
          }));

          // Filter out products that are already selected (to get UNSELECTED products)
          const selectedProductIds = new Set(transformedSelectedProducts.map(p => p.productId));
          console.log(`Selected product IDs for category ${branchCategory.categoryId}:`, Array.from(selectedProductIds));
          
          const unselectedProducts = transformedAvailableProducts.filter(product => {
            const isNotSelected = !selectedProductIds.has(product.productId);
            if (!isNotSelected) {
              console.log(`Product ${product.name} (ID: ${product.productId}) is already selected, filtering out`);
            }
            return isNotSelected;
          });

          console.log(`Unselected products for category ${branchCategory.categoryId}:`, unselectedProducts.length);

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

          console.log(`Final products for category ${branchCategory.categoryId}:`, {
            selectedFromBranch: transformedSelectedProducts.length,
            unselectedAvailable: unselectedProducts.length,
            total: allProducts.length,
            selectedWithDetails: transformedSelectedProducts.filter(p => p.ingredients || p.allergens).length
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

    console.log('=== FINAL CATEGORIES WITH DETAILED PRODUCTS ===');
    categoriesWithProducts.forEach(cat => {
      const selectedWithDetails = cat.products?.filter(p => p.isSelected && (p.ingredients || p.allergens)).length || 0;
      console.log(`${cat.displayName}: ${cat.selectedProductsCount} selected (${selectedWithDetails} with details), ${cat.unselectedProductsCount} available`);
    });

    setBranchCategories(categoriesWithProducts);
    setOriginalBranchCategories([...categoriesWithProducts]);
  } catch (err: any) {
    console.error('Error fetching branch categories with detailed products:', err);
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
      console.log('Grouped categories with products:', categoriesWithProductsData);
      setCategoriesWithProducts(categoriesWithProductsData);
      
      // Auto-expand all categories
      setExpandedCategories(new Set(categoriesWithProductsData.map(cat => cat.categoryId)));
    } catch (err: any) {
      console.error('Error fetching products for categories:', err);
      setError(t('branchCategories.error.loadProducts') || 'Error loading products');
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
      
      // Refresh available categories so the deleted category appears in "Add New"
      await fetchAvailableCategories();
      
      setSuccessMessage(t('branchCategories.success.categoryRemoved', { name: deleteModal.categoryName }) || `Category ${deleteModal.categoryName} removed successfully`);
      closeDeleteModal();
      
    } catch (err: any) {
      console.error('Error deleting branch category:', err);
      
      if (err.status === 404) {
        setError(t('branchCategories.error.categoryNotFound', { name: deleteModal.categoryName }) || `Category ${deleteModal.categoryName} not found`);
        // Refresh both lists if category was already deleted
        await fetchBranchCategories();
        await fetchAvailableCategories();
      } else if (err.status === 403) {
        setError(t('branchCategories.error.noPermission', { name: deleteModal.categoryName }) || `No permission to delete ${deleteModal.categoryName}`);
      } else if (err.status === 409) {
        setError(t('branchCategories.error.categoryInUse', { name: deleteModal.categoryName }) || `Category ${deleteModal.categoryName} is in use`);
      } else {
        setError(t('branchCategories.error.deleteCategory', { name: deleteModal.categoryName }) || `Error deleting category ${deleteModal.categoryName}`);
      }
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
        throw new Error(t('branchCategories.error.createCategory', { name: category.categoryName }) || `Error creating category ${category.categoryName}`);
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
          const product = category.products.find(p => p.productId === productId);
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
            productId: productToCreate.productId, // This is the original productId from the API
            branchCategoryId: branchCategoryId
          };
          
          console.log('Creating branch product with data:', productData);
          const createdBranchProduct = await branchProductService.createBranchProduct(productData);
          console.log('Created branch product response:', createdBranchProduct);
          
          createdProductsCount++;
          
        } catch (err: any) {
          console.error('Error creating branch product:', productId, err);
          console.error('Product data that failed:', {
            productId: productToCreate.productId,
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
    const categoryText = createdCount === 1 ? 'category' : 'categories';
    const productText = createdProductsCount === 1 ? 'product' : 'products';
    
    let successMsg = `Added ${createdCount} ${categoryText} to branch ${branchId}`;
    
    if (createdProductsCount > 0) {
      successMsg = `Added ${createdCount} ${categoryText} and ${createdProductsCount} ${productText} to branch`;
    }
    
    // Add warning if some products failed
    if (selectedProducts.size > 0 && createdProductsCount < selectedProducts.size) {
      const failedCount = selectedProducts.size - createdProductsCount;
      successMsg += ` (${failedCount} products failed to add)`;
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

  // Add function to handle adding products to existing categories
const handleAddProductToCategory = async (productId: number, branchCategoryId: number) => {
  try {
    // Save scroll position
    const scrollPosition = window.scrollY;
    
    // Find the product details
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
      setError(t('branchCategories.error.productNotFound') || 'Product not found');
      return;
    }
    
    // Optimistic update: Update UI immediately
    const updatedCategories = [...branchCategories];
    const updatedProducts = updatedCategories[categoryIndex].products?.map(product => {
      if (product.productId === productId) {
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
        productId: productToAdd.productId,
        branchCategoryId: branchCategoryId
      };
      
      // Make API call
      const createdBranchProduct = await branchProductService.createBranchProduct(productData);
      
      // Update with real data from API
      const finalUpdatedCategories = [...branchCategories];
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
      
      setBranchCategories(finalUpdatedCategories);
      setSuccessMessage(`Product ${productToAdd.name} added successfully`);
      
    } catch (apiError) {
      console.error('API call failed, reverting optimistic update:', apiError);
      
      // Revert optimistic update on API failure
      const revertedCategories = [...branchCategories];
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
        selectedProductsCount: (revertedCategories[categoryIndex].selectedProductsCount || 1) - 1,
        unselectedProductsCount: (revertedCategories[categoryIndex].unselectedProductsCount || 0) + 1
      };
      
      setBranchCategories(revertedCategories);
      setError('Error adding product');
    } finally {
      setIsLoading(false);
      
      // Restore scroll position after a brief delay
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 100);
    }
    
  } catch (err: any) {
    console.error('Error adding product to category:', err);
    setError('Error adding product');
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
      setError('Product not found');
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
      
      setSuccessMessage(`Product ${productName || productToRemove.name} removed successfully`);
      
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
      setError('Error removing product');
    } finally {
      setIsLoading(false);
      
      // Restore scroll position after a brief delay
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 100);
    }
    
  } catch (err: any) {
    console.error('Error removing product from category:', err);
    setError('Error removing product');
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
      setSuccessMessage('Category order saved successfully');
      
    } catch (err: any) {
      console.error('Error saving category order:', err);
      setError('Error saving category order');
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
      selectedProducts: category.products.filter(product => selectedProducts.has(product.productId))
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
            Products in Category
          </h5>
          <div className={`flex items-center space-x-4 text-sm ${isRTL ? 'space-x-reverse' : ''}`}>
            <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-300">
                {branchCategory.selectedProductsCount || 0} Added
              </span>
            </div>
            <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-300">
                {branchCategory.unselectedProductsCount || 0} Available
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branchCategory.products.map((product) => {
            const isSelected = product.isSelected;
            const hasDetailedInfo = product.ingredients || product.allergens;
            
            return (
              <div 
                key={product.productId} 
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

                {/* Detailed info indicator */}
                {hasDetailedInfo && (
                  <div className={`absolute -top-2 ${isRTL ? '-right-2' : '-left-2'} w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center`}>
                    <Info className="h-3 w-3 text-white" />
                  </div>
                )}

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
                  {/* Quick info about ingredients/allergens */}
                  {hasDetailedInfo && (
                    <div className={`flex items-center space-x-2 mt-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                      {product.ingredients && product.ingredients.length > 0 && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                          {product.ingredients.length} ingredients
                        </span>
                      )}
                      {product.allergens && product.allergens.length > 0 && (
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
                          {product.allergens.length} allergens
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Status badge and actions */}
                <div className="flex flex-col items-end space-y-2">
              
                  
                  {/* Action buttons */}
                  <div className={`flex space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                    {/* Details button - always show if we have detailed info */}
                    {hasDetailedInfo && (
                      <button
                        onClick={() => handleShowProductDetails(product)}
                        className="p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-3 w-3" />
                      </button>
                    )}
                    
                    {/* Add/Remove button */}
                    {isSelected ? (
                      <button
                        onClick={() => handleRemoveProductFromCategory(product.branchProductId || product.productId, product.name)}
                        disabled={isLoading}
                        className="p-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                        title="Remove from Branch"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddProductToCategory(product.productId, branchCategory.branchCategoryId)}
                        disabled={isLoading}
                        className="p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                        title="Add to Branch"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    )}
                  </div>
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
                  <span className="font-medium">{branchCategory.selectedProductsCount || 0}</span> products added to branch
                </span>
              </div>
              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Package className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">{branchCategory.unselectedProductsCount || 0}</span> more available to add
                </span>
              </div>
              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Info className="h-4 w-4 text-blue-400 dark:text-blue-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">
                    {branchCategory.products?.filter(p => p.ingredients || p.allergens).length || 0}
                  </span> with detailed info
                </span>
              </div>
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              Total {branchCategory.products?.length || 0} products
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Step Progress Component
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
              <div className="font-medium">Choose Categories</div>
              <div className="text-sm opacity-70">{selectedCategories.size} selected</div>
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
              <div className="font-medium">Select Products</div>
              <div className="text-sm opacity-70">{selectedProducts.size} selected</div>
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
              <div className="font-medium">Review & Add</div>
              <div className="text-sm opacity-70">Final step</div>
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
              Back
            </button>
          )}
          {currentStep === AdditionStep.REVIEW_SELECTION && (
            <button
              onClick={backToProductSelection}
              className={`px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
              Back
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
                Branch Categories Management
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Manage categories and products for Branch {branchId}
              </p>
            </div>
            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 px-4 py-2">
                <div className={`flex items-center space-x-2 text-sm ${isRTL ? 'space-x-reverse' : ''}`}>
                  <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-300">Last Updated</span>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Available Categories</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ready to add</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                <Store className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Active Categories</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{branchCategories.length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Currently in branch</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Selected Categories</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{selectedCategories.size}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">To be added</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                <Plus className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Selected Products</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{selectedProducts.size}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">From categories</p>
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
                <span>Add New</span>
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
                <span>Manage Existing</span>
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
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Choose Categories</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">Select categories to add to your branch</p>
                    </div>
                    <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                      <div className="relative">
                        <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5`} />
                        <input
                          type="text"
                          placeholder="Search categories..."
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
                        Refresh
                      </button>
                    </div>
                  </div>
                </div>

                {/* Categories Grid */}
                <div className="p-6">
                  {isLoading ? (
                    <div className="text-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">Loading categories...</p>
                    </div>
                  ) : availableCategoriesNotInBranch.length === 0 ? (
                    <div className="text-center py-12">
                      <Store className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No categories available</h3>
                      <p className="text-gray-500 dark:text-gray-400">All available categories have been added to this branch</p>
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
                                      {category.products?.length || 0} products
                                    </span>
                                  </div>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    category.status 
                                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                  }`}>
                                    {category.status ? 'Active' : 'Inactive'}
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
                        <span className="font-medium">{selectedCategories.size}</span> categories selected
                      </div>
                      <div className={`flex space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                        <button
                          onClick={() => setSelectedCategories(new Set())}
                          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                          Clear Selection
                        </button>
                        <button
                          onClick={proceedToProductSelection}
                          className={`px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                          Next: Select Products
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
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Select Products</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">Choose products from selected categories</p>
                    </div>
                    <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                      <div className="relative">
                        <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5`} />
                        <input
                          type="text"
                          placeholder="Search products..."
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
                          Select All
                        </button>
                        <button
                          onClick={handleClearAllProducts}
                          className="px-4 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        >
                          Clear All
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
                      <p className="text-gray-500 dark:text-gray-400">Loading products...</p>
                    </div>
                  ) : filteredCategoriesWithProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
                      <p className="text-gray-500 dark:text-gray-400">Selected categories don't have any products</p>
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
                                  <p className="text-gray-600 dark:text-gray-300">{category.products.length} available</p>
                                </div>
                              </div>
                              <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {category.products.filter(p => selectedProducts.has(p.productId)).length} selected
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
                                  const isSelected = selectedProducts.has(product.productId);
                                  
                                  return (
                                    <div
                                      key={product.productId}
                                      className={`relative rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
                                        isSelected 
                                          ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20' 
                                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
                                      }`}
                                      onClick={() => handleProductSelect(product.productId)}
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
                                              {product.status ? 'Available' : 'Unavailable'}
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
                      <span className="font-medium">{selectedProducts.size}</span> products selected from{' '}
                      <span className="font-medium">{selectedCategories.size}</span> categories
                    </div>
                    <div className={`flex space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                      <button
                        onClick={proceedToReview}
                        className={`px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        Review Selection
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
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Review & Add</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">Review your selection before adding to branch</p>
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
                                    ? `${category.selectedProducts.length} of ${category.products.length} products selected`
                                    : `All ${category.products.length} products will be added`
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
                              <div className="text-sm text-gray-500 dark:text-gray-400">Total value</div>
                            </div>
                          </div>
                        </div>

                        {/* Selected Products */}
                        {category.selectedProducts.length > 0 && (
                          <div className="p-6">
                            <h5 className="font-medium text-gray-900 dark:text-white mb-4">Selected Products</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {category.selectedProducts.map((product) => (
                                <div key={product.productId} className={`flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 ${isRTL ? 'space-x-reverse' : ''}`}>
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
                        Ready to add {selectedCategories.size} categories
                        {selectedProducts.size > 0 && ` with ${selectedProducts.size} products`}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Available in Branch {branchId}
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
                        Start Over
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
                        {isSaving ? 'Adding...' : 'Add to Branch'}
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
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Existing Categories</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">Manage categories and products in your branch</p>
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
                      {isReordering ? 'Saving...' : 'Save Order'}
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
                    {isReorderMode ? 'Exit Reorder' : 'Reorder'}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {isLoadingBranchProducts ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Loading categories and products...</p>
                </div>
              ) : branchCategories.length === 0 ? (
                <div className="text-center py-12">
                  <Store className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No categories added</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">No categories have been added to this branch yet</p>
                  <button
                    onClick={() => setActiveTab('add')}
                    className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    Add Categories
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
                              <p className="text-gray-600 dark:text-gray-300">Original: {branchCategory.category.categoryName}</p>
                              <div className={`flex items-center space-x-4 mt-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-medium text-green-600 dark:text-green-400">
                                    {branchCategory.selectedProductsCount || 0}
                                  </span> added
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-medium text-blue-600 dark:text-blue-400">
                                    {branchCategory.unselectedProductsCount || 0}
                                  </span> available
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Total {branchCategory.products?.length || 0}
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
                              {branchCategory.isActive ? 'Active' : 'Inactive'}
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
                                title="Delete Category"
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
          title="Delete Category"
          message={`Are you sure you want to delete the category "${deleteModal.categoryName}"? This action cannot be undone.`}
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