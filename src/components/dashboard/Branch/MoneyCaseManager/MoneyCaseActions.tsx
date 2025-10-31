import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { ActiveMoneyCase } from '../../../../types/BranchManagement/MoneyCase';

interface Props {
  activeCase: ActiveMoneyCase | null;
  loading: boolean;
  onOpenCase: () => void;
  onCloseCase: () => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const MoneyCaseActions: React.FC<Props> = ({
  activeCase,
  loading,
  onOpenCase,
  onCloseCase,
  t,
  isRTL
}) => {
  return (
    <div className={`flex gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {!activeCase ? (
        <button
          onClick={onOpenCase}
          disabled={loading}
          className={`flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <Unlock className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('moneyCase.openCase')}
        </button>
      ) : (
        <button
          onClick={onCloseCase}
          disabled={loading}
          className={`flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <Lock className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('moneyCase.closeCase')}
        </button>
      )}
    </div>
  );
};

export default MoneyCaseActions;