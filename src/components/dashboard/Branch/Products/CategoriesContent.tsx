import React, { useState, useMemo } from 'react';
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
  Info,
  Edit3,
  DollarSign,
  Puzzle,
  ChefHat,
  Sparkles,
  Grid,
  List,
  Power,
  ShoppingBag,
  Layers
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
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
            <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
            <input
              title='number'
              type="number"
              step="1"
              min="0"
              value={currentPrice}
              onChange={(e) => onChange(e.target.value)}
              className="pl-6 pr-2 py-1 w-20 text-sm border border-blue-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
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
          ${currentPrice.toFixed(2)}
        </span>
        {hasChanged && (
          <span className="text-xs text-gray-500 line-through">
            ${originalPrice.toFixed(2)}
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
  }> = ({ categoryId, originalName, currentDisplayName, showEditButton = true, isActive = true }) => {
    const isCurrentlyEditing = editingCategoryId === categoryId;
    // Use originalName (category.categoryName) instead of currentDisplayName (displayName)
    const displayText = originalName;
    const hasChanged = currentDisplayName !== originalName;

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
              <div className="text-sm opacity-70">
                {selectedCategories.size} {t('branchCategories.steps.selected')}
                {editedCategoryNames.size > 0 && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                    {editedCategoryNames.size} edited
                  </span>
                )}
              </div>
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
              <div className="text-sm opacity-70">
                {selectedProducts.size} {t('branchCategories.steps.selected')}
                {editedProductPrices.size > 0 && (
                  <span className="ml-2 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs">
                    {editedProductPrices.size} prices edited
                  </span>
                )}
              </div>
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
  const renderManageProductsSection = (branchCategory : BranchCategory) => {
  if (isReorderMode || !expandedBranchCategories.has(branchCategory.categoryId) || !branchCategory.products || branchCategory.products.length === 0) {
    return null;
  }
    const categoryIsActive = isCategoryActive ? isCategoryActive(branchCategory.categoryId) : true;

    return (
      <div className="p-6  bg-gray-50 dark:bg-gray-900/30">
          {!categoryIsActive && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <AlertCircle className={`h-5 w-5 text-red-600 dark:text-red-400 ${isRTL ? 'ml-3' : 'mr-3'}`} />
              <span className="text-red-700 dark:text-red-300 font-medium">
                This category is inactive
              </span>
            </div>
          </div>
        )}
      
        <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h5 className="font-medium text-gray-900 dark:text-white">
            {t('branchCategories.products.inCategory')}
          </h5>

          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Stats */}
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

            {/* View Toggle */}
            <div className={`flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg p-1 relative z-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 cursor-pointer ${
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
                className={`p-2 rounded-md transition-all duration-200 cursor-pointer ${
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
            ? 'shadow-xl shadow-green-500/30 border-2 border-green-400 dark:border-green-500 ring-4 ring-green-200 dark:ring-green-800'
            : 'shadow-sm hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
        }`}
        role="article"
        aria-label={t('SortableProduct.accessibility.productCard')}
      >
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"></div>

        <div className={`flex items-start gap-5 p-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Product Image Section */}
          <div className="relative flex-shrink-0">
            {product.imageUrl ? (
              <div className="relative group/image">
                <img
                  src={product.imageUrl}
                  alt={`${t('SortableProduct.accessibility.productImage')} - ${product.name}`}
                  className="w-24 h-24 rounded-xl object-cover bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 ring-2 ring-gray-200 dark:ring-gray-700 group-hover/image:ring-primary-300 dark:group-hover/image:ring-primary-600 transition-all duration-300"
                  loading="lazy"
                />
                {/* Image overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-primary-300 dark:group-hover:ring-primary-600 transition-all duration-300">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-500/10 blur-xl rounded-full"></div>
                  <Package className="relative h-10 w-10 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
            )}

            {/* Display order badge */}
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-primary-500 to-primary-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg">
              #{product.displayOrder}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* Drag Handle */}
              <button
                className="mt-1 p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-110"
                aria-label={t('SortableProduct.accessibility.dragHandle')}
                title={t('SortableProduct.dragProduct')}
              >
                <GripVertical className="h-4 w-4" />
              </button>

              <div className="flex-1 min-w-0 space-y-3">
                {/* Header: Name + Status Badge */}
                <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h4 className="flex-1 font-semibold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {product.name}
                  </h4>
                  {/* Status Badge */}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.status
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400'
                  }`}>
                    {product.status ? t('branchCategories.status.active') : t('branchCategories.status.inactive')}
                  </span>
                  {/* Added/Not Added indicator */}
                  {isSelected && (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
                      <Check className="w-3 h-3" />
                      <span>Added</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Ingredients Section */}
                {product.ingredients && product.ingredients.length > 0 ? (
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 px-3 py-2.5 rounded-xl border border-orange-200 dark:border-orange-800">
                    <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <ChefHat className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-xs font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide">
                        {t('SortableProduct.ingredients')}
                      </span>
                      <span className="text-xs text-orange-600 dark:text-orange-400 bg-orange-200 dark:bg-orange-800/50 px-2 py-0.5 rounded-full">
                        {product.ingredients.length}
                      </span>
                    </div>
                    <div className={`flex flex-wrap gap-1.5 ${isRTL ? 'justify-end' : ''}`}>
                      {product.ingredients.map((ingredient) => (
                        <span
                          key={ingredient.id}
                          className={`inline-flex items-center gap-1 text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-lg border ${
                            ingredient.isAllergenic
                              ? 'border-yellow-300 dark:border-yellow-700 ring-1 ring-yellow-200 dark:ring-yellow-800'
                              : 'border-orange-200 dark:border-orange-800'
                          }`}
                        >
                          {ingredient.ingredientName}
                          {ingredient.isAllergenic && (
                            <span title="Allergen">
                              <AlertCircle
                                className="h-3 w-3 text-yellow-500 dark:text-yellow-400"
                                aria-label={t('SortableProduct.accessibility.allergenWarning')}
                              />
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Addons Section */}
                {product.hasAddons && product.addonsCount ? (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 px-3 py-2.5 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                        {t('SortableProduct.addons')}
                      </span>
                      <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-200 dark:bg-blue-800/50 px-2 py-0.5 rounded-full">
                        {product.addonsCount}
                      </span>
                    </div>
                  </div>
                ) : null}

                {/* Extras Section - Grouped by Category */}
                {product.extras && product.extras.length > 0 && (() => {
                  const groupedExtras: Record<string, any[]> = {};
                  product.extras.forEach((extra: any) => {
                    const categoryName = extra.categoryName || t('SortableProduct.uncategorized');
                    if (!groupedExtras[categoryName]) {
                      groupedExtras[categoryName] = [];
                    }
                    groupedExtras[categoryName].push(extra);
                  });

                  return (
                    <div className="space-y-2">
                      {Object.entries(groupedExtras).map(([categoryName, categoryExtras]) => (
                        <div
                          key={categoryName}
                          className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 px-3 py-2.5 rounded-xl border border-purple-200 dark:border-purple-800"
                        >
                          <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                              {categoryName}
                            </span>
                            <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-200 dark:bg-purple-800/50 px-2 py-0.5 rounded-full">
                              {categoryExtras.length}
                            </span>
                          </div>
                          <div className={`flex flex-wrap gap-1.5 ${isRTL ? 'justify-end' : ''}`}>
                            {categoryExtras.map((extra: any) => (
                              <span
                                key={extra.id}
                                className="inline-flex items-center gap-1 text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-800"
                              >
                                {extra.extraName || `Extra ${extra.extraId}`}
                                {extra.specialUnitPrice > 0 && (
                                  <span className="text-purple-600 dark:text-purple-400 font-medium">
                                    +{extra.specialUnitPrice.toFixed(2)}
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Allergens display */}
                {product.allergens && product.allergens.length > 0 && (
                  <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
                      {product.allergens.length} {t('branchCategories.products.allergens')}
                    </span>
                  </div>
                )}

                {/* Footer: Price + Actions */}
                <div className={`flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="flex items-baseline gap-2">
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

                  {/* Action Buttons */}
                  <div className={`flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {/* View Details Button */}
                    {hasDetailedInfo && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowProductDetails(product);
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                        title={t('branchCategories.products.viewDetails')}
                        aria-label={t('branchCategories.products.viewDetails')}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="text-sm font-medium">{t('SortableProduct.buttons.view')}</span>
                      </button>
                    )}

                    {/* Active/Inactive Toggle Button */}
                    {product.isSelected && product.branchProductId && onToggleProductStatus && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          await onToggleProductStatus(product.branchProductId!, product.status);
                        }}
                        disabled={isLoading}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 ${
                          product.status
                            ? 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                            : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                        title={product.status ? t('branchCategories.products.deactivate') : t('branchCategories.products.activate')}
                      >
                        <Power className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {product.status ? t('branchCategories.status.active') : t('branchCategories.status.inactive')}
                        </span>
                      </button>
                    )}

                    {/* Available/Out of Stock Toggle Button */}
                    {product.isSelected && product.branchProductId && onToggleProductAvailability && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          await onToggleProductAvailability(product.branchProductId!, product.isAvailable ?? true);
                        }}
                        disabled={isLoading}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 ${
                          product.isAvailable !== false
                            ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                            : 'text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                        }`}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {product.isAvailable !== false ? t('branchCategories.stock.inStock') : t('branchCategories.stock.outOfStock')}
                        </span>
                      </button>
                    )}

                    {/* Addons Button */}
                    {product.isSelected && product.branchProductId && handleShowProductAddons && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowProductAddons(product);
                        }}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200"
                        title={`Configure Addons${product.hasAddons ? ` (${product.addonsCount})` : ''}`}
                        aria-label={t('SortableProduct.accessibility.addonsButton')}
                      >
                        <Puzzle className="h-4 w-4" />
                        <span className="text-sm font-medium">{t('SortableProduct.buttons.addons')}</span>
                      </button>
                    )}

                    {/* Extra Categories Button */}
                    {product.isSelected && product.branchProductId && handleShowProductExtras && (
                      <button
                        onClick={() => handleShowProductExtras(product)}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200"
                        title={t('productsContent.actions.manageExtras')}
                      >
                        <Grid3X3 className="h-4 w-4" />
                        <span className="text-sm font-medium">{t('SortableProduct.buttons.extras')}</span>
                      </button>
                    )}

                    {/* Add/Remove Button */}
                    {categoryIsActive && product.status ? (
                      isSelected ? (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            const branchProductIdToRemove = product.branchProductId || product.id;
                            await onRemoveProduct(branchProductIdToRemove, product.name);
                          }}
                          disabled={isLoading || isLoadingBranchProducts}
                          className="flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                          title={t('branchCategories.products.removeFromBranch')}
                          aria-label={t('SortableProduct.accessibility.deleteButton')}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="text-sm font-medium">{t('SortableProduct.buttons.remove')}</span>
                        </button>
                      ) : (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            const originalProductId = product.id;
                            await onAddProduct(originalProductId, branchCategory.branchCategoryId);
                          }}
                          disabled={isLoading}
                          className="flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200"
                          title={t('branchCategories.products.addToBranch')}
                        >
                          <Plus className="h-4 w-4" />
                          <span className="text-sm font-medium">{t('SortableProduct.buttons.add')}</span>
                        </button>
                      )
                    ) : null}
                  </div>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {branchCategory.products.map((product) => {
              const isSelected = product.isSelected;
              const hasDetailedInfo = product.ingredients || product.allergens;
              const currentPrice = getProductPrice(product.id, product.price);
              const isEditingPrice = editingProductId === product.id;

              return (
                <div
                  key={product.id}
                  className={`group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 ${
                    isSelected
                      ? 'shadow-lg shadow-green-500/20 border-2 border-green-400 dark:border-green-500 ring-2 ring-green-200 dark:ring-green-800'
                      : 'shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                  }`}
                  role="article"
                >
                  {/* Gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"></div>

                  {/* Product Image */}
                  <div className="relative aspect-square">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                        <Package className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}

                    {/* Display order badge */}
                    <div className="absolute top-2 left-2 bg-gradient-to-br from-primary-500 to-primary-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                      #{product.displayOrder}
                    </div>

                    {/* Status badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1 truncate">
                      {product.name}
                    </h4>

                    {/* Status Badge */}
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${
                      product.status
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400'
                    }`}>
                      {product.status ? t('branchCategories.status.active') : t('branchCategories.status.inactive')}
                    </span>

                    {/* Ingredients count */}
                    {product.ingredients && product.ingredients.length > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        <ChefHat className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                        <span className="text-xs text-orange-600 dark:text-orange-400">
                          {product.ingredients.length} ingredients
                        </span>
                      </div>
                    )}

                    {/* Extras count */}
                    {product.extras && product.extras.length > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        <Layers className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                        <span className="text-xs text-purple-600 dark:text-purple-400">
                          {product.extras.length} extras
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="mb-2">
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

                    {/* Action Buttons */}
                    <div className={`flex flex-wrap items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {hasDetailedInfo && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowProductDetails(product);
                          }}
                          className="flex-1 p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          title={t('branchCategories.products.viewDetails')}
                          aria-label={t('branchCategories.products.viewDetails')}
                        >
                          <Eye className="h-3.5 w-3.5 mx-auto" />
                        </button>
                      )}

                      {/* Addons Button */}
                      {product.isSelected && product.branchProductId && handleShowProductAddons && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowProductAddons(product);
                          }}
                          disabled={isLoading}
                          className="flex-1 p-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-md hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                          title={`${t('branchCategories.products.configureAddons')}${product.hasAddons ? ` (${product.addonsCount})` : ''}`}
                          aria-label={t('branchCategories.products.configureAddons')}
                        >
                          <Puzzle className="h-3.5 w-3.5 mx-auto" />
                        </button>
                      )}

                      {/* Extra Categories Button */}
                      {product.isSelected && product.branchProductId && handleShowProductExtras && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowProductExtras(product);
                          }}
                          disabled={isLoading}
                          className="flex-1 p-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                          title={t('branchCategories.products.manageExtras')}
                          aria-label={t('branchCategories.products.manageExtras')}
                        >
                          <Grid3X3 className="h-3.5 w-3.5 mx-auto" />
                        </button>
                      )}

                      {/* Active/Inactive Toggle Button */}
                      {product.isSelected && product.branchProductId && onToggleProductStatus && (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            await onToggleProductStatus(product.branchProductId!, product.status);
                          }}
                          disabled={isLoading}
                          className={`flex-1 p-1.5 rounded-md transition-colors ${
                            product.status
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                          title={product.status ? t('branchCategories.products.deactivate') : t('branchCategories.products.activate')}
                          aria-label={product.status ? t('branchCategories.products.deactivate') : t('branchCategories.products.activate')}
                        >
                          <Power className="h-3.5 w-3.5 mx-auto" />
                        </button>
                      )}

                      {/* Available/Out of Stock Toggle Button */}
                      {product.isSelected && product.branchProductId && onToggleProductAvailability && (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            await onToggleProductAvailability(product.branchProductId!, product.isAvailable ?? true);
                          }}
                          disabled={isLoading}
                          className={`flex-1 p-1.5 rounded-md transition-colors ${
                            product.isAvailable !== false
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                              : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50'
                          }`}
                          title={product.isAvailable !== false ? t('branchCategories.products.markOutOfStock') : t('branchCategories.products.markInStock')}
                          aria-label={product.isAvailable !== false ? t('branchCategories.products.markOutOfStock') : t('branchCategories.products.markInStock')}
                        >
                          <ShoppingBag className="h-3.5 w-3.5 mx-auto" />
                        </button>
                      )}

                      {categoryIsActive && product.status ? (
                        isSelected ? (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              const branchProductIdToRemove = product.branchProductId || product.id;
                              await onRemoveProduct(branchProductIdToRemove, product.name);
                            }}
                            disabled={isLoading || isLoadingBranchProducts}
                            className="flex-1 p-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                            title={t('branchCategories.products.removeFromBranch')}
                            aria-label={t('branchCategories.products.removeFromBranch')}
                          >
                            <X className="h-3.5 w-3.5 mx-auto" />
                          </button>
                        ) : (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              const originalProductId = product.id;
                              await onAddProduct(originalProductId, branchCategory.branchCategoryId);
                            }}
                            disabled={isLoading}
                            className="flex-1 p-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50"
                            title={t('branchCategories.products.addToBranch')}
                            aria-label={t('branchCategories.products.addToBranch')}
                          >
                            <Plus className="h-3.5 w-3.5 mx-auto" />
                          </button>
                        )
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
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
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">{selectedCategories.size}</span> {t('branchCategories.addCategories.categoriesSelected')}
                      {editedCategoryNames.size > 0 && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                          {editedCategoryNames.size} with custom names
                        </span>
                      )}
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
                            className="p-6 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => toggleCategoryExpansion(category.categoryId)}
                          >
                            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                  <Store className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {currentCategoryName}
                                    {currentCategoryName !== category.categoryName && (
                                      <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                                        edited
                                      </span>
                                    )}
                                  </h4>
                                  {availableCategoriesNotInBranch.some(category => category.status) && (
                                        <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                                                                            <p className="text-gray-600 dark:text-gray-300">{availableCategoriesNotInBranch.filter(category => category.status).length} {t('branchCategories.selectProducts.available')}</p>

                                        </span>
                                      )}
                                </div>
                              </div>
                              <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                                
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {availableCategoriesNotInBranch.some(category => category.status) && (
                                        <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                                       <p className="text-gray-600 dark:text-gray-300">{availableCategoriesNotInBranch.filter(category => category.status).length} {t('branchCategories.selectProducts.selected')}</p>

                                        </span>
                                      )}
                                </span>
                                {expandedCategories.has(category.categoryId) ? (
                                  <ChevronUp className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                )}
                              </div>
                            </div>
                          </div>

                          {expandedCategories.has(category.categoryId) && (
                            <div className="p-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {category.products.map((product) => {
                                  const isSelected = selectedProducts.has(product.id);
                                  const currentPrice = getProductPrice(product.id, product.price);
                                  const isEditingPrice = editingProductId === product.id;
                                  
                                  return (
                                    <div
                                      key={product.id}
                                      className={`relative rounded-xl border-2 transition-all hover:shadow-md ${
                                        isSelected 
                                          ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20' 
                                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
                                      }`}
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
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                              product.status 
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                            }`}>
                                              {product.status ? t('branchCategories.status.active') : t('branchCategories.status.inactive')}
                                            </span>
                                          </div>
                                          <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                                            <button
                                              onClick={() => onProductSelect(product.id)}
                                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                                isSelected
                                                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                                                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                                              }`}
                                            >
                                              {isSelected ? 'Remove' : 'Select'}
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
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('branchCategories.review.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{t('branchCategories.review.subtitle')}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-8">
                  {getSelectedCategoriesWithProducts().map((category) => {
                    const currentCategoryName = getCategoryName(category.categoryId, category.categoryName);
                    const hasEditedName = currentCategoryName !== category.categoryName;
                    
                    return (
                      <div key={category.categoryId} className="border border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden">
                        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
                              <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center">
                                <Store className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                  {currentCategoryName}
                                  {hasEditedName && (
                                    <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                                      Custom name
                                    </span>
                                  )}
                                </h4>
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
                              <div className="text-sm text-gray-500 dark:text-gray-400">{t('branchCategories.review.totalValue')}</div>
                            </div>
                          </div>
                        </div>

                        {category.selectedProducts.length > 0 && (
                          <div className="p-6">
                            <h5 className="font-medium text-gray-900 dark:text-white mb-4">{t('branchCategories.review.selectedProducts')}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {category.selectedProducts.map((product) => {
                                const currentPrice = getProductPrice(product.id, product.price);
                                const hasEditedPrice = Math.abs(currentPrice - product.price) > 0.001;
                                
                                return (
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
                                      <div className="text-sm text-gray-600 dark:text-gray-300">
                                        ${currentPrice.toFixed(2)}
                                        {hasEditedPrice && (
                                          <span className="ml-2 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs">
                                            Custom price
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="w-5 h-5 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center">
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

              <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {t('branchCategories.review.readyToAdd')} {selectedCategories.size} 
                      {selectedProducts.size > 0 && ` ${t('branchCategories.review.with')} ${selectedProducts.size} ${t('branchCategories.products.products')}`}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">30
                      {t('branchCategories.review.availableInBranch')} {branchId}
                      {(editedCategoryNames.size > 0 || editedProductPrices.size > 0) && (
                        <span className="ml-2">
                          {editedCategoryNames.size > 0 && (
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs mr-2">
                              {editedCategoryNames.size} custom names
                            </span>
                          )}
                          {editedProductPrices.size > 0 && (
                            <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs">
                              {editedProductPrices.size} custom prices
                            </span>
                          )}
                        </span>
                      )}
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
                       <button 
                      onClick={() => {
                        navigate('/dashboard/RecycleBin', { state: { source: 'branchProducts' } })
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{t('productsContent.actions.RecycleBin')}</span>
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
              <div className="space-y-6">
            {branchCategories.map((branchCategory, index) => {
          // CHECK IF CATEGORY IS ACTIVE
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
              role="article"
              aria-label={t('SortableCategory.accessibility.categoryCard')}
            >
              {/* Gradient Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"></div>

              {/* Category Header - Modern Design */}
              <div className="relative p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/5 to-purple-500/5 rounded-full blur-3xl -z-0"></div>

                <div className={`relative flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-4 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {/* Drag Handle - Enhanced */}
                    {isReorderMode && categoryIsActive && (
                      <button
                        className="p-2.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-110"
                        aria-label={t('SortableCategory.accessibility.dragHandle')}
                        title={t('SortableCategory.dragCategory')}
                      >
                        <GripVertical className="h-5 w-5" />
                      </button>
                    )}

                    {/* Display Order Badge */}
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">
                      {branchCategory.displayOrder}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <CategoryNameDisplay
                          categoryId={branchCategory.categoryId}
                          originalName={branchCategory.category.categoryName}
                          currentDisplayName={branchCategory.displayName}
                          isActive={categoryIsActive}
                        />
                        {branchCategory.products && branchCategory.products.length > 0 && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                            <Sparkles className="w-3 h-3" />
                            {branchCategory.products.length}
                          </span>
                        )}
                      </div>
                      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {branchCategory.selectedProductsCount || 0}
                            </span> {t('branchCategories.manage.added')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                              {branchCategory.unselectedProductsCount || 0}
                            </span> {t('branchCategories.manage.available')}
                          </span>
                        </div>
                      </div>
                    </div>

                 
                  </div>

                  {/* Action Buttons - Modern Group */}
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {/* Status Badge */}
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      branchCategory.isActive
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {branchCategory.isActive ? t('branchCategories.manage.active') : t('branchCategories.manage.inactive')}
                    </span>

                    {isReorderMode ? (
                      <div className={`flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <button
                          onClick={() => onMoveUp(index)}
                          disabled={index === 0}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={t('branchCategories.manage.moveUp')}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onMoveDown(index)}
                          disabled={index === branchCategories.length - 1}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={t('branchCategories.manage.moveDown')}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {(branchCategory.selectedProductsCount || 0) > 0 && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-medium">
                            <AlertCircle className="h-3.5 w-3.5" />
                            <span>{branchCategory.selectedProductsCount} {t('branchCategories.products.products')}</span>
                          </div>
                        )}
                        <div className={`flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <button
                            onClick={() => onDeleteCategory(branchCategory.branchCategoryId, branchCategory.displayName)}
                            disabled={(branchCategory.selectedProductsCount || 0) > 0}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              (branchCategory.selectedProductsCount || 0) > 0
                                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
                                : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-600'
                            }`}
                            title={
                              !categoryIsActive
                                ? 'Cannot delete inactive category'
                                : (branchCategory.selectedProductsCount || 0) > 0
                                ? t('branchCategories.messages.error.cannotDeleteTooltip', { count: branchCategory.selectedProductsCount ?? 0 })
                                : t('branchCategories.actions.delete')
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                     {/* Expand/Collapse Button */}
                    {!isReorderMode && branchCategory.products && branchCategory.products.length > 0 && (
                      <button
                        onClick={() => toggleBranchCategoryExpansion(branchCategory.categoryId)}
                        className={`p-2.5 rounded-xl mr-2 ml-2 transition-all duration-200 ${
                          expandedBranchCategories.has(branchCategory.categoryId)
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                            : 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        title={expandedBranchCategories.has(branchCategory.categoryId) ? t('SortableCategory.collapseCategory') : t('SortableCategory.expandCategory')}
                      >
                        {expandedBranchCategories.has(branchCategory.categoryId) ? (
                          <ChevronUp className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
                        ) : (
                          <ChevronDown className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
                        )}
                      </button>
                    )}
                </div>
              </div>

              {/* Products Container */}
              {renderManageProductsSection(branchCategory)}
            </div>
          );
        })}
      </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CategoriesContent;