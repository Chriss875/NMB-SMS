import React from 'react';
import { useAnnouncements } from '../context/AnnouncementContext';
import AnnouncementList from '../components/AnnouncementList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const AnnouncementsPage: React.FC = () => {
  const { announcements, markAnnouncementAsRead, isLoading, error } = useAnnouncements();

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-semibold mb-6">Announcements</h1>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : (
          <AnnouncementList 
            announcements={announcements} 
            onAnnouncementClick={markAnnouncementAsRead}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default AnnouncementsPage;