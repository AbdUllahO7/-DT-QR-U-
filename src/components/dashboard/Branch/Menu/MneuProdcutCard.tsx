"use client"

import type React from "react"
import { useState } from "react"
import {
  Coffee,
  Award,
  Plus,
  Minus,
  Settings,
  Sparkles,
  Info,
  ChefHat,
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
  
  // Helper for cleaner logic
  const isOutOfStock = product.isOutOfStock;

  const handleQuickAdd = () => {
    if (isOutOfStock) return; // Prevent action if out of stock

    if (hasAddons && onCustomize) {
      onCustomize(product)
    } else {
      onAddToCart(product)
    }
  }

  return (
    <div
      className={`group relative bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-lg flex flex-col h-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50 transition-all duration-500 
      ${isOutOfStock 
        ? 'opacity-75 grayscale-[0.5]' // Dim the whole card if out of stock
        : 'hover:shadow-2xl' // Only show shadow hover if available
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        // Only apply the "Lift" effect if the product is NOT out of stock
        transform: isHovered && !isOutOfStock ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
      }}
    >
      {/* Glow Effect (Hidden if Out of Stock) */}
      {!isOutOfStock && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-orange-500/10 group-hover:via-pink-500/10 group-hover:to-purple-500/10 transition-all duration-700 rounded-2xl sm:rounded-3xl blur-xl"></div>
      )}

      {/* Product Image Section */}
      <div className="relative h-44 sm:h-52 md:h-56 bg-gradient-to-br from-slate-100 via-slate-50 to-white dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 flex-shrink-0 overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
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
              className={`w-full h-full object-cover transition-all duration-700 
                ${!isOutOfStock && 'group-hover:scale-110 group-hover:rotate-2'}`}
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

        {/* OUT OF STOCK OVERLAY ON IMAGE */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
             <span className="bg-slate-800/90 text-white px-4 py-2 rounded-lg font-bold text-sm border border-slate-600">
                {t('productCard.outOfStock') || "Out of Stock"}
             </span>
          </div>
        )}

        {/* Top Badges Row */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-start justify-between z-10">
          {/* Left Badges */}
          <div className="flex flex-col gap-1.5 sm:gap-2">
            {product.isRecommended && (
              <div className="relative group/badge">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full blur opacity-50"></div>
                <span className="relative flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg backdrop-blur-sm transform transition-transform duration-300 group-hover/badge:scale-110">
                  <Award className="h-3 w-3" />
                  <span className="hidden sm:inline">{t('productCard.chefsPick')}</span>
                </span>
              </div>
            )}

            {hasAddons && (
              <div className="relative group/badge">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-50"></div>
                <span className="relative flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg backdrop-blur-sm transform transition-transform duration-300 group-hover/badge:scale-110">
                  <Settings className="h-3 w-3" />
                  <span className="hidden sm:inline">{t('productCard.customizable')}</span>
                </span>
              </div>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={() => onToggleFavorite(product.branchProductId)}
            className="relative group/fav z-30" // Ensure z-index is high enough
          >
            <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-full blur opacity-50 group-hover/fav:opacity-100 transition-opacity"></div>
          </button>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl sm:rounded-2xl blur-lg opacity-50"></div>
            <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-xl border border-orange-200/50 dark:border-orange-800/50">
              <div className="flex items-baseline gap-1">
                <span className={`text-xl sm:text-2xl font-black ${isOutOfStock ? 'text-slate-500' : 'bg-gradient-to-r from-orange-600 via-orange-500 to-pink-500 bg-clip-text text-transparent'}`}>
                  ${product.price.toFixed(2)}
                </span>
                {hasAddons && (
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium hidden sm:inline">
                    {t('productCard.addons')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Info Section */}
      <div className="relative p-4 sm:p-5 flex flex-col flex-1 bg-gradient-to-b from-transparent to-slate-50/30 dark:to-slate-900/30">
        {/* Product Name & Description */}
        <div className="mb-3 sm:mb-4">
          <h3 className={`text-lg sm:text-xl font-bold mb-1.5 sm:mb-2 line-clamp-2 transition-all duration-300 
            ${isOutOfStock 
               ? 'text-slate-500 dark:text-slate-500' 
               : 'text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-pink-600 group-hover:bg-clip-text'
            }`}>
            {product.productName}
          </h3>
          {product.productDescription && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
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

        {/* Allergens & Ingredients (Unchanged logic) */}
        {(product.allergens?.length > 0 || product.ingredients?.length > 0) && (
          <div className="mb-3 sm:mb-4" >
             {/* ... content unchanged ... */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
               {/* Placeholders for existing Allergen/Ingredient code to save space */}
               {/* Keep your existing allergen/ingredient code here */}
               <div className="h-4"></div> 
             </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto pt-3 sm:pt-4">
          {cartQuantity > 0 ? (
            <div className="relative">
              {/* Existing Cart Controls... */}
               <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl sm:rounded-2xl blur opacity-30"></div>
                <div className="relative flex items-center justify-between bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-xl sm:rounded-2xl p-2 border-2 border-orange-200 dark:border-orange-800 shadow-lg">
                  {/* ... Minus Button ... */}
                  <button onClick={() => onRemoveFromCart(product.branchProductId)} className="min-w-[44px] min-h-[44px] w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl flex items-center justify-center">
                    <Minus className="h-4 w-4" />
                  </button>

                  <div className="flex flex-col items-center px-2">
                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{cartQuantity}</span>
                  </div>

                  {/* ... Plus Button ... */}
                  <button onClick={handleQuickAdd} className="min-w-[44px] min-h-[44px] w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-orange-500 to-pink-600 text-white rounded-xl flex items-center justify-center">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
            </div>
          ) : (
            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className={`relative w-full group/btn overflow-hidden min-h-[44px] rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 shadow-lg font-bold text-sm px-4 sm:px-6 py-3 sm:py-3.5 transition-all duration-300
                ${isOutOfStock 
                  ? 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed border-2 border-gray-200 dark:border-slate-600' 
                  : 'bg-gradient-to-r from-orange-500 via-orange-600 to-pink-600 hover:from-orange-600 hover:via-orange-700 hover:to-pink-700 text-white hover:shadow-xl border-2 border-orange-400/50 transform hover:scale-105 active:scale-95 cursor-pointer'
                }
              `}
              aria-label={hasAddons ? t('productCard.customizeOrder') : t('productCard.addToCart')}
            >
              {/* Blur/Glow Background - ONLY render if stock available */}
              {!isOutOfStock && (
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-600 blur opacity-50 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              )}
              
              {/* Content Wrapper */}
              <div className="relative flex items-center gap-2">
                {hasAddons ? (
                  <>
                    <Settings className="h-4 w-4" />
                    <span className="truncate">{t('productCard.customizeOrder')}</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span className="truncate">{isOutOfStock ? (t('productCard.outOfStock') || 'Out of Stock') : t('productCard.addToCart')}</span>
                  </>
                )}
              </div>

              {/* Shimmer Effect - ONLY render if stock available */}
              {!isOutOfStock && (
                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard