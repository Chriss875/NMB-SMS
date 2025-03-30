import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WelcomeBannerProps {
  name: string;
  scholarshipStatus: 'active' | 'inactive';
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ name, scholarshipStatus }) => {
  return (
    <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {name}
            </h2>
            <div className="text-blue-100 flex items-center gap-2">
              <span>Your scholarship status:</span>
              <Badge variant="secondary" className="bg-white/90 text-blue-800">
                {scholarshipStatus === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};