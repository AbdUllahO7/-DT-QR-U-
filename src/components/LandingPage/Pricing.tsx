import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Star, Clock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { PricingPlan } from '../../types';

interface ExtendedPricingPlan extends PricingPlan {
  isComingSoon?: boolean;
  isFree?: boolean;
  freeTrialMonths?: number;
}

const Pricing: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState<boolean>(false);

  const getPlans = (): ExtendedPricingPlan[] => {
    // Feature keys that will be translated
    const starterFeatures = [
      'pricing.plans.starter.features.0',
      'pricing.plans.starter.features.1',
      'pricing.plans.starter.features.2',
      'pricing.plans.starter.features.3',
      'pricing.plans.starter.features.4',
      'pricing.plans.starter.features.5',
      'pricing.plans.starter.features.6',
      'pricing.plans.starter.features.7',
      'pricing.plans.starter.features.8',
      'pricing.plans.starter.features.9',
      'pricing.plans.starter.features.10',
      'pricing.plans.starter.features.11',
      'pricing.plans.starter.features.12',
      'pricing.plans.starter.features.13'
    ];

    const proFeatures = [
      'pricing.plans.pro.features.0',
      'pricing.plans.pro.features.1',
      'pricing.plans.pro.features.2',
      'pricing.plans.pro.features.3',
      'pricing.plans.pro.features.4',
      'pricing.plans.pro.features.5',
      'pricing.plans.pro.features.6',
      'pricing.plans.pro.features.7',
      'pricing.plans.pro.features.8',
      'pricing.plans.pro.features.9',
      'pricing.plans.pro.features.10',
      'pricing.plans.pro.features.11',
    ];

    const proPlusFeatures = [
      'pricing.plans.proPlus.features.0',
      'pricing.plans.proPlus.features.1',
      'pricing.plans.proPlus.features.2',
      'pricing.plans.proPlus.features.3',
      'pricing.plans.proPlus.features.4',
      'pricing.plans.proPlus.features.5',
      'pricing.plans.proPlus.features.6',
      'pricing.plans.proPlus.features.7',
      'pricing.plans.proPlus.features.8'
    ];

    const basePlans: ExtendedPricingPlan[] = [
      {
        id: 'starter',
        name: t('pricing.plans.starter.name'),
        price: 0,
        period: t('pricing.perMonth'),
        features: starterFeatures.map(key => t(key)),
        buttonText: t('pricing.plans.starter.button'),
        isFree: true,
        freeTrialMonths: 3
      },
      {
        id: 'pro',
        name: t('pricing.plans.pro.name'),
        price: 0,
        period: isYearly ? t('pricing.perYear') : t('pricing.perMonth'),
        features: proFeatures.map(key => t(key)),
        isPopular: true,
        buttonText: t('pricing.comingSoon'),
        isComingSoon: true
      },
      {
        id: 'proPlus',
        name: t('pricing.plans.proPlus.name'),
        price: 0,
        period: isYearly ? t('pricing.perYear') : t('pricing.perMonth'),
        features: proPlusFeatures.map(key => t(key)),
        buttonText: t('pricing.comingSoon'),
        isComingSoon: true
      }
    ];

    return basePlans;
  };

  const handleStarterClick = () => {
    navigate('/login');
  };

  const currentPlans = getPlans();

  return (
    <section id="pricing" className="section-padding bg-gray-50 dark:bg-gray-800">
      <div className="container-max">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('pricing.title')} <span className="text-primary-800 dark:text-primary-800">{t('pricing.titleHighlight')}</span> {t('pricing.titleEnd')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            {t('pricing.subtitle')}
          </p>


        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {currentPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col ${plan.isComingSoon
                ? 'opacity-75 border border-gray-200 dark:border-gray-700'
                : plan.isFree
                  ? 'border-2 border-primary-800 scale-105'
                  : 'border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
            >
              {/* Coming Soon Badge */}
              {plan.isComingSoon && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className={`bg-gray-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                    <Clock className="h-4 w-4" />
                    <span>{t('pricing.comingSoon')}</span>
                  </span>
                </div>
              )}

              {/* Free Trial Badge for Starter */}


              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>

                {plan.isFree ? (
                  <>

                    <p className="text-sm text-primary-800 dark:text-primary-800 mt-2 font-medium">
                      {t('pricing.freeFor3Months')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t('pricing.noCreditCard')}
                    </p>
                  </>
                ) : (
                  <>
                    <div className={`flex items-end justify-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                      <span className={`text-4xl font-bold ${plan.isComingSoon ? 'text-gray-400 dark:text-gray-500' : 'text-primary-800 dark:text-primary-800'}`}>
                        {t('pricing.comingSoon')}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <ul className={`space-y-4 mb-8 flex-grow ${plan.isComingSoon ? 'opacity-60' : ''}`}>
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                    <Check className={`h-5 w-5 flex-shrink-0 ${plan.isComingSoon ? 'text-gray-400' : 'text-primary-800'}`} />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={plan.isFree ? handleStarterClick : undefined}
                disabled={plan.isComingSoon}
                className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 mt-auto ${plan.isComingSoon
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : plan.isFree
                    ? 'text-primary-800 hover:bg-primary-700 bg-primary-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('pricing.additionalInfo')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {t('pricing.vatInfo')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing; 