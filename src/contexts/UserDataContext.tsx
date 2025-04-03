import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { resultService } from '../services/resultService';
import { profileService } from '../services/profileService';
import { announcementService } from '../features/announcements/services/announcementService';
import { paymentService } from '../services/paymentService';

interface UserDataContextType {
  isLoading: boolean;
  error: string | null;
  refreshUserData: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const loadAllUserData = async () => {
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Add a timeout to prevent infinite loading
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Data loading timeout after 15 seconds'));
      }, 15000); // 15 second timeout
    });

    try {
      // Race the data loading against a timeout
      await Promise.race([
        Promise.all([
          // Wrap each API call to prevent one failure from failing all
          loadDataSafely(() => resultService.getAllResults(), 'results'),
          loadDataSafely(() => profileService.getProfileData(), 'profile'),
          loadDataSafely(() => announcementService.getAnnouncements(), 'announcements'),
          loadDataSafely(() => paymentService.getPayments(), 'payments'),
          // Add other data loading services as needed
        ]),
        timeoutPromise
      ]);
      
      console.log('All user data loaded successfully');
    } catch (err) {
      console.error('Error loading user data:', err);
      setError(err instanceof Error 
        ? `Data loading error: ${err.message}` 
        : 'Failed to load user data. Please refresh or try again later.');
    } finally {
      // Always set loading to false to prevent stuck state
      setIsLoading(false);
    }
  };

  // Helper function to load data with individual error handling
  const loadDataSafely = async <T,>(
    loadFn: () => Promise<T>, 
    dataType: string
  ): Promise<T | null> => {
    try {
      return await loadFn();
    } catch (err) {
      console.error(`Error loading ${dataType} data:`, err);
      // Don't throw - this way one service failing won't block others
      return null;
    }
  };

  // Load data when user authentication changes
  useEffect(() => {
    let isMounted = true;
    
    const initializeData = async () => {
      if (isAuthenticated && user) {
        await loadAllUserData();
      } else {
        setIsLoading(false);
      }
    };
    
    initializeData();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user]);

  const refreshUserData = async () => {
    await loadAllUserData();
  };

  return (
    <UserDataContext.Provider
      value={{
        isLoading,
        error,
        refreshUserData
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

// Export the hook as a named export
export const useUserData = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};