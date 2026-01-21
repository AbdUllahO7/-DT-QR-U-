"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Search, X, Heart } from "lucide-react"
import { useLanguage } from "../../../../contexts/LanguageContext"

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  showFavoritesFilter?: boolean
  favoritesOnly?: boolean
  onFavoritesToggle?: () => void
  favoritesCount?: number
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  showFavoritesFilter = false,
  favoritesOnly = false,
  onFavoritesToggle,
  favoritesCount = 0
}) => {
  const { t, isRTL } = useLanguage()
  const [localValue, setLocalValue] = useState(searchTerm)

  // Sync local value when external searchTerm changes (e.g., on clear)
  useEffect(() => {
    setLocalValue(searchTerm)
  }, [searchTerm])

  // Debounced search - wait 300ms after user stops typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localValue !== searchTerm) {
        onSearchChange(localValue)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [localValue, onSearchChange, searchTerm])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value)
  }, [])

  const handleClear = useCallback(() => {
    setLocalValue('')
    onSearchChange('')
  }, [onSearchChange])

  return (
    <div className="mb-8">
      <div className={`flex items-center gap-3 max-w-xl mx-auto ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-lg" />
          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <Search className={`absolute top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4 ${isRTL ? 'right-4' : 'left-4'}`} />
            <input
              type="text"
              placeholder={t('menu.search.placeholder')}
              value={localValue}
              onChange={handleInputChange}
              className={`w-full py-3 bg-transparent border-0 rounded-2xl focus:ring-2 focus:ring-orange-500/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm font-medium outline-none ${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'}`}
            />
            {/* Clear button */}
            {localValue && (
              <button
                onClick={handleClear}
                className={`absolute top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${isRTL ? 'left-3' : 'right-3'}`}
                aria-label={t('common.clear')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
