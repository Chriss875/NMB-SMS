import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UploadedResult, resultService } from '../services/resultService';
import { useAuth } from './AuthContext';

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
  console.log('ResultProvider is rendering');
  const [results, setResults] = useState<UploadedResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  const { user } = useAuth(); // Add this to track user changes

  const fetchResults = async (force = false) => {
    // Implement fetch throttling - only fetch if:
    // 1. We're forced to fetch, or
    // 2. It's been more than 30 seconds since the last fetch, or
    // 3. We've never fetched before
    const now = Date.now();
    if (!force && lastFetchTime && now - lastFetchTime < 30000) {
      console.log('Skipping fetch, too soon since last fetch');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching results...');
      const fetchedResults = await resultService.getAllResults();
      console.log('Fetched results:', fetchedResults);
      
      // Map the results
      const mappedResults = fetchedResults.map(result => ({
        id: result.id,
        fileName: result.fileName,
        fileSize: result.fileSize,
        fileType: result.fileType,
        uploadDate: result.uploadTime,
        status: result.status || 'completed' 
      }));
      
      setResults(mappedResults);
      setLastFetchTime(now);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Failed to load your results. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Only fetch on user change, not on every render
  useEffect(() => {
    if (user) {
      fetchResults();
    } else {
      // Clear results when user logs out
      setResults([]);
    }
  }, [user]); // Only dependency is user, not fetchResults

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

// IMPORTANT: This export is what's missing and causing the error
export const useResults = (): ResultContextType => {
  const context = useContext(ResultContext);
  if (context === undefined) {
    throw new Error('useResults must be used within a ResultProvider');
  }
  return context;
};