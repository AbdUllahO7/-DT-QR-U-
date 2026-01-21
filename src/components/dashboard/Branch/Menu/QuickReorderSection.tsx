/**
 * Quick Reorder Section Component
 * Shows last orders and allows quick reorder
 */

"use client"

import React, { useState } from 'react';
import {
  RotateCcw,
  Clock,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Trash2,
  Package,
  Check,
  X,
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useQuickReorder, OrderHistoryItem, OrderedProduct, MenuContext } from '../../../../hooks/useQuickReorder';
import { MenuProduct } from '../../../../types/menu/type';
import { useCurrency } from '../../../../hooks/useCurrency';

interface QuickReorderSectionProps {
  availableProducts: MenuProduct[];
  onReorder: (items: OrderedProduct[]) => void;
  className?: string;
  context?: MenuContext;
}

const QuickReorderSection: React.FC<QuickReorderSectionProps> = ({
  availableProducts,
  onReorder,
  className = '',
  context = 'menu',
}) => {
  const { t, isRTL } = useLanguage();
  const currency = useCurrency();
  const {
    orderHistory,
    isLoaded,
    settings,
    removeFromHistory,
    clearHistory,
    canReorder,
    getUnavailableItems,
  } = useQuickReorder(context);

  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Fallback: if isLoaded is false but we have data in localStorage/state, we should still show it
  // or simple check: if history is already there, we don't need to wait for isLoaded if it's already true
  if ((!isLoaded && orderHistory.length === 0) || !settings.enabled || orderHistory.length === 0) {
    return null;
  }

  const handleReorder = (order: OrderHistoryItem) => {
    const availableItems = order.items.filter((item) => {
      const product = availableProducts.find(
        (p) => p.branchProductId === item.branchProductId
      );
      return product && !product.isOutOfStock;
    });

    if (availableItems.length > 0) {
      onReorder(availableItems);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (days === 0) {
        return t('common.today') || 'Today';
      } else if (days === 1) {
        return t('common.yesterday') || 'Yesterday';
      } else if (days < 7) {
        return `${days} ${t('common.daysAgo') || 'days ago'}`;
      } else {
        return date.toLocaleDateString();
      }
    } catch {
      return dateString;
    }
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl shadow-lg border border-blue-100 dark:border-slate-600 overflow-hidden ${className}`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-4 py-3 flex items-center justify-between hover:bg-blue-100/50 dark:hover:bg-slate-600/50 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="p-2 bg-blue-500 rounded-xl">
            <RotateCcw className="w-4 h-4 text-white" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              {t('menu.quickReorder.title') || 'Quick Reorder'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {orderHistory.length} {t('menu.quickReorder.previousOrders') || 'previous orders'}
            </span>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 border-t border-blue-100 dark:border-slate-600 space-y-3">
          {/* Clear History Button */}
          <div className={`flex justify-end ${isRTL ? 'justify-start' : ''}`}>
            {showClearConfirm ? (
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {t('menu.quickReorder.confirmClear') || 'Clear all history?'}
                </span>
                <button
                  onClick={() => {
                    clearHistory();
                    setShowClearConfirm(false);
                  }}
                  className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="p-1.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                {t('menu.quickReorder.clearHistory') || 'Clear History'}
              </button>
            )}
          </div>

          {/* Order List */}
          <div className="space-y-3">
            {orderHistory.map((order) => {
              const isFullyAvailable = canReorder(order, availableProducts);
              const unavailableItems = getUnavailableItems(order, availableProducts);
              const isOrderExpanded = expandedOrderId === order.orderId;

              return (
                <div
                  key={order.orderId}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className={`p-3 ${isRTL ? 'text-right' : ''}`}>
                    <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="flex-1">
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {order.orderTag || `#${order.orderId.slice(-6)}`}
                          </span>
                          {order.orderTypeName && (
                            <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full">
                              {order.orderTypeName}
                            </span>
                          )}
                        </div>
                        <div className={`flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(order.orderDate)}</span>
                          <span>•</span>
                          <span>{order.items.length} {t('menu.quickReorder.items') || 'items'}</span>
                          <span>•</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {currency.symbol}{order.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <button
                          onClick={() => removeFromHistory(order.orderId)}
                          className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                          title={t('common.remove') || 'Remove'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Unavailable Warning */}
                    {unavailableItems.length > 0 && (
                      <div className={`mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-start gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-amber-700 dark:text-amber-400">
                          {unavailableItems.length} {t('menu.quickReorder.itemsUnavailable') || 'item(s) unavailable'}
                        </span>
                      </div>
                    )}

                    {/* Expand/Collapse Items */}
                    <button
                      onClick={() => toggleOrderExpand(order.orderId)}
                      className={`mt-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 ${isRTL ? 'flex-row-reverse ml-auto' : ''}`}
                    >
                      {isOrderExpanded ? (
                        <>
                          <ChevronUp className="w-3 h-3" />
                          {t('menu.quickReorder.hideDetails') || 'Hide details'}
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3" />
                          {t('menu.quickReorder.showDetails') || 'Show details'}
                        </>
                      )}
                    </button>

                    {/* Expanded Items List */}
                    {isOrderExpanded && (
                      <div className="mt-3 space-y-2">
                        {order.items.map((item, idx) => {
                          const product = availableProducts.find(
                            (p) => p.branchProductId === item.branchProductId
                          );
                          const isAvailable = product && !product.isOutOfStock;

                          return (
                            <div
                              key={idx}
                              className={`flex items-center gap-3 p-2 rounded-lg ${isAvailable
                                  ? 'bg-slate-50 dark:bg-slate-700'
                                  : 'bg-red-50 dark:bg-red-900/20 opacity-60'
                                } ${isRTL ? 'flex-row-reverse' : ''}`}
                            >
                              {item.productImageUrl ? (
                                <img
                                  src={item.productImageUrl}
                                  alt={item.productName}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                                  <Package className="w-5 h-5 text-slate-400" />
                                </div>
                              )}
                              <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                                <p className={`text-sm font-medium ${isAvailable ? 'text-slate-800 dark:text-slate-200' : 'text-red-600 dark:text-red-400 line-through'}`}>
                                  {item.productName}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {item.quantity} × {currency.symbol}{item.price.toFixed(2)}
                                </p>
                                {!isAvailable && (
                                  <p className="text-xs text-red-500 dark:text-red-400">
                                    {t('menu.quickReorder.unavailable') || 'Unavailable'}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Reorder Button */}
                    <button
                      onClick={() => handleReorder(order)}
                      disabled={unavailableItems.length === order.items.length}
                      className={`mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${unavailableItems.length === order.items.length
                          ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow-md hover:shadow-lg'
                        } ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {isFullyAvailable
                        ? t('menu.quickReorder.reorderAll') || 'Reorder All'
                        : t('menu.quickReorder.reorderAvailable') || 'Reorder Available Items'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickReorderSection;
