import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, LogIn, RefreshCw } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

const VerifyEmailPage: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [codeRequested, setCodeRequested] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { verifyEmail, requestVerificationCode, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [localError, setLocalError] = useState<string | null>(null);
  
  const { email } = location.state || {};
  
  // Handle cooldown timer for requesting new codes
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    } else if (cooldown === 0 && codeRequested) {
      setCodeRequested(false);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);
  
  // If no email in state, redirect to signup
  if (!email) {
    return <Navigate to={ROUTES.SIGNUP} replace />;
  }
  
  const validateVerificationCode = (code: string) => {
    // Basic validation - ensure it's not empty and follows expected format
    // Adjust regex based on your verification code format (usually 6 digits)
    const codeRegex = /^\d{6}$/;
    
    if (!code || code.trim() === '') {
      return 'Please enter the verification code from your email';
    }
    
    if (!codeRegex.test(code)) {
      return 'Verification code should be 6 digits';
    }
    
    return null;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null); // Clear previous errors
    
    // Validate verification code format
    const validationError = validateVerificationCode(verificationCode);
    if (validationError) {
      setLocalError(validationError);
      return;
    }
    
    try {
      console.log('VerifyEmailPage: Attempting verification with:', {
        email: email,
        codeValue: verificationCode,
        codeLength: verificationCode.length,
        trimmedCode: verificationCode.trim(),
        trimmedLength: verificationCode.trim().length
      });
      
      // Call verifyEmail with explicitly named variables to avoid any confusion
      const emailToVerify = email;
      const codeToVerify = verificationCode.trim();
      await verifyEmail(emailToVerify, codeToVerify);
      
      // Store email in sessionStorage (more reliable than state passing)
      sessionStorage.setItem('verifiedEmail', email);
      console.log('Email verification successful, storing email:', email);
      navigate('/complete-profile');
    } catch (err: any) {
      console.error('Verification error:', err);
      // Set a user-friendly error message
      setLocalError(err.message || 'Verification failed. Please check your code or request a new one.');
      // Clear the verification code input on error
      setVerificationCode('');
    }
  };
  
  const handleRequestCode = async () => {
    try {
      await requestVerificationCode(email);
      setCodeRequested(true);
      setCooldown(60); // Set 60-second cooldown
      // Clear any existing error messages
      setLocalError(null);
    } catch (err: any) {
      // Display specific error from requestVerificationCode if available
      setLocalError(err.message || 'Failed to request new code. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <img src="/assets/images/nmb-logo.png" alt="NMB Logo" className="h-16 w-auto" />
          </div>
          <CardTitle className="text-center">Verify Your Email</CardTitle>
          <CardDescription className="text-center">
            We've sent a verification code to {email}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {(localError || error) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{localError || error}</AlertDescription>
              </Alert>
            )}
            
            {codeRequested && (
              <Alert>
                <AlertDescription>
                  A new verification code has been sent to your email.
                  {cooldown > 0 && ` You can request another code in ${cooldown} seconds.`}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <label htmlFor="verificationCode" className="text-sm font-medium leading-none">
                Verification Code
              </label>
              <input
                id="verificationCode"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/[^\d]/g, ''))}
                placeholder="Enter 6-digit code"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
                autoComplete="one-time-code"
              />
              <p className="text-xs text-gray-500">
                Enter the 6-digit code sent to your email address
              </p>
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
                  Verifying...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Verify & Continue
                </>
              )}
            </Button>
            
            <div className="flex flex-col space-y-2 items-center text-sm">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleRequestCode}
                disabled={isLoading || cooldown > 0}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${cooldown > 0 ? 'animate-spin' : ''}`} />
                {cooldown > 0 ? `Request New Code (${cooldown}s)` : "Request New Code"}
              </Button>
              
              <Link to="/login" className="text-blue-600 hover:underline mt-2">
                Back to Sign In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;