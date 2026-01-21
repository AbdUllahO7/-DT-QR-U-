import React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

export interface OrderStatusStepProps {
  label: string;
  icon: React.ElementType;
  isCompleted: boolean;
  isActive: boolean;
  isCancelled?: boolean;
  isRejected?: boolean;
  stepIndex: number;
  totalSteps: number;
  isRTL?: boolean;
}

const OrderStatusStep: React.FC<OrderStatusStepProps> = ({
  label,
  icon: Icon,
  isCompleted,
  isActive,
  isCancelled = false,
  isRejected = false,
  stepIndex,
  totalSteps,
  isRTL = false,
}) => {
  const isLast = stepIndex === totalSteps - 1;

  const getStepColor = () => {
    if (isCancelled || isRejected) {
      return 'bg-red-500 border-red-500';
    }
    if (isCompleted) {
      return 'bg-green-500 border-green-500';
    }
    if (isActive) {
      return 'bg-orange-500 border-orange-500';
    }
    return 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600';
  };

  const getIconColor = () => {
    if (isCancelled || isRejected || isCompleted || isActive) {
      return 'text-white';
    }
    return 'text-gray-400 dark:text-gray-500';
  };

  const getLineColor = () => {
    if (isCompleted) {
      return 'bg-green-500';
    }
    return 'bg-gray-200 dark:bg-gray-700';
  };

  const getLabelColor = () => {
    if (isCancelled || isRejected) {
      return 'text-red-600 dark:text-red-400';
    }
    if (isCompleted) {
      return 'text-green-600 dark:text-green-400';
    }
    if (isActive) {
      return 'text-orange-600 dark:text-orange-400 font-semibold';
    }
    return 'text-gray-400 dark:text-gray-500';
  };

  return (
    <div className="flex flex-col items-center relative">
      {/* Step Circle */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: stepIndex * 0.1, duration: 0.3 }}
        className={`
          relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center
          transition-all duration-300
          ${getStepColor()}
        `}
      >
        {isCompleted ? (
          <Check className={`w-6 h-6 ${getIconColor()}`} />
        ) : isActive ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className={`w-6 h-6 ${getIconColor()}`} />
          </motion.div>
        ) : (
          <Icon className={`w-5 h-5 ${getIconColor()}`} />
        )}

        {/* Pulse Animation for Active Step */}
        {isActive && !isCancelled && !isRejected && (
          <motion.div
            className="absolute inset-0 rounded-full bg-orange-500"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.div>

      {/* Label */}
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: stepIndex * 0.1 + 0.2, duration: 0.3 }}
        className={`
          mt-2 text-xs text-center max-w-[80px] leading-tight
          ${getLabelColor()}
        `}
      >
        {label}
      </motion.span>

      {/* Connecting Line (except for last step) */}
      {!isLast && (
        <div
          className={`
            absolute top-6 h-0.5 w-full
            ${isRTL ? 'right-1/2' : 'left-1/2'}
          `}
          style={{ width: 'calc(100% - 3rem)' }}
        >
          <div className={`h-full ${getLineColor()} transition-colors duration-300`} />
        </div>
      )}
    </div>
  );
};

export default OrderStatusStep;
