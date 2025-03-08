import { api } from './api';

export interface UploadedResult {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  downloadUrl?: string;
}

export const resultService = {
  /**
   * Upload a result document to the server
   */
  uploadResult: async (file: File): Promise<UploadedResult> => {
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Add any additional metadata if needed
      formData.append('fileName', file.name);
      formData.append('fileType', file.type);
      
      // Make API call
      const response = await api.post('/results/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading result:', error);
      throw error;
    }
  },
  
  /**
   * Get all uploaded results for the current user
   */
  getUserResults: async (): Promise<UploadedResult[]> => {
    try {
      const response = await api.get('/results');
      return response.data;
    } catch (error) {
      console.error('Error fetching results:', error);
      throw error;
    }
  },
  
  /**
   * Delete a result by ID
   */
  deleteResult: async (resultId: string): Promise<void> => {
    try {
      await api.delete(`/results/${resultId}`);
    } catch (error) {
      console.error('Error deleting result:', error);
      throw error;
    }
  },
  
  /**
   * Download a result document by ID
   */
  downloadResult: async (resultId: string): Promise<Blob> => {
    try {
      const response = await api.get(`/results/${resultId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading result:', error);
      throw error;
    }
  }
};