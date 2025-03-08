import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, LogIn, RefreshCw } from 'lucide-react';

const VerifyEmailPage: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [codeRequested, setCodeRequested] = useState(false);
  const { verifyEmail, requestVerificationCode, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract email from state (passed from sign-up page)
  const email = location.state?.email || '';
  
  useEffect(() => {
    // If no email is provided, redirect back to signup
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setFormError('Please enter verification code');
      return;
    }
    
    try {
      await verifyEmail(email, verificationCode);
      
      // Force navigation to complete-profile after verification
      // regardless of what verifyEmail returns
      if (!error) {
        console.log('Verification successful, redirecting to profile completion');
        navigate('/complete-profile', { 
          state: { email } 
        });
      }
    } catch (err) {
      // Error handled by AuthContext
      console.error('Verification error:', err);
    }
  };
  
  const handleRequestCode = async () => {
    try {
      await requestVerificationCode(email);
      setCodeRequested(true);
    } catch (err) {
      // Error handled by AuthContext
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
            {(formError || error) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError || error}</AlertDescription>
              </Alert>
            )}
            
            {codeRequested && (
              <Alert>
                <AlertDescription>
                  A new verification code has been sent to your email.
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
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter code"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
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
                  Verify & Sign In
                </>
              )}
            </Button>
            
            <div className="flex flex-col space-y-2 items-center text-sm">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleRequestCode}
                disabled={isLoading || codeRequested}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Request New Code
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