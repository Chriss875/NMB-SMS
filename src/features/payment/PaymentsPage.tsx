import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

import PaymentForm from './PaymentForm';
import PaymentList from './PaymentList';
import { usePayments } from '@/contexts/PaymentContext';

// Define the Payment and PaymentType interfaces
export interface Payment {
  id: string;
  controlNumber: string;
  type: PaymentType;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  description?: string;
}

export type PaymentType = 'university' | 'nhif';

const PaymentsPage: React.FC = () => {
  const { payments, isLoading, error, submitFeePayment, submitNhifPayment } = usePayments();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handlePaymentSubmit = async (paymentType: PaymentType, controlNumber: string) => {
    try {
      setSuccessMessage(null);

      // Call the appropriate function based on payment type
      let responseMessage: string;
      if (paymentType === 'university') {
        responseMessage = await submitFeePayment(controlNumber);
      } else if (paymentType === 'nhif') {
        responseMessage = await submitNhifPayment(controlNumber);
      } else {
        throw new Error('Invalid payment type');
      }

      // Show success message
      setSuccessMessage(responseMessage || 'Payment information submitted successfully');
    } catch (err) {
      console.error('Payment submission error:', err);
      // Error state is already handled by the context
    }
  };

  return (
    <MainLayout>
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Payments</h1>
      
      {/* Error Alert */}
      {error && (
        <Alert className="mb-4 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Submit Payment Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Submit Payment</CardTitle>
          <CardDescription>
            Enter your control number for university fees or NHIF payment
          </CardDescription>
        </CardHeader>
        <CardContent>
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