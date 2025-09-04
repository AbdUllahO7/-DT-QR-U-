"use client"

import type React from "react"
import { ChefHat, Loader2, AlertCircle } from "lucide-react"
import { useLanguage } from "../../../../contexts/LanguageContext"

// Loading State Component
export const LoadingState: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full blur-3xl animate-pulse transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl animate-pulse transform translate-x-1/2 translate-y-1/2" />
      </div>
      
      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl animate-bounce">
            <ChefHat className="h-8 w-8 text-white" />
          </div>
          <div className="mb-6">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-4" />
            <div className="flex items-center justify-center space-x-1">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse animation-delay-100" />
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse animation-delay-200" />
            </div>
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-3">
            {t('menu.loading')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {t('menu.loadingSubtitle')}
          </p>
        </div>
      </div>
    </div>
  )
}

// Error State Component
interface ErrorStateProps {
  error: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-red-950/20 dark:via-slate-900 dark:to-red-950/20 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-red-200 dark:border-red-800/50 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">{t('menu.error.title')}</h2>
          <p className="text-red-600 dark:text-red-400 mb-6 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {t('menu.error.tryAgain')}
          </button>
        </div>
      </div>
    </div>
  )
}