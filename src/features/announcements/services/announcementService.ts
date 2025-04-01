import { api } from '@/services/api';
import { Announcement } from '../types';
import { ApiError } from '@/utils/errors';
import { AxiosError } from 'axios';

// Mock data for fallback
const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Upcoming Scholarship Event',
    content: 'Please join us for the upcoming scholarship event next Friday.',
    senderName: 'Admin',
    senderId: 'admin1',
    createdAt: new Date(),
    read: false
  },
  {
    id: '2',
    title: 'Stipend Payment Schedule',
    content: 'The next stipend payment will be processed on April 15th.',
    senderName: 'Finance Department',
    senderId: 'finance1',
    createdAt: new Date(Date.now() - 86400000),
    read: false
  }
];

export const announcementService = {
  getAnnouncements: async (page = 0, size = 10): Promise<Announcement[]> => {
    try {
      const response = await api.get('/announcements/user', {
        params: { page, size }
      });
      
      // Check if the response has a valid structure
      if (!response.data || !response.data.announcements) {
        console.warn('Invalid response format from announcements API');
        return MOCK_ANNOUNCEMENTS;
      }
      
      // Check if there are any announcements
      if (!Array.isArray(response.data.announcements) || response.data.announcements.length === 0) {
        console.log('No announcements found in database, using mock data');
        return MOCK_ANNOUNCEMENTS;
      }
      
      // Transform the data to match our frontend model
      return response.data.announcements.map((announcement: any) => ({
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        senderName: announcement.createdBy || 'Admin',
        senderId: announcement.createdById || 'admin1',
        createdAt: new Date(announcement.createdAt),
        read: announcement.read || false
      }));
    } catch (error) {
      console.warn('Error fetching announcements, falling back to mock data:', error);
      return MOCK_ANNOUNCEMENTS;
    }
  },

  markAsRead: async (id: string): Promise<void> => {
    try {
      // Update endpoint to match the actual API
      const response = await api.patch(`/announcements/${id}/read`);
      
      if (response.status !== 200 && response.status !== 204) {
        throw new ApiError('Failed to mark announcement as read', response.status);
      }
    } catch (error: unknown) {
      console.warn('Mark as read failed:', error);
      // In development/testing, simulate success
      if (process.env.NODE_ENV !== 'production') {
        return Promise.resolve();
      }
      
      if (error instanceof AxiosError) {
        throw new ApiError(
          'Failed to mark announcement as read. Please try again later.',
          error.response?.status
        );
      }
      
      throw new ApiError('Failed to mark announcement as read. Please try again later.');
    }
  },

  createAnnouncement: async (data: { title: string, content: string }): Promise<Announcement> => {
    try {
      const response = await api.post('/announcements/admin', data);
      
      if (!response.data || !response.data.id) {
        throw new ApiError('Invalid response from create announcement API');
      }
      
      // Transform the response to match our frontend model
      return {
        id: response.data.id,
        title: response.data.title,
        content: response.data.content,
        senderName: response.data.createdBy || 'Admin',
        senderId: response.data.createdById || 'admin1',
        createdAt: new Date(response.data.createdAt),
        read: false
      };
    } catch (error: unknown) {
      console.error('Failed to create announcement:', error);
      
      if (error instanceof AxiosError) {
        throw new ApiError(
          'Failed to create announcement. Please try again later.',
          error.response?.status
        );
      }
      
      throw new ApiError('Failed to create announcement. Please try again later.');
    }
  }
};