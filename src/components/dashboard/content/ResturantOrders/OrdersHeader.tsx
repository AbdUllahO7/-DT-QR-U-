import React from 'react';

interface OrdersHeaderProps {
  t: (key: string) => string;
}

const OrdersHeader: React.FC<OrdersHeaderProps> = ({ t }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        {t('ordersManager.title')}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        {t('ordersManager.description')}
      </p>
    </div>
  );
};

export default OrdersHeader;