import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import your pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OnboardingRestaurant from './pages/OnboardingRestaurant';
import OnboardingBranch from './pages/OnboardingBranch';
import OnboardingComplete from './pages/OnboardingComplete';
import SelectionScreen from './pages/SelectionScreen';
import Dashboard from './pages/Dashboard';
import TableQR from './pages/TableQR';
import OnlineMenu from './components/dashboard/Branch/OnlineMenu/OnlineMenu';
import { OrderTracker } from './components/dashboard/Branch/OnlineMenu/OrderTracker';
import ResetPassword from './pages/Pass/ResetPassword';
import ConfirmMail from './pages/Pass/ConfirimMail';
import SetNewPassword from './pages/Pass/SetNewPassword';
import MainLayout from './pages/MainLayout';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Toaster position="top-right" richColors expand={false} />
        <Router>
          <ScrollToTop />
          <Routes>
            {/* --- Main Website Routes (Wrapped in Header/Footer) --- */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/resetPassword" element={<ResetPassword />} />
              <Route path="/confirmMail" element={<ConfirmMail />} />
              <Route path="/setnewpassword" element={<SetNewPassword />} />
              <Route path="/register" element={<Register />} />
              <Route path="/onboarding/restaurant" element={<OnboardingRestaurant />} />
              <Route path="/onboarding/branch" element={<OnboardingBranch />} />
              <Route path="/onboarding/complete" element={<OnboardingComplete />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              {/* Removed /track/:orderTag from here to fix the redirect loop */}
            </Route>

            {/* --- Protected App Routes --- */}
            <Route path="/selection" element={
              <ProtectedRoute>
                <SelectionScreen />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/*" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            {/* --- Public Menu & Tracking Routes (No Header/Footer) --- */}

            {/* 1. Table QR Flow */}
            <Route path="/table/qr/:qrToken" element={<TableQR />} />
            <Route path="/table/qr/:qrToken/track/:orderTag" element={<OrderTracker />} />

            {/* 2. Online Menu Flow */}
            <Route path="/OnlineMenu/:publicId" element={<OnlineMenu />} />
            <Route path="/OnlineMenu/:publicId/track/:orderTag" element={<OrderTracker />} />

            {/* 3. Direct Tracking Fallback (e.g. from SMS/Email links) */}
            <Route path="/track/:orderTag" element={<OrderTracker />} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;