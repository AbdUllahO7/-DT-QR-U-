"use client"

import type React from "react"
import { ShoppingCart, X, Plus, Minus } from "lucide-react"
import { useLanguage } from "../../../../contexts/LanguageContext"
import { CartItem, MenuProduct } from "../../../../types/menu/type"

interface CartSidebarProps {
  isOpen: boolean
  cart: CartItem[]
  totalPrice: number
  onClose: () => void
  onAddToCart: (product: MenuProduct) => void
  onRemoveFromCart: (branchProductId: number) => void
  findProduct: (branchProductId: number) => MenuProduct | undefined
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  cart,
  totalPrice,
  onClose,
  onAddToCart,
  onRemoveFromCart,
  findProduct
}) => {
  const { t } = useLanguage()

  if (!isOpen) return null

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
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.branchProductId} className="flex items-center space-x-3 bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-xl backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                    {item.productImageUrl && (
                      <img
                        src={item.productImageUrl || "/placeholder.svg"}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded-lg shadow-md"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{item.productName}</h4>
                      <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/50 dark:bg-slate-700/50 rounded-lg p-1">
                      <button
                        onClick={() => onRemoveFromCart(item.branchProductId)}
                        className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-center transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-slate-800 dark:text-slate-100 text-sm">{item.quantity}</span>
                      <button
                        onClick={() => {
                          const product = findProduct(item.branchProductId)
                          if (product) {
                            onAddToCart(product)
                          }
                        }}
                        className="w-6 h-6 bg-orange-500 hover:bg-orange-600 text-white rounded-md flex items-center justify-center transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
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