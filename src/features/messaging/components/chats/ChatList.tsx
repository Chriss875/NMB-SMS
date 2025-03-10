import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { PaperclipIcon, SendIcon } from 'lucide-react';
import ChatMessage, { Message } from './ChatMessage';
import { useAuth } from '../../../../hooks/useAuth';
import NewMessageDialog from './NewMessageDialog';

interface ChatListProps {
  chatId: string;
  chatType: 'personal' | 'group';
  onSendMessage: (message: string) => void;
}

// Enhanced mock data with more messages and features
const mockMessages: Message[] = [
  {
    id: 'msg1',
    content: 'Hello there! How are you doing today?',
    senderId: 'user2',
    senderName: 'Jane Doe',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    isMine: false,
    isRead: true,
  },
  {
    id: 'msg2',
    content: 'I\'m doing well, thanks for asking! How about you?',
    senderId: 'currentUser',
    senderName: 'John Doe',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 10), // 10 minutes later
    isMine: true,
    isRead: true,
  },
  {
    id: 'msg3',
    content: 'Great! I wanted to check if you\'ve submitted your monthly progress report?',
    senderId: 'user2',
    senderName: 'Jane Doe',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isMine: false,
    isRead: true,
  },
  {
    id: 'msg4',
    content: 'Yes, I sent it yesterday. You should have received it by email.',
    senderId: 'currentUser',
    senderName: 'John Doe',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
    isMine: true,
    isRead: true,
  },
  {
    id: 'msg5',
    content: 'Here\'s also the presentation for next week\'s meeting.',
    senderId: 'currentUser',
    senderName: 'John Doe',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22), // 22 hours ago
    isMine: true,
    isRead: true,
    attachments: [
      {
        id: 'attachment1',
        name: 'Quarterly_Presentation.pdf',
        url: '#',
        type: 'application/pdf',
      }
    ]
  },
  {
    id: 'msg6',
    content: 'Perfect! Let me know if you need any help preparing for the presentation.',
    senderId: 'user2',
    senderName: 'Jane Doe',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isMine: false,
    isRead: true,
  },
  {
    id: 'msg7',
    content: 'Will do. Thanks for your support!',
    senderId: 'currentUser',
    senderName: 'John Doe',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isMine: true,
    isRead: false,
  }
];

const ChatList: React.FC<ChatListProps> = ({ chatId, chatType, onSendMessage }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAttaching, setIsAttaching] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isNewMessageDialogOpen, setIsNewMessageDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Load messages
  useEffect(() => {
    // In a real app, you would fetch messages from the API based on chatId
    setMessages(mockMessages);
  }, [chatId, chatType]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() && attachments.length === 0) return;
    
    // Create attachment objects
    const messageAttachments = attachments.map((file, index) => ({
      id: `attachment-${Date.now()}-${index}`,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    }));

    const newMessage: Message = {
      id: `local-${Date.now()}`,
      content: inputMessage,
      senderId: 'currentUser',
      senderName: 'John Doe', // In a real app, this would be the current user's name
      timestamp: new Date(),
      isMine: true,
      isRead: false,
      attachments: messageAttachments.length > 0 ? messageAttachments : undefined,
    };

    setMessages([...messages, newMessage]);
    onSendMessage(inputMessage);
    setInputMessage('');
    setAttachments([]);
    
    // In a real app, you would send this message to your API
    // and then update the UI when it's successfully sent
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(message => message.id !== messageId));
    // In a real app, you would also send a delete request to your API
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    setMessages(messages.map(message => 
      message.id === messageId 
        ? { ...message, content: newContent }
        : message
    ));
    // In a real app, you would also send an update request to your API
  };

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachments(prevAttachments => [...prevAttachments, ...Array.from(e.target.files!)]);
    }
  };

  const handleCreateNewChat = (userId: string, userName: string) => {
    console.log(`Creating new chat with ${userName} (${userId})`);
    // In a real app, you would create a new chat and navigate to it
    // For now, we'll just close the dialog
    setIsNewMessageDialogOpen(false);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const renderMessages = () => {
    let lastDate = '';
    
    return messages.map((message) => {
      const messageDate = format(message.timestamp, 'PPP');
      const showDateDivider = messageDate !== lastDate;
      
      if (showDateDivider) {
        lastDate = messageDate;
        
        return (
          <React.Fragment key={message.id}>
            <div className="my-4 flex items-center justify-center">
              <div className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
                {messageDate}
              </div>
            </div>
            <ChatMessage 
              message={message} 
              onDeleteMessage={handleDeleteMessage}
              onEditMessage={handleEditMessage}
            />
          </React.Fragment>
        );
      }
      
      return (
        <ChatMessage 
          key={message.id} 
          message={message} 
          onDeleteMessage={handleDeleteMessage}
          onEditMessage={handleEditMessage}
        />
      );
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center border-b p-3">
        <div className="font-semibold">
          {chatType === 'personal' ? 'Direct Message' : 'Group Chat'}
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsNewMessageDialogOpen(true)}
        >
          New Message
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {renderMessages()}
        <div ref={messageEndRef} />
      </div>
      
      {attachments.length > 0 && (
        <div className="px-4 py-2 flex gap-2 flex-wrap">
          {attachments.map((file, index) => (
            <div 
              key={index} 
              className="bg-muted text-xs px-2 py-1 rounded-full flex items-center gap-1"
            >
              <span>{file.name.length > 20 ? `${file.name.substring(0, 17)}...` : file.name}</span>
              <button 
                onClick={() => removeAttachment(index)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="border-t p-3 flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleAttachFile}
        >
          <PaperclipIcon className="h-5 w-5" />
        </Button>
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button 
          disabled={!inputMessage.trim() && attachments.length === 0} 
          onClick={handleSendMessage}
        >
          <SendIcon className="h-5 w-5" />
        </Button>
      </div>

      <NewMessageDialog
        isOpen={isNewMessageDialogOpen}
        onClose={() => setIsNewMessageDialogOpen(false)}
        onCreateChat={handleCreateNewChat}
      />
    </div>
  );
};

export default ChatList;