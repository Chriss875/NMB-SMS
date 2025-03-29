import { api } from './api';

export interface UploadedResult {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  downloadUrl?: string;
}

interface ApiResponse {
  message?: string;
  error?: string;
  fileName?: string;
}

export const resultService = {
  /**
   * Upload a result document to the server
   */
  uploadResult: async (file: File): Promise<UploadedResult> => {
    try {
      const formData = new FormData();
      formData.append('file', file); 

      // Updated endpoint 
      const response = await api.post('/results/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data: ApiResponse = response.data;

      if (data.error) {
        throw new Error(data.error);
      }

      // Create UploadedResult from response
      return {
        id: data.fileName || file.name, // Use fileName from response if available
        fileName: data.fileName || file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadDate: new Date().toISOString(),
        downloadUrl: `/results/download/${data.fileName}` // Update when download endpoint is available
      };
    } catch (error) {
      console.error('Error uploading result:', error);
      throw error instanceof Error ? error : new Error('Failed to upload file');
    }
  },

  getUserResults: async (): Promise<UploadedResult[]> => {
    try {
      // Since there's no direct endpoint to get all results, we might need to use a workaround
      // This is a placeholder that would need to be implemented properly
      const response = await api.get('/resultpdf/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching results:', error);
      // Return empty array as fallback
      return [];
    }
  },

  /**
   * Delete a result document
   */
  deleteResult: async (resultId: string): Promise<void> => {
    try {
      // Updated endpoint to match Spring Controller
      const response = await api.delete(`/results/${resultId}`);
      
      const data: ApiResponse = response.data;
      if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error deleting result:', error);
      throw error instanceof Error ? error : new Error('Failed to delete file');
    }
  },
};
