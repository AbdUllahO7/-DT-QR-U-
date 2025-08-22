import React from 'react';
import Hero from '../components/LandingPage/Hero';
import Features from '../components/LandingPage/Features';
import Pricing from '../components/LandingPage/Pricing';
import Testimonials from '../components/LandingPage/Testimonials';
import FAQ from '../components/LandingPage/FAQ';
import Contact from '../components/LandingPage/Contact';
import Footer from '../components/LandingPage/Footer';
import Header from '../components/LandingPage/Header';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Home; 