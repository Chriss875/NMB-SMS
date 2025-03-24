// src/services/profileService.ts
import { api } from './api';
import { ProfileData } from '../types/profile.types';

export async function getProfileData(): Promise<ProfileData> {
  try {
    // Fix the path to match backend controller
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
      email: data.email,
      phoneNumber: data.mobilePhone, // Map `mobilePhone` to `phoneNumber`
      universityName: data.universityName,
      universityRegistrationId: data.universityRegistrationID, // Map `universityRegistrationID` to `universityRegistrationId`
      courseProgrammeName: data.programName, // Map `programName` to `courseProgrammeName`
      enrolledYear: data.enrolledYear,
      batchNo: data.batchNumber, // Map `batchNumber` to `batchNo`
      sex: data.sex,
      enrollmentStatus: data.enrollmentStatus,
    };

    console.log('Updating profile with data:', backendData);

    // Send the mapped data to the backend

    // Re-fetch to ensure consistency
    return getProfileData();
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