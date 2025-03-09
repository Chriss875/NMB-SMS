import React from 'react';
import { cn } from '../../../../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { format } from 'date-fns';

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isMine: boolean;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const initials = message.senderName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className={cn(
        'flex items-start mb-4 gap-2',
        message.isMine ? 'flex-row-reverse' : ''
      )}
    >
      <Avatar className="mt-1">
        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.senderName}`} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col max-w-[70%]">
        <div
          className={cn(
            'px-4 py-2 rounded-lg',
            message.isMine
              ? 'bg-primary text-primary-foreground rounded-tr-none'
              : 'bg-muted rounded-tl-none'
          )}
        >
          <p>{message.content}</p>
        </div>
        <span className={cn(
          'text-xs mt-1 text-muted-foreground',
          message.isMine ? 'text-right' : 'text-left'
        )}>
          {message.isMine ? '' : `${message.senderName} • `}
          {format(message.timestamp, 'h:mm a')}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;