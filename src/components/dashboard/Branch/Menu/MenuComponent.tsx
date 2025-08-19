"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  ChefHat,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  UtensilsCrossed,
  Coffee,
  Sparkles,
  Award,
  X,
  Star,
  Clock,
  MapPin,
} from "lucide-react"
import { useLanguage } from "../../../../contexts/LanguageContext"
import { branchProductService } from "../../../../services/Branch/BranchProductService"

// Interfaces matching the actual API response from getBranchMenu
interface MenuAllergen {
  allergenId: number
  code: string
  name: string
  icon: string
  presence: number
  note: string
}

interface MenuIngredient {
  id: number
  productId: number
  ingredientId: number
  ingredientName: string
  quantity: number
  unit: string
  isAllergenic: boolean
  isAvailable: boolean
  allergenIds: number[]
  allergens: MenuAllergen[]
}

interface MenuProduct {
  branchProductId: number
  productId: number
  productName: string
  productDescription: string
  productImageUrl: string
  price: number
  isRecommended: boolean
  ingredients: MenuIngredient[]
  allergens: MenuAllergen[]
  availableAddons: any[] // You can type this more specifically if needed
}

interface MenuCategory {
  categoryId: number
  categoryName: string
  displayOrder: number
  products: MenuProduct[]
}

interface BranchMenuResponse {
  branchId: number
  branchName: string
  restaurantName: string
  branchAddress: string
  isOpen: boolean
  categories: MenuCategory[]
}

interface CartItem {
  branchProductId: number
  productName: string
  price: number
  quantity: number
  productImageUrl?: string
}

interface MenuComponentProps {
  branchId: number
}

const MenuComponent: React.FC<MenuComponentProps> = ({ branchId }) => {
  const { t, isRTL } = useLanguage()

  // State management
  const [menuData, setMenuData] = useState<BranchMenuResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)

  // Function to merge duplicate categories
  const mergeDuplicateCategories = (categories: MenuCategory[]): MenuCategory[] => {
    const categoryMap = new Map<number, MenuCategory>()

    categories.forEach((category) => {
      const existingCategory = categoryMap.get(category.categoryId)

      if (existingCategory) {
        // Merge products from duplicate category
        existingCategory.products.push(...category.products)
      } else {
        // First time seeing this categoryId, create new entry
        categoryMap.set(category.categoryId, {
          categoryId: category.categoryId,
          categoryName: category.categoryName,
          displayOrder: category.displayOrder,
          products: [...category.products], // Create a copy of products array
        })
      }
    })

    // Convert map back to array and sort by displayOrder
    return Array.from(categoryMap.values()).sort((a, b) => a.displayOrder - b.displayOrder)
  }

  // Fetch menu data
  useEffect(() => {
    if (branchId) {
      fetchMenuData()
    }
  }, [branchId])

  const fetchMenuData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get branch menu with full details
      const menuResponse = await branchProductService.getBranchMenu(branchId, [
        "ingredients",
        "allergens",
        "availableAddons",
      ])

      // Note: The service might need to be updated to return the exact structure
      // For now, we'll handle both possible response formats
      if (Array.isArray(menuResponse)) {
        // If it returns an array of products, we need to group them by category
        // This would require additional logic
        setError("Menu format not supported yet. Please update the service.")
        return
      }

      // Assuming the service returns the correct structure as shown in the example
      const typedMenuData = menuResponse as unknown as BranchMenuResponse

      // Merge duplicate categories before setting state
      if (typedMenuData.categories) {
        const mergedCategories = mergeDuplicateCategories(typedMenuData.categories)

        // Update the menu data with merged categories
        const updatedMenuData = {
          ...typedMenuData,
          categories: mergedCategories,
        }

        setMenuData(updatedMenuData)

        // Set the first category as selected
        if (mergedCategories.length > 0) {
          setSelectedCategory(mergedCategories[0].categoryId)
        }
      } else {
        setMenuData(typedMenuData)
      }
    } catch (err: any) {
      console.error("Error fetching menu data:", err)
      setError("Menü yüklenemedi. Lütfen tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  // Cart functions
  const addToCart = (product: MenuProduct) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.branchProductId === product.branchProductId)
      if (existingItem) {
        return prev.map((item) =>
          item.branchProductId === product.branchProductId ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [
        ...prev,
        {
          branchProductId: product.branchProductId,
          productName: product.productName,
          price: product.price,
          quantity: 1,
          productImageUrl: product.productImageUrl,
        },
      ]
    })
  }

  const removeFromCart = (branchProductId: number) => {
    setCart((prev) => {
      return prev.reduce((acc, item) => {
        if (item.branchProductId === branchProductId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 })
          }
          // If quantity is 1, don't add it back (effectively removing it)
        } else {
          acc.push(item)
        }
        return acc
      }, [] as CartItem[])
    })
  }

  const getCartItemQuantity = (branchProductId: number): number => {
    const item = cart.find((item) => item.branchProductId === branchProductId)
    return item ? item.quantity : 0
  }

  const getTotalPrice = (): number => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  // Filter categories and products
  const getFilteredCategories = (): MenuCategory[] => {
    if (!menuData?.categories) return []

    return menuData.categories
      .filter(
        (category) =>
          category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.products.some((product) => product.productName.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      .sort((a, b) => a.displayOrder - b.displayOrder)
  }

  const getProductsForCategory = (categoryId: number): MenuProduct[] => {
    const category = menuData?.categories.find((cat) => cat.categoryId === categoryId)
    return category?.products || []
  }

  const getFilteredProducts = (products: MenuProduct[]): MenuProduct[] => {
    if (!searchTerm) return products
    return products.filter(
      (product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productDescription.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center backdrop-blur-lg">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <ChefHat className="h-10 w-10 text-white" />
            </div>
            <Loader2 className="h-10 w-10 animate-spin text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Loading Menu</h2>
            <p className="text-slate-600 dark:text-slate-400">Preparing our delicious selections...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-6">
              <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">Menu Unavailable</h2>
            <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-8 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!menuData) return null

  const filteredCategories = getFilteredCategories()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <UtensilsCrossed className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  {menuData.restaurantName}
                </h1>
                <div className="flex items-center space-x-3 mt-2">
                  <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
                    <MapPin className="h-4 w-4" />
                    <p className="text-sm">{menuData.branchName}</p>
                  </div>
                  <span className="text-slate-400 dark:text-slate-500">•</span>
                  <div className={`flex items-center space-x-2 ${menuData.isOpen ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${menuData.isOpen ? "bg-emerald-500" : "bg-red-500"}`} />
                    <span className="text-sm font-medium">{menuData.isOpen ? "Open" : "Closed"}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowCart(!showCart)}
              className="relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-10">
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Search delicious food..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 shadow-lg transition-all duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sticky top-32">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
                <Filter className="h-5 w-5 mr-2 text-orange-500" />
                Categories
              </h3>
              <div className="space-y-3">
                {filteredCategories.map((category) => (
                  <button
                    key={category.categoryId}
                    onClick={() => setSelectedCategory(category.categoryId)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                      selectedCategory === category.categoryId
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-[1.02]"
                        : "bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{category.categoryName}</span>
                      <span
                        className={`text-sm px-3 py-1 rounded-full ${
                          selectedCategory === category.categoryId
                            ? "bg-white/20 text-white"
                            : "bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {category.products.length}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {selectedCategory ? (
              <div>
                {/* Category Header */}
                {(() => {
                  const currentCategory = filteredCategories.find((cat) => cat.categoryId === selectedCategory)
                  const products = currentCategory ? getFilteredProducts(currentCategory.products) : []

                  return currentCategory ? (
                    <div className="mb-8">
                      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 rounded-3xl p-8 text-white text-center shadow-2xl">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
                          <Sparkles className="h-10 w-10" />
                        </div>
                        <h2 className="text-4xl font-bold mb-2">{currentCategory.categoryName}</h2>
                        <p className="text-orange-100">{products.length} delicious items available</p>
                      </div>
                    </div>
                  ) : null
                })()}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {(() => {
                    const currentCategory = filteredCategories.find((cat) => cat.categoryId === selectedCategory)
                    const products = currentCategory ? getFilteredProducts(currentCategory.products) : []

                    return products.map((product) => (
                      <div
                        key={product.branchProductId}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col h-full hover:-translate-y-1"
                      >
                        {/* Product Image */}
                        <div className="relative h-48 bg-slate-100 dark:bg-slate-700 flex-shrink-0 overflow-hidden">
                          {product.productImageUrl ? (
                            <img
                              src={product.productImageUrl || "/placeholder.svg"}
                              alt={product.productName}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Coffee className="h-16 w-16 text-slate-400 dark:text-slate-500" />
                            </div>
                          )}

                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex space-x-2">
                            {product.isRecommended && (
                              <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-3 py-1.5 rounded-full flex items-center shadow-lg">
                                <Award className="h-3 w-3 mr-1" />
                                Recommended
                              </span>
                            )}
                          </div>

                          <div className="absolute top-3 right-3">
                            <button className="w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl">
                              <Heart className="h-4 w-4 text-slate-600 dark:text-slate-400 hover:text-red-500" />
                            </button>
                          </div>

                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Product Info */}
                        <div className="p-6 flex flex-col flex-1">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 line-clamp-2">{product.productName}</h3>

                            {product.productDescription && (
                              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">{product.productDescription}</p>
                            )}
                          </div>

                          {/* Allergens */}
                          <div className="mb-4 min-h-[60px] flex flex-col justify-start">
                            {product.allergens && product.allergens.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {product.allergens.slice(0, 3).map((allergen) => (
                                  <span
                                    key={allergen.allergenId}
                                    className="inline-flex items-center text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800"
                                    title={allergen.name}
                                  >
                                    <span className="mr-1">{allergen.icon}</span>
                                    {allergen.code}
                                  </span>
                                ))}
                                {product.allergens.length > 3 && (
                                  <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                                    +{product.allergens.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Ingredients */}
                          <div className="mb-4 min-h-[60px] flex flex-col justify-start">
                            {product.ingredients && product.ingredients.length > 0 && (
                              <>
                                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Ingredients</h4>
                                <div className="flex flex-wrap gap-1">
                                  {product.ingredients.slice(0, 3).map((ingredient) => (
                                    <span
                                      key={ingredient.ingredientId}
                                      className="inline-flex items-center text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-full"
                                      title={ingredient.ingredientName}
                                    >
                                      {ingredient.ingredientName}
                                    </span>
                                  ))}
                                  {product.ingredients.length > 3 && (
                                    <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                                      +{product.ingredients.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </>
                            )}
                          </div>

                          {/* Price and Actions */}
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">{product.price.toFixed(2)}</span>
                            </div>

                            {/* Add to Cart Controls */}
                            <div className="flex items-center space-x-2">
                              {getCartItemQuantity(product.branchProductId) > 0 ? (
                                <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
                                  <button
                                    onClick={() => removeFromCart(product.branchProductId)}
                                    className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="w-8 text-center font-bold text-slate-800 dark:text-slate-100">
                                    {getCartItemQuantity(product.branchProductId)}
                                  </span>
                                  <button
                                    onClick={() => addToCart(product)}
                                    className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center transition-colors"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addToCart(product)}
                                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                  <Plus className="h-4 w-4" />
                                  <span>Add</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  })()}
                </div>

                {/* Empty State for Category */}
                {(() => {
                  const currentCategory = filteredCategories.find((cat) => cat.categoryId === selectedCategory)
                  const products = currentCategory ? getFilteredProducts(currentCategory.products) : []

                  return (
                    products.length === 0 && (
                      <div className="text-center py-16">
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 max-w-md mx-auto border border-slate-200 dark:border-slate-700 shadow-xl">
                          <Coffee className="h-20 w-20 text-slate-400 dark:text-slate-500 mx-auto mb-6" />
                          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
                            {searchTerm ? "No results found" : "No items in this category"}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400">
                            {searchTerm ? "Try different keywords" : "Check other categories"}
                          </p>
                        </div>
                      </div>
                    )
                  )
                })()}
              </div>
            ) : (
              /* Welcome State */
              <div className="text-center py-16">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-12 max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <UtensilsCrossed className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">{menuData.restaurantName} Menu</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                    Select a category to start exploring our delicious offerings
                  </p>
                  {filteredCategories.length > 0 && (
                    <button
                      onClick={() => setSelectedCategory(filteredCategories[0].categoryId)}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                    >
                      Explore Menu
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 h-full overflow-y-auto border-l border-slate-200 dark:border-slate-700 shadow-2xl">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-orange-500 to-orange-600">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Your Cart</h3>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {cart.length > 0 ? (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.branchProductId} className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-700 p-4 rounded-xl">
                        {item.productImageUrl && (
                          <img
                            src={item.productImageUrl || "/placeholder.svg"}
                            alt={item.productName}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800 dark:text-slate-100">{item.productName}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            ${item.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => removeFromCart(item.branchProductId)}
                            className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-bold text-slate-800 dark:text-slate-100">{item.quantity}</span>
                          <button
                            onClick={() => {
                              const product = menuData?.categories
                                .flatMap((cat) => cat.products)
                                .find((p) => p.branchProductId === item.branchProductId)
                              if (product) {
                                addToCart(product)
                              }
                            }}
                            className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-lg font-semibold text-slate-800 dark:text-slate-100">Total:</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                      Place Order
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-8">
                    <ShoppingCart className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Your cart is empty</h3>
                    <p className="text-slate-600 dark:text-slate-400">Browse the menu to add items</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MenuComponent