// src/components/features/profile/ProfileInfo.tsx
import React from 'react';

interface ProfileInfoProps {
  label: string;
  value: string | number | null | undefined;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ label, value }) => {
  return (
    <div className="mb-4">
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="mt-1 text-sm text-gray-900">
        {value !== null && value !== undefined ? value.toString() : 'Not provided'}
      </div>
    </div>
  );
};

export default ProfileInfo;