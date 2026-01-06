"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ShoppingCart, X, Trash2, ClipboardList, Loader2} from "lucide-react"
import OrderFormComponent from "./OrderFormComponent"
import PriceChangeModal from "./PriceChangeModal"
import { useLanguage } from "../../../../../contexts/LanguageContext"
import { OrderType, orderTypeService } from "../../../../../services/Branch/BranchOrderTypeService"
import { CartItem, useCartHandlers } from "../../../../../hooks/useCartHandlers"
import CartContent from "./CartContent"
import OrdersTab from "./OrdersTab"
import { CartSidebarProps, GroupedCartItem, OrderForm, TrackedOrder } from "../../../../../types/menu/carSideBarTypes"
import WhatsAppConfirmationModal from "./WhatsAppConfirmationModal"
import ToastComponent from "./ToastComponenet"
import { UpdatableOrder } from "../../../../../types/Orders/type"
import { orderService } from "../../../../../services/Branch/OrderService"

interface UpdatedCartSidebarProps extends CartSidebarProps {
  restaurantPreferences?: any
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'loading'
  message: string
  duration?: number
}

const CartSidebar: React.FC<UpdatedCartSidebarProps> = ({
  isOpen,
  onClose,
  sessionId,
  tableId,
  onOrderCreated,
  restaurantPreferences
}) => {
  const { t } = useLanguage()
  const [toasts, setToasts] = useState<Toast[]>([])
  
  const showToast = (type: 'success' | 'error' | 'loading', message: string, duration?: number): string => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      id,
      type,
      message,
      duration: duration || (type === 'loading' ? 0 : type === 'success' ? 4000 : 5000)
    }
    setToasts(prev => [...prev, newToast])
    return id
  }

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const updateToast = (id: string, type: 'success' | 'error', message: string, duration?: number) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id 
        ? { ...toast, type, message, duration: duration || (type === 'success' ? 4000 : 5000) }
        : toast
    ))
  }

  const [activeTab, setActiveTab] = useState<'cart' | 'orders'>('cart')
  const [cart, setCart] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [basketId, setBasketId] = useState<string | null>(null)
  const [showWhatsAppConfirmation, setShowWhatsAppConfirmation] = useState(false)
  const [pendingWhatsAppData, setPendingWhatsAppData] = useState<any>(null)
  const [whatsappSending, setWhatsappSending] = useState(false)
  const [updatableOrders, setUpdatableOrders] = useState<UpdatableOrder[]>([])
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([])
  const [loadingOrderTypes, setLoadingOrderTypes] = useState(false)
  const [orderForm, setOrderForm] = useState<OrderForm>({
    customerName: '',
    notes: '',
    orderTypeId: 0,
    tableId: tableId,
    deliveryAddress: '',
    customerPhone: '',
    paymentMethod: ''
  })
  const [orderTotal, setOrderTotal] = useState({
    baseAmount: 0,
    serviceCharge: 0,
    totalAmount: 0
  })
  const [estimatedTime, setEstimatedTime] = useState(0)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [showPriceChangeModal, setShowPriceChangeModal] = useState(false)
  const [priceChanges, setPriceChanges] = useState<any>(null)
  const [confirmingPriceChanges, setConfirmingPriceChanges] = useState(false)
  const [trackedOrders, setTrackedOrders] = useState<TrackedOrder[]>([])
  const [trackingLoading, setTrackingLoading] = useState(false)

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
    createOrder: originalCreateOrder,
    loadOrderTracking,
    removeOrderFromTracking,
    refreshAllPendingOrders,
    calculateItemTotalPrice,
    getSelectedOrderType,
    sendOrderToWhatsApp,
    handlePriceChangeConfirmation,
    cleanupAfterOrder,
    handleExtraToggle,
    handleExtraQuantityIncrease,
    handleExtraQuantityDecrease
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
    tableId,
    restaurantPreferences,
    setPendingWhatsAppData,
    setShowWhatsAppConfirmation
  })



  // Calculate cart total using line totals from backend
  useEffect(() => {
    if (cart.length === 0) {
      setTotalPrice(0)
      return
    }

    const total = cart.reduce((sum, item, index) => {
      // Line total already includes quantity, addons and extras
      const itemTotal = calculateItemTotalPrice(item)
      return sum + itemTotal
    }, 0)

    setTotalPrice(total)
  }, [cart, calculateItemTotalPrice])

  const createOrder = async () => {
    let toastId: string | null = null
    try {
      toastId = showToast('loading', t('menu.cart.creating_order') || 'Creating order...')
      await originalCreateOrder()
      if (toastId) {
        updateToast(toastId, 'success', t('menu.cart.order_created_success') || 'Order created successfully!')
      } else {
        showToast('success', t('menu.cart.order_created_success') || 'Order created successfully!')
      }
      setActiveTab('orders')
    } catch (error: any) {
      console.error('Error creating order:', error)
      const errorMessage = error?.message || 
        t('menu.cart.order_creation_failed') || 
        'Failed to create order. Please try again.'
      if (toastId) {
        updateToast(toastId, 'error', errorMessage)
      } else {
        showToast('error', errorMessage)
      }
    }
  }

  const handleWhatsAppConfirm = async () => {
    if (!pendingWhatsAppData) return
    let toastId: string | null = null
    try {
      setWhatsappSending(true)
      toastId = showToast('loading', t('menu.cart.sending_whatsapp') || 'Sending WhatsApp message...')
      await sendOrderToWhatsApp(pendingWhatsAppData)
      if (toastId) {
        updateToast(toastId, 'success', t('menu.cart.whatsapp_sent_success') || 'WhatsApp message sent successfully!')
      } else {
        showToast('success', t('menu.cart.whatsapp_sent_success') || 'WhatsApp message sent successfully!')
      }
    } catch (error) {
      console.error('Error sending WhatsApp message:', error)
      const errorMessage = t('menu.cart.whatsapp_send_failed') || 'Failed to send WhatsApp message'
      if (toastId) {
        updateToast(toastId, 'error', errorMessage)
      } else {
        showToast('error', errorMessage)
      }
    } finally {
      setWhatsappSending(false)
      setShowWhatsAppConfirmation(false)
      setPendingWhatsAppData(null)
      cleanupAfterOrder()
      setActiveTab('orders')
    }
  }

  const fetchUpdatableOrders = async () => {
    try {
      if (trackedOrders.length === 0) {
        setUpdatableOrders([])
        return
      }
      const orders = await orderService.getUpdatableOrders()
      setUpdatableOrders(orders)
    } catch (error) {
      console.error("Failed to fetch updatable orders:", error)
      setUpdatableOrders([])
    }
  }

  useEffect(() => {
    fetchUpdatableOrders()
  }, [trackedOrders])

  const handleWhatsAppCancel = () => {
    setShowWhatsAppConfirmation(false)
    setPendingWhatsAppData(null)
    setWhatsappSending(false)
    cleanupAfterOrder()
    setActiveTab('orders')
  }

  const handleClearBasket = async () => {
    let toastId: string | null = null
    try {
      toastId = showToast('loading', t('menu.cart.clearing_basket') || 'Clearing basket...')
      await clearBasket()
      if (toastId) {
        updateToast(toastId, 'success', t('menu.cart.basket_cleared') || 'Basket cleared successfully!')
      } else {
        showToast('success', t('menu.cart.basket_cleared') || 'Basket cleared successfully!')
      }
    } catch (error) {
      const errorMessage = t('menu.cart.clear_basket_failed') || 'Failed to clear basket'
      if (toastId) {
        updateToast(toastId, 'error', errorMessage)
      } else {
        showToast('error', errorMessage)
      }
    }
  }

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

  useEffect(() => {
    if (trackedOrders.length > 0) {
      localStorage.setItem('trackedOrders', JSON.stringify(trackedOrders))
    }
  }, [trackedOrders])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    const pendingOrders = trackedOrders.filter(order => 
      order.trackingInfo.orderStatus === 'Pending'
    )
    if (activeTab === 'orders' && pendingOrders.length > 0) {
      interval = setInterval(() => {
        refreshAllPendingOrders()
        fetchUpdatableOrders()
      }, 15000)
    }
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [activeTab, trackedOrders])

  useEffect(() => {
    if (showOrderForm && orderTypes.length === 0) {
      loadOrderTypes()
    }
  }, [showOrderForm])

  useEffect(() => {
    if (isOpen && activeTab === 'cart') {
      loadBasket()
    }
  }, [isOpen, activeTab])

  useEffect(() => {
    if (orderForm.orderTypeId && totalPrice > 0) {
      calculateOrderTotal()
    }
  }, [orderForm.orderTypeId, totalPrice])

  const loadOrderTypes = async () => {
    try {
      setLoadingOrderTypes(true)
      setError(null)
      const types = await orderTypeService.getOrderTypesBySessionId()
      setOrderTypes(types)
      if (types.length > 0 && orderForm.orderTypeId === 0) {
        const defaultType = types.find(t => t.isStandard) || types[0]
        setOrderForm((prev: any) => ({ 
          ...prev, 
          orderTypeId: defaultType.id 
        }))
      }
    } catch (err: any) {
      console.error('❌ Error loading order types:', err)
      setError('Failed to load order types')
      showToast('error', t('menu.cart.load_order_types_failed') || 'Failed to load order types')
    } finally {
      setLoadingOrderTypes(false)
    }
  }

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

  // Group items for display using line totals
  const groupedItems: GroupedCartItem[] = cart.reduce((groups, item, index) => {
    const existingGroup = groups.find(g => g.product.branchProductId === item.branchProductId)
    const variantItemTotal = calculateItemTotalPrice(item)
    
    const variant = {
      basketItemId: item.basketItemId,
      cartIndex: index,
      quantity: item.quantity,
      addons: item.addons,
      extras: item.extras,
      totalItemPrice: variantItemTotal,
      isPlain: (!item.addons || item.addons.length === 0) && (!item.extras || item.extras.length === 0)
    }

    if (existingGroup) {
      existingGroup.variants.push(variant)
      existingGroup.totalQuantity += item.quantity
      existingGroup.totalPrice += variantItemTotal
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
        totalPrice: variantItemTotal
      })
    }

    return groups
  }, [] as GroupedCartItem[])

  if (!isOpen) return null

  return (
    <>
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-[60] space-y-2 max-w-sm">
          {toasts.map((toast) => (
            <ToastComponent key={toast.id} toast={toast} onClose={hideToast} />
          ))}
        </div>
      )}

      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex justify-end">
        <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl h-full overflow-y-auto border-l border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center ">
                {activeTab === 'cart' ? (
                  <ShoppingCart className="h-4 w-4 mr-2 ml-2" />
                ) : (
                  <ClipboardList className="h-4 w-4 mr-2 ml-2" />
                )}
                {activeTab === 'cart' ? (showOrderForm ? 'Order Form' : t('menu.cart.title')) : t('menu.cart.orders')}
                {(loading || loadingOrderTypes || trackingLoading) && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
              </h3>
              <div className="flex items-center space-x-2">
                {cart.length > 0 && activeTab === 'cart' && !showOrderForm && (
                  <button 
                    onClick={handleClearBasket}
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
                <span>{t('menu.cart.orders')}</span>
                {trackedOrders.filter(order => order.trackingInfo.orderStatus === 'Pending').length > 0 && (
                  <span className="bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {trackedOrders.filter(order => order.trackingInfo.orderStatus === 'Pending').length}
                  </span>
                )}
              </div>
            </button>
          </div>

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
                  paymentPreferences={restaurantPreferences}
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
                  onExtraToggle={async (branchProductExtraId, basketItemId, currentIsRemoval) => {
                    let toastId: string | null = null
                    try {
                      toastId = showToast('loading', 'Updating extra...')
                      await handleExtraToggle(branchProductExtraId, basketItemId , currentIsRemoval)
                      if (toastId) {
                        updateToast(toastId, 'success', 'Extra updated successfully!')
                      }
                    } catch (error) {
                      if (toastId) {
                        updateToast(toastId, 'error', 'Failed to update extra')
                      } else {
                        showToast('error', 'Failed to update extra')
                      }
                    }
                  }}
                  onExtraQuantityIncrease={async (branchProductExtraId, basketItemId) => {
                    let toastId: string | null = null
                    try {
                      toastId = showToast('loading', 'Increasing quantity...')
                      await handleExtraQuantityIncrease(branchProductExtraId, basketItemId)
                      if (toastId) {
                        updateToast(toastId, 'success', 'Quantity increased!')
                      }
                    } catch (error) {
                      if (toastId) {
                        updateToast(toastId, 'error', 'Failed to increase quantity')
                      } else {
                        showToast('error', 'Failed to increase quantity')
                      }
                    }
                  }}
                  onExtraQuantityDecrease={async (branchProductExtraId, basketItemId) => {
                    let toastId: string | null = null
                    try {
                      toastId = showToast('loading', 'Decreasing quantity...')
                      await handleExtraQuantityDecrease(branchProductExtraId, basketItemId)
                      if (toastId) {
                        updateToast(toastId, 'success', 'Quantity decreased!')
                      }
                    } catch (error) {
                      if (toastId) {
                        updateToast(toastId, 'error', 'Failed to decrease quantity')
                      } else {
                        showToast('error', 'Failed to decrease quantity')
                      }
                    }
                  }}
                />
              )
            ) : (
              <OrdersTab
                trackedOrders={trackedOrders}
                trackingLoading={trackingLoading}
                onLoadOrderTracking={loadOrderTracking}
                onRemoveOrderFromTracking={removeOrderFromTracking}
                updatableOrders={updatableOrders}
                onRefreshUpdatableOrders={fetchUpdatableOrders}
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
          onConfirm={handlePriceChangeConfirmation}
        />

        <WhatsAppConfirmationModal
          isVisible={showWhatsAppConfirmation}
          restaurantName={restaurantPreferences?.restaurantName || 'Restaurant'}
          whatsappNumber={restaurantPreferences?.whatsappOrderNumber}
          onConfirm={handleWhatsAppConfirm}
          onCancel={handleWhatsAppCancel}
          loading={whatsappSending}
        />
      </div>
    </>
  )
}

export default CartSidebar
