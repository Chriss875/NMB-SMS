// src/components/layout/Header.tsx
import { Bell, Menu, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    // Redirect happens automatically via protected route
  };
  
  // Generate initials from user name
  const initials = user?.name
    ? user.name.split(' ').map(part => part[0]).join('').toUpperCase()
    : 'U';

  return (
    <header className="bg-[#2844A7] text-white py-2 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onMenuToggle}
          className="p-1 rounded-md hover:bg-[#233a8e] lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-2">
          <img src="/assets/images/nmb-logo.png" alt="NMB Logo" className="h-[75px] w-auto" />
          <h1 className="text-xl font-semibold">Nuru Yangu Scholarship</h1>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Bell className="h-6 w-6 cursor-pointer" />
        <div className="relative group">
          <Avatar className="h-10 w-10 cursor-pointer">
            <AvatarImage src="/profile-image.jpg" alt="Profile" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
            <div className="px-4 py-2 text-sm text-gray-700 border-b">
              {user?.name || 'User'}
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;



