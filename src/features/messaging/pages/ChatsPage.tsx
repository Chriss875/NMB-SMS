import React, { useState } from 'react';
import { useMessaging } from '../context/MessagingContext';
import ChatHeader from '../components/chats/ChatHeader';
import ChatList from '../components/chats/ChatList';
import DirectMessagesList from '../components/chats/DirectMessagesList';
import GroupChatsList from '../components/chats/GroupChatsList';
import { Card } from '../../../components/ui/card';

const ChatsPage: React.FC = () => {
  const { chats, currentChat, setCurrentChat, sendMessage } = useMessaging();
  const [chatTab, setChatTab] = useState<'direct' | 'batch' | 'all'>('direct');

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
      {/* Chat List Sidebar */}
      <div className="col-span-1 border rounded-lg p-4 bg-white overflow-y-auto">
        <h2 className="text-lg font-medium mb-4">Messages</h2>
        
        <div className="flex space-x-2 mb-4">
          <button 
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              chatTab === 'direct' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setChatTab('direct')}
          >
            Direct
          </button>
          <button 
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              chatTab === 'batch' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setChatTab('batch')}
          >
            Batch
          </button>
          <button 
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              chatTab === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setChatTab('all')}
          >
            All
          </button>
        </div>
        
        <div className="mt-4">
          {chatTab === 'direct' && (
            <DirectMessagesList 
              chats={directMessages}
              onChatSelect={setCurrentChat}
              activeChat={currentChat}
            />
          )}
          
          {chatTab === 'batch' && (
            <GroupChatsList 
              chats={batchChats}
              onChatSelect={setCurrentChat}
              activeChat={currentChat}
            />
          )}
          
          {chatTab === 'all' && allBatchesChat && (
            <Card 
              className={`p-3 cursor-pointer ${
                currentChat?.id === allBatchesChat.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
              }`} 
              onClick={() => setCurrentChat(allBatchesChat)}
            >
              <div className="font-medium">{allBatchesChat.name}</div>
              <div className="text-sm text-gray-500">All scholarship students</div>
            </Card>
          )}
        </div>
      </div>
      
      {/* Chat Content Area */}
      <div className="col-span-1 md:col-span-2 border rounded-lg flex flex-col bg-white">
        {currentChat ? (
          <>
            <ChatHeader chat={currentChat} />
            <div className="flex-1 overflow-hidden">
              <ChatList 
                chatId={currentChat.id} 
                chatType={currentChat.type}
                chatName={currentChat.name || ''}
                onSendMessage={handleSendMessage}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Select a chat to start messaging</h3>
            <p className="text-center text-sm">Choose a conversation from the list to begin chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsPage;