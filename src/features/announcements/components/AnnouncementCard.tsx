import React from 'react';
import { Announcement } from '../types';
import { User, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface AnnouncementCardProps {
  announcement: Announcement;
  onClick: () => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`p-4 border rounded-lg shadow-sm cursor-pointer transition-all duration-200 
        hover:shadow-md hover:border-blue-200 ${!announcement.read ? 'border-blue-500 bg-blue-50/40' : 'border-gray-200'}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-gray-900">{announcement.title}</h3>
        {!announcement.read && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            New
          </Badge>
        )}
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{announcement.content}</p>
      
      <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1.5 text-gray-400" />
            <span className="text-gray-600">{announcement.senderName}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
            <span>{new Date(announcement.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;