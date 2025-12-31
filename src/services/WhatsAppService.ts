// services/WhatsAppService.ts

interface CartItemAddon {
  branchProductAddonId?: number
  addonName: string
  price: number
  quantity: number
}

interface CartItemExtra {
  extraName: string
  isRemoval: boolean
  quantity: number
  price: number
}

interface CartItem {
  basketItemId?: number
  branchProductId?: number
  productName: string
  price: number
  quantity: number
  productImageUrl?: string
  addons?: CartItemAddon[]
  extras?: CartItemExtra[]
  totalItemPrice?: number // Optional, sometimes calculated
}

// Updated to include ALL fields sent from OnlineCartSidebar
export interface WhatsAppOrderData {
  orderTag: string
  restaurantName?: string
  customerName: string
  customerPhone?: string    // <--- Added
  paymentMethod?: string    // <--- Added
  
  cart: CartItem[]
  
  // Financials
  subtotal?: number         // <--- Added
  tax?: number              // <--- Added
  serviceCharge?: number
  totalPrice: number
  
  // Meta
  orderType: string
  notes?: string
  tableNumber?: string      // Changed from tableId to match Sidebar
  deliveryAddress?: string
  estimatedTime?: number
}

export class WhatsAppService {
  
  /**
   * Format cart items for WhatsApp message
   */
  private static formatCartItems(cart: CartItem[]): string {
    let message = "*🛒 ORDER DETAILS:*"

    cart.forEach((item, index) => {
      // Main product line: 1. Burger x1
      message += `\n\n${index + 1}. *${item.productName}* x${item.quantity}`

      // Unit Price
      message += `\n   💰 ${item.price.toFixed(2)} TRY each`

      // Add extras if any
      if (item.extras && item.extras.length > 0) {
        item.extras.forEach(extra => {
          if (extra.isRemoval) {
            // Removal extras (like "No onions")
            message += `\n   ❌ No ${extra.extraName}`
          } else {
            // Normal extras with quantity and price
            message += `\n   ✨ ${extra.extraName} (${extra.quantity}x) - ${extra.price.toFixed(2)} TRY`
          }
        })
      }

      // Add addons if any
      if (item.addons && item.addons.length > 0) {
        item.addons.forEach(addon => {
          message += `\n   ➕ ${addon.addonName} (${addon.quantity}x) - ${addon.price.toFixed(2)} TRY`
        })
      }

      // Item total (Use provided total or calculate)
      const finalItemPrice = item.totalItemPrice
        ? item.totalItemPrice
        : (item.price * item.quantity); // Fallback calculation

      message += `\n   👉 *Item Total: ${finalItemPrice.toFixed(2)} TRY*`
    })

    return message
  }

  /**
   * Format order summary for WhatsApp
   */
  private static formatOrderSummary(data: WhatsAppOrderData): string {
    const date = new Date().toLocaleString('tr-TR');
    let message = `*🚨 NEW ORDER RECEIVED!*\n`
    
    // 1. Header Info
    message += `\n*🏷 Order Tag:* ${data.orderTag}`
    message += `\n*👤 Customer:* ${data.customerName}`
    
    if (data.customerPhone) {
      message += `\n*📞 Phone:* ${data.customerPhone}`
    }
    
    message += `\n*🚚 Order Type:* ${data.orderType}`

    if (data.paymentMethod) {
      message += `\n*💳 Payment Method:* ${data.paymentMethod}`
    }
    
    if (data.tableNumber) {
      message += `\n*🍽 Table:* ${data.tableNumber}`
    }
    
    if (data.deliveryAddress) {
      message += `\n*📍 Delivery Address:* ${data.deliveryAddress}`
    }
    
    if (data.estimatedTime) {
      message += `\n*⏳ Estimated Time:* ${data.estimatedTime} minutes`
    }
    
    message += `\n`
    
    // 2. Cart Details
    message += this.formatCartItems(data.cart)
    
    message += `\n\n`
    
    // 3. Price Breakdown
    message += `*💰 PRICE BREAKDOWN:*`
    
    if (data.subtotal !== undefined) {
      message += `\nSubtotal: ${data.subtotal.toFixed(2)} TRY`
    }
    
    if (data.tax && data.tax > 0) {
      message += `\nTax: ${data.tax.toFixed(2)} TRY`
    }
    
    if (data.serviceCharge && data.serviceCharge > 0) {
      message += `\nService Charge: ${data.serviceCharge.toFixed(2)} TRY`
    }
    
    message += `\n*TOTAL: ${data.totalPrice.toFixed(2)} TRY*`
    
    // 4. Notes
    if (data.notes && data.notes.trim()) {
      message += `\n\n*📝 Special Notes:*\n${data.notes}`
    }
    
    // 5. Footer
    message += `\n\n*📅 Order Time:* ${date}`
    message += `\n\n_This order was automatically sent from your QR Menu system._`
    
    return message
  }

  /**
   * Send order to WhatsApp
   * Handles Mobile vs Desktop URLs for better UX
   */
  static async sendOrderToWhatsApp(
    phoneNumber: string, 
    orderData: WhatsAppOrderData
  ): Promise<void> {
    try {
      const formattedPhone = this.formatWhatsAppNumber(phoneNumber);
      
      // Format the message
      const message = this.formatOrderSummary(orderData)
      
      // Encode the message for URL
      const encodedMessage = encodeURIComponent(message)
      
      // Detect Device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      let whatsappUrl = '';
      
      if (isMobile) {
        // Use App Scheme for Mobile (Opens App directly)
        whatsappUrl = `whatsapp://send?phone=${formattedPhone}&text=${encodedMessage}`;
      } else {
        // Use Web URL for Desktop
        whatsappUrl = `https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`;
      }
      
      // Open WhatsApp
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
  static formatWhatsAppNumber(phoneNumber: string | undefined): string {
    if (!phoneNumber) return '';
    
    // Remove all non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, '')
    
    // If it starts with 0, replace with country code (assuming Turkey +90)
    if (digitsOnly.startsWith('0')) {
      return '90' + digitsOnly.substring(1)
    }
    
    // If it doesn't start with country code, add Turkey code
    // Basic check: if length is 10, assume it's a local number without country code
    if (!digitsOnly.startsWith('90') && digitsOnly.length === 10) {
      return '90' + digitsOnly
    }
    
    return digitsOnly
  }
}