import React from 'react';
import { 
  Eye, XCircle, Clock, Package, AlertCircle, MapPin, Phone, User, Truck, 
  Home, CheckCircle, Printer, Calendar, Hash, ShoppingBag, MessageSquare,
  DollarSign, TrendingUp
} from 'lucide-react';
import { orderService } from '../../../../services/Branch/OrderService';
import { BranchOrder, Order } from '../../../../types/BranchManagement/type';
import { OrderStatusEnums } from '../../../../types/Orders/type';
import OrderStatusUtils from '../../../../utils/OrderStatusUtils';

interface OrderDetailsModalProps {
  show: boolean;
  order: Order | null;
  viewMode: 'pending' | 'branch';
  lang: string;
  onClose: () => void;
  t: (key: string) => string;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  show,
  order,
  viewMode,
  lang,
  onClose,
  t
}) => {
  if (!show || !order) return null;
  
  const status = viewMode === 'branch' 
    ? orderService.parseOrderStatus((order as unknown as BranchOrder).status)
    : OrderStatusEnums.Pending;

  // Parse metadata from notes if exists
  const parseMetadata = (notes: string | null) => {
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
  };

  const getCleanNotes = (notes: string | null) => {
    if (!notes) return null;
    return notes.replace(/\[METADATA:.*?\]/, '').trim() || null;
  };

  const metadata = parseMetadata((order as any).notes);
  const cleanNotes = getCleanNotes((order as any).notes);

  // Handle print function
  const handlePrint = () => {
    const items = (order as any).items || [];
    
    // Calculate total quantity
    const calculateTotalQuantity = () => {
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
    };

    // Generate items HTML
    const generateItemsHTML = (itemList: any[], isAddon = false): string => {
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
          ${item.addonItems && item.addonItems.length > 0 ? generateItemsHTML(item.addonItems, true) : ''}
        </div>
      `).join('');
    };

    const totalQuantity = calculateTotalQuantity();

    // Create the complete HTML document
    const printHTML = `
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
            ${items.length > 0 ? generateItemsHTML(items) : '<p style="text-align: center; color: #999; padding: 20px;">No items available</p>'}
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

    // Open new window and print
    const printWindow = window.open('', '_blank', 'width=900,height=800');
    if (printWindow) {
      printWindow.document.write(printHTML);
      printWindow.document.close();
      printWindow.focus();
      
      // Wait for content to load then trigger print
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      alert('Please allow popups to print the order');
    }
  };

  const renderItems = (itemList: any[], isAddon = false, level = 0) => {
    return itemList.map((item, index) => (
      <div 
        key={`${level}-${index}`} 
        className={`group transition-all duration-200 ${isAddon ? 'ml-4' : ''}`}
      >
        <div 
          className={`relative p-3 rounded-lg border transition-all hover:shadow-md ${
            isAddon 
              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-600' 
              : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600'
          }`}
        >
          {isAddon && (
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-blue-300 dark:bg-blue-600"></div>
          )}
          
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-md ${
                  isAddon 
                    ? 'bg-blue-100 dark:bg-blue-800' 
                    : 'bg-indigo-100 dark:bg-indigo-800'
                }`}>
                  <ShoppingBag className={`w-3 h-3 ${
                    isAddon 
                      ? 'text-blue-600 dark:text-blue-300' 
                      : 'text-indigo-600 dark:text-indigo-300'
                  }`} />
                </div>
                <h5 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                  {item.productName}
                </h5>
                {isAddon && (
                  <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-[10px] rounded-full font-medium">
                    Add-on
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <Hash className="w-3 h-3 text-gray-400" />
                  <div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Qty</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                      {item.count || 1}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3 h-3 text-gray-400" />
                  <div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Unit</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                      {item.price?.toFixed(2) || 'N/A'}
                    </p>
                  </div>
                </div>
                {item.addonPrice && (
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3 h-3 text-blue-500" />
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Addon</p>
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {item.addonPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {(item.note || item.addonNote) && (
                <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-700">
                  <div className="flex items-start gap-1.5">
                    <MessageSquare className="w-3 h-3 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-semibold text-amber-900 dark:text-amber-200 mb-0.5">
                        Note:
                      </p>
                      <p className="text-xs text-amber-800 dark:text-amber-300">
                        {item.note || item.addonNote}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-end">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Total</p>
              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {item.totalPrice?.toFixed(2) || 'N/A'}
              </p>
            </div>
          </div>
        </div>
        
        {item.addonItems && item.addonItems.length > 0 && (
          <div className="mt-2 space-y-2 relative">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 to-transparent dark:from-blue-600"></div>
            {renderItems(item.addonItems, true, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-slideUp">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {t('ordersManager.orderDetailsTitle')}
                </h3>
                <p className="text-indigo-100 text-xs">
                  Order #{order.orderTag}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrint}
                className="p-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-md transition-all text-white"
                title="Print Order"
              >
                <Printer className="w-4 h-4" />
              </button>
              
              <button
                onClick={onClose}
                className="p-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-md transition-all text-white"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{(order as any).orderTypeIcon || '📦'}</span>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {(order as any).orderTypeName || 'Order'}
                </h4>
                <p className="text-xs text-indigo-100">
                  {(order as any).orderTypeCode}
                </p>
              </div>
            </div>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-md ${OrderStatusUtils.getStatusBadgeClass(status)}`}>
              <span>{OrderStatusUtils.getStatusIcon(status)}</span>
              <span className="ml-1">
                {orderService.getOrderStatusText(status, lang)}
              </span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-3 rounded-lg border border-blue-200 dark:border-blue-700 hover:shadow-md transition-all">
              <Hash className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1" />
              <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-0.5">{t('ordersManager.OrderTag')}</p>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100 font-mono">
                {order.orderTag}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-3 rounded-lg border border-purple-200 dark:border-purple-700 hover:shadow-md transition-all">
              <Package className="w-4 h-4 text-purple-600 dark:text-purple-400 mb-1" />
              <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-0.5">{t('ordersManager.ItemCount')}</p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {(order as any).itemCount || (order as any).items?.length || 0}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 p-3 rounded-lg border border-amber-200 dark:border-amber-700 hover:shadow-md transition-all">
              <ShoppingBag className="w-4 h-4 text-amber-600 dark:text-amber-400 mb-1" />
              <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-0.5">{t('ordersManager.quantity')}</p>
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {(() => {
                  const items = (order as any).items;
                  if (items) {
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
                  return 0;
                })()}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/30 p-3 rounded-lg border border-green-200 dark:border-green-700 hover:shadow-md transition-all">
              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400 mb-1" />
              <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-0.5">{t('ordersManager.total')}</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {order.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-800 rounded-md">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {t('ordersManager.CustomerInformation')}
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-start gap-2 p-2 bg-white dark:bg-gray-800 rounded-md">
                <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                  <User className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                    {t('ordersManager.CustomerName')}
                  </p>
                  <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                    {order.customerName || 'N/A'}
                  </p>
                </div>
              </div>
              {(order as any).customerPhone && (
                <div className="flex items-start gap-2 p-2 bg-white dark:bg-gray-800 rounded-md">
                  <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <Phone className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                      {t('ordersManager.PhoneNumber')}
                    </p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                      {(order as any).customerPhone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delivery/Table Information */}
          {((order as any).deliveryAddress || (order as any).tableName || (order as any).tableId) && (
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-green-100 dark:bg-green-800 rounded-md">
                  {(order as any).deliveryAddress ? (
                    <Truck className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <Home className="w-4 h-4 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {(order as any).deliveryAddress 
                    ? t('ordersManager.DeliveryInformation')
                    : t('ordersManager.TableInformation')
                  }
                </h4>
              </div>
              <div className="space-y-2">
                {(order as any).deliveryAddress && (
                  <div className="flex items-start gap-2 p-2 bg-white dark:bg-gray-800 rounded-md">
                    <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                      <MapPin className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                        {t('ordersManager.DeliveryAddress')}
                      </p>
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                        {(order as any).deliveryAddress}
                      </p>
                    </div>
                  </div>
                )}
                {(order as any).tableName && (
                  <div className="flex items-start gap-2 p-2 bg-white dark:bg-gray-800 rounded-md">
                    <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                      <Home className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                        {t('ordersManager.table')}
                      </p>
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                        {(order as any).tableName} {(order as any).tableId && `(ID: ${(order as any).tableId})`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Notes */}
          {cleanNotes && (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
              <div className="flex items-start gap-2">
                <div className="p-1.5 bg-amber-100 dark:bg-amber-800 rounded-md">
                  <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-amber-900 dark:text-amber-200 mb-1">
                    {t('ordersManager.OrderNotes')}
                  </p>
                  <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                    {cleanNotes}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-indigo-100 dark:bg-indigo-800 rounded-md">
                <Package className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {t('ordersManager.orderItems')}
              </h4>
            </div>
            
            {(() => {
              const items = (order as any).items;
              
              if (!items || items.length === 0) {
                return (
                  <div className="p-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <div className="flex flex-col items-center justify-center text-center">
                      <AlertCircle className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mb-3" />
                      <p className="text-yellow-900 dark:text-yellow-200 font-semibold text-sm">
                        No items data available
                      </p>
                      <p className="text-yellow-700 dark:text-yellow-300 text-xs mt-1">
                        This order doesn't contain any items yet
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div className="space-y-2">
                  {renderItems(items)}
                </div>
              );
            })()}
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-md">
                <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-md">
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                  {t('ordersManager.subTotal')}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {(order.subTotal || 0).toFixed(2)}
                </span>
              </div>
              
              {order.serviceFeeApplied !== undefined && order.serviceFeeApplied > 0 && (
                <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                    {t('ordersManager.serviceFeeApplied')}
                  </span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    +{order.serviceFeeApplied.toFixed(2)}
                  </span>
                </div>
              )}
              
              {metadata?.MinOrderAmount && (
                <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {t('ordersManager.MinOrderAmount')}
                  </span>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {parseFloat(metadata.MinOrderAmount).toFixed(2)}
                  </span>
                </div>
              )}
              
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent my-2"></div>
              
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-md border border-green-200 dark:border-green-700">
                <span className="text-base font-bold text-gray-900 dark:text-gray-100">
                  {t('ordersManager.total')}
                </span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {order.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900/50 dark:to-gray-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-slate-200 dark:bg-slate-700 rounded-md">
                <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {t('ordersManager.OrderTimeline')}
              </h4>
            </div>
            
            <div className="space-y-3">
              <div className="relative pl-8">
                <div className="absolute left-0 top-0.5 w-5 h-5 bg-indigo-500 rounded-full border-2 border-white dark:border-gray-800 shadow-md flex items-center justify-center">
                  <Clock className="w-2.5 h-2.5 text-white" />
                </div>
                {(order as any).confirmedAt && (
                  <div className="absolute left-2.5 top-5 w-0.5 h-full bg-gradient-to-b from-indigo-300 to-green-300 dark:from-indigo-600 dark:to-green-600"></div>
                )}
                <div className="bg-white dark:bg-gray-800 rounded-md p-2.5 border border-indigo-200 dark:border-indigo-700">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Calendar className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                    <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                      {t('ordersManager.createdAt')}
                    </p>
                  </div>
                  <p className="text-xs font-mono text-gray-700 dark:text-gray-300">
                    {new Date(order.createdAt).toLocaleString(
                      lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US',
                      { dateStyle: 'short', timeStyle: 'short' }
                    )}
                  </p>
                </div>
              </div>
              
              {(order as any).confirmedAt && (
                <div className="relative pl-8">
                  <div className="absolute left-0 top-0.5 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-md flex items-center justify-center">
                    <CheckCircle className="w-2.5 h-2.5 text-white" />
                  </div>
                  {(order as any).completedAt && (
                    <div className="absolute left-2.5 top-5 w-0.5 h-full bg-gradient-to-b from-green-300 to-blue-300 dark:from-green-600 dark:to-blue-600"></div>
                  )}
                  <div className="bg-white dark:bg-gray-800 rounded-md p-2.5 border border-green-200 dark:border-green-700">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Calendar className="w-3 h-3 text-green-600 dark:text-green-400" />
                      <p className="text-xs font-bold text-green-900 dark:text-green-200">
                        {t('ordersManager.confirmedAt')}
                      </p>
                    </div>
                    <p className="text-xs font-mono text-gray-700 dark:text-gray-300">
                      {new Date((order as any).confirmedAt).toLocaleString(
                        lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US',
                        { dateStyle: 'short', timeStyle: 'short' }
                      )}
                    </p>
                  </div>
                </div>
              )}

              {(order as any).completedAt && (
                <div className="relative pl-8">
                  <div className="absolute left-0 top-0.5 w-5 h-5 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800 shadow-md flex items-center justify-center">
                    <CheckCircle className="w-2.5 h-2.5 text-white" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-md p-2.5 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Calendar className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      <p className="text-xs font-bold text-blue-900 dark:text-blue-200">
                        {t('ordersManager.CompletedAt')}
                      </p>
                    </div>
                    <p className="text-xs font-mono text-gray-700 dark:text-gray-300">
                      {new Date((order as any).completedAt).toLocaleString(
                        lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US',
                        { dateStyle: 'short', timeStyle: 'short' }
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OrderDetailsModal;