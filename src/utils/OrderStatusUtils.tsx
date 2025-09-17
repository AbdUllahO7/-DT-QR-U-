import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Package, Truck } from 'lucide-react';
import { OrderStatus } from '../types/Orders/type';

class OrderStatusUtils {
  static getValidStatusTransitions(currentStatus: OrderStatus): OrderStatus[] {
    switch (currentStatus) {
      case OrderStatus.Pending:
        return [OrderStatus.Confirmed, OrderStatus.Cancelled, OrderStatus.Rejected];
      case OrderStatus.Confirmed:
        return [OrderStatus.Preparing, OrderStatus.Cancelled];
      case OrderStatus.Preparing:
        return [OrderStatus.Ready, OrderStatus.Cancelled];
      case OrderStatus.Ready:
        return [OrderStatus.Completed, OrderStatus.Cancelled];
      case OrderStatus.Completed:
        return [OrderStatus.Delivered];
      case OrderStatus.Cancelled:
      case OrderStatus.Rejected:
      case OrderStatus.Delivered:
        return [];
      default:
        return [];
    }
  }

  static getStatusIcon(status: OrderStatus) {
    switch (status) {
      case OrderStatus.Pending:
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case OrderStatus.Confirmed:
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case OrderStatus.Preparing:
        return <Package className="w-4 h-4 text-orange-600" />;
      case OrderStatus.Ready:
        return <AlertCircle className="w-4 h-4 text-purple-600" />;
      case OrderStatus.Completed:
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case OrderStatus.Delivered:
        return <Truck className="w-4 h-4 text-indigo-600" />;
      case OrderStatus.Cancelled:
      case OrderStatus.Rejected:
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  }

  static getStatusBadgeClass(status: OrderStatus) {
    switch (status) {
      case OrderStatus.Pending:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700';
      case OrderStatus.Confirmed:
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700';
      case OrderStatus.Preparing:
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700';
      case OrderStatus.Ready:
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700';
      case OrderStatus.Completed:
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700';
      case OrderStatus.Delivered:
        return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-700';
      case OrderStatus.Cancelled:
      case OrderStatus.Rejected:
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
    }
  }
}

export default OrderStatusUtils;