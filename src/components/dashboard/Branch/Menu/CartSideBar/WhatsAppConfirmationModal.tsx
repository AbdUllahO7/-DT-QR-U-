"use client"

import React from 'react'
import { MessageCircle, X, Send, Phone, Check, CheckCheck } from 'lucide-react'
import { useLanguage } from '../../../../../contexts/LanguageContext'

interface WhatsAppConfirmationModalProps {
  isVisible: boolean
  restaurantName?: string
  whatsappNumber?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

const WhatsAppConfirmationModal: React.FC<WhatsAppConfirmationModalProps> = ({
  isVisible,
  restaurantName,
  whatsappNumber,
  onConfirm,
  onCancel,
  loading = false
}) => {
  const { t, isRTL } = useLanguage()

  if (!isVisible) return null

  // Format phone number for display
  const formatDisplayNumber = (number: string): string => {
    if (!number) return ''
    const cleaned = number.replace(/\D/g, '')
    if (cleaned.startsWith('90')) {
      return `+90 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`
    }
    return `+${cleaned}`
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full border border-slate-200 dark:border-slate-700 overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* WhatsApp-style Header */}
        <div className="bg-[#128C7E] px-4 py-3 flex items-center justify-between">
          <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
            {/* Restaurant Avatar */}
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium text-sm">
                {restaurantName || t('whatsapp.confirmation.restaurant')}
              </h3>
              <p className="text-white/80 text-xs">
                {whatsappNumber ? formatDisplayNumber(whatsappNumber) : 'WhatsApp Business'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Message Interface */}
        <div className="bg-[#E5DDD5] dark:bg-slate-700 min-h-[400px] p-4 space-y-3">
          {/* Incoming message bubble */}
          <div className={`flex ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="max-w-[85%]">
              <div className="bg-white dark:bg-slate-600 rounded-lg p-3 shadow-sm">
                <p className="text-sm text-slate-800 dark:text-slate-200 mb-1">
                  {t('whatsapp.confirmation.title')}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {t('whatsapp.confirmation.subtitle')}
                </p>
              </div>
              <p className="text-xs text-slate-500 mt-1 px-2">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Order preview message (receipt style) */}
          <div className={`flex ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="max-w-[95%]">
              <div className="bg-[#DCF8C6] dark:bg-green-900/30 rounded-lg p-4 shadow-sm">
              
              </div>
              <div className="flex items-center justify-end mt-1 px-2">
                <CheckCheck className="w-3 h-3 text-blue-500 mr-1" />
                <p className="text-xs text-slate-500">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>

          {/* What will be sent info */}
          <div className={`flex ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="max-w-[85%]">
              <div className="bg-white dark:bg-slate-600 rounded-lg p-3 shadow-sm">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
                  {t('whatsapp.confirmation.whatWillBeSent')}
                </p>
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                    <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
                    {t('whatsapp.confirmation.orderDetails')}
                  </div>
                  <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                    <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
                    {t('whatsapp.confirmation.customerInfo')}
                  </div>
                  <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                    <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
                    {t('whatsapp.confirmation.totalPrice')}
                  </div>
                  <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                    <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
                    {t('whatsapp.confirmation.timestamp')}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end mt-1 px-2">
                <CheckCheck className="w-3 h-3 text-blue-500 mr-1" />
                <p className="text-xs text-slate-500">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>

          {/* Warning message */}
          <div className={`flex ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="max-w-[90%]">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-yellow-800">!</span>
                  </div>
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    <strong>{t('whatsapp.confirmation.note')}</strong> {t('whatsapp.confirmation.noteDescription')}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1 px-2">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>

        {/* Message Input Area */}
        <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors disabled:opacity-50"
            >
              {t('whatsapp.confirmation.skipWhatsApp')}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#25D366] hover:bg-[#22c55e] disabled:bg-[#25D366]/60 rounded-full transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t('whatsapp.confirmation.sending')}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t('whatsapp.confirmation.sendToWhatsApp')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhatsAppConfirmationModal