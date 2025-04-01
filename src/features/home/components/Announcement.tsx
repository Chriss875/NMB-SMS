import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Announcement } from '@/features/announcements/types';

interface AnnouncementsCardProps {
  announcements: Announcement[];
  onAnnouncementClick: (id: string) => void;
  loading?: boolean;
}

export const AnnouncementsCard: React.FC<AnnouncementsCardProps> = ({
  announcements,
  onAnnouncementClick,
  loading = false
}) => {
  const unreadCount = announcements.filter(a => !a.read).length;

  const renderAnnouncementContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      );
    }

    if (announcements.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No announcements yet
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <button
            key={announcement.id}
            onClick={() => onAnnouncementClick(announcement.id)}
            className={`w-full text-left p-4 rounded-lg transition-all duration-200
              ${!announcement.read 
                ? 'border border-blue-500 bg-blue-50/40 hover:bg-blue-50'
                : 'border border-gray-200 hover:border-blue-200 hover:bg-gray-50'
              } shadow-sm hover:shadow-md`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900">
                {announcement.title}
              </h3>
              {!announcement.read && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                  New
                </Badge>
              )}
            </div>
            <p className="text-gray-600 text-sm line-clamp-2 mb-2">
              {announcement.content}
            </p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{announcement.senderName}</span>
              <span>
                {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-blue-600" />
            Recent Announcements
          </div>
          <Badge variant="outline" className="ml-2">
            {unreadCount} new
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {renderAnnouncementContent()}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};