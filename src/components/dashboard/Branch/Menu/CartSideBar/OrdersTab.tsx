import type React from "react"
import { Clock, CheckCircle, ClipboardList, Loader2 } from "lucide-react"
import { useLanguage } from "../../../../../contexts/LanguageContext"
import { OrderCardProps, OrdersTabProps, TrackedOrder } from "../../../../../types/menu/carSideBarTypes"

const OrdersTab: React.FC<OrdersTabProps> = ({
  trackedOrders,
  trackingLoading,
  onLoadOrderTracking,
  onRemoveOrderFromTracking
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/30 dark:border-yellow-800'
      case 'confirmed':
        return 'text-blue-600 bg-blue-100 border-blue-200 dark:text-blue-400 dark:bg-blue-900/30 dark:border-blue-800'
      case 'preparing':
        return 'text-orange-600 bg-orange-100 border-orange-200 dark:text-orange-400 dark:bg-orange-900/30 dark:border-orange-800'
      case 'ready':
        return 'text-green-600 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-900/30 dark:border-green-800'
      case 'completed':
        return 'text-green-700 bg-green-200 border-green-300 dark:text-green-300 dark:bg-green-800/30 dark:border-green-700'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200 dark:text-gray-400 dark:bg-gray-800/30 dark:border-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'confirmed':
      case 'preparing':
      case 'ready':
        return <Clock className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (trackedOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <ClipboardList className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
          No Orders Yet
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          Your orders will appear here once you place them
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {trackedOrders.map((order) => (
        <OrderCard
          key={order.orderTag}
          order={order}
          trackingLoading={trackingLoading}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
          onLoadOrderTracking={onLoadOrderTracking}
          onRemoveOrderFromTracking={onRemoveOrderFromTracking}
        />
      ))}
    </div>
  )
}


const OrderCard: React.FC<OrderCardProps> = ({
  order,
  trackingLoading,
  getStatusColor,
  getStatusIcon,
  onLoadOrderTracking,
  onRemoveOrderFromTracking
}) => {
      const { t } = useLanguage()
      console.log("order11",order)
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Order Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
            {order.orderTag}
          </div>
          <div className={`px-2 py-1 rounded-lg border text-xs font-medium flex items-center space-x-1 ${getStatusColor(order.trackingInfo.orderStatus)}`}>
            {getStatusIcon(order.trackingInfo.orderStatus)}
            <span>{order.trackingInfo.orderStatus}</span>
          </div>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {order.createdAt.toLocaleString()}
        </div>
      </div>

      {/* Order Details */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">{t('menu.cart.orderType')}</span>
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {order.trackingInfo.orderTypeName}
          </span>
        </div>
        
        {order.trackingInfo.tableName && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">{t('menu.cart.table')}</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {order.trackingInfo.tableName}
            </span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">{t('menu.cart.total')}</span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            ${order.trackingInfo.totalPrice.toFixed(2)}
          </span>
        </div>
        
        {order.trackingInfo.notes && (
          <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 p-2 rounded">
            <strong>{t('menu.cart.notes')}</strong> {order.trackingInfo.notes}
          </div>
        )}

       

       

      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-600 flex space-x-2">
        {order.trackingInfo.orderStatus === 'Pending' && (
          <button
            onClick={() => onLoadOrderTracking(order.orderTag)}
            disabled={trackingLoading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
          >
            {trackingLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              {t('menu.cart.refreshing')}

              </div>
            ) : (
              t('menu.cart.refresh')
            )}
          </button>
        )}
        
      
        
        <button
          onClick={() => onRemoveOrderFromTracking(order.orderTag)}
          className="px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-xs transition-colors"
        >
          {t('menu.cart.remove')}
        </button>
      </div>
    </div>
  )
}

export default OrdersTab