// src/components/features/profile/ProfileCard.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileData } from 'src/types/profile.types';
import ProfileHeader from './ProfileHeader';
import ProfileInfo from './ProfileInfo';

interface ProfileCardProps {
  profileData: ProfileData;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profileData }) => {
  return (
    <Card className="w-full shadow-sm">
      <CardContent className="p-6">
        <ProfileHeader 
          name={profileData.name} 
          imageUrl={profileData.profileImage}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Left column */}
          <div className="space-y-4">
            <ProfileInfo label="Name" value={profileData.name} />
            <ProfileInfo label="Sex" value={profileData.sex} />
            <ProfileInfo label="Email" value={profileData.email} />
            <ProfileInfo label="Mobile Phone" value={profileData.mobilePhone} />
            <ProfileInfo label="University Name" value={profileData.universityName} />
          </div>
          
          {/* Right column */}
          <div className="space-y-4">
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-500">Enrollment Status</div>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  profileData.enrollmentStatus === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {profileData.enrollmentStatus}
                </span>
              </div>
            </div>
            
            <ProfileInfo label="Batch Number" value={profileData.batchNumber} />
            <ProfileInfo label="University Registration ID" value={profileData.universityRegistrationID} />
            <ProfileInfo label="Program Name" value={profileData.programName} />
            <ProfileInfo label="Enrolled Year" value={profileData.enrolledYear} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;