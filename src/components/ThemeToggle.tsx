"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { isRTL } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="relative flex items-center justify-between w-14 h-8 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full p-1 shadow-inner border border-slate-300/50 dark:border-slate-700/50" />
    );
  }

  // In LTR: Dark mode moves +24px (Right)
  // In RTL: Dark mode moves -24px (Left)
  const shiftDistance = isDark ? (isRTL ? -24 : 24) : 0;

  return (
    <motion.button
      onClick={toggleTheme}
      // Always use LTR for the button's internal layout
      dir="ltr"
      className="relative flex items-center justify-between w-14 h-8 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full p-1 shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-500/50 border border-slate-300/50 dark:border-slate-700/50 flex-shrink-0"
      whileTap={{ scale: 0.95 }}
    >
      {/* Moving Knob */}
      <motion.div
        className="absolute w-6 h-6 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full shadow-lg z-10"
        initial={false}
        animate={{ x: shiftDistance }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
      
      {/* Sun Icon (Always on left internally) */}
      <div className="flex items-center justify-center w-6 h-6 z-0">
        <Sun className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-orange-500'} transition-colors`} />
      </div>
      
      {/* Moon Icon (Always on right internally) */}
      <div className="flex items-center justify-center w-6 h-6 z-0">
        <Moon className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-slate-500'} transition-colors`} />
      </div>
    </motion.button>
  );
};

export default ThemeToggle;