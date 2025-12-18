import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import RecycleBin from './components/dashboard/Porducts/RecycleBinProducts';
import OnlineMenu from './components/dashboard/Branch/OnlineMenu/OnlineMenu';
import ResetPassword from './pages/Pass/ResetPassword';
import ConfirmMail from './pages/Pass/ConfirimMail';
import SetNewPassword from './pages/Pass/SetNewPassword';
import MainLayout from './pages/MainLayout';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Wrap all routes that need the Header/Footer 
              inside a parent <Route> using the MainLayout.
            */}
            <Route element={<MainLayout />}>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/resetPassword" element={<ResetPassword />} />
              <Route path="/confirmMail" element={<ConfirmMail />} />
              <Route path="/setnewpassword" element={<SetNewPassword />} />
              <Route path="/register" element={<Register />} />

              {/* Protected onboarding routes */}
              <Route path="/onboarding/restaurant" element={<ProtectedRoute><OnboardingRestaurant /></ProtectedRoute>} />
              <Route path="/onboarding/branch" element={<ProtectedRoute><OnboardingBranch /></ProtectedRoute>} />
              <Route path="/onboarding/complete" element={<ProtectedRoute><OnboardingComplete /></ProtectedRoute>} />
            </Route>

            {/* Protected routes without Header/Footer */}
            <Route path="/selection" element={<ProtectedRoute><SelectionScreen /></ProtectedRoute>} />
            <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* Public routes for guests - QR and Online Menu */}
            <Route path="/table/qr/:qrToken" element={<TableQR />} />
            <Route path="/OnlineMenu/:publicId" element={<OnlineMenu />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;