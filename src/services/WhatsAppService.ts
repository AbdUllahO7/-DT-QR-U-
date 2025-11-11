// services/WhatsAppService.ts

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

interface CartItemAddon {
  branchProductAddonId: number
  addonName: string
  price: number
  quantity: number
}

interface OrderForm {
  customerName: string
  notes: string
  orderTypeId: number
  tableId?: number
  deliveryAddress?: string
  customerPhone?: string
}

interface WhatsAppOrderData {
  orderTag: string
  customerName: string
  cart: CartItem[]
  totalPrice: number
  orderType: string
  notes?: string
  tableId?: number
  deliveryAddress?: string
  estimatedTime?: number
  serviceCharge?: number
}

export class WhatsAppService {
  
  /**
   * Format cart items for WhatsApp message
   */
  private static formatCartItems(cart: CartItem[]): string {
    let message = "*🛒 ORDER DETAILS:*\n\n"
    
    cart.forEach((item, index) => {
      // Main product line
      message += `${index + 1}. *${item.productName}* x${item.quantity}\n`
      message += `   💰 ${item.price.toFixed(2)} TRY each\n`
      
      // Add addons if any
      if (item.addons && item.addons.length > 0) {
        message += "   📎 *Add-ons:*\n"
        item.addons.forEach(addon => {
          message += `      • ${addon.addonName} x${addon.quantity} (+${addon.price.toFixed(2)} TRY each)\n`
        })
      }
      
      // Item total
      const itemTotal = item.totalItemPrice * item.quantity
      message += `   💵 *Item Total: ${itemTotal.toFixed(2)} TRY*\n\n`
    })
    
    return message
  }

  /**
   * Format order summary for WhatsApp
   */
  private static formatOrderSummary(data: WhatsAppOrderData): string {
    let message = `*🎯 NEW ORDER RECEIVED!*\n\n`
    
    // Order info
    message += `*📋 Order Tag:* ${data.orderTag}\n`
    message += `*👤 Customer:* ${data.customerName}\n`
    message += `*🔄 Order Type:* ${data.orderType}\n`
    
    if (data.tableId) {
      message += `*🪑 Table:* ${data.tableId}\n`
    }
    
    if (data.deliveryAddress) {
      message += `*📍 Delivery Address:* ${data.deliveryAddress}\n`
    }
    
    if (data.estimatedTime) {
      message += `*⏱️ Estimated Time:* ${data.estimatedTime} minutes\n`
    }
    
    message += `\n`
    
    // Cart details
    message += this.formatCartItems(data.cart)
    
    // Pricing summary
    const subtotal = data.totalPrice - (data.serviceCharge || 0)
    message += `*💰 PRICE BREAKDOWN:*\n`
    message += `Subtotal: ${subtotal.toFixed(2)} TRY\n`
    
    if (data.serviceCharge && data.serviceCharge > 0) {
      message += `Service Charge: ${data.serviceCharge.toFixed(2)} TRY\n`
    }
    
    message += `*TOTAL: ${data.totalPrice.toFixed(2)} TRY*\n\n`
    
    // Notes
    if (data.notes && data.notes.trim()) {
      message += `*📝 Special Notes:*\n${data.notes}\n\n`
    }
    
    // Footer
    message += `*🕐 Order Time:* ${new Date().toLocaleString('tr-TR')}\n`
    message += `\n_This order was automatically sent from your QR Menu system._`
    
    return message
  }

  /**
   * Send order to WhatsApp
   */
  static async sendOrderToWhatsApp(
    whatsappNumber: string, 
    orderData: WhatsAppOrderData
  ): Promise<void> {
    try {
      // Format the message
      const message = this.formatOrderSummary(orderData)
      
      // Encode the message for URL
      const encodedMessage = encodeURIComponent(message)
      
      // Create WhatsApp URL
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
      
      // Open WhatsApp in new window/tab
      window.open(whatsappUrl, '_blank')
      
    } catch (error) {
      console.error('Error sending WhatsApp message:', error)
      throw new Error('Failed to send WhatsApp message')
    }
  }

  /**
   * Check if WhatsApp orders are enabled
   */
  static isWhatsAppEnabled(preferences: any): boolean {

    return preferences?.useWhatsappForOrders === true && 
           preferences?.whatsAppPhoneNumber && 
           preferences.whatsAppPhoneNumber.trim().length > 0
  }

  /**
   * Get formatted WhatsApp number (remove non-digits and ensure international format)
   */
  static formatWhatsAppNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, '')
    
    // If it starts with 0, replace with country code (assuming Turkey +90)
    if (digitsOnly.startsWith('0')) {
      return '90' + digitsOnly.substring(1)
    }
    
    // If it doesn't start with country code, add Turkey code
    if (!digitsOnly.startsWith('90') && digitsOnly.length === 10) {
      return '90' + digitsOnly
    }
    
    return digitsOnly
  }

  /**
   * Create a simple text-only version for SMS or other messaging
   */
  static formatSimpleOrderText(orderData: WhatsAppOrderData): string {
    let message = `NEW ORDER: ${orderData.orderTag}\n`
    message += `Customer: ${orderData.customerName}\n`
    message += `Type: ${orderData.orderType}\n\n`
    
    message += `ITEMS:\n`
    orderData.cart.forEach((item, index) => {
      message += `${index + 1}. ${item.productName} x${item.quantity} - ${(item.totalItemPrice * item.quantity).toFixed(2)} TRY\n`
      
      if (item.addons && item.addons.length > 0) {
        item.addons.forEach(addon => {
          message += `   + ${addon.addonName} x${addon.quantity}\n`
        })
      }
    })
    
    message += `\nTOTAL: ${orderData.totalPrice.toFixed(2)} TRY\n`
    
    if (orderData.notes) {
      message += `Notes: ${orderData.notes}\n`
    }
    
    return message
  }
}