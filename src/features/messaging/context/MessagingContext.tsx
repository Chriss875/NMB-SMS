import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';

interface Announcement {
  id: string;
  title: string;
  content: string;
  senderName: string;
  senderId: string;
  timestamp: Date;
  read: boolean;
}

interface MessagingContextType {
  announcements: Announcement[];
  markAnnouncementAsRead: (id: string) => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    if (user) {
      fetchAnnouncements();
    }
  }, [user]);

  const fetchAnnouncements = async () => {
    // Mock data for now
    const mockAnnouncements: Announcement[] = [
      {
        id: '1',
        title: 'Upcoming Scholarship Event',
        content: 'Please join us for the upcoming scholarship event next Friday.',
        senderName: 'Admin',
        senderId: 'admin1',
        timestamp: new Date(),
        read: false,
      },
      {
        id: '2',
        title: 'Results Published',
        content: 'The scholarship results for this semester have been published.',
        senderName: 'Admin',
        senderId: 'admin1',
        timestamp: new Date(Date.now() - 86400000),
        read: true,
      },
    ];
    
    setAnnouncements(mockAnnouncements);
  };

  const markAnnouncementAsRead = (id: string) => {
    setAnnouncements(currentAnnouncements => 
      currentAnnouncements.map(announcement => 
        announcement.id === id 
          ? { ...announcement, read: true } 
          : announcement
      )
    );
  };

  return (
    <MessagingContext.Provider
      value={{
        announcements,
        markAnnouncementAsRead,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};