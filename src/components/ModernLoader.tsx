import React from 'react';
import { motion } from 'framer-motion';

interface ModernLoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ModernLoader: React.FC<ModernLoaderProps> = ({ 
  text = 'Yükleniyor...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const containerClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses[size]}`}>
      {/* Animated Loading Rings */}
      <div className="relative">
        {/* Outer Ring */}
        <motion.div
          className={`${sizeClasses[size]} rounded-full border-4 border-gray-200/30 dark:border-gray-700/30`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Middle Ring */}
        <motion.div
          className={`absolute inset-1 rounded-full border-4 border-transparent border-t-primary-500 border-r-primary-600`}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner Ring */}
        <motion.div
          className={`absolute inset-2 rounded-full border-2 border-transparent border-t-blue-500 border-l-blue-600`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center Dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></div>
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.p 
        className="text-gray-600 dark:text-gray-400 font-medium text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {text}
      </motion.p>

      {/* Loading Dots */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ 
              duration: 0.8, 
              repeat: Infinity, 
              delay: i * 0.2 
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ModernLoader; 