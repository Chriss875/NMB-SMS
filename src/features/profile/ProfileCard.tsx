// src/components/features/profile/ProfileCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ProfileData } from 'src/types/profile.types';
import ProfileHeader from './ProfileHeader';
import ProfileInfo from './ProfileInfo';
import { Briefcase, Mail, Phone, School, User2, CalendarDays, GraduationCap, Hash } from 'lucide-react';

interface ProfileCardProps {
  profileData: ProfileData;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profileData }) => {
  return (
    <Card className="w-full">
      <CardHeader className="border-b bg-gray-50/50">
        <ProfileHeader 
          name={profileData.name} 
          imageUrl={profileData.profileImage}
        />
      </CardHeader>
      <CardContent className="p-6">
        {/* Status badge at the top */}
        <div className="mb-6 flex justify-end">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            profileData.enrollmentStatus === 'Active' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${
              profileData.enrollmentStatus === 'Active' 
                ? 'bg-green-500'
                : 'bg-red-500'
            }`} />
            {profileData.enrollmentStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="space-y-6">
            <div className="pb-3 mb-4 border-b">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <ProfileInfo 
                  icon={<User2 className="h-4 w-4 text-gray-500" />}
                  label="Full Name" 
                  value={profileData.name} 
                />
                <ProfileInfo 
                  icon={<Mail className="h-4 w-4 text-gray-500" />}
                  label="Email" 
                  value={profileData.email} 
                />
                <ProfileInfo 
                  icon={<Phone className="h-4 w-4 text-gray-500" />}
                  label="Mobile Phone" 
                  value={profileData.mobilePhone} 
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-6">
            <div className="pb-3 mb-4 border-b">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Academic Information</h3>
              <div className="space-y-4">
                <ProfileInfo 
                  icon={<School className="h-4 w-4 text-gray-500" />}
                  label="University" 
                  value={profileData.universityName} 
                />
                <ProfileInfo 
                  icon={<Hash className="h-4 w-4 text-gray-500" />}
                  label="Registration ID" 
                  value={profileData.universityRegistrationID} 
                />
                <ProfileInfo 
                  icon={<GraduationCap className="h-4 w-4 text-gray-500" />}
                  label="Program" 
                  value={profileData.programName} 
                />
                <ProfileInfo 
                  icon={<Briefcase className="h-4 w-4 text-gray-500" />}
                  label="Batch Number" 
                  value={profileData.batchNumber} 
                />
                <ProfileInfo 
                  icon={<CalendarDays className="h-4 w-4 text-gray-500" />}
                  label="Enrolled Year" 
                  value={profileData.enrolledYear} 
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;