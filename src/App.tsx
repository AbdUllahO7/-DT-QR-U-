import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import OnboardingRestaurant from './pages/OnboardingRestaurant';
import OnboardingBranch from './pages/OnboardingBranch';
import OnboardingComplete from './pages/OnboardingComplete';
import SelectionScreen from './pages/SelectionScreen';
import Dashboard from './pages/Dashboard';
import TableQR from './pages/TableQR';
import RecycleBin from './components/dashboard/Porducts/RecycleBinProducts';
import OnlineMenu from './components/dashboard/Branch/OnlineMenu/OnlineMenu';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/onboarding/restaurant" element={<OnboardingRestaurant />} />
            <Route path="/onboarding/branch" element={<OnboardingBranch />} />
            <Route path="/onboarding/complete" element={<OnboardingComplete />} />
            <Route path="/selection" element={<SelectionScreen />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/table/qr/:qrToken" element={<TableQR />} />
            <Route path="/OnlineMenu/:publicId" element={<OnlineMenu />} />
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App; 