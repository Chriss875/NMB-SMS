import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';
import { PaymentStatus } from '../services/dashboardService';

interface StatusCardProps {
  universityStatus?: PaymentStatus;
  nhifStatus?: PaymentStatus;
  academicTranscriptStatus?: 'submitted' | 'pending';
  isLoading?: boolean;
}

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const StatusCard: React.FC<StatusCardProps> = ({
  universityStatus = { status: 'pending', message: 'Control number pending' },
  nhifStatus = { status: 'pending', message: 'Control number pending', dueDate: '2025-04-01' },
  academicTranscriptStatus = 'pending',
  isLoading = false
}) => {
  // Helper function to get status icon - update to handle case-insensitive comparison
  const getStatusIcon = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'submitted':
        return <CheckCircle className="h-3.5 w-3.5" />;
      case 'failed':
        return <XCircle className="h-3.5 w-3.5" />;
      case 'pending':
        return <Clock className="h-3.5 w-3.5" />;
      default:
        return <AlertCircle className="h-3.5 w-3.5" />;
    }
  };

  // Helper function to get status badge styling - update to handle case-insensitive comparison
  const getStatusBadgeClass = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'submitted':
        return "flex items-center gap-1 bg-green-50 text-green-700 border-green-300";
      case 'failed':
        return "flex items-center gap-1 bg-red-50 text-red-700 border-red-300";
      case 'pending':
        return "flex items-center gap-1 bg-yellow-50 text-yellow-700 border-yellow-300";
      default:
        return "flex items-center gap-1 bg-gray-50 text-gray-700 border-gray-300";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <FileText className="mr-2 h-5 w-5 text-blue-600" />
            Academic & Payment Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <FileText className="mr-2 h-5 w-5 text-blue-600" />
          Academic & Payment Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* University Fee Status */}
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">University Fee</h3>
              <p className="text-sm text-gray-500 mt-1">2024/25 Academic Year</p>
              {universityStatus.controlNumber && (
                <p className="text-xs font-mono mt-1 text-gray-600">
                  Control #: {universityStatus.controlNumber}
                </p>
              )}
            </div>
            <div className="flex items-center">
              <Badge variant={universityStatus.status.toLowerCase() === 'failed' ? 'destructive' : 'default'} 
                className={getStatusBadgeClass(universityStatus.status)}>
                {getStatusIcon(universityStatus.status)}
                <span>{universityStatus.message}</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* NHIF Status */}
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">NHIF Payment</h3>
              <p className="text-sm text-gray-500 mt-1">Health Insurance</p>
              {nhifStatus.controlNumber && (
                <p className="text-xs font-mono mt-1 text-gray-600">
                  Control #: {nhifStatus.controlNumber}
                </p>
              )}
            </div>
            <div className="flex items-center">
              <Badge variant={nhifStatus.status.toLowerCase() === 'failed' ? 'destructive' : 'default'} 
                className={getStatusBadgeClass(nhifStatus.status)}>
                {getStatusIcon(nhifStatus.status)}
                <span>
                  {nhifStatus.dueDate && nhifStatus.status === 'pending'
                    ? `Submit by ${formatDate(nhifStatus.dueDate)}`
                    : nhifStatus.message}
                </span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Academic Results Status */}
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Academic Results</h3>
              <p className="text-sm text-gray-500 mt-1">Previous Semester</p>
            </div>
            <div className="flex items-center">
              <Badge variant={academicTranscriptStatus === 'submitted' ? 'default' : 'secondary'} 
                className={academicTranscriptStatus === 'submitted' 
                  ? "flex items-center gap-1 bg-green-50 text-green-700 border-green-300"
                  : "flex items-center gap-1 bg-yellow-50 text-yellow-700 border-yellow-300"}>
                {academicTranscriptStatus === 'submitted' 
                  ? <CheckCircle className="h-3.5 w-3.5" />
                  : <AlertCircle className="h-3.5 w-3.5" />}
                <span>{academicTranscriptStatus === 'submitted' ? 'Submitted' : 'Not submitted'}</span>
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};