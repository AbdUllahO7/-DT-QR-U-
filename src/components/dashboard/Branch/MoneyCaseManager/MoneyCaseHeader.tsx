import React from 'react';
import { DollarSign } from 'lucide-react';

interface Props {
  t: (key: string) => string;
}

const MoneyCaseHeader: React.FC<Props> = ({ t }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
        <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('moneyCase.title') || 'Money Case Management'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('moneyCase.subtitle') || 'Manage your branch cash operations'}
        </p>
      </div>
    </div>
  );
};

export default MoneyCaseHeader;