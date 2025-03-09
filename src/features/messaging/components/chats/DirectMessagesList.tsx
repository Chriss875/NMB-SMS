import React from 'react';
import { Avatar, AvatarFallback } from '../../../../components/ui/avatar';
import { Card } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';

interface Chat {
  id: string;
  type: 'direct' | 'batch' | 'all';
  name?: string;
  unreadCount: number;
  participants: string[];
}

interface DirectMessagesListProps {
  chats: Chat[];
  onChatSelect: (chat: Chat | null) => void;
  activeChat: Chat | null;
}

const DirectMessagesList: React.FC<DirectMessagesListProps> = ({
  chats,
  onChatSelect,
  activeChat,
}) => {
  if (chats.length === 0) {
    return <div className="text-center py-8 text-gray-500">No direct messages yet</div>;
  }

  return (
    <div className="space-y-2">
      {chats.map(chat => {
        // Get initials for the avatar
        const initials = (chat.name || '')
          .split(' ')
          .map(name => name[0])
          .join('')
          .toUpperCase();

        return (
          <Card 
            key={chat.id}
            className={`p-3 cursor-pointer hover:bg-gray-50 ${
              activeChat?.id === chat.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onChatSelect(chat)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{chat.name}</div>
                  <div className="text-sm text-gray-500">Click to view messages</div>
                </div>
              </div>
              {chat.unreadCount > 0 && (
                <Badge variant="default">{chat.unreadCount}</Badge>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default DirectMessagesList;