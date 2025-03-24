import { useMessaging as useMessagingContext } from '../features/messaging/context/MessagingContext';

export const useMessages = () => {
  const { announcements, markAnnouncementAsRead } = useMessagingContext();

  return {
    announcements,
    markAnnouncementAsRead,
  };
};