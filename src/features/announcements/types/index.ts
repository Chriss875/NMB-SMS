export interface Announcement {
  id: string;
  title: string;
  isRead: boolean;  // Add this property
  content: string;
  senderName: string;
  senderId: string;
  createdAt: Date;
  read: boolean;
}