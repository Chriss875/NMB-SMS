import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Payment } from '@/features/payment/PaymentsPage';
import { paymentService } from '@/services/paymentService';
import { useAuth } from './AuthContext';
import { useUserData } from './UserDataContext';

interface PaymentContextType {
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
  submitFeePayment: (controlNumber: string) => Promise<string>;
  submitNhifPayment: (controlNumber: string) => Promise<string>;
  refreshPayments: (force?: boolean) => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { isLoading: isAppLoading } = useUserData();

  const fetchPayments = async (_force = false) => {
    // Skip if the app is already loading data centrally
    if (isAppLoading) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const fetchedPayments = await paymentService.getPayments();
      
      // Update local cache for offline use
      if (fetchedPayments.length > 0) {
        localStorage.setItem('paymentCache', JSON.stringify(fetchedPayments));
      }
      
      setPayments(fetchedPayments);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load your payment information. Please try again later.');
      
      // Fall back to cached data if available
      const cachedData = localStorage.getItem('paymentCache');
      if (cachedData) {
        setPayments(JSON.parse(cachedData));
        setError('Network error. Showing cached payment data.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Only fetch once the app's central loading is done
  useEffect(() => {
    if (user && !isAppLoading) {
      fetchPayments();
    } else if (!user) {
      setPayments([]);
    }
  }, [user, isAppLoading]);

  const submitFeePayment = async (controlNumber: string): Promise<string> => {
    try {
      setError(null);
      
      const responseMessage = await paymentService.submitFeePayment(controlNumber);
      
      // Refresh payments after submission
      await fetchPayments();
      
      return responseMessage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit university fee payment';
      setError(errorMessage);
      throw err;
    }
  };

  const submitNhifPayment = async (controlNumber: string): Promise<string> => {
    try {
      setError(null);
      
      const responseMessage = await paymentService.submitNhifPayment(controlNumber);
      
      // Refresh payments after submission
      await fetchPayments();
      
      return responseMessage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit NHIF payment';
      setError(errorMessage);
      throw err;
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        payments,
        isLoading,
        error,
        submitFeePayment,
        submitNhifPayment,
        refreshPayments: (force = false) => fetchPayments(force)
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayments = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayments must be used within a PaymentProvider');
  }
  return context;
};