import { useEffect } from "react";
import { useLanguage } from "../../../../../contexts/LanguageContext";
import { CheckCircle, Loader2, X, XCircle } from "lucide-react";
import { Toast } from "./MenuCartSidebar";


const ToastComponent: React.FC<{ toast: Toast; onClose: (id: string) => void }> = ({ toast, onClose }) => {
  const { t } = useLanguage()

  useEffect(() => {
    if (toast.type !== 'loading' && toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onClose(toast.id)
      }, toast.duration)

      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onClose, toast.type])

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'loading':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
    }
  }

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300'
      case 'loading':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300'
    }
  }

  return (
    <div className={`flex items-center p-4 mb-3 border rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${getBgColor()}`}>
      {getIcon()}
      <div className="ml-3 text-sm font-medium flex-1">
        {toast.message}
      </div>
      {toast.type !== 'loading' && (
        <button
          onClick={() => onClose(toast.id)}
          className="ml-2 p-1 hover:bg-black/10 rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export default ToastComponent