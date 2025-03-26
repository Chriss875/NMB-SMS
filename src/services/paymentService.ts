import { api } from './api';
import { Payment } from '../features/payment/PaymentsPage';

// Interface for payment request
export interface PaymentDTO {
  feeControlNumber?: string;
  nhifControlNumber?: string;
}

// Get all payments for the current user
export async function getPayments(): Promise<Payment[]> {
  try {
    // Make API call with authentication headers
    const response = await api.get('/payment/history', {
      // Ensure auth header is included (api.ts should automatically add this)
      // but we can check if the request needs specific headers
      validateStatus: function (status) {
        // Accept any status code to handle in our code
        return true;
      }
    });
    
    // Check for auth errors
    if (response.status === 401 || response.status === 403) {
      console.error('Authentication error when fetching payments:', response.status);
      throw new Error('Authentication required. Please log in again.');
    }
    
    // Return empty array for specific backend error we can't fix from frontend
    if (response.status === 400 && 
        response.data?.message?.includes("getNhifControlNumberSubmittedAt")) {
      console.warn('Backend error with NHIF timestamp, returning empty array:', response.data);
      return [];
    }
    
    if (response.status >= 400) {
      console.error(`Server error (${response.status}) when fetching payments:`, response.data);
      throw new Error(`Failed to fetch payment history (${response.status})`);
    }
    
    // Validate response data format
    if (!response.data || !Array.isArray(response.data)) {
      console.warn('Unexpected response format from payment history:', response.data);
      return [];
    }
    
    // Map backend payment type to frontend payment type
    return response.data.map(payment => ({
      ...payment,
      type: payment.type === 'Fee Control Number' ? 'university' : 'nhif'
    }));
  } catch (error) {
    console.error('Error fetching payments:', error);
    return []; // Return empty array on error
  }
}

// Submit a university fee payment
export async function submitFeePayment(controlNumber: string): Promise<string> {
  try {
    if (!controlNumber || controlNumber.trim() === '') {
      throw new Error('Control number cannot be empty');
    }
    
    const paymentData = {
      feeControlNumber: controlNumber.trim()
    };
    
    console.log('Sending payment data:', paymentData);
    const response = await api.post('/payment/submit-fee', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error submitting fee payment:', error);
    throw error;
  }
}

// Submit an NHIF payment
export async function submitNhifPayment(controlNumber: string): Promise<string> {
  try {
    if (!controlNumber || controlNumber.trim() === '') {
      throw new Error('Control number cannot be empty');
    }
    
    const paymentData = {
      nhifControlNumber: controlNumber.trim()
    };
    
    const response = await api.post('/payment/submit-nhif', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error submitting NHIF payment:', error);
    throw error;
  }
}

export const paymentService = {
  getPayments,
  submitFeePayment,
  submitNhifPayment
};