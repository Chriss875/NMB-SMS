export interface Announcement {
  id: string;
  title: string;
  content: string;
  senderName: string;
  senderId: string;
  createdAt: Date;
  read: boolean;
}