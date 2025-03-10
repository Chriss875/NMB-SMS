import React from 'react';
import { Outlet } from 'react-router-dom';
import { MessagingProvider } from '../context/MessagingContext';
import MainLayout from '../../../components/layout/MainLayout';

const MessagingLayout: React.FC = () => {
  return (
    <MessagingProvider>
      <MainLayout>
        <div className="container mx-auto p-4">
          <Outlet />
        </div>
      </MainLayout>
    </MessagingProvider>
  );
};

export default MessagingLayout;