import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { PricingPlan } from '../../types';

const Pricing: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [isYearly, setIsYearly] = useState<boolean>(false);

  const getPlans = (): PricingPlan[] => {
    // Feature keys that will be translated
    const basicFeatures = [
      'pricing.plans.basic.features.0',
      'pricing.plans.basic.features.1', 
      'pricing.plans.basic.features.2',
      'pricing.plans.basic.features.3',
      'pricing.plans.basic.features.4',
      'pricing.plans.basic.features.5'
    ];

    const proFeatures = [
      'pricing.plans.pro.features.0',
      'pricing.plans.pro.features.1',
      'pricing.plans.pro.features.2', 
      'pricing.plans.pro.features.3',
      'pricing.plans.pro.features.4',
      'pricing.plans.pro.features.5',
      'pricing.plans.pro.features.6',
      'pricing.plans.pro.features.7'
    ];

    const enterpriseFeatures = [
      'pricing.plans.enterprise.features.0',
      'pricing.plans.enterprise.features.1',
      'pricing.plans.enterprise.features.2',
      'pricing.plans.enterprise.features.3', 
      'pricing.plans.enterprise.features.4',
      'pricing.plans.enterprise.features.5',
      'pricing.plans.enterprise.features.6',
      'pricing.plans.enterprise.features.7'
    ];

    const basePlans = [
      {
        id: 'basic',
        name: t('pricing.plans.basic.name'),
        price: isYearly ? 990 : 99,
        period: isYearly ? t('pricing.perYear') : t('pricing.perMonth'),
        features: basicFeatures.map(key => t(key)),
        buttonText: t('pricing.plans.basic.button')
      },
      {
        id: 'pro',
        name: t('pricing.plans.pro.name'),
        price: isYearly ? 1990 : 199,
        period: isYearly ? t('pricing.perYear') : t('pricing.perMonth'),
        features: proFeatures.map(key => t(key)),
        isPopular: true,
        buttonText: t('pricing.plans.pro.button')
      },
      {
        id: 'enterprise',
        name: t('pricing.plans.enterprise.name'),
        price: isYearly ? 3990 : 399,
        period: isYearly ? t('pricing.perYear') : t('pricing.perMonth'),
        features: enterpriseFeatures.map(key => t(key)),
        buttonText: t('pricing.plans.enterprise.button')
      }
    ];

    return basePlans;
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
            {t('pricing.title')} <span className="text-primary-600 dark:text-primary-400">{t('pricing.titleHighlight')}</span> {t('pricing.titleEnd')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            {t('pricing.subtitle')}
          </p>

          {/* Billing Toggle */}
          <div className={`flex items-center justify-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            <span className={`text-sm font-medium ${!isYearly ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {t('pricing.monthly')}
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                isYearly ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isRTL 
                    ? (isYearly ? 'translate-x-[-1.25rem]' : 'translate-x-[-0.25rem]')
                    : (isYearly ? 'translate-x-6' : 'translate-x-1')
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {t('pricing.yearly')}
            </span>
            {isYearly && (
              <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                {t('pricing.freeMonths')}
              </span>
            )}
          </div>
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
              className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 ${
                plan.isPopular 
                  ? 'border-2 border-primary-500 scale-105' 
                  : 'border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className={`bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                    <Star className="h-4 w-4" />
                    <span>{t('pricing.mostPopular')}</span>
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className={`flex items-end justify-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-lg">
                    /{plan.period}
                  </span>
                </div>
                {isYearly && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    {t('pricing.monthlyEquivalent', { amount: Math.round(plan.price / 12) })}
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  plan.isPopular
                    ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl'
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