import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import notificationService, { NotificationPreferencesDTO } from '@/services/notificationService';

const NotificationSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPreferencesDTO>({
    receiveAnnouncements: true,
    receivePaymentUpdates: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await notificationService.getPreferences();
      setPreferences(data);
    } catch (err: any) {
      console.error('Failed to fetch notification preferences:', err);
      setError('Failed to load notification preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreference = async (key: keyof NotificationPreferencesDTO, value: boolean, retryCount = 0) => {
    try {
      setError(null);
      setSuccess(null);
      
      // Optimistically update UI
      const updatedPreferences = {
        ...preferences,
        [key]: value
      };
      
      setPreferences(updatedPreferences);
      
      // Send update to server
      await notificationService.updatePreferences(updatedPreferences);
      
      setSuccess('Notification preferences updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error('Failed to update notification preferences:', err);
      
      // If it's a concurrent modification issue and we haven't retried too many times
      if (err.name === 'ApiError' && 
          err.message.includes('modified elsewhere') && 
          retryCount < 2) {
        // Refetch and retry
        await fetchPreferences();
        return updatePreference(key, value, retryCount + 1);
      }
      
      setError('Failed to update notification preferences');
      
      // Revert optimistic update on error
      fetchPreferences();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <p className="text-sm text-gray-500 italic">Loading preferences...</p>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="announcement-notifications">Announcements</Label>
                <p className="text-sm text-gray-500">Receive notifications for new announcements</p>
              </div>
              <Switch 
                id="announcement-notifications" 
                checked={preferences.receiveAnnouncements}
                disabled={isLoading}
                onCheckedChange={(checked) => updatePreference('receiveAnnouncements', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="payment-notifications">Payment Updates</Label>
                <p className="text-sm text-gray-500">Get notified about payment status changes</p>
              </div>
              <Switch 
                id="payment-notifications" 
                checked={preferences.receivePaymentUpdates}
                onCheckedChange={(checked) => updatePreference('receivePaymentUpdates', checked)}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;