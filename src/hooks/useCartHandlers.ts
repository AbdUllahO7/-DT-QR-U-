// hooks/useCartHandlers.ts (Fixed version)

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
  // FIXED: Add WhatsApp confirmation modal controls
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
  // FIXED: Add these parameters
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

  // Function to send order to WhatsApp
  const sendOrderToWhatsApp = async (whatsappData: any) => {
    try {
      const whatsappNumber = WhatsAppService.formatWhatsAppNumber(
        restaurantPreferences.whatsAppPhoneNumber
      )

      await WhatsAppService.sendOrderToWhatsApp(whatsappNumber, whatsappData)
      
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error)
      throw error // Re-throw so the caller can handle it
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
        // Map addons
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
        
        return {
          basketItemId: item.basketItemId,
          branchProductId: item.branchProductId,
          productName: item.productName || '',
          price: item.price || 0,
          quantity: item.quantity,
          productImageUrl: item.imageUrl ?? undefined,
          addons: mappedAddons,
          extras: mappedExtras,  
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


const handleAddExtraBack = async (branchProductExtraId: number, basketItemId: number) => {
  try {
    setLoading(true)
    setError(null)

    const cartItem = cart.find(item => item.basketItemId === basketItemId)
    if (!cartItem) {
      console.error('Cart item not found')
      return
    }

    const extra = cartItem.extras?.find(e => e.branchProductExtraId === branchProductExtraId)
    if (!extra || !extra.isRemoval) {
      console.error('Can only add back removal extras')
      return
    }

    await basketService.deleteMyBasketItem(basketItemId)

    // Remove this extra entirely from the payload (don't send it)
    const updatedExtras: ProductExtraDto[] = cartItem.extras
      ?.filter(e => e.branchProductExtraId !== branchProductExtraId)
      ?.map(e => {
        const extraPayload: any = {
          branchProductExtraId: e.branchProductExtraId,
          extraId: e.extraId,
          isRemoval: e.isRemoval
        }
        
        if (!e.isRemoval) {
          extraPayload.quantity = e.quantity
        }
        
        return extraPayload
      }) || []

    await basketService.addUnifiedItemToMyBasket({
      branchProductId: cartItem.branchProductId,
      quantity: cartItem.quantity,
      extras: updatedExtras.length > 0 ? updatedExtras : undefined
    })

    await loadBasket()

  } catch (err: any) {
    console.error('Error adding extra back:', err)
    setError('Failed to add extra back')
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

// Handle quantity increase - Send ALL extras properly
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

    // ✅ Map extras properly: omit quantity for removals with quantity > 0
    const productExtras: ProductExtraDto[] = cartItem.extras?.map(extra => {
      const extraPayload: any = {
        branchProductExtraId: extra.branchProductExtraId,
        extraId: extra.extraId,
        isRemoval: extra.isRemoval
      }
      
      if (extra.isRemoval) {
        // For removal extras:
        // quantity: 1 → Don't send quantity field (user doesn't want it)
        // quantity: 0 → Send quantity: 0 (user wants it)
        if (extra.quantity === 0) {
          extraPayload.quantity = 0
        }
        // If quantity is 1, don't add quantity field at all
      } else {
        // For addition extras: always send quantity
        extraPayload.quantity = extra.quantity
      }
      
      return extraPayload
    }) || []

    await basketService.addUnifiedItemToMyBasket({
      branchProductId: cartItem.branchProductId,
      quantity: 1,
      extras: productExtras.length > 0 ? productExtras : undefined
    })

    await loadBasket()
  } catch (err: any) {
    console.error('Error increasing parent item quantity:', err)
    setError('Failed to increase item quantity')
  } finally {
    setLoading(false)
  }
}

// Handle extra toggle - SIMPLIFIED AND CORRECTED
const handleExtraToggle = async (branchProductExtraId: number, basketItemId: number, currentIsRemoval: boolean) => {
  if (!currentIsRemoval) {
    console.warn('Toggle should only be used for removed items (isRemoval: true)')
    return
  }

  try {
    setLoading(true)
    setError(null)

    const cartItem = cart.find(item => item.basketItemId === basketItemId)
    if (!cartItem) {
      console.error('Cart item not found')
      return
    }

    const extra = cartItem.extras?.find(e => e.branchProductExtraId === branchProductExtraId)
    if (!extra) {
      console.error('Extra not found')
      return
    }

    await basketService.deleteMyBasketItem(basketItemId)

    // ✅ CORRECTED: Send ALL extras and toggle the clicked one
    const updatedExtras: ProductExtraDto[] = cartItem.extras?.map(e => {
      const extraPayload: any = {
        branchProductExtraId: e.branchProductExtraId,
        extraId: e.extraId,
        isRemoval: e.isRemoval
      }
      
      if (e.isRemoval) {
        if (e.branchProductExtraId === branchProductExtraId) {
          // Toggle the clicked removal extra
          // quantity: 1 → set to 0 (add it back)
          // quantity: 0 → don't add field (remove it)
          if (e.quantity === 1) {
            extraPayload.quantity = 0
          }
          // If quantity is 0, don't add quantity field
        } else {
          // Keep other removal extras as they are
          if (e.quantity === 0) {
            extraPayload.quantity = 0
          }
          // If quantity is 1, don't add quantity field
        }
      } else {
        // For addition extras: always send quantity
        extraPayload.quantity = e.quantity
      }
      
      return extraPayload
    }) || []


    await basketService.addUnifiedItemToMyBasket({
      branchProductId: cartItem.branchProductId,
      quantity: cartItem.quantity,
      extras: updatedExtras.length > 0 ? updatedExtras : undefined
    })

    await loadBasket()

  } catch (err: any) {
    console.error('Error toggling extra:', err)
    setError('Failed to update extra')
  } finally {
    setLoading(false)
  }
}

// Handle extra quantity increase - For addition extras only
const handleExtraQuantityIncrease = async (branchProductExtraId: number, basketItemId: number) => {
  try {
    setLoading(true)
    setError(null)

    const cartItem = cart.find(item => item.basketItemId === basketItemId)
    if (!cartItem) {
      console.error('Cart item not found')
      return
    }

    const extra = cartItem.extras?.find(e => e.branchProductExtraId === branchProductExtraId)
    if (!extra) {
      console.error('Extra not found')
      return
    }

    if (extra.isRemoval) {
      console.error('Cannot increase quantity of removal extra')
      return
    }

    if (extra.maxQuantity && extra.quantity >= extra.maxQuantity) {
      setError(`Maximum quantity for ${extra.extraName} is ${extra.maxQuantity}`)
      setLoading(false)
      return
    }

    await basketService.deleteMyBasketItem(basketItemId)

    const updatedExtras: ProductExtraDto[] = cartItem.extras?.map(e => {
      const extraPayload: any = {
        branchProductExtraId: e.branchProductExtraId,
        extraId: e.extraId,
        isRemoval: e.isRemoval
      }
      
      if (e.isRemoval) {
        // For removal extras: handle quantity properly
        if (e.quantity === 0) {
          extraPayload.quantity = 0
        }
        // If quantity is 1, don't add quantity field
      } else {
        // For addition extras: always send quantity
        extraPayload.quantity = e.branchProductExtraId === branchProductExtraId 
          ? e.quantity + 1 
          : e.quantity
      }
      
      return extraPayload
    }) || []

    await basketService.addUnifiedItemToMyBasket({
      branchProductId: cartItem.branchProductId,
      quantity: cartItem.quantity,
      extras: updatedExtras.length > 0 ? updatedExtras : undefined
    })

    await loadBasket()

  } catch (err: any) {
    console.error('Error increasing extra quantity:', err)
    setError('Failed to increase extra quantity')
  } finally {
    setLoading(false)
  }
}

// Handle extra quantity decrease - For addition extras only
const handleExtraQuantityDecrease = async (branchProductExtraId: number, basketItemId: number) => {
  try {
    setLoading(true)
    setError(null)

    const cartItem = cart.find(item => item.basketItemId === basketItemId)
    if (!cartItem) {
      console.error('Cart item not found')
      return
    }

    const extra = cartItem.extras?.find(e => e.branchProductExtraId === branchProductExtraId)
    if (!extra) {
      console.error('Extra not found')
      return
    }

    if (extra.isRemoval) {
      console.error('Cannot decrease quantity of removal extra')
      return
    }

    if (extra.minQuantity && extra.quantity <= extra.minQuantity) {
      setError(`Minimum quantity for ${extra.extraName} is ${extra.minQuantity}`)
      setLoading(false)
      return
    }

    await basketService.deleteMyBasketItem(basketItemId)

    const updatedExtras: ProductExtraDto[] = cartItem.extras?.map(e => {
      const extraPayload: any = {
        branchProductExtraId: e.branchProductExtraId,
        extraId: e.extraId,
        isRemoval: e.isRemoval
      }
      
      if (e.isRemoval) {
        // For removal extras: handle quantity properly
        if (e.quantity === 0) {
          extraPayload.quantity = 0
        }
        // If quantity is 1, don't add quantity field
      } else {
        // For addition extras: always send quantity
        extraPayload.quantity = e.branchProductExtraId === branchProductExtraId 
          ? Math.max(0, e.quantity - 1)
          : e.quantity
      }
      
      return extraPayload
    }) || []

    await basketService.addUnifiedItemToMyBasket({
      branchProductId: cartItem.branchProductId,
      quantity: cartItem.quantity,
      extras: updatedExtras.length > 0 ? updatedExtras : undefined
    })

    await loadBasket()

  } catch (err: any) {
    console.error('Error decreasing extra quantity:', err)
    setError('Failed to decrease extra quantity')
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

// In useCartHandlers.ts - Update validateOrderForm function
const validateOrderForm = (): string[] => {
  const errors: string[] = []
  
  if (!orderForm.orderTypeId) {
    errors.push('Please select an order type')
    return errors // Return early if no order type selected
  }
  
  const selectedOrderType = getSelectedOrderType()
  
  // Validate required fields based on order type
  if (selectedOrderType?.requiresName && !orderForm.customerName?.trim()) {
    errors.push('Customer name is required for this order type')
  }
  
  if (selectedOrderType?.requiresAddress && !orderForm.deliveryAddress?.trim()) {
    errors.push('Delivery address is required for this order type')
  }
  
  if (selectedOrderType?.requiresPhone && !orderForm.customerPhone?.trim()) {
    errors.push('Phone number is required for this order type')
  }
  
  if (selectedOrderType?.requiresTable && !(orderForm as any).tableNumber?.trim()) {
    errors.push('Table number is required for this order type')
  }
  
  // Validate minimum order
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

  // FIXED: Create order function with proper WhatsApp confirmation
// FIXED: Create order function with proper WhatsApp confirmation
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
      paymentMethod:"",
      orderTypeId: orderForm.orderTypeId,
      ...(orderForm.tableId && { tableId: orderForm.tableId }),
      ...(orderForm.tableNumber?.trim() && { tableNumber: orderForm.tableNumber.trim() }),
      ...(selectedOrderType?.requiresAddress || orderForm.deliveryAddress?.trim() ? { deliveryAddress: orderForm.deliveryAddress?.trim() } : {}),
      ...(selectedOrderType?.requiresPhone || orderForm.customerPhone?.trim() ? { customerPhone: orderForm.customerPhone?.trim() } : {})
    }
    
    const order = await orderService.createSessionOrder(sessionOrderDto)
    // Add order to tracking immediately
    if (order.orderTag) {
      await addOrderToTracking(order.orderTag)
    }
    // Calculate order total for WhatsApp message
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

      // Set WhatsApp data and show modal
      if (setPendingWhatsAppData && setShowWhatsAppConfirmation) {
        setPendingWhatsAppData(whatsappData)
        setShowWhatsAppConfirmation(true)
        
        // DON'T clear cart and form here - let the WhatsApp handlers do it
        setLoading(false)
        return // Exit early to let WhatsApp modal show
      } else {
        console.warn('❌ WhatsApp confirmation functions not available')
      }
    } 
    
    // If we reach here, WhatsApp is not enabled or not available
    // Clean up and complete the order
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
    
    if (onOrderCreated) {
      onOrderCreated(order.orderId)
    }

    setError(null)

  } catch (err: any) {
    console.error('❌ Error creating order:', err)
    setShowPriceChangeModal(true)
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

  // Add this new function to clean up after order
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

// Add cleanupAfterOrder to the return statement
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