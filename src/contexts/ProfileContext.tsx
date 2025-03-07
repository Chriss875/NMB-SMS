import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { ProfileData } from '../types/profile.types';
import { getProfileData, updateProfileData } from '../services/profileService';

interface ProfileContextType {
  profile: ProfileData | null;
  isLoading: boolean;
  error: Error | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<ProfileData>) => Promise<ProfileData>;
}

export const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  isLoading: false,
  error: null,
  refreshProfile: async () => {},
  updateProfile: async () => ({ id: '', name: '', sex: '', email: '', mobilePhone: '', universityName: '', universityRegistrationID: '', programName: '', enrolledYear: '', enrollmentStatus: 'Active', batchNumber: 0 }),
});

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProfileData();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProfile = async (updatedData: Partial<ProfileData>) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedProfile = await updateProfileData(updatedData);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update profile'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  return (
    <ProfileContext.Provider value={{
      profile,
      isLoading,
      error,
      refreshProfile: fetchProfile,
      updateProfile
    }}>
      {children}
    </ProfileContext.Provider>
  );
};