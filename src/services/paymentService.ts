import { api } from './api';
import { Payment } from '../features/payment/PaymentsPage';

// Interface for payment request
export interface PaymentDTO {
  feeControlNumber?: string;
  nhifControlNumber?: string;
}

// Implement caching
let cachedPayments: Payment[] | null = null;
let lastFetchTime: number | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL

// Get all payments for the current user
const getPayments = async (): Promise<Payment[]> => {
  const now = Date.now();
  
  // Return cached results if they're fresh
  if (cachedPayments && lastFetchTime && now - lastFetchTime < CACHE_TTL) {
    console.log('Using cached payments');
    return cachedPayments;
  }
  
  try {
    // Make API call with authentication headers
    const response = await api.get('/payment/history');
    
    // Validate response data format
    if (!response.data || !Array.isArray(response.data)) {
      console.warn('Unexpected response format from payment history:', response.data);
      return [];
    }
    
    // Map backend payment type to frontend payment type and update cache
    const payments = response.data.map(payment => ({
      ...payment,
      type: payment.type === 'Fee Control Number' ? 'university' : 'nhif'
    }));
    
    cachedPayments = payments;
    lastFetchTime = now;
    
    return payments;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

// Submit a university fee payment
const submitFeePayment = async (controlNumber: string): Promise<string> => {
  try {
    if (!controlNumber || controlNumber.trim() === '') {
      throw new Error('Control number cannot be empty');
    }
    
    const paymentData = {
      feeControlNumber: controlNumber.trim()
    };
    
    const response = await api.post('/payment/submit-fee', paymentData);
    
    // Update cache - invalidate it so next fetch gets fresh data
    cachedPayments = null;
    lastFetchTime = null;
    
    return response.data;
  } catch (error) {
    console.error('Error submitting fee payment:', error);
    throw error;
  }
};

// Submit an NHIF payment
const submitNhifPayment = async (controlNumber: string): Promise<string> => {
  try {
    if (!controlNumber || controlNumber.trim() === '') {
      throw new Error('Control number cannot be empty');
    }
    
    const paymentData = {
      nhifControlNumber: controlNumber.trim()
    };
    
    const response = await api.post('/payment/submit-nhif', paymentData);
    
    // Update cache - invalidate it so next fetch gets fresh data
    cachedPayments = null;
    lastFetchTime = null;
    
    return response.data;
  } catch (error) {
    console.error('Error submitting NHIF payment:', error);
    throw error;
  }
};

export const paymentService = {
  getPayments,
  submitFeePayment,
  submitNhifPayment
};