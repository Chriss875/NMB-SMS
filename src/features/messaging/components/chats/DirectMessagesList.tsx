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
  // Update the empty state
  if (chats.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">No messages yet</p>
        <p className="text-sm text-gray-400">Start a conversation with a student or mentor</p>
      </div>
    );
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