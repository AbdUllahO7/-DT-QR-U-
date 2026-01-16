"use client"

import type React from "react"
import { UtensilsCrossed, MapPin, ShoppingCart, Sun, Moon } from "lucide-react"
import { useLanguage } from "../../../../contexts/LanguageContext"
import LanguageSelector from "../../../LanguageSelector"
import ThemeToggle from "../../../ThemeToggle" // Assuming the file path
import { HeaderProps } from "../../../../types/menu/type"
import { useTheme } from "../../../../contexts/ThemeContext"

const Header: React.FC<HeaderProps> = ({ menuData, totalItems, onCartToggle }) => {
  const { t, isRTL } = useLanguage()
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-40 shadow-lg ">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left Side: Logo and Info */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 via-orange-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <UtensilsCrossed className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent truncate">
                {menuData.restaurantName}
              </h1>

              <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap">
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/50 px-2 py-0.5 sm:py-1 rounded-full backdrop-blur-sm">
                  <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                  <p className="text-xs font-medium truncate max-w-[100px] sm:max-w-none">{menuData.branchName}</p>
                </div>
                <div className={`flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full backdrop-blur-sm ${
                  menuData.isOpen
                    ? "bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                    : "bg-red-100/50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                }`}>
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${menuData.isOpen ? "bg-emerald-500" : "bg-red-500"} animate-pulse`} />
                  <span className="text-xs font-semibold whitespace-nowrap">{menuData.isOpen ? t('menu.open') : t('menu.closed')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Theme Toggle - Hidden on very small screens */}
            <div className="hidden sm:block">
              <button
                           onClick={toggleTheme}
                           className="min-w-[44px] min-h-[44px] p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center"
                           title={isDark ? t('theme.toggleToLight') : t('theme.toggleToDark')}
                           aria-label={t('accessibility.theme')}
                         >
                           {isDark ? (
                             <Sun className="h-5 w-5" />
                           ) : (
                             <Moon className="h-5 w-5" />
                           )}
                         </button>
            </div>

            <div className="hidden sm:block h-6 w-[1px] bg-slate-200 dark:bg-slate-700" />

            <button
              onClick={onCartToggle}
              className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 hover:from-orange-600 hover:via-orange-700 hover:to-pink-600 text-white p-2 sm:p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/25 transform active:scale-95 sm:hover:scale-105 group flex-shrink-0"
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform duration-300" />
              {totalItems > 0 && (
                <span className={`absolute -top-1 sm:-top-2 ${isRTL ? '-left-1 sm:-left-2' : '-right-1 sm:-right-2'} bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center font-bold shadow-lg animate-pulse`}>
                  {totalItems}
                </span>
              )}
            </button>

            <LanguageSelector variant="header" branchId={menuData.branchId} useMenuLanguages={true} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header