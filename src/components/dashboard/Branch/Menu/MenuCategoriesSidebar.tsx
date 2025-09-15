"use client"

import type React from "react"
import { Filter } from "lucide-react"
import { useLanguage } from "../../../../contexts/LanguageContext"
import { CategoriesSidebarProps } from "../../../../types/menu/type"


const CategoriesSidebar: React.FC<CategoriesSidebarProps> = ({
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  const { t } = useLanguage()

  return (
    <div className="lg:col-span-1">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-4 sticky top-24">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
          <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center mr-2">
            <Filter className="h-3 w-3 text-white" />
          </div>
          {t('menu.categories')}
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.categoryId}
              onClick={() => onCategorySelect(category.categoryId)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                selectedCategory === category.categoryId
                  ? "bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 text-white shadow-lg shadow-orange-500/25 scale-[1.02]"
                  : "bg-slate-50/50 dark:bg-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-600/50 text-slate-700 dark:text-slate-300 hover:shadow-lg backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{category.categoryName}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-lg font-semibold ${
                    selectedCategory === category.categoryId
                      ? "bg-white/20 text-white"
                      : "bg-slate-200/50 dark:bg-slate-600/50 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {category.products.length}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoriesSidebar