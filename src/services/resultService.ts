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
      // The backend expects the file with parameter name "result"
      const formData = new FormData();
      formData.append('result', file);
      
      // Make API call to the correct endpoint
      const response = await api.post('/resultpdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Transform the response to match our UploadedResult interface
      // Since backend returns just a string response, we'll create an object with filename
      return {
        id: file.name, // Using filename as ID since backend uses filename as identifier
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadDate: new Date().toISOString(),
        downloadUrl: `/api/resultpdf/${file.name}`
      };
    } catch (error) {
      console.error('Error uploading result:', error);
      throw error;
    }
  },
  
  /**
   * Get all uploaded results for the current user
   * Note: The backend doesn't seem to have a direct endpoint for listing all results
   * This might need to be implemented on the backend or the frontend may need to store this info
   */
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
   * Delete a result by filename
   */
  deleteResult: async (resultId: string): Promise<void> => {
    try {
      // Backend uses filename as the identifier for deletion
      await api.delete(`/resultpdf/${resultId}`);
    } catch (error) {
      console.error('Error deleting result:', error);
      throw error;
    }
  },
  
  /**
   * Download a result document by filename
   */
  downloadResult: async (resultId: string): Promise<Blob> => {
    try {
      // Backend uses filename to retrieve the file
      const response = await api.get(`/resultpdf/${resultId}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading result:', error);
      throw error;
    }
  }
};