import React from 'react';
import { Announcement } from '../types';
import AnnouncementCard from './AnnouncementCard';

interface AnnouncementListProps {
  announcements: Announcement[];
  onAnnouncementClick: (id: string) => void;
}

const AnnouncementList: React.FC<AnnouncementListProps> = ({
  announcements,
  onAnnouncementClick,
}) => {
  if (announcements.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No announcements yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map(announcement => (
        <AnnouncementCard 
          key={announcement.id}
          announcement={announcement}
          onClick={() => onAnnouncementClick(announcement.id)}
        />
      ))}
    </div>
  );
};

export default AnnouncementList;