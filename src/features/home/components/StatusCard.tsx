import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { PaymentStatus } from '../services/dashboardService';

interface StatusCardProps {
  universityStatus: PaymentStatus;
  nhifStatus: PaymentStatus;
  academicTranscriptStatus: 'submitted' | 'pending';
}

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const StatusCard: React.FC<StatusCardProps> = ({
  universityStatus,
  nhifStatus,
  academicTranscriptStatus
}) => {
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
            </div>
            <div className="flex items-center">
              {universityStatus.status === 'submitted' ? (
                <Badge variant="default" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-300">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>{universityStatus.message}</span>
                </Badge>
              ) : universityStatus.status === 'failed' ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{universityStatus.message}</span>
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border-yellow-300">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{universityStatus.message}</span>
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* NHIF Status */}
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">NHIF Payment</h3>
              <p className="text-sm text-gray-500 mt-1">Health Insurance</p>
            </div>
            <div className="flex items-center">
              {nhifStatus.status === 'submitted' ? (
                <Badge variant="default" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-300">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>{nhifStatus.message}</span>
                </Badge>
              ) : nhifStatus.status === 'failed' ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{nhifStatus.message}</span>
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border-yellow-300">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>
                    {nhifStatus.dueDate ? `Submit by ${formatDate(nhifStatus.dueDate)}` : nhifStatus.message}
                  </span>
                </Badge>
              )}
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
              {academicTranscriptStatus === 'submitted' ? (
                <Badge variant="default" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-300">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Submitted</span>
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border-yellow-300">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Not submitted</span>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};