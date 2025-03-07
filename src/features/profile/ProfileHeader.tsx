// src/components/features/profile/ProfileHeader.tsx
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';


interface ProfileHeaderProps {
  name: string;
  imageUrl?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, imageUrl }) => {
  // Create initials from name (e.g., "John Doe" -> "JD")
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-center">
      <Avatar className="h-16 w-16">
        <AvatarImage src={imageUrl} alt={name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="ml-4">
        <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
      </div>
    </div>
  );
};

export default ProfileHeader;