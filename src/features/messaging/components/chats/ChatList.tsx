import React, { useEffect, useState } from 'react';

import ChatInput from './ChatInput';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import ChatMessage from './ChatMessage';

// Define a Message interface for our chat messages
interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isMine: boolean;
}

// Mock data - in a real app, this would come from an API
const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hey, how are you doing with the scholarship project?',
    senderId: 'user2',
    senderName: 'Jane Doe',
    timestamp: new Date(Date.now() - 3600000),
    isMine: false,
  },
  {
    id: '2',
    content: 'I\'m making good progress! Just need to finish the final report.',
    senderId: 'currentUser',
    senderName: 'John Doe',
    timestamp: new Date(Date.now() - 3500000),
    isMine: true,
  },
  {
    id: '3',
    content: 'That\'s great! Do you need any help with it?',
    senderId: 'user2',
    senderName: 'Jane Doe',
    timestamp: new Date(Date.now() - 3400000),
    isMine: false,
  },
  {
    id: '4',
    content: 'I might need some feedback on the methodology section. Could you review it when I\'m done?',
    senderId: 'currentUser',
    senderName: 'John Doe',
    timestamp: new Date(Date.now() - 3300000),
    isMine: true,
  },
];

interface ChatListProps {
  chatId: string;
  chatType: 'direct' | 'batch' | 'all';
  chatName: string;
}

const ChatList: React.FC<ChatListProps> = ({ chatId, chatType, chatName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messageEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real app, this would fetch messages from an API based on chatId and chatType
    setMessages(mockMessages);
  }, [chatId, chatType]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `local-${Date.now()}`,
      content,
      senderId: 'currentUser',
      senderName: 'John Doe', // In a real app, this would be the current user's name
      timestamp: new Date(),
      isMine: true,
    };

    setMessages([...messages, newMessage]);
    
    // In a real app, you would send this message to your API
    // and then update the UI when it's successfully sent
  };

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 font-medium flex items-center">
        <span>{chatName}</span>
        <span className="ml-2 text-xs px-2 py-1 rounded-full bg-muted">
          {chatType === 'direct' ? 'Direct Message' : 
           chatType === 'batch' ? 'Batch Group' : 'All Batches'}
        </span>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messageEndRef} />
        </div>
      </ScrollArea>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatList;