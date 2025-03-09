import React from 'react';
import { User, Users } from 'lucide-react';

interface ChatHeaderProps {
  chat: {
    id: string;
    type: 'direct' | 'batch' | 'all';
    name?: string;
  };
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat }) => {
  return (
    <div className="border-b p-4 flex items-center">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
        {chat.type === 'direct' ? (
          <User className="h-5 w-5 text-blue-600" />
        ) : (
          <Users className="h-5 w-5 text-blue-600" />
        )}
      </div>
      <div>
        <h3 className="font-medium">{chat.name}</h3>
        <p className="text-sm text-gray-500">
          {chat.type === 'direct' 
            ? 'Direct message' 
            : chat.type === 'batch' 
              ? 'Batch group chat' 
              : 'All batches group chat'}
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;