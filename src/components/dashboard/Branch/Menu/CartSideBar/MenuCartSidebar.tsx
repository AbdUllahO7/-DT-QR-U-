"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ShoppingCart, X, Trash2, ArrowRight, Loader2 } from "lucide-react"

// Import the separate components
import OrderFormComponent from "./OrderFormComponent"
import CartItemComponent from "./CartItemComponent"
import PriceChangeModal from "./PriceChangeModal"
import EmptyCartComponent from "./EmptyCartComponent"
import { MenuProduct } from "../../../../../types/menu/type"
import { useLanguage } from "../../../../../contexts/LanguageContext"
import { OrderType, orderTypeService } from "../../../../../services/Branch/BranchOrderTypeService"
import { basketService } from "../../../../../services/Branch/BasketService"
import {  orderService } from "../../../../../services/Branch/OrderService"
import { CreateSessionOrderDto } from "../../../../../types/Orders/type"

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
      
      const types = await orderTypeService.getOrderTypesBySessionId()
      
      setOrderTypes(types)
      
      // Set default order type if none selected and types are available
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

  // Updated calculateOrderTotal function - service charge is now an amount, not percentage
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

      // Service charge is an amount, not percentage
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

  // Helper function to get selected order type
  const getSelectedOrderType = () => {
    return orderTypes.find(ot => ot.id === orderForm.orderTypeId)
  }

  // Add minimum order validation function
  const validateMinimumOrder = (): string[] => {
    const errors: string[] = []
    const selectedOrderType = getSelectedOrderType()
    
    if (selectedOrderType?.minOrderAmount && totalPrice < selectedOrderType.minOrderAmount) {
      errors.push(`Minimum order amount for ${selectedOrderType.name} is ${selectedOrderType.minOrderAmount.toFixed(2)}. Current total: ${totalPrice.toFixed(2)}`)
    }
    
    return errors
  }

  // Handle price change confirmation
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

  // Updated validateOrderForm to include minimum order check
// Updated validateOrderForm to include minimum order check
const validateOrderForm = (): string[] => {
  const errors: string[] = []
  
  // Add debugging logs
  console.log('🔍 VALIDATION DEBUG:')
  console.log('Current orderForm state:', orderForm)
  console.log('Customer name trim:', `"${orderForm.customerName.trim()}"`)
  console.log('Customer phone trim:', `"${orderForm.customerPhone?.trim()}"`)
  console.log('Order type ID:', orderForm.orderTypeId)
  
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
  console.log('Selected Order Type:', selectedOrderType)
  console.log('Order type requires phone:', selectedOrderType?.requiresPhone)
  console.log('Phone value exists:', !!orderForm.customerPhone?.trim())
  console.log('Phone value length:', orderForm.customerPhone?.trim()?.length || 0)
  
  // Validate minimum order amount
  const minOrderErrors = validateMinimumOrder()
  errors.push(...minOrderErrors)
  
  // Validate address if required
  if (selectedOrderType?.requiresAddress && !orderForm.deliveryAddress?.trim()) {
    console.log('❌ Address validation failed')
    errors.push('Delivery address is required for this order type')
  }
  
  // Validate phone if required - corrected logic with enhanced debugging
  if (selectedOrderType?.requiresPhone) {
    console.log('📞 Phone is required by order type')
    if (!orderForm.customerPhone?.trim()) {
      console.log('❌ Phone validation failed - no phone provided')
      errors.push('Phone number is required for this order type')
    } else {
      console.log('✅ Phone validation passed')
    }
  } else {
    console.log('📞 Phone is NOT required by order type')
  }
  
  console.log('Final validation errors:', errors)
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

    let order
    console.log('Creating order with form data:', orderForm)
    
    // Get selected order type to determine which fields to include
    const selectedOrderType = getSelectedOrderType()
    
    // Build the session order DTO with conditional fields
    const sessionOrderDto: CreateSessionOrderDto = {
      customerName: orderForm.customerName.trim(),
      notes: orderForm.notes.trim() || undefined,
      orderTypeId: orderForm.orderTypeId,
      // Include tableId if it exists
      ...(orderForm.tableId && { tableId: orderForm.tableId }),
      // Include address if the order type requires it or if it's provided
      ...(selectedOrderType?.requiresAddress || orderForm.deliveryAddress?.trim() ? { deliveryAddress: orderForm.deliveryAddress?.trim() } : {}),
      // Include phone if the order type requires it or if it's provided
      ...(selectedOrderType?.requiresPhone || orderForm.customerPhone?.trim() ? { customerPhone: orderForm.customerPhone?.trim() } : {})
    }
    
    console.log('Session order DTO being sent:', sessionOrderDto)
    
    order = await orderService.createSessionOrder(sessionOrderDto)

    // Clear the basket after successful order creation
    setCart([])
    setBasketId(null)
    setShowOrderForm(false)
    
    // Notify parent component
    if (onOrderCreated) {
      onOrderCreated(order.orderId)
    }

    setError(null)
    
    setTimeout(() => {
      onClose()
    }, 2000)

  } catch (err: any) {
    console.error('❌ Error creating order:', err)
    
    // Check if it's a price change confirmation error
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
      setError(t('errors.decreasingQuantity'))
    } finally {
      setLoading(false)
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
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2 ml-2" />
              {showOrderForm ? t('menu.cart.title') : ''}
              {(loading || loadingOrderTypes) && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
            </h3>
            <div className="flex items-center space-x-2">
              {cart.length > 0 && !showOrderForm && (
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
            <>
              {cart.length > 0 ? (
                <>
                  <div className="space-y-6 mb-6">
                    {groupedItems.map((group) => (
                      <CartItemComponent
                        key={group.product.branchProductId}
                        group={group}
                        loading={loading}
                        onQuantityIncrease={handleQuantityIncrease}
                        onQuantityDecrease={handleQuantityDecrease}
                        onAddonQuantityIncrease={handleAddonQuantityIncrease}
                        onRemoveFromBasket={removeFromBasket}
                        canIncreaseAddonQuantity={canIncreaseAddonQuantity}
                        canDecreaseAddonQuantity={canDecreaseAddonQuantity}
                        getAddonQuantityError={getAddonQuantityError}
                      />
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
              ) : (
                <EmptyCartComponent />
              )}
            </>
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