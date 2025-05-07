
import React from 'react';
import { Clock, CalendarDays } from 'lucide-react';

interface MostProductiveCardProps {
  mostProductiveDay: string;
  mostProductiveTime: string;
}

export const MostProductiveCard: React.FC<MostProductiveCardProps> = ({
  mostProductiveDay,
  mostProductiveTime
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-primary/10 rounded-lg p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <span className="font-medium">Most Productive Day</span>
        </div>
        <div className="text-2xl font-semibold pl-7">{mostProductiveDay}</div>
        <div className="text-xs text-muted-foreground pl-7">
          You complete 40% more tasks than average
        </div>
      </div>
      
      <div className="bg-primary/10 rounded-lg p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <span className="font-medium">Peak Focus Time</span>
        </div>
        <div className="text-2xl font-semibold pl-7">{mostProductiveTime}</div>
        <div className="text-xs text-muted-foreground pl-7">
          Your concentration is 30% higher during this time
        </div>
      </div>
    </div>
  );
};
