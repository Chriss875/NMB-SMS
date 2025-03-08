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

  const validateControlNumber = (controlNumber: string): boolean => {
    if (!controlNumber.trim()) {
      return false;
    }
    
    // Check if it's exactly 12 digits
    return /^\d{12}$/.test(controlNumber);
  };

  const handleUniversitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUniversityFormError(null);
    
    if (!validateControlNumber(universityControlNumber)) {
      setUniversityFormError('Please enter a valid 12-digit control number');
      return;
    }
    
    onSubmit('university', universityControlNumber);
    setUniversityControlNumber('');
  };

  const handleNHIFSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNhifFormError(null);
    
    if (!validateControlNumber(nhifControlNumber)) {
      setNhifFormError('Please enter a valid 12-digit control number');
      return;
    }
    
    onSubmit('nhif', nhifControlNumber);
    setNhifControlNumber('');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>,
    errorSetter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const value = e.target.value;
    
    // Only allow numeric input
    if (/^\d*$/.test(value)) {
      setter(value);
      errorSetter(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* University Fees Payment Form */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <CircleDollarSign className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-medium text-gray-800">University Fee</h3>
        </div>
        
        <form onSubmit={handleUniversitySubmit}>
          <div className="mb-4">
            <label htmlFor="universityControlNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Control Number
            </label>
            <input
              id="universityControlNumber"
              type="text"
              value={universityControlNumber}
              onChange={(e) => handleInputChange(e, setUniversityControlNumber, setUniversityFormError)}
              maxLength={12}
              placeholder="12 digit number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {universityFormError && (
              <p className="mt-1 text-sm text-red-600">{universityFormError}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Enter the 12-digit control number provided by your university.</p>
          </div>
          <Button type="submit" className="w-full">
            Submit University Payment
          </Button>
        </form>
      </div>
      
      {/* NHIF Payment Form */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center mb-4">
          <div className="bg-green-100 p-2 rounded-full mr-3">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-medium text-gray-800">NHIF Insurance</h3>
        </div>
        
        <form onSubmit={handleNHIFSubmit}>
          <div className="mb-4">
            <label htmlFor="nhifControlNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Control Number
            </label>
            <input
              id="nhifControlNumber"
              type="text"
              value={nhifControlNumber}
              onChange={(e) => handleInputChange(e, setNhifControlNumber, setNhifFormError)}
              maxLength={12}
              placeholder="12 digit number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {nhifFormError && (
              <p className="mt-1 text-sm text-red-600">{nhifFormError}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Enter the 12-digit NHIF control number for your health insurance.</p>
          </div>
          <Button type="submit" className="w-full">
            Submit NHIF Payment
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;