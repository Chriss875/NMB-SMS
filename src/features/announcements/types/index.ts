export interface Announcement {
  id: string;
  title: string;
  content: string;
  senderName: string;
  senderId: string;
  createdAt: Date;
  read: boolean;
}

export interface AnnouncementResponse {
  announcements: Announcement[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface AnnouncementRequestDTO {
  title: string;
  content: string;
}