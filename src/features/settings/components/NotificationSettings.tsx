
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const NotificationSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="announcement-notifications">Announcements</Label>
            <p className="text-sm text-gray-500">Receive notifications for new announcements</p>
          </div>
          <Switch id="announcement-notifications" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="payment-notifications">Payment Updates</Label>
            <p className="text-sm text-gray-500">Get notified about payment status changes</p>
          </div>
          <Switch id="payment-notifications" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="result-notifications">Results</Label>
            <p className="text-sm text-gray-500">Notifications when new results are available</p>
          </div>
          <Switch id="result-notifications" defaultChecked />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;