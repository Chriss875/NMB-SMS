// src/components/layout/NavigationItem.tsx
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface NavigationItemProps {
  icon: ReactNode;
  label: string;
  to: string;
  active?: boolean;
  badge?: number;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ 
  icon, 
  label, 
  to, 
  active = false, 
  badge 
}) => {
  const showLabel = label.length > 0;
  
  return (
    <li>
      <Link 
        to={to} 
        className={`flex items-center p-3 rounded-lg ${
          active ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
        }`}
        title={!showLabel ? label : undefined}
      >
        <div className="flex items-center justify-between w-full">
          <div className={`flex items-center ${!showLabel && 'justify-center w-full'}`}>
            {icon}
            {showLabel && <span className="ml-3">{label}</span>}
          </div>
          {badge !== undefined && badge > 0 && showLabel && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {badge}
            </span>
          )}
          
          {/* Show badge as dot when collapsed */}
          {badge !== undefined && badge > 0 && !showLabel && (
            <span className="absolute top-2 right-2 h-2 w-2 bg-blue-500 rounded-full"></span>
          )}
        </div>
      </Link>
    </li>
  );
};

export default NavigationItem;

