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

export interface Results {
  id: string;
  fileName: string;
  fileType: string;
  filePath: string;
  uploadDate: string;
  fileSize: number;
  email: string;
}

interface ResultService {
  uploadResult: (file: File) => Promise<UploadedResult>;
  getUserResults: () => Promise<UploadedResult[]>;
  deleteResult: (fileName: string) => Promise<void>;
  getAllResults: () => Promise<UploadedResult[]>;
  downloadResult: (resultId: string) => Promise<Blob>; // Add this line
}

class ResultServiceImpl implements ResultService {
  async uploadResult(file: File): Promise<UploadedResult> {
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
  }

  async getUserResults(): Promise<UploadedResult[]> {
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
  }

  async deleteResult(fileName: string): Promise<void> {
    try {
      const response = await api.delete(`/results/delete/${fileName}`);
      const data: ApiResponse = response.data;
      
      if (data.error) {
        throw new Error(data.error);
      }
      
    } catch (error) {
      console.error('Error deleting result:', error);
      throw error instanceof Error ? error : new Error('Failed to delete file');
    }
  }

  async getAllResults(): Promise<Results[]> {
    try {
      const response = await api.get('/results/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching results:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch results');
    }
  }

  async downloadResult(resultId: string): Promise<Blob> {
    const response = await fetch(`/api/results/${resultId}/download`);
    if (!response.ok) {
      throw new Error('Download failed');
    }
    return await response.blob();
  }
}

export const resultService = new ResultServiceImpl();


