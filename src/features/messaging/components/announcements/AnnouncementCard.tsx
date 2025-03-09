import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';

interface AnnouncementCardProps {
  id: string;
  title: string;
  content: string;
  senderName: string;
  timestamp: Date;
  read: boolean;
  onClick: (id: string) => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  id,
  title,
  content,
  senderName,
  timestamp,
  read,
  onClick,
}) => {
  return (
    <Card 
      className={`mb-4 cursor-pointer ${!read ? 'border-blue-500' : ''}`}
      onClick={() => onClick(id)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {!read && <Badge variant="default">New</Badge>}
        </div>
        <div className="text-sm text-gray-500 flex justify-between mt-1">
          <span>By {senderName}</span>
          <span>{format(timestamp, 'MMM dd, yyyy')}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{content}</p>
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;