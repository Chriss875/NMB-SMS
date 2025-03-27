import { api } from './api';

export interface NotificationPreferencesDTO {
  receiveAnnouncements: boolean;
  receivePaymentUpdates: boolean;
}

class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const notificationService = {
  
  // Fetches the current notification preferences for the logged-in user from the backend
  getPreferences: async (): Promise<NotificationPreferencesDTO> => {
    try {
      const response = await api.get('/settings/preferences');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Network error occurred';
      console.error('Error fetching notification preferences:', errorMessage);
      throw new ApiError(errorMessage, error.response?.status);
    }
  },

  
  //Update notification preferences for the logged-in user
  updatePreferences: async (preferences: NotificationPreferencesDTO): Promise<NotificationPreferencesDTO> => {
    try {
      const response = await api.post('/settings/update-notifications', preferences);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Network error occurred';
      console.error('Error updating notification preferences:', errorMessage);
      throw new ApiError(errorMessage, error.response?.status);  // Use ApiError consistently
    }
  }
};

export default notificationService;