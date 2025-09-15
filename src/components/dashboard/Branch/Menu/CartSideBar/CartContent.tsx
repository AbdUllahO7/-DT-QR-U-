import type React from "react"
import { ArrowRight, Loader2 } from "lucide-react"
import CartItemComponent from "./CartItemComponent"
import EmptyCartComponent from "./EmptyCartComponent"
import { useLanguage } from "../../../../../contexts/LanguageContext"
import { CartContentProps } from "../../../../../types/menu/carSideBarTypes"


const CartContent: React.FC<CartContentProps> = ({
  cart,
  groupedItems,
  totalPrice,
  loading,
  onProceedToOrder,
  onQuantityIncrease,
  onQuantityDecrease,
  onAddonQuantityIncrease,
  onRemoveFromBasket,
  canIncreaseAddonQuantity,
  canDecreaseAddonQuantity,
  getAddonQuantityError
}) => {
  const { t } = useLanguage()

  if (cart.length === 0) {
    return <EmptyCartComponent />
  }

  return (
    <>
      <div className="space-y-6 mb-6">
        {groupedItems.map((group) => (
          <CartItemComponent
            key={group.product.branchProductId}
            group={group}
            loading={loading}
            onQuantityIncrease={onQuantityIncrease}
            onQuantityDecrease={onQuantityDecrease}
            onAddonQuantityIncrease={onAddonQuantityIncrease}
            onRemoveFromBasket={onRemoveFromBasket}
            canIncreaseAddonQuantity={canIncreaseAddonQuantity}
            canDecreaseAddonQuantity={canDecreaseAddonQuantity}
            getAddonQuantityError={getAddonQuantityError}
          />
        ))}
      </div>

      <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-6">
        <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl">
          <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {t('menu.cart.total')}
          </span>
          <span className="text-xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-pink-500 bg-clip-text text-transparent">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
        
        <button 
          onClick={onProceedToOrder}
          disabled={loading || cart.length === 0}
          className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 hover:from-orange-600 hover:via-orange-700 hover:to-pink-600 text-white py-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('menu.cart.processing')}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span>{t('menu.cart.proceed')}</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </div>
          )}
        </button>
      </div>
    </>
  )
}

export default CartContent