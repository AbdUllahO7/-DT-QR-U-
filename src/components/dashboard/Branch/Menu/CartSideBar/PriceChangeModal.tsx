import React, { useEffect } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useLanguage } from '../../../../../contexts/LanguageContext'
import { PriceChangeModalProps } from '../../../../../types/menu/carSideBarTypes'
import { useCartHandlers } from '../../../../../hooks/useCartHandlers'
import { basketService } from '../../../../../services/Branch/BasketService'


const PriceChangeModal: React.FC<PriceChangeModalProps> = ({
  isVisible,
  priceChanges,
  confirmingPriceChanges,
  onCancel,
  onConfirm
}) => {
  const { t } = useLanguage()

  const basket =  basketService.getMyBasket()
  
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
            {t('priceChange.title')}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {t('priceChange.description')}
          </p>
        </div>

        {priceChanges && (
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mb-6">
            <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">
              {t('priceChange.changesRequired')}
            </h4>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {typeof priceChanges === 'string' ? (
                <p>{priceChanges}</p>
              ) : priceChanges?.message ? (
                <p>{priceChanges.message}</p>
              ) : (
                <p>{t('priceChange.defaultMessage')}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            disabled={confirmingPriceChanges}
            className="flex-1 py-3 px-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {t('priceChange.cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmingPriceChanges}
            className="flex-1 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 hover:from-orange-600 hover:via-orange-700 hover:to-pink-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
          >
            {confirmingPriceChanges ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('priceChange.confirming')}
              </div>
            ) : (
              t('priceChange.confirm')
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PriceChangeModal