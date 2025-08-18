import React from 'react';
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
  Package,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  Info
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';

// Enhanced interfaces
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

interface DetailedProduct {
  productId: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  status: boolean;
  displayOrder?: number;
  categoryId?: number;
  branchProductId?: number;
  originalProductId?: number;
  ingredients?: APIIngredient[];
  allergens?: APIAllergen[];
  orderDetails?: any;
  isSelected?: boolean;
}

interface Category {
  categoryId: number;
  categoryName: string;
  description?: string;
  status: boolean;
  displayOrder: number;
  restaurantId: number;
  products: DetailedProduct[];
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

// Step enum for the multi-step process
enum AdditionStep {
  SELECT_CATEGORIES = 'select_categories',
  SELECT_PRODUCTS = 'select_products',
  REVIEW_SELECTION = 'review_selection'
}

interface CategoriesContentProps {
  activeTab: 'add' | 'manage';
  branchId: number;
  categories: Category[];
  branchCategories: BranchCategory[];
  selectedCategories: Set<number>;
  selectedProducts: Set<number>;
  categoriesWithProducts: Category[];
  currentStep: AdditionStep;
  expandedCategories: Set<number>;
  expandedBranchCategories: Set<number>;
  isReorderMode: boolean;
  hasUnsavedChanges: boolean;
  isReordering: boolean;
  isLoading: boolean;
  isSaving: boolean;
  isLoadingProducts: boolean;
  isLoadingBranchProducts: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setSelectedCategories: (categories: Set<number>) => void;
  setSelectedProducts: (products: Set<number>) => void;
  setCurrentStep: (step: AdditionStep) => void;
  setExpandedCategories: (categories: Set<number>) => void;
  setExpandedBranchCategories: (categories: Set<number>) => void;
  setIsReorderMode: (mode: boolean) => void;
  handleShowProductDetails: (product: DetailedProduct) => void;
  onCategorySelect: (categoryId: number) => void;
  onProductSelect: (productId: number) => void;
  onSelectAllProducts: () => void;
  onClearAllProducts: () => void;
  onProceedToProductSelection: () => void;
  onProceedToReview: () => void;
  onBackToCategorySelection: () => void;
  onBackToProductSelection: () => void;
  onSave: () => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onSaveOrder: () => void;
  onAddProduct: (productId: number, branchCategoryId: number) => void;
  onRemoveProduct: (branchProductId: number, productName?: string) => void;
  onDeleteCategory: (branchCategoryId: number, categoryName: string) => void;
  onRefresh: () => void;
  setActiveTab: (tab: 'add' | 'manage') => void;
}

const CategoriesContent: React.FC<CategoriesContentProps> = ({
  activeTab,
  branchId,
  categories,
  branchCategories,
  selectedCategories,
  selectedProducts,
  categoriesWithProducts,
  currentStep,
  expandedCategories,
  expandedBranchCategories,
  isReorderMode,
  hasUnsavedChanges,
  isReordering,
  isLoading,
  isSaving,
  isLoadingProducts,
  isLoadingBranchProducts,
  searchTerm,
  setSearchTerm,
  setSelectedCategories,
  setSelectedProducts,
  setCurrentStep,
  setExpandedCategories,
  setExpandedBranchCategories,
  setIsReorderMode,
  handleShowProductDetails,
  onCategorySelect,
  onProductSelect,
  onSelectAllProducts,
  onClearAllProducts,
  onProceedToProductSelection,
  onProceedToReview,
  onBackToCategorySelection,
  onBackToProductSelection,
  onSave,
  onMoveUp,
  onMoveDown,
  onSaveOrder,
  onAddProduct,
  onRemoveProduct,
  onDeleteCategory,
  onRefresh,
  setActiveTab
}) => {
  const { t, isRTL } = useLanguage();

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
              onClick={onBackToCategorySelection}
              className={`px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
              {t('branchCategories.steps.back')}
            </button>
          )}
          {currentStep === AdditionStep.REVIEW_SELECTION && (
            <button
              onClick={onBackToProductSelection}
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

  // Enhanced Products Section for Manage Existing Tab
  const renderManageProductsSection = (branchCategory: BranchCategory) => {
    if (isReorderMode || !expandedBranchCategories.has(branchCategory.categoryId) || !branchCategory.products || branchCategory.products.length === 0) {
      return null;
    }

    return (
      <div className="border-t border-gray-200 dark:border-gray-600 p-6 bg-gray-50 dark:bg-gray-700/50">
        <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h5 className="font-medium text-gray-900 dark:text-white">
            {t('branchCategories.products.inCategory')}
          </h5>
          <div className={`flex items-center space-x-4 text-sm ${isRTL ? 'space-x-reverse' : ''}`}>
            <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-300">
                {branchCategory.selectedProductsCount || 0} {t('branchCategories.products.added')}
              </span>
            </div>
            <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-300">
                {branchCategory.unselectedProductsCount || 0} {t('branchCategories.products.available')}
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
                          {product.ingredients.length} {t('branchCategories.products.ingredients')}
                        </span>
                      )}
                      {product.allergens && product.allergens.length > 0 && (
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
                          {product.allergens.length} {t('branchCategories.products.allergens')}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Action buttons */}
                <div className="flex flex-col items-end space-y-2">
                  <div className={`flex space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                    {/* Details button */}
                    {hasDetailedInfo && (
                      <button
                        onClick={() => handleShowProductDetails(product)}
                        className="p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                        title={t('branchCategories.products.viewDetails')}
                      >
                        <Eye className="h-3 w-3" />
                      </button>
                    )}
                    
                    {/* Add/Remove button */}
                    {isSelected ? (
                      <button
                        onClick={() => onRemoveProduct(product.branchProductId || product.productId, product.name)}
                        disabled={isLoading}
                        className="p-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                        title={t('branchCategories.products.removeFromBranch')}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onAddProduct(product.productId, branchCategory.branchCategoryId)}
                        disabled={isLoading}
                        className="p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                        title={t('branchCategories.products.addToBranch')}
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
                  <span className="font-medium">{branchCategory.selectedProductsCount || 0}</span> {t('branchCategories.products.addedToBranch')}
                </span>
              </div>
              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Package className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">{branchCategory.unselectedProductsCount || 0}</span> {t('branchCategories.products.moreAvailableToAdd')}
                </span>
              </div>
              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Info className="h-4 w-4 text-blue-400 dark:text-blue-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">
                    {branchCategory.products?.filter(p => p.ingredients || p.allergens).length || 0}
                  </span> {t('branchCategories.products.withDetailedInfo')}
                </span>
              </div>
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              {t('branchCategories.manage.total')} {branchCategory.products?.length || 0} {t('branchCategories.products.products')}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
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
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('branchCategories.addCategories.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{t('branchCategories.addCategories.subtitle')}</p>
                  </div>
                  <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                    <div className="relative">
                      <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5`} />
                      <input
                        type="text"
                        placeholder={t('branchCategories.search.categories')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      />
                    </div>
                    <button
                      onClick={onRefresh}
                      disabled={isLoading}
                      className={`px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                      {t('branchCategories.actions.refresh')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Categories Grid */}
              <div className="p-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 dark:text-blue-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">{t('branchCategories.actions.loading')}</p>
                  </div>
                ) : availableCategoriesNotInBranch.length === 0 ? (
                  <div className="text-center py-12">
                    <Store className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{t('branchCategories.addCategories.noAvailable')}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{t('branchCategories.addCategories.allAdded')}</p>
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
                          onClick={() => onCategorySelect(category.categoryId)}
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
                                    {category.products?.length || 0} {t('branchCategories.products.products')}
                                  </span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  category.status 
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                }`}>
                                  {category.status ? t('branchCategories.status.active') : t('branchCategories.status.inactive')}
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
                      <span className="font-medium">{selectedCategories.size}</span> {t('branchCategories.addCategories.categoriesSelected')}
                    </div>
                    <div className={`flex space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                      <button
                        onClick={() => setSelectedCategories(new Set())}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        {t('branchCategories.addCategories.clearSelection')}
                      </button>
                      <button
                        onClick={onProceedToProductSelection}
                        className={`px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        {t('branchCategories.addCategories.nextSelectProducts')}
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
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('branchCategories.selectProducts.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{t('branchCategories.selectProducts.subtitle')}</p>
                  </div>
                  <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                    <div className="relative">
                      <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5`} />
                      <input
                        type="text"
                        placeholder={t('branchCategories.search.products')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      />
                    </div>
                    <div className={`flex space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                      <button
                        onClick={onSelectAllProducts}
                        className="px-4 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                      >
                        {t('branchCategories.selectProducts.selectAll')}
                      </button>
                      <button
                        onClick={onClearAllProducts}
                        className="px-4 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        {t('branchCategories.selectProducts.clearAll')}
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
                    <p className="text-gray-500 dark:text-gray-400">{t('branchCategories.actions.loading')}</p>
                  </div>
                ) : filteredCategoriesWithProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{t('branchCategories.selectProducts.noProducts')}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{t('branchCategories.selectProducts.noProductsInCategories')}</p>
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
                                <p className="text-gray-600 dark:text-gray-300">{category.products.length} {t('branchCategories.selectProducts.available')}</p>
                              </div>
                            </div>
                            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {category.products.filter(p => selectedProducts.has(p.productId)).length} {t('branchCategories.steps.selected')}
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
                                    onClick={() => onProductSelect(product.productId)}
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
                                            {product.status ? t('branchCategories.status.available') : t('branchCategories.status.unavailable')}
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
                    <span className="font-medium">{selectedProducts.size}</span> {t('branchCategories.selectProducts.productsSelectedFrom')}{' '}
                    <span className="font-medium">{selectedCategories.size}</span> {t('branchCategories.selectProducts.categories')}
                  </div>
                  <div className={`flex space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                    <button
                      onClick={onProceedToReview}
                      className={`px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      {t('branchCategories.selectProducts.reviewSelection')}
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
                                  : `${t('branchCategories.review.all')} ${category.products.length} ${t('branchCategories.review.productsWillBeAdded')}`
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
                      {t('branchCategories.review.readyToAdd')} {selectedCategories.size} {t('branchCategories.manage.categories')}
                      {selectedProducts.size > 0 && ` ${t('branchCategories.review.with')} ${selectedProducts.size} ${t('branchCategories.products.products')}`}
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
                        setCurrentStep(AdditionStep.SELECT_CATEGORIES);
                      }}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      {t('branchCategories.review.startOver')}
                    </button>
                    <button
                      onClick={onSave}
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
                    onClick={onSaveOrder}
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
                <p className="text-gray-500 dark:text-gray-400">{t('branchCategories.actions.loading')}</p>
              </div>
            ) : branchCategories.length === 0 ? (
              <div className="text-center py-12">
                <Store className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{t('branchCategories.manage.noCategoriesAdded')}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">{t('branchCategories.manage.noCategoriesAddedDesc')}</p>
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
                            {branchCategory.isActive ? t('branchCategories.manage.active') : t('branchCategories.manage.inactive')}
                          </span>
                          
                       {isReorderMode ? (
                              <div className={`flex space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                                <button
                                  onClick={() => onMoveUp(index)}
                                  disabled={index === 0}
                                  className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => onMoveDown(index)}
                                  disabled={index === branchCategories.length - 1}
                                  className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                                {/* Show product count warning if category has products */}
                                {(branchCategory.selectedProductsCount || 0) > 0 && (
                                  <div className={`flex items-center space-x-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg text-xs ${isRTL ? 'space-x-reverse' : ''}`}>
                                    <AlertCircle className="h-3 w-3" />
                                    <span>{branchCategory.selectedProductsCount} {t('branchCategories.products.products')}</span>
                                  </div>
                                )}
                                
                                <button
                                  onClick={() => onDeleteCategory(branchCategory.branchCategoryId, branchCategory.displayName)}
                                  disabled={(branchCategory.selectedProductsCount || 0) > 0}
                                  className={`p-2 rounded-lg transition-colors ${
                                    (branchCategory.selectedProductsCount || 0) > 0
                                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
                                      : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                                  }`}
                                  title={
                                    (branchCategory.selectedProductsCount || 0) > 0
                                      ? t('branchCategories.messages.error.cannotDeleteTooltip', { count: branchCategory.selectedProductsCount })
                                      : t('branchCategories.actions.delete')
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
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
    </>
  );
};

export default CategoriesContent;