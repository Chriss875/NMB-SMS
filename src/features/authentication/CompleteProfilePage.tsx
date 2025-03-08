import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, UserPlus } from 'lucide-react';

const CompleteProfilePage: React.FC = () => {
  // Form fields
  const [name, setName] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [universityRegistrationID, setUniversityRegistrationID] = useState('');
  const [programName, setProgramName] = useState('');
  const [enrolledYear, setEnrolledYear] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [sex, setSex] = useState('');
  
  // Form state
  const [formError, setFormError] = useState<string | null>(null);
  const { isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract email from state (passed from verify-email page)
  const email = location.state?.email || '';
  
  useEffect(() => {
    // If no email is provided, redirect back to signup
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);
  
  const validateForm = () => {
    if (!name.trim()) {
      setFormError('Name is required');
      return false;
    }
    
    if (!mobilePhone.trim()) {
      setFormError('Mobile phone is required');
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
    
    // Phone number validation
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(mobilePhone)) {
      setFormError('Please enter a valid phone number');
      return false;
    }
    
    setFormError(null);
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Create profile data object
      const profileData = {
        id: Date.now().toString(), // Generate a temporary ID
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
      
      // Store in localStorage for now (will be replaced by API calls later)
      localStorage.setItem('profileData', JSON.stringify(profileData));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect to login with success message
      navigate('/login', { 
        state: { 
          profileSuccess: true,
          message: 'Your profile has been set up successfully! You can now sign in.' 
        } 
      });
    } catch (err) {
      setFormError('Failed to save profile data');
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
                  onChange={(e) => setMobilePhone(e.target.value)}
                  placeholder="+255712345678"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
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
                  placeholder="Enter your program/course"
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
          
          <CardFooter className="flex justify-end space-x-2">
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