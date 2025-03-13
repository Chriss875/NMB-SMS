// src/hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { ProfileData } from '../types/profile.types';
import { profileService } from '../services/profileService';

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await profileService.getProfileData();
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
      const updatedProfile = await profileService.updateProfileData(updatedData);
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
  
  return {
    profile,
    isLoading,
    error,
    refreshProfile: fetchProfile,
    updateProfile
  };
};