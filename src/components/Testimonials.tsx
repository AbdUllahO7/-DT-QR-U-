import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Testimonial } from '../types';

const Testimonials: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: t('testimonials.customers.0.name'),
      role: t('testimonials.customers.0.role'),
      company: t('testimonials.customers.0.company'),
      content: t('testimonials.customers.0.content'),
      avatar: '👨‍🍳'
    },
    {
      id: '2',
      name: t('testimonials.customers.1.name'),
      role: t('testimonials.customers.1.role'),
      company: t('testimonials.customers.1.company'),
      content: t('testimonials.customers.1.content'),
      avatar: '👩‍💼'
    },
    {
      id: '3',
      name: t('testimonials.customers.2.name'),
      role: t('testimonials.customers.2.role'),
      company: t('testimonials.customers.2.company'),
      content: t('testimonials.customers.2.content'),
      avatar: '☕'
    },
    {
      id: '4',
      name: t('testimonials.customers.3.name'),
      role: t('testimonials.customers.3.role'),
      company: t('testimonials.customers.3.company'),
      content: t('testimonials.customers.3.content'),
      avatar: '🍽️'
    },
    {
      id: '5',
      name: t('testimonials.customers.4.name'),
      role: t('testimonials.customers.4.role'),
      company: t('testimonials.customers.4.company'),
      content: t('testimonials.customers.4.content'),
      avatar: '🍔'
    },
    {
      id: '6',
      name: t('testimonials.customers.5.name'),
      role: t('testimonials.customers.5.role'),
      company: t('testimonials.customers.5.company'),
      content: t('testimonials.customers.5.content'),
      avatar: '👩‍💻'
    }
  ];

  return (
    <section id="testimonials" className="section-padding bg-gray-50 dark:bg-gray-800">
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
            {t('testimonials.title')} <span className="text-primary-600 dark:text-primary-400">{t('testimonials.titleHighlight')}</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card relative"
            >
              {/* Quote Icon */}
              <div className={`absolute -top-4 ${isRTL ? '-right-4' : '-left-4'} w-8 h-8 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center`}>
                <Quote className="h-4 w-4 text-white" />
              </div>

              {/* Rating */}
              <div className={`flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''} mb-4`}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                  <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              500+
            </div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">
              {t('testimonials.stats.restaurants')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              %99
            </div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">
              {t('testimonials.stats.satisfaction')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              24/7
            </div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">
              {t('testimonials.stats.support')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              5 Dak
            </div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">
              {t('testimonials.stats.setup')}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials; 