"use client"

import type React from "react"
import { useState } from "react"
import { 
  Coffee, 
  Award, 
  Heart, 
  Utensils, 
  Plus, 
  Minus, 
  Settings,
  Sparkles,
  Clock,
  Star,
  Info,
  ChefHat,
  Flame
} from "lucide-react"
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
  const [isHovered, setIsHovered] = useState(false)
  const hasAddons = product.availableAddons && product.availableAddons.length > 0

  console.log("product",product)

  const handleQuickAdd = () => {
    if (hasAddons && onCustomize) {
      onCustomize(product)
    } else {
      onAddToCart(product)
    }
  }

  return (
    <div 
      className="group relative bg-white dark:bg-slate-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
      }}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-orange-500/10 group-hover:via-pink-500/10 group-hover:to-purple-500/10 transition-all duration-700 rounded-3xl blur-xl"></div>
      
      {/* Product Image Section */}
      <div className="relative h-56 bg-gradient-to-br from-slate-100 via-slate-50 to-white dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 flex-shrink-0 overflow-hidden rounded-t-3xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Image */}
        {product.productImageUrl ? (
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={product.productImageUrl || "/placeholder.svg"}
              alt={product.productName}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
            />
            {/* Image Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-pink-600 rounded-full blur-2xl opacity-30"></div>
              <Coffee className="relative h-16 w-16 text-slate-300 dark:text-slate-600" />
            </div>
          </div>
        )}

        {/* Top Badges Row */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
          {/* Left Badges */}
          <div className="flex flex-col gap-2">
            {product.isRecommended && (
              <div className="relative group/badge">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full blur opacity-50"></div>
                <span className="relative flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm transform transition-transform duration-300 group-hover/badge:scale-110">
                  <Award className="h-3 w-3" />
                  <span>{t('productCard.chefsPick')}</span>
                </span>
              </div>
            )}
            
            {hasAddons && (
              <div className="relative group/badge">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-50"></div>
                <span className="relative flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm transform transition-transform duration-300 group-hover/badge:scale-110">
                  <Settings className="h-3 w-3" />
                  <span>{t('productCard.customizable')}</span>
                </span>
              </div>
            )}
          </div>

          {/* Favorite Button */}
          <button 
            onClick={() => onToggleFavorite(product.branchProductId)}
            className="relative group/fav"
          >
            <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-full blur opacity-50 group-hover/fav:opacity-100 transition-opacity"></div>
            <div className="relative w-10 h-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-slate-200/50 dark:border-slate-700/50">
              <Heart className={`h-4 w-4 transition-all duration-300 ${
                isFavorite 
                  ? 'text-red-500 fill-red-500 scale-110' 
                  : 'text-slate-600 dark:text-slate-400 group-hover/fav:text-red-500 group-hover/fav:scale-110'
              }`} />
            </div>
          </button>
        </div>

        {/* Price Tag - Floating */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl blur-lg opacity-50"></div>
            <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-xl border border-orange-200/50 dark:border-orange-800/50">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black bg-gradient-to-r from-orange-600 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                  ${product.price.toFixed(2)}
                </span>
                {hasAddons && (
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    {t('productCard.addons')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Info Section */}
      <div className="relative p-5 flex flex-col flex-1 bg-gradient-to-b from-transparent to-slate-50/30 dark:to-slate-900/30">
        {/* Product Name & Description */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">
            {product.productName}
          </h3>
          {product.productDescription && (
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {product.productDescription}
            </p>
          )}
        </div>

        {/* Available Addons Preview */}
        {hasAddons && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t('productModal.addons')}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.availableAddons!.slice(0, 3).map((addon) => (
                <div key={addon.branchProductAddonId} className="relative group/addon">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur"></div>
                  <span className="relative text-xs bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 px-2.5 py-1 rounded-lg font-semibold border border-blue-200/50 dark:border-blue-800/50 transition-transform duration-200 hover:scale-105">
                    +${addon.price.toFixed(2)} {addon.addonName}
                  </span>
                </div>
              ))}
              {product.availableAddons!.length > 3 && (
                <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg font-medium">
                  +{product.availableAddons!.length - 3} {t('productCard.more')}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Allergens & Ingredients in Tabs */}
        {(product.allergens?.length > 0 || product.ingredients?.length > 0) && (
          <div className="mb-4" >
            <div className="grid grid-cols-2 gap-3">
              {/* Allergens */}
              {product.allergens && product.allergens.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-3 border border-amber-200/50 dark:border-amber-800/50">
                  <div className="flex items-center gap-1 mb-2">
                    <Info className="h-3 w-3 text-amber-600" />
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-100">
                      {t('productCard.allergens')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {product.allergens.slice(0, 2).map((allergen) => (
                      <span
                        key={allergen.id}
                        className="text-lg"
                        title={allergen.name}
                      >
                        {allergen.icon}
                      </span>
                    ))}
                    {product.allergens.length > 2 && (
                      <span className="text-xs text-amber-700 dark:text-amber-300 font-semibold">
                        +{product.allergens.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Ingredients */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-3 border border-emerald-200/50 dark:border-emerald-800/50">
                  <div className="flex items-center gap-1 mb-2">
                    <ChefHat className="h-3 w-3 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-100">
                      {t('productCard.ingredients')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {product.ingredients.slice(0, 2).map((ingredient) => (
                      <span
                        key={ingredient.ingredientId}
                        className="text-xs bg-white/60 dark:bg-emerald-800/30 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full font-medium"
                        title={ingredient.ingredientName}
                      >
                        {ingredient.ingredientName.slice(0, 8)}
                      </span>
                    ))}
                    {product.ingredients.length > 2 && (
                      <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
                        +{product.ingredients.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto pt-4">
          {cartQuantity > 0 ? (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl blur opacity-30"></div>
              <div className="relative flex items-center justify-between bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl p-2 border-2 border-orange-200 dark:border-orange-800 shadow-lg">
                <button
                  onClick={() => onRemoveFromCart(product.branchProductId)}
                  className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110 active:scale-95"
                >
                  <Minus className="h-4 w-4" />
                </button>
                
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {cartQuantity}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    {t('productCard.inCart')}
                  </span>
                </div>
                
                <button
                  onClick={handleQuickAdd}
                  className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white rounded-xl flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110 active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleQuickAdd}
              className="relative w-full group/btn overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-600 rounded-2xl blur opacity-50 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-pink-600 hover:from-orange-600 hover:via-orange-700 hover:to-pink-700 text-white px-6 py-3.5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl font-bold text-sm border-2 border-orange-400/50 transform hover:scale-105 active:scale-95">
                {hasAddons ? (
                  <>
                    <Settings className="h-4 w-4" />
                    <span>{t('productCard.customizeOrder')}</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>{t('productCard.addToCart')}</span>
                  </>
                )}
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
            </button>
          )}
        </div>

       
      </div>

      {/* Shine Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
    </div>
  )
}

export default ProductCard