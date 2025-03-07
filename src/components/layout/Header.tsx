// src/components/layout/Header.tsx
import { Bell, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="bg-blue-700 text-white p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onMenuToggle}
          className="p-1 rounded-md hover:bg-blue-600 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-2">
          <img src="/nmb-logo.svg" alt="NMB Logo" className="h-8" />
          <h1 className="text-xl font-semibold">Nuru Yangu Scholarship</h1>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Bell className="h-6 w-6 cursor-pointer" />
        <Avatar className="h-10 w-10 cursor-pointer">
          <AvatarImage src="/profile-image.jpg" alt="Profile" />
          <AvatarFallback>CM</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;



