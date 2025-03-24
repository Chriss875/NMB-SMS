// src/pages/ProfilePage.tsx
import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import ProfileCard from '@/features/profile/ProfileCard';
import EditProfileForm from '@/features/profile/EditProfileForm';
import { useAuth } from '@/hooks/useAuth';

const ProfilePage: React.FC = () => {
  const { profile, isLoading, error, updateProfile } = useProfile();
  useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Content to render based on state
  const renderContent = () => {
    if (isLoading) {
      return <ProfileSkeleton />;
    }
    
    if (error) {
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading profile data: {error.message}
          </AlertDescription>
        </Alert>
      );
    }
    
    if (!profile) {
      return (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No profile data found. Please refresh or contact support.
          </AlertDescription>
        </Alert>
      );
    }
    
    if (isEditing) {
      return <EditProfileForm 
        profileData={profile} 
        onSave={async (data) => {
          await updateProfile(data);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />;
    }
    
    return (
      <>
        <ProfileCard 
          profileData={profile} 
          onEdit={() => setIsEditing(true)}
        />
      </>
    );
  };
  
  return (
    <MainLayout>
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Profile</h1>
      {renderContent()}
    </MainLayout>
  );
};

// Loading skeleton for profile
const ProfileSkeleton = () => {
  return (
    <div className="w-full rounded-lg border bg-white p-6">
      <div className="flex items-center mb-8">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="ml-4">
          <Skeleton className="h-6 w-40" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={`left-${i}`} className="mb-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-5 w-40" />
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={`right-${i}`} className="mb-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-5 w-40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;