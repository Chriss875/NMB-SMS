import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, UserPlus, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const { verifyEmail, isLoading, error } = useAuth();
  const navigate = useNavigate();
  
  const validateEmail = () => {
    if (!email) {
      setFormError('Email is required');
      return false;
    }
    
    // Email validation with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    
    setFormError(null);
    return true;
  };
  
  const validateVerificationCode = (code: string) => {
    if (!code || code.trim().length !== 6) {
      return 'Please enter a valid 6-digit verification code';
    }
    return null;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Validate email
    if (!validateEmail()) {
      return;
    }
    
    // Validate verification code format
    const validationError = validateVerificationCode(verificationCode);
    if (validationError) {
      setFormError(validationError);
      return;
    }
    
    try {
      // Call verifyEmail with explicitly named variables to avoid any confusion
      const emailToVerify = email;
      const codeToVerify = verificationCode.trim();
      await verifyEmail(emailToVerify, codeToVerify);
      
      // Store email in sessionStorage to make it available across routes
      sessionStorage.setItem('verifiedEmail', email);
      
      // Navigate to set password page
      navigate(ROUTES.SET_PASSWORD, { 
        state: { email },
        replace: true
      });
    } catch (err: any) {
      console.error('Verification error:', err);
      // Error should be handled by the auth context
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <img src="/assets/images/nmb-logo.png" alt="NMB Logo" className="h-16 w-auto" />
          </div>
          <CardTitle className="text-center">Create Your Account</CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {(formError || error) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError || error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            
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
                Enter the 6-digit verification code provided to you
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || verificationCode.length !== 6}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Verifying...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Verify & Continue
                </>
              )}
            </Button>
            
            <div className="text-center text-sm">
              <Link to="/login" className="flex items-center justify-center text-blue-600 hover:underline">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignUpPage;