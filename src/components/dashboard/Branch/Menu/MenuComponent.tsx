"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useLanguage } from "../../../../contexts/LanguageContext"
import { branchProductService } from "../../../../services/Branch/BranchProductService"
import { BranchMenuResponse, MenuCategory, MenuComponentProps, MenuProduct } from "../../../../types/menu/type"

// Import separated components
import Header from "./MenuHeaderComponent"
import SearchBar from "./MenuSearchBar"
import CategoriesSidebar from "./MenuCategoriesSidebar"
import Footer from "./MneuFooter"
import { LoadingState, ErrorState } from "./Menustate"
import ProductGrid from "./MneuProductGrid"
import CartSidebar from "./MenuCartSidebar"
import ProductModal from "./MenuProductModal"

// Updated CartItem interface to include addons
interface CartItemAddon {
  branchProductAddonId: number
  addonName: string
  price: number
  quantity: number
  maxQuantity?: number
}

interface CartItem {
  branchProductId: number
  productName: string
  price: number
  quantity: number
  productImageUrl?: string
  addons?: CartItemAddon[]
  totalItemPrice: number // includes base price + addons
}

interface SelectedAddon {
  branchProductAddonId: number
  addonName: string
  price: number
  quantity: number
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
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  
  // Modal state
  const [showProductModal, setShowProductModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<MenuProduct | null>(null)

  // Function to merge duplicate categories
  const mergeDuplicateCategories = (categories: MenuCategory[]): MenuCategory[] => {
    const categoryMap = new Map<number, MenuCategory>()

    categories.forEach((category) => {
      const existingCategory = categoryMap.get(category.categoryId)

      if (existingCategory) {
        existingCategory.products.push(...category.products)
      } else {
        categoryMap.set(category.categoryId, {
          categoryId: category.categoryId,
          categoryName: category.categoryName,
          displayOrder: category.displayOrder,
          products: [...category.products],
        })
      }
    })

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

      const menuResponse = await branchProductService.getBranchMenu(branchId, [
        "ingredients",
        "allergens",
        "availableAddons",
      ])
      console.log("Fetched menu data:", menuResponse)
      if (Array.isArray(menuResponse)) {
        setError("Menu format not supported yet. Please update the service.")
        return
      }

      const typedMenuData = menuResponse as unknown as BranchMenuResponse

      if (typedMenuData.categories) {
        const mergedCategories = mergeDuplicateCategories(typedMenuData.categories)

        const updatedMenuData = {
          ...typedMenuData,
          categories: mergedCategories,
        }

        setMenuData(updatedMenuData)

        if (mergedCategories.length > 0) {
          setSelectedCategory(mergedCategories[0].categoryId)
        }
      } else {
        setMenuData(typedMenuData)
      }
    } catch (err: any) {
      console.error("Error fetching menu data:", err)
      setError("Unable to load menu. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Helper function to check if two addon arrays are the same
  const areAddonsEqual = (addons1: CartItemAddon[], addons2: CartItemAddon[]): boolean => {
    if (addons1.length !== addons2.length) return false
    
    const sorted1 = [...addons1].sort((a, b) => a.branchProductAddonId - b.branchProductAddonId)
    const sorted2 = [...addons2].sort((a, b) => a.branchProductAddonId - b.branchProductAddonId)
    
    return sorted1.every((addon, index) => {
      const other = sorted2[index]
      return addon.branchProductAddonId === other.branchProductAddonId && 
             addon.quantity === other.quantity
    })
  }

  // Updated cart functions to handle addons intelligently
  const addToCart = (product: MenuProduct, addons: SelectedAddon[] = []) => {
    const cartAddons: CartItemAddon[] = addons.map(addon => {
      // Find max quantity from product's available addons
      const availableAddon = product.availableAddons?.find(a => a.branchProductAddonId === addon.branchProductAddonId)
      return {
        branchProductAddonId: addon.branchProductAddonId,
        addonName: addon.addonName,
        price: addon.price,
        quantity: addon.quantity,
        maxQuantity: availableAddon?.maxQuantity
      }
    })

    const addonsPrice = cartAddons.reduce((total, addon) => total + (addon.price * addon.quantity), 0)
    const totalItemPrice = product.price + addonsPrice

    setCart((prev) => {
      // For items with no addons, find existing plain item and increment
      if (cartAddons.length === 0) {
        const existingPlainItemIndex = prev.findIndex(item => 
          item.branchProductId === product.branchProductId &&
          (!item.addons || item.addons.length === 0)
        )

        if (existingPlainItemIndex >= 0) {
          return prev.map((item, index) =>
            index === existingPlainItemIndex 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        }
      } else {
        // For items with addons, find matching configuration
        const existingItemIndex = prev.findIndex(item => 
          item.branchProductId === product.branchProductId &&
          item.addons && 
          areAddonsEqual(item.addons, cartAddons)
        )

        if (existingItemIndex >= 0) {
          return prev.map((item, index) =>
            index === existingItemIndex 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        }
      }

      // Add new item if no matching configuration found
      return [
        ...prev,
        {
          branchProductId: product.branchProductId,
          productName: product.productName,
          price: product.price,
          quantity: 1,
          productImageUrl: product.productImageUrl,
          addons: cartAddons.length > 0 ? cartAddons : undefined,
          totalItemPrice
        },
      ]
    })
  }

  const removeFromCart = (cartIndex: number) => {
    setCart((prev) => {
      return prev.reduce((acc, item, index) => {
        if (index === cartIndex) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 })
          }
          // If quantity is 1, don't add it back (remove it)
        } else {
          acc.push(item)
        }
        return acc
      }, [] as CartItem[])
    })
  }

  const updateCartItem = (cartIndex: number, updatedItem: CartItem) => {
    setCart((prev) => {
      return prev.map((item, index) => 
        index === cartIndex ? updatedItem : item
      )
    })
  }

  const removeCartItem = (cartIndex: number) => {
    setCart((prev) => prev.filter((_, index) => index !== cartIndex))
  }

  const mergeCartItems = (targetIndex: number, sourceIndex: number) => {
    console.log('Merging items:', targetIndex, sourceIndex)
    setCart((prev) => {
      if (targetIndex >= prev.length || sourceIndex >= prev.length) {
        console.error('Invalid indices for merge')
        return prev
      }

      const target = prev[targetIndex]
      const source = prev[sourceIndex]
      
      if (!target || !source) {
        console.error('Target or source item not found')
        return prev
      }
      
      // Merge quantities into target item
      const updatedTarget = {
        ...target,
        quantity: target.quantity + source.quantity
      }
      
      // Create new array with updated target and without source
      const newCart = prev
        .map((item, index) => index === targetIndex ? updatedTarget : item)
        .filter((_, index) => index !== sourceIndex)
      
      console.log('Merge completed')
      return newCart
    })
  }

  const toggleFavorite = (branchProductId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(branchProductId)) {
        newFavorites.delete(branchProductId)
      } else {
        newFavorites.add(branchProductId)
      }
      return newFavorites
    })
  }

  const getTotalPrice = (): number => {
    return cart.reduce((total, item) => total + (item.totalItemPrice * item.quantity), 0)
  }

  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  // Get quantity of a specific product in cart (regardless of addons)
  const getCartItemQuantity = (branchProductId: number): number => {
    return cart
      .filter(item => item.branchProductId === branchProductId)
      .reduce((total, item) => total + item.quantity, 0)
  }

  // Helper function to find a product by ID
  const findProduct = (branchProductId: number): MenuProduct | undefined => {
    if (!menuData?.categories) return undefined
    return menuData.categories
      .flatMap((cat) => cat.products)
      .find((p) => p.branchProductId === branchProductId)
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

  // Handle product customization
  const handleCustomizeProduct = (product: MenuProduct) => {
    setSelectedProduct(product)
    setShowProductModal(true)
  }

  const handleModalAddToCart = (product: MenuProduct, addons: SelectedAddon[]) => {
    addToCart(product, addons)
    setShowProductModal(false)
    setSelectedProduct(null)
  }

  // Loading state
  if (loading) {
    return <LoadingState />
  }

  // Error state
  if (error) {
    return <ErrorState error={error} />
  }

  if (!menuData) return null

  const filteredCategories = getFilteredCategories()

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <Header 
        menuData={menuData}
        totalItems={getTotalItems()}
        onCartToggle={() => setShowCart(!showCart)}
      />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <CategoriesSidebar
            categories={filteredCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductGrid
              categories={filteredCategories}
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
              cart={cart}
              favorites={favorites}
              onAddToCart={addToCart}
              onRemoveFromCart={(branchProductId: number) => {
                // For simple remove, remove from first matching plain item
                const plainItemIndex = cart.findIndex(item => 
                  item.branchProductId === branchProductId && 
                  (!item.addons || item.addons.length === 0)
                )
                if (plainItemIndex >= 0) {
                  removeFromCart(plainItemIndex)
                } else {
                  // If no plain item, remove from first matching item
                  const itemIndex = cart.findIndex(item => item.branchProductId === branchProductId)
                  if (itemIndex >= 0) {
                    removeFromCart(itemIndex)
                  }
                }
              }}
              onToggleFavorite={toggleFavorite}
              onCategorySelect={setSelectedCategory}
              restaurantName={menuData.restaurantName}
              onCustomize={handleCustomizeProduct}
              getCartItemQuantity={getCartItemQuantity}
            />
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={showCart}
        cart={cart}
        totalPrice={getTotalPrice()}
        onClose={() => setShowCart(false)}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onUpdateCartItem={updateCartItem}
        onRemoveCartItem={removeCartItem}
        onMergeCartItems={mergeCartItems}
        findProduct={findProduct}
      />

      {/* Product Customization Modal */}
      <ProductModal
        isOpen={showProductModal}
        product={selectedProduct}
        onClose={() => {
          setShowProductModal(false)
          setSelectedProduct(null)
        }}
        onAddToCart={handleModalAddToCart}
      />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default MenuComponent