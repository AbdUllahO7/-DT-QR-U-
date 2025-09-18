import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Order } from '../../../../types/BranchManagement/type';

interface SuccessNotificationProps {
  order: Order | null;
  t: (key: string) => string;
}

const SuccessNotification: React.FC<SuccessNotificationProps> = ({ order, t }) => {
  if (!order) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded-lg shadow-lg max-w-sm">
      <div className="flex items-center">
        <CheckCircle className="w-5 h-5 mr-2" />
        <div>
          <p className="font-medium">{t('ordersManager.successNotification')}</p>
          <p className="text-sm">{order.customerName} - {order.orderTag}</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessNotification;