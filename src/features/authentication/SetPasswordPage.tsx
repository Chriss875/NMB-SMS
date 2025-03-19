import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, UserPlus, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { ROUTES } from '@/constants/routes';


const SetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { setPassword: savePassword, isLoading, error } = useAuth();
  
  // Get email from location state or sessionStorage
  const email = location.state?.email || sessionStorage.getItem('verifiedEmail');
  
  // Redirect if no email is provided
  useEffect(() => {
    if (!email) {
      navigate(ROUTES.SIGNUP, { replace: true });
    }
  }, [email, navigate]);
  
  const validatePassword = () => {
    if (!password) {
      setFormError('Password is required');
      return false;
    }
    
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return false;
    }
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      setFormError('Password must contain at least one uppercase letter');
      return false;
    }
    
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      setFormError('Password must contain at least one lowercase letter');
      return false;
    }
    
    // Check for at least one number
    if (!/\d/.test(password)) {
      setFormError('Password must contain at least one number');
      return false;
    }
    
    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setFormError('Password must contain at least one special character');
      return false;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return false;
    }
    
    setFormError(null);
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    if (!email) {
      setFormError('Email is required. Please go back to the first step.');
      return;
    }
    
    try {
      await savePassword(email, password);
      
      // Don't remove verifiedEmail yet as we'll need it for the profile completion step
      // sessionStorage.removeItem('verifiedEmail');
      
      // Navigate to complete profile page 
      navigate(ROUTES.COMPLETE_PROFILE, { 
        state: { email },
        replace: true
      });
    } catch (err: any) {
      console.error('Error setting password:', err);
      // Error is already handled by the AuthContext
    }
  };
  
  // If no email is provided, show loading until redirect
  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="animate-spin mr-2">⟳</span> Redirecting...
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <img src="/assets/images/nmb-logo.png" alt="NMB Logo" className="h-16 w-auto" />
          </div>
          <CardTitle className="text-center">Set Your Password</CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {(formError || error) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError || error}</AlertDescription>
              </Alert>
            )}
            
            <Alert>
              <AlertDescription>
                Your email <strong>{email}</strong> has been verified. Please set a password for your account.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters with uppercase, lowercase, number and special character
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Setting Password...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Continue
                </>
              )}
            </Button>
            
            <div className="text-center text-sm">
              <Link to={ROUTES.SIGNUP} className="flex items-center justify-center text-blue-600 hover:underline">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Sign Up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SetPasswordPage;