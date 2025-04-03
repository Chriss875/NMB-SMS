import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UploadedResult, resultService } from '../services/resultService';
import { useAuth } from './AuthContext';
import { useUserData } from './UserDataContext';

interface ResultContextType {
  results: UploadedResult[];
  isLoading: boolean;
  error: string | null;
  uploadResult: (file: File) => Promise<UploadedResult>;
  deleteResult: (resultId: string) => Promise<void>;
  downloadResult: (resultId: string) => Promise<Blob>;
  refreshResults: (force?: boolean) => Promise<void>; // Update to accept force parameter
}

const ResultContext = createContext<ResultContextType | undefined>(undefined);

export const ResultProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [results, setResults] = useState<UploadedResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { isLoading: isAppLoading } = useUserData();

  const fetchResults = async (_force = false) => {
    // Skip if the app is already loading data centrally
    if (isAppLoading) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const fetchedResults = await resultService.getAllResults();
      
      const mappedResults = fetchedResults.map(result => ({
        id: result.id,
        fileName: result.fileName,
        fileSize: result.fileSize,
        fileType: result.fileType,
        uploadDate: result.uploadTime,
        status: result.status || 'completed' 
      }));
      
      setResults(mappedResults);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Failed to load your results. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Only fetch once the app's central loading is done
  useEffect(() => {
    if (user && !isAppLoading) {
      fetchResults();
    } else if (!user) {
      setResults([]);
    }
  }, [user, isAppLoading]);

  const uploadResult = async (file: File): Promise<UploadedResult> => {
    try {
      setError(null);
      const uploadedResult = await resultService.uploadResult(file);
      setResults(prevResults => [...prevResults, uploadedResult]);
      return uploadedResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload result document';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteResult = async (resultId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await resultService.deleteResult(resultId);
      setResults(prevResults => prevResults.filter(result => result.id !== resultId));
      // Optionally refresh the list after deletion
      await fetchResults();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete result document';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResult = async (resultId: string): Promise<Blob> => {
    try {
      setError(null);
      return await resultService.downloadResult(resultId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download result document';
      setError(errorMessage);
      throw err;
    }
  };

  return (
    <ResultContext.Provider
      value={{
        results,
        isLoading,
        error,
        uploadResult,
        deleteResult,
        downloadResult,
        refreshResults: (force = false) => fetchResults(force) // Pass through the force parameter
      }}
    >
      {children}
    </ResultContext.Provider>
  );
};

export const useResults = (): ResultContextType => {
  const context = useContext(ResultContext);
  if (context === undefined) {
    throw new Error('useResults must be used within a ResultProvider');
  }
  return context;
};