// src/App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import { Loader2 } from 'lucide-react';

// Basic loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
    <span className="ml-2">Loading...</span>
  </div>
);

// Only import ProfilePage eagerly since it's our main feature for now
import ProfilePage from './pages/ProfilePage';

// Lazy load other pages as they are implemented
// const ResultsPage = React.lazy(() => import('./pages/ResultsPage'));
// const PaymentsPage = React.lazy(() => import('./pages/PaymentsPage'));
// const MessagesPage = React.lazy(() => import('./pages/MessagesPage'));
// const MentorshipPage = React.lazy(() => import('./pages/MentorshipPage'));
// const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.PROFILE} replace />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          {/* <Route path={ROUTES.RESULTS} element={<ResultsPage />} />
          <Route path={ROUTES.PAYMENTS} element={<PaymentsPage />} />
          <Route path={ROUTES.MESSAGES} element={<MessagesPage />} />
          <Route path={ROUTES.MENTORSHIP} element={<MentorshipPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} /> */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;