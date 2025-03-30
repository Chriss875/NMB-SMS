import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      {/* Welcome Banner Skeleton */}
      <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
      
      {/* Status Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
      
      {/* Announcements Skeleton */}
      <div className="h-64 bg-gray-200 rounded-lg"></div>
    </div>
  );
};