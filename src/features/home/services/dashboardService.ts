import { Payment, PaymentType } from "@/features/payment/PaymentsPage";
import { api } from "@/services/api";

export interface DashboardData {
  scholarshipStatus: 'active' | 'inactive';
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    type: 'workshop' | 'deadline' | 'event';
  }>;
  documents: Array<{
    id: string;
    name: string;
    status: string;
    date?: string;
    dueDate?: string;
  }>;
  announcements?: Array<{
    id: number;
    title: string;
    content: string;
    senderName: string;
    createdAt: string;
    read: boolean;
  }>;
  payments?: Array<{
    id: string;
    type: string;
    controlNumber: string;
    createdAt: string;
    status: string;
    description: string;
  }>;
  resultStatus?: string[];
  pagination?: {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    isFirst: boolean;
    isLast: boolean;
  };
}

export interface PaymentStatus {
  status: 'submitted' | 'failed' | 'pending';
  message: string;
  controlNumber?: string;
  dueDate?: string;
}

export const dashboardService = {
  fetchDashboardData: async (): Promise<DashboardData> => {
    try {
      const response = await api.get('/home');
      
      if (!response.data) {
        throw new Error('Invalid response format from dashboard API');
      }
      
      const backendData = response.data;
      
      return {
        scholarshipStatus: 'active',
        
        // Handle the nested announcements structure with pagination info
        announcements: backendData.announcements?.content?.map((announcement: any) => ({
          id: announcement.id,
          title: announcement.title,
          content: announcement.content,
          senderName: announcement.senderName,
          createdAt: announcement.createdAt,
          read: announcement.read || false
        })) || [],
        
        // Extract pagination data from announcements
        pagination: backendData.announcements ? {
          totalElements: backendData.announcements.totalElements,
          totalPages: backendData.announcements.totalPages,
          currentPage: backendData.announcements.number,
          pageSize: backendData.announcements.size,
          isFirst: backendData.announcements.first,
          isLast: backendData.announcements.last
        } : undefined,
        
        // Handle the payments array
        payments: backendData.payments?.map((payment: any) => ({
          id: payment.id,
          type: payment.type,
          controlNumber: payment.controlNumber,
          createdAt: payment.createdAt,
          status: payment.status,
          description: payment.description
        })) || [],
        
        // Handle resultStatus which may contain null values
        resultStatus: Array.isArray(backendData.resultStatus) ? 
          backendData.resultStatus.filter((status: string | null): status is string => status !== null) : 
          [],
        
        // Initialize with empty arrays since these are not yet provided by backend
        upcomingEvents: [],
        
        documents: [
          { 
            id: '1', 
            name: 'Academic Transcript', 
            status: Array.isArray(backendData.resultStatus) && 
                  backendData.resultStatus.some((status: string | null) => status === 'Submitted') ? 
                  'submitted' : 'pending',
            date: new Date().toISOString().split('T')[0]
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Return minimal fallback data
      return {
        scholarshipStatus: 'active',
        announcements: [],
        payments: [],
        resultStatus: [],
        upcomingEvents: [],
        documents: []
      };
    }
  },

  getPaymentStatus: (payment: Payment | null, type: PaymentType): PaymentStatus => {
    if (!payment) {
      return {
        status: 'pending',
        message: `Control number pending`,
        dueDate: type === 'nhif' ? '2025-04-01' : undefined
      };
    }

    return {
      status: payment.status.toLowerCase() as 'submitted' | 'failed' | 'pending',
      message: `Control number ${payment.status.toLowerCase()}`,
      controlNumber: payment.controlNumber
    };
  }
};