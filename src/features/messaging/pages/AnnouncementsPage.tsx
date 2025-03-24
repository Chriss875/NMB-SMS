import React from 'react';
import { useMessaging } from '../context/MessagingContext';
import AnnouncementList from '../components/announcements/AnnouncementList';

const AnnouncementsPage: React.FC = () => {
  const { announcements, markAnnouncementAsRead } = useMessaging();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Announcements</h2>
      <AnnouncementList 
        announcements={announcements} 
        onAnnouncementClick={markAnnouncementAsRead}
      />
    </div>
  );
};

export default AnnouncementsPage;