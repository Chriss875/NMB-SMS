// src/services/profileService.ts
import { ProfileData } from '../types/profile.types';

// Get profile data
export const getProfileData = async (): Promise<ProfileData> => {
  try {
    // For real implementation:
    // const response = await api.get('/profile');
    // return response.data;
    
    // Mock data for development
    return Promise.resolve({
      id: "1",
      name: "Christopher Mtoi",
      sex: "Male",
      email: "chriss200@gmail.com",
      mobilePhone: "+255712345789",
      universityName: "UDSM",
      universityRegistrationID: "2022-04-0001",
      programName: "Computer Engineering",
      enrolledYear: "2022 - 2025",
      enrollmentStatus: "Active",
      batchNumber: 2,
      profileImage: "/profile-image.jpg"
    });
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw error;
  }
};

// Update profile data
export const updateProfileData = async (profileData: Partial<ProfileData>): Promise<ProfileData> => {
  try {
    // For real implementation:
    // const response = await api.put('/profile', profileData);
    // return response.data;
    
    // Mock implementation
    const currentData = await getProfileData();
    return Promise.resolve({
      ...currentData,
      ...profileData
    });
  } catch (error) {
    console.error("Error updating profile data:", error);
    throw error;
  }
};