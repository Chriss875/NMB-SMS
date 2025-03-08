import React from 'react';
import { Payment } from './PaymentsPage';
import { CircleDollarSign, Shield, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { formatDate } from '@/utils/format';

interface PaymentListProps {
  payments: Payment[];
  isLoading: boolean;
}

// Helper function to format date
const formatDateFallback = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const PaymentList: React.FC<PaymentListProps> = ({ payments, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-gray-600">Loading payments...</span>
      </div>
    );
  }
  
  if (!payments.length) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <CircleDollarSign className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500">No payment information has been submitted yet.</p>
      </div>
    );
  }
  
  // Get status icon based on payment status
  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get badge color based on payment status
  const getStatusBadgeClass = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div 
          key={payment.id} 
          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${payment.type === 'university' ? 'bg-blue-100' : 'bg-green-100'} mr-3`}>
                {payment.type === 'university' ? (
                  <CircleDollarSign className="h-5 w-5 text-blue-600" />
                ) : (
                  <Shield className="h-5 w-5 text-green-600" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-800">
                  {payment.type === 'university' ? 'University Fee' : 'NHIF Insurance'}
                </h4>
                <p className="text-sm text-gray-500">{payment.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">
                {formatDate ? formatDate(payment.createdAt) : formatDateFallback(payment.createdAt)}
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-gray-700">Control Number:</div>
              <div className="text-md font-mono">{payment.controlNumber}</div>
            </div>
            <div className="flex items-center">
              {getStatusIcon(payment.status)}
              <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(payment.status)}`}>
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentList;