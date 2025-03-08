import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import PaymentForm from './PaymentForm';
import PaymentList from './PaymentList';

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
    try {
      // In a real app, this would be an API call
      // const response = await api.get('/payments');
      
      // Mock data for demonstration
      const storedPayments = localStorage.getItem('scholarshipPayments');
      let mockPayments: Payment[] = [];
      
      if (storedPayments) {
        mockPayments = JSON.parse(storedPayments);
      }
      
      setPayments(mockPayments);
    } catch (err) {
      setError('Failed to load payment history');
      console.error('Error fetching payments:', err);
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
      
      // Create new payment object
      const newPayment: Payment = {
        id: Date.now().toString(),
        type: paymentType,
        controlNumber,
        createdAt: new Date().toISOString(),
        status: 'pending',
        description: paymentType === 'university' ? 'University Fee Payment' : 'NHIF Insurance Payment'
      };
      
      // In a real app, this would be an API call
      // await api.post('/payments', newPayment);
      
      // Add to local state
      const updatedPayments = [...payments, newPayment];
      setPayments(updatedPayments);
      
      // Save to localStorage (for demo only)
      localStorage.setItem('scholarshipPayments', JSON.stringify(updatedPayments));
      
      // Show success message
      setSuccessMessage(`Control number ${controlNumber} for ${paymentType === 'university' ? 'University Fee' : 'NHIF'} has been submitted successfully`);
      
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