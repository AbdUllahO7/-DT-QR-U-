// MenuComponent.tsx - Simple restaurant status check

"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useLanguage } from "../../../../contexts/LanguageContext"
import { branchProductService } from "../../../../services/Branch/BranchProductService"
import { BranchMenuResponse, MenuCategory, MenuComponentProps, MenuProduct, SelectedAddon } from "../../../../types/menu/type"

// Import separated components
import Header from "./MenuHeaderComponent"
import SearchBar from "./MenuSearchBar"
import CategoriesSidebar from "./MenuCategoriesSidebar"
import Footer from "./MneuFooter"
import { LoadingState, ErrorState } from "./Menustate"
import ProductGrid from "./MneuProductGrid"
import CartSidebar from "./CartSideBar/MenuCartSidebar"
import ProductModal from "./MenuProductModal"
import { basketService } from "../../../../services/Branch/BasketService"

const MenuComponent: React.FC<MenuComponentProps> = ({ branchId }) => {
  const { t, isRTL } = useLanguage()

  // State management
  const [menuData, setMenuData] = useState<BranchMenuResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCart, setShowCart] = useState(false)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [basketItemCount, setBasketItemCount] = useState(0)
  const [basketId, setBasketId] = useState<string | null>(null) // Add basketId state
  
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
  
  // Load basket item count and basketId
  const loadBasketItemCount = useCallback(async () => {
    try {
      const basket = await basketService.getMyBasket()
      const totalItems = basket.items.reduce((total, item) => total + item.quantity, 0)
      setBasketItemCount(totalItems)
      console.log('Loaded basket', basket)
      setBasketId(basket.basketId) // Store basketId
      
    } catch (err: any) {
      // Ignore errors for item count - basket might not exist yet
      setBasketItemCount(0)
      setBasketId(null)
    }
  }, [])

  // Fetch menu data
  useEffect(() => {
    if (branchId) {
      fetchMenuData()
      loadBasketItemCount()
    }
  }, [branchId, loadBasketItemCount])

  const fetchMenuData = async () => {
    try {
      setLoading(true)
      setError(null)

      const menuResponse = await branchProductService.getBranchMenu(branchId, [
        "ingredients",
        "allergens",
        "availableAddons",
      ])
      
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

  // Add to basket function
  const addToBasket = async (product: MenuProduct, addons: SelectedAddon[] = []) => {
    try {
      if (addons.length > 0) {
        // First, add the main product
        const mainItem = await basketService.addUnifiedItemToMyBasket({
          branchProductId: product.branchProductId,
          quantity: 1
        })

        // Then add addons with the main item as parent
        if (mainItem.basketItemId) {
          const addonItems = addons.map(addon => {
            // Find the corresponding available addon to get the correct branchProductId
            const availableAddon = product.availableAddons?.find(
              a => a.branchProductAddonId === addon.branchProductAddonId
            )
            
            return {
              branchProductId: availableAddon?.addonBranchProductId || addon.branchProductAddonId,
              quantity: addon.quantity,
              parentBasketItemId: mainItem.basketItemId
            }
          })
          
          await basketService.batchAddItemsToMyBasket(addonItems)
        }
      } else {
        // Simple add for items without addons
        await basketService.addUnifiedItemToMyBasket({
          branchProductId: product.branchProductId,
          quantity: 1
        })
      }

      // Update basket item count and basketId
      await loadBasketItemCount()
    } catch (err: any) {
      console.error('Error adding to basket:', err)
    }
  }

  // Remove from basket function
  const removeFromBasket = async (branchProductId: number) => {
    try {
      // Get current basket to find the item to remove
      const basket = await basketService.getMyBasket()
      const itemToRemove = basket.items.find(item => 
        item.branchProductId === branchProductId &&
        (!item.addonItems || item.addonItems.length === 0) // Prefer plain items
      )
      
      if (itemToRemove) {
        if (itemToRemove.quantity > 1) {
          // Update quantity if more than 1
          await basketService.updateMyBasketItem(itemToRemove.basketItemId, {
            basketItemId: itemToRemove.basketItemId,
            basketId: basket.basketId,
            branchProductId: itemToRemove.branchProductId,
            quantity: itemToRemove.quantity - 1
          })
        } else {
          // Remove item if quantity is 1
          await basketService.deleteMyBasketItem(itemToRemove.basketItemId)
        }

        // Update basket item count
        await loadBasketItemCount()
      }
    } catch (err: any) {
      console.error('Error removing from basket:', err)
    }
  }

  // Get quantity of a specific product in basket
  const getCartItemQuantity = useCallback(async (branchProductId: number): Promise<number> => {
    try {
      const basket = await basketService.getMyBasket()
      return basket.items
        .filter(item => item.branchProductId === branchProductId && !item.isAddon)
        .reduce((total, item) => total + item.quantity, 0)
    } catch (err: any) {
      return 0
    }
  }, [])

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

  const handleModalAddToCart = async (product: MenuProduct, addons: SelectedAddon[]) => {
    await addToBasket(product, addons)
    setShowProductModal(false)
    setSelectedProduct(null)
  }

  // Handle cart toggle with basket count refresh
  const handleCartToggle = async () => {
    if (!showCart) {
      await loadBasketItemCount()
    }
    setShowCart(!showCart)
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
        totalItems={basketItemCount}
        onCartToggle={handleCartToggle}
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
              cart={[]} // No longer needed since we're using basket service
              favorites={favorites}
              onAddToCart={addToBasket}
              onRemoveFromCart={removeFromBasket}
              onToggleFavorite={toggleFavorite}
              onCategorySelect={setSelectedCategory}
              restaurantName={menuData.restaurantName}
              onCustomize={handleCustomizeProduct}
              getCartItemQuantity={getCartItemQuantity}
            />
          </div>
        </div>
      </div>

      {/* Cart Sidebar with basketId as sessionId */}
      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        findProduct={findProduct}
        sessionId={basketId || ''} // Use basketId, fallback to menuData.sessionId
        restaurantPreferences={menuData.preferences}
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