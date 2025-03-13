// src/services/profileService.ts
import { api } from './api';
import { ProfileData } from '../types/profile.types';

export async function getProfileData(): Promise<ProfileData> {
  const response = await api.get('api/profile');
  return response.data;
}

export async function updateProfileData(data: Partial<ProfileData>): Promise<ProfileData> {
  const response = await api.put('api/profile-info', data);
  return response.data;
}

// You can still export the object if needed elsewhere
export const profileService = {
  getProfileData,
  updateProfileData
};