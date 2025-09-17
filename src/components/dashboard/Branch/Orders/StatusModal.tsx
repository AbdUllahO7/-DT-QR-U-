import React from 'react';
import { OrderStatusEnums } from '../../../../types/Orders/type';
import OrderStatusUtils from '../../../../utils/OrderStatusUtils';
import { orderService } from '../../../../services/Branch/OrderService';


interface StatusModalProps {
  show: boolean;
  loading: boolean;
  newStatus: OrderStatusEnums | null;
  lang: string;
  onUpdate: () => void;
  onClose: () => void;
  t: (key: string) => string;
}

const StatusModal: React.FC<StatusModalProps> = ({
  show,
  loading,
  newStatus,
  lang,
  onUpdate,
  onClose,
  t
}) => {
  if (!show || newStatus === null) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center mb-4">
          {OrderStatusUtils.getStatusIcon(newStatus)}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 ml-3">
            {t('ordersManager.updateStatusTitle')}
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('ordersManager.updateStatusPrompt', { 
            status: orderService.getOrderStatusText(newStatus, lang) 
          })}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
          >
            {t('ordersManager.cancel')}
          </button>
          <button
            onClick={onUpdate}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
            disabled={loading}
          >
            {loading ? t('ordersManager.updating') : t('ordersManager.updateAction')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;