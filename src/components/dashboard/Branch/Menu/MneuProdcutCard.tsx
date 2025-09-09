"use client"

import type React from "react"
import { Coffee, Award, Heart, Utensils, Plus, Minus, Settings } from "lucide-react"
import { useLanguage } from "../../../../contexts/LanguageContext"
import { MenuProduct } from "../../../../types/menu/type"

interface ProductCardProps {
  product: MenuProduct
  cartQuantity: number
  isFavorite: boolean
  onAddToCart: (product: MenuProduct, addons?: any[]) => void
  onRemoveFromCart: (branchProductId: number) => void
  onToggleFavorite: (branchProductId: number) => void
  onCustomize?: (product: MenuProduct) => void
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartQuantity,
  isFavorite,
  onAddToCart,
  onRemoveFromCart,
  onToggleFavorite,
  onCustomize
}) => {
  const { t } = useLanguage()
  const hasAddons = product.availableAddons && product.availableAddons.length > 0

  const handleQuickAdd = () => {
    if (hasAddons && onCustomize) {
      onCustomize(product)
    } else {
      onAddToCart(product)
    }
  }

  return (
    <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col h-full hover:-translate-y-1 hover:rotate-1">
      {/* Product Image */}
      <div className="relative h-36 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex-shrink-0 overflow-hidden">
        {product.productImageUrl ? (
          <img
            src={product.productImageUrl || "/placeholder.svg"}
            alt={product.productName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Coffee className="h-12 w-12 text-slate-400 dark:text-slate-500" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {product.isRecommended && (
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-lg backdrop-blur-sm">
              <Award className="h-2 w-2 mr-1" />
              {t('menu.chefsChoice')}
            </span>
          )}
          {hasAddons && (
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-lg backdrop-blur-sm">
              <Settings className="h-2 w-2 mr-1" />
                <h2 className="text-xl font-bold text-white">{t('productModal.customizeOrder')}</h2>
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <div className="absolute top-2 right-2">
          <button 
            onClick={() => onToggleFavorite(product.branchProductId)}
            className="w-8 h-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
          >
            <Heart className={`h-3 w-3 transition-colors ${
              isFavorite 
                ? 'text-red-500 fill-current' 
                : 'text-slate-600 dark:text-slate-400 hover:text-red-500'
            }`} />
          </button>
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {product.productName}
          </h3>

          {product.productDescription && (
            <p className="text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed text-sm">
              {product.productDescription}
            </p>
          )}
        </div>

        {/* Available Addons Preview */}
        {hasAddons && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
              {product.availableAddons!.length} addon{product.availableAddons!.length > 1 ? 's' : ''} available
            </p>
            <div className="flex flex-wrap gap-1">
              {product.availableAddons!.slice(0, 2).map((addon) => (
                <span
                  key={addon.branchProductAddonId}
                  className="text-xs bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full"
                >
                  +${addon.price}
                </span>
              ))}
              {product.availableAddons!.length > 2 && (
                <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-700/50 px-2 py-1 rounded-full">
                  +{product.availableAddons!.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Allergens */}
        <div className="mb-3 min-h-[50px] flex flex-col justify-start">
          {product.allergens && product.allergens.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.allergens.slice(0, 2).map((allergen) => (
                <span
                  key={allergen.allergenId}
                  className="inline-flex items-center text-xs bg-amber-100/80 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full border border-amber-200/50 dark:border-amber-800/50 backdrop-blur-sm shadow-sm"
                  title={allergen.name}
                >
                  <span className="mr-1 text-sm">{allergen.icon}</span>
                  {allergen.code}
                </span>
              ))}
              {product.allergens.length > 2 && (
                <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-700/50 px-2 py-1 rounded-full backdrop-blur-sm">
                  +{product.allergens.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Ingredients */}
        <div className="mb-3 min-h-[50px] flex flex-col justify-start">
          {product.ingredients && product.ingredients.length > 0 && (
            <>
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                <Utensils className="h-3 w-3 mr-1 text-orange-500" />
                {t('menu.ingredients')}
              </h4>
              <div className="flex flex-wrap gap-1">
                {product.ingredients.slice(0, 2).map((ingredient) => (
                  <span
                    key={ingredient.ingredientId}
                    className="inline-flex items-center text-xs bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-full backdrop-blur-sm shadow-sm"
                    title={ingredient.ingredientName}
                  >
                    {ingredient.ingredientName}
                  </span>
                ))}
                {product.ingredients.length > 2 && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-700/50 px-2 py-1 rounded-full backdrop-blur-sm">
                    +{product.ingredients.length - 2}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {/* Add to Cart Controls */}
          <div className="flex items-center space-x-2">
            {cartQuantity > 0 ? (
              <div className="flex items-center space-x-2 bg-slate-100/50 dark:bg-slate-700/50 backdrop-blur-sm rounded-xl p-1 border border-slate-200/50 dark:border-slate-600/50">
                <button
                  onClick={() => onRemoveFromCart(product.branchProductId)}
                  className="w-7 h-7 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-6 text-center font-bold text-sm text-slate-800 dark:text-slate-100">
                  {cartQuantity}
                </span>
                <button
                  onClick={handleQuickAdd}
                  className="w-7 h-7 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleQuickAdd}
                className="bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 hover:from-orange-600 hover:via-orange-700 hover:to-pink-600 text-white px-3 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                {hasAddons ? <Settings className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                <span className="text-xs">{hasAddons ? t('productModal.customizeOrder') : t('menu.add')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard