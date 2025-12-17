import React from 'react';
import { Outlet } from 'react-router-dom';
// We're importing the Header and Footer you used in your Home.jsx
// Added .jsx extensions to fix potential path resolution issues
import Header from '../components/LandingPage/Header.jsx';
import Footer from '../components/LandingPage/Footer.jsx';

/**
 * This component provides the main layout (Header and Footer)
 * for the public-facing pages like Home, Login, Register, etc.
 * * The <Outlet /> component from react-router-dom will render
 * the specific child route's element (e.g., <Home />, <Login />).
 */
const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />
      {/* Outlet renders the matched child route's component */}
      {/* pt-16 adds padding-top to account for the fixed header (h-16 = 64px) */}
      <main className="flex-grow w-full pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;