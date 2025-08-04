import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ModernErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  showHomeButton?: boolean;
}

const ModernError: React.FC<ModernErrorProps> = ({
  title = 'Bir Hata Oluştu',
  message,
  onRetry,
  onGoHome,
  showHomeButton = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-[400px] p-8"
    >
      <div className="max-w-md w-full">
        {/* Glass Card */}
        <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 text-center overflow-hidden">
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500"></div>
          </div>

          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 shadow-2xl"
          >
            <AlertTriangle className="w-10 h-10 text-white" />
            
            {/* Pulsing Ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-red-500/30"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {title}
          </motion.h2>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
          >
            {message}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col gap-3"
          >
            {onRetry && (
              <motion.button
                onClick={onRetry}
                className="flex items-center justify-center gap-3 w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500/30 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw className="w-5 h-5" />
                Tekrar Dene
              </motion.button>
            )}

            {showHomeButton && onGoHome && (
              <motion.button
                onClick={onGoHome}
                className="flex items-center justify-center gap-3 w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Home className="w-5 h-5" />
                Ana Sayfaya Dön
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernError; 