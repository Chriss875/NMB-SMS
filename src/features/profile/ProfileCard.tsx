// src/components/features/profile/ProfileCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProfileData } from 'src/types/profile.types';
import ProfileHeader from './ProfileHeader';
import ProfileInfo from './ProfileInfo';
import { Briefcase, Mail, Phone, School, User2, CalendarDays, GraduationCap, Hash, PenSquare } from 'lucide-react';

interface ProfileCardProps {
  profileData: ProfileData;
  onEdit?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profileData, onEdit }) => {
  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-gray-100/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ProfileHeader 
              name={profileData.name} 
              imageUrl={profileData.profileImage}
            />
            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 ${
              profileData.enrollmentStatus === 'Active' 
                ? 'bg-green-50 text-green-700 border border-green-200 shadow-sm hover:bg-green-100' 
                : 'bg-red-50 text-red-700 border border-red-200 shadow-sm hover:bg-red-100'
            }`}>
              <span className={`w-2.5 h-2.5 rounded-full mr-2 animate-pulse ${
                profileData.enrollmentStatus === 'Active' 
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`} />
              {profileData.enrollmentStatus}
            </span>
          </div>
          <Button
            onClick={onEdit}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <PenSquare className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Personal Information */}
          <div className="space-y-6">
            <div className="pb-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <User2 className="h-5 w-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
              <div className="space-y-5 bg-gray-50 p-4 rounded-lg">
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
            <div className="pb-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <School className="h-5 w-5 mr-2 text-blue-600" />
                Academic Information
              </h3>
              <div className="space-y-5 bg-gray-50 p-4 rounded-lg">
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