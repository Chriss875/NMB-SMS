import React, { useState } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-3 mt-auto bg-white">
      <div className="flex items-end gap-2">
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          className="rounded-full h-8 w-8 flex-shrink-0"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="resize-none min-h-[60px] flex-grow"
        />
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          className="rounded-full h-8 w-8 flex-shrink-0"
        >
          <Smile className="h-4 w-4" />
        </Button>
        <Button 
          type="submit" 
          size="icon"
          className="rounded-full h-8 w-8 flex-shrink-0" 
          disabled={!message.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-gray-400 mt-1">Press Enter to send, Shift+Enter for new line</p>
    </form>
  );
};

export default ChatInput;