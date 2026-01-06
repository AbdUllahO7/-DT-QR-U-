import React from 'react'
import { Plus, Minus, Settings, XCircle, PlusCircle, Trash2 } from 'lucide-react'
import { useLanguage } from '../../../../../contexts/LanguageContext'

interface CartItemAddon {
  branchProductAddonId: number
  addonName: string
  price: number
  quantity: number
  minQuantity?: number
  maxQuantity?: number
  basketItemId?: number
}

interface CartItemExtra {
  branchProductExtraId: number
  productExtraId?: number
  extraId: number
  extraName: string
  extraCategoryName?: string
  selectionMode?: number
  isRequired?: boolean
  isRemoval: boolean
  unitPrice: number
  quantity: number
  minQuantity?: number
  maxQuantity?: number
  note?: string | null
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
    extras?: CartItemExtra[]
    totalItemPrice: number
    isPlain: boolean
  }>
  totalQuantity: number
  totalPrice: number
}

interface CartItemProps {
  group: GroupedCartItem
  loading: boolean
  onQuantityIncrease: (basketItemId?: number) => void
  onQuantityDecrease: (basketItemId?: number) => void
  onAddonQuantityIncrease: (basketItemId: number) => void
  onRemoveFromBasket: (basketItemId: number) => void
  canIncreaseAddonQuantity: (addon: CartItemAddon) => boolean
  canDecreaseAddonQuantity: (addon: CartItemAddon) => boolean
  getAddonQuantityError: (addon: CartItemAddon) => string | null
  // For extras
  onExtraToggle?: (branchProductExtraId: number, basketItemId: number, currentIsRemoval: boolean) => void
  onExtraQuantityIncrease?: (branchProductExtraId: number, basketItemId: number) => void
  onExtraQuantityDecrease?: (branchProductExtraId: number, basketItemId: number) => void
}

const CartItemComponent: React.FC<CartItemProps> = ({
  group,
  loading,
  onQuantityIncrease,
  onQuantityDecrease,
  onAddonQuantityIncrease,
  onRemoveFromBasket,
  canIncreaseAddonQuantity,
  canDecreaseAddonQuantity,
  getAddonQuantityError,
  onExtraToggle,
  onExtraQuantityIncrease,
  onExtraQuantityDecrease
}) => {
  const { t } = useLanguage()


  return (
    <div className="bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-xl backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
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
            {group.variants.length} {group.variants.length > 1 ? t('menu.cart.variants') : t('menu.cart.variant')} • {t('menu.cart.total')}: {group.totalQuantity} {group.totalQuantity > 1 ? t('menu.cart.items') : t('menu.cart.item')}
          </p>
        </div>
      </div>
      
      {/* Variants */}
      <div className="space-y-4">
        {group.variants.map((variant) => (
          <div key={variant.basketItemId || variant.cartIndex} className="bg-white/50 dark:bg-slate-700/30 p-3 rounded-lg border border-slate-200/30 dark:border-slate-600/30">
            {/* Variant Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {variant.isPlain ? (
                  <span className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-full">
                    {t('menu.cart.plain')}
                  </span>
                ) : (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full flex items-center">
                    <Settings className="h-2 w-2 mr-1" />
                    {t('menu.cart.customized')}
                  </span>
                )}
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  ${group.product.price.toFixed(2)} × {variant.quantity}
                </span>
              </div>

              {/* Variant Controls */}
              <div className="flex items-center space-x-1">
                <div className="flex items-center space-x-1 bg-white dark:bg-slate-700 rounded-lg p-0.5">
                  <button
                    onClick={() => onQuantityDecrease(variant.basketItemId)}
                    disabled={loading}
                    className="w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center transition-colors disabled:opacity-50"
                    title={t('menu.cart.decreaseQuantity')}
                  >
                    <Minus className="h-2 w-2" />
                  </button>
                  <span className="w-6 text-center font-bold text-xs text-slate-800 dark:text-slate-100">
                    {variant.quantity}
                  </span>
                  <button
                    onClick={() => onQuantityIncrease(variant.basketItemId)}
                    disabled={loading}
                    className="w-5 h-5 bg-orange-500 hover:bg-orange-600 text-white rounded flex items-center justify-center transition-colors disabled:opacity-50"
                    title={t('menu.cart.increaseQuantity')}
                  >
                    <Plus className="h-2 w-2" />
                  </button>
                </div>
              </div>
            </div>

            {/* Current Addons */}
            {variant.addons && variant.addons.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">{t('menu.cart.addons')}:</p>
                <div className="space-y-2">
                  {variant.addons.map((addon) => {
                    const canDecrease = canDecreaseAddonQuantity(addon)
                    const canIncrease = canIncreaseAddonQuantity(addon)
                    const quantityError = getAddonQuantityError(addon)
                    
                    return (
                      <div key={addon.branchProductAddonId} className="flex justify-between items-center bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                        <div className="flex-1">
                          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                            {addon.addonName}
                          </span>
                          <div className="text-xs text-orange-600 dark:text-orange-400">
                            ${addon.price.toFixed(2)} {t('menu.cart.each')} × {addon.quantity}
                          </div>
                          {(addon.minQuantity || addon.maxQuantity) && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {addon.minQuantity && addon.maxQuantity 
                                ? `${t('menu.cart.qty')}: ${addon.minQuantity}-${addon.maxQuantity}`
                                : addon.minQuantity 
                                ? `${t('menu.cart.min')}: ${addon.minQuantity}`
                                : `${t('menu.cart.max')}: ${addon.maxQuantity}`
                              }
                            </div>
                          )}
                          {quantityError && (
                            <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                              {quantityError}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 bg-white dark:bg-slate-700 rounded p-0.5">
                            <button
                              onClick={() => addon.basketItemId && onRemoveFromBasket(addon.basketItemId)}
                              disabled={loading || !addon.basketItemId || !canDecrease}
                              className={`w-4 h-4 text-white rounded flex items-center justify-center transition-colors disabled:opacity-50 ${
                                canDecrease 
                                  ? 'bg-red-500 hover:bg-red-600' 
                                  : 'bg-gray-400 cursor-not-allowed'
                              }`}
                              title={!canDecrease ? t('menu.cart.minQuantityError', { name: addon.addonName, min: addon.minQuantity || 0 }) : t('menu.cart.decreaseQuantity')}
                            >
                              <Minus className="h-2 w-2" />
                            </button>
                            <span className="w-4 text-center font-bold text-xs text-slate-800 dark:text-slate-100">
                              {addon.quantity}
                            </span>
                            <button
                              onClick={() => addon.basketItemId && onAddonQuantityIncrease(addon.basketItemId)}
                              disabled={loading || !addon.basketItemId || !canIncrease}
                              className={`w-4 h-4 text-white rounded flex items-center justify-center transition-colors disabled:opacity-50 ${
                                canIncrease 
                                  ? 'bg-orange-500 hover:bg-orange-600' 
                                  : 'bg-gray-400 cursor-not-allowed'
                              }`}
                              title={!canIncrease ? t('menu.cart.maxQuantityError', { name: addon.addonName, max: addon.maxQuantity ?? 0 }) : t('menu.cart.increaseQuantity')}
                            >
                              <Plus className="h-2 w-2" />
                            </button>
                          </div>

                          <div className="text-xs font-medium text-orange-600 dark:text-orange-400 ml-1">
                            +${(addon.price * addon.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Extras Section */}
              {variant.extras && variant.extras.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    {t('menu.cart.extras')}:
                  </p>
                  <div className="space-y-2">
                    {variant.extras.map((extra) => {
                      // Backend stores TOTAL quantity for this basket line
                      const totalQuantity = extra.quantity
                      const minTotal = extra.minQuantity ?? 0
                      const maxTotal = extra.maxQuantity

                      const isAtMinimum = totalQuantity <= minTotal
                      const canIncrease = !extra.isRemoval && (!maxTotal || totalQuantity < maxTotal)
                      
                      return (
                        <div 
                          key={extra.branchProductExtraId} 
                          className={`flex justify-between items-center p-2 rounded ${
                            extra.isRemoval 
                              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
                              : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              {extra.isRemoval ? (
                                <XCircle className="h-3 w-3 text-red-500" />
                              ) : (
                                <PlusCircle className="h-3 w-3 text-green-500" />
                              )}
                              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                                {extra.isRemoval 
                                  ? `${t('menu.cart.without')} ${extra.extraName}` 
                                  : extra.extraName
                                }
                              </span>
                            </div>
                            
                            {extra.extraCategoryName && (
                              <div className="text-xs text-slate-500 dark:text-slate-400 ml-5">
                                {extra.extraCategoryName}
                              </div>
                            )}
                            
                            {extra.unitPrice > 0 && (
                              <div className={`text-xs ml-5 ${extra.isRemoval ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                ${extra.unitPrice.toFixed(2)} {t('menu.cart.each')}
                                {!extra.isRemoval && ` × ${totalQuantity}`}
                              </div>
                            )}

                            {!extra.isRemoval && (extra.minQuantity || extra.maxQuantity) && (
                              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-5">
                                {t('menu.cart.qty')}: {minTotal}-{maxTotal ?? '∞'}
                              </div>
                            )}
                          </div>
                          
                          {extra.isRemoval ? (
                            <button
                              onClick={() => variant.basketItemId && onExtraToggle && onExtraToggle(extra.branchProductExtraId, variant.basketItemId, extra.isRemoval)}
                              disabled={loading || !variant.basketItemId || !onExtraToggle}
                              className="px-3 py-1 rounded-lg text-xs font-medium transition-all bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                              title={t('menu.cart.add')}
                            >
                              <PlusCircle className="h-3 w-3" />
                              <span>{t('menu.cart.add')}</span>
                            </button>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1 bg-white dark:bg-slate-700 rounded p-0.5">
                                <button
                                  onClick={() => {
                                    if (variant.basketItemId && onExtraQuantityDecrease) {
                                      onExtraQuantityDecrease(extra.branchProductExtraId, variant.basketItemId)
                                    }
                                  }}
                                  disabled={loading || !variant.basketItemId || !onExtraQuantityDecrease}
                                  className="w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center transition-colors disabled:opacity-50"
                                  title={
                                    isAtMinimum
                                      ? t('menu.cart.remove') 
                                      : t('menu.cart.decreaseQuantity')
                                  }
                                >
                                  {isAtMinimum ? (
                                    <Trash2 className="h-2 w-2" />
                                  ) : (
                                    <Minus className="h-2 w-2" />
                                  )}
                                </button>
                                
                                <span className="w-4 text-center font-bold text-xs text-slate-800 dark:text-slate-100">
                                  {totalQuantity}
                                </span>
                                
                                <button
                                  onClick={() => variant.basketItemId && onExtraQuantityIncrease && onExtraQuantityIncrease(extra.branchProductExtraId, variant.basketItemId)}
                                  disabled={loading || !variant.basketItemId || !canIncrease || !onExtraQuantityIncrease}
                                  className={`w-4 h-4 text-white rounded flex items-center justify-center transition-colors disabled:opacity-50 ${
                                    canIncrease
                                      ? 'bg-orange-500 hover:bg-orange-600'
                                      : 'bg-gray-400 cursor-not-allowed'
                                  }`}
                                  title={
                                    !canIncrease && maxTotal
                                      ? `${t('menu.cart.max')}: ${maxTotal}`
                                      : t('menu.cart.increaseQuantity')
                                  }
                                >
                                  <Plus className="h-2 w-2" />
                                </button>
                              </div>

                              {extra.unitPrice > 0 && (
                                <div className="text-xs font-medium text-green-600 dark:text-green-400 ml-1">
                                  +${(extra.unitPrice * totalQuantity).toFixed(2)}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
         
          </div>
        ))}
      </div>
    </div>
  )
}

export default CartItemComponent