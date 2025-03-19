// src/services/profileService.ts
import { api } from './api';
import { ProfileData } from '../types/profile.types';

export async function getProfileData(): Promise<ProfileData> {
  const response = await api.get('/profile');
  return response.data;
}

export async function updateProfileData(data: Partial<ProfileData>): Promise<ProfileData> {
  // Update to match the backend controller endpoint
  const response = await api.put('/profile/info', data);
  return response.data;
}

// Function for updating avatar specifically
// export async function updateProfileAvatar(file: File): Promise<string> {
//   const formData = new FormData();
//   formData.append('avatar', file);
  
//   const response = await api.put('/profile/avatar', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
  
//   return response.data;
// }

export const profileService = {
  getProfileData,
  updateProfileData,
//   updateProfileAvatar
};