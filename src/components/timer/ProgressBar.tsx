
import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentMinutes: number;
  goalMinutes?: number; // Optional with a default in the component
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentMinutes, 
  goalMinutes = 90 // Default if not provided
}) => {
  // Calculate milestone values
  const firstMilestone = goalMinutes / 3;
  const secondMilestone = (goalMinutes / 3) * 2;
  const thirdMilestone = goalMinutes;
  
  // Calculate percentage
  const percentage = Math.min(100, (currentMinutes / goalMinutes) * 100);
  
  // Determine which milestones have been reached
  const firstReached = currentMinutes >= firstMilestone;
  const secondReached = currentMinutes >= secondMilestone;
  const thirdReached = currentMinutes >= thirdMilestone;
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Today's Focus</h3>
        <span className="text-sm font-medium">{currentMinutes}/{goalMinutes} min</span>
      </div>
      
      <div className="relative h-3 bg-accent rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-1000 ease-out" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Milestones - separate from the progress bar */}
      <div className="flex justify-between mt-4">
        <div className="flex flex-col items-center">
          <Star 
            className={cn(
              "w-6 h-6 transition-all duration-300",
              firstReached ? "text-yellow-400 fill-yellow-400 animate-scale-in" : "text-muted-foreground"
            )}
          />
          <span className="text-xs mt-1">{firstMilestone} min</span>
        </div>
        
        <div className="flex flex-col items-center">
          <Star 
            className={cn(
              "w-6 h-6 transition-all duration-300",
              secondReached ? "text-yellow-400 fill-yellow-400 animate-scale-in" : "text-muted-foreground"
            )}
          />
          <span className="text-xs mt-1">{secondMilestone} min</span>
        </div>
        
        <div className="flex flex-col items-center">
          <Star 
            className={cn(
              "w-6 h-6 transition-all duration-300",
              thirdReached ? "text-yellow-400 fill-yellow-400 animate-scale-in" : "text-muted-foreground"
            )}
          />
          <span className="text-xs mt-1">{thirdMilestone} min</span>
        </div>
      </div>
    </div>
  );
};
