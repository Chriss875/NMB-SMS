import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useAnnouncements } from '@/features/announcements/context/AnnouncementContext';
import { paymentService } from '@/services/paymentService';
import { WelcomeBanner } from '../components/WelcomeBanner';
import { StatusCard } from '../components/StatusCard';

import { dashboardService, PaymentStatus } from '../services/dashboardService';

import { Payment } from '@/features/payment/PaymentsPage';
import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { AnnouncementsCard } from '../components/Announcement';
import { ROUTES } from '@/constants/routes';

interface DashboardData {
  scholarshipStatus: 'active' | 'inactive';
  documents: Array<{
    name: string;
    status: string;
  }>;
  // Add other dashboard data properties as needed
}

// What AnnouncementsCard expects
export interface Announcement {
  id: string;
  title: string;
  createdAt: Date;  // Keep as Date in the data model
  // ... other properties
}

const HomePage = () => {
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { profile } = useProfile();
  const { announcements, markAnnouncementAsRead } = useAnnouncements();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<{
    university: Payment | null;
    nhif: Payment | null;
  }>({
    university: null,
    nhif: null
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch dashboard data
        const data = await dashboardService.fetchDashboardData();
        setDashboardData(data);
        
        // Fetch payment data
        const payments = await paymentService.getPayments();
        
        // Find the most recent university fee and NHIF payments
        const universityPayment = payments
          .filter(p => p.type === 'university')
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;
          
        const nhifPayment = payments
          .filter(p => p.type === 'nhif')
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;
        
        setPaymentData({
          university: universityPayment,
          nhif: nhifPayment
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get payment submission status
  const getPaymentStatus = (type: 'university' | 'nhif'): PaymentStatus => {
    const payment = paymentData?.[type];
  
    if (!payment) {
      return {
        status: 'pending',
        message: `${type} control number pending`,
        dueDate: type === 'nhif' ? '2025-04-01' : undefined
      };
    }
  
    switch (payment.status) {
      case 'completed':
      case 'processing':
        return {
          status: 'submitted',
          message: 'Control number submitted',
          controlNumber: payment.controlNumber
        };
      case 'failed':
        return {
          status: 'failed',
          message: 'Submission failed',
          controlNumber: payment.controlNumber
        };
      default:
        return {
          status: 'pending',
          message: 'Processing control number',
          controlNumber: payment.controlNumber
        };
    }
  };

  return (
    <MainLayout>
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Dashboard</h1>
      {isLoading ? (
        <DashboardSkeleton />
      ) : error ? (
        <div className="p-4 text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      ) : dashboardData ? (
        <>
          <WelcomeBanner 
            name={profile?.name || user?.name || 'Scholar'} 
            scholarshipStatus={dashboardData.scholarshipStatus} 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <StatusCard 
              universityStatus={getPaymentStatus('university')}
              nhifStatus={getPaymentStatus('nhif')}
              academicTranscriptStatus={dashboardData.documents.find(
                doc => doc.name === 'Academic Transcript'
              )?.status === 'submitted' ? 'submitted' : 'pending'}
            />
            <AnnouncementsCard 
              announcements={announcements.map(announcement => ({
                ...announcement,
                createdAt: formatDate(announcement.createdAt.toISOString())
              }))}
              onAnnouncementClick={(id) => {
                markAnnouncementAsRead(id);
                navigate(ROUTES.ANNOUNCEMENTS);
              }}
            />
          </div>
        </>
      ) : null}
    </MainLayout>
  );
};

export default HomePage;