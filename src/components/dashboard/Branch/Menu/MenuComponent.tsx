// MenuComponent.tsx - FIXED Layout for Horizontal Categories

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
import { ProductExtraMenu } from "../../../../types/Extras/type"

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
  const [basketId, setBasketId] = useState<string | null>(null)
  
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
      setBasketId(basket.basketId)
      
    } catch (err: any) {
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
        "availableExtras",
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
  const addToBasket = async (
    product: MenuProduct, 
    addons: SelectedAddon[] = [], 
    extras: ProductExtraMenu[] = []
  ) => {
    try {
      const mainItemRequest: any = {
        branchProductId: product.branchProductId,
        quantity: 1
      }

      if (extras.length > 0) {
        mainItemRequest.extras = extras.map(extra => {
          const extraPayload: any = {
            branchProductExtraId: extra.branchProductExtraId,
            extraId: extra.extraId,
            isRemoval: extra.isRemoval
          }
          if (!extra.isRemoval) {
            extraPayload.quantity = extra.quantity
          }
          return extraPayload
        })
      }

      const mainItem = await basketService.addUnifiedItemToMyBasket(mainItemRequest)

      if (mainItem.basketItemId && addons.length > 0) {
        const addonItems = addons.map(addon => {
          const availableAddon = product.availableAddons?.find(
            a => a.branchProductAddonId === addon.branchProductAddonId
          )
          
          return {
            branchProductId: availableAddon?.addonBranchProductId || addon.branchProductAddonId,
            quantity: addon.quantity,
            parentBasketItemId: mainItem.basketItemId
          }
        })

        if (addonItems.length > 0) {
          await basketService.batchAddItemsToMyBasket(addonItems)
        }
      }

      await loadBasketItemCount()
      
    } catch (err: any) {
      console.error('❌ Error adding to basket:', err)
      if (err.response) {
        setError(err.response.data)
      }
    }
  }

  // Remove from basket function
  const removeFromBasket = async (branchProductId: number) => {
    try {
      const basket = await basketService.getMyBasket()
      const itemToRemove = basket.items.find(item => 
        item.branchProductId === branchProductId &&
        (!item.addonItems || item.addonItems.length === 0)
      )
      
      if (itemToRemove) {
        if (itemToRemove.quantity > 1) {
          await basketService.updateMyBasketItem(itemToRemove.basketItemId, {
            basketItemId: itemToRemove.basketItemId,
            basketId: basket.basketId,
            branchProductId: itemToRemove.branchProductId,
            quantity: itemToRemove.quantity - 1
          })
        } else {
          await basketService.deleteMyBasketItem(itemToRemove.basketItemId)
        }
        await loadBasketItemCount()
      }
    } catch (err: any) {
      console.error('Error removing from basket:', err)
    }
  }

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

  const findProduct = (branchProductId: number): MenuProduct | undefined => {
    if (!menuData?.categories) return undefined
    return menuData.categories
      .flatMap((cat) => cat.products)
      .find((p) => p.branchProductId === branchProductId)
  }

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

  const handleQuickAddToCart = async (product: MenuProduct) => {
    handleCustomizeProduct(product)
  }

  const handleCustomizeProduct = (product: MenuProduct) => {
    setSelectedProduct(product)
    setShowProductModal(true)
  }

  const handleModalAddToCart = async (
    product: MenuProduct, 
    addons: SelectedAddon[], 
    extras: ProductExtraMenu[]
  ) => {
    await addToBasket(product, addons, extras)
    setShowProductModal(false)
    setSelectedProduct(null)
  }

  const handleCartToggle = async () => {
    if (!showCart) {
      await loadBasketItemCount()
    }
    setShowCart(!showCart)
  }

  if (loading) return <LoadingState />
  if (error) return <ErrorState error={error} />
  if (!menuData) return null
  const filteredCategories = getFilteredCategories()

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Header 
        menuData={menuData}
        totalItems={basketItemCount}
        onCartToggle={handleCartToggle}
      />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* --- FIXED LAYOUT START --- */}
        {/* Changed from 'grid' to 'flex-col'. This removes the sidebar constraint 
            and allows the horizontal categories bar to span the full width. */}
        <div className="flex flex-col gap-6 mt-4">
          
          {/* Categories Bar - Now full width sticky top bar */}
          <CategoriesSidebar
            categories={filteredCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />

          {/* Products Grid - Now full width */}
          <div className="w-full">
            <ProductGrid
              categories={filteredCategories}
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
              cart={[]} 
              favorites={favorites}
              onAddToCart={handleQuickAddToCart}
              onRemoveFromCart={removeFromBasket}
              onToggleFavorite={toggleFavorite}
              onCategorySelect={setSelectedCategory}
              restaurantName={menuData.restaurantName}
              onCustomize={handleCustomizeProduct}
              getCartItemQuantity={getCartItemQuantity}
            />
          </div>
        </div>
        {/* --- FIXED LAYOUT END --- */}
      </div>

      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        findProduct={findProduct}
        sessionId={basketId || ''}
        restaurantPreferences={menuData.preferences}
      />

      <ProductModal
        isOpen={showProductModal}
        product={selectedProduct}
        onClose={() => {
          setShowProductModal(false)
          setSelectedProduct(null)
        }}
        onAddToCart={handleModalAddToCart}
      />

      <Footer />
    </div>
  )
}

export default MenuComponent