import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Smartphone, Zap, BarChart3, Clock, Shield, Palette, Globe, ShoppingCart, Building2, Users, Utensils } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Feature } from '../../types';

const iconComponents = {
  QrCode,
  Smartphone,
  Zap,
  BarChart3,
  Clock,
  Shield,
  Palette,
  Globe,
  ShoppingCart,
  Building2,
  Users,
  Utensils
};

const Features: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const features: Feature[] = [
    {
      id: '1',
      title: t('features.list.qrAccess.title'),
      description: t('features.list.qrAccess.description'),
      icon: 'QrCode'
    },
    {
      id: '2',
      title: t('features.list.mobileOptimized.title'),
      description: t('features.list.mobileOptimized.description'),
      icon: 'Smartphone'
    },
    {
      id: '3',
      title: t('features.list.instantUpdate.title'),
      description: t('features.list.instantUpdate.description'),
      icon: 'Zap'
    },
    {
      id: '4',
      title: t('features.list.analytics.title'),
      description: t('features.list.analytics.description'),
      icon: 'BarChart3'
    },
    {
      id: '5',
      title: t('features.list.alwaysOpen.title'),
      description: t('features.list.alwaysOpen.description'),
      icon: 'Clock'
    },
    {
      id: '6',
      title: t('features.list.secure.title'),
      description: t('features.list.secure.description'),
      icon: 'Shield'
    },
    {
      id: '7',
      title: t('features.list.customizable.title'),
      description: t('features.list.customizable.description'),
      icon: 'Palette'
    },
    {
      id: '8',
      title: t('features.list.multiLanguage.title'),
      description: t('features.list.multiLanguage.description'),
      icon: 'Globe'
    },
    {
      id: '9',
      title: t('features.list.tableOrders.title'),
      description: t('features.list.tableOrders.description'),
      icon: 'ShoppingCart'
    },
    {
      id: '10',
      title: t('features.list.multiBranch.title'),
      description: t('features.list.multiBranch.description'),
      icon: 'Building2'
    },
    {
      id: '11',
      title: t('features.list.userRoles.title'),
      description: t('features.list.userRoles.description'),
      icon: 'Users'
    },
    {
      id: '12',
      title: t('features.list.productCustomization.title'),
      description: t('features.list.productCustomization.description'),
      icon: 'Utensils'
    }
  ];

  return (
    <section id="features" className="section-padding bg-white dark:bg-gray-900">
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
            {t('features.title')} <span className="text-primary-800 dark:text-primary-800">{t('features.titleHighlight')}</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = iconComponents[feature.icon as keyof typeof iconComponents];

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center group hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors duration-300">
                  <IconComponent className="h-8 w-8 text-primary-800 dark:text-primary-800" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-500 to-blue-600 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {t('features.cta.title')}
            </h3>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              {t('features.cta.subtitle')}
            </p>
            <button
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-primary-800 font-semibold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg"
            >
              {t('features.cta.button')}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features; 