// src/components/features/profile/ProfileInfo.tsx
import React, { ReactNode } from 'react';

interface ProfileInfoProps {
  label: string;
  value: string | number | null | undefined;
  icon?: ReactNode;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ label, value, icon }) => {
  return (
    <div className="group transition-colors duration-200 hover:bg-white rounded-md p-2 -mx-2">
      <div className="text-sm font-medium text-gray-500 mb-1.5 flex items-center">
        {icon && <span className="mr-2 group-hover:text-blue-500 transition-colors duration-200">{icon}</span>}
        {label}
      </div>
      <div className="text-sm text-gray-900 pl-6 font-medium">
        {value !== null && value !== undefined ? value.toString() : 
          <span className="text-gray-400 italic">Not provided</span>
        }
      </div>
    </div>
  );
};

export default ProfileInfo;