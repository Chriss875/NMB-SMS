import { paymentService } from './paymentService';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  senderName: string;
  timestamp: Date;
  read: boolean;
}

export interface Document {
  id: string;
  name: string;
  status: 'submitted' | 'pending' | 'required';
  date?: string;
  dueDate?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  type: 'workshop' | 'deadline' | 'event';
}

export interface DashboardData {
  scholarshipStatus: 'active' | 'inactive';
  upcomingEvents: Event[];
  announcements: Announcement[];
  documents: Document[];
}

export const dashboardService = {
  /**
   * Fetch all dashboard data
   */
  getDashboardData: async (): Promise<DashboardData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real application, this would be an API call
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
  },
  
  /**
   * Get payment and document status for dashboard
   */
  getPaymentAndDocumentStatus: async () => {
    try {
      // Get payments from payment service
      const payments = await paymentService.getPayments();
      
      // Find the most recent university fee and NHIF payments
      const universityPayment = payments
        .filter(p => p.type === 'university')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;
        
      const nhifPayment = payments
        .filter(p => p.type === 'nhif')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;
      
      return {
        university: universityPayment,
        nhif: nhifPayment
      };
    } catch (error) {
      console.error('Error fetching payment status:', error);
      return {
        university: null,
        nhif: null
      };
    }
  },
  
  /**
   * Mark an announcement as read
   */
  markAnnouncementAsRead: async (announcementId: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real application, this would be an API call
    console.log(`Marking announcement ${announcementId} as read`);
    return true;
  }
};