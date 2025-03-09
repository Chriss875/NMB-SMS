import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { MessagingProvider } from '../context/MessagingContext';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Bell, MessageSquare } from 'lucide-react';
import MainLayout from '../../../components/layout/MainLayout';

const MessagingLayout: React.FC = () => {
  return (
    <MessagingProvider>
      <MainLayout>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Messaging</h1>
          
          <Tabs defaultValue="announcements" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="announcements" asChild>
                <NavLink to={ROUTES.ANNOUNCEMENTS} className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Announcements</span>
                </NavLink>
              </TabsTrigger>
              <TabsTrigger value="chats" asChild>
                <NavLink to={ROUTES.CHATS} className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Chats</span>
                </NavLink>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="mt-4">
            <Outlet />
          </div>
        </div>
      </MainLayout>
    </MessagingProvider>
  );
};

export default MessagingLayout;