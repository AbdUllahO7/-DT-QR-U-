import { basketService } from "../services/Branch/BasketService"
import { orderService } from "../services/Branch/OrderService"
import { CreateSessionOrderDto } from "../types/Orders/type"

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
  tableId
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

  // Helper function to get selected order type
  const getSelectedOrderType = () => {
    return orderTypes.find(ot => ot.id === orderForm.orderTypeId)
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
        
        return {
          basketItemId: item.basketItemId,
          branchProductId: item.branchProductId,
          productName: item.productName || '',
          price: item.price || 0,
          quantity: item.quantity,
          productImageUrl: item.imageUrl ?? undefined,
          addons: mappedAddons,
          totalItemPrice: item.totalPrice || 0
        }
      })
      
      setCart(cartItems)
    } catch (err: any) {
      console.error('Error loading basket:', err)
      setError('Failed to load basket')
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

  // Handle quantity increase
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

  // Handle quantity decrease
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
    
    if (!orderForm.customerName.trim()) {
      errors.push('Customer name is required')
    }
    
    if (!orderForm.orderTypeId) {
      errors.push('Please select an order type')
    }
    
    const selectedOrderType = getSelectedOrderType()
    const minOrderErrors = validateMinimumOrder()
    errors.push(...minOrderErrors)
    
    if (selectedOrderType?.requiresAddress && !orderForm.deliveryAddress?.trim()) {
      errors.push('Delivery address is required for this order type')
    }
    
    if (selectedOrderType?.requiresPhone) {
      if (!orderForm.customerPhone?.trim()) {
        errors.push('Phone number is required for this order type')
      }
    }
    
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
      setShowPriceChangeModal(true)
      
      const cleanSessionId = getCleanSessionId(sessionId || basketId)
      
      if (cleanSessionId) {
        try {
          const changes = await basketService.confirmSessionPriceChanges(cleanSessionId)
          setPriceChanges(changes)
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

  const createOrder = async () => {
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
        return
      }

      const selectedOrderType = getSelectedOrderType()
      
      const sessionOrderDto: CreateSessionOrderDto = {
        customerName: orderForm.customerName.trim(),
        notes: orderForm.notes.trim() || undefined,
        orderTypeId: orderForm.orderTypeId,
        ...(orderForm.tableId && { tableId: orderForm.tableId }),
        ...(selectedOrderType?.requiresAddress || orderForm.deliveryAddress?.trim() ? { deliveryAddress: orderForm.deliveryAddress?.trim() } : {}),
        ...(selectedOrderType?.requiresPhone || orderForm.customerPhone?.trim() ? { customerPhone: orderForm.customerPhone?.trim() } : {})
      }
      
      const order = await orderService.createSessionOrder(sessionOrderDto)

      if (order.orderTag) {
        await addOrderToTracking(order.orderTag)
      }

      setCart([])
      setBasketId(null)
      setShowOrderForm(false)
      
      setOrderForm({
        customerName: '',
        notes: '',
        orderTypeId: 0,
        tableId: tableId,
        deliveryAddress: '',
        customerPhone: ''
      })
      
      if (onOrderCreated) {
        onOrderCreated(order.orderId)
      }

      setError(null)

    } catch (err: any) {
      console.error('❌ Error creating order:', err)
      
      if (err?.response?.status === 409) {
        const errorMessage = err?.response?.data?.message || err?.message || ''
        
        if (errorMessage.toLowerCase().includes('unconfirmed price changes') || 
            errorMessage.toLowerCase().includes('price changes')) {
          
          await handlePriceChangeConfirmation()
          return
          
        } else {
          setError(err.message || 'This order is already being processed')
        }
      } else {
        setError(err.message || 'Failed to create order')
      }
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
      
      setTrackedOrders(prev => 
        prev.map(order => 
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
    setTrackedOrders(prev => prev.filter(order => order.orderTag !== orderTag))
    const updated = trackedOrders.filter(order => order.orderTag !== orderTag)
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
        setTrackedOrders(prev => 
          prev.map(tracked => 
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
    getSelectedOrderType
  }
}