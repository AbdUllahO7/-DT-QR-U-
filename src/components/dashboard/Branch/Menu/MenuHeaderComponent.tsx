"use client"

import type React from "react"
import { UtensilsCrossed, MapPin, ShoppingCart } from "lucide-react"
import { useLanguage } from "../../../../contexts/LanguageContext"
import LanguageSelector from "../../../LanguageSelector"
import { HeaderProps } from "../../../../types/menu/type"



const Header: React.FC<HeaderProps> = ({ menuData, totalItems, onCartToggle }) => {
  const { t } = useLanguage()
  console.log("menuData",menuData)
  return (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-40 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-orange-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
              <UtensilsCrossed className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl mr-2 font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                {menuData.restaurantName}
              </h1>
              
              <div className="flex items-center space-x-2 mt-1 mr-2">
                <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/50 px-2 py-1 rounded-full backdrop-blur-sm">
                  <MapPin className="h-3 w-3" />
                  <p className="text-xs font-medium">{menuData.branchName}</p>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full backdrop-blur-sm mr-2 ${
                  menuData.isOpen 
                    ? "bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" 
                    : "bg-red-100/50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                }`}>
                  <div className={`w-2 h-2 rounded-full ml-2 ${menuData.isOpen ? "bg-emerald-500" : "bg-red-500"} animate-pulse`} />
                  <span className="text-xs font-semibold">{menuData.isOpen ? t('menu.open') : t('menu.closed')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onCartToggle}
              className="relative bg-gradient-to-r ml-2 from-orange-500 via-orange-600 to-pink-500 hover:from-orange-600 hover:via-orange-700 hover:to-pink-600 text-white p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/25 transform hover:scale-105 group"
            >
              <ShoppingCart className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
            <LanguageSelector variant="header" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header