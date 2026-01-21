import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Timer, AlertCircle } from 'lucide-react';
import { OrderStatusEnums } from '../../../../../types/Orders/type';

interface EstimatedTimeDisplayProps {
  orderCreatedAt: string;
  estimatedMinutes: number;
  currentStatus: OrderStatusEnums;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL?: boolean;
}

const EstimatedTimeDisplay: React.FC<EstimatedTimeDisplayProps> = ({
  orderCreatedAt,
  estimatedMinutes,
  currentStatus,
  t,
  isRTL = false,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isOverdue, setIsOverdue] = useState<boolean>(false);

  const calculateTimeRemaining = useCallback(() => {
    const orderTime = new Date(orderCreatedAt).getTime();
    const estimatedEndTime = orderTime + estimatedMinutes * 60 * 1000;
    const now = Date.now();
    const remaining = Math.max(0, estimatedEndTime - now);

    setTimeRemaining(remaining);
    setIsOverdue(remaining === 0 && currentStatus < OrderStatusEnums.Ready);
  }, [orderCreatedAt, estimatedMinutes, currentStatus]);

  useEffect(() => {
    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [calculateTimeRemaining]);

  // Don't show countdown for terminal states
  if (
    currentStatus === OrderStatusEnums.Cancelled ||
    currentStatus === OrderStatusEnums.Rejected ||
    currentStatus === OrderStatusEnums.Completed ||
    currentStatus === OrderStatusEnums.Delivered
  ) {
    return null;
  }

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return { minutes, seconds };
  };

  const { minutes, seconds } = formatTime(timeRemaining);

  // Calculate progress percentage
  const totalTime = estimatedMinutes * 60 * 1000;
  const elapsed = totalTime - timeRemaining;
  const progressPercent = Math.min(100, (elapsed / totalTime) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative overflow-hidden rounded-2xl p-6
        ${isOverdue
          ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800'
          : 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800'
        }
      `}
    >
      {/* Background Progress Bar */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={`
            absolute bottom-0 left-0 h-1
            ${isOverdue ? 'bg-amber-400 dark:bg-amber-500' : 'bg-blue-400 dark:bg-blue-500'}
          `}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Left: Icon and Label */}
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div
            className={`
              w-12 h-12 rounded-xl flex items-center justify-center
              ${isOverdue
                ? 'bg-amber-100 dark:bg-amber-800/50'
                : 'bg-blue-100 dark:bg-blue-800/50'
              }
            `}
          >
            {isOverdue ? (
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            ) : (
              <Timer className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <div className={isRTL ? 'text-right' : ''}>
            <p
              className={`text-sm font-medium ${
                isOverdue
                  ? 'text-amber-700 dark:text-amber-300'
                  : 'text-blue-700 dark:text-blue-300'
              }`}
            >
              {isOverdue
                ? t('orderTracker.time.takingLonger')
                : t('orderTracker.time.estimatedReady')}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {isOverdue
                ? t('orderTracker.time.pleaseWait')
                : t('orderTracker.time.preparingOrder')}
            </p>
          </div>
        </div>

        {/* Right: Countdown Timer */}
        <AnimatePresence mode="wait">
          {isOverdue ? (
            <motion.div
              key="overdue"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {t('orderTracker.time.almostReady')}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="countdown"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`flex items-baseline gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {/* Minutes */}
              <div className="text-center">
                <motion.span
                  key={minutes}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-3xl font-bold text-blue-600 dark:text-blue-400 tabular-nums"
                >
                  {String(minutes).padStart(2, '0')}
                </motion.span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('orderTracker.time.min')}
                </p>
              </div>

              <span className="text-2xl font-bold text-blue-400 dark:text-blue-500 mb-4">:</span>

              {/* Seconds */}
              <div className="text-center">
                <motion.span
                  key={seconds}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-3xl font-bold text-blue-600 dark:text-blue-400 tabular-nums"
                >
                  {String(seconds).padStart(2, '0')}
                </motion.span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('orderTracker.time.sec')}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default EstimatedTimeDisplay;
