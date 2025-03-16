
import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentMinutes: number;
  dailyGoalMinutes?: number;
  milestones?: number[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentMinutes,
  dailyGoalMinutes = 90,  // Default 3 milestones of 30 minutes each
  milestones = [30, 60, 90]  // Default milestone positions (in minutes)
}) => {
  // Calculate progress percentage
  const progressPercentage = Math.min((currentMinutes / dailyGoalMinutes) * 100, 100);
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-sm flex justify-between mb-1">
        <span>Today's Focus</span>
        <span className="font-medium">{currentMinutes}/{dailyGoalMinutes} min</span>
      </div>
      
      <div className="h-8 bg-accent/50 rounded-lg relative overflow-hidden">
        {/* Progress fill */}
        <div 
          className="h-full bg-primary transition-all duration-1000 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
        
        {/* Milestone markers with stars */}
        {milestones.map((milestone, index) => {
          const position = (milestone / dailyGoalMinutes) * 100;
          const isReached = currentMinutes >= milestone;
          
          return (
            <div 
              key={index}
              className="absolute top-0 -mt-1 flex flex-col items-center"
              style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
            >
              <Star 
                className={cn(
                  "w-10 h-10 transition-all duration-300", 
                  isReached 
                    ? "text-yellow-400 fill-yellow-400 animate-pulse-soft" 
                    : "text-muted"
                )}
              />
              <div 
                className="h-full w-0.5 bg-background absolute top-2"
                style={{ height: '24px' }}
              />
              <span className="text-xs mt-6">{milestone} min</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
