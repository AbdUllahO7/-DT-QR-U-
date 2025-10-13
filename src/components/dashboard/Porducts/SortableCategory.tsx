import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useLanguage } from "../../../contexts/LanguageContext";
import { CSS } from "@dnd-kit/utilities";
import { Edit2, GripVertical, Loader2, Package, Trash2, Plus, Eye, EyeOff, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { SortableProduct } from "./SortableProduct";
import { Category } from "../../../types/BranchManagement/type";

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

  const getProductCountText = (count: number) => {
    if (count === 1) {
      return `${count} ${t('SortableCategory.product')}`;
    }
    return `${count} ${t('SortableCategory.products')}`;
  };

  // Modern Grid Product Card
  const GridProductCard = ({ product }: { product: any }) => {
    const hasValidImage = product.imageUrl && product.imageUrl !== 'string' && product.imageUrl.trim() !== '';
    
    return (
      <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-1">
        {/* Product Image Container */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
          {hasValidImage ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full"></div>
                <Package className="relative h-16 w-16 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Status Badge - Modern Pill */}
          <div className="absolute top-3 right-3 z-10">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border transition-all duration-200 ${
              product.isAvailable 
                ? 'bg-emerald-500/90 border-emerald-400/50 text-white shadow-lg shadow-emerald-500/25' 
                : 'bg-gray-500/90 border-gray-400/50 text-white shadow-lg shadow-gray-500/25'
            }`}>
              {product.isAvailable ? (
                <Eye className="w-3 h-3" />
              ) : (
                <EyeOff className="w-3 h-3" />
              )}
              <span>{product.isAvailable ? t('status.active') || 'Active' : t('status.inactive') || 'Inactive'}</span>
            </div>
          </div>

          {/* Action Buttons - Floating */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={() => onEditProduct(product.id)}
              className="p-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 backdrop-blur-sm"
              title={t('SortableCategory.editProduct') || 'Edit Product'}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            {onOpenAddonsManagement && (
              <button
                onClick={() => onOpenAddonsManagement(product.id, product.name)}
                className="p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
                title={t('SortableCategory.manageAddons') || 'Manage Addons'}
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onDeleteProduct(product.id)}
              className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
              title={t('SortableCategory.deleteProduct') || 'Delete Product'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Display Order Badge */}
          <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full border border-white/20">
            #{product.displayOrder}
          </div>
        </div>

        {/* Product Info - Enhanced */}
        <div className="p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 truncate text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {product.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
              {t('productsContent.currency.format', { amount: product.price.toFixed(2) })}
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
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-300 ${
        isDragging 
          ? 'shadow-2xl shadow-primary-500/25 ring-2 ring-primary-500 scale-105' 
          : 'shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700'
      } ${isRTL ? 'text-right' : 'text-left'}`}
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
            {viewMode === 'list' && (
              <button
                {...attributes}
                {...listeners}
                className="p-2.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-110"
                aria-label={t('SortableCategory.accessibility.dragHandle')}
                title={t('SortableCategory.dragCategory')}
              >
                <GripVertical className="h-5 w-5" />
              </button>
            )}
            
            <div className="flex-1 min-w-0">
              <div className={`flex items-center gap-3 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {category.categoryName}
                  {category.products.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      {category.products.length}
                    </span>
                  )}
                </h3>
                {isReorderingProducts && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-600 dark:text-primary-400" />
                    <span className="text-xs font-medium text-primary-700 dark:text-primary-300">
                      {t('SortableCategory.reorderingProducts') || 'Reordering...'}
                    </span>
                  </div>
                )}
              </div>
              {category.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons - Modern Group */}
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => onEditCategory(category.categoryId)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                title={t('SortableCategory.editCategory')}
                disabled={isReorderingProducts}
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDeleteCategory(category.categoryId)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                title={t('SortableCategory.deleteCategory')}
                disabled={isReorderingProducts}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            {/* Expand/Collapse Button */}
            {viewMode === 'list' && (
              <button
                onClick={() => onToggle(category.categoryId)}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  category.isExpanded
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                disabled={isReorderingProducts}
                title={category.isExpanded ? t('SortableCategory.collapseCategory') : t('SortableCategory.expandCategory')}
              >
                {category.isExpanded ? (
                  <ChevronUp className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
                ) : (
                  <ChevronDown className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Container */}
      {viewMode === 'list' ? (
        // List View
        category.isExpanded && (
          <div className="p-6 bg-gray-50 dark:bg-gray-900/30">
            <SortableContext items={category.products.map(p => p.id)} strategy={verticalListSortingStrategy}>
              <div className={`space-y-3 ${isReorderingProducts ? 'opacity-70 pointer-events-none' : ''}`}>
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
                  <div className="text-center py-16">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-primary-500/10 blur-2xl rounded-full"></div>
                      <Package className="relative h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">
                      {t('SortableCategory.noCategoryProducts') || 'No products yet'}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Add your first product to get started
                    </p>
                  </div>
                )}
              </div>
            </SortableContext>
          </div>
        )
      ) : (
        // Grid View
        <div className="p-6 bg-gray-50 dark:bg-gray-900/30">
          {category.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.products.map((product) => (
                <GridProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary-500/10 blur-2xl rounded-full"></div>
                <Package className="relative h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">
                {t('SortableCategory.noCategoryProducts') || 'No products yet'}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Add your first product to get started
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};