import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { useLanguage } from '../../../../../contexts/LanguageContext'

const EmptyCartComponent: React.FC = () => {
  const { t } = useLanguage()
  
  return (
    <div className="text-center py-16">
      <div className="bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
        <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="h-8 w-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">
          {t('menu.cart.empty')}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          {t('menu.cart.emptyDesc')}
        </p>
      </div>
    </div>
  )
}

export default EmptyCartComponent