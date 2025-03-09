// src/components/layout/MainLayout.tsx
import React, { ReactNode, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  
  // Close sidebar when clicking outside on mobile
  const handleBackdropClick = () => {
    if (sidebarMobileOpen) {
      setSidebarMobileOpen(false);
    }
  };
  
  // Toggle sidebar visibility for desktop
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Toggle sidebar for mobile
  const toggleMobileSidebar = () => {
    setSidebarMobileOpen(!sidebarMobileOpen);
  };
  
  return (
    <div className="flex flex-col h-screen">
      <Header onMenuToggle={toggleMobileSidebar} sidebarOpen={false} setSidebarOpen={function (): void {
              throw new Error('Function not implemented.');
          } } />
      
      {/* Backdrop for mobile */}
      {sidebarMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={handleBackdropClick}
        />
      )}
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={window.innerWidth >= 1024 ? sidebarOpen : sidebarMobileOpen} 
          onToggle={toggleSidebar}
        />
        <main className={`flex-1 overflow-y-auto bg-gray-100 lg:ml-0 w-full transition-all duration-300`}>
          <div className="p-4 md:p-6 max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;