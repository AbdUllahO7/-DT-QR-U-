import React, { useState } from 'react';
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
  Edit3,
  Puzzle,
  Sparkles,
  Grid,
  List,
  Power,
  ShoppingBag,
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useCurrency } from '../../../../hooks/useCurrency';
import { AdditionStep, BranchCategory, CategoriesContentProps } from '../../../../types/BranchManagement/type';
import { useNavigate } from 'react-router-dom';


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
  setActiveTab,
  editedProductPrices,
  editedCategoryNames,
  editingProductId,
  editingCategoryId,
  onProductPriceEdit,
  onProductPriceChange,
  onProductPriceSave,
  onProductPriceCancel,
  onCategoryNameEdit,
  onCategoryNameChange,
  onCategoryNameSave,
  onCategoryNameCancel,
  getProductPrice,
  getCategoryName,
  handleShowProductAddons,
  isCategoryActive,
  handleShowProductExtras,
  onToggleProductStatus,
  onToggleProductAvailability,
}) => {
  const { t, isRTL } = useLanguage();
  const currency = useCurrency();
  const navigate = useNavigate()
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
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

  // Category name editing functions
  const startEditingCategoryName = (categoryId: number, currentName: string) => {
    const displayName = getCategoryName(categoryId, currentName); // Use current display name
    setEditingCategoryName(displayName);
    onCategoryNameEdit(categoryId, currentName);
  };

  const saveCategoryName = (categoryId: number) => {
    if (editingCategoryName.trim()) {
      onCategoryNameChange(categoryId, editingCategoryName);
      onCategoryNameSave(categoryId);
}
    setEditingCategoryName('');
  };

  const cancelCategoryNameEdit = (categoryId: number) => {
    onCategoryNameCancel(categoryId);
    setEditingCategoryName('');
  };

  // Filter functions
  const filteredCategories = categories.filter(category => 
    category?.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category?.description?.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Price editing component
  const PriceEditor: React.FC<{
    productId: number;
    originalPrice: number;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onChange: (value: string) => void;
    currentPrice: number;
    showEditButton?: boolean;
  }> = ({ originalPrice, isEditing, onEdit, onSave, onCancel, onChange, currentPrice, showEditButton = true }) => {
    const hasChanged = Math.abs(currentPrice - originalPrice) > 0.001;
    
    if (isEditing) {
      return (
        <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
          <div className="relative">
            <span className={`absolute ${isRTL ? 'right-2' : 'left-2'} top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400`}>{currency.symbol}</span>
            <input
              title='number'
              type="number"
              step="1"
              min="0"
              value={currentPrice}
              onChange={(e) => onChange(e.target.value)}
              className={`${isRTL ? 'pr-6 pl-2' : 'pl-6 pr-2'} py-1 w-20 text-sm border border-blue-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
              autoFocus
              dir="ltr"
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSave();
                if (e.key === 'Escape') onCancel();
              }}
            />
          </div>
          <button
            onClick={onSave}
            className="p-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
          >
            <Check className="h-3 w-3" />
          </button>
          <button
            onClick={onCancel}
            className="p-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      );
    }

    return (
      <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
        <span className={`font-bold ${hasChanged ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
          {currency.symbol}{currentPrice.toFixed(2)}
        </span>
        {hasChanged && (
          <span className="text-xs text-gray-500 line-through">
            {currency.symbol}{originalPrice.toFixed(2)}
          </span>
        )}
        {showEditButton && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-xs font-medium"
            title="Edit price"
          >
            <Edit3 className="h-3 w-3" />
            <span>{t('common.edit') || 'Edit'}</span>
          </button>
        )}
      </div>
    );
  };

  const CategoryNameDisplay: React.FC<{
    categoryId: number;
    originalName: string;
    currentDisplayName: string;
    showEditButton?: boolean;
    isActive?: boolean;
  }> = ({ categoryId, originalName, showEditButton = true, isActive = true }) => {
    const isCurrentlyEditing = editingCategoryId === categoryId;
    // Use originalName (category.categoryName) instead of currentDisplayName (displayName)
    const displayText = originalName;

    if (isCurrentlyEditing) {
      return (
        <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
          <input
            title="editingCategoryName"
            type="text"
            value={editingCategoryName}
            onChange={(e) => setEditingCategoryName(e.target.value)}
            className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveCategoryName(categoryId);
              if (e.key === 'Escape') cancelCategoryNameEdit(categoryId);
            }}
          />
          <button
            onClick={() => saveCategoryName(categoryId)}
            className="flex items-center gap-1 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm font-medium"
          >
            <Check className="h-4 w-4" />
            <span>{t('common.save') || 'Save'}</span>
          </button>
          <button
            onClick={() => cancelCategoryNameEdit(categoryId)}
            className="flex items-center gap-1 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm font-medium"
          >
            <X className="h-4 w-4" />
            <span>{t('common.cancel') || 'Cancel'}</span>
          </button>
        </div>
      );
    }

    return (
      <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
        <h4 className="text-xl font-bold text-gray-900 dark:text-white">
          {displayText}
        </h4>
        {/* Show edited badge if displayName differs from originalName */}
       
        {showEditButton && isActive && (
          <button
            onClick={() => startEditingCategoryName(categoryId, displayText)}
            className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-xs font-medium"
            title="Edit category name"
          >
            <Edit3 className="h-3 w-3" />
            <span>{t('common.edit') || 'Edit'}</span>
          </button>
        )}
        {/* ADD inactive indicator */}
        {!isActive && (
          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
            Inactive
          </span>
        )}
      </div>
    );
  };

// Step Progress Component
  const StepProgress = () => (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8`}>
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0`}>

        {/* Steps Container */}
        <div className={`flex flex-col md:flex-row md:items-center gap-4 md:gap-8`}>
          
          {/* Step 1 */}
          <div className={`flex items-center gap-3 ${
            currentStep === AdditionStep.SELECT_CATEGORIES
              ? 'text-blue-600 dark:text-blue-400'
              : currentStep === AdditionStep.SELECT_PRODUCTS || currentStep === AdditionStep.REVIEW_SELECTION
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-400 dark:text-gray-500'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-semibold ${
              currentStep === AdditionStep.SELECT_CATEGORIES
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : currentStep === AdditionStep.SELECT_PRODUCTS || currentStep === AdditionStep.REVIEW_SELECTION
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
            }`}>
              {currentStep === AdditionStep.SELECT_CATEGORIES ? '1' : <Check className="h-5 w-5" />}
            </div>
            <div>
              <div className="font-medium text-sm sm:text-base">{t('branchCategories.steps.chooseCategories')}</div>
              <div className="text-xs sm:text-sm opacity-70">
                {selectedCategories.size} {t('branchCategories.steps.selected')}
                {editedCategoryNames.size > 0 && (
                  <span className={`${isRTL ? 'mr-2' : 'ml-2'} px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-[10px] sm:text-xs`}>
                    {editedCategoryNames.size} edited
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Arrow (Hidden on mobile) */}
          <ArrowRight className={`hidden md:block h-5 w-5 text-gray-300 dark:text-gray-600 ${isRTL ? 'rotate-180' : ''}`} />

          {/* Step 2 */}
          <div className={`flex items-center gap-3 ${
            currentStep === AdditionStep.SELECT_PRODUCTS
              ? 'text-blue-600 dark:text-blue-400'
              : currentStep === AdditionStep.REVIEW_SELECTION
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-400 dark:text-gray-500'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-semibold ${
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
              <div className="font-medium text-sm sm:text-base">{t('branchCategories.steps.selectProducts')}</div>
              <div className="text-xs sm:text-sm opacity-70">
                {selectedProducts.size} {t('branchCategories.steps.selected')}
                {editedProductPrices.size > 0 && (
                  <span className={`${isRTL ? 'mr-2' : 'ml-2'} px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-[10px] sm:text-xs`}>
                    {editedProductPrices.size} prices edited
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Arrow (Hidden on mobile) */}
          <ArrowRight className={`hidden md:block h-5 w-5 text-gray-300 dark:text-gray-600 ${isRTL ? 'rotate-180' : ''}`} />

          {/* Step 3 */}
          <div className={`flex items-center gap-3 ${
            currentStep === AdditionStep.REVIEW_SELECTION
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-400 dark:text-gray-500'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-semibold ${
              currentStep === AdditionStep.REVIEW_SELECTION
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
            }`}>
              3
            </div>
            <div>
              <div className="font-medium text-sm sm:text-base">{t('branchCategories.steps.reviewAdd')}</div>
              <div className="text-xs sm:text-sm opacity-70">{t('branchCategories.steps.finalStep')}</div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-4 md:mt-0">
          {currentStep === AdditionStep.SELECT_PRODUCTS && (
            <button
              onClick={onBackToCategorySelection}
              className="w-full md:w-auto justify-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg md:border-0"
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
              {t('branchCategories.steps.back')}
            </button>
          )}
          {currentStep === AdditionStep.REVIEW_SELECTION && (
            <button
              onClick={onBackToProductSelection}
              className="w-full md:w-auto justify-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg md:border-0"
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
// Enhanced Products Section for Manage Existing Tab
  const renderManageProductsSection = (branchCategory : BranchCategory) => {
  if (isReorderMode || !expandedBranchCategories.has(branchCategory.categoryId) || !branchCategory.products || branchCategory.products.length === 0) {
    return null;
  }
    const categoryIsActive = isCategoryActive ? isCategoryActive(branchCategory.categoryId) : true;

    return (
      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900/30">
          {!categoryIsActive && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <AlertCircle className={`h-5 w-5 text-red-600 dark:text-red-400 ${isRTL ? 'ml-3' : 'mr-3'}`} />
              <span className="text-red-700 dark:text-red-300 font-medium text-sm sm:text-base">
                This category is inactive
              </span>
            </div>
          </div>
        )}
      
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <h5 className="font-medium text-gray-900 dark:text-white text-base sm:text-lg">
            {t('branchCategories.products.inCategory')}
          </h5>

          <div className={`flex flex-wrap items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Stats */}
            <div className={`flex items-center gap-4 text-xs sm:text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {branchCategory.selectedProductsCount || 0} {t('branchCategories.products.added')}
                </span>
              </div>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {branchCategory.unselectedProductsCount || 0} {t('branchCategories.products.available')}
                </span>
              </div>
            </div>

            {/* View Toggle */}
            <div className={`flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg p-1 relative z-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 sm:p-2 rounded-md transition-all duration-200 cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                title="List View"
                aria-label="List View"
              >
                <List className="h-4 w-4 pointer-events-none" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 sm:p-2 rounded-md transition-all duration-200 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <Grid className="h-4 w-4 pointer-events-none" />
              </button>
            </div>
          </div>
        </div>

        {/* List View */}
        {viewMode === 'list' ? (
          <div className="space-y-3">
            {branchCategory.products.map((product) => {
              const isSelected = product.isSelected;
              const hasDetailedInfo = product.ingredients || product.allergens;
              const currentPrice = getProductPrice(product.id, product.price);
              const isEditingPrice = editingProductId === product.id;
          
              return (
                <div
                  key={product.id}
                  data-product-id={product.id}
                  className={`group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-300 ${
                    isSelected
                      ? 'shadow-lg border-2 border-green-400 dark:border-green-500 ring-2 ring-green-100 dark:ring-green-900/30'
                      : 'shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                  }`}
                  role="article"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"></div>

                  <div className={`flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-5 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                    
                    {/* Product Image Section */}
                    <div className="relative shrink-0 self-center sm:self-start">
                      {product.imageUrl ? (
                        <div className="relative group/image">
                          <img
                            src={product.imageUrl}
                            alt={`${t('SortableProduct.accessibility.productImage')} - ${product.name}`}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-gray-100 dark:bg-gray-700 ring-1 ring-gray-200 dark:ring-gray-700"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center ring-1 ring-gray-200 dark:ring-gray-700">
                          <Package className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}

                      <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-primary-500 to-primary-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md shadow-sm">
                        #{product.displayOrder}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 w-full min-w-0">
                      <div className={`flex flex-col h-full gap-3`}>
                        
                        {/* Header Row */}
                        <div className={`flex flex-wrap items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          {/* Drag Handle (Only visible on desktop/tablet usually, kept for consistency) */}
                          <button className="hidden sm:block mt-0.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 cursor-grab active:cursor-grabbing">
                            <GripVertical className="h-4 w-4" />
                          </button>

                          <h4 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white leading-tight flex-1 min-w-[150px]">
                            {product.name}
                          </h4>

                          {/* Badges Container */}
                          <div className={`flex flex-wrap items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ${
                              product.status
                                ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
                                : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
                            }`}>
                              {product.status ? t('branchCategories.status.active') : t('branchCategories.status.inactive')}
                            </span>
                            
                            {isSelected && (
                              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-green-500 text-white shadow-sm">
                                <Check className="w-3 h-3" />
                                <span>Added</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {product.description && (
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-snug line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        {/* Middle Content (Ingredients/Addons/Extras) */}
                        <div className="space-y-2">
                          {product.ingredients && product.ingredients.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 items-center">
                              <span className="text-[10px] font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide mr-1">
                                {t('SortableProduct.ingredients')}:
                              </span>
                              {product.ingredients.slice(0, 3).map((ingredient) => (
                                <span key={ingredient.id} className="inline-flex items-center text-[10px] bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded border border-orange-100 dark:border-orange-800">
                                  {ingredient.ingredientName}
                                  {ingredient.isAllergenic && <AlertCircle className="w-2.5 h-2.5 ml-0.5" />}
                                </span>
                              ))}
                              {product.ingredients.length > 3 && (
                                <span className="text-[10px] text-gray-500">+{product.ingredients.length - 3}</span>
                              )}
                            </div>
                          )}

                          {/* Addons Badge */}
                          {product.hasAddons && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                                {t('SortableProduct.addons')}:
                              </span>
                              <span className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-800">
                                {product.addonsCount} active
                              </span>
                            </div>
                          )}

                          {/* Extras Badge */}
                          {product.hasExtras && (
                            <div className="flex items-center gap-1.5">
                               <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                                {t('SortableProduct.buttons.extras')}:
                              </span>
                              <span className="text-[10px] bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded border border-purple-100 dark:border-purple-800">
                                {product.extrasCount} active
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Footer: Price & Actions */}
                        <div className={`mt-auto pt-3 border-t border-gray-100 dark:border-gray-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                          <div className="w-full sm:w-auto">
                            <PriceEditor
                              productId={product.id}
                              originalPrice={product.price}
                              currentPrice={currentPrice}
                              isEditing={isEditingPrice}
                              onEdit={() => onProductPriceEdit(product.id, product.price)}
                              onSave={() => onProductPriceSave(product.id)}
                              onCancel={() => onProductPriceCancel(product.id)}
                              onChange={(value) => onProductPriceChange(product.id, value)}
                              showEditButton={isSelected}
                            />
                          </div>
                          {/* Action buttons for product */}
                          <div className={`flex flex-wrap items-center gap-1.5 w-full sm:w-auto ${isRTL ? 'justify-start' : 'justify-end'}`}>
                            {hasDetailedInfo && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleShowProductDetails(product); }}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs font-medium text-gray-600 dark:text-gray-300"
                                title={t('SortableProduct.buttons.viewDetails')}
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>{t('SortableProduct.buttons.viewDetails')}</span>
                              </button>
                            )}

                            {product.isSelected && product.branchProductId && (
                              <>
                                <button
                                  onClick={(e) => { e.stopPropagation(); onToggleProductStatus && onToggleProductStatus(product.branchProductId!, product.status); }}
                                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors text-xs font-medium ${product.status ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-500 bg-gray-100 hover:bg-gray-200'}`}
                                  title={product.status ? t('SortableProduct.buttons.deactivate') : t('SortableProduct.buttons.activate')}
                                >
                                  <Power className="h-3.5 w-3.5" />
                                  <span>{product.status ? t('SortableProduct.buttons.deactivate') : t('SortableProduct.buttons.activate')}</span>
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); onToggleProductAvailability && onToggleProductAvailability(product.branchProductId!, product.isAvailable ?? true); }}
                                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors text-xs font-medium ${product.isAvailable !== false ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-orange-600 bg-orange-50 hover:bg-orange-100'}`}
                                  title={product.isAvailable !== false ? t('SortableProduct.buttons.markOutOfStock') : t('SortableProduct.buttons.markInStock')}
                                >
                                  <ShoppingBag className="h-3.5 w-3.5" />
                                  <span>{product.isAvailable !== false ? t('SortableProduct.buttons.markOutOfStock') : t('SortableProduct.buttons.markInStock')}</span>
                                </button>
                                {handleShowProductAddons && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleShowProductAddons(product); }}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-xs font-medium"
                                    title={t('SortableProduct.buttons.addons')}
                                  >
                                    <Puzzle className="h-3.5 w-3.5" />
                                    <span>{t('SortableProduct.buttons.addons')}</span>
                                  </button>
                                )}
                                {handleShowProductExtras && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleShowProductExtras(product); }}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-xs font-medium"
                                    title={t('SortableProduct.buttons.extras')}
                                  >
                                    <Grid3X3 className="h-3.5 w-3.5" />
                                    <span>{t('SortableProduct.buttons.extras')}</span>
                                  </button>
                                )}
                              </>
                            )}

                            {categoryIsActive && product.status && (
                              isSelected ? (
                                <button
                                  onClick={(e) => { e.stopPropagation(); onRemoveProduct(product.branchProductId || product.id, product.name); }}
                                  disabled={isLoading || isLoadingBranchProducts}
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-medium"
                                  title={t('SortableProduct.buttons.delete')}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>{t('SortableProduct.buttons.delete')}</span>
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => { e.stopPropagation(); onAddProduct(product.id, branchCategory.branchCategoryId); }}
                                  disabled={isLoading}
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-xs font-medium"
                                  title={t('branchProductsPage.products.addToBranch')}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                  <span>{t('branchProductsPage.products.addToBranch')}</span>
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {branchCategory.products.map((product) => {
              const isSelected = product.isSelected;
              const currentPrice = getProductPrice(product.id, product.price);
              const isEditingPrice = editingProductId === product.id;

              return (
                <div
                  key={product.id}
                  className={`group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 flex flex-col ${
                    isSelected
                      ? 'shadow-lg border-2 border-green-400 dark:border-green-500 ring-2 ring-green-100 dark:ring-green-900/30'
                      : 'shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700'
                  }`}
                  role="article"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"></div>

                  {/* Image Area */}
                  <div className="relative aspect-[4/3] w-full bg-gray-100 dark:bg-gray-700">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      #{product.displayOrder}
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="p-3 flex flex-col flex-1">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2 line-clamp-1" title={product.name}>
                      {product.name}
                    </h4>

                    {/* Stats Row */}
                    <div className="flex items-center gap-2 mb-3 text-[10px] text-gray-500 dark:text-gray-400">
                        {product.ingredients?.length ? (<span>{product.ingredients.length} Ing.</span>) : null}
                        {product.extrasCount ? (<span>{product.extrasCount} Ext.</span>) : null}
                        {product.addonsCount ? (<span>{product.addonsCount} Add.</span>) : null}
                    </div>

                    <div className="mt-auto space-y-3">
                      <PriceEditor
                        productId={product.id}
                        originalPrice={product.price}
                        currentPrice={currentPrice}
                        isEditing={isEditingPrice}
                        onEdit={() => onProductPriceEdit(product.id, product.price)}
                        onSave={() => onProductPriceSave(product.id)}
                        onCancel={() => onProductPriceCancel(product.id)}
                        onChange={(value) => onProductPriceChange(product.id, value)}
                        showEditButton={isSelected}
                      />

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                         <div className="flex gap-1">
                            {isSelected && product.branchProductId && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); onToggleProductStatus && onToggleProductStatus(product.branchProductId!, product.status); }}
                                  className={`p-1.5 rounded transition ${product.status ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100'}`}
                                  title={product.status ? t('branchProductsPage.products.deactivate') : t('branchProductsPage.products.activate')}
                                >
                                  <Power className="h-3.5 w-3.5" />
                                </button>
                            )}
                         </div>

                         <div>
                            {categoryIsActive && product.status && (
                              isSelected ? (
                                <button
                                  onClick={(e) => { e.stopPropagation(); onRemoveProduct(product.branchProductId || product.id, product.name); }}
                                  className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"
                                  title={t('branchProductsPage.products.removeFromBranch')}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => { e.stopPropagation(); onAddProduct(product.id, branchCategory.branchCategoryId); }}
                                  className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100"
                                  title={t('branchProductsPage.products.addToBranch')}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              )
                            )}
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <div className={`flex flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">{branchCategory.selectedProductsCount || 0}</span> {t('branchCategories.products.addedToBranch')}
                </span>
              </div>
              <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Package className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">{branchCategory.unselectedProductsCount || 0}</span> {t('branchCategories.products.moreAvailableToAdd')}
                </span>
              </div>
            </div>
            <div className="text-gray-500 dark:text-gray-400 w-full sm:w-auto text-center sm:text-right">
              {t('branchCategories.manage.total')} {branchCategory.products?.length || 0} {t('branchCategories.products.products')}
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : 'text-left'}>
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 overflow-hidden">
        <div className={`lg:flex sm:flex-col ${isRTL ? '' : ''}`}>
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-6 px-8 sm:text- text-lg font-semibold transition-all ${
              activeTab === 'add'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-4 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <div className={`flex items-center justify-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
              <Plus className="h-6 w-6" />
              <span>{t('branchCategories.tabs.addNew')}</span>
             {availableCategoriesNotInBranch.some(category => category.status) && (
                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                  {availableCategoriesNotInBranch.filter(category => category.status).length}
                </span>
              )}
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
          <StepProgress />

          {currentStep === AdditionStep.SELECT_CATEGORIES && (
            <div dir={isRTL ? 'rtl' : 'ltr'} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('branchCategories.addCategories.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{t('branchCategories.addCategories.subtitle')}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative">
                      <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5`} />
                      <input
                        type="text"
                        placeholder={t('branchCategories.search.categories')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent max-w-fit w-80 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      />
                    </div>
                    <button
                      onClick={onRefresh}
                      disabled={isLoading}
                      className="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                      {t('branchCategories.actions.refresh')}
                    </button>
                  </div>
                </div>
              </div>

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
                  const currentName = getCategoryName(category.categoryId, category.categoryName);
                  const isEditingName = editingCategoryId === category.categoryId;

                  return (
                    <div
                      key={category.categoryId}
                      className={`group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'shadow-xl shadow-blue-500/30 border-2 border-blue-400 dark:border-blue-500 ring-4 ring-blue-200 dark:ring-blue-800'
                          : 'shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                      }`}
                      onClick={!isEditingName ? () => onCategorySelect(category.categoryId) : undefined}
                      role="article"
                      aria-label={t('SortableCategory.accessibility.categoryCard')}
                    >
                      {/* Gradient Accent Bar */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"></div>

                      {/* Selected Indicator */}
                      {isSelected && (
                        <div className={`absolute -top-2 ${isRTL ? '-left-2' : '-right-2'} w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg z-10`}>
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      )}

                      {/* Category Header */}
                      <div className="relative p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary-500/5 to-purple-500/5 rounded-full blur-3xl -z-0"></div>

                        <div className="relative">
                          <div className={`flex items-start gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="flex-1 min-w-0">
                              <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                  {currentName}
                                </h3>
                                {category.products?.length > 0 && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                                    <Sparkles className="w-3 h-3" />
                                    {category.products.length}
                                  </span>
                                )}
                              </div>
                              {category.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                                  {category.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Footer Info */}
                          <div className={`flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Package className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                {category.products?.length} {t('branchCategories.products.products')}
                              </span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              category.status
                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
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
          {selectedCategories.size > 0 && (
                <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <div className={`flex flex-col sm:flex-row gap-4 items-center justify-between ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                    
                    {/* Selection Count Text */}
                    <div className={`text-sm text-gray-600 dark:text-gray-300 w-full sm:w-auto text-center ${isRTL ? 'sm:text-right' : 'sm:text-left'}`}>
                      <span className="font-medium">{selectedCategories.size}</span> {t('branchCategories.addCategories.categoriesSelected')}
                      {editedCategoryNames.size > 0 && (
                        <span className="inline-block mt-1 sm:mt-0 ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                          {editedCategoryNames.size} with custom names
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className={`flex flex-col sm:flex-row gap-3 w-full sm:w-auto ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                      <button
                        onClick={() => setSelectedCategories(new Set())}
                        className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors justify-center flex"
                      >
                        {t('branchCategories.addCategories.clearSelection')}
                      </button>
                      <button
                        onClick={onProceedToProductSelection}
                        className={`w-full sm:w-auto px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
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
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className={`flex flex-wrap items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('branchCategories.selectProducts.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{t('branchCategories.selectProducts.subtitle')}</p>
                  </div>
                  <div className={`flex flex-wrap max-w-fit justify-start gap-3 items-center ${isRTL ? 'space-x-reverse' : ''}`}>
                    <div className="relative">
                      <Search className={`absolute  ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5`} />
                      <input
                        type="text"
                        placeholder={t('branchCategories.search.products')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} max-w-fit pt-2 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
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
                    {filteredCategoriesWithProducts.map((category) => {
                      const currentCategoryName = getCategoryName(category.categoryId, category.categoryName);
                      
                      return (
                        <div key={category.categoryId} className="border border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden">
                        <div 
          className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={() => toggleCategoryExpansion(category.categoryId)}
        >
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0">
          <Store className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
              {currentCategoryName}
            </h4>
            {currentCategoryName !== category.categoryName && (
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                edited
              </span>
            )}
          </div>
          
          {/* Available Products Count Badge */}
           {/* Note: Logic for availableCategoriesNotInBranch seems context specific, kept placeholder logic */}
           {category.products.length > 0 && (
             <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300`}>
                {category.products.length} {t('branchCategories.selectProducts.available')}
             </div>
           )}
        </div>
      </div>

      <div className={`flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="text-sm text-gray-500 dark:text-gray-400">
           {/* Selected Products Count Badge */}
            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium">
               {category.products.filter(p => selectedProducts.has(p.id)).length} {t('branchCategories.selectProducts.selected')}
            </span>
        </div>
        {expandedCategories.has(category.categoryId) ? (
          <ChevronUp className="h-5 w-5 text-gray-400 dark:text-gray-500 shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500 shrink-0" />
        )}
      </div>
    </div>
  </div>

      {expandedCategories.has(category.categoryId) && (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {category.products.map((product) => {
          const isSelected = selectedProducts.has(product.id);
          const currentPrice = getProductPrice(product.id, product.price);
          const isEditingPrice = editingProductId === product.id;
          
          return (
            <div
              key={product.id}
              className={`relative rounded-xl border-2 transition-all hover:shadow-md overflow-hidden ${
                isSelected 
                  ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20' 
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              {isSelected && (
                <div className={`absolute -top-2 ${isRTL ? '-left-2' : '-right-2'} w-8 h-8 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center shadow-sm z-10`}>
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}

              <div className="p-4 flex flex-col h-full">
                <div className={`flex items-start justify-between gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-gray-900 dark:text-white mb-1 truncate" title={product.name}>
                        {product.name}
                    </h5>
                    {product.description && (
                      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm line-clamp-2" title={product.description}>
                        {product.description}
                      </p>
                    )}
                  </div>
                  {product.imageUrl && (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover bg-gray-100 dark:bg-gray-700 shrink-0"
                    />
                  )}
                </div>

                <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700/50">
                  <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                    
                    <div className={`flex flex-wrap items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <PriceEditor
                        productId={product.id}
                        originalPrice={product.price}
                        currentPrice={currentPrice}
                        isEditing={isEditingPrice}
                        onEdit={() => onProductPriceEdit(product.id, product.price)}
                        onSave={() => onProductPriceSave(product.id)}
                        onCancel={() => onProductPriceCancel(product.id)}
                        onChange={(value) => onProductPriceChange(product.id, value)}
                        showEditButton={isSelected}
                      />
                      
                      <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border ${
                        product.status 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                      }`}>
                        {product.status ? t('branchCategories.status.active') : t('branchCategories.status.inactive')}
                      </span>
                    </div>

                              <button
                                onClick={() => onProductSelect(product.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto ${
                                  isSelected
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                                }`}
                              >
                                {isSelected ? t('common.remove') : t('common.select')}
                              </button>
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
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">{selectedProducts.size}</span> {t('branchCategories.selectProducts.productsSelectedFrom')}{' '}
                    <span className="font-medium">{selectedCategories.size}</span> {t('branchCategories.selectProducts.categories')}
                    {editedProductPrices.size > 0 && (
                      <span className="ml-2 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs">
                        {editedProductPrices.size} with custom prices
                      </span>
                    )}
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
              <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
                <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('branchCategories.review.title')}</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">{t('branchCategories.review.subtitle')}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="space-y-6 sm:space-y-8">
                  {getSelectedCategoriesWithProducts().map((category) => {
                    const currentCategoryName = getCategoryName(category.categoryId, category.categoryName);
                    const hasEditedName = currentCategoryName !== category.categoryName;
                    
                    return (
                      <div key={category.categoryId} className="border border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden">
                        <div className="p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center shrink-0">
                                <Store className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                              </div>
                              <div>
                                <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex flex-wrap items-center gap-2">
                                  {currentCategoryName}
                                  {hasEditedName && (
                                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs whitespace-nowrap">
                                      Custom name
                                    </span>
                                  )}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                  {category.selectedProducts.length > 0 
                                    ? `${category.selectedProducts.length} ${t('branchCategories.review.of')} ${category.products.length} ${t('branchCategories.review.productsSelected')}`
                                    : `${t('branchCategories.review.all')} ${category.products.length} ${t('branchCategories.review.productsWillBeAdded')}`
                                  }
                                </p>
                              </div>
                            </div>
                            <div className={`flex flex-col ${isRTL ? 'sm:items-start' : 'sm:items-end'} w-full sm:w-auto mt-2 sm:mt-0`}>
                              <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {currency.symbol}{category.selectedProducts.length > 0 
                                  ? category.selectedProducts.reduce((sum, product) => {
                                      const price = getProductPrice(product.id, product.price);
                                      return sum + price;
                                    }, 0).toFixed(2)
                                  : category.products.reduce((sum, product) => {
                                      const price = getProductPrice(product.id, product.price);
                                      return sum + price;
                                    }, 0).toFixed(2)
                                }
                              </div>
                              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{t('branchCategories.review.totalValue')}</div>
                            </div>
                          </div>
                        </div>

                        {category.selectedProducts.length > 0 && (
                          <div className="p-4 sm:p-6">
                            <h5 className="font-medium text-gray-900 dark:text-white mb-4">{t('branchCategories.review.selectedProducts')}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                              {category.selectedProducts.map((product) => {
                                const currentPrice = getProductPrice(product.id, product.price);
                                const hasEditedPrice = Math.abs(currentPrice - product.price) > 0.001;
                                
                                return (
                                  <div key={product.id} className={`flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    {product.imageUrl ? (
                                      <img 
                                        src={product.imageUrl} 
                                        alt={product.name}
                                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                                      />
                                    ) : (
                                       <div className="w-10 h-10 rounded-lg bg-green-200 dark:bg-green-800 flex items-center justify-center shrink-0">
                                          <Package className="h-5 w-5 text-green-700 dark:text-green-300" />
                                       </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-gray-900 dark:text-white truncate" title={product.name}>{product.name}</div>
                                      <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2 flex-wrap">
                                        <span>{currency.symbol}{currentPrice.toFixed(2)}</span>
                                        {hasEditedPrice && (
                                          <span className="px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-[10px] whitespace-nowrap">
                                            Custom price
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="w-5 h-5 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center shrink-0">
                                      <Check className="h-3 w-3 text-white" />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-2xl">
                <div className={`flex flex-col lg:flex-row items-center justify-between gap-4 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
                  <div className="text-center lg:text-left w-full lg:w-auto">
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {t('branchCategories.review.readyToAdd')} {selectedCategories.size} 
                      {selectedProducts.size > 0 && ` ${t('branchCategories.review.with')} ${selectedProducts.size} ${t('branchCategories.products.products')}`}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2">
                      <span>{t('branchCategories.review.availableInBranch')} {branchId}</span>
                      {(editedCategoryNames.size > 0 || editedProductPrices.size > 0) && (
                        <div className="flex gap-2">
                          {editedCategoryNames.size > 0 && (
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs whitespace-nowrap">
                              {editedCategoryNames.size} custom names
                            </span>
                          )}
                          {editedProductPrices.size > 0 && (
                            <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs whitespace-nowrap">
                              {editedProductPrices.size} custom prices
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`flex flex-col sm:flex-row gap-3 w-full lg:w-auto ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                    <button
                      onClick={() => {
                        setSelectedCategories(new Set());
                        setSelectedProducts(new Set());
                        setCurrentStep(AdditionStep.SELECT_CATEGORIES);
                      }}
                      className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      {t('branchCategories.review.startOver')}
                    </button>
                    <button
                      onClick={onSave}
                      disabled={isSaving}
                      className={`w-full sm:w-auto px-8 py-3 bg-green-600 dark:bg-green-500 text-white rounded-xl hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 ${isRTL ? 'flex-row-reverse' : ''}`}
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
   <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
  <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
      <div className={`text-center sm:text-${isRTL ? 'right' : 'left'}`}>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('branchCategories.manage.title')}</h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">{t('branchCategories.manage.subtitle')}</p>
      </div>
      
      <div className={`flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto ${isRTL ? 'flex-row-reverse' : ''}`}>
        {hasUnsavedChanges && isReorderMode && (
          <button
            onClick={onSaveOrder}
            disabled={isReordering}
            className={`px-4 py-2 sm:py-3 bg-green-600 dark:bg-green-500 text-white rounded-xl hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50 text-sm sm:text-base ${isRTL ? 'flex-row-reverse' : ''}`}
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
          className={`px-4 py-2 sm:py-3 rounded-xl transition-colors flex items-center gap-2 text-sm sm:text-base ${
            isReorderMode
              ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          } ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <GripVertical className="h-4 w-4" />
          {isReorderMode ? t('branchCategories.manage.exitReorder') : t('branchCategories.manage.reorder')}
        </button>
        <button 
          onClick={() => {
            navigate('/dashboard/RecycleBin', { state: { source: 'branchProducts' } })
          }}
          className="flex items-center gap-2 px-4 py-2 sm:py-3 text-sm sm:text-base font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors duration-200"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">{t('productsContent.actions.RecycleBin')}</span>
        </button>
      </div>
    </div>
  </div>

  <div className="p-4 sm:p-6">
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
      <div className="space-y-4 sm:space-y-6">
        {branchCategories.map((branchCategory, index) => {
          const categoryIsActive = isCategoryActive ? isCategoryActive(branchCategory.categoryId) : true;

          return (
            <div
              key={branchCategory.branchCategoryId}
              className={`group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-300 ${
                !categoryIsActive
                  ? 'shadow-md border-2 border-red-200 dark:border-red-800 opacity-75'
                  : isReorderMode
                  ? 'shadow-xl shadow-orange-500/20 border-2 border-orange-300 dark:border-orange-600 cursor-move'
                  : 'shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"></div>

              <div className="relative p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/5 to-purple-500/5 rounded-full blur-3xl -z-0 pointer-events-none"></div>

                <div className={`relative flex flex-col md:flex-row md:items-center justify-between gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                  
                  <div className={`flex items-start gap-4 flex-1 min-w-0 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                    {/* Drag Handle */}
                    {isReorderMode && categoryIsActive && (
                      <button
                        className="mt-1 p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 shrink-0"
                      >
                        <GripVertical className="h-5 w-5" />
                      </button>
                    )}

                    {/* Order Badge */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shrink-0 text-sm sm:text-base">
                      {branchCategory.displayOrder}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className={`flex flex-wrap items-center gap-2 sm:gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <CategoryNameDisplay
                          categoryId={branchCategory.categoryId}
                          originalName={branchCategory.category.categoryName}
                          currentDisplayName={branchCategory.displayName}
                          isActive={categoryIsActive}
                        />
                        {branchCategory.products && branchCategory.products.length > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] sm:text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full shrink-0">
                            <Sparkles className="w-3 h-3" />
                            {branchCategory.products.length}
                          </span>
                        )}
                      </div>
                      
                      <div className={`flex flex-wrap items-center gap-3 sm:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {branchCategory.selectedProductsCount || 0}
                            </span> {t('branchCategories.manage.added')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                              {branchCategory.unselectedProductsCount || 0}
                            </span> {t('branchCategories.manage.available')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className={`flex items-center justify-between md:justify-end gap-3 w-full md:w-auto mt-2 md:mt-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ${
                        branchCategory.isActive
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {branchCategory.isActive ? t('branchCategories.manage.active') : t('branchCategories.manage.inactive')}
                      </span>

                      {isReorderMode ? (
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1">
                          <button
                            onClick={() => onMoveUp(index)}
                            disabled={index === 0}
                            className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all disabled:opacity-50"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onMoveDown(index)}
                            disabled={index === branchCategories.length - 1}
                            className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all disabled:opacity-50"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {(branchCategory.selectedProductsCount || 0) > 0 && (
                            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-medium">
                              <AlertCircle className="h-3.5 w-3.5" />
                              <span className="whitespace-nowrap">{branchCategory.selectedProductsCount} {t('branchCategories.products.products')}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1">
                            <button
                              onClick={() => onDeleteCategory(branchCategory.branchCategoryId, branchCategory.displayName)}
                              disabled={(branchCategory.selectedProductsCount || 0) > 0}
                              className={`p-1.5 sm:p-2 rounded-lg transition-all ${
                                (branchCategory.selectedProductsCount || 0) > 0
                                  ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
                                  : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-600'
                              }`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {!isReorderMode && branchCategory.products && branchCategory.products.length > 0 && (
                      <button
                        onClick={() => toggleBranchCategoryExpansion(branchCategory.categoryId)}
                        className={`p-2 rounded-xl transition-all duration-200 ${
                          expandedBranchCategories.has(branchCategory.categoryId)
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {expandedBranchCategories.has(branchCategory.categoryId) ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {renderManageProductsSection(branchCategory)}
            </div>
          );
        })}
      </div>
    )}
  </div>
</div>
      )}
    </div>
  );
};

export default CategoriesContent;