// src/components/layout/Sidebar.tsx
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import NavigationItem from './NavigationItem';
import { useAuth } from '@/hooks/useAuth';
import { 
  Home, User, FileText, CreditCard, 
  MessageSquare, Users, Settings, LogOut,
  Menu, AlertCircle, Bell, MessageCircle
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  
  // Check if path matches to set active state
  const isActive = (path: string) => currentPath === path;
  
  // Check if path is under a parent route
  const isUnderParent = (parentPath: string) => currentPath.startsWith(parentPath);
  
  // Toggle submenu expansion
  const toggleSubmenu = (menuKey: string) => {
    setExpandedMenus(current => 
      current.includes(menuKey) 
        ? current.filter(item => item !== menuKey)
        : [...current, menuKey]
    );
  };
  
  // Check if menu is expanded
  const isMenuExpanded = (menuKey: string) => expandedMenus.includes(menuKey);
  
  // Close sidebar when clicking outside on mobile
  const promptLogout = () => {
    setShowLogoutConfirm(true);
  };
  
  // Handle actual logout after confirmation
  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
  };
  
  // Cancel logout
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };
  
  return (
    <>
      <aside className={`
        bg-white border-r border-gray-200 flex flex-col 
        fixed lg:static inset-y-0 left-0 z-30 
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'lg:w-20'} 
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-gray-100 mx-auto lg:mx-0"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto pt-2">
          <ul className="px-3 py-2 space-y-1">
            <NavigationItem 
              icon={<Home className="h-5 w-5" />} 
              label={isOpen ? "Home" : ""}
              to={ROUTES.HOME}
              active={isActive(ROUTES.HOME)}
            />
            <NavigationItem 
              icon={<User className="h-5 w-5" />} 
              label={isOpen ? "Profile" : ""}
              to={ROUTES.PROFILE}
              active={isActive(ROUTES.PROFILE)}
            />
            <NavigationItem 
              icon={<FileText className="h-5 w-5" />} 
              label={isOpen ? "Results" : ""}
              to={ROUTES.RESULTS}
              active={isActive(ROUTES.RESULTS)}
            />
            <NavigationItem 
              icon={<CreditCard className="h-5 w-5" />} 
              label={isOpen ? "Payment" : ""}
              to={ROUTES.PAYMENTS}
              active={isActive(ROUTES.PAYMENTS)}
            />

            {/* Messaging with nested items */}
            <li>
              <button 
                className={`w-full flex items-center justify-between p-3 rounded-lg ${
                  isUnderParent(ROUTES.MESSAGING) 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => toggleSubmenu('messaging')}
              >
                <div className={`flex items-center ${!isOpen && 'justify-center w-full'}`}>
                  <MessageSquare className="h-5 w-5" />
                  {isOpen && <span className="ml-3">Messaging</span>}
                </div>
                {isOpen && (
                  <svg 
                    className={`w-4 h-4 transform ${isMenuExpanded('messaging') ? 'rotate-90' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
              
              {/* Submenu items */}
              {(isOpen || isMenuExpanded('messaging')) && (
                <ul className={`mt-0.5 pl-5 space-y-0.5 ${isMenuExpanded('messaging') || isUnderParent(ROUTES.MESSAGING) ? 'block' : 'hidden'}`}>
                  <li>
                    <Link 
                      to={ROUTES.ANNOUNCEMENTS}
                      className={`flex items-center py-2 px-2.5 rounded-md text-sm ${
                        isActive(ROUTES.ANNOUNCEMENTS) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Bell className="h-4 w-4 min-w-[16px]" />
                      {isOpen && <span className="ml-2.5 truncate">Announcements</span>}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to={ROUTES.CHATS}
                      className={`flex items-center py-2 px-2.5 rounded-md text-sm ${
                        isActive(ROUTES.CHATS) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <MessageCircle className="h-4 w-4 min-w-[16px]" />
                      {isOpen && <span className="ml-2.5 truncate">Chats</span>}
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <NavigationItem 
              icon={<Users className="h-5 w-5" />} 
              label={isOpen ? "Career Mentorship" : ""}
              to={ROUTES.MENTORSHIP}
              active={isActive(ROUTES.MENTORSHIP)}
            />
            <NavigationItem 
              icon={<Settings className="h-5 w-5" />} 
              label={isOpen ? "Settings" : ""}
              to={ROUTES.SETTINGS}
              active={isActive(ROUTES.SETTINGS)}
            />
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <Button 
            onClick={promptLogout}
            variant="outline"
            className={`w-full flex items-center justify-center bg-[#667A8A] text-white hover:bg-[#586a78] hover:text-white ${!isOpen && 'lg:justify-center'}`}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {isOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4"
             style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
             onClick={(e) => {
               if (e.target === e.currentTarget) {
                 cancelLogout();
               }
             }}
        >
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Confirm Logout</h3>
                <p className="text-gray-500">
                  Are you sure you want to log out from the NMB Scholarship Portal?
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-3 border-t p-4">
              <Button 
                variant="outline" 
                onClick={cancelLogout}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default Sidebar;