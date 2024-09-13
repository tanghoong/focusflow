import React from 'react';
import { Activity } from 'lucide-react';

interface RecentActivitiesProps {
  activities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  return (
    <div className="bg-solarized-base02 rounded-lg p-3 mb-4">
      <h2 className="text-lg font-semibold text-solarized-blue mb-2 flex items-center">
        <Activity size={18} className="mr-2" />
        Recent Activities
      </h2>
      <ul className="text-sm">
        {activities.map((activity) => (
          <li key={activity.id} className="flex justify-between items-center py-1 border-b border-solarized-base01 last:border-b-0">
            <span className="text-solarized-base1">{activity.description}</span>
            <span className="text-solarized-base01 text-xs">{activity.timestamp}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivities;