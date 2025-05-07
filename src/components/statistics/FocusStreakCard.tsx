
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame } from 'lucide-react';

interface FocusStreakCardProps {
  currentStreak: number;
  bestStreak: number;
}

export const FocusStreakCard: React.FC<FocusStreakCardProps> = ({ 
  currentStreak, 
  bestStreak 
}) => {
  const progressValue = (currentStreak / bestStreak) * 100;
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1 items-center">
        <div className="text-5xl font-bold flex items-center gap-2">
          <Flame className="h-8 w-8 text-primary fill-primary" />
          {currentStreak}
        </div>
        <div className="text-sm text-muted-foreground">days in a row</div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Current streak</span>
          <span className="font-medium">{currentStreak} days</span>
        </div>
        <Progress value={progressValue} className="h-2" />
        <div className="flex justify-between text-sm">
          <span className="text-xs text-muted-foreground">Personal best</span>
          <span className="text-xs text-muted-foreground">{bestStreak} days</span>
        </div>
      </div>
      
      <div className="bg-primary/10 rounded-lg p-3 text-xs">
        <p className="font-medium">Keep it up!</p>
        <p className="text-muted-foreground mt-1">
          Focus for at least 25 minutes daily to maintain your streak.
        </p>
      </div>
    </div>
  );
};
