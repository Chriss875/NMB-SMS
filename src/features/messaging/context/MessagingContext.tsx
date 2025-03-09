import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';

type ChatType = 'direct' | 'batch' | 'all';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  read: boolean;
}

interface Chat {
  id: string;
  type: ChatType;
  participants: string[];
  name?: string;
  lastMessage?: Message;
  unreadCount: number;
}

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
  chats: Chat[];
  announcements: Announcement[];
  currentChat: Chat | null;
  setCurrentChat: (chat: Chat | null) => void;
  sendMessage: (content: string, chatId: string) => void;
  markAnnouncementAsRead: (id: string) => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  // Fetch chats and announcements on component mount
  useEffect(() => {
    if (user) {
      // Fetch user's chats and announcements from API
      // For now, we'll use mock data
      fetchChats();
      fetchAnnouncements();
    }
  }, [user]);

  const fetchChats = async () => {
    // Mock data for now
    const mockChats: Chat[] = [
      {
        id: '1',
        type: 'direct',
        participants: [user?.id || '', 'user2'],
        name: 'Jane Doe',
        unreadCount: 2,
      },
      {
        id: '2',
        type: 'batch',
        participants: ['batch1-users'],
        name: 'Batch 1 Group',
        unreadCount: 0,
      },
      {
        id: '3',
        type: 'all',
        participants: ['all-users'],
        name: 'All Batches',
        unreadCount: 5,
      },
    ];
    
    setChats(mockChats);
  };

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

  const sendMessage = (content: string, chatId: string) => {
    // In a real app, this would send to an API
    console.log(`Sending message to chat ${chatId}: ${content}`);
    // Then update state with new message
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
        chats,
        announcements,
        currentChat,
        setCurrentChat,
        sendMessage,
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