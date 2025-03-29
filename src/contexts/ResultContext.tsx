import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UploadedResult, resultService } from '../services/resultService';

interface ResultContextType {
  results: UploadedResult[];
  isLoading: boolean;
  error: string | null;
  uploadResult: (file: File) => Promise<UploadedResult>;
  deleteResult: (resultId: string) => Promise<void>;
  downloadResult: (resultId: string) => Promise<Blob>;
  refreshResults: () => Promise<void>;
}


const ResultContext = createContext<ResultContextType | undefined>(undefined);

export const ResultProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  console.log('ResultProvider is rendering');
  const [results, setResults] = useState<UploadedResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedResults = await resultService.getAllResults();
      setResults(fetchedResults.map(result => ({
        id: result.id,
        fileName: result.fileName,
        fileSize: result.fileSize,
        fileType: result.fileType,
        uploadDate: result.uploadDate,
      })));
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Failed to load your results. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

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
      setError(null);
      await resultService.deleteResult(resultId);
      setResults(prevResults => prevResults.filter(result => result.id !== resultId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete result document';
      setError(errorMessage);
      throw err;
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
        refreshResults: fetchResults
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