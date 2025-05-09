import React from "react";
import { Star, Fish } from "lucide-react";
import { cn } from "@/lib/utils";
import { useShop } from "@/contexts/ShopContext";

interface ProgressBarProps {
  currentMinutes: number;
  goalMinutes?: number;
  fishProgress?: number;
  showFocusBar?: boolean;
  showFishBar?: boolean;
  currentMode?: "focus" | "break" | "longBreak";
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentMinutes, 
  goalMinutes = 90,
  fishProgress = 0,
  showFocusBar = true,
  showFishBar = true,
  currentMode = "focus"
}) => {
  // Get active site color from shop context
  const { activeSiteColor } = useShop();

  // Calculate milestone values (at 1/3, 2/3, and full goal)
  const firstMilestone = goalMinutes / 3;
  const secondMilestone = (goalMinutes / 3) * 2;
  const thirdMilestone = goalMinutes;
  
  // Calculate progress percentage (capped at 100%)
  const percentage = Math.min(100, (currentMinutes / goalMinutes) * 100);
  
  // Calculate fish progress
  const FISH_INTERVAL = 25; // minutes
  const fishPercentage = Math.min(100, ((fishProgress % FISH_INTERVAL) / FISH_INTERVAL) * 100);
  const minutesToNextFish = FISH_INTERVAL - (fishProgress % FISH_INTERVAL);
  
  // Determine which milestones have been reached
  const firstReached = currentMinutes >= firstMilestone;
  const secondReached = currentMinutes >= secondMilestone;
  const thirdReached = currentMinutes >= thirdMilestone;
  
  // Derive colors for different modes based on the main theme color
  // Use CSS variables to set mode-specific colors
  const getColorStyle = () => {
    // Default to the primary theme color for focus mode
    if (currentMode === "focus") {
      return {};
    } else if (currentMode === "break") {
      return { "--bar-color": "hsl(var(--primary) / 0.7)" } as React.CSSProperties;
    } else {
      return { "--bar-color": "hsl(var(--primary) / 0.5)" } as React.CSSProperties;
    }
  };
  
  // Dynamic bar color class
  const barColorClass = currentMode === "focus" ? "bg-primary" : "bg-[var(--bar-color)]";
  const fishColorClass = currentMode === "focus" ? "text-primary" : "text-[var(--bar-color)]";
  
  return (
    <div className="space-y-6" style={getColorStyle()}>
      {/* Fish Progress - Now first */}
      {showFishBar && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">
              {minutesToNextFish} minutes until next fish
            </h3>
            <Fish 
              className={cn(
                "w-5 h-5 transition-transform duration-500",
                fishPercentage > 0 ? 'animate-wiggle' : '',
                fishColorClass
              )}
            />
          </div>
          
          <div className="relative h-3 bg-accent rounded-full overflow-hidden">
            <div 
              className={cn("h-full transition-all duration-500 ease-out", barColorClass)}
              style={{ width: `${fishPercentage}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Daily Goal Progress - Now second */}
      {showFocusBar && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Today's Focus</h3>
            <span className="text-sm font-medium">{currentMinutes}/{goalMinutes} min</span>
          </div>
          
          <div className="relative h-3 bg-accent rounded-full overflow-hidden">
            <div 
              className={cn("h-full transition-all duration-500 ease-out", barColorClass)}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Milestones display - Keep at the bottom */}
      {showFocusBar && (
        <div className="flex justify-between mt-4">
          {/* First milestone - 1/3 of goal */}
          <div className="flex flex-col items-center">
            <Star 
              className={cn(
                "w-6 h-6 transition-all duration-300",
                firstReached ? "text-yellow-400 fill-yellow-400 animate-scale-in" : "text-muted-foreground"
              )}
            />
            <span className="text-xs mt-1">{firstMilestone} min</span>
          </div>
          
          {/* Second milestone - 2/3 of goal */}
          <div className="flex flex-col items-center">
            <Star 
              className={cn(
                "w-6 h-6 transition-all duration-300",
                secondReached ? "text-yellow-400 fill-yellow-400 animate-scale-in" : "text-muted-foreground"
              )}
            />
            <span className="text-xs mt-1">{secondMilestone} min</span>
          </div>
          
          {/* Third milestone - full goal */}
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
      )}
    </div>
  );
};
