"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ShoppingCart, X, Plus, Minus, Settings, Trash2, ArrowRight, Loader2, User, MapPin, Phone, Clock, AlertTriangle } from "lucide-react"
import { useLanguage } from "../../../../contexts/LanguageContext"
import { MenuProduct } from "../../../../types/menu/type"
import { basketService } from "../../../../services/Branch/BasketService"
import { orderService, CreateSessionOrderDto, SmartCreateOrderDto } from "../../../../services/Branch/OrderService"
import { OrderType, orderTypeService } from "../../../../services/Branch/BranchOrderTypeService"

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
  address?: string
  phone?: string
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
  findProduct,
  sessionId,
  tableId,
  onOrderCreated
}) => {
  const { t } = useLanguage()

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
    address: '',
    phone: ''
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

  // Load order types when component mounts or when showing order form
  useEffect(() => {
    if (showOrderForm && orderTypes.length === 0) {
      loadOrderTypes()
    }
  }, [showOrderForm])

  // Load order types function
  const loadOrderTypes = async () => {
    try {
      setLoadingOrderTypes(true)
      setError(null)
      
      console.log('🔄 Loading order types from service...')
      const types = await orderTypeService.getOrderTypesBySessionId()
      console.log('📋 Order types loaded:', types)
      
      setOrderTypes(types)
      
      // Set default order type if none selected and types are available
      if (types.length > 0 && orderForm.orderTypeId === 0) {
        const defaultType = types.find(t => t.isStandard) || types[0]
        setOrderForm(prev => ({ 
          ...prev, 
          orderTypeId: defaultType.id 
        }))
        console.log('🎯 Default order type set:', defaultType)
      }
      
    } catch (err: any) {
      console.error('❌ Error loading order types:', err)
      setError('Failed to load order types')
    } finally {
      setLoadingOrderTypes(false)
    }
  }

  // Helper function to get clean session ID
  const getCleanSessionId = (sessionId?: string | null): string | null => {
    if (!sessionId || sessionId === 'empty' || sessionId.trim() === '') {
      return null
    }
    
    // Remove 'session_' prefix if present
    const cleanId = sessionId.trim()
    if (cleanId.startsWith('session_')) {
      return cleanId.replace('session_', '')
    }
    
    return cleanId
  }

  // Helper function to calculate item total price including addons
  const calculateItemTotalPrice = (item: CartItem): number => {
    let itemTotal = item.price
    
    if (item.addons && item.addons.length > 0) {
      const addonTotal = item.addons.reduce((addonSum, addon) => {
        return addonSum + (addon.price * addon.quantity)
      }, 0)
      itemTotal += addonTotal
    }
    
    return itemTotal
  }

  // Calculate total price whenever cart changes
  useEffect(() => {
    const total = cart.reduce((sum, item) => {
      const itemTotalPrice = calculateItemTotalPrice(item)
      return sum + (itemTotalPrice * item.quantity)
    }, 0)
    
    console.log('🧮 Calculating total price:', {
      cartItems: cart.map(item => ({
        product: item.productName,
        basePrice: item.price,
        quantity: item.quantity,
        addons: item.addons?.map(addon => ({
          name: addon.addonName,
          price: addon.price,
          quantity: addon.quantity,
          total: addon.price * addon.quantity
        })),
        itemTotalPrice: calculateItemTotalPrice(item),
        lineTotal: calculateItemTotalPrice(item) * item.quantity
      })),
      grandTotal: total
    })
    
    setTotalPrice(total)
  }, [cart])

  // Load basket when sidebar opens
  useEffect(() => {
    if (isOpen) {
      loadBasket()
    }
  }, [isOpen])

  // Update order total when order type or total price changes
  useEffect(() => {
    if (orderForm.orderTypeId && totalPrice > 0) {
      calculateOrderTotal()
    }
  }, [orderForm.orderTypeId, totalPrice])

  const calculateOrderTotal = async () => {
    try {
      const total = await orderService.calculateOrderTotal(orderForm.orderTypeId, totalPrice)
      setOrderTotal(total)
      
      const time = await orderService.getEstimatedTime(orderForm.orderTypeId)
      setEstimatedTime(time)
    } catch (err) {
      console.error('Error calculating order total:', err)
    }
  }

  // Handle price change confirmation
  const handlePriceChangeConfirmation = async () => {
    try {
      console.log('🔄 Handling price change confirmation...')
      
      // Show the price change modal immediately
      setShowPriceChangeModal(true)
      
      // Try to get specific price change details if available
      const cleanSessionId = getCleanSessionId(sessionId || basketId)
      
      if (cleanSessionId) {
        try {
          console.log('🔍 Fetching price change details for session:', cleanSessionId)
          const changes = await basketService.confirmSessionPriceChanges(cleanSessionId)
          setPriceChanges(changes)
          console.log('📋 Price changes details:', changes)
        } catch (err: any) {
          console.log('ℹ️ No specific price changes endpoint available or error fetching details:', err.message)
          // Set a generic message since we can't get specific details
          setPriceChanges({
            message: 'Some items in your basket have price changes that need to be confirmed.',
            requiresConfirmation: true
          })
        }
      } else {
        console.log('⚠️ No session ID available for price change details')
        setPriceChanges({
          message: 'Price changes detected. Please confirm to continue with your order.',
          requiresConfirmation: true
        })
      }
      
    } catch (err: any) {
      console.error('❌ Error handling price change confirmation:', err)
      setError('Failed to load price change details')
    }
  }

  // Confirm price changes and retry order creation
  const confirmPriceChanges = async () => {
    try {
      setConfirmingPriceChanges(true)
      setError(null)

      const cleanSessionId = getCleanSessionId(sessionId || basketId)

      if (!cleanSessionId) {
        setError('Session ID required for price change confirmation')
        return
      }

      console.log('✅ Confirming price changes for session:', cleanSessionId)

      // Confirm the price changes
      await basketService.confirmSessionPriceChanges(cleanSessionId)
      
      console.log('✅ Price changes confirmed successfully')
      
      // Close the modal
      setShowPriceChangeModal(false)
      setPriceChanges(null)
      setConfirmingPriceChanges(false)
      
      // Reload the basket to get updated prices
      await loadBasket()
      
      console.log('🔄 Retrying order creation after price confirmation...')
      
      // Retry creating the order
      await createOrder()
      
    } catch (err: any) {
      console.error('❌ Error confirming price changes:', err)
      setError(err.message || 'Failed to confirm price changes')
      setConfirmingPriceChanges(false)
    }
  }

const validateCart = (): string[] => {
  const errors: string[] = []
  
  cart.forEach(item => {
    if (item.addons) {
      item.addons.forEach(addon => {
        const error = getAddonQuantityError(addon)
        if (error) {
          errors.push(error)
        }
      })
    }
  })
  
  return errors
}

const validateOrderForm = (): string[] => {
  const errors: string[] = []
  
  // Validate customer name
  if (!orderForm.customerName.trim()) {
    errors.push('Customer name is required')
  }
  
  // Validate order type selection
  if (!orderForm.orderTypeId) {
    errors.push('Please select an order type')
  }
  
  // Get selected order type for conditional validation
  const selectedOrderType = getSelectedOrderType()
  
  // Validate address if required
  if (selectedOrderType?.requiresAddress && !orderForm.address?.trim()) {
    errors.push('Delivery address is required for this order type')
  }
  
  // Validate phone if required
  if (selectedOrderType?.requiresPhone && !orderForm.phone?.trim()) {
    errors.push('Phone number is required for this order type')
  }
  
  return errors
}

const createOrder = async () => {
  try {
    setLoading(true)
    setError(null)
    setValidationErrors([])

    // Validate cart quantities before creating order
    const cartErrors = validateCart()
    const formErrors = validateOrderForm()
    const allErrors = [...cartErrors, ...formErrors]
    
    if (allErrors.length > 0) {
      setValidationErrors(allErrors)
      setLoading(false)
      return
    }

    // Rest of your createOrder logic...
    let order
    console.log('📝 Creating order with form data:', orderForm)

    if (sessionId) {
      // Create session-based order
      const sessionOrderDto: CreateSessionOrderDto = {
        customerName: orderForm.customerName.trim(),
        notes: orderForm.notes.trim() || undefined,
        orderTypeId: orderForm.orderTypeId
      }
      console.log('📤 Creating session order with DTO:', sessionOrderDto)
      order = await orderService.createSessionOrder(sessionId, sessionOrderDto)
      console.log('🆕 Session order created:', order)
    } else {
      // Create smart order (includes all table baskets)
      const smartOrderDto: SmartCreateOrderDto = {
        includeAllTableBaskets: true,
        customerName: orderForm.customerName.trim(),
        notes: orderForm.notes.trim() || undefined,
        orderTypeId: orderForm.orderTypeId
      }
      
      console.log('📤 Creating smart order with DTO:', smartOrderDto)
      order = await orderService.smartCreateOrder(smartOrderDto)
      console.log('🆕 Smart order created:', order)
    }

    // Clear the basket after successful order creation
    setCart([])
    setBasketId(null)
    setShowOrderForm(false)
    
    // Notify parent component
    if (onOrderCreated) {
      onOrderCreated(order.orderId)
    }

    // Show success message
    setError(null)
    
    // Close the sidebar after a short delay
    setTimeout(() => {
      onClose()
    }, 2000)

  } catch (err: any) {
    console.error('❌ Error creating order:', err)
    
    // Check if it's a price change confirmation error
    if (err?.response?.status === 409) {
      const errorMessage = err?.response?.data?.message || err?.message || ''
      
      // Check if the error is specifically about unconfirmed price changes
      if (errorMessage.toLowerCase().includes('unconfirmed price changes') || 
          errorMessage.toLowerCase().includes('price changes')) {
        
        console.log('💰 Price change confirmation required')
        await handlePriceChangeConfirmation()
        return // Don't show error message, show modal instead
        
      } else {
        // Other 409 errors
        setError(err.message || 'This order is already being processed')
      }
    } else {
      // Other errors
      setError(err.message || 'Failed to create order')
    }
  } finally {
    setLoading(false)
  }
}

const loadBasket = async () => {
  try {
    setLoading(true)
    setError(null)
    
    const basket = await basketService.getMyBasket()
    console.log('🛒 Raw basket data from API:', basket)
    
    setBasketId(basket.basketId)
    
    // Convert API basket items to cart items
    const cartItems: CartItem[] = basket.items.map((item, index) => {
      console.log(`\n📝 Processing basket item ${index + 1}:`, item)
      
      const mappedAddons = item.addonItems?.map(addon => {
        console.log('   📎 Addon:', addon)
        return {
          branchProductAddonId: addon.branchProductId,
          addonName: addon.productName || '',
          price: addon.price || 0,
          quantity: addon.quantity,
          minQuantity: addon.minQuantity, 
          maxQuantity: addon.maxQuantity, 
          basketItemId: addon.basketItemId
        }
      })
      
      console.log('   📎 Mapped addons:', mappedAddons)
      
      const cartItem = {
        basketItemId: item.basketItemId,
        branchProductId: item.branchProductId,
        productName: item.productName || '',
        price: item.price || 0,
        quantity: item.quantity,
        productImageUrl: item.imageUrl,
        addons: mappedAddons,
        totalItemPrice: item.totalPrice || 0
      }
      
      console.log('   ✅ Final cart item:', cartItem)
      return cartItem
    })
    
    console.log('🎯 Final cart items array:', cartItems)
    setCart(cartItems)
  } catch (err: any) {
    console.error('Error loading basket:', err)
    setError('Failed to load basket')
  } finally {
    setLoading(false)
  }
}

const canIncreaseAddonQuantity = (addon: CartItemAddon): boolean => {
  if (!addon.maxQuantity) return true
  return addon.quantity < addon.maxQuantity
}

const canDecreaseAddonQuantity = (addon: CartItemAddon): boolean => {
  if (!addon.minQuantity) return addon.quantity > 0
  return addon.quantity > addon.minQuantity
}

const getAddonQuantityError = (addon: CartItemAddon): string | null => {
  if (addon.minQuantity && addon.quantity < addon.minQuantity) {
    return `Minimum quantity for ${addon.addonName} is ${addon.minQuantity}`
  }
  if (addon.maxQuantity && addon.quantity > addon.maxQuantity) {
    return `Maximum quantity for ${addon.addonName} is ${addon.maxQuantity}`
  }
  return null
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

  const handleAddonQuantityIncrease = async (addonBasketItemId: number) => {
    try {
      setLoading(true)
      setError(null)

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

      const addonItems = [{
        branchProductId: addonProductId,
        quantity: 1,
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

      await basketService.addUnifiedItemToMyBasket({
        branchProductId: cartItem.branchProductId,
        quantity: 1
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

      await basketService.deleteMyBasketItem(basketItemId)
      await loadBasket()
    } catch (err: any) {
      console.error('Error decreasing parent item quantity:', err)
      setError('Failed to decrease item quantity')
    } finally {
      setLoading(false)
    }
  }

  // Group cart items by product with correct total calculations
  const groupedItems: GroupedCartItem[] = cart.reduce((groups, item, index) => {
    const existingGroup = groups.find(g => g.product.branchProductId === item.branchProductId)
    
    // Calculate variant total using the helper function
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

  const getSelectedOrderType = () => {
    return orderTypes.find(ot => ot.id === orderForm.orderTypeId)
  }

  // Price Change Confirmation Modal Component
  const PriceChangeModal = () => {
    if (!showPriceChangeModal) return null

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
              Price Changes Detected
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Some items in your basket have price changes that need to be confirmed before proceeding with the order.
            </p>
          </div>

          {priceChanges && (
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mb-6">
              <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">
                Changes Required:
              </h4>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {typeof priceChanges === 'string' ? (
                  <p>{priceChanges}</p>
                ) : priceChanges?.message ? (
                  <p>{priceChanges.message}</p>
                ) : (
                  <p>Price updates need to be confirmed to continue.</p>
                )}
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => {
                setShowPriceChangeModal(false)
                setPriceChanges(null)
                setLoading(false) // Reset loading state
              }}
              disabled={confirmingPriceChanges}
              className="flex-1 py-3 px-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmPriceChanges}
              disabled={confirmingPriceChanges}
              className="flex-1 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 hover:from-orange-600 hover:via-orange-700 hover:to-pink-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
            >
              {confirmingPriceChanges ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Confirming...
                </div>
              ) : (
                'Confirm & Continue'
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex justify-end">
      <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl h-full overflow-y-auto border-l border-slate-200/50 dark:border-slate-700/50 shadow-xl">
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              {showOrderForm ? 'Order Details' : t('menu.cart.title')}
              {(loading || loadingOrderTypes) && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
            </h3>
            <div className="flex items-center space-x-2">
              {cart.length > 0 && !showOrderForm && (
                <>
                  <button 
                    onClick={clearBasket}
                    disabled={loading}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                    title="Clear basket"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>
                 
                </>
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

          {showOrderForm ? (
            // Order Form
            <div className="space-y-6">
              {loadingOrderTypes ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                  <span className="ml-2 text-slate-600 dark:text-slate-400">Loading order types...</span>
                </div>
              ) : (
                <>
                  {/* Order Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Order Type *
                    </label>
                    <select
                      value={orderForm.orderTypeId}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, orderTypeId: parseInt(e.target.value) }))}
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      disabled={orderTypes.length === 0}
                    >
                      <option value={0}>Select order type...</option>
                      {orderTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name} {type.serviceCharge > 0 && `(+${type.serviceCharge}% service)`}
                        </option>
                      ))}
                    </select>
                    {getSelectedOrderType() && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {getSelectedOrderType()?.description}
                        {getSelectedOrderType()?.estimatedMinutes && (
                          <span className="block">Estimated time: {getSelectedOrderType()?.estimatedMinutes} minutes</span>
                        )}
                      </p>
                    )}
                    {orderTypes.length === 0 && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                        No order types available. Please contact support.
                      </p>
                    )}
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <User className="h-4 w-4 inline mr-1" />
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      value={orderForm.customerName}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, customerName: e.target.value }))}
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      placeholder="Enter customer name"
                    />
                  </div>

                  {/* Conditional Fields Based on Order Type */}
                  {getSelectedOrderType()?.requiresAddress && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        Delivery Address *
                      </label>
                      <textarea
                        value={orderForm.address}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        placeholder="Enter delivery address"
                        rows={3}
                      />
                    </div>
                  )}

                  {getSelectedOrderType()?.requiresPhone && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        <Phone className="h-4 w-4 inline mr-1" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={orderForm.phone}
                        onChange={(e) => setOrderForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        placeholder="Enter phone number"
                      />
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Special Instructions
                    </label>
                    <textarea
                      value={orderForm.notes}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      placeholder="Any special instructions for your order..."
                      rows={3}
                    />
                  </div>

                  {/* Order Summary */}
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
                        <span className="text-slate-800 dark:text-slate-200">${totalPrice.toFixed(2)}</span>
                      </div>
                      {orderTotal.serviceCharge > 0 && (
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Service Charge ({getSelectedOrderType()?.serviceCharge}%):</span>
                          <span className="text-slate-800 dark:text-slate-200">${orderTotal.serviceCharge.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold border-t border-slate-200 dark:border-slate-600 pt-2">
                        <span className="text-slate-800 dark:text-slate-200">Total:</span>
                        <span className="text-orange-600 dark:text-orange-400">${orderTotal.totalAmount.toFixed(2)}</span>
                      </div>
                      {estimatedTime > 0 && (
                        <div className="flex items-center text-slate-600 dark:text-slate-400 mt-2">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Estimated time: {estimatedTime} minutes</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowOrderForm(false)}
                      className="flex-1 py-3 px-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Back to Cart
                    </button>
                    <button
                      onClick={createOrder}
                      disabled={loading || orderTypes.length === 0 || !orderForm.orderTypeId}
                      className="flex-1 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 hover:from-orange-600 hover:via-orange-700 hover:to-pink-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </div>
                      ) : (
                        'Create Order'
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            // Cart View
            <>
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
                                </div>
                              </div>

                              {/* Current Addons */}
                             {variant.addons && variant.addons.length > 0 && (
  <div className="mb-3">
    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Add-ons:</p>
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
                ${addon.price.toFixed(2)} each × {addon.quantity}
              </div>
              {/* Min/Max quantity info */}
              {(addon.minQuantity || addon.maxQuantity) && (
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {addon.minQuantity && addon.maxQuantity 
                    ? `Qty: ${addon.minQuantity}-${addon.maxQuantity}`
                    : addon.minQuantity 
                    ? `Min: ${addon.minQuantity}`
                    : `Max: ${addon.maxQuantity}`
                  }
                </div>
              )}
              {/* Quantity error message */}
              {quantityError && (
                <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                  {quantityError}
                </div>
              )}
            </div>
            
            {/* Addon Quantity Controls */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-white dark:bg-slate-700 rounded p-0.5">
                <button
                  onClick={() => addon.basketItemId && removeFromBasket(addon.basketItemId)}
                  disabled={loading || !addon.basketItemId || !canDecrease}
                  className={`w-4 h-4 text-white rounded flex items-center justify-center transition-colors disabled:opacity-50 ${
                    canDecrease 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  title={!canDecrease ? `Minimum quantity is ${addon.minQuantity || 0}` : 'Decrease quantity'}
                >
                  <Minus className="h-2 w-2" />
                </button>
                <span className="w-4 text-center font-bold text-xs text-slate-800 dark:text-slate-100">
                  {addon.quantity}
                </span>
                <button
                  onClick={() => addon.basketItemId && handleAddonQuantityIncrease(addon.basketItemId)}
                  disabled={loading || !addon.basketItemId || !canIncrease}
                  className={`w-4 h-4 text-white rounded flex items-center justify-center transition-colors disabled:opacity-50 ${
                    canIncrease 
                      ? 'bg-orange-500 hover:bg-orange-600' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  title={!canIncrease ? `Maximum quantity is ${addon.maxQuantity}` : 'Increase quantity'}
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
                      onClick={() => setShowOrderForm(true)}
                      disabled={loading || cart.length === 0}
                      className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 hover:from-orange-600 hover:via-orange-700 hover:to-pink-600 text-white py-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <span>Proceed to Order</span>
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </div>
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
            </>
          )}
        </div>
      </div>

      {/* Price Change Confirmation Modal */}
      <PriceChangeModal />
    </div>
  )
}

export default CartSidebar