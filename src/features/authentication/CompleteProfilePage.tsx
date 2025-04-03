import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, UserPlus } from 'lucide-react';

const CompleteProfilePage: React.FC = () => {
  // Form fields
  const [name, setName] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [mobilePhoneError, setMobilePhoneError] = useState<string | null>(null);
  const [universityName, setUniversityName] = useState('');
  const [universityRegistrationID, setUniversityRegistrationID] = useState('');
  const [programName, setProgramName] = useState('');
  const [enrolledYear, setEnrolledYear] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [sex, setSex] = useState('');
  
  // Form state
  const [formError, setFormError] = useState<string | null>(null);
  const { isLoading, error, completeProfile } = useAuth();
  const navigate = useNavigate();
  
  // Replace the current email retrieval with sessionStorage
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    // Get the email from sessionStorage
    const storedEmail = sessionStorage.getItem('verifiedEmail');
    
    if (storedEmail) {
      setEmail(storedEmail);
      console.log('Retrieved email from storage:', storedEmail);
    } else {
      console.error('No email found in storage, redirecting to signup');
      navigate('/signup');
    }
  }, [navigate]);
  
  const validateForm = () => {
    if (!email) {
      setFormError('Email is required but missing. Please go back to the sign-up page.');
      return false;
    }
  
    if (!name.trim()) {
      setFormError('Name is required');
      return false;
    }
    
    if (!mobilePhone.trim()) {
      setFormError('Mobile phone is required');
      return false;
    }
    
    if (!validatePhoneNumber(mobilePhone)) {
      // Just mark the field as invalid
      setMobilePhoneError('invalid');
      setFormError('Please enter a valid phone number starting with 06, 07, or +255');
      return false;
    }
    
    if (!universityName.trim()) {
      setFormError('University name is required');
      return false;
    }
    
    if (!universityRegistrationID.trim()) {
      setFormError('University ID is required');
      return false;
    }
    
    if (!programName.trim()) {
      setFormError('Program name is required');
      return false;
    }
    
    if (!enrolledYear.trim()) {
      setFormError('Enrolled year is required');
      return false;
    }
    
    if (!batchNumber.trim()) {
      setFormError('Batch number is required');
      return false;
    }
    
    if (!sex.trim()) {
      setFormError('Sex is required');
      return false;
    }
    
    setFormError(null);
    return true;
  };
  
  const formatPhoneNumber = (input: string): string => {
    // Remove any non-digit characters
    let digitsOnly = input.replace(/\D/g, '');
    
    // Handle Tanzania prefixes
    if (digitsOnly.startsWith('0') && (digitsOnly.startsWith('06') || digitsOnly.startsWith('07'))) {
      // If starts with 06 or 07, convert to +255 format
      if (digitsOnly.length > 9) {
        digitsOnly = digitsOnly.substring(0, 10); // Limit to 10 digits (including the 0)
      }
      
      // Format for display - only convert to international format when complete
      if (digitsOnly.length === 10) {
        return `+255${digitsOnly.substring(1)}`;
      }
      return digitsOnly;
    } 
    // Handle +255 format directly
    else if (input.startsWith('+255')) {
      // Extract digits after +255
      const afterCode = digitsOnly.substring(digitsOnly.startsWith('255') ? 3 : 0);
      
      // Limit to 9 digits after country code
      if (afterCode.length > 9) {
        return `+255${afterCode.substring(0, 9)}`;
      }
      return `+255${afterCode}`;
    }
    // Handle input that doesn't match expected formats
    else {
      // If doesn't start with correct prefix, force 0 format
      if (digitsOnly.length > 0 && !digitsOnly.startsWith('0')) {
        digitsOnly = `0${digitsOnly}`;
      }
      
      // Limit to 10 digits
      if (digitsOnly.length > 10) {
        digitsOnly = digitsOnly.substring(0, 10);
      }
      
      return digitsOnly;
    }
  };
  
  const validatePhoneNumber = (phone: string): boolean => {
    // Valid formats: +255xxxxxxxxx (12 chars) or 07xxxxxxxx/06xxxxxxxx (10 chars)
    return /^(\+255[0-9]{9}|0[67][0-9]{8})$/.test(phone);
  };

  // Update the handleSubmit function to use the completeProfile API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      
      const profileData = {
        name,
        email, 
        mobilePhone,
        universityName,
        universityRegistrationID,
        programName,
        enrolledYear,
        batchNumber: parseInt(batchNumber, 10),
        sex,
        enrollmentStatus: 'Active'
      };
      
      
      console.log('SUBMITTING PROFILE DATA:', {
        ...profileData,
        emailExists: !!email,
        emailValue: email
      });
      
      await completeProfile(profileData);
      
      
      sessionStorage.removeItem('verifiedEmail');
      
      navigate('/login', { 
        state: { 
          profileSuccess: true, 
          message: 'Your profile has been set up successfully! You can now sign in.' 
        } 
      });
    } catch (err) {
      console.error('Failed to save profile:', err);
      setFormError('Failed to save profile data. Please try again.');
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <img src="/assets/images/nmb-logo.png" alt="NMB Logo" className="h-16 w-auto" />
          </div>
          <CardTitle className="text-center">Complete Your Profile</CardTitle>
          <CardDescription className="text-center">
            Please provide your scholarship information
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none">
                  Full Name*
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="sex" className="text-sm font-medium leading-none">
                  Sex*
                </label>
                <select
                  id="sex"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="flex h-10 w-full rounded-md border border-input bg-gray-100 px-3 py-2 text-sm ring-offset-background"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="mobilePhone" className="text-sm font-medium leading-none">
                  Mobile Phone*
                </label>
                <input
                  id="mobilePhone"
                  type="tel"
                  value={mobilePhone}
                  onChange={(e) => {
                    const input = e.target.value;
                    
                    // Only allow input that starts with valid prefixes
                    if (input === '' || 
                        input === '0' || 
                        input.startsWith('06') || 
                        input.startsWith('07') || 
                        input.startsWith('+') ||
                        input.startsWith('+2') ||
                        input.startsWith('+25') ||
                        input.startsWith('+255')) {
                      
                      const formattedValue = formatPhoneNumber(input);
                      setMobilePhone(formattedValue);
                      
                      // Set error state based on validation, but don't show error message
                      setMobilePhoneError(validatePhoneNumber(formattedValue) ? null : 'invalid');
                    }
                  }}
                  onBlur={() => {
                    // On blur, validate and format
                    if (mobilePhone) {
                      if (!validatePhoneNumber(mobilePhone)) {
                        setMobilePhoneError('invalid'); // Just mark as invalid, no message
                      } else if (mobilePhone.startsWith('0') && mobilePhone.length === 10) {
                        // Auto-convert to international format on blur if complete
                        setMobilePhone(`+255${mobilePhone.substring(1)}`);
                        setMobilePhoneError(null);
                      }
                    }
                  }}
                  placeholder="0712345678"
                  className={`flex h-10 w-full rounded-md border ${
                    mobilePhoneError ? 'border-red-500' : 'border-input'
                  } bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 ${
                    mobilePhoneError ? 'focus:ring-red-500' : 'focus:ring-ring'
                  }`}
                  required
                />
                <p className="text-xs text-gray-500">
                  Enter Tanzanian mobile number starting with 06, 07 or +255
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="universityName" className="text-sm font-medium leading-none">
                  University Name*
                </label>
                <input
                  id="universityName"
                  type="text"
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                  placeholder="Enter your university"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="universityRegistrationID" className="text-sm font-medium leading-none">
                  University Registration ID*
                </label>
                <input
                  id="universityRegistrationID"
                  type="text"
                  value={universityRegistrationID}
                  onChange={(e) => setUniversityRegistrationID(e.target.value)}
                  placeholder="Enter your student ID"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="programName" className="text-sm font-medium leading-none">
                  Program Name*
                </label>
                <input
                  id="programName"
                  type="text"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  placeholder="Enter your program"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="enrolledYear" className="text-sm font-medium leading-none">
                  Enrolled Year*
                </label>
                <input
                  id="enrolledYear"
                  type="text"
                  value={enrolledYear}
                  onChange={(e) => setEnrolledYear(e.target.value)}
                  placeholder="e.g., 2022 - 2025"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="batchNumber" className="text-sm font-medium leading-none">
                  Batch Number*
                </label>
                <input
                  id="batchNumber"
                  type="number"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  placeholder="Enter batch number"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                  min="1"
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2 pt-6">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Saving...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Complete Profile
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CompleteProfilePage;