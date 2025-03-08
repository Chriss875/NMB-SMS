// src/services/profileService.ts
import { ProfileData } from '../types/profile.types';

// Default mock data as fallback
const defaultMockProfile: ProfileData = {
  id: "default-1",
  name: "Default User",
  sex: "Male", 
  email: "user@example.com",
  mobilePhone: "+255712345678",
  universityName: "University of Technology",
  universityRegistrationID: "2022-04-0001",
  programName: "Computer Engineering",
  enrolledYear: "2022 - 2025",
  enrollmentStatus: "Active",
  batchNumber: 1,
};

// Get profile data from localStorage or use default mock
export const getProfileData = async (): Promise<ProfileData> => {
  try {
    // Check localStorage first
    const storedProfileData = localStorage.getItem('profileData');
    
    if (storedProfileData) {
      // Parse and return stored data
      return JSON.parse(storedProfileData);
    }
    
    // If no stored data, get logged in user email
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Return mock data but with the logged in user's email
      return {
        ...defaultMockProfile,
        email: user.email,
        name: user.name || defaultMockProfile.name
      };
    }
    
    // Fallback to default mock data
    return defaultMockProfile;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return defaultMockProfile;
  }
};

// Update profile data
export const updateProfileData = async (profileData: Partial<ProfileData>): Promise<ProfileData> => {
  try {
    // Get current data
    const currentData = await getProfileData();
    
    // Merge with updates
    const updatedProfile = {
      ...currentData,
      ...profileData
    };
    
    // Store in localStorage
    localStorage.setItem('profileData', JSON.stringify(updatedProfile));
    
    return updatedProfile;
  } catch (error) {
    console.error("Error updating profile data:", error);
    throw error;
  }
};