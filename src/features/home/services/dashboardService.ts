import { Payment, PaymentType } from "@/features/payment/PaymentsPage";


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
}

export interface PaymentStatus {
  status: 'submitted' | 'failed' | 'pending';
  message: string;
  controlNumber?: string;
  dueDate?: string;
}

export const dashboardService = {
  fetchDashboardData: async (): Promise<DashboardData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      scholarshipStatus: 'active',
      upcomingEvents: [
        { id: '1', title: 'Mentorship Workshop', date: '2025-04-02', type: 'workshop' },
        { id: '2', title: 'Quarterly Report Due', date: '2025-04-10', type: 'deadline' },
        { id: '3', title: 'Career Fair', date: '2025-04-18', type: 'event' }
      ],
      documents: [
        { id: '1', name: 'Academic Transcript', status: 'submitted', date: '2025-02-15' },
        { id: '2', name: 'Financial Statement', status: 'pending', date: '2025-03-10' },
        { id: '3', name: 'Progress Report Q1', status: 'required', dueDate: '2025-04-10' }
      ]
    };
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