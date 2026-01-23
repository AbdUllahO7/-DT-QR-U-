import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { FAQ as FAQType } from '../../types';

const FAQ: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggleItem = (id: string): void => {
    setOpenItem(openItem === id ? null : id);
  };

  // Generate FAQ data from translations
  const faqs: FAQType[] = Array.from({ length: 8 }, (_, index) => {
    const id = String(index + 1);
    return {
      id,
      question: t(`faq.questions.${id}.question`),
      answer: t(`faq.questions.${id}.answer`)
    };
  });

  return (
    <section id="faq" className="section-padding bg-white dark:bg-gray-900">
      <div className="container-max">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}
        >
          <div className={`flex items-center justify-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} mb-4`}>
            <HelpCircle className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              {t('faq.title')} <span className="text-primary-600 dark:text-primary-400">{t('faq.titleHighlight')}</span>
            </h2>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border border-gray-200 dark:border-gray-700 rounded-lg mb-4 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 py-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-between"
              >
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                    openItem === faq.id ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openItem === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-white dark:bg-gray-900"
                  >
                    <div className="px-6 py-4">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('faq.cta.title')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {t('faq.cta.subtitle')}
          </p>
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            {t('faq.cta.button')}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ; 