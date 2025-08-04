import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: {
    id: string;
    label: string;
    count: number;
  }[];
}

const OrderTabs: React.FC<OrderTabsProps> = ({ activeTab, onTabChange, tabs }) => {
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -2,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const countVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    }
  };

  return (
    <div className="relative">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto pb-1">
          <AnimatePresence>
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                custom={index}
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative whitespace-nowrap pb-4 px-1 font-medium text-sm transition-all duration-200
                  ${activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }
                `}
              >
                <span className="relative z-10">{tab.label}</span>
                
                {/* Active indicator */}
                <AnimatePresence>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      exit={{ scaleX: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  )}
                </AnimatePresence>

                {/* Count badge */}
                {tab.count > 0 && (
                  <motion.span
                    variants={countVariants}
                    initial="hidden"
                    animate="visible"
                    className={`
                      ml-2 py-0.5 px-2 rounded-full text-xs font-medium inline-flex items-center justify-center min-w-[20px]
                      ${activeTab === tab.id
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }
                    `}
                  >
                    {tab.count}
                  </motion.span>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </nav>
      </div>

      {/* Decorative gradient line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
    </div>
  );
};

export default OrderTabs; 