import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CircleDollarSign, Shield } from 'lucide-react';
import { PaymentType } from './PaymentsPage';

interface PaymentFormProps {
  onSubmit: (paymentType: PaymentType, controlNumber: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit }) => {
  const [universityControlNumber, setUniversityControlNumber] = useState('');
  const [nhifControlNumber, setNhifControlNumber] = useState('');
  const [universityFormError, setUniversityFormError] = useState<string | null>(null);
  const [nhifFormError, setNhifFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateControlNumber = (controlNumber: string): boolean => {
    if (!controlNumber.trim()) {
      return false;
    }
    
    // Check if it's exactly 12 digits
    return /^\d{12}$/.test(controlNumber);
  };

  const handleUniversitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUniversityFormError(null);
    
    if (!validateControlNumber(universityControlNumber)) {
      setUniversityFormError('Please enter a valid 12-digit control number');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSubmit('university', universityControlNumber);
      // Clear form on success
      setUniversityControlNumber('');
    } catch (error) {
      // Error is handled by the context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNhifSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNhifFormError(null);
    
    if (!validateControlNumber(nhifControlNumber)) {
      setNhifFormError('Please enter a valid 12-digit control number');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSubmit('nhif', nhifControlNumber);
      // Clear form on success
      setNhifControlNumber('');
    } catch (error) {
      // Error is handled by the context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* University Fee Payment Form */}
      <form onSubmit={handleUniversitySubmit} className="space-y-4 p-4 border rounded-lg border-blue-100 bg-blue-50">
        <div className="flex items-center gap-2 text-blue-700 font-medium">
          <CircleDollarSign className="h-5 w-5" />
          <h3>University Fee Payment</h3>
        </div>
        
        <div>
          <label htmlFor="universityControlNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Control Number
          </label>
          <input
            id="universityControlNumber"
            type="text"
            value={universityControlNumber}
            onChange={(e) => setUniversityControlNumber(e.target.value)}
            placeholder="Enter 12-digit control number"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            maxLength={12}
          />
          {universityFormError && (
            <p className="mt-1 text-sm text-red-600">{universityFormError}</p>
          )}
        </div>
        
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? 'Submitting...' : 'Submit University Fee'}
        </Button>
      </form>
      
      {/* NHIF Payment Form */}
      <form onSubmit={handleNhifSubmit} className="space-y-4 p-4 border rounded-lg border-green-100 bg-green-50">
        <div className="flex items-center gap-2 text-green-700 font-medium">
          <Shield className="h-5 w-5" />
          <h3>NHIF Payment</h3>
        </div>
        
        <div>
          <label htmlFor="nhifControlNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Control Number
          </label>
          <input
            id="nhifControlNumber"
            type="text"
            value={nhifControlNumber}
            onChange={(e) => setNhifControlNumber(e.target.value)}
            placeholder="Enter 12-digit control number"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            maxLength={12}
          />
          {nhifFormError && (
            <p className="mt-1 text-sm text-red-600">{nhifFormError}</p>
          )}
        </div>
        
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? 'Submitting...' : 'Submit NHIF Payment'}
        </Button>
      </form>
    </div>
  );
};

export default PaymentForm;