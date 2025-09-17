import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Package, Truck } from 'lucide-react';
import { OrderStatusEnums } from '../types/Orders/type';

class OrderStatusUtils {
  static getValidStatusTransitions(currentStatus: OrderStatusEnums): OrderStatusEnums[] {
    switch (currentStatus) {
      case OrderStatusEnums.Pending:
        return [OrderStatusEnums.Confirmed, OrderStatusEnums.Cancelled, OrderStatusEnums.Rejected];
      case OrderStatusEnums.Confirmed:
        return [OrderStatusEnums.Preparing, OrderStatusEnums.Cancelled];
      case OrderStatusEnums.Preparing:
        return [OrderStatusEnums.Ready, OrderStatusEnums.Cancelled];
      case OrderStatusEnums.Ready:
        return [OrderStatusEnums.Completed, OrderStatusEnums.Cancelled];
      case OrderStatusEnums.Completed:
        return [OrderStatusEnums.Delivered];
      case OrderStatusEnums.Cancelled:
      case OrderStatusEnums.Rejected:
      case OrderStatusEnums.Delivered:
        return [];
      default:
        return [];
    }
  }

  static getStatusIcon(status: OrderStatusEnums) {
    switch (status) {
      case OrderStatusEnums.Pending:
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case OrderStatusEnums.Confirmed:
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case OrderStatusEnums.Preparing:
        return <Package className="w-4 h-4 text-orange-600" />;
      case OrderStatusEnums.Ready:
        return <AlertCircle className="w-4 h-4 text-purple-600" />;
      case OrderStatusEnums.Completed:
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case OrderStatusEnums.Delivered:
        return <Truck className="w-4 h-4 text-indigo-600" />;
      case OrderStatusEnums.Cancelled:
      case OrderStatusEnums.Rejected:
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  }

  static getStatusBadgeClass(status: OrderStatusEnums) {
    switch (status) {
      case OrderStatusEnums.Pending:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700';
      case OrderStatusEnums.Confirmed:
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700';
      case OrderStatusEnums.Preparing:
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700';
      case OrderStatusEnums.Ready:
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700';
      case OrderStatusEnums.Completed:
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700';
      case OrderStatusEnums.Delivered:
        return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-700';
      case OrderStatusEnums.Cancelled:
      case OrderStatusEnums.Rejected:
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
    }
  }
}

export default OrderStatusUtils;