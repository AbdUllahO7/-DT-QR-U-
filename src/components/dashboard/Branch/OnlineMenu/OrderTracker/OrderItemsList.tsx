import React from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingBag } from 'lucide-react';
import { OrderItem } from '../../../../../types/BranchManagement/type';

interface OrderItemsListProps {
  items: OrderItem[];
  currency?: string;
  t: (key: string) => string;
  isRTL?: boolean;
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({
  items,
  currency = 'TRY',
  t,
  isRTL = false,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency,
    }).format(price);
  };

  const getItemQuantity = (item: OrderItem): number => {
    return item.count ?? item.quantity ?? 1;
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">{t('orderTracker.noItems')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Package className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          {t('orderTracker.orderDetails')}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          ({items.length} {items.length === 1 ? t('orderTracker.item') : t('orderTracker.items')})
        </span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item, index) => (
          <motion.div
            key={item.orderItemId || index}
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              flex items-center justify-between p-3 rounded-xl
              bg-gray-50 dark:bg-gray-800/50
              border border-gray-100 dark:border-gray-700
              ${isRTL ? 'flex-row-reverse' : ''}
            `}
          >
            {/* Item Info */}
            <div className={`flex items-center gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* Quantity Badge */}
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  {getItemQuantity(item)}x
                </span>
              </div>

              {/* Product Name and Notes */}
              <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                  {item.productName}
                </p>
                {(item.note || item.notes) && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {item.note || item.notes}
                  </p>
                )}
                {/* Show addon items if any */}
                {item.addonItems && item.addonItems.length > 0 && (
                  <div className="mt-1 space-y-0.5">
                    {item.addonItems.map((addon, addonIndex) => (
                      <p
                        key={addon.orderItemId || addonIndex}
                        className="text-xs text-gray-500 dark:text-gray-400"
                      >
                        + {getItemQuantity(addon)}x {addon.productName}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Price */}
            <div className={`flex-shrink-0 ${isRTL ? 'mr-3' : 'ml-3'}`}>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {formatPrice(item.totalPrice)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </div>
  );
};

export default OrderItemsList;
