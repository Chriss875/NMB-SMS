// src/components/features/profile/ProfileInfo.tsx
import React, { ReactNode } from 'react';

interface ProfileInfoProps {
  label: string;
  value: string | number | null | undefined;
  icon?: ReactNode;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ label, value, icon }) => {
  return (
    <div className="group">
      <div className="text-sm font-medium text-gray-500 mb-1 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </div>
      <div className="text-sm text-gray-900 pl-6">
        {value !== null && value !== undefined ? value.toString() : 'Not provided'}
      </div>
    </div>
  );
};

export default ProfileInfo;