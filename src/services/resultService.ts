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
  status: string;
  downloadUrl?: string;
}

export interface Results {
  id: string;
  fileName: string;
  filePath: string;
  uploadTime: string;
  fileType: string;
  fileSize: number;
  email: string;
  status: string;
}

interface ApiResponse {
  message?: string;
  error?: string;
  fileName?: string;
}

interface ResultService {
  uploadResult: (file: File) => Promise<UploadedResult>;
  getUserResults: () => Promise<UploadedResult[]>;
  deleteResult: (fileName: string) => Promise<void>;
  getAllResults: () => Promise<Results[]>;
  downloadResult: (fileName: string) => Promise<Blob>;
}

class ResultServiceImpl implements ResultService {
  async uploadResult(file: File): Promise<UploadedResult> {
    try {
      const formData = new FormData();
      formData.append('file', file); 

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
        id: data.fileName || file.name,
        fileName: data.fileName || file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadDate: new Date().toISOString(),
        status: 'Submitted',
        downloadUrl: `/results/download/${data.fileName}`
      };
    } catch (error) {
      console.error('Error uploading result:', error);
      throw error instanceof Error ? error : new Error('Failed to upload file');
    }
  }

  async getUserResults(): Promise<UploadedResult[]> {
    try {
      // Using the correct endpoint from the controller
      const response = await api.get('/results/all');
      
      // Transform the backend Results to UploadedResult format
      return response.data.map((result: Results) => ({
        id: result.id,
        fileName: result.fileName,
        fileSize: result.fileSize,
        fileType: result.fileType || 'application/pdf',
        uploadDate: result.uploadTime,
        status: result.status,
        downloadUrl: `/results/download/${result.fileName}`
      }));
    } catch (error) {
      console.error('Error fetching results:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      // Return empty array as fallback
      return [];
    }
  }

  async deleteResult(fileName: string): Promise<void> {
    try {
      const response = await api.delete(`/results/delete/${fileName}`);
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
      const response = await api.get('/results/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching results:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      throw error;
    }
  }

  async downloadResult(fileName: string): Promise<Blob> {
    try {
      const response = await api.get(`/results/download/${fileName}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new Error('Download failed');
    }
  }
}

export const resultService = new ResultServiceImpl();