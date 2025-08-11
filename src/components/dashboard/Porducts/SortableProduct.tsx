import { useState, useEffect } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { Product } from "../../../types/dashboard";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit2, EyeOff, GripVertical, Package, Trash2, AlertCircle, Loader2, Plus } from "lucide-react";
import { productService } from "../../../services/productService";
import { logger } from "../../../utils/logger";
import { productAddonsService } from "../../../services/ProductAddonsService";

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

// Define Addon type
interface ProductAddon {
  id: number;
  productId: number;
  addonProductId: number;
  displayOrder: number;
  isRecommended: boolean;
  marketingText: string;
  addonProduct?: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    description?: string;
    isAvailable: boolean;
  };
}

// SortableProduct Component
export const SortableProduct: React.FC<{
  product: Product;
  isDark: boolean;
  onEdit: (productId: number) => void;
  onDelete: (productId: number) => void;
  onOpenAddonsManagement?: (productId: number, productName: string) => void; 
}> = ({ product, isDark, onEdit, onDelete, onOpenAddonsManagement }) => {
  const { t, isRTL } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [ingredientError, setIngredientError] = useState<string | null>(null);
  const [addons, setAddons] = useState<ProductAddon[]>([]);
  const [isLoadingAddons, setIsLoadingAddons] = useState(false);
  const [addonError, setAddonError] = useState<string | null>(null);

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

  // Fetch ingredients and addons when component mounts or product.id changes
  useEffect(() => {
    const loadProductData = async () => {
      setIsLoadingIngredients(true);
      setIsLoadingAddons(true);
      setIngredientError(null);
      setAddonError(null);
      
      try {
        // Load ingredients
        const fetchedIngredients = await productService.getProductIngredients(product.id);
        setIngredients(fetchedIngredients);
        logger.info('Ürün malzemeleri yüklendi', { productId: product.id, ingredientCount: fetchedIngredients.length });
      } catch (error: any) {
        logger.error('Malzemeler yüklenirken hata:', error);
        setIngredientError(t('SortableProduct.errors.loadingIngredients'));
      } finally {
        setIsLoadingIngredients(false);
      }

      try {
        // Load addons
        const fetchedAddons = await productAddonsService.getProductAddons(product.id);
        setAddons(fetchedAddons);
        logger.info('Ürün eklentileri yüklendi', { productId: product.id, addonCount: fetchedAddons.length });
      } catch (error: any) {
        logger.error('Eklentiler yüklenirken hata:', error);
        setAddonError(t('SortableProduct.errors.loadingAddons'));
      } finally {
        setIsLoadingAddons(false);
      }
    };

    loadProductData();
  }, [product.id, t]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
        isDragging ? 'shadow-lg ring-2 ring-primary-500' : ''
      } `}
      role="article"
      aria-label={t('SortableProduct.accessibility.productCard')}
    >
      <div className={`flex items-start gap-4 `}>
        <div className="flex-shrink-0">
          {hasValidImage ? (
            <img
              src={product.imageUrl}
              alt={`${t('SortableProduct.accessibility.productImage')} - ${product.name}`}
              className="w-16 h-16 rounded-lg object-cover bg-gray-200 dark:bg-gray-600"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div 
              className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center"
              aria-label={t('SortableProduct.accessibility.productImage')}
            >
              <Package className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className={`flex items-start gap-3 `}>
            <button
              {...attributes}
              {...listeners}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing mt-1"
              aria-label={t('SortableProduct.accessibility.dragHandle')}
              title={t('SortableProduct.dragProduct')}
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <div className="flex-1 min-w-0">
              <div className={`flex items-center gap-2 mb-1 `}>
                <h4 className="font-medium text-gray-900 dark:text-white truncate">{product.name}</h4>
                {!product.isAvailable && (
                  <span 
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 flex-shrink-0"
                    aria-label={t('SortableProduct.accessibility.outOfStockBadge')}
                  >
                    <EyeOff className={`h-3 w-3`} />
                    {t('SortableProduct.outOfStock')}
                  </span>
                )}
              </div>
              {product.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{product.description}</p>
              )}
              
              {/* Ingredients Display */}
              {isLoadingIngredients ? (
                <p className={`text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1 `}>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('SortableProduct.loadingIngredients')}
                </p>
              ) : ingredientError ? (
                <p className={`text-sm text-red-600 dark:text-red-400 mb-2 flex items-center gap-1 `}>
                  <AlertCircle className="h-4 w-4" />
                  {ingredientError}
                </p>
              ) : ingredients.length > 0 ? (
                <div 
                  className="text-sm text-gray-600 dark:text-gray-400 mb-2"
                  role="region"
                  aria-label={t('SortableProduct.accessibility.ingredientsList')}
                >
                  <span>{t('SortableProduct.ingredients')}:</span>
                  <div className={`flex flex-wrap gap-1 mt-1 `}>
                    {ingredients.map((ingredient, index) => (
                      <span key={ingredient.id} className="inline-flex items-center">
                        {ingredient.name}
                        {ingredient.isAllergenic && (
                          <AlertCircle 
                            className={`h-3 w-3 text-yellow-500 ${isRTL ? 'mr-1' : 'ml-1'}`}
                            aria-label={t('SortableProduct.accessibility.allergenWarning')}
                            title={t('SortableProduct.allergenic')}
                          />
                        )}
                        {index < ingredients.length - 1 && <span className={isRTL ? 'mr-1' : 'ml-1'}>,</span>}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('SortableProduct.noIngredients')}</p>
              )}

              {/* Addons Display */}
              {isLoadingAddons ? (
                <p className={`text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1 `}>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('SortableProduct.loadingAddons')}
                </p>
              ) : addonError ? (
                <p className={`text-sm text-red-600 dark:text-red-400 mb-2 flex items-center gap-1 `}>
                  <AlertCircle className="h-4 w-4" />
                  {addonError}
                </p>
              ) : addons.length > 0 ? (
                <div 
                  className="text-sm text-gray-600 dark:text-gray-400 mb-2"
                  role="region"
                  aria-label={t('SortableProduct.accessibility.addonsList')}
                >
                  <span className={`flex items-center gap-1 `}>
                    <Plus className="h-3 w-3" />
                    {t('SortableProduct.addons')} ({addons.length}):
                  </span>
                  <div className={`flex flex-wrap gap-1 mt-1 `}>
                    {addons.map((addon, index) => (
                      <span 
                        key={addon.id} 
                        className={`inline-flex items-center text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded `}
                      >
                        {addon.addonProduct?.name || `Product ${addon.addonProductId}`}
                        {addon.isRecommended && (
                          <span 
                            className={isRTL ? 'mr-1' : 'ml-1'}
                            aria-label={t('SortableProduct.accessibility.recommendedAddon')}
                            title={t('SortableProduct.recommended')}
                          >
                            ⭐
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className={`text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1 `}>
                  <Plus className="h-3 w-3" />
                  {t('SortableProduct.noAddons')}
                </p>
              )}

              <div className={`flex items-center justify-between `}>
                <span 
                  className="text-sm font-semibold text-gray-900 dark:text-white"
                  aria-label={`${t('SortableProduct.price')}: ${product.price.toFixed(2)} ₺`}
                >
                  {product.price.toFixed(2)} ₺
                </span>
                <div 
                  className={`flex items-center gap-1 `} 
                  role="group" 
                  aria-label={t('SortableProduct.accessibility.productActions')}
                >
                  {/* Addons Management Button */}
                  <button
                    onClick={() => {
              
                      if (onOpenAddonsManagement) {
                        onOpenAddonsManagement(product.id, product.name);
                      } 
                    }}
                    className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                    title={t('SortableProduct.manageAddons')}
                    aria-label={t('SortableProduct.accessibility.addonsButton')}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => onEdit(product.id)}
                    className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                    title={t('SortableProduct.editProduct')}
                    aria-label={t('SortableProduct.accessibility.editButton')}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                    title={t('SortableProduct.deleteProduct')}
                    aria-label={t('SortableProduct.accessibility.deleteButton')}
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