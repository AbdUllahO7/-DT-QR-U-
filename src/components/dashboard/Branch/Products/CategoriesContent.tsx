import React, { useState } from 'react';
import {
  Check,
  X,
  Search,
  Store,
  Plus,
  Save,
  RefreshCw,
  Loader2,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Package,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  Edit3,
  DollarSign
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
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { AdditionStep, CategoriesContentProps } from '../../../../types/BranchManagement/type';
import { useNavigate } from 'react-router-dom';
import { BranchSortableCategory } from './BranchSortableCategory';


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
}) => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate()
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [activeId, setActiveId] = useState<number | null>(null);

  // Drag and Drop Sensors
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
            className="p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            title="Edit price"
          >
            <Edit3 className="h-3 w-3" />
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
    isActive?: boolean; // ADD THIS
  }> = ({ categoryId, originalName, currentDisplayName, showEditButton = true, isActive = true }) => { // ADD isActive = true
    const isCurrentlyEditing = editingCategoryId === categoryId;
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
            className="p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={() => cancelCategoryNameEdit(categoryId)}
            className="p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      );
    }

    return (
      <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
        <h4 className={`text-xl font-bold ${hasChanged ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
          {currentDisplayName}
        </h4>
        {hasChanged && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            (was: {originalName})
          </span>
        )}
        {/* ADD isActive check here */}
        {showEditButton && isActive && (
          <button
            onClick={() => startEditingCategoryName(categoryId, currentDisplayName)}
            className="p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            title="Edit category name"
          >
            <Edit3 className="h-3 w-3" />
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

  // Drag and Drop Handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeId = active.id as number;
    const overId = over.id as number;

    const activeCategory = branchCategories.find(cat => cat.branchCategoryId === activeId);
    const overCategory = branchCategories.find(cat => cat.branchCategoryId === overId);

    if (activeCategory && overCategory) {
      const oldIndex = branchCategories.findIndex(cat => cat.branchCategoryId === activeId);
      const newIndex = branchCategories.findIndex(cat => cat.branchCategoryId === overId);

      if (oldIndex !== newIndex) {
        // For now, just call the existing move functions based on direction
        if (oldIndex < newIndex) {
          // Moving down - call onMoveDown multiple times
          for (let i = 0; i < (newIndex - oldIndex); i++) {
            onMoveDown(oldIndex);
          }
        } else {
          // Moving up - call onMoveUp multiple times
          for (let i = 0; i < (oldIndex - newIndex); i++) {
            onMoveUp(oldIndex);
          }
        }
      }
    }
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
                      className={`relative rounded-2xl border-2 transition-all cursor-pointer hover:shadow-lg ${
                        isSelected
                          ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                      onClick={!isEditingName ? () => onCategorySelect(category.categoryId) : undefined}
                    >
                      {isSelected && (
                        <div className={`absolute -top-2 ${isRTL ? '-left-2' : '-right-2'} w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center`}>
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}

                      <div className="p-6">
                        <div className={`flex items-start justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="flex-1">
                            <CategoryNameDisplay
                              categoryId={category.categoryId}
                              originalName={category.categoryName}
                              currentDisplayName={currentName}
                              showEditButton={false}
                            />
                            {category.description && (
                              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 mt-2">
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
                                {category.products?.length} {t('branchCategories.products.products')}
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
                                  <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform duration-200" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform duration-200" />
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
                {isReordering && (
                  <div className={`flex items-center gap-2 px-4 py-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Loader2 className="h-4 w-4 animate-spin text-primary-600 dark:text-primary-400" />
                    <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                      {t('branchCategories.manage.saving') || 'Saving order...'}
                    </span>
                  </div>
                )}
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={branchCategories.map(cat => cat.branchCategoryId)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {branchCategories.map((branchCategory) => (
                      <BranchSortableCategory
                        key={branchCategory.branchCategoryId}
                        branchCategory={branchCategory}
                        isDark={false}
                        onToggle={toggleBranchCategoryExpansion}
                        onDeleteCategory={onDeleteCategory}
                        isExpanded={expandedBranchCategories.has(branchCategory.categoryId)}
                        isReordering={isReordering}
                        onAddProduct={onAddProduct}
                        onRemoveProduct={onRemoveProduct}
                        isLoading={isLoading}
                        isLoadingBranchProducts={isLoadingBranchProducts}
                        editingProductId={editingProductId}
                        editingCategoryId={editingCategoryId}
                        editedProductPrices={editedProductPrices}
                        editedCategoryNames={editedCategoryNames}
                        onProductPriceEdit={onProductPriceEdit}
                        onProductPriceChange={onProductPriceChange}
                        onProductPriceSave={onProductPriceSave}
                        onProductPriceCancel={onProductPriceCancel}
                        onCategoryNameEdit={onCategoryNameEdit}
                        onCategoryNameChange={onCategoryNameChange}
                        onCategoryNameSave={onCategoryNameSave}
                        onCategoryNameCancel={onCategoryNameCancel}
                        getProductPrice={getProductPrice}
                        getCategoryName={getCategoryName}
                        handleShowProductDetails={handleShowProductDetails}
                        handleShowProductAddons={handleShowProductAddons}
                        handleShowProductExtras={handleShowProductExtras}
                        isCategoryActive={isCategoryActive}
                      />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay>
                  {activeId ? (
                    (() => {
                      const activeCategory = branchCategories.find(cat => cat.branchCategoryId === activeId);
                      if (activeCategory) {
                        const currentDisplayName = getCategoryName(activeCategory.categoryId, activeCategory.category.categoryName);
                        return (
                          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 rotate-3 scale-105">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{currentDisplayName}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {activeCategory.selectedProductsCount || 0} products added
                            </p>
                          </div>
                        );
                      }
                      return null;
                    })()
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CategoriesContent;