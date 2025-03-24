import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const ProfileSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="profile-visibility">Profile Visibility</Label>
          <Switch id="profile-visibility" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="show-enrollment">Show Enrollment Status</Label>
          <Switch id="show-enrollment" defaultChecked />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;