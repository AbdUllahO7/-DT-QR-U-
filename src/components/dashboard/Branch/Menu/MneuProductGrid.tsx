"use client"

import type React from "react"
import { Sparkles, Coffee, UtensilsCrossed } from "lucide-react"
import { useLanguage } from "../../../../contexts/LanguageContext"
import { MenuCategory, MenuProduct } from "../../../../types/menu/type"
import ProductCard from "./MneuProdcutCard"

interface SelectedAddon {
  branchProductAddonId: number
  addonName: string
  price: number
  quantity: number
}

interface CartItem {
  branchProductId: number
  productName: string
  price: number
  quantity: number
  productImageUrl?: string
  addons?: any[]
  totalItemPrice: number
}

interface ProductGridProps {
  categories: MenuCategory[]
  selectedCategory: number | null
  searchTerm: string
  cart: CartItem[]
  favorites: Set<number>
  onAddToCart: (product: MenuProduct, addons?: SelectedAddon[]) => void
  onRemoveFromCart: (branchProductId: number) => void
  onToggleFavorite: (branchProductId: number) => void
  onCategorySelect: (categoryId: number) => void
  restaurantName: string
  onCustomize?: (product: MenuProduct) => void
  getCartItemQuantity: (branchProductId: number) => number
}

const ProductGrid: React.FC<ProductGridProps> = ({
  categories,
  selectedCategory,
  searchTerm,
  cart,
  favorites,
  onAddToCart,
  onRemoveFromCart,
  onToggleFavorite,
  onCategorySelect,
  restaurantName,
  onCustomize,
  getCartItemQuantity
}) => {
  const { t } = useLanguage()

  const getFilteredProducts = (products: MenuProduct[]): MenuProduct[] => {
    if (!searchTerm) return products
    return products.filter(
      (product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productDescription.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Find the selected category
  const currentCategory = categories.find((cat) => cat.categoryId === selectedCategory)
  const products = currentCategory ? getFilteredProducts(currentCategory.products) : []

  if (!selectedCategory) {
    // Welcome State
    return (
      <div className="text-center py-12">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-10 max-w-md mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 via-orange-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <UtensilsCrossed className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            {restaurantName} {t('menu.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed text-sm">
            {t('menu.selectCategory')}
          </p>
          {categories.length > 0 && (
            <button
              onClick={() => onCategorySelect(categories[0].categoryId)}
              className="bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 hover:from-orange-600 hover:via-orange-700 hover:to-pink-600 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-bold text-sm transform hover:scale-105"
            >
              {t('menu.exploreMenu')}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Category Header */}
      {currentCategory && (
        <div className="mb-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 rounded-2xl p-6 text-white text-center shadow-lg">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl mb-4 shadow-lg">
                <Sparkles className="h-7 w-7 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{currentCategory.categoryName}</h2>
              <p className="text-orange-100 text-sm">
                {products.length} {t('menu.deliciousItems')} {products.length === 1 ? t('menu.item') : t('menu.items')} {t('menu.available')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.branchProductId}
              product={product}
              cartQuantity={getCartItemQuantity(product.branchProductId)}
              isFavorite={favorites.has(product.branchProductId)}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onToggleFavorite={onToggleFavorite}
              onCustomize={onCustomize}
            />
          ))}
        </div>
      ) : (
        // Empty State for Category
        <div className="text-center py-12">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-10 max-w-md mx-auto border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Coffee className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">
              {searchTerm ? t('menu.noResults') : t('menu.noItemsCategory')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {searchTerm ? t('menu.noResultsDesc') : t('menu.noItemsCategoryDesc')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductGrid