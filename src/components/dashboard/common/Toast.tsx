import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Loader2, X } from 'lucide-react'

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'loading'
  message: string
  duration?: number
  onClose: (id: string) => void
}

export interface ToastContextType {
  showToast: (type: 'success' | 'error' | 'loading', message: string, duration?: number) => string
  hideToast: (id: string) => void
  updateToast: (id: string, type: 'success' | 'error', message: string, duration?: number) => void
}

const Toast: React.FC<ToastProps> = ({ id, type, message, duration = 4000, onClose }) => {
  useEffect(() => {
    if (type !== 'loading' && duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose, type])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'loading':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300'
      case 'loading':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300'
    }
  }

  return (
    <div className={`flex items-center p-4 mb-3 border rounded-lg shadow-lg ${getBgColor()} animate-in slide-in-from-right duration-300`}>
      {getIcon()}
      <div className="ml-3 text-sm font-medium flex-1">
        {message}
      </div>
      {type !== 'loading' && (
        <button
          onClick={() => onClose(id)}
          className="ml-2 p-1 hover:bg-black/10 rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export const ToastContainer: React.FC<{ toasts: ToastProps[] }> = ({ toasts }) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}

// Custom hook for managing toasts
export const useToast = (): [ToastProps[], ToastContextType] => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const showToast = (type: 'success' | 'error' | 'loading', message: string, duration?: number): string => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastProps = {
      id,
      type,
      message,
      duration,
      onClose: hideToast
    }

    setToasts(prev => [...prev, newToast])
    return id
  }

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const updateToast = (id: string, type: 'success' | 'error', message: string, duration?: number) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id 
        ? { ...toast, type, message, duration }
        : toast
    ))
  }

  const toastMethods: ToastContextType = {
    showToast,
    hideToast,
    updateToast
  }

  return [toasts, toastMethods]
}