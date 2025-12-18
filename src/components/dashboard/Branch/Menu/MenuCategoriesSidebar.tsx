"use client"

import type React from "react"
import { Filter } from "lucide-react"
import { useLanguage } from "../../../../contexts/LanguageContext"
import { CategoriesSidebarProps } from "../../../../types/menu/type"

// Add styles for hiding scrollbar
const scrollbarHideStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = scrollbarHideStyles;
  if (!document.head.querySelector('[data-scrollbar-hide]')) {
    styleElement.setAttribute('data-scrollbar-hide', 'true');
    document.head.appendChild(styleElement);
  }
}

const CategoriesSidebar: React.FC<CategoriesSidebarProps> = ({
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  const { t } = useLanguage()

  return (
    // FIX: 'sticky' is now applied to the outermost container.
    // 'top-20' is estimated based on your header height in the screenshot. 
    // Change to 'top-0' if your header is not fixed, or adjust number to match header height.
    <div className="sticky top-20 z-40 w-full mb-6">
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center">
          <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center mr-2">
            <Filter className="h-3 w-3 text-white" />
          </div>
          {t('menu.categories')}
        </h3>

        {/* Horizontal scroll container */}
        <div className="w-full overflow-hidden">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.categoryId}
                onClick={() => onCategorySelect(category.categoryId)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                  selectedCategory === category.categoryId
                    ? "bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 text-white shadow-lg shadow-orange-500/25"
                    : "bg-slate-50/50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span className="font-medium text-sm">{category.categoryName}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                      selectedCategory === category.categoryId
                        ? "bg-white/20 text-white"
                        : "bg-slate-200/50 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
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
    </div>
  )
}

export default CategoriesSidebar