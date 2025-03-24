// src/App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ProfileProvider } from './contexts/ProfileContext';
import { ResultProvider } from './contexts/ResultContext';
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

// Messaging Pages
import MessagingLayout from './features/messaging/pages/MessagingLayout';
import AnnouncementsPage from './features/messaging/pages/AnnouncementsPage';
import ChatsPage from './features/messaging/pages/ChatsPage';
import CompleteProfileGuard from './features/authentication/CompleteProfileGuard';

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  REGISTER: '/register',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  RESULTS: '/results',
  PAYMENTS: '/payments',
  MENTORSHIP: '/mentorship',
  ANNOUNCEMENTS: '/announcements',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_SECURITY: '/settings/security',
  SET_PASSWORD: '/set-password',
  VERIFY_EMAIL: '/verify-email',
  COMPLETE_PROFILE: '/complete-profile',
  // Add messaging routes
  MESSAGING: '/messaging',
  MESSAGING_ANNOUNCEMENTS: '/messaging/announcements',
  MESSAGING_CHATS: '/messaging/chats'
} as const;

// Basic loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
    <span className="ml-2">Loading...</span>
  </div>
);

// Create a smart home page component that checks auth status
const HomePage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingFallback />;
  }
  
  // If user is authenticated, go to profile
  if (isAuthenticated) {
    return <Navigate to={ROUTES.PROFILE} replace />;
  }
  
  // Otherwise, go to login
  return <Navigate to={ROUTES.LOGIN} replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProfileProvider>
        <ResultProvider>
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
                  <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                  <Route path={ROUTES.RESULTS} element={<ResultsPage />} />
                  <Route path={ROUTES.PAYMENTS} element={<PaymentsPage />} />
                  <Route path={ROUTES.MENTORSHIP} element={<MentorshipPage />} />
                  <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                  
                  {/* Messaging routes */}
                  <Route path={ROUTES.MESSAGING} element={<MessagingLayout />}>
                    <Route index element={<Navigate to={ROUTES.ANNOUNCEMENTS} replace />} />
                    <Route path="announcements" element={<AnnouncementsPage />} />
                    <Route path="chats" element={<ChatsPage />} />
                  </Route>
                </Route>
                
                {/* Root path with smart redirection based on auth status */}
                <Route path="/" element={<HomePage />} />
                
                {/* Catch-all redirect to HomePage which will handle redirection intelligently */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </ResultProvider>
      </ProfileProvider>
    </AuthProvider>
  );
};

export default App;