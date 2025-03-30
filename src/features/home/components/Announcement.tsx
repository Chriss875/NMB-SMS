import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface AnnouncementsCardProps {
  announcements: Announcement[];
  onAnnouncementClick: (id: string) => void;
}

export const AnnouncementsCard: React.FC<AnnouncementsCardProps> = ({
  announcements,
  onAnnouncementClick,
}) => {
  const unreadCount = announcements.filter(a => !a.isRead).length;

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
          {announcements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No announcements yet
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <button
                  key={announcement.id}
                  onClick={() => onAnnouncementClick(announcement.id)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200
                    ${!announcement.isRead 
                      ? 'border border-blue-500 bg-blue-50/40 hover:bg-blue-50'
                      : 'border border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                    } shadow-sm hover:shadow-md`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {announcement.title}
                    </h3>
                    {!announcement.isRead && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                    {announcement.content}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};