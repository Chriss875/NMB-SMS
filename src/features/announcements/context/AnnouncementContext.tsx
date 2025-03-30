import React, { createContext, useContext, useState, useEffect } from 'react';
import { Announcement } from '../types';
import { announcementService } from '../services/announcementService';

interface AnnouncementContextType {
  announcements: Announcement[];
  markAnnouncementAsRead: (id: string) => void;
  isLoading: boolean;
  error: string | null;
  refreshAnnouncements: () => void;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export const AnnouncementProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await announcementService.getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
      setError('Unable to load announcements at this time. Please try again later.');
      // Set empty array to prevent undefined errors
      setAnnouncements([]);
    } finally {
      setIsLoading(false);
    }
  };

  const markAnnouncementAsRead = async (id: string) => {
    try {
      await announcementService.markAsRead(id);
      setAnnouncements(current =>
        current.map(announcement =>
          announcement.id === id
            ? { ...announcement, read: true }
            : announcement
        )
      );
    } catch (err) {
      console.error('Failed to mark announcement as read:', err);
      // Don't show error to user since this is non-critical
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <AnnouncementContext.Provider
      value={{
        announcements,
        markAnnouncementAsRead,
        isLoading,
        error,
        refreshAnnouncements: fetchAnnouncements
      }}
    >
      {children}
    </AnnouncementContext.Provider>
  );
};

export const useAnnouncements = () => {
  const context = useContext(AnnouncementContext);
  if (context === undefined) {
    throw new Error('useAnnouncements must be used within an AnnouncementProvider');
  }
  return context;
};