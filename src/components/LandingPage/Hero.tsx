import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Smartphone, Zap, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Hero: React.FC = () => {
  const { t, isRTL } = useLanguage();
  
  const features = [
    { icon: <QrCode className="h-5 w-5" />, text: t('hero.features.qrAccess') },
    { icon: <Smartphone className="h-5 w-5" />, text: t('hero.features.mobileOptimized') },
    { icon: <Zap className="h-5 w-5" />, text: t('hero.features.instantUpdate') },
  ];

  return (
    <section id="hero" className="section-padding pt-24 lg:pt-32 bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`text-center lg:${isRTL ? 'text-right' : 'text-left'}`}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="text-primary-600 dark:text-primary-400">{t('hero.title.line1')}</span>
              <br />
              {t('hero.title.line2')}
              <br />
              <span className="text-primary-600 dark:text-primary-400">{t('hero.title.line3')}</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
              {t('hero.subtitle')}
            </p>

            {/* Feature Pills */}
            <div className={`flex flex-wrap gap-4 justify-center lg:${isRTL ? 'justify-end' : 'justify-start'} mb-8`}>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className={`flex items-center gap-2 ${isRTL ? 'space-x-reverse' : ''} bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md`}
                >
                  <span className="text-primary-600 dark:text-primary-400">{feature.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`flex flex-col sm:flex-row gap-4 justify-center lg:${isRTL ? 'justify-end' : 'justify-start'}`}
            >
              <button 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary text-lg px-8 py-4"
              >
                {t('hero.cta.getStarted')}
              </button>
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary text-lg px-8 py-4"
              >
                {t('hero.cta.features')}
              </button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className={`mt-12 flex items-center justify-center lg:${isRTL ? 'justify-end' : 'justify-start'} space-x-6 ${isRTL ? 'space-x-reverse' : ''} text-sm text-gray-600 dark:text-gray-400`}
            >
              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{t('hero.socialProof.restaurants')}</span>
              </div>
              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{t('hero.socialProof.satisfaction')}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative max-w-md mx-auto">
              {/* Phone Mockup */}
              <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                <div className="bg-white dark:bg-gray-100 rounded-[2rem] overflow-hidden">
                  <div className="h-96 bg-gradient-to-b from-primary-500 to-primary-600 p-6 text-white relative">
                    {/* Fake Status Bar */}
                    <div className="flex justify-between items-center text-xs mb-4">
                      <span>9:41</span>
                      <div className="flex space-x-1">
                        <div className="w-4 h-2 bg-white rounded-sm opacity-60"></div>
                        <div className="w-4 h-2 bg-white rounded-sm opacity-80"></div>
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* QR Code Area */}
                    <div className="text-center">
                      <QrCode className="h-16 w-16 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">iDIGITEK Restoran</h3>
                      <p className="text-sm opacity-90 mb-6">Menümüzü görüntülemek için QR kodu tarayın</p>
                      
                      {/* Sample Menu Items */}
                      <div className="space-y-3 text-left">
                        <div className="bg-white/20 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Margherita Pizza</span>
                            <span className="font-semibold">₺45</span>
                          </div>
                        </div>
                        <div className="bg-white/20 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Caesar Salad</span>
                            <span className="font-semibold">₺28</span>
                          </div>
                        </div>
                        <div className="bg-white/20 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Tiramisu</span>
                            <span className="font-semibold">₺22</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating QR Code */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <QrCode className="h-12 w-12 text-primary-600 dark:text-primary-400" />
              </motion.div>

              {/* Background Decoration */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 -left-8 w-32 h-32 bg-primary-200 dark:bg-primary-900 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute bottom-1/4 -right-8 w-24 h-24 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 blur-xl"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 