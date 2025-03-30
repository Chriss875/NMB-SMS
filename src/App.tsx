// src/App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ProfileProvider } from './contexts/ProfileContext';
import { ResultProvider } from './contexts/ResultContext';
import { AnnouncementProvider } from './features/announcements/context/AnnouncementContext';
import ProtectedRoute from './constants/ProtectedRoute';
import SetPasswordPage from './features/authentication/SetPasswordPage';
import EmailVerifiedGuard from './features/authentication/EmailVerifiedGuard';
import SettingsPage from '@/features/settings/pages/SettingsPage';

// Pages
import LoginPage from './features/authentication/login/LoginPage';
import ProfilePage from './pages/ProfilePage';
import VerifyEmailPage from './features/authentication/VerifyEmailPage';
import CompleteProfilePage from './features/authentication/CompleteProfilePage';
import ResultsPage from './features/upload results/ResultsPage';
import SignUpPage from './features/authentication/SignUpPage';
import PaymentsPage from './features/payment/PaymentsPage';
import MentorshipPage from './features/career-mentorship/MentorshipPage';
  // Import the new HomePage component
import CompleteProfileGuard from './features/authentication/CompleteProfileGuard';

// Import the ROUTES from constants instead of redefining them
import { ROUTES } from './constants/routes';
import AnnouncementsPage from './features/announcements/pages/AnnouncementsPage';
import HomePage from './features/home/pages/HomePage';

// Basic loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
    <span className="ml-2">Loading...</span>
  </div>
);

// Route guard for the home page - redirects to login if not authenticated
const HomePageGuard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingFallback />;
  }
  
  // If user is authenticated, show the HomePage
  if (isAuthenticated) {
    return <HomePage />;
  }
  
  // If not authenticated, redirect to login
  return <Navigate to={ROUTES.LOGIN} replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProfileProvider>
        <ResultProvider>
          <AnnouncementProvider>
            <Router>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Public routes */}
                  <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                  <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
                  
                  {/* Protected by email verification */}
                  <Route element={<EmailVerifiedGuard />}>
                    <Route path={ROUTES.SET_PASSWORD} element={<SetPasswordPage />} />
                  </Route>
                  
                  {/* Protected by password setup - route to complete profile */}
                  <Route element={<CompleteProfileGuard />}>
                    <Route path={ROUTES.COMPLETE_PROFILE} element={<CompleteProfilePage />} />
                  </Route>
                  
                  <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
                  
                  {/* Protected routes - require full authentication */}
                  <Route element={<ProtectedRoute />}>
                    <Route path={ROUTES.HOME} element={<HomePage />} />  {/* Add HomePage to protected routes */}
                    <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                    <Route path={ROUTES.RESULTS} element={<ResultsPage />} />
                    <Route path={ROUTES.PAYMENTS} element={<PaymentsPage />} />
                    <Route path={ROUTES.MENTORSHIP} element={<MentorshipPage />} />
                    <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                    <Route path={ROUTES.ANNOUNCEMENTS} element={<AnnouncementsPage />} />
                    
                   
                    {/* Direct route to announcements for sidebar navigation */}
                    <Route path={ROUTES.ANNOUNCEMENTS} element={<Navigate to={ROUTES.ANNOUNCEMENTS} replace />} />
                  </Route>
                  
                  {/* Root path with guard to either home or login */}
                  <Route path="/" element={<HomePageGuard />} />
                  
                  {/* Catch-all redirect to HomePage guard */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </Router>
          </AnnouncementProvider>
        </ResultProvider>
      </ProfileProvider>
    </AuthProvider>
  );
};

export default App;