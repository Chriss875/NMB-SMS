import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import PaymentForm from './PaymentForm';
import PaymentList from './PaymentList';
import { paymentService } from '@/services/paymentService';

// Payment types
export type PaymentType = 'university' | 'nhif';

// Payment interface
export interface Payment {
  id: string;
  type: PaymentType;
  controlNumber: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  description: string;
}

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchPayments();
    }
  }, [isAuthenticated]);

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    
    try {
      // Attempt to fetch from backend first
      const fetchedPayments = await paymentService.getPayments();
      
      if (fetchedPayments.length > 0) {
        setPayments(fetchedPayments);
        // Update local cache for offline use
        localStorage.setItem('paymentCache', JSON.stringify(fetchedPayments));
      } else {
        // Check if we have cached data
        const cachedData = localStorage.getItem('paymentCache');
        if (cachedData) {
          setPayments(JSON.parse(cachedData));
          setError('Unable to fetch latest payment data. Showing cached data.');
        } else {
          setPayments([]);
        }
      }
    } catch (err) {
      console.error('Error in payment flow:', err);
      
      // Fall back to cached data if available
      const cachedData = localStorage.getItem('paymentCache');
      if (cachedData) {
        setPayments(JSON.parse(cachedData));
        setError('Network error. Showing cached payment data.');
      } else {
        setError('Failed to load payment history. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSubmit = async (paymentType: PaymentType, controlNumber: string) => {
    try {
      setError(null);

      // Validate control number (should be numeric and 12 digits)
      if (!/^\d{12}$/.test(controlNumber)) {
        setError('Control number must be 12 digits');
        return;
      }

      // Call the appropriate API based on payment type
      let responseMessage: string;
      if (paymentType === 'university') {
        responseMessage = await paymentService.submitFeePayment(controlNumber);
      } else if (paymentType === 'nhif') {
        responseMessage = await paymentService.submitNhifPayment(controlNumber);
      } else {
        throw new Error('Invalid payment type');
      }

      // Fetch updated payments from the backend (optional)
      await fetchPayments();

      // Show success message
      setSuccessMessage(responseMessage);

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      setError('Failed to submit payment information');
      console.error('Error submitting payment:', err);
    }
  };

  return (
    <MainLayout>
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Payments</h1>
      
      {/* Payment Form Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Submit Payment Information</CardTitle>
          <CardDescription>
            Enter your control numbers for university fees and NHIF
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {successMessage && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
            </Alert>
          )}
          
          <PaymentForm onSubmit={handlePaymentSubmit} />
        </CardContent>
      </Card>
      
      {/* Payment History Card */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            View your previously submitted control numbers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentList 
            payments={payments}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default PaymentsPage;