// src/services/profileService.ts
import { api } from './api';
import { ProfileData } from '../types/profile.types';

export async function getProfileData(): Promise<ProfileData> {
  try {
    // Use the correct path that matches your backend controller
    const response = await api.get('/profile');
    console.log('Profile data received:', response.data);
    
    // Map backend field names to frontend field names
    const mappedData: ProfileData = {
      id: response.data.id?.toString() || '',
      name: response.data.name || '',
      sex: response.data.sex || '',
      email: response.data.email || '',
      mobilePhone: response.data.phoneNumber || '',
      universityName: response.data.universityName || '',
      universityRegistrationID: response.data.universityRegistrationId || '',
      programName: response.data.courseProgrammeName || '',
      enrolledYear: response.data.enrolledYear || '',
      enrollmentStatus: response.data.enrollmentStatus || 'Active',
      batchNumber: response.data.batchNo || 0,
      profileImage: response.data.avatar || undefined
    };
    
    return mappedData;
  } catch (error) {
    console.error('Error fetching profile data:', error);
    throw error;
  }
}

export async function updateProfileData(data: Partial<ProfileData>): Promise<ProfileData> {
  try {
    // Map frontend field names to backend field names
    const backendData = {
      name: data.name,
      sex: data.sex,
      email: data.email,
      phoneNumber: data.mobilePhone,
      universityName: data.universityName,
      universityRegistrationId: data.universityRegistrationID,
      courseProgrammeName: data.programName,
      enrolledYear: data.enrolledYear,
      enrollmentStatus: data.enrollmentStatus,
      batchNo: data.batchNumber,
      avatar: data.profileImage
    };

    // 
    const response = await api.put('/profile/info', {
      profile: backendData  
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Map the response back to frontend format
    return getProfileData(); // Re-fetch to ensure consistency
  } catch (error) {
    console.error('Error updating profile data:', error);
    throw error;
  }
}

// Function for updating avatar specifically
export async function updateProfileAvatar(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.put('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating profile avatar:', error);
    throw error;
  }
}

export const profileService = {
  getProfileData,
  updateProfileData,
  updateProfileAvatar
};