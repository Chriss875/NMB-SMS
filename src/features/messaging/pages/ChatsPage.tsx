import React, { useState } from 'react';
import { useMessaging } from '../context/MessagingContext';

import ChatHeader from '../components/chats/ChatHeader';
import ChatInput from '../components/chats/ChatInput';
import ChatList from '../components/chats/ChatList';
import DirectMessagesList from '../components/chats/DirectMessagesList';
import GroupChatsList from '../components/chats/GroupChatsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Card } from '../../../components/ui/card';

const ChatsPage: React.FC = () => {
  const { chats, currentChat, setCurrentChat, sendMessage } = useMessaging();
  const [, setChatTab] = useState<'direct' | 'batch' | 'all'>('direct');

  const directMessages = chats.filter(chat => chat.type === 'direct');
  const batchChats = chats.filter(chat => chat.type === 'batch');
  const allBatchesChat = chats.find(chat => chat.type === 'all');

  const handleSendMessage = (content: string) => {
    if (currentChat) {
      sendMessage(content, currentChat.id);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-240px)]">
      <div className="col-span-1 border rounded-lg p-4">
        <Tabs defaultValue="direct" onValueChange={(v) => setChatTab(v as any)}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="direct">Direct Messages</TabsTrigger>
            <TabsTrigger value="batch">Batch Groups</TabsTrigger>
            <TabsTrigger value="all">All Batches</TabsTrigger>
          </TabsList>
          
          <TabsContent value="direct">
            <DirectMessagesList 
              chats={directMessages}
              onChatSelect={setCurrentChat}
              activeChat={currentChat}
            />
          </TabsContent>
          
          <TabsContent value="batch">
            <GroupChatsList 
              chats={batchChats}
              onChatSelect={setCurrentChat}
              activeChat={currentChat}
            />
          </TabsContent>
          
          <TabsContent value="all">
            {allBatchesChat && (
              <Card 
                className={`p-3 cursor-pointer ${
                  currentChat?.id === allBatchesChat.id ? 'bg-blue-50' : ''
                }`} 
                onClick={() => setCurrentChat(allBatchesChat)}
              >
                <div className="font-medium">{allBatchesChat.name}</div>
                <div className="text-sm text-gray-500">All scholarship students</div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="col-span-1 md:col-span-2 border rounded-lg flex flex-col">
        {currentChat ? (
          <>
            <ChatHeader chat={currentChat} />
            <ChatList 
              chatId={currentChat.id} 
              chatType={currentChat.type}
              chatName={currentChat.name || ''}
            />
            <ChatInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsPage;