"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { ShoppingCart, X, Plus, Minus, Settings, Trash2, Merge, ArrowRight, Loader2 } from "lucide-react"
import { useLanguage } from "../../../../contexts/LanguageContext"
import { MenuProduct } from "../../../../types/menu/type"
import { basketService, UpdateBasketItemDto } from "../../../../services/Branch/BasketService"

interface CartItemAddon {
  branchProductAddonId: number
  addonName: string
  price: number
  quantity: number
  maxQuantity?: number
  basketItemId?: number // Add basketItemId for addon control
}

interface CartItem {
  basketItemId?: number
  branchProductId: number
  productName: string
  price: number
  quantity: number
  productImageUrl?: string
  addons?: CartItemAddon[]
  totalItemPrice: number
}

interface GroupedCartItem {
  product: {
    branchProductId: number
    productName: string
    price: number
    productImageUrl?: string
  }
  variants: Array<{
    basketItemId?: number
    cartIndex: number
    quantity: number
    addons?: CartItemAddon[]
    totalItemPrice: number
    isPlain: boolean
  }>
  totalQuantity: number
  totalPrice: number
}

interface SelectedAddon {
  branchProductAddonId: number
  addonName: string
  price: number
  quantity: number
}

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  findProduct: (branchProductId: number) => MenuProduct | undefined
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  findProduct
}) => {
  const { t } = useLanguage()
  
  // State management
  const [cart, setCart] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [basketId, setBasketId] = useState<string | null>(null)

  // Calculate total price whenever cart changes
  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + (item.totalItemPrice * item.quantity), 0)
    setTotalPrice(total)
  }, [cart])

  // Load basket when sidebar opens
  useEffect(() => {
    if (isOpen) {
      loadBasket()
    }
  }, [isOpen])

 const loadBasket = async () => {
  try {
    setLoading(true)
    setError(null)
    
    const basket = await basketService.getMyBasket()
    setBasketId(basket.basketId)
    
    // Convert API basket items to cart items
    const cartItems: CartItem[] = basket.items.map(item => ({
      basketItemId: item.basketItemId,
      branchProductId: item.branchProductId,
      productName: item.productName || '',
      price: item.price || 0,
      quantity: item.quantity,
      productImageUrl: item.imageUrl,
      addons: item.addonItems?.map(addon => ({
        branchProductAddonId: addon.branchProductId, // ✅ Use the actual branchProductId, not basketItemId
        addonName: addon.productName || '',
        price: addon.price || 0,
        quantity: addon.quantity,
        maxQuantity: undefined,
        basketItemId: addon.basketItemId // ✅ Keep basketItemId for control purposes
      })),
      totalItemPrice: item.totalPrice || 0
    }))
    
    setCart(cartItems)
  } catch (err: any) {
    console.error('Error loading basket:', err)
    setError('Failed to load basket')
  } finally {
    setLoading(false)
  }
}



  const removeFromBasket = async (basketItemId: number) => {
    try {
      setLoading(true)
      setError(null)

      await basketService.deleteMyBasketItem(basketItemId)
      await loadBasket()
    } catch (err: any) {
      console.error('Error removing from basket:', err)
      setError('Failed to remove item from basket')
    } finally {
      setLoading(false)
    }
  }

const updateBasketItemQuantity = async (basketItemId: number, newQuantity: number) => {
  if (newQuantity <= 0) {
    await removeFromBasket(basketItemId)
    return
  }

  try {
    setLoading(true)
    setError(null)

    const cartItem = cart.find(item => item.basketItemId === basketItemId)
    if (!cartItem || !basketId) {
      console.error('Cart item not found or missing basketId')
      return
    }

    console.log('Updating parent item quantity:', {
      basketItemId,
      currentQuantity: cartItem.quantity,
      newQuantity,
      branchProductId: cartItem.branchProductId
    })

    // Use the same format as addons - the API expects this structure
    await basketService.updateMyBasketItem(basketItemId, {
      basketItemId,
      basketId,
      branchProductId: cartItem.branchProductId,
      quantity: newQuantity
    })

    await loadBasket()
  } catch (err: any) {
    console.error('Error updating basket item:', err)
    setError('Failed to update item quantity')
  } finally {
    setLoading(false)
  }
}

// Fix the updateAddonQuantity function to prevent doubling:

const updateAddonQuantity = async (addonBasketItemId: number, newQuantity: number) => {
  if (newQuantity <= 0) {
    await removeFromBasket(addonBasketItemId)
    return
  }

  try {
    setLoading(true)
    setError(null)

    // Find the addon in the cart structure
    let addonItem: CartItemAddon | null = null
    let parentCartItem: CartItem | null = null

    for (const cartItem of cart) {
      if (cartItem.addons) {
        const foundAddon = cartItem.addons.find(addon => addon.basketItemId === addonBasketItemId)
        if (foundAddon) {
          addonItem = foundAddon
          parentCartItem = cartItem
          break
        }
      }
    }

    if (!addonItem || !parentCartItem) {
      console.error('Addon item not found')
      return
    }

    console.log('Current addon quantity:', addonItem.quantity)
    console.log('Target new quantity:', newQuantity)
    
    // Calculate the difference instead of replacing completely
    const quantityDifference = newQuantity - addonItem.quantity
    console.log('Quantity difference:', quantityDifference)
    
    if (quantityDifference === 0) {
      console.log('No change needed')
      return
    }
    
    if (quantityDifference > 0) {
      // Need to add more
      console.log('Adding', quantityDifference, 'more addons')
      
      const addonItems = [{
        branchProductId: addonItem.branchProductAddonId,
        quantity: quantityDifference, // Only add the difference
        parentBasketItemId: parentCartItem.basketItemId
      }]
      
      await basketService.batchAddItemsToMyBasket(addonItems)
    } else {
      // Need to remove some - this is trickier
      // For now, let's use the delete/re-add approach only for decreases
      console.log('Decreasing quantity from', addonItem.quantity, 'to', newQuantity)
      
      await basketService.deleteMyBasketItem(addonBasketItemId)
      
      if (newQuantity > 0) {
        const addonItems = [{
          branchProductId: addonItem.branchProductAddonId,
          quantity: newQuantity,
          parentBasketItemId: parentCartItem.basketItemId
        }]
        
        await basketService.batchAddItemsToMyBasket(addonItems)
      }
    }
    
    // Reload the basket
    await loadBasket()
    
    console.log('Addon quantity updated successfully')
    
  } catch (err: any) {
    console.error('Error updating addon quantity:', err)
    setError('Failed to update addon quantity')
  } finally {
    setLoading(false)
  }
}

// Alternative simpler approach - try the original update method but with better error handling:

const updateAddonQuantitySimple = async (addonBasketItemId: number, newQuantity: number) => {
  if (newQuantity <= 0) {
    await removeFromBasket(addonBasketItemId)
    return
  }

  try {
    setLoading(true)
    setError(null)

    // Find the addon in the cart structure
    let addonItem: CartItemAddon | null = null

    for (const cartItem of cart) {
      if (cartItem.addons) {
        const foundAddon = cartItem.addons.find(addon => addon.basketItemId === addonBasketItemId)
        if (foundAddon) {
          addonItem = foundAddon
          break
        }
      }
    }

    if (!addonItem || !basketId) {
      console.error('Addon item not found or missing basketId')
      return
    }

    // Try the direct update approach first
    const updateData: UpdateBasketItemDto = {
      basketItemId: addonBasketItemId,
      basketId,
      branchProductId: addonItem.branchProductAddonId,
      quantity: newQuantity
    }

    console.log('Trying direct update with:', updateData)

    try {
      await basketService.updateMyBasketItem(addonBasketItemId, updateData)
      await loadBasket()
      console.log('Direct update successful')
    } catch (updateError: any) {
      console.log('Direct update failed, trying alternative approach')
      
      // If direct update fails, just add one more item
      const addonItems = [{
        branchProductId: addonItem.branchProductAddonId,
        quantity: 1, // Just add 1 more
        parentBasketItemId: undefined // Let the API figure out the parent
      }]
      
      await basketService.batchAddItemsToMyBasket(addonItems)
      await loadBasket()
    }
    
  } catch (err: any) {
    console.error('Error updating addon quantity:', err)
    setError('Failed to update addon quantity')
  } finally {
    setLoading(false)
  }
}

// You can keep the handleAddonQuantityIncrease function as is:
const handleAddonQuantityIncrease = async (addonBasketItemId: number) => {
  try {
    setLoading(true)
    setError(null)

    // Find the addon to get its product ID
    let addonProductId: number | null = null
    let parentBasketItemId: number | null = null

    for (const cartItem of cart) {
      if (cartItem.addons) {
        const foundAddon = cartItem.addons.find(addon => addon.basketItemId === addonBasketItemId)
        if (foundAddon) {
          addonProductId = foundAddon.branchProductAddonId
          parentBasketItemId = cartItem.basketItemId
          break
        }
      }
    }

    if (!addonProductId || !parentBasketItemId) {
      console.error('Could not find addon product ID')
      return
    }

    // Simply add 1 more addon item
    const addonItems = [{
      branchProductId: addonProductId,
      quantity: 1, // Always add just 1 more
      parentBasketItemId: parentBasketItemId
    }]

    await basketService.batchAddItemsToMyBasket(addonItems)
    await loadBasket()

  } catch (err: any) {
    console.error('Error increasing addon quantity:', err)
    setError('Failed to increase addon quantity')
  } finally {
    setLoading(false)
  }
}

  const clearBasket = async () => {
    try {
      setLoading(true)
      setError(null)

      await basketService.deleteMyBasket()
      setCart([])
      setBasketId(null)
    } catch (err: any) {
      console.error('Error clearing basket:', err)
      setError('Failed to clear basket')
    } finally {
      setLoading(false)
    }
  }

  // Group cart items by product
  const groupedItems: GroupedCartItem[] = cart.reduce((groups, item, index) => {
    const existingGroup = groups.find(g => g.product.branchProductId === item.branchProductId)
    
    const variant = {
      basketItemId: item.basketItemId,
      cartIndex: index,
      quantity: item.quantity,
      addons: item.addons,
      totalItemPrice: item.totalItemPrice,
      isPlain: !item.addons || item.addons.length === 0
    }

    if (existingGroup) {
      existingGroup.variants.push(variant)
      existingGroup.totalQuantity += item.quantity
      existingGroup.totalPrice += item.totalItemPrice * item.quantity
    } else {
      groups.push({
        product: {
          branchProductId: item.branchProductId,
          productName: item.productName,
          price: item.price,
          productImageUrl: item.productImageUrl
        },
        variants: [variant],
        totalQuantity: item.quantity,
        totalPrice: item.totalItemPrice * item.quantity
      })
    }

    return groups
  }, [] as GroupedCartItem[])



const handleQuantityIncrease = async (basketItemId?: number) => {
  if (!basketItemId) return
  
  try {
    setLoading(true)
    setError(null)

    const cartItem = cart.find(item => item.basketItemId === basketItemId)
    if (!cartItem) {
      console.error('Cart item not found')
      return
    }

    // Same approach as addons - just add 1 more item
    await basketService.addUnifiedItemToMyBasket({
      branchProductId: cartItem.branchProductId,
      quantity: 1 // Always add just 1 more
    })

    await loadBasket()
  } catch (err: any) {
    console.error('Error increasing parent item quantity:', err)
    setError('Failed to increase item quantity')
  } finally {
    setLoading(false)
  }
}

const handleQuantityDecrease = async (basketItemId?: number) => {
  if (!basketItemId) return
  
  try {
    setLoading(true)
    setError(null)

    // Same approach as addons - just remove 1 item
    await basketService.deleteMyBasketItem(basketItemId)
    await loadBasket()
  } catch (err: any) {
    console.error('Error decreasing parent item quantity:', err)
    setError('Failed to decrease item quantity')
  } finally {
    setLoading(false)
  }
}



  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex justify-end">
      <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl h-full overflow-y-auto border-l border-slate-200/50 dark:border-slate-700/50 shadow-xl">
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t('menu.cart.title')}
              {loading && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
            </h3>
            <div className="flex items-center space-x-2">
              {cart.length > 0 && (
                <button 
                  onClick={clearBasket}
                  disabled={loading}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                  title="Clear basket"
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </button>
              )}
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {cart.length > 0 ? (
            <>
              <div className="space-y-6 mb-6">
                {groupedItems.map((group, groupIndex) => (
                  <div key={group.product.branchProductId} className="bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-xl backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                    {/* Product Header */}
                    <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-200/50 dark:border-slate-600/50">
                      {group.product.productImageUrl && (
                        <img
                          src={group.product.productImageUrl || "/placeholder.svg"}
                          alt={group.product.productName}
                          className="w-12 h-12 object-cover rounded-lg shadow-md"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                          {group.product.productName}
                        </h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                          {group.variants.length} variant{group.variants.length > 1 ? 's' : ''} • Total: {group.totalQuantity} items
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                          ${group.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Variants */}
                    <div className="space-y-4">
                      {group.variants.map((variant, variantIndex) => (
                        <div key={variant.basketItemId || variant.cartIndex} className="bg-white/50 dark:bg-slate-700/30 p-3 rounded-lg border border-slate-200/30 dark:border-slate-600/30">
                          {/* Variant Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              {variant.isPlain ? (
                                <span className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-full">
                                  Plain
                                </span>
                              ) : (
                                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full flex items-center">
                                  <Settings className="h-2 w-2 mr-1" />
                                  Customized
                                </span>
                              )}
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                ${group.product.price.toFixed(2)} × {variant.quantity}
                              </span>
                            </div>

                            {/* Variant Controls */}
                            <div className="flex items-center space-x-1">
                              {/* Quantity Controls */}
                              <div className="flex items-center space-x-1 bg-white dark:bg-slate-700 rounded-lg p-0.5">
                                <button
                                  onClick={() => handleQuantityDecrease(variant.basketItemId)}
                                  disabled={loading}
                                  className="w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center transition-colors disabled:opacity-50"
                                >
                                  <Minus className="h-2 w-2" />
                                </button>
                                <span className="w-6 text-center font-bold text-xs text-slate-800 dark:text-slate-100">
                                  {variant.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityIncrease(variant.basketItemId)}
                                  disabled={loading}
                                  className="w-5 h-5 bg-orange-500 hover:bg-orange-600 text-white rounded flex items-center justify-center transition-colors disabled:opacity-50"
                                >
                                  <Plus className="h-2 w-2" />
                                </button>
                              </div>

                            
                              {/* Delete Variant */}
                             
                            </div>
                          </div>

                          {/* Current Addons (for customized variants) - Updated with controls */}
                          {variant.addons && variant.addons.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Add-ons:</p>
                              <div className="space-y-2">
                                {variant.addons.map((addon) => (
                                  <div key={addon.branchProductAddonId} className="flex justify-between items-center bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                                    <div className="flex-1">
                                      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                                        {addon.addonName}
                                      </span>
                                      <div className="text-xs text-orange-600 dark:text-orange-400">
                                        ${addon.price.toFixed(2)} each × {addon.quantity}
                                      </div>
                                    </div>
                                    
                                    {/* Addon Quantity Controls */}
                                    <div className="flex items-center space-x-2">
  <div className="flex items-center space-x-1 bg-white dark:bg-slate-700 rounded p-0.5">
<button
  onClick={() => addon.basketItemId && removeFromBasket(addon.basketItemId)}
  disabled={loading || !addon.basketItemId}
  className="w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center transition-colors disabled:opacity-50"
>
  <Minus className="h-2 w-2" />
</button>
    <span className="w-4 text-center font-bold text-xs text-slate-800 dark:text-slate-100">
      {addon.quantity}
    </span>
    <button
      onClick={() => addon.basketItemId && handleAddonQuantityIncrease(addon.basketItemId)}
      disabled={loading || !addon.basketItemId}
      className="w-4 h-4 bg-orange-500 hover:bg-orange-600 text-white rounded flex items-center justify-center transition-colors disabled:opacity-50"
    >
      <Plus className="h-2 w-2" />
    </button>
  </div>

  <div className="text-xs font-medium text-orange-600 dark:text-orange-400 ml-1">
    +${(addon.price * addon.quantity).toFixed(2)}
  </div>
</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Variant Total */}
                          <div className="flex justify-between items-center pt-2 border-t border-slate-200/50 dark:border-slate-600/50">
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Variant Total:</span>
                            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                              ${(variant.totalItemPrice * variant.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-6">
                <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl">
                  <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('menu.cart.total')}</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <button 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 hover:from-orange-600 hover:via-orange-700 hover:to-pink-600 text-white py-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    t('menu.cart.placeOrder')
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">{t('menu.cart.empty')}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{t('menu.cart.emptyDesc')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartSidebar