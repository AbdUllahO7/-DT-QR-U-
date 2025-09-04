"use client"

import type React from "react"
import { ShoppingCart, X, Plus, Minus, Settings, Trash2, Merge, ArrowRight } from "lucide-react"
import { useLanguage } from "../../../../contexts/LanguageContext"
import { MenuProduct } from "../../../../types/menu/type"

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
  cart: CartItem[]
  totalPrice: number
  onClose: () => void
  onAddToCart: (product: MenuProduct, addons?: SelectedAddon[]) => void
  onRemoveFromCart: (cartIndex: number) => void
  onUpdateCartItem: (cartIndex: number, updatedItem: CartItem) => void
  onRemoveCartItem: (cartIndex: number) => void
  onMergeCartItems: (targetIndex: number, sourceIndex: number) => void
  findProduct: (branchProductId: number) => MenuProduct | undefined
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  cart,
  totalPrice,
  onClose,
  onAddToCart,
  onRemoveFromCart,
  onUpdateCartItem,
  onRemoveCartItem,
  onMergeCartItems,
  findProduct
}) => {
  const { t } = useLanguage()

  if (!isOpen) return null

  // Group cart items by product
  const groupedItems: GroupedCartItem[] = cart.reduce((groups, item, index) => {
    const existingGroup = groups.find(g => g.product.branchProductId === item.branchProductId)
    
    const variant = {
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

  const handleAddSameItem = (cartIndex: number) => {
    const cartItem = cart[cartIndex]
    const product = findProduct(cartItem.branchProductId)
    
    if (product && cartItem.addons) {
      const addons: SelectedAddon[] = cartItem.addons.map(addon => ({
        branchProductAddonId: addon.branchProductAddonId,
        addonName: addon.addonName,
        price: addon.price,
        quantity: addon.quantity
      }))
      onAddToCart(product, addons)
    } else if (product) {
      onAddToCart(product)
    }
  }

  const handleAddonQuantityChange = (cartIndex: number, addonId: number, newQuantity: number) => {
    const cartItem = cart[cartIndex]
    if (!cartItem.addons) return

    const updatedAddons = cartItem.addons.map(addon => 
      addon.branchProductAddonId === addonId 
        ? { ...addon, quantity: Math.max(0, newQuantity) }
        : addon
    ).filter(addon => addon.quantity > 0)

    const addonsPrice = updatedAddons.reduce((total, addon) => total + (addon.price * addon.quantity), 0)
    const totalItemPrice = cartItem.price + addonsPrice

    const updatedItem: CartItem = {
      ...cartItem,
      addons: updatedAddons,
      totalItemPrice
    }

    onUpdateCartItem(cartIndex, updatedItem)
  }

  const handleAddAddonToExistingItem = (cartIndex: number, addonId: number) => {
    const cartItem = cart[cartIndex]
    const product = findProduct(cartItem.branchProductId)
    
    if (!product?.availableAddons) return

    const addon = product.availableAddons.find(a => a.branchProductAddonId === addonId)
    if (!addon) return

    const existingAddon = cartItem.addons?.find(a => a.branchProductAddonId === addonId)
    
    if (existingAddon) {
      handleAddonQuantityChange(cartIndex, addonId, existingAddon.quantity + 1)
    } else {
      const newAddon: CartItemAddon = {
        branchProductAddonId: addon.branchProductAddonId,
        addonName: addon.addonName,
        price: addon.price,
        quantity: 1,
        maxQuantity: addon.maxQuantity
      }

      const updatedAddons = [...(cartItem.addons || []), newAddon]
      const addonsPrice = updatedAddons.reduce((total, a) => total + (a.price * a.quantity), 0)
      const totalItemPrice = cartItem.price + addonsPrice

      const updatedItem: CartItem = {
        ...cartItem,
        addons: updatedAddons,
        totalItemPrice
      }

      onUpdateCartItem(cartIndex, updatedItem)
    }
  }

  const getAvailableAddonsForItem = (cartIndex: number) => {
    const cartItem = cart[cartIndex]
    const product = findProduct(cartItem.branchProductId)
    
    if (!product?.availableAddons) return []

    return product.availableAddons.filter(addon => {
      const existingAddon = cartItem.addons?.find(a => a.branchProductAddonId === addon.branchProductAddonId)
      return !existingAddon || existingAddon.quantity < addon.maxQuantity
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex justify-end">
      <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl h-full overflow-y-auto border-l border-slate-200/50 dark:border-slate-700/50 shadow-xl">
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t('menu.cart.title')}
            </h3>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
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
                        <div key={variant.cartIndex} className="bg-white/50 dark:bg-slate-700/30 p-3 rounded-lg border border-slate-200/30 dark:border-slate-600/30">
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
                              {/* Merge Button (show only if there are multiple variants) */}
                              {group.variants.length > 1 && variant.isPlain && (
                                <button
                                  onClick={() => {
                                    // Find a customized variant to merge into
                                    const customizedVariant = group.variants.find(v => !v.isPlain)
                                    if (customizedVariant) {
                                      onMergeCartItems(customizedVariant.cartIndex, variant.cartIndex)
                                    }
                                  }}
                                  className="w-6 h-6 bg-purple-500/20 hover:bg-purple-500 text-purple-600 hover:text-white rounded-md flex items-center justify-center transition-all duration-200"
                                  title="Merge with customized version"
                                >
                                  <ArrowRight className="h-3 w-3" />
                                </button>
                              )}

                              {/* Quantity Controls */}
                              <div className="flex items-center space-x-1 bg-white dark:bg-slate-700 rounded-lg p-0.5">
                                <button
                                  onClick={() => onRemoveFromCart(variant.cartIndex)}
                                  className="w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center transition-colors"
                                >
                                  <Minus className="h-2 w-2" />
                                </button>
                                <span className="w-6 text-center font-bold text-xs text-slate-800 dark:text-slate-100">
                                  {variant.quantity}
                                </span>
                                <button
                                  onClick={() => handleAddSameItem(variant.cartIndex)}
                                  className="w-5 h-5 bg-orange-500 hover:bg-orange-600 text-white rounded flex items-center justify-center transition-colors"
                                >
                                  <Plus className="h-2 w-2" />
                                </button>
                              </div>

                              {/* Delete Variant */}
                              <button
                                onClick={() => onRemoveCartItem(variant.cartIndex)}
                                className="w-5 h-5 bg-red-500/20 hover:bg-red-500 text-red-600 hover:text-white rounded flex items-center justify-center transition-all duration-200"
                                title="Remove variant"
                              >
                                <Trash2 className="h-2 w-2" />
                              </button>
                            </div>
                          </div>

                          {/* Current Addons (for customized variants) */}
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
                                        ${addon.price.toFixed(2)} each
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-1">
                                      <button
                                        onClick={() => handleAddonQuantityChange(variant.cartIndex, addon.branchProductAddonId, addon.quantity - 1)}
                                        className="w-4 h-4 bg-red-400 hover:bg-red-500 text-white rounded flex items-center justify-center transition-colors"
                                      >
                                        <Minus className="h-2 w-2" />
                                      </button>
                                      <span className="w-4 text-center font-bold text-xs text-slate-800 dark:text-slate-100">
                                        {addon.quantity}
                                      </span>
                                      <button
                                        onClick={() => handleAddonQuantityChange(variant.cartIndex, addon.branchProductAddonId, addon.quantity + 1)}
                                        className="w-4 h-4 bg-orange-400 hover:bg-orange-500 text-white rounded flex items-center justify-center transition-colors"
                                        disabled={addon.maxQuantity ? addon.quantity >= addon.maxQuantity : false}
                                      >
                                        <Plus className="h-2 w-2" />
                                      </button>
                                    </div>
                                    
                                    <div className="text-xs font-medium text-orange-600 dark:text-orange-400 ml-2 w-12 text-right">
                                      +${(addon.price * addon.quantity).toFixed(2)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Available Addons to Add */}
                          {getAvailableAddonsForItem(variant.cartIndex).length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Add more:</p>
                              <div className="flex flex-wrap gap-1">
                                {getAvailableAddonsForItem(variant.cartIndex).slice(0, 2).map((addon) => (
                                  <button
                                    key={addon.branchProductAddonId}
                                    onClick={() => handleAddAddonToExistingItem(variant.cartIndex, addon.branchProductAddonId)}
                                    className="text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full transition-colors flex items-center space-x-1"
                                  >
                                    <Plus className="h-2 w-2" />
                                    <span>{addon.addonName}</span>
                                    <span className="font-semibold">+${addon.price}</span>
                                  </button>
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
                <button className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 hover:from-orange-600 hover:via-orange-700 hover:to-pink-600 text-white py-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                  {t('menu.cart.placeOrder')}
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