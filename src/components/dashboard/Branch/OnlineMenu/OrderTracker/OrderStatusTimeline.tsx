import React from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardCheck,
  CheckCircle,
  ChefHat,
  Bell,
  PackageCheck,
  XCircle,
  Ban,
} from 'lucide-react';
import OrderStatusStep from './OrderStatusStep';
import { OrderStatusEnums } from '../../../../../types/Orders/type';

interface OrderStatusTimelineProps {
  currentStatus: OrderStatusEnums;
  isRTL?: boolean;
  t: (key: string) => string;
}

interface StatusStep {
  status: OrderStatusEnums;
  labelKey: string;
  icon: React.ElementType;
}

const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({
  currentStatus,
  isRTL = false,
  t,
}) => {
  // Define the normal flow steps
  const normalSteps: StatusStep[] = [
    { status: OrderStatusEnums.Pending, labelKey: 'orderTracker.status.pending', icon: ClipboardCheck },
    { status: OrderStatusEnums.Confirmed, labelKey: 'orderTracker.status.confirmed', icon: CheckCircle },
    { status: OrderStatusEnums.Preparing, labelKey: 'orderTracker.status.preparing', icon: ChefHat },
    { status: OrderStatusEnums.Ready, labelKey: 'orderTracker.status.ready', icon: Bell },
    { status: OrderStatusEnums.Delivered, labelKey: 'orderTracker.status.delivered', icon: PackageCheck },
  ];

  const isCancelled = currentStatus === OrderStatusEnums.Cancelled;
  const isRejected = currentStatus === OrderStatusEnums.Rejected;
  const isCompleted = currentStatus === OrderStatusEnums.Completed;

  // Find the current step index in the normal flow
  const getCurrentStepIndex = () => {
    if (isCancelled || isRejected) {
      // Find where the order was when it got cancelled/rejected
      // We'll show it stopped at Pending/Confirmed level
      return currentStatus === OrderStatusEnums.Rejected ? 0 : 1;
    }
    if (isCompleted) {
      return normalSteps.length; // All steps completed
    }
    const index = normalSteps.findIndex((step) => step.status === currentStatus);
    return index >= 0 ? index : 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  // Determine step states
  const getStepState = (stepIndex: number) => {
    if (isCancelled || isRejected) {
      // Show steps up to where it stopped as completed, then show the cancelled/rejected state
      if (stepIndex < currentStepIndex) {
        return { isCompleted: true, isActive: false };
      }
      if (stepIndex === currentStepIndex) {
        return { isCompleted: false, isActive: true };
      }
      return { isCompleted: false, isActive: false };
    }

    if (isCompleted) {
      return { isCompleted: true, isActive: false };
    }

    if (stepIndex < currentStepIndex) {
      return { isCompleted: true, isActive: false };
    }
    if (stepIndex === currentStepIndex) {
      return { isCompleted: false, isActive: true };
    }
    return { isCompleted: false, isActive: false };
  };

  // If cancelled or rejected, show special terminal status
  if (isCancelled || isRejected) {
    return (
      <div className="w-full">
        {/* Cancelled/Rejected Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            mb-6 p-4 rounded-xl text-center
            ${isCancelled
              ? 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            {isCancelled ? (
              <Ban className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500 dark:text-red-400" />
            )}
            <span
              className={`font-semibold text-lg ${
                isCancelled
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {isCancelled
                ? t('orderTracker.status.cancelled')
                : t('orderTracker.status.rejected')}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isCancelled
              ? t('orderTracker.message.cancelled')
              : t('orderTracker.message.rejected')}
          </p>
        </motion.div>

        {/* Timeline showing where it stopped */}
        <div className={`flex justify-between items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
          {normalSteps.slice(0, 3).map((step, index) => {
            const { isCompleted, isActive } = getStepState(index);
            return (
              <OrderStatusStep
                key={step.status}
                label={t(step.labelKey)}
                icon={step.icon}
                isCompleted={isCompleted}
                isActive={isActive}
                isCancelled={isActive && isCancelled}
                isRejected={isActive && isRejected}
                stepIndex={index}
                totalSteps={3}
                isRTL={isRTL}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Success Banner for Completed */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 rounded-xl text-center bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <span className="font-semibold text-lg text-green-600 dark:text-green-400">
              {t('orderTracker.status.completed')}
            </span>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">
            {t('orderTracker.message.completed')}
          </p>
        </motion.div>
      )}

      {/* Timeline */}
      <div className={`flex justify-between items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
        {normalSteps.map((step, index) => {
          const { isCompleted: stepCompleted, isActive } = getStepState(index);
          return (
            <OrderStatusStep
              key={step.status}
              label={t(step.labelKey)}
              icon={step.icon}
              isCompleted={stepCompleted}
              isActive={isActive}
              stepIndex={index}
              totalSteps={normalSteps.length}
              isRTL={isRTL}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTimeline;
