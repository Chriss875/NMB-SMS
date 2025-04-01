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
    id: string;
    title: string;
    content: string;
    createdAt: string;
    read: boolean;
  }>;
  payments?: Payment[];
  resultStatus?: string[];
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
      // Fetch data from backend API
      const response = await api.get('/home');
      
      if (!response.data) {
        throw new Error('Invalid response format from dashboard API');
      }
      
      const backendData = response.data;
      
      // Map backend data to frontend model
      return {
        // Default to active if not provided by backend
        scholarshipStatus: 'active',
        
        // Process announcements from backend if available
        announcements: backendData.announcements?.content?.map((announcement: any) => ({
          id: announcement.id,
          title: announcement.title,
          content: announcement.content,
          createdAt: announcement.createdAt,
          read: announcement.read || false
        })) || [],
        
        // Include payments directly from backend
        payments: backendData.payments || [],
        
        // Include result status
        resultStatus: backendData.resultStatus || [],
        
        // For now, we'll keep using mock data for these until available from backend
        upcomingEvents: [
          { id: '1', title: 'Mentorship Workshop', date: '2025-04-02', type: 'workshop' },
          { id: '2', title: 'Quarterly Report Due', date: '2025-04-10', type: 'deadline' },
          { id: '3', title: 'Career Fair', date: '2025-04-18', type: 'event' }
        ],
        
        // Map result status to documents
        documents: [
          { 
            id: '1', 
            name: 'Academic Transcript', 
            status: backendData.resultStatus?.includes('transcript') ? 'submitted' : 'pending', 
            date: '2025-02-15' 
          },
          { 
            id: '2', 
            name: 'Financial Statement', 
            status: 'pending', 
            date: '2025-03-10' 
          },
          { 
            id: '3', 
            name: 'Progress Report Q1', 
            status: 'required', 
            dueDate: '2025-04-10' 
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Return fallback data
      return {
        scholarshipStatus: 'active',
        announcements: [],
        payments: [],
        resultStatus: [],
        upcomingEvents: [
          { id: '1', title: 'Mentorship Workshop', date: '2025-04-02', type: 'workshop' },
          { id: '2', title: 'Quarterly Report Due', date: '2025-04-10', type: 'deadline' },
          { id: '3', title: 'Career Fair', date: '2025-04-18', type: 'event' }
        ],
        documents: [
          { id: '1', name: 'Academic Transcript', status: 'pending', date: '2025-02-15' },
          { id: '2', name: 'Financial Statement', status: 'pending', date: '2025-03-10' },
          { id: '3', name: 'Progress Report Q1', status: 'required', dueDate: '2025-04-10' }
        ]
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

    if (payment.status === 'completed' || payment.status === 'processing') {
      return {
        status: 'submitted',
        message: 'Control number submitted',
        controlNumber: payment.controlNumber
      };
    }

    if (payment.status === 'failed') {
      return {
        status: 'failed',
        message: 'Submission failed',
        controlNumber: payment.controlNumber
      };
    }

    return {
      status: 'pending',
      message: 'Processing control number',
      controlNumber: payment.controlNumber
    };
  }
};