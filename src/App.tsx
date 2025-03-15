// src/App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import { Loader2 } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

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

// Basic loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
    <span className="ml-2">Loading...</span>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public routes */}
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
            <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
            <Route path={ROUTES.COMPLETE_PROFILE} element={<CompleteProfilePage />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
              <Route path={ROUTES.RESULTS} element={<ResultsPage />} />
              <Route path={ROUTES.PAYMENTS} element={<PaymentsPage />} />
              <Route path={ROUTES.MENTORSHIP} element={<MentorshipPage />} />
              
              {/* Messaging routes */}
              <Route path={ROUTES.MESSAGING} element={<MessagingLayout />}>
                <Route index element={<Navigate to={ROUTES.ANNOUNCEMENTS} replace />} />
                <Route path="announcements" element={<AnnouncementsPage />} />
                <Route path="chats" element={<ChatsPage />} />
              </Route>
            </Route>
            
            {/* Root path redirects to profile or login depending on auth state */}
            <Route path="/" element={<Navigate to={ROUTES.PROFILE} replace />} />
            
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to={ROUTES.PROFILE} replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;