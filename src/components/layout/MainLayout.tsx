// src/components/layout/MainLayout.tsx
import React, { ReactNode, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Close sidebar when clicking outside on mobile
  const handleBackdropClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={handleBackdropClick}
        />
      )}
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto bg-gray-100 lg:ml-0 w-full">
          <div className="p-4 md:p-6 max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;