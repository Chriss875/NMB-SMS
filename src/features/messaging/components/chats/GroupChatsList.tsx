import React from 'react';
import { Users } from 'lucide-react';
import { Card } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';

interface Chat {
  id: string;
  type: 'direct' | 'batch' | 'all';
  name?: string;
  unreadCount: number;
  participants: string[];
}

interface GroupChatsListProps {
  chats: Chat[];
  onChatSelect: (chat: Chat | null) => void;
  activeChat: Chat | null;
}

const GroupChatsList: React.FC<GroupChatsListProps> = ({
  chats,
  onChatSelect,
  activeChat,
}) => {
  if (chats.length === 0) {
    return <div className="text-center py-8 text-gray-500">No group chats available</div>;
  }

  return (
    <div className="space-y-2">
      {chats.map(chat => (
        <Card 
          key={chat.id}
          className={`p-3 cursor-pointer hover:bg-gray-50 ${
            activeChat?.id === chat.id ? 'bg-blue-50' : ''
          }`}
          onClick={() => onChatSelect(chat)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">{chat.name}</div>
                <div className="text-sm text-gray-500">Batch group chat</div>
              </div>
            </div>
            {chat.unreadCount > 0 && (
              <Badge variant="default">{chat.unreadCount}</Badge>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default GroupChatsList;