// Updated ProductGrid component to work with async getCartItemQuantity

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useLanguage } from "../../../../contexts/LanguageContext"
import { MenuCategory, MenuProduct } from "../../../../types/menu/type"
import ProductCard from "./MneuProdcutCard"

interface ProductGridProps {
  categories: MenuCategory[]
  selectedCategory: number | null
  searchTerm: string
  cart: any[] // No longer used but kept for compatibility
  favorites: Set<number>
  onAddToCart: (product: MenuProduct, addons?: any[]) => Promise<void>
  onRemoveFromCart: (branchProductId: number) => Promise<void>
  onToggleFavorite: (branchProductId: number) => void
  onCategorySelect: (categoryId: number) => void
  restaurantName: string
  onCustomize?: (product: MenuProduct) => void
  getCartItemQuantity: (branchProductId: number) => Promise<number>
}

const ProductGrid: React.FC<ProductGridProps> = ({
  categories,
  selectedCategory,
  searchTerm,
  favorites,
  onAddToCart,
  onRemoveFromCart,
  onToggleFavorite,
  onCategorySelect,
  onCustomize,
  getCartItemQuantity
}) => {
  const { t } = useLanguage()
  const [productQuantities, setProductQuantities] = useState<Map<number, number>>(new Map())
  const [loadingQuantities, setLoadingQuantities] = useState(false)


  // Load quantities for all visible products
  const loadQuantities = async (products: MenuProduct[]) => {
    setLoadingQuantities(true)
    const newQuantities = new Map<number, number>()
    
    try {
      // Load quantities for all products in parallel
      const quantityPromises = products.map(async (product) => {
        const quantity = await getCartItemQuantity(product.branchProductId)
        return { productId: product.branchProductId, quantity }
      })
      
      const results = await Promise.all(quantityPromises)
      results.forEach(({ productId, quantity }) => {
        newQuantities.set(productId, quantity)
      })
      
      setProductQuantities(newQuantities)
    } catch (err) {
      console.error('Error loading product quantities:', err)
    } finally {
      setLoadingQuantities(false)
    }
  }

  // Get all visible products
  const getVisibleProducts = (): MenuProduct[] => {
    let products: MenuProduct[] = []

    if (searchTerm) {
      // When searching, show all matching products
      products = categories.flatMap(category => 
        category.products.filter(product =>
          product.productName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    } else if (selectedCategory) {
      // When category is selected, show products from that category
      const category = categories.find(cat => cat.categoryId === selectedCategory)
      products = category?.products || []
    } else {
      // Show all products
      products = categories.flatMap(category => category.products)
    }

    return products
  }

  // Reload quantities when visible products change
  useEffect(() => {
    const visibleProducts = getVisibleProducts()
    if (visibleProducts.length > 0) {
      loadQuantities(visibleProducts)
    }
  }, [selectedCategory, searchTerm, categories])

  // Enhanced add to cart handler that refreshes quantities
  const handleAddToCart = async (product: MenuProduct, addons?: any[]) => {
    await onAddToCart(product, addons)
    // Refresh quantity for this specific product
    const quantity = await getCartItemQuantity(product.branchProductId)
    setProductQuantities(prev => new Map(prev).set(product.branchProductId, quantity))
  }

  // Enhanced remove from cart handler that refreshes quantities
  const handleRemoveFromCart = async (branchProductId: number) => {
    await onRemoveFromCart(branchProductId)
    // Refresh quantity for this specific product
    const quantity = await getCartItemQuantity(branchProductId)
    setProductQuantities(prev => new Map(prev).set(branchProductId, quantity))
  }

  const visibleProducts = getVisibleProducts()

  if (categories.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">
            {t('menu.noCategories')}
          </h3>
         
        </div>
      </div>
    )
  }

  if (visibleProducts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">
            {searchTerm ? t('menu.noSearchResults') : t('menu.noProducts')}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {searchTerm 
              ? `${t('menu.noSearchResultsDesc')} "${searchTerm}"`
              : t('menu.noProductsDesc')
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Show category sections when not searching */}
      {!searchTerm ? (
        categories
          .filter(category => !selectedCategory || category.categoryId === selectedCategory)
          .map((category) => (
            <div key={category.categoryId} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {category.categoryName}
                </h2>
                
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {category.products.map((product) => (
                  <ProductCard
                    key={product.branchProductId}
                    product={product}
                    cartQuantity={productQuantities.get(product.branchProductId) || 0}
                    isFavorite={favorites.has(product.branchProductId)}
                    onAddToCart={handleAddToCart}
                    onRemoveFromCart={handleRemoveFromCart}
                    onToggleFavorite={onToggleFavorite}
                    onCustomize={onCustomize}
                  />
                ))}
              </div>
            </div>
          ))
      ) : (
        /* Show search results */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {t('menu.searchResults')}
            </h2>
            <span className="text-sm text-slate-600 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-700/50 px-3 py-1 rounded-full">
              {visibleProducts.length} {visibleProducts.length === 1 ? 'result' : 'results'} for "{searchTerm}"
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.branchProductId}
                product={product}
                cartQuantity={productQuantities.get(product.branchProductId) || 0}
                isFavorite={favorites.has(product.branchProductId)}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onToggleFavorite={onToggleFavorite}
                onCustomize={onCustomize}
              />
            ))}
          </div>

          {/* Category quick navigation for search results */}
          <div className="mt-8 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              {t('menu.browseCategories')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const categoryResults = category.products.filter(product =>
                  product.productName.toLowerCase().includes(searchTerm.toLowerCase())
                )
                
                if (categoryResults.length === 0) return null
                
                return (
                  <button
                    key={category.categoryId}
                    onClick={() => {
                      onCategorySelect(category.categoryId)
                    }}
                    className="text-xs bg-white/80 dark:bg-slate-700/80 hover:bg-orange-500 hover:text-white text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg transition-all duration-200 border border-slate-200/50 dark:border-slate-600/50"
                  >
                    {category.categoryName} ({categoryResults.length})
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loadingQuantities && (
        <div className="fixed bottom-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-slate-700 dark:text-slate-300">Updating cart...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductGrid


