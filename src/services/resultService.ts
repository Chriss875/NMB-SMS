import { api } from './api';
import axios, { AxiosError } from 'axios';
import { ApiErrorResponse } from '../types/api';
import { ApiError } from '@/utils/errors';

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
  deleteResult: (id: string) => Promise<void>;
  getAllResults: () => Promise<Results[]>;
  downloadResult: (resultId: string) => Promise<Blob>;
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

  async deleteResult(id: string): Promise<void> {
    try {
      const response = await api.delete(`/results/delete/${id}`);
      const data = response.data;
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (response.status !== 204 && response.status !== 200) {
        throw new Error(`Failed to delete file (Status: ${response.status})`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        throw new ApiError(
          axiosError.response?.data?.message || 'Failed to delete file',
          axiosError.response?.status,
          axiosError.code
        );
      }
      
      console.error('Unexpected error:', error);
      throw error instanceof Error ? error : new Error('Failed to delete file');
    }
  }

  async getAllResults(): Promise<Results[]> {
    try {
      console.log('Fetching results from API...');
      const response = await api.get('/api/results/all');
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching results:', error);
      throw error;
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


