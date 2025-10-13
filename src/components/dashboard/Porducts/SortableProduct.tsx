import { useState, useEffect } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit2,  GripVertical, Package, Trash2, AlertCircle, Loader2, Plus, Sparkles, ChefHat } from "lucide-react";
import { productService } from "../../../services/productService";
import { logger } from "../../../utils/logger";
import { productAddonsService } from "../../../services/ProductAddonsService";
import { Ingredient, Product, ProductAddon } from "../../../types/BranchManagement/type";

export const SortableProduct: React.FC<{
  product: Product;
  isDark: boolean;
  onEdit: (productId: number) => void;
  onDelete: (productId: number) => void;
  onOpenAddonsManagement?: (productId: number, productName: string) => void; 
}> = ({ product, onEdit, onDelete, onOpenAddonsManagement }) => {
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
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-300 ${
        isDragging 
          ? 'shadow-2xl shadow-primary-500/20 ring-2 ring-primary-500 scale-105' 
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
          {hasValidImage ? (
            <div className="relative group/image">
              <img
                src={product.imageUrl}
                alt={`${t('SortableProduct.accessibility.productImage')} - ${product.name}`}
                className="w-24 h-24 rounded-xl object-cover bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 ring-2 ring-gray-200 dark:ring-gray-700 group-hover/image:ring-primary-300 dark:group-hover/image:ring-primary-600 transition-all duration-300"
                onError={() => setImageError(true)}
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
              {...attributes}
              {...listeners}
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
             
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                  {product.description}
                </p>
              )}
              
              {/* Ingredients Section */}
              <div className="space-y-2">
                {isLoadingIngredients ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 px-3 py-2 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
                    <span>{t('SortableProduct.loadingIngredients')}</span>
                  </div>
                ) : ingredientError ? (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <span>{ingredientError}</span>
                  </div>
                ) : ingredients.length > 0 ? (
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 px-3 py-2.5 rounded-xl border border-orange-200 dark:border-orange-800">
                    <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <ChefHat className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-xs font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide">
                        {t('SortableProduct.ingredients')}
                      </span>
                      <span className="text-xs text-orange-600 dark:text-orange-400 bg-orange-200 dark:bg-orange-800/50 px-2 py-0.5 rounded-full">
                        {ingredients.length}
                      </span>
                    </div>
                    <div className={`flex flex-wrap gap-1.5 ${isRTL ? 'justify-end' : ''}`}>
                      {ingredients.map((ingredient) => (
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
                ) : (
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 px-3 py-2 rounded-lg">
                    <ChefHat className="h-3.5 w-3.5 opacity-50" />
                    <span>{t('SortableProduct.noIngredients')}</span>
                  </div>
                )}
              </div>

              {/* Addons Section */}
              <div className="space-y-2">
                {isLoadingAddons ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 px-3 py-2 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
                    <span>{t('SortableProduct.loadingAddons')}</span>
                  </div>
                ) : addonError ? (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <span>{addonError}</span>
                  </div>
                ) : addons.length > 0 ? (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 px-3 py-2.5 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                        {t('SortableProduct.addons')}
                      </span>
                      <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-200 dark:bg-blue-800/50 px-2 py-0.5 rounded-full">
                        {addons.length}
                      </span>
                    </div>
                    <div className={`flex flex-wrap gap-1.5 ${isRTL ? 'justify-end' : ''}`}>
                      {addons.map((addon) => (
                        <span 
                          key={addon.id}
                          className="inline-flex items-center gap-1 text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800"
                        >
                          {addon.addonProduct?.name || `Product ${addon.addonProductId}`}
                          {addon.isRecommended && (
                            <span title={t('SortableProduct.recommended')}>
                              <Sparkles 
                                className="h-3 w-3 text-yellow-500"
                                aria-label={t('SortableProduct.accessibility.recommendedAddon')}
                              />
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 px-3 py-2 rounded-lg">
                    <Plus className="h-3.5 w-3.5 opacity-50" />
                    <span>{t('SortableProduct.noAddons')}</span>
                  </div>
                )}
              </div>

              {/* Footer: Price + Actions */}
              <div className={`flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                    {product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">₺</span>
                </div>

                {/* Action Buttons */}
                <div className={`flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {onOpenAddonsManagement && (
                    <button
                      onClick={() => onOpenAddonsManagement(product.id, product.name)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200 hover:scale-110"
                      title={t('SortableProduct.manageAddons')}
                      aria-label={t('SortableProduct.accessibility.addonsButton')}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => onEdit(product.id)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200 hover:scale-110"
                    title={t('SortableProduct.editProduct')}
                    aria-label={t('SortableProduct.accessibility.editButton')}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => onDelete(product.id)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-110"
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