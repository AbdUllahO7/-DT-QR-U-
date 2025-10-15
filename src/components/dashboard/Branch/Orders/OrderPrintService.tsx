import { orderService } from "../../../../services/Branch/OrderService";
import { Order } from "../../../../types/BranchManagement/type";
import { OrderStatusEnums } from "../../../../types/Orders/type";


export interface PrintOrderOptions {
  order: Order;
  status: OrderStatusEnums;
  lang: string;
  t: (key: string) => string;
}

export class OrderPrintService {
  private static calculateTotalQuantity(items: any[]): number {
    let totalCount = 0;
    const countItems = (itemList: any[]) => {
      itemList.forEach(item => {
        totalCount += item.count || 1;
        if (item.addonItems && item.addonItems.length > 0) {
          countItems(item.addonItems);
        }
      });
    };
    countItems(items);
    return totalCount;
  }

  private static generateItemsHTML(itemList: any[], isAddon = false): string {
    return itemList.map(item => `
      <div style="margin-left: ${isAddon ? '20px' : '0'}; margin-bottom: 10px; padding: 12px; border: 1px solid #ddd; border-radius: 4px; background: ${isAddon ? '#f8f9fa' : 'white'};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div style="flex: 1;">
            <div style="font-weight: bold; margin-bottom: 8px; font-size: 14px;">
              ${item.productName}
              ${isAddon ? '<span style="background: #e3f2fd; padding: 2px 8px; border-radius: 12px; font-size: 10px; margin-left: 8px; color: #1976d2;">Add-on</span>' : ''}
            </div>
            <div style="font-size: 12px; color: #666; margin-bottom: 5px;">
              <span style="margin-right: 15px;">Qty: <strong>${item.count || 1}</strong></span>
              <span style="margin-right: 15px;">Unit Price: <strong>$${item.price?.toFixed(2) || 'N/A'}</strong></span>
              ${item.addonPrice ? `<span>Addon Price: <strong>$${item.addonPrice.toFixed(2)}</strong></span>` : ''}
            </div>
            ${(item.note || item.addonNote) ? `
              <div style="background: #fff3cd; padding: 8px; border-radius: 4px; font-size: 11px; margin-top: 8px; border-left: 3px solid #ffc107;">
                <strong style="color: #856404;">Note:</strong> <span style="color: #856404;">${item.note || item.addonNote}</span>
              </div>
            ` : ''}
          </div>
          <div style="text-align: right; margin-left: 15px;">
            <div style="font-size: 11px; color: #666; margin-bottom: 3px;">Total</div>
            <div style="font-size: 18px; font-weight: bold; color: #2e7d32;">$${item.totalPrice?.toFixed(2) || 'N/A'}</div>
          </div>
        </div>
        ${item.addonItems && item.addonItems.length > 0 ? this.generateItemsHTML(item.addonItems, true) : ''}
      </div>
    `).join('');
  }

  private static parseMetadata(notes: string | null) {
    if (!notes) return null;
    const metadataMatch = notes.match(/\[METADATA:(.*?)\]/);
    if (metadataMatch) {
      try {
        return JSON.parse(metadataMatch[1]);
      } catch {
        return null;
      }
    }
    return null;
  }

  private static getCleanNotes(notes: string | null) {
    if (!notes) return null;
    return notes.replace(/\[METADATA:.*?\]/, '').trim() || null;
  }

  public static generatePrintHTML(options: PrintOrderOptions): string {
    const { order, status, lang, t } = options;
    const items = (order as any).items || [];
    const totalQuantity = this.calculateTotalQuantity(items);
    const metadata = this.parseMetadata((order as any).notes);
    const cleanNotes = this.getCleanNotes((order as any).notes);

    return `
      <!DOCTYPE html>
      <html lang="${lang}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order #${order.orderTag}</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px;
            color: #000;
            background: white;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #333;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }
          .header h1 {
            font-size: 28px;
            margin-bottom: 8px;
            color: #1a1a1a;
          }
          .header .order-number {
            font-size: 16px;
            color: #666;
            margin-bottom: 10px;
          }
          .header .order-type {
            font-size: 18px;
            margin-top: 10px;
          }
          .header .status {
            display: inline-block;
            padding: 6px 15px;
            background: #e8f5e9;
            border: 1px solid #4caf50;
            border-radius: 20px;
            font-size: 13px;
            font-weight: bold;
            margin-top: 10px;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 25px;
          }
          .stat-card {
            border: 1px solid #ddd;
            padding: 15px;
            text-align: center;
            border-radius: 6px;
            background: #f9f9f9;
          }
          .stat-label {
            font-size: 11px;
            color: #666;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .stat-value {
            font-size: 22px;
            font-weight: bold;
            color: #1a1a1a;
          }
          .section {
            margin-bottom: 25px;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 6px;
            background: #fafafa;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e0e0e0;
            color: #1a1a1a;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .info-item {
            padding: 10px;
            background: white;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
          }
          .info-label {
            font-size: 11px;
            color: #666;
            margin-bottom: 4px;
            text-transform: uppercase;
          }
          .info-value {
            font-size: 13px;
            font-weight: 600;
            color: #1a1a1a;
          }
          .items-section {
            margin-bottom: 25px;
          }
          .total-section {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 6px;
            margin-top: 25px;
            border: 1px solid #ddd;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
            border-bottom: 1px solid #e0e0e0;
          }
          .total-row:last-child {
            border-bottom: none;
          }
          .grand-total {
            font-size: 22px;
            font-weight: bold;
            border-top: 3px solid #333;
            padding-top: 12px;
            margin-top: 12px;
          }
          .grand-total .label {
            color: #1a1a1a;
          }
          .grand-total .value {
            color: #2e7d32;
          }
          .timeline {
            margin-top: 25px;
          }
          .timeline-item {
            padding: 12px;
            border-left: 4px solid #1976d2;
            margin-bottom: 12px;
            background: #f8f9fa;
            border-radius: 0 4px 4px 0;
          }
          .timeline-label {
            font-size: 12px;
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 4px;
          }
          .timeline-value {
            font-size: 13px;
            color: #333;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #ddd;
            font-size: 11px;
            color: #666;
          }
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${t('ordersManager.orderDetailsTitle')}</h1>
          <div class="order-number">Order #${order.orderTag}</div>
          <div class="order-type">
            ${(order as any).orderTypeIcon || '📦'} ${(order as any).orderTypeName || 'Order'} 
            ${(order as any).orderTypeCode ? `(${(order as any).orderTypeCode})` : ''}
          </div>
          <div class="status">${orderService.getOrderStatusText(status, lang)}</div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">${t('ordersManager.OrderTag')}</div>
            <div class="stat-value">${order.orderTag}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${t('ordersManager.ItemCount')}</div>
            <div class="stat-value">${(order as any).itemCount || items.length || 0}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${t('ordersManager.quantity')}</div>
            <div class="stat-value">${totalQuantity}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${t('ordersManager.total')}</div>
            <div class="stat-value">$${order.totalPrice.toFixed(2)}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">${t('ordersManager.CustomerInformation')}</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">${t('ordersManager.CustomerName')}</div>
              <div class="info-value">${order.customerName || 'N/A'}</div>
            </div>
            ${(order as any).customerPhone ? `
              <div class="info-item">
                <div class="info-label">${t('ordersManager.PhoneNumber')}</div>
                <div class="info-value">${(order as any).customerPhone}</div>
              </div>
            ` : ''}
          </div>
        </div>

        ${((order as any).deliveryAddress || (order as any).tableName) ? `
          <div class="section">
            <div class="section-title">
              ${(order as any).deliveryAddress ? t('ordersManager.DeliveryInformation') : t('ordersManager.TableInformation')}
            </div>
            ${(order as any).deliveryAddress ? `
              <div class="info-item">
                <div class="info-label">${t('ordersManager.DeliveryAddress')}</div>
                <div class="info-value">${(order as any).deliveryAddress}</div>
              </div>
            ` : ''}
            ${(order as any).tableName ? `
              <div class="info-item">
                <div class="info-label">${t('ordersManager.table')}</div>
                <div class="info-value">${(order as any).tableName} ${(order as any).tableId ? `(ID: ${(order as any).tableId})` : ''}</div>
              </div>
            ` : ''}
          </div>
        ` : ''}

        ${cleanNotes ? `
          <div class="section">
            <div class="section-title">${t('ordersManager.OrderNotes')}</div>
            <div style="padding: 10px; background: white; border-radius: 4px; line-height: 1.8;">
              ${cleanNotes}
            </div>
          </div>
        ` : ''}

        <div class="items-section">
          <div class="section">
            <div class="section-title">${t('ordersManager.orderItems')}</div>
            ${items.length > 0 ? this.generateItemsHTML(items) : '<p style="text-align: center; color: #999; padding: 20px;">No items available</p>'}
          </div>
        </div>

        <div class="total-section">
          <div class="total-row">
            <span>${t('ordersManager.subTotal')}:</span>
            <span style="font-weight: 600;">$${(order.subTotal || 0).toFixed(2)}</span>
          </div>
          ${order.serviceFeeApplied !== undefined && order.serviceFeeApplied > 0 ? `
            <div class="total-row">
              <span>${t('ordersManager.serviceFeeApplied')}:</span>
              <span style="font-weight: 600; color: #1976d2;">+$${order.serviceFeeApplied.toFixed(2)}</span>
            </div>
          ` : ''}
          ${metadata?.MinOrderAmount ? `
            <div class="total-row">
              <span>${t('ordersManager.MinOrderAmount')}:</span>
              <span style="font-weight: 600;">$${parseFloat(metadata.MinOrderAmount).toFixed(2)}</span>
            </div>
          ` : ''}
          <div class="total-row grand-total">
            <span class="label">${t('ordersManager.total')}:</span>
            <span class="value">$${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div class="timeline">
          <div class="section">
            <div class="section-title">${t('ordersManager.OrderTimeline')}</div>
            <div class="timeline-item">
              <div class="timeline-label">${t('ordersManager.createdAt')}</div>
              <div class="timeline-value">${new Date(order.createdAt).toLocaleString(
                lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US',
                { dateStyle: 'medium', timeStyle: 'short' }
              )}</div>
            </div>
            ${(order as any).confirmedAt ? `
              <div class="timeline-item" style="border-left-color: #4caf50;">
                <div class="timeline-label" style="color: #4caf50;">${t('ordersManager.confirmedAt')}</div>
                <div class="timeline-value">${new Date((order as any).confirmedAt).toLocaleString(
                  lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US',
                  { dateStyle: 'medium', timeStyle: 'short' }
                )}</div>
              </div>
            ` : ''}
            ${(order as any).completedAt ? `
              <div class="timeline-item" style="border-left-color: #2196f3;">
                <div class="timeline-label" style="color: #2196f3;">${t('ordersManager.CompletedAt')}</div>
                <div class="timeline-value">${new Date((order as any).completedAt).toLocaleString(
                  lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US',
                  { dateStyle: 'medium', timeStyle: 'short' }
                )}</div>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="footer">
          <p>Printed: ${new Date().toLocaleString(lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US', {
            dateStyle: 'full',
            timeStyle: 'short'
          })}</p>
          <p style="margin-top: 5px;">Order Management System</p>
        </div>
      </body>
      </html>
    `;
  }

  public static print(options: PrintOrderOptions): void {
    const printHTML = this.generatePrintHTML(options);
    
    const printWindow = window.open('', '_blank', 'width=900,height=800');
    if (printWindow) {
      printWindow.document.write(printHTML);
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      alert('Please allow popups to print the order');
    }
  }
}