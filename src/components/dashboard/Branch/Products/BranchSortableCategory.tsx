import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useLanguage } from "../../../../contexts/LanguageContext";
import { CSS } from "@dnd-kit/utilities";
import {
  Edit2, GripVertical, Loader2, Package, Trash2, Plus, Eye, ChevronDown, ChevronUp,
  Sparkles, X, Check, DollarSign, Edit3, Puzzle, Grid3X3, AlertCircle
} from "lucide-react";
import { BranchCategory, BranchProduct, EditedProductPrice, EditedCategoryName } from "../../../../types/BranchManagement/type";
import { useState } from "react";

interface BranchSortableCategoryProps {
  branchCategory: BranchCategory;
  isDark: boolean;
  onToggle: (categoryId: number) => void;
  onDeleteCategory: (branchCategoryId: number, displayName: string) => void;
  isExpanded: boolean;
  isReordering?: boolean;
  onAddProduct: (productId: number, branchCategoryId: number) => void;
  onRemoveProduct: (branchProductId: number, productName?: string) => void;
  isLoading: boolean;
  isLoadingBranchProducts: boolean;
  editingProductId: number | null;
  editingCategoryId: number | null;
  editedProductPrices: Map<number, EditedProductPrice>;
  editedCategoryNames: Map<number, EditedCategoryName>;
  onProductPriceEdit: (productId: number, currentPrice: number) => void;
  onProductPriceChange: (productId: number, value: string) => void;
  onProductPriceSave: (productId: number) => void;
  onProductPriceCancel: (productId: number) => void;
  onCategoryNameEdit: (categoryId: number, currentName: string) => void;
  onCategoryNameChange: (categoryId: number, value: string) => void;
  onCategoryNameSave: (categoryId: number) => void;
  onCategoryNameCancel: (categoryId: number) => void;
  getProductPrice: (productId: number, originalPrice: number) => number;
  getCategoryName: (categoryId: number, originalName: string) => string;
  handleShowProductDetails: (product: BranchProduct) => void;
  handleShowProductAddons?: (product: BranchProduct) => void;
  handleShowProductExtras?: (product: BranchProduct) => void;
  isCategoryActive?: (categoryId: number) => boolean;
}

export const BranchSortableCategory: React.FC<BranchSortableCategoryProps> = ({
  branchCategory,
  isDark,
  onToggle,
  onDeleteCategory,
  isExpanded,
  isReordering = false,
  onAddProduct,
  onRemoveProduct,
  isLoading,
  isLoadingBranchProducts,
  editingProductId,
  editingCategoryId,
  editedProductPrices,
  editedCategoryNames,
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
  handleShowProductDetails,
  handleShowProductAddons,
  handleShowProductExtras,
  isCategoryActive
}) => {
  const { t, isRTL } = useLanguage();
  const [editingCategoryName, setEditingCategoryName] = useState('');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: branchCategory.branchCategoryId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const categoryIsActive = isCategoryActive ? isCategoryActive(branchCategory.categoryId) : true;
  const currentDisplayName = getCategoryName(branchCategory.categoryId, branchCategory.category.categoryName);
  const isCurrentlyEditingName = editingCategoryId === branchCategory.categoryId;
  const hasChangedName = currentDisplayName !== branchCategory.category.categoryName;

  const startEditingCategoryName = (categoryId: number, currentName: string) => {
    const displayName = getCategoryName(categoryId, currentName);
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

  // Price Editor Component
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
              className="pl-6 pr-2 py-1 w-20 text-sm border border-blue-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSave();
                if (e.key === 'Escape') onCancel();
              }}
            />
          </div>
          <button
            onClick={onSave}
            className="p-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
          >
            <Check className="h-3 w-3" />
          </button>
          <button
            onClick={onCancel}
            className="p-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-300 ${
        isDragging
          ? 'shadow-2xl shadow-primary-500/25 ring-2 ring-primary-500 scale-105'
          : 'shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700'
      } ${isRTL ? 'text-right' : 'text-left'} ${
        !categoryIsActive
          ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 opacity-75'
          : ''
      }`}
      role="article"
    >
      {/* Gradient Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"></div>

      {/* Category Header */}
      <div className="relative p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/5 to-purple-500/5 rounded-full blur-3xl -z-0"></div>

        <div className={`relative flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-4 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Drag Handle */}
            <button
              {...attributes}
              {...listeners}
              className="p-2.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-110"
              disabled={!categoryIsActive}
            >
              <GripVertical className="h-5 w-5" />
            </button>

            {/* Display Order Badge */}
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
              {branchCategory.displayOrder}
            </div>

            <div className="flex-1 min-w-0">
              <div className={`flex items-center gap-3 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {isCurrentlyEditingName ? (
                  <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                    <input
                      title="editingCategoryName"
                      type="text"
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                      className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveCategoryName(branchCategory.categoryId);
                        if (e.key === 'Escape') cancelCategoryNameEdit(branchCategory.categoryId);
                      }}
                    />
                    <button
                      onClick={() => saveCategoryName(branchCategory.categoryId)}
                      className="p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => cancelCategoryNameEdit(branchCategory.categoryId)}
                      className="p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                    <h3 className={`text-xl font-bold ${hasChangedName ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                      {currentDisplayName}
                    </h3>
                    {hasChangedName && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        (was: {branchCategory.category.categoryName})
                      </span>
                    )}
                    {categoryIsActive && (
                      <button
                        onClick={() => startEditingCategoryName(branchCategory.categoryId, currentDisplayName)}
                        className="p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                        title="Edit category name"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                    )}
                    {!categoryIsActive && (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
                        Inactive
                      </span>
                    )}
                  </div>
                )}

                {isReordering && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-600 dark:text-primary-400" />
                    <span className="text-xs font-medium text-primary-700 dark:text-primary-300">
                      {t('SortableCategory.reorderingProducts') || 'Reordering...'}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-300">
                {t('branchCategories.manage.original')} {branchCategory.category.categoryName}
              </p>

              <div className={`flex items-center space-x-4 mt-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {branchCategory.selectedProductsCount || 0}
                    </span> {t('branchCategories.manage.added')}
                  </span>
                </div>
                <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {branchCategory.unselectedProductsCount || 0}
                    </span> {t('branchCategories.manage.available')}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {t('branchCategories.manage.total')} {branchCategory.products?.length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Active/Inactive Badge */}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              branchCategory.isActive
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
              {branchCategory.isActive ? t('branchCategories.manage.active') : t('branchCategories.manage.inactive')}
            </span>

            {/* Product Count Warning */}
            {(branchCategory.selectedProductsCount || 0) > 0 && (
              <div className={`flex items-center space-x-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg text-xs ${isRTL ? 'space-x-reverse' : ''}`}>
                <AlertCircle className="h-3 w-3" />
                <span>{branchCategory.selectedProductsCount} {t('branchCategories.products.products')}</span>
              </div>
            )}

            {/* Delete Button */}
            <button
              onClick={() => onDeleteCategory(branchCategory.branchCategoryId, branchCategory.displayName)}
              disabled={(branchCategory.selectedProductsCount || 0) > 0}
              className={`p-2 rounded-lg transition-colors ${
                (branchCategory.selectedProductsCount || 0) > 0
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
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

            {/* Expand/Collapse Button */}
            {branchCategory.products && branchCategory.products.length > 0 && (
              <button
                onClick={() => onToggle(branchCategory.categoryId)}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  isExpanded
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title={isExpanded ? t('SortableCategory.collapseCategory') : t('SortableCategory.expandCategory')}
              >
                {isExpanded ? (
                  <ChevronUp className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
                ) : (
                  <ChevronDown className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Section */}
      {isExpanded && branchCategory.products && branchCategory.products.length > 0 && (
        <div className="p-6 bg-gray-50 dark:bg-gray-900/30">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branchCategory.products.map((product) => {
              const isSelected = product.isSelected;
              const hasDetailedInfo = product.ingredients || product.allergens;
              const currentPrice = getProductPrice(product.id, product.price);
              const isEditingPrice = editingProductId === product.id;

              return (
                <div
                  key={product.id}
                  className={`relative flex flex-col p-4 rounded-xl border-2 transition-all ${
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

                  {/* Product Active/Inactive Status Badge */}
                  <div className={`absolute -top-2 ${isRTL ? '-right-2' : '-left-0'}`}>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400'
                    }`}>
                      {product.status ? t('branchCategories.status.active') : t('branchCategories.status.inactive')}
                    </span>
                  </div>

                  {/* Product header with image and name */}
                  <div className={`flex items-start space-x-3 mb-3 mt-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {product.name}
                      </div>
                      {product.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                          {product.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price Editor */}
                  <div className="mb-3">
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

                  {/* Ingredients and Allergens */}
                  {hasDetailedInfo && (
                    <div className={`flex items-center space-x-2 mb-3 ${isRTL ? 'space-x-reverse' : ''}`}>
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

                  {/* Action Buttons */}
                  <div className={`flex items-center justify-between mt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {/* Left side: Action buttons */}
                    <div className={`flex space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                      {hasDetailedInfo && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowProductDetails(product);
                          }}
                          className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          title={t('branchCategories.products.viewDetails')}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}

                      {product.isSelected && product.branchProductId && handleShowProductAddons && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowProductAddons(product);
                          }}
                          disabled={isLoading}
                          className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                            product.hasAddons
                              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800/50'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                          title={`Configure Addons${product.hasAddons ? ` (${product.addonsCount})` : ''}`}
                        >
                          <Puzzle className="h-4 w-4" />
                          {product.hasAddons && (
                            <span className="ml-1 text-xs font-medium">{product.addonsCount}</span>
                          )}
                        </button>
                      )}

                      {product.isSelected && product.branchProductId && handleShowProductExtras && (
                        <button
                          onClick={() => handleShowProductExtras(product)}
                          disabled={isLoading}
                          className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          title="Extra Categories"
                        >
                          <Grid3X3 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Right side: Add/Remove Button */}
                    <div className="flex-shrink-0">
                      {categoryIsActive && product.status ? (
                        isSelected ? (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              const branchProductIdToRemove = product.branchProductId || product.id;
                              await onRemoveProduct(branchProductIdToRemove, product.name);
                            }}
                            disabled={isLoading || isLoadingBranchProducts}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              isLoading || isLoadingBranchProducts
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 hover:shadow-sm'
                            }`}
                            title={t('branchCategories.products.removeFromBranch')}
                          >
                            {isLoading || isLoadingBranchProducts ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span>Removing...</span>
                              </>
                            ) : (
                              <>
                                <X className="h-3.5 w-3.5" />
                                <span>Remove</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              const originalProductId = product.id;
                              await onAddProduct(originalProductId, branchCategory.branchCategoryId);
                            }}
                            disabled={isLoading}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              isLoading
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 hover:shadow-sm'
                            }`}
                            title={t('branchCategories.products.addToBranch')}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span>Adding...</span>
                              </>
                            ) : (
                              <>
                                <Plus className="h-3.5 w-3.5" />
                                <span>Add</span>
                              </>
                            )}
                          </button>
                        )
                      ) : (
                        <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-xs text-center cursor-not-allowed">
                          {!categoryIsActive ? 'Category Inactive' : 'Product Inactive'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Footer */}
          <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
            <div className={`flex items-center justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center space-x-6 ${isRTL ? 'space-x-reverse' : ''}`}>
                <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
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
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                {t('branchCategories.manage.total')} {branchCategory.products?.length || 0} {t('branchCategories.products.products')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
