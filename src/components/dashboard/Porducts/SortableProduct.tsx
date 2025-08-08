import { useState, useEffect } from "react"; // Add useEffect
import { useLanguage } from "../../../contexts/LanguageContext";
import { Product } from "../../../types/dashboard";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit2, EyeOff, GripVertical, Package, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { productService } from "../../../services/productService";
import { logger } from "../../../utils/logger";

// Define Ingredient type (copied from ProductIngredientSelectionModal for consistency)
interface Ingredient {
  id: number;
  name: string;
  isAllergenic: boolean;
  isAvailable: boolean;
  allergenIds: number[];
  allergenDetails: AllergenDetail[];
}

interface AllergenDetail {
  allergenId: number;
  containsAllergen: boolean;
  note: string;
}

// SortableProduct Component
export const SortableProduct: React.FC<{
  product: Product;
  isDark: boolean;
  onEdit: (productId: number) => void;
  onDelete: (productId: number) => void;
}> = ({ product, isDark, onEdit, onDelete }) => {
  const { t } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [ingredientError, setIngredientError] = useState<string | null>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const hasValidImage = product.imageUrl && product.imageUrl !== 'string' && product.imageUrl.trim() !== '' && !imageError;

  // Fetch ingredients when component mounts or product.id changes
  useEffect(() => {
    const loadIngredients = async () => {
      setIsLoadingIngredients(true);
      setIngredientError(null);
      try {
        const fetchedIngredients = await productService.getProductIngredients(product.id);
        setIngredients(fetchedIngredients);
        logger.info('Ürün malzemeleri yüklendi', { productId: product.id, ingredientCount: fetchedIngredients.length });
      } catch (error: any) {
        logger.error('Malzemeler yüklenirken hata:', error);
        setIngredientError(t('Malzemeler yüklenirken bir hata oluştu.'));
      } finally {
        setIsLoadingIngredients(false);
      }
    };

    loadIngredients();
  }, [product.id, t]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
        isDragging ? 'shadow-lg ring-2 ring-primary-500' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {hasValidImage ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-16 h-16 rounded-lg object-cover bg-gray-200 dark:bg-gray-600"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
              <Package className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <button
              {...attributes}
              {...listeners}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing mt-1"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-900 dark:text-white truncate">{product.name}</h4>
                {!product.isAvailable && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 flex-shrink-0">
                    <EyeOff className="h-3 w-3 mr-1" />
                    {t('Stokta Yok')}
                  </span>
                )}
              </div>
              {product.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{product.description}</p>
              )}
              {/* Ingredients Display */}
              {isLoadingIngredients ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('Malzemeler yükleniyor...')}
                </p>
              ) : ingredientError ? (
                <p className="text-sm text-red-600 dark:text-red-400 mb-2 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {ingredientError}
                </p>
              ) : ingredients.length > 0 ? (
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex flex-wrap gap-1">
                  <span>{t('Malzemeler')}:</span>
                  {ingredients.map((ingredient, index) => (
                    <span key={ingredient.id} className="inline-flex items-center">
                      {ingredient.name}
                      {ingredient.isAllergenic && (
                        <AlertCircle className="h-3 w-3 ml-1 text-yellow-500"  />
                      )}
                      {index < ingredients.length - 1 && <span>,</span>}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('Malzeme eklenmemiş')}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {product.price.toFixed(2)} ₺
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(product.id)}
                    className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                    title={t('Ürünü düzenle')}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                    title={t('Ürünü sil')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};