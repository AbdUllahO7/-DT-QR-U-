import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useLanguage } from "../../../contexts/LanguageContext";
import { Category } from "../../../types/dashboard";
import { CSS } from "@dnd-kit/utilities";
import { Edit2, GripVertical, Loader2, Package, Trash2, Plus } from "lucide-react";
import { SortableProduct } from "./SortableProduct";

export const SortableCategory: React.FC<{
  category: Category;
  isDark: boolean;
  onToggle: (categoryId: number) => void;
  onEditProduct: (productId: number) => void;
  onDeleteProduct: (productId: number) => void;
  onEditCategory: (categoryId: number) => void;
  onDeleteCategory: (categoryId: number) => void;
  activeId: number | null;
  allCategories: Category[];
  isReorderingProducts?: boolean;
  onOpenAddonsManagement?: (productId: number, productName: string) => void;
  viewMode?: 'list' | 'grid';
}> = ({ 
  category, 
  isDark, 
  onToggle, 
  onEditProduct, 
  onDeleteProduct, 
  onEditCategory, 
  onDeleteCategory, 
  isReorderingProducts = false,
  onOpenAddonsManagement,
  viewMode = 'list'
}) => {
  const { t, isRTL } = useLanguage();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: category.categoryId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  // Helper function for product count pluralization
  const getProductCountText = (count: number) => {
    if (count === 1) {
      return `${count} ${t('SortableCategory.product')}`;
    }
    return `${count} ${t('SortableCategory.products')}`;
  };

  // Grid view product card component
  const GridProductCard = ({ product }: { product: any }) => {
    const hasValidImage = product.imageUrl && product.imageUrl !== 'string' && product.imageUrl.trim() !== '';
    
    return (
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group">
        {/* Product Image */}
        <div className="relative mb-3">
          {hasValidImage ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-32 object-cover rounded-lg bg-gray-200 dark:bg-gray-600"
            />
          ) : (
            <div className="w-full h-32 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              product.isAvailable 
                ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' 
                : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
            }`}>
              {product.isAvailable ? t('status.active') || 'Active' : t('status.inactive') || 'Inactive'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <button
              onClick={() => onEditProduct(product.id)}
              className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-lg transition-colors"
              title={t('SortableCategory.editProduct') || 'Edit Product'}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            {onOpenAddonsManagement && (
              <button
                onClick={() => onOpenAddonsManagement(product.id, product.name)}
                className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-lg transition-colors"
                title={t('SortableCategory.manageAddons') || 'Manage Addons'}
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onDeleteProduct(product.id)}
              className="p-2 bg-white/90 hover:bg-white text-red-600 rounded-lg transition-colors"
              title={t('SortableCategory.deleteProduct') || 'Delete Product'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-1 truncate">
            {product.name}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {t('productsContent.currency.format', { amount: product.price.toFixed(2) })}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              #{product.displayOrder}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${
        isDragging ? 'shadow-lg ring-2 ring-primary-500' : ''
      } ${isRTL ? 'text-right' : 'text-left'}`}
      role="article"
      aria-label={t('SortableCategory.accessibility.categoryCard')}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Only show drag handle in list view */}
            {viewMode === 'list' && (
              <button
                {...attributes}
                {...listeners}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
                aria-label={t('SortableCategory.accessibility.dragHandle')}
                title={t('SortableCategory.dragCategory')}
              >
                <GripVertical className="h-5 w-5" />
              </button>
            )}
            <div>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {category.categoryName}
                </h3>
                {/* Show loading indicator when products in this category are being reordered */}
                {isReorderingProducts && (
                  <Loader2 
                    className="w-4 h-4 animate-spin text-primary-600" 
                    aria-label={t('SortableCategory.accessibility.reorderingStatus')}
                  />
                )}
              </div>
              {category.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.description}
                </p>
              )}
            </div>
          </div>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span 
              className="text-sm text-gray-500 dark:text-gray-400"
              aria-label={t('SortableCategory.accessibility.productCount')}
            >
              {getProductCountText(category.products.length)}
            </span>
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`} role="group" aria-label={t('SortableCategory.accessibility.categoryActions')}>
              <button
                onClick={() => onEditCategory(category.categoryId)}
                className="p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                title={t('SortableCategory.editCategory')}
                aria-label={t('SortableCategory.accessibility.editCategoryButton')}
                disabled={isReorderingProducts}
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDeleteCategory(category.categoryId)}
                className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                title={t('SortableCategory.deleteCategory')}
                aria-label={t('SortableCategory.accessibility.deleteCategoryButton')}
                disabled={isReorderingProducts}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {/* Only show toggle in list view */}
            {viewMode === 'list' && (
              <button
                onClick={() => onToggle(category.categoryId)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                aria-label={t('SortableCategory.accessibility.expandToggle')}
                title={category.isExpanded ? t('SortableCategory.collapseCategory') : t('SortableCategory.expandCategory')}
                disabled={isReorderingProducts}
              >
                {category.isExpanded ? (
                  <svg className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Show reordering status message */}
        {isReorderingProducts && (
          <div className={`mt-2 text-sm text-primary-600 dark:text-primary-400 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span>{t('SortableCategory.reorderingProducts')}</span>
          </div>
        )}
      </div>

      {/* Render products based on view mode */}
      {viewMode === 'list' ? (
        // List View - Only show when expanded
        category.isExpanded && (
          <div className="p-4">
            <SortableContext items={category.products.map(p => p.id)} strategy={verticalListSortingStrategy}>
              <div className={`space-y-3 ${isReorderingProducts ? 'opacity-70' : ''}`}>
                {category.products.map((product) => (
                  <SortableProduct
                    key={product.id}
                    product={product}
                    isDark={isDark}
                    onEdit={onEditProduct}
                    onDelete={onDeleteProduct}
                    onOpenAddonsManagement={onOpenAddonsManagement}
                  />
                ))}
                {category.products.length === 0 && (
                  <div 
                    className="text-center py-8 text-gray-500 dark:text-gray-400"
                    role="status"
                    aria-label={t('SortableCategory.accessibility.emptyCategory')}
                  >
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{t('SortableCategory.noCategoryProducts')}</p>
                  </div>
                )}
              </div>
            </SortableContext>
          </div>
        )
      ) : (
        // Grid View - Always show products
        <div className="p-4">
          {category.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {category.products.map((product) => (
                <GridProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div 
              className="text-center py-8 text-gray-500 dark:text-gray-400"
              role="status"
              aria-label={t('SortableCategory.accessibility.emptyCategory')}
            >
              <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t('SortableCategory.noCategoryProducts')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};