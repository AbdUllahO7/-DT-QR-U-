"use client"

import type React from "react"
import { useState } from "react"
import { X, Plus, Minus, ShoppingCart, Utensils, Award } from "lucide-react"
import { useLanguage } from "../../../../contexts/LanguageContext"
import { MenuProduct } from "../../../../types/menu/type"

interface SelectedAddon {
  branchProductAddonId: number
  addonName: string
  price: number
  quantity: number
}

interface ProductModalProps {
  isOpen: boolean
  product: MenuProduct | null
  onClose: () => void
  onAddToCart: (product: MenuProduct, addons: SelectedAddon[]) => void
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  product,
  onClose,
  onAddToCart
}) => {
  const { t } = useLanguage()
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([])
  const [quantity, setQuantity] = useState(1)
  console.log("Product Modal Rendered,", product)
  
  if (!isOpen || !product) return null

  const handleAddonChange = (addon: any, newQuantity: number) => {
    setSelectedAddons(prev => {
      const existingIndex = prev.findIndex(a => a.branchProductAddonId === addon.branchProductAddonId)
      
      // If trying to set quantity to 0, remove the addon entirely
      if (newQuantity === 0) {
        return prev.filter(a => a.branchProductAddonId !== addon.branchProductAddonId)
      }
      
      // Ensure quantity respects minQuantity and maxQuantity constraints
      const constrainedQuantity = Math.max(
        addon.minQuantity || 0, 
        Math.min(addon.maxQuantity || 999, newQuantity)
      )
      
      if (existingIndex >= 0) {
        return prev.map((a, index) => 
          index === existingIndex 
            ? { ...a, quantity: constrainedQuantity }
            : a
        )
      } else {
        return [...prev, {
          branchProductAddonId: addon.branchProductAddonId,
          addonName: addon.addonName,
          price: addon.price,
          quantity: constrainedQuantity
        }]
      }
    })
  }

  // Add addon with minimum quantity
  const handleAddAddon = (addon: any) => {
    const initialQuantity = Math.max(1, addon.minQuantity || 1)
    handleAddonChange(addon, initialQuantity)
  }

  // Decrease addon quantity with minQuantity respect
  const handleDecreaseAddon = (addon: any, currentQuantity: number) => {
    const minQty = addon.minQuantity || 1
    const newQuantity = currentQuantity - 1
    
    // If going below minQuantity, remove the addon entirely
    if (newQuantity < minQty) {
      handleAddonChange(addon, 0)
    } else {
      handleAddonChange(addon, newQuantity)
    }
  }

  // Increase addon quantity with maxQuantity respect
  const handleIncreaseAddon = (addon: any, currentQuantity: number) => {
    const maxQty = addon.maxQuantity || 999
    const newQuantity = Math.min(maxQty, currentQuantity + 1)
    handleAddonChange(addon, newQuantity)
  }

  const getAddonQuantity = (addonId: number): number => {
    const addon = selectedAddons.find(a => a.branchProductAddonId === addonId)
    return addon?.quantity || 0
  }

  const getTotalPrice = (): number => {
    const basePrice = product.price * quantity
    const addonsPrice = selectedAddons.reduce((total, addon) => 
      total + (addon.price * addon.quantity), 0
    ) * quantity
    return basePrice + addonsPrice
  }

  const handleAddToCart = () => {
    onAddToCart(product, selectedAddons)
    // Reset state
    setSelectedAddons([])
    setQuantity(1)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200/50 dark:border-slate-700/50">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Customize Your Order</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Product Info */}
          <div className="flex space-x-4 mb-6 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl">
            {product.productImageUrl && (
              <img
                src={product.productImageUrl}
                alt={product.productName}
                className="w-20 h-20 object-cover rounded-lg shadow-md"
              />
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
                    {product.productName}
                  </h3>
                  {product.productDescription && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                      {product.productDescription}
                    </p>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold bg-gradient-to-r from-orange-600 to-pink-500 bg-clip-text text-transparent">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.isRecommended && (
                      <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-1 rounded-full flex items-center">
                        <Award className="h-2 w-2 mr-1" />
                        Recommended
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Allergens */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Allergen Information
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.allergens.map((allergen) => (
                  <span
                    key={allergen.allergenId}
                    className="inline-flex items-center text-xs bg-amber-100/80 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full border border-amber-200/50 dark:border-amber-800/50"
                    title={allergen.name}
                  >
                    <span className="mr-1">{allergen.icon}</span>
                    {allergen.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ingredients */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                <Utensils className="h-3 w-3 mr-1 text-orange-500" />
                Ingredients
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient) => (
                  <span
                    key={ingredient.ingredientId}
                    className="text-xs bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-full"
                  >
                    {ingredient.ingredientName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Available Addons */}
          {product.availableAddons && product.availableAddons.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
                Available Add-ons
              </h4>
              <div className="space-y-3">
                {product.availableAddons.map((addon) => {
                  const addonQuantity = getAddonQuantity(addon.branchProductAddonId)
                  const minQty = addon.minQuantity || 1
                  const maxQty = addon.maxQuantity || 999
                  
                  return (
                    <div
                      key={addon.branchProductAddonId}
                      className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50"
                    >
                      <div className="flex space-x-3 flex-1">
                        {addon.addonImageUrl && (
                          <img
                            src={addon.addonImageUrl}
                            alt={addon.addonName}
                            className="w-12 h-12 object-cover rounded-lg shadow-sm"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                                {addon.addonName}
                              </h5>
                              {addon.addonDescription && (
                                <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
                                  {addon.addonDescription}
                                </p>
                              )}
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-sm font-bold text-orange-600">
                                  +${addon.price.toFixed(2)}
                                </span>
                                {addon.isRecommended && (
                                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs px-1.5 py-0.5 rounded-full">
                                    Recommended
                                  </span>
                                )}
                              </div>
                              
                              {/* Quantity constraints info */}
                              <div className="flex items-center space-x-2 mt-1">
                                {addon.minQuantity > 1 && (
                                  <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-full">
                                    Min: {addon.minQuantity}
                                  </span>
                                )}
                                {addon.maxQuantity && addon.maxQuantity < 999 && (
                                  <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-1.5 py-0.5 rounded-full">
                                    Max: {addon.maxQuantity}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Addon Allergens */}
                          {addon.allergens && addon.allergens.length > 0 && (
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-1">
                                {addon.allergens.slice(0, 3).map((allergen) => (
                                  <span
                                    key={allergen.allergenId}
                                    className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full"
                                    title={allergen.name}
                                  >
                                    {allergen.icon}
                                  </span>
                                ))}
                                {addon.allergens.length > 3 && (
                                  <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-full">
                                    +{addon.allergens.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Addon Quantity Controls */}
                      <div className="flex items-center space-x-2 ml-4">
                        {addonQuantity > 0 ? (
                          <div className="flex items-center space-x-2 bg-white dark:bg-slate-700 rounded-lg p-1 border border-slate-200 dark:border-slate-600">
                            <button
                              onClick={() => handleDecreaseAddon(addon, addonQuantity)}
                              className={`w-7 h-7 ${
                                addonQuantity <= minQty 
                                  ? 'bg-gray-400 cursor-not-allowed' 
                                  : 'bg-red-500 hover:bg-red-600'
                              } text-white rounded-md flex items-center justify-center transition-colors`}
                              disabled={addonQuantity <= minQty}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-slate-800 dark:text-slate-100">
                              {addonQuantity}
                            </span>
                            <button
                              onClick={() => handleIncreaseAddon(addon, addonQuantity)}
                              className={`w-7 h-7 ${
                                addonQuantity >= maxQty 
                                  ? 'bg-gray-400 cursor-not-allowed' 
                                  : 'bg-orange-500 hover:bg-orange-600'
                              } text-white rounded-md flex items-center justify-center transition-colors`}
                              disabled={addonQuantity >= maxQty}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddAddon(addon)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg transition-colors text-sm font-semibold flex items-center space-x-1"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add {addon.minQuantity > 1 ? `(${addon.minQuantity})` : ''}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-4 rounded-xl mb-4">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3">Order Summary</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{product.productName} × {quantity}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>
                
                {selectedAddons.map((addon) => (
                  <div key={addon.branchProductAddonId} className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      {addon.addonName} × {addon.quantity * quantity}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      +${(addon.price * addon.quantity * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                
                <div className="border-t border-slate-300 dark:border-slate-600 pt-2 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-slate-800 dark:text-slate-100">Total</span>
                    <span className="font-bold text-xl bg-gradient-to-r from-orange-600 to-pink-500 bg-clip-text text-transparent">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quantity:</span>
                <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-center transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center font-bold text-slate-800 dark:text-slate-100">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-md flex items-center justify-center transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 hover:from-orange-600 hover:via-orange-700 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductModal