"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ShoppingCart, X, Trash2, ClipboardList, Loader2 } from "lucide-react"

// Import the separate components
import OrderFormComponent from "./OrderFormComponent"
import PriceChangeModal from "./PriceChangeModal"

import { MenuProduct } from "../../../../../types/menu/type"
import { useLanguage } from "../../../../../contexts/LanguageContext"
import { OrderType, orderTypeService } from "../../../../../services/Branch/BranchOrderTypeService"
import { basketService } from "../../../../../services/Branch/BasketService"
import { OrderTrackingInfo } from "../../../../../types/Orders/type"
import { useCartHandlers } from "../../../../../hooks/useCartHandlers"
import CartContent from "./CartContent"
import OrdersTab from "./OrdersTab"

// Types
interface CartItemAddon {
  branchProductAddonId: number
  addonName: string
  price: number
  quantity: number
  minQuantity?: number
  maxQuantity?: number
  basketItemId?: number
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

interface OrderForm {
  customerName: string
  notes: string
  orderTypeId: number
  tableId?: number
  deliveryAddress?: string
  customerPhone?: string
}

interface TrackedOrder {
  orderTag: string
  trackingInfo: OrderTrackingInfo
  createdAt: Date
}

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  findProduct: (branchProductId: number) => MenuProduct | undefined
  sessionId?: string
  tableId?: number
  onOrderCreated?: (orderId: string) => void
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  sessionId,
  tableId,
  onOrderCreated
}) => {
  const { t } = useLanguage()

  // Tab management
  const [activeTab, setActiveTab] = useState<'cart' | 'orders'>('cart')
  
  // State management
  const [cart, setCart] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [basketId, setBasketId] = useState<string | null>(null)
  
  // Order creation states
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([])
  const [loadingOrderTypes, setLoadingOrderTypes] = useState(false)
  const [orderForm, setOrderForm] = useState<OrderForm>({
    customerName: '',
    notes: '',
    orderTypeId: 0,
    tableId: tableId,
    deliveryAddress: '',
    customerPhone: ''
  })
  const [orderTotal, setOrderTotal] = useState({
    baseAmount: 0,
    serviceCharge: 0,
    totalAmount: 0
  })
  const [estimatedTime, setEstimatedTime] = useState(0)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  // Price change confirmation states
  const [showPriceChangeModal, setShowPriceChangeModal] = useState(false)
  const [priceChanges, setPriceChanges] = useState<any>(null)
  const [confirmingPriceChanges, setConfirmingPriceChanges] = useState(false)

  // Order tracking states
  const [trackedOrders, setTrackedOrders] = useState<TrackedOrder[]>([])
  const [trackingLoading, setTrackingLoading] = useState(false)

  // Use the custom hook for cart handlers
  const {
    loadBasket,
    clearBasket,
    removeFromBasket,
    handleQuantityIncrease,
    handleQuantityDecrease,
    handleAddonQuantityIncrease,
    canIncreaseAddonQuantity,
    canDecreaseAddonQuantity,
    getAddonQuantityError,
    createOrder,
    loadOrderTracking,
    removeOrderFromTracking,
    refreshAllPendingOrders,
    calculateItemTotalPrice,
    getSelectedOrderType
  } = useCartHandlers({
    cart,
    setCart,
    setLoading,
    setError,
    basketId,
    setBasketId,
    sessionId,
    orderForm,
    orderTypes,
    totalPrice,
    trackedOrders,
    setTrackedOrders,
    onOrderCreated,
    setShowPriceChangeModal,
    setPriceChanges,
    setValidationErrors,
    setShowOrderForm,
    setOrderForm,
    tableId
  })

  // Load tracked orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('trackedOrders')
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders)
        setTrackedOrders(parsed.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt)
        })))
      } catch (err) {
        console.error('Error parsing saved orders:', err)
      }
    }
  }, [])

  // Save tracked orders to localStorage whenever it changes
  useEffect(() => {
    if (trackedOrders.length > 0) {
      localStorage.setItem('trackedOrders', JSON.stringify(trackedOrders))
    }
  }, [trackedOrders])

  // Auto-refresh all pending orders
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    const pendingOrders = trackedOrders.filter(order => 
      order.trackingInfo.orderStatus === 'Pending'
    )
    
    if (activeTab === 'orders' && pendingOrders.length > 0) {
      interval = setInterval(() => {
        refreshAllPendingOrders()
      }, 15000)
    }
    
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [activeTab, trackedOrders])

  // Load order types when component mounts or when showing order form
  useEffect(() => {
    if (showOrderForm && orderTypes.length === 0) {
      loadOrderTypes()
    }
  }, [showOrderForm])

  // Load basket when sidebar opens and cart tab is active
  useEffect(() => {
    if (isOpen && activeTab === 'cart') {
      loadBasket()
    }
  }, [isOpen, activeTab])

  // Update order total when order type or total price changes
  useEffect(() => {
    if (orderForm.orderTypeId && totalPrice > 0) {
      calculateOrderTotal()
    }
  }, [orderForm.orderTypeId, totalPrice])

  // Calculate total price whenever cart changes
  useEffect(() => {
    const total = cart.reduce((sum, item) => {
      const itemTotalPrice = calculateItemTotalPrice(item)
      return sum + (itemTotalPrice * item.quantity)
    }, 0)
    
    setTotalPrice(total)
  }, [cart])

  // Load order types function
  const loadOrderTypes = async () => {
    try {
      setLoadingOrderTypes(true)
      setError(null)
      
      const types = await orderTypeService.getOrderTypesBySessionId()
      
      setOrderTypes(types)
      
      if (types.length > 0 && orderForm.orderTypeId === 0) {
        const defaultType = types.find(t => t.isStandard) || types[0]
        setOrderForm(prev => ({ 
          ...prev, 
          orderTypeId: defaultType.id 
        }))
      }
      
    } catch (err: any) {
      console.error('❌ Error loading order types:', err)
      setError('Failed to load order types')
    } finally {
      setLoadingOrderTypes(false)
    }
  }

  // Updated calculateOrderTotal function
  const calculateOrderTotal = async () => {
    try {
      const selectedOrderType = getSelectedOrderType()
      
      if (!selectedOrderType) {
        setOrderTotal({
          baseAmount: totalPrice,
          serviceCharge: 0,
          totalAmount: totalPrice
        })
        setEstimatedTime(0)
        return
      }

      const serviceChargeAmount = selectedOrderType.serviceCharge || 0
      const total = totalPrice + serviceChargeAmount

      setOrderTotal({
        baseAmount: totalPrice,
        serviceCharge: serviceChargeAmount,
        totalAmount: total
      })
      
      const time = selectedOrderType.estimatedMinutes || 0
      setEstimatedTime(time)
      
    } catch (err) {
      console.error('Error calculating order total:', err)
    }
  }

  // Confirm price changes and retry order creation
  const confirmPriceChanges = async () => {
    try {
      setConfirmingPriceChanges(true)
      setError(null)

      const cleanSessionId = sessionId || basketId
      if (!cleanSessionId) {
        setError('Session ID required for price change confirmation')
        return
      }

      await basketService.confirmSessionPriceChanges(cleanSessionId)
      
      setShowPriceChangeModal(false)
      setPriceChanges(null)
      setConfirmingPriceChanges(false)
      
      await loadBasket()
      await createOrder()
      
    } catch (err: any) {
      console.error('❌ Error confirming price changes:', err)
      setError(err.message || 'Failed to confirm price changes')
      setConfirmingPriceChanges(false)
    }
  }

  // Group cart items by product with correct total calculations
  const groupedItems: GroupedCartItem[] = cart.reduce((groups, item, index) => {
    const existingGroup = groups.find(g => g.product.branchProductId === item.branchProductId)
    
    const variantItemTotal = calculateItemTotalPrice(item)
    
    const variant = {
      basketItemId: item.basketItemId,
      cartIndex: index,
      quantity: item.quantity,
      addons: item.addons,
      totalItemPrice: variantItemTotal,
      isPlain: !item.addons || item.addons.length === 0
    }

    if (existingGroup) {
      existingGroup.variants.push(variant)
      existingGroup.totalQuantity += item.quantity
      existingGroup.totalPrice += variantItemTotal * item.quantity
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
        totalPrice: variantItemTotal * item.quantity
      })
    }

    return groups
  }, [] as GroupedCartItem[])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex justify-end">
      <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl h-full overflow-y-auto border-l border-slate-200/50 dark:border-slate-700/50 shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center">
              {activeTab === 'cart' ? (
                <ShoppingCart className="h-4 w-4 mr-2" />
              ) : (
                <ClipboardList className="h-4 w-4 mr-2" />
              )}
              {activeTab === 'cart' ? (showOrderForm ? 'Order Form' : t('menu.cart.title')) : t('menu.cart.ordersß')}
              {(loading || loadingOrderTypes || trackingLoading) && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
            </h3>
            <div className="flex items-center space-x-2">
              {cart.length > 0 && activeTab === 'cart' && !showOrderForm && (
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

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50">
          <button
            onClick={() => {
              setActiveTab('cart')
              setShowOrderForm(false)
            }}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'cart'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span>{t('menu.cart.newOrder')}</span>
              {cart.length > 0 && (
                <span className="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('orders')
              setShowOrderForm(false)
            }}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'orders'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <ClipboardList className="h-4 w-4" />
              <span> <span>{t('menu.cart.orders')}</span></span>
              {trackedOrders.filter(order => order.trackingInfo.orderStatus === 'Pending').length > 0 && (
                <span className="bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {trackedOrders.filter(order => order.trackingInfo.orderStatus === 'Pending').length}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {validationErrors.length > 0 && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm font-medium mb-1">Please fix the following errors:</p>
              <ul className="text-red-600 dark:text-red-400 text-xs list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'cart' ? (
            showOrderForm ? (
              <OrderFormComponent
                orderForm={orderForm}
                setOrderForm={setOrderForm}
                orderTypes={orderTypes}
                loadingOrderTypes={loadingOrderTypes}
                orderTotal={orderTotal}
                estimatedTime={estimatedTime}
                totalPrice={totalPrice}
                validationErrors={validationErrors}
                loading={loading}
                onBack={() => setShowOrderForm(false)}
                onCreate={createOrder}
              />
            ) : (
              <CartContent
                cart={cart}
                groupedItems={groupedItems}
                totalPrice={totalPrice}
                loading={loading}
                onProceedToOrder={() => setShowOrderForm(true)}
                onQuantityIncrease={handleQuantityIncrease}
                onQuantityDecrease={handleQuantityDecrease}
                onAddonQuantityIncrease={handleAddonQuantityIncrease}
                onRemoveFromBasket={removeFromBasket}
                canIncreaseAddonQuantity={canIncreaseAddonQuantity}
                canDecreaseAddonQuantity={canDecreaseAddonQuantity}
                getAddonQuantityError={getAddonQuantityError}
              />
            )
          ) : (
            <OrdersTab
              trackedOrders={trackedOrders}
              trackingLoading={trackingLoading}
              onLoadOrderTracking={loadOrderTracking}
              onRemoveOrderFromTracking={removeOrderFromTracking}
            />
          )}
        </div>
      </div>

      <PriceChangeModal
        isVisible={showPriceChangeModal}
        priceChanges={priceChanges}
        confirmingPriceChanges={confirmingPriceChanges}
        onCancel={() => {
          setShowPriceChangeModal(false)
          setPriceChanges(null)
          setLoading(false)
        }}
        onConfirm={confirmPriceChanges}
      />
    </div>
  )
}

export default CartSidebar