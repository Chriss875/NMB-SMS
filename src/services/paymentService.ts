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
    const response = await api.get('/payment/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
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