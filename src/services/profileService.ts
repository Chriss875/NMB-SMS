// src/services/profileService.ts
import { api } from './api';
import { ProfileData } from '../types/profile.types';

export async function getProfileData(): Promise<ProfileData> {
  try {
   
    const response = await api.get('/profile');
    
    
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
    };
    
    return mappedData;
  } catch (error) {
    console.error('Error fetching profile data:', error);
    throw error;
  }
}

export async function updateProfileData(data: Partial<ProfileData>): Promise<ProfileData> {
  try {
    // Map frontend field names to backend field names and ensure all required fields
    const backendData = {
      name: data.name,
      email: data.email,
      phoneNumber: data.mobilePhone,
      universityName: data.universityName,
      universityRegistrationId: data.universityRegistrationID,
      courseProgrammeName: data.programName,
      enrolledYear: data.enrolledYear || '',
      batchNo: Number(data.batchNumber) || 0, // Convert to number and provide default
      sex: data.sex || '',
      enrollmentStatus: data.enrollmentStatus || 'Active'
    };

    console.log('Sending profile update data:', backendData);

    const response = await api.put('/profile/info', backendData);
    
    if (response.status === 200) {
      console.log('Profile updated successfully:', response.data);
      // Re-fetch to ensure consistency
      return await getProfileData();
    } else {
      throw new Error(response.data?.message || 'Failed to update profile');
    }
  } catch (error: any) {
    console.error('Error updating profile data:', error);
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
}

export const profileService = {
  getProfileData,
  updateProfileData,
};