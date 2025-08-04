import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-14 h-8 bg-gray-200 dark:bg-gray-700 rounded-full shadow-inner transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/30"
      whileTap={{ scale: 0.95 }}
    >
      {/* Toggle Background */}
      <motion.div
        className="absolute inset-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-lg"
        animate={{
          x: isDark ? 24 : 0,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 30 
        }}
      />
      
      {/* Sun Icon */}
      <motion.div
        className="absolute left-1 flex items-center justify-center w-6 h-6"
        animate={{
          scale: isDark ? 0.8 : 1,
          opacity: isDark ? 0.5 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <Sun className="w-4 h-4 text-yellow-500" />
      </motion.div>
      
      {/* Moon Icon */}
      <motion.div
        className="absolute right-1 flex items-center justify-center w-6 h-6"
        animate={{
          scale: isDark ? 1 : 0.8,
          opacity: isDark ? 1 : 0.5,
        }}
        transition={{ duration: 0.2 }}
      >
        <Moon className="w-4 h-4 text-blue-400" />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle; 