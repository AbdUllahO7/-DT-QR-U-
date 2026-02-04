import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  MapPin,
  X,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderTag: string;
  customerName?: string;
  estimatedMinutes?: number;
  orderTypeName?: string;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  orderTag,
  customerName,
  estimatedMinutes,
  orderTypeName,
}) => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [copied, setCopied] = React.useState(false);

  const handleTrackOrder = () => {
    onClose();
    // Use relative path (no leading slash)
    // This appends 'track/xyz' to the current URL (e.g., /table/qr/123/track/xyz)
    navigate(`track/${orderTag}`);
  };

  const handleCopyOrderTag = async () => {
    try {
      await navigator.clipboard.writeText(orderTag);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors z-10`}
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>

            {/* Success Animation Header */}
            <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-4"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, type: 'spring', damping: 10 }}
                >
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </motion.div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-bold text-white mb-2"
              >
                {t('orderSuccess.title') || 'Order Placed!'}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-green-100"
              >
                {t('orderSuccess.subtitle') || 'Your order has been received'}
              </motion.p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Order Tag */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t('orderSuccess.orderNumber') || 'Order Number'}
                </p>
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-wider">
                    #{orderTag}
                  </span>
                  <button
                    onClick={handleCopyOrderTag}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    title={t('orderSuccess.copy') || 'Copy'}
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Info Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-2 gap-3"
              >
                {/* Estimated Time */}
                {estimatedMinutes && estimatedMinutes > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                    <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        {t('orderSuccess.estimatedTime') || 'Est. Time'}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                      ~{estimatedMinutes} {t('orderTracker.time.min') || 'min'}
                    </p>
                  </div>
                )}

                {/* Order Type */}
                {orderTypeName && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                    <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                        {t('orderSuccess.orderType') || 'Order Type'}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-purple-700 dark:text-purple-300 truncate">
                      {orderTypeName}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Customer Name */}
              {customerName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-center text-gray-600 dark:text-gray-400"
                >
                  {t('orderSuccess.thankYou') || 'Thank you'}, <span className="font-semibold">{customerName}</span>!
                </motion.p>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="space-y-3"
              >
                {/* Track Order Button */}
                <button
                  onClick={handleTrackOrder}
                  className={`w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 hover:from-orange-600 hover:via-orange-700 hover:to-pink-600 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <span>{t('orderSuccess.trackOrder') || 'Track Your Order'}</span>
                  <ExternalLink className="w-5 h-5" />
                </button>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="w-full py-3 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {t('orderSuccess.continueBrowsing') || 'Continue Browsing'}
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OrderSuccessModal;