// src/components/layout/Sidebar.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import NavigationItem from './NavigationItem';
import { 
  Home, User, FileText, CreditCard, 
  MessageSquare, Users, Settings, LogOut,
  Menu
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Check if path matches to set active state
  const isActive = (path: string) => currentPath === path;
  
  // MockData - In a real app, this would come from an API/context
  const unreadMessages = 1;
  
  return (
    <aside className={`
      bg-white border-r border-gray-200 flex flex-col 
      fixed lg:static inset-y-0 left-0 z-30 
      transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      lg:translate-x-0 transition-transform duration-300 ease-in-out
      ${isOpen ? 'w-64' : 'lg:w-20'} 
    `}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {/* Always show hamburger menu icon */}
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
          <NavigationItem 
            icon={<MessageSquare className="h-5 w-5" />} 
            label={isOpen ? "Messages" : ""}
            to={ROUTES.MESSAGES}
            active={isActive(ROUTES.MESSAGES)}
            badge={unreadMessages}
          />
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
        <button className={`flex items-center justify-center w-full p-2 text-gray-600 hover:bg-gray-100 rounded-lg ${!isOpen && 'lg:justify-center'}`}>
          <LogOut className="h-5 w-5 mr-2" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;