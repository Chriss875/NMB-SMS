import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { format } from 'date-fns';
import { MoreHorizontal, Trash2, Edit, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../components/ui/dropdown-menu';

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isMine: boolean;
  isRead?: boolean;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
}

interface ChatMessageProps {
  message: Message;
  onDeleteMessage?: (messageId: string) => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onDeleteMessage, onEditMessage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showOptions, setShowOptions] = useState(false);
  
  const initials = message.senderName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(message.content);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && onEditMessage) {
      onEditMessage(message.id, editContent);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        'flex items-start mb-4 gap-2 group',
        message.isMine ? 'flex-row-reverse' : ''
      )}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <Avatar className="mt-1">
        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.senderName}`} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col max-w-[70%] relative">
        {message.isMine && showOptions && (
          <div className={cn(
            'absolute -right-10 top-1',
            !message.isMine && 'left-0'
          )}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded-full hover:bg-accent">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyMessage}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy text
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive" 
                  onClick={() => onDeleteMessage && onDeleteMessage(message.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        
        {isEditing ? (
          <div className="mb-1">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary"
              rows={2}
            />
            <div className="flex justify-end gap-2 mt-1">
              <button
                onClick={handleCancelEdit}
                className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'px-4 py-2 rounded-lg',
              message.isMine
                ? 'bg-primary text-primary-foreground rounded-tr-none'
                : 'bg-muted rounded-tl-none'
            )}
          >
            <p>{message.content}</p>
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {message.attachments.map(attachment => (
                  <a 
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs underline"
                  >
                    {attachment.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
        <span className={cn(
          'text-xs mt-1 text-muted-foreground flex items-center gap-1',
          message.isMine ? 'text-right justify-end' : 'text-left'
        )}>
          {message.isMine ? '' : `${message.senderName} • `}
          {format(message.timestamp, 'h:mm a')}
          {message.isRead && message.isMine && (
            <span className="text-xs text-blue-500 ml-1">✓</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;