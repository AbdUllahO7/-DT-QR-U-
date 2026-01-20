import { BasketExtraItem, basketService, ProductExtraDto } from "../services/Branch/BasketService"
import { orderService } from "../services/Branch/OrderService"
import { WhatsAppService } from "../services/WhatsAppService"
import { CreateSessionOrderDto } from "../types/BranchManagement/type"

interface CartItemAddon {
  branchProductAddonId: number
  addonName: string
  price: number
  quantity: number
  minQuantity?: number
  maxQuantity?: number
  basketItemId?: number
}

export interface CartItem {
  basketItemId: number;
  branchProductId: number;
  productName: string;
  price: number;
  quantity: number;
  productImageUrl?: string;
  addons?: any[];
  extras?: BasketExtraItem[];  
  totalItemPrice: number;
}

interface OrderForm {
  customerName: string
  notes: string
  orderTypeId: number
  tableId?: number
  deliveryAddress?: string
  customerPhone?: string
  paymentMethod: string
  tableNumber?: string
}

interface TrackedOrder {
  orderTag: string
  trackingInfo: any
  createdAt: Date
}

interface UseCartHandlersProps {
  cart: CartItem[]
  setCart: (cart: CartItem[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  basketId: string | null
  setBasketId: (basketId: string | null) => void
  sessionId?: string
  orderForm: OrderForm
  orderTypes: any[]
  totalPrice: number
  trackedOrders: TrackedOrder[]
  setTrackedOrders: (orders: TrackedOrder[]) => void
  onOrderCreated?: (orderId: string) => void
  setShowPriceChangeModal: (show: boolean) => void
  setPriceChanges: (changes: any) => void
  setValidationErrors: (errors: string[]) => void
  setShowOrderForm: (show: boolean) => void
  setOrderForm: (form: OrderForm) => void
  tableId?: number
  restaurantPreferences?: any
  setPendingWhatsAppData?: (data: any) => void
  setShowWhatsAppConfirmation?: (show: boolean) => void
}

export const useCartHandlers = ({
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
}: UseCartHandlersProps) => {


  // Helper function to get clean session ID
  const getCleanSessionId = (sessionId?: string | null): string | null => {
    if (!sessionId || sessionId === 'empty' || sessionId.trim() === '') {
      return null
    }
    
    const cleanId = sessionId.trim()
    if (cleanId.startsWith('session_')) {
      return cleanId.replace('session_', '')
    }
    
    return cleanId
  }

  // Helper to calculate TOTAL line price for a cart item
  // - Prefers backend's totalItemPrice (already includes quantity, addons, extras)
  // - Falls back to client-side calculation when needed
  const calculateItemTotalPrice = (item: CartItem): number => {
    if (item.totalItemPrice && item.totalItemPrice > 0) {
      return item.totalItemPrice
    }

    // Base product total = unit price × quantity
    let itemTotal = (item.price || 0) * (item.quantity || 0)

    // Add addons total (quantities are already scaled by backend)
    if (item.addons && item.addons.length > 0) {
      const addonTotal = item.addons.reduce((addonSum, addon) => {
        return addonSum + addon.price * addon.quantity
      }, 0)
      itemTotal += addonTotal
    }

    // Add extras total (only non-removal extras, quantities are scaled totals)
    if (item.extras && item.extras.length > 0) {
      const extrasTotal = item.extras
        .filter(extra => !extra.isRemoval)
        .reduce((extrasSum, extra) => {
          return extrasSum + extra.unitPrice * extra.quantity
        }, 0)
      itemTotal += extrasTotal
    }

    return itemTotal
  }

  // Helper function to get selected order type
  const getSelectedOrderType = () => {
    return orderTypes.find(ot => ot.id === orderForm.orderTypeId)
  }

  // Function to send order to WhatsApp
  const sendOrderToWhatsApp = async (whatsappData: any) => {
    try {
      const whatsappNumber = WhatsAppService.formatWhatsAppNumber(
        restaurantPreferences.whatsAppPhoneNumber
      )

      await WhatsAppService.sendOrderToWhatsApp(whatsappNumber, whatsappData)
      
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error)
      throw error
    }
  }

  // Load basket
  const loadBasket = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const basket = await basketService.getMyBasket()
      
      setBasketId(basket.basketId)
      
      const cartItems: CartItem[] = basket.items.map((item) => {
        const mappedAddons = item.addonItems?.map(addon => ({
          branchProductAddonId: addon.branchProductId,
          addonName: addon.productName || '',
          price: addon.price || 0,
          quantity: addon.quantity,
          minQuantity: addon.minQuantity, 
          maxQuantity: addon.maxQuantity, 
          basketItemId: addon.basketItemId
        }))
        
        const mappedExtras = item.extras?.map(extra => ({
          branchProductExtraId: extra.branchProductExtraId,
          productExtraId: extra.productExtraId,
          extraId: extra.extraId,
          extraName: extra.extraName,
          extraCategoryName: extra.extraCategoryName,
          selectionMode: extra.selectionMode,
          isRequired: extra.isRequired,
          isRemoval: extra.isRemoval,
          unitPrice: extra.unitPrice,
          quantity: extra.quantity,
          minQuantity: extra.minQuantity,
          maxQuantity: extra.maxQuantity,
          note: extra.note
        })) || []
        
        // Calculate the correct total price for this item
        // Base price * quantity
        let itemTotal = (item.price || 0) * (item.quantity || 1)
        
        // Add addons total
        if (mappedAddons && mappedAddons.length > 0) {
          const addonTotal = mappedAddons.reduce((sum, addon) => {
            return sum + (addon.price * addon.quantity)
          }, 0)
          itemTotal += addonTotal
        }
        
        // Add extras total (only non-removal extras)
        if (mappedExtras && mappedExtras.length > 0) {
          const extrasTotal = mappedExtras
            .filter(extra => !extra.isRemoval)
            .reduce((sum, extra) => {
              return sum + (extra.unitPrice * extra.quantity)
            }, 0)
          itemTotal += extrasTotal
        }
        
        return {
          basketItemId: item.basketItemId,
          branchProductId: item.branchProductId,
          productName: item.productName || '',
          price: item.price || 0,
          quantity: item.quantity,
          productImageUrl: item.imageUrl ?? undefined,
          addons: mappedAddons,
          extras: mappedExtras,  
          totalItemPrice: itemTotal
        }
      })
      
      setCart(cartItems)
      
    } catch (err: any) {
      console.error('❌ Error loading basket:', err)
      setError('Failed to load basket')
      setCart([])
    } finally {
      setLoading(false)
    }
  }

  // Clear basket
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

  // Remove from basket
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

  // ✅ FIXED: Handle quantity increase - UPDATE existing item quantity (not add new)
  // This triggers backend auto-scaling for extras
  const handleQuantityIncrease = async (basketItemId?: number) => {
    if (!basketItemId) return

    try {
      setLoading(true)
      setError(null)

      const cartItem = cart.find(item => item.basketItemId === basketItemId)
      if (!cartItem) {
        console.error('❌ Cart item not found')
        setError('Cart item not found. Please refresh.')
        return
      }

      const newQuantity = cartItem.quantity + 1

    

      
      await basketService.updateMyBasketItem(basketItemId, newQuantity)

      await loadBasket()

    } catch (err: any) {
      console.error('❌ Error updating product quantity:', err)
      console.error('❌ Full error response:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      })

      const errorMessage = err.response?.data?.message ||
                          err.response?.data?.title ||
                          err.message ||
                          'Failed to update product quantity'

      setError(errorMessage)

      // Always reload basket to sync state
      try {
        await loadBasket()
      } catch (loadErr) {
        console.error('❌ Failed to reload basket after error:', loadErr)
      }
    } finally {
      setLoading(false)
    }
  }

  // ✅ NEW: Handle extra toggle using dedicated endpoint
  const handleExtraToggle = async (branchProductExtraId: number, basketItemId: number, currentIsRemoval: boolean) => {
    if (!currentIsRemoval) {
      console.warn('⚠️ Toggle should only be used for removed items (isRemoval: true)')
      return
    }

    try {
      setLoading(true)
      setError(null)

   

      // ✅ SIMPLE: Just delete the extra - that's it!
      await basketService.deleteBasketItemExtra(basketItemId, branchProductExtraId)


      // Reload basket to reflect changes
      await loadBasket()

    } catch (err: any) {
      console.error('❌ Error toggling extra:', err)
      console.error('Error response:', err.response?.data)
      
      setError(err.response?.data?.message || err.message || 'Failed to update extra')
      
      // Always reload to sync state
      try {
        await loadBasket()
      } catch (loadErr) {
        console.error('❌ Failed to reload basket after error:', loadErr)
      }
    } finally {
      setLoading(false)
    }
  }

  // ✅ NEW: Handle extra quantity increase using dedicated endpoint
  const handleExtraQuantityIncrease = async (branchProductExtraId: number, basketItemId: number) => {
    try {
      setLoading(true)
      setError(null)

      const cartItem = cart.find(item => item.basketItemId === basketItemId)
      if (!cartItem) {
        console.error('❌ Cart item not found')
        setError('Cart item not found')
        return
      }

      const extra = cartItem.extras?.find(e => e.branchProductExtraId === branchProductExtraId)
      if (!extra) {
        console.error('❌ Extra not found')
        setError('Extra not found')
        return
      }

      if (extra.isRemoval) {
        console.error('❌ Cannot increase quantity of removal extra')
        setError('Cannot increase quantity of removal extra')
        return
      }

      // TOTAL quantity semantics: backend UpdateExtraQuantity expects absolute quantity
      const maxQty = extra.maxQuantity !== null && extra.maxQuantity !== undefined ? extra.maxQuantity : 999;
      if (extra.quantity >= maxQty) {
        setError(`Maximum quantity for ${extra.extraName} is ${extra.maxQuantity}`)
        return
      }

      // Increment by 1 total unit
      const newQuantity = extra.quantity + 1

    
      // Update with new scaled quantity
      await basketService.updateBasketItemExtra(
        basketItemId,
        branchProductExtraId,
        { quantity: newQuantity }
      )


      // Reload basket
      await loadBasket()

    } catch (err: any) {
      console.error('❌ Error increasing extra quantity:', err)
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      })
      
      setError(err.response?.data?.message || 'Failed to increase extra quantity')
      
      // Always reload basket
      await loadBasket()
    } finally {
      setLoading(false)
    }
  }

  // ✅ NEW: Handle extra quantity decrease using dedicated endpoint
  const handleExtraQuantityDecrease = async (branchProductExtraId: number, basketItemId: number) => {
    try {
      setLoading(true)
      setError(null)

      const cartItem = cart.find(item => item.basketItemId === basketItemId)
      if (!cartItem) {
        console.error('❌ Cart item not found')
        setError('Cart item not found. Please refresh.')
        return
      }

      const extra = cartItem.extras?.find(e => e.branchProductExtraId === branchProductExtraId)
      if (!extra) {
        console.error('❌ Extra not found')
        setError('Extra not found')
        return
      }

      if (extra.isRemoval) {
        console.error('❌ Cannot decrease quantity of removal extra')
        setError('Cannot decrease quantity of removal extra')
        return
      }

      // Check minimum quantity
      const minQty = extra.minQuantity !== null && extra.minQuantity !== undefined ? extra.minQuantity : 0;

      // Decrement by 1 total unit
      const newQuantity = extra.quantity - 1

   

      if (newQuantity < minQty) {
        setError(`Minimum quantity for ${extra.extraName} is ${extra.minQuantity}`)
        return
      }

      if (newQuantity <= 0) {
        // ✅ If quantity would be 0 or less, just delete the extra
        await basketService.deleteBasketItemExtra(basketItemId, branchProductExtraId)
      } else {
        // ✅ Otherwise, update the quantity
        await basketService.updateBasketItemExtra(
          basketItemId,
          branchProductExtraId,
          { quantity: newQuantity }
        )
      }


      await loadBasket()

    } catch (err: any) {
      console.error('❌ Error decreasing extra quantity:', err)
      console.error('Error response:', err.response?.data)
      
      setError(err.response?.data?.message || err.message || 'Failed to decrease extra quantity')
      
      // Always reload
      try {
        await loadBasket()
      } catch (loadErr) {
        console.error('❌ Failed to reload basket after error:', loadErr)
      }
    } finally {
      setLoading(false)
    }
  }

  // ✅ FIXED: Handle quantity decrease - UPDATE when quantity > 1 (auto-scales extras)
  const handleQuantityDecrease = async (basketItemId?: number) => {
    if (!basketItemId) return

    try {
      setLoading(true)
      setError(null)

      const cartItem = cart.find(item => item.basketItemId === basketItemId)
      if (!cartItem) {
        console.error('❌ Cart item not found')
        setError('Cart item not found. Please refresh.')
        return
      }

      if (cartItem.quantity <= 1) {
        // If quantity is 1 or less, delete the entire item
        await basketService.deleteMyBasketItem(basketItemId)
      } else {
        // If quantity > 1, update to decrease (backend auto-scales extras)
        const newQuantity = cartItem.quantity - 1
   

        await basketService.updateMyBasketItem(basketItemId, newQuantity)
      }

      await loadBasket()
    } catch (err: any) {
      console.error('❌ Error decreasing product quantity:', err)
      const errorMessage = err.response?.data?.message ||
                          err.message ||
                          'Failed to decrease item quantity'
      setError(errorMessage)

      // Reload to sync state
      try {
        await loadBasket()
      } catch (loadErr) {
        console.error('❌ Failed to reload basket after error:', loadErr)
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle addon quantity increase
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
            parentBasketItemId = cartItem.basketItemId ?? null
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

  // Addon quantity validation functions
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

  // Validation functions
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

  const validateMinimumOrder = (): string[] => {
    const errors: string[] = []
    const selectedOrderType = getSelectedOrderType()
    
    if (selectedOrderType?.minOrderAmount && totalPrice < selectedOrderType.minOrderAmount) {
      errors.push(`Minimum order amount for ${selectedOrderType.name} is ${selectedOrderType.minOrderAmount.toFixed(2)}. Current total: ${totalPrice.toFixed(2)}`)
    }
    
    return errors
  }

  const validateOrderForm = (): string[] => {
    const errors: string[] = []
    
    if (!orderForm.orderTypeId) {
      errors.push('Please select an order type')
      return errors
    }
    
    const selectedOrderType = getSelectedOrderType()
    
    if (selectedOrderType?.requiresName && !orderForm.customerName?.trim()) {
      errors.push('Customer name is required for this order type')
    }
    
    if (selectedOrderType?.requiresAddress && !orderForm.deliveryAddress?.trim()) {
      errors.push('Delivery address is required for this order type')
    }
    
    if (selectedOrderType?.requiresPhone && !orderForm.customerPhone?.trim()) {
      errors.push('Phone number is required for this order type')
    }
    
    const minOrderErrors = validateMinimumOrder()
    errors.push(...minOrderErrors)
    
    return errors
  }

  // Order creation and tracking functions
  const addOrderToTracking = async (orderTag: string) => {
    try {
      const trackingInfo = await orderService.trackOrder(orderTag)
      const newTrackedOrder = {
        orderTag,
        trackingInfo,
        createdAt: new Date()
      }
      
      setTrackedOrders([newTrackedOrder, ...trackedOrders])
      
    } catch (err: any) {
      console.error('Error adding order to tracking:', err)
    }
  }

  const handlePriceChangeConfirmation = async () => {
    try {
      const cleanSessionId = getCleanSessionId(sessionId)
      if (cleanSessionId) {
        try {
          const changes = await basketService.confirmSessionPriceChanges(cleanSessionId)
          setPriceChanges(changes)
          setShowPriceChangeModal(false)
          await createOrder()
        } catch (err: any) {
          setPriceChanges({
            message: 'Some items in your basket have price changes that need to be confirmed.',
            requiresConfirmation: true
          })
        }
      } else {
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

  // Helper function to map payment method strings to numbers
  const getPaymentMethodNumber = (paymentMethod: string): number => {
    switch (paymentMethod) {
      case 'cash':
        return 1
      case 'creditCard':
        return 2
      case 'onlinePayment':
        return 3
      default:
        return 1 // Default to cash
    }
  }

  const createOrder = async (): Promise<{
    orderTag: string;
    customerName?: string;
    estimatedMinutes?: number;
    orderTypeName?: string;
  } | null> => {
    try {
      setLoading(true)
      setError(null)
      setValidationErrors([])

      const cartErrors = validateCart()
      const formErrors = validateOrderForm()
      const allErrors = [...cartErrors, ...formErrors]

      if (allErrors.length > 0) {
        setValidationErrors(allErrors)
        setLoading(false)
        return null
      }

      const selectedOrderType = getSelectedOrderType()

      const sessionOrderDto: CreateSessionOrderDto = {
        customerName: orderForm.customerName.trim(),
        notes: orderForm.notes.trim() || undefined,
        paymentMethod: getPaymentMethodNumber(orderForm.paymentMethod),
        orderTypeId: orderForm.orderTypeId,
        ...(orderForm.tableId && { tableId: orderForm.tableId }),
        ...(orderForm.tableNumber?.trim() && { tableNumber: orderForm.tableNumber.trim() }),
        ...(selectedOrderType?.requiresAddress || orderForm.deliveryAddress?.trim() ? { deliveryAddress: orderForm.deliveryAddress?.trim() } : {}),
        ...(selectedOrderType?.requiresPhone || orderForm.customerPhone?.trim() ? { customerPhone: orderForm.customerPhone?.trim() } : {})
      }

      const order = await orderService.createSessionOrder(sessionOrderDto)

      if (order.orderTag) {
        await addOrderToTracking(order.orderTag)
      }

      const serviceChargeAmount = selectedOrderType?.serviceCharge || 0
      if (order.orderTag && WhatsAppService.isWhatsAppEnabled(restaurantPreferences)) {
        const whatsappData = {
          orderTag: order.orderTag,
          customerName: orderForm.customerName,
          cart,
          totalPrice,
          orderType: selectedOrderType?.name || 'Standard',
          notes: orderForm.notes,
          tableId: orderForm.tableId,
          tableNumber: orderForm.tableNumber,
          deliveryAddress: orderForm.deliveryAddress,
          estimatedTime: selectedOrderType?.estimatedMinutes,
          serviceCharge: serviceChargeAmount
        }

        if (setPendingWhatsAppData && setShowWhatsAppConfirmation) {
          setPendingWhatsAppData(whatsappData)
          setShowWhatsAppConfirmation(true)
          setLoading(false)
          // Return the order data for success modal
          return {
            orderTag: order.orderTag,
            customerName: orderForm.customerName || undefined,
            estimatedMinutes: selectedOrderType?.estimatedMinutes,
            orderTypeName: selectedOrderType?.name,
          }
        } else {
          console.warn('❌ WhatsApp confirmation functions not available')
        }
      }

      setCart([])
      setBasketId(null)
      setShowOrderForm(false)

      // Ensure orderTag exists before returning
      if (!order.orderTag) {
        return null
      }

      const orderResult = {
        orderTag: order.orderTag,
        customerName: orderForm.customerName || undefined,
        estimatedMinutes: selectedOrderType?.estimatedMinutes,
        orderTypeName: selectedOrderType?.name,
      }

      setOrderForm({
        customerName: '',
        notes: '',
        orderTypeId: 0,
        tableId: tableId,
        deliveryAddress: '',
        customerPhone: '',
        paymentMethod: '',
        tableNumber: ''
      })

      if (onOrderCreated) {
        onOrderCreated(order.orderId)
      }

      setError(null)

      return orderResult

    } catch (err: any) {
      console.error('❌ Error creating order:', err)
      setShowPriceChangeModal(true)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Order tracking functions
  const loadOrderTracking = async (orderTag: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const trackingInfo = await orderService.trackOrder(orderTag)
      
      setTrackedOrders(
        trackedOrders.map(order => 
          order.orderTag === orderTag 
            ? { ...order, trackingInfo }
            : order
        )
      )
      
    } catch (err: any) {
      console.error('Error loading order tracking:', err)
      setError('Failed to load order tracking information')
    } finally {
      setLoading(false)
    }
  }

  const removeOrderFromTracking = (orderTag: string) => {
    const updated = trackedOrders.filter(order => order.orderTag !== orderTag)
    setTrackedOrders(updated)
    if (updated.length === 0) {
      localStorage.removeItem('trackedOrders')
    }
  }

  const refreshAllPendingOrders = async () => {
    const pendingOrders = trackedOrders.filter(order => 
      order.trackingInfo.orderStatus === 'Pending'
    )
    
    for (const order of pendingOrders) {
      try {
        const updatedInfo = await orderService.trackOrder(order.orderTag)
        setTrackedOrders(
          trackedOrders.map(tracked => 
            tracked.orderTag === order.orderTag
              ? { ...tracked, trackingInfo: updatedInfo }
              : tracked
          )
        )
      } catch (err) {
        console.error(`Error updating order ${order.orderTag}:`, err)
      }
    }
  }

  const cleanupAfterOrder = () => {
    setCart([])
    setBasketId(null)
    setShowOrderForm(false)
    
    setOrderForm({
      customerName: '',
      notes: '',
      orderTypeId: 0,
      tableId: tableId,
      deliveryAddress: '',
      customerPhone: '',
      paymentMethod: '',
      tableNumber: ''
    })
  }

  return {
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
    getSelectedOrderType,
    handlePriceChangeConfirmation,
    sendOrderToWhatsApp,
    cleanupAfterOrder,
    handleExtraToggle,
    handleExtraQuantityIncrease,
    handleExtraQuantityDecrease 
  }
}