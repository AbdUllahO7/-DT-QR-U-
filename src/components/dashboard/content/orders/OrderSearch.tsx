import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles } from 'lucide-react';

interface OrderSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const OrderSearch: React.FC<OrderSearchProps> = ({ searchTerm, onSearchChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  const searchVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    focus: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const iconVariants = {
    idle: { rotate: 0, scale: 1 },
    focus: { rotate: 5, scale: 1.1 },
    typing: { 
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 }
    }
  };

  const clearButtonVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
  };

  const suggestions = [
    'Müşteri adı',
    'Sipariş numarası',
    'Masa numarası'
  ];

  return (
    <motion.div
      variants={searchVariants}
      initial="hidden"
      animate="visible"
      whileFocus="focus"
      className="relative group"
    >
      {/* Search input container */}
      <div className="relative">
        {/* Search icon */}
        <motion.div 
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
          variants={iconVariants}
          animate={isFocused ? (searchTerm ? "typing" : "focus") : "idle"}
        >
          <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </motion.div>

        {/* Input field */}
        <motion.input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Sipariş ara..."
          className="block w-full pl-10 pr-12 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
        />

        {/* Clear button */}
        <AnimatePresence>
          {searchTerm && (
            <motion.button
              variants={clearButtonVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              whileHover="hover"
              whileTap="tap"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Focus indicator */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Search suggestions */}
      <AnimatePresence>
        {isFocused && !searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-20"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Arama İpuçları
              </span>
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                  onClick={() => onSearchChange(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg transition-colors"
                >
                  "{suggestion}" ile ara
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search results indicator */}
      <AnimatePresence>
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-2 text-xs text-gray-500 dark:text-gray-400"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              "{searchTerm}" için arama yapılıyor...
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrderSearch; 