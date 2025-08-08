import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useLanguage } from "../../../contexts/LanguageContext";
import { Category } from "../../../types/dashboard";
import { CSS } from "@dnd-kit/utilities";
import { Edit2, GripVertical, Loader2, Package, Trash2 } from "lucide-react";
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
  isReorderingProducts?: boolean; // Add this prop
}> = ({ 
  category, 
  isDark, 
  onToggle, 
  onEditProduct, 
  onDeleteProduct, 
  onEditCategory, 
  onDeleteCategory, 
  activeId, 
  allCategories,
  isReorderingProducts = false // Add this prop with default value
}) => {
  const { t } = useLanguage();
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${
        isDragging ? 'shadow-lg ring-2 ring-primary-500' : ''
      }`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              {...attributes}
              {...listeners}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.categoryName}</h3>
                {/* Show loading indicator when products in this category are being reordered */}
                {isReorderingProducts && (
                  <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                )}
              </div>
              {category.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {category.products.length} {t('ürün')}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEditCategory(category.categoryId)}
                className="p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                title={t('Kategoriyi düzenle')}
                disabled={isReorderingProducts} // Disable during reordering
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDeleteCategory(category.categoryId)}
                className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                title={t('Kategoriyi sil')}
                disabled={isReorderingProducts} // Disable during reordering
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => onToggle(category.categoryId)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              disabled={isReorderingProducts} // Disable during reordering
            >
              {category.isExpanded ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Show reordering status message */}
        {isReorderingProducts && (
          <div className="mt-2 text-sm text-primary-600 dark:text-primary-400 flex items-center gap-2">
            <span>{t('Ürün sıralaması kaydediliyor...')}</span>
          </div>
        )}
      </div>

      {category.isExpanded && (
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
                />
              ))}
              {category.products.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{t('Bu kategoride henüz ürün yok.')}</p>
                </div>
              )}
            </div>
          </SortableContext>
        </div>
      )}
    </div>
  );
};