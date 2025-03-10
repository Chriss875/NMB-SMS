import React from 'react';
import { User, Users, MoreVertical, PhoneCall, VideoIcon } from 'lucide-react';
import { Button } from '../../../../components/ui/button';

interface ChatHeaderProps {
  chat: {
    id: string;
    type: 'direct' | 'batch' | 'all';
    name?: string;
  };
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat }) => {
  return (
    <div className="border-b p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 relative">
          {chat.type === 'direct' ? (
            <User className="h-5 w-5 text-blue-600" />
          ) : (
            <Users className="h-5 w-5 text-blue-600" />
          )}
          {chat.type === 'direct' && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          )}
        </div>
        <div>
          <h3 className="font-medium">{chat.name}</h3>
          <p className="text-xs text-gray-500">
            {chat.type === 'direct' 
              ? 'Online' 
              : chat.type === 'batch' 
                ? 'Batch group chat' 
                : 'All batches group chat'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {chat.type === 'direct' && (
          <>
            <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
              <PhoneCall className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
              <VideoIcon className="h-4 w-4" />
            </Button>
          </>
        )}
        <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;