import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  FileText, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { paymentService } from '@/services/paymentService';
import { Payment, PaymentType } from '@/features/payment/PaymentsPage';
import { useProfile } from '@/hooks/useProfile';
import AnnouncementCard from '@/features/announcements/components/AnnouncementCard';
import { useAnnouncements } from '../announcements/context/AnnouncementContext';
import { Announcement } from '../announcements/types';
import { ROUTES } from '@/constants/routes';

// This would be replaced with actual API calls in a real implementation
const fetchDashboardData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // For non-payment data we'll still use mock data
  return {
    scholarshipStatus: 'active',
    upcomingEvents: [
      { id: '1', title: 'Mentorship Workshop', date: '2025-04-02', type: 'workshop' },
      { id: '2', title: 'Quarterly Report Due', date: '2025-04-10', type: 'deadline' },
      { id: '3', title: 'Career Fair', date: '2025-04-18', type: 'event' }
    ],
    announcements: [
      { 
        id: '1', 
        title: 'Upcoming Scholarship Event', 
        content: 'Please join us for the upcoming scholarship event next Friday.',
        senderName: 'Admin',
        timestamp: new Date(),
        read: false
      },
      { 
        id: '2', 
        title: 'Stipend Payment Schedule',
        content: 'The next stipend payment will be processed on April 15th. Please ensure your banking details are up to date.',
        senderName: 'Finance Department',
        timestamp: new Date(Date.now() - 86400000 * 2),
        read: true
      }
    ],
    documents: [
      { id: '1', name: 'Academic Transcript', status: 'submitted', date: '2025-02-15' },
      { id: '2', name: 'Financial Statement', status: 'pending', date: '2025-03-10' },
      { id: '3', name: 'Progress Report Q1', status: 'required', dueDate: '2025-04-10' }
    ]
  };
};

const HomePage = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { announcements, markAnnouncementAsRead } = useAnnouncements();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<any>(null);
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
        // Fetch dashboard data
        const data = await fetchDashboardData();
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
  const getPaymentStatus = (type: PaymentType) => {
    const payment = type === 'university' ? paymentData.university : paymentData.nhif;
    
    if (!payment) {
      return {
        status: 'pending',
        message: type === 'university' ? 'Control number pending' : 'Control number pending',
        dueDate: type === 'nhif' ? '2025-04-01' : undefined // Fallback due date for NHIF
      };
    }

    // Use actual payment status
    if (payment.status === 'completed' || payment.status === 'processing') {
      return {
        status: 'submitted',
        message: 'Control number submitted',
        controlNumber: payment.controlNumber
      };
    } else if (payment.status === 'failed') {
      return {
        status: 'failed',
        message: 'Submission failed',
        controlNumber: payment.controlNumber
      };
    } else {
      return {
        status: 'pending',
        message: 'Processing control number',
        controlNumber: payment.controlNumber
      };
    }
  };

  const renderDashboardContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4 mb-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4 mb-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Get the status for both payment types
    const universityStatus = getPaymentStatus('university');
    const nhifStatus = getPaymentStatus('nhif');

    return (
      <>
        {/* Welcome Banner */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Welcome back, {profile?.name || user?.name || 'Scholar'}
                </h2>
                <div className="text-blue-100 flex items-center gap-2">
                  <span>Your scholarship status:</span>
                  <Badge variant="secondary" className="bg-white/90 text-blue-800">
                    {dashboardData.scholarshipStatus === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Academic & Payment Status Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-600" />
                Academic & Payment Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* University Fee Status */}
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium">University Fee</p>
                  <p className="text-sm text-gray-500">2024/25 Academic Year</p>
                </div>
                <div className="flex items-center">
                  {universityStatus.status === 'submitted' ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                      <span className="text-green-600 text-sm">{universityStatus.message}</span>
                    </>
                  ) : universityStatus.status === 'failed' ? (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-500 mr-1" />
                      <span className="text-red-600 text-sm">{universityStatus.message}</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-1" />
                      <span className="text-amber-600 text-sm">{universityStatus.message}</span>
                    </>
                  )}
                </div>
              </div>

              {/* NHIF Status */}
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium">NHIF Payment</p>
                  <p className="text-sm text-gray-500">Health Insurance</p>
                </div>
                <div className="flex items-center">
                  {nhifStatus.status === 'submitted' ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                      <span className="text-green-600 text-sm">{nhifStatus.message}</span>
                    </>
                  ) : nhifStatus.status === 'failed' ? (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-500 mr-1" />
                      <span className="text-red-600 text-sm">{nhifStatus.message}</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-1" />
                      <span className="text-amber-600 text-sm">
                        {nhifStatus.dueDate ? `Submit by ${formatDate(nhifStatus.dueDate)}` : nhifStatus.message}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Academic Results Status */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Academic Results</p>
                  <p className="text-sm text-gray-500">Previous Semester</p>
                </div>
                <div className="flex items-center">
                  {dashboardData.documents.find((doc: any) => doc.name === 'Academic Transcript')?.status === 'submitted' ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                      <span className="text-green-600 text-sm">Submitted</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-1" />
                      <span className="text-amber-600 text-sm">Not submitted</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Announcements Card */}
          {renderAnnouncementsCard()}
        </div>
      </>
    );
  };

  const renderAnnouncementsCard = () => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-blue-600" />
            Recent Announcements
          </div>
          <Badge variant="outline" className="ml-2">
            {announcements.filter(a => !a.read).length} new
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {announcements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No announcements yet</div>
          ) : (
            <div className="space-y-4">
              {announcements.slice(0, 5).map((announcement: Announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onClick={() => {
                    markAnnouncementAsRead(announcement.id);
                    navigate(ROUTES.ANNOUNCEMENTS);
                  }}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Dashboard</h1>
      {renderDashboardContent()}
    </MainLayout>
  );
};

export default HomePage;