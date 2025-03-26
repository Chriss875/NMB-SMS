import { api } from './api';

export interface SecurityDTO {
  currentPassword: string;
  newPassword: string;
}

export const securityService = {
  /**
   * Changes the user's password
   */
  changePassword: async (data: SecurityDTO): Promise<string> => {
    try {
      const response = await api.post('/settings/security', data);
      return response.data;
    } catch (error: any) {
      console.error('Error changing password:', error);
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  }
};

export default securityService;