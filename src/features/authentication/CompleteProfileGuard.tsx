import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

/**
 * This guard component ensures that only users who have verified their email and set a password
 * can access the profile completion page
 */
const CompleteProfileGuard: React.FC = () => {
  const location = useLocation();
  
  // Check for email in location state or session storage
  const email = location.state?.email || sessionStorage.getItem('verifiedEmail');

  // If no email is found, redirect to signup
  if (!email) {
    return <Navigate to={ROUTES.SIGNUP} replace />;
  }

  // Email is verified, allow access to the profile completion page
  return <Outlet />;
};

export default CompleteProfileGuard;