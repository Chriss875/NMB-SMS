import React from 'react';
import AnnouncementCard from './AnnouncementCard';

interface Announcement {
  id: string;
  title: string;
  content: string;
  senderName: string;
  timestamp: Date;
  read: boolean;
}

interface AnnouncementListProps {
  announcements: Announcement[];
  onAnnouncementClick: (id: string) => void;
}

const AnnouncementList: React.FC<AnnouncementListProps> = ({
  announcements,
  onAnnouncementClick,
}) => {
  if (announcements.length === 0) {
    return <div className="text-center py-8 text-gray-500">No announcements yet</div>;
  }

  return (
    <div>
      {announcements.map(announcement => (
        <AnnouncementCard 
          key={announcement.id}
          id={announcement.id}
          title={announcement.title}
          content={announcement.content}
          senderName={announcement.senderName}
          timestamp={announcement.timestamp}
          read={announcement.read}
          onClick={onAnnouncementClick}
        />
      ))}
    </div>
  );
};

export default AnnouncementList;