"use client"

import type React from "react"
import { Search, Sparkles } from "lucide-react"
import { useLanguage } from "../../../../contexts/LanguageContext"

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  const { t } = useLanguage()

  return (
    <div className="mb-8">
      <div className="relative max-w-xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-lg" />
        <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
          <input
            type="text"
            placeholder={t('menu.search.placeholder')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-transparent border-0 rounded-2xl focus:ring-2 focus:ring-orange-500/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm font-medium outline-none"
          />
         
        </div>
      </div>
    </div>
  )
}

export default SearchBar