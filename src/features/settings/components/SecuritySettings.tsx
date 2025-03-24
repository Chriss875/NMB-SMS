import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const SecuritySettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Change Password</h3>
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input type="password" id="current-password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input type="password" id="new-password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input type="password" id="confirm-password" />
          </div>
          <Button>Update Password</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;