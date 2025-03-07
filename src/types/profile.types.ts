// src/types/profile.types.ts

export interface ProfileData {
    id: string;
    name: string;
    sex: string;
    email: string;
    mobilePhone: string;
    universityName: string;
    universityRegistrationID: string;
    programName: string;
    enrolledYear: string;
    enrollmentStatus: "Active" | "Inactive";
    batchNumber: number;
    profileImage?: string;
  }
  
  // We could also define enums or additional interfaces as needed
  export enum EnrollmentStatus {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
  }
  
  // For future form handling
  export interface ProfileFormData extends Omit<ProfileData, 'id'> {}