import { api } from '@/services/api';
import { Announcement } from '../types';
import { ApiError } from '@/utils/errors';
import { AxiosError } from 'axios';

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
  getAnnouncements: async (): Promise<Announcement[]> => {
    try {
      const response = await api.get('/announcements');
      
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('Invalid response format from announcements API');
        return MOCK_ANNOUNCEMENTS;
      }
      
      return response.data;
    } catch (error) {
      console.warn('Falling back to mock data:', error);
      return MOCK_ANNOUNCEMENTS;
    }
  },

  markAsRead: async (id: string): Promise<void> => {
    try {
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

  createAnnouncement: async (data: Omit<Announcement, 'id' | 'timestamp' | 'read'>): Promise<Announcement> => {
    try {
      const response = await api.post('/announcements', data);
      
      if (!response.data || !response.data.id) {
        throw new ApiError('Invalid response from create announcement API');
      }
      
      return response.data;
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