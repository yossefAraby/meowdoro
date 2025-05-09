import React from "react";
import { Play, Pause, RotateCcw, Coffee, FastForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useShop } from "@/contexts/ShopContext";

interface TimerCircleProps {
  initialMinutes?: number;
  isCountdown?: boolean;
  breakMinutes?: number;
  longBreakMinutes?: number;
  sessionsBeforeLongBreak?: number;
  onTimerComplete?: () => void;
  onTimerUpdate?: (seconds: number) => void;
  onModeChange?: (mode: "focus" | "break" | "longBreak") => void;
  soundUrl?: string;
  
  // External state management
  timeRemaining: number;
  isActive: boolean;
  isCompleted: boolean;
  currentMode: "focus" | "break" | "longBreak";
  completedSessions: number;
  setTimeRemaining: (seconds: number) => void;
  setIsActive: (isActive: boolean) => void;
  setIsCompleted: (isCompleted: boolean) => void;
  setCurrentMode: (mode: "focus" | "break" | "longBreak") => void;
  setCompletedSessions: (sessions: number) => void;
}

export const TimerCircle: React.FC<TimerCircleProps> = ({
  initialMinutes = 25,
  isCountdown = true,
  breakMinutes = 5,
  longBreakMinutes = 15,
  sessionsBeforeLongBreak = 4,
  onTimerComplete,
  onTimerUpdate,
  onModeChange,
  soundUrl,
  
  // External state
    timeRemaining,
    isActive,
    isCompleted,
    currentMode,
    completedSessions,
    setTimeRemaining,
    setIsActive,
    setIsCompleted,
    setCurrentMode,
    setCompletedSessions,
}) => {
  const { addFish } = useShop();
  
  // Start/pause timer
  const toggleTimer = () => {
    if (isCompleted) {
      resetTimer();
    } else {
      setIsActive(!isActive);
    }
  };

  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    setIsCompleted(false);
    
    if (isCountdown) {
      // Reset based on current mode
      if (currentMode === "focus") {
        setTimeRemaining(initialMinutes * 60);
      } else if (currentMode === "break") {
        setTimeRemaining(breakMinutes * 60);
      } else if (currentMode === "longBreak") {
        setTimeRemaining(longBreakMinutes * 60);
      }
    } else {
      // Reset stopwatch to 0
      setTimeRemaining(0);
    }
    
    onTimerUpdate?.(isCountdown ? 
        (currentMode === "focus" ? initialMinutes * 60 : 
         currentMode === "break" ? breakMinutes * 60 : 
         longBreakMinutes * 60) : 0);
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) {
      return "00:00";
    }
    const mins = Math.floor(Math.abs(seconds) / 60);
    const secs = Math.floor(Math.abs(seconds) % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress for the ring
  const calculateProgress = () => {
    if (!isCountdown) {
      return 0; // No progress ring for stopwatch
    }
    
    const totalTime = currentMode === "focus" ? initialMinutes * 60 :
                     currentMode === "break" ? breakMinutes * 60 :
                     longBreakMinutes * 60;
                     
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  // Calculate SVG properties for the ring
  const calculateRing = () => {
    const radius = 90; // SVG coordinate system
    const circumference = 2 * Math.PI * radius;
    const progress = calculateProgress();
    const strokeDashoffset = circumference * (1 - progress / 100);
    
    return {
      strokeDasharray: `${circumference} ${circumference}`,
      strokeDashoffset: strokeDashoffset
    };
  };
  
  const ringStyle = calculateRing();
  
  // Get color based on current mode
  const getModeColor = () => {
    const { activeSiteColor } = useShop();
    
    switch (currentMode) {
      case "focus":
        return "text-primary";
      case "break":
        return "text-primary/70"; // 70% opacity of primary color
      case "longBreak":
        return "text-primary/50"; // 50% opacity of primary color
      default:
        return "text-primary";
    }
  };

  // Add skip session function
  const skipSession = () => {
    if (!isActive) {
      if (currentMode === "focus") {
        const newCompletedSessions = completedSessions + 1;
        setCompletedSessions(newCompletedSessions);
        
        if (newCompletedSessions % sessionsBeforeLongBreak === 0) {
          setCurrentMode("longBreak");
          setTimeRemaining(longBreakMinutes * 60);
        } else {
          setCurrentMode("break");
          setTimeRemaining(breakMinutes * 60);
        }
      } else {
        setCurrentMode("focus");
        setTimeRemaining(initialMinutes * 60);
      }
      setIsCompleted(false);
    }
  };
  
  return (
    <div className="relative w-72 h-72 mx-auto">
      {/* Progress Ring */}
      <svg className="w-full h-full" viewBox="0 0 200 200">
        {/* Background Circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-accent"
        />
        
        {/* Progress Arc */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className={cn(
            "transition-all duration-1000 ease-in-out",
            getModeColor(),
            !isCountdown && "animate-spin-slow" // Add animation for stopwatch
          )}
          style={ringStyle}
          transform="rotate(-90, 100, 100)"
        />
      </svg>
      
      {/* Timer Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-mono font-bold mb-4">
          {formatTime(timeRemaining)}
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          {/* Main Control Button */}
          <Button 
            size="lg"
            className={cn(
              "rounded-full w-16 h-16 p-0 flex items-center justify-center transition-all duration-300",
              isCompleted && "bg-green-500 hover:bg-green-600",
              currentMode === "break" && "bg-primary/70 hover:bg-primary/80",
              currentMode === "longBreak" && "bg-primary/50 hover:bg-primary/60"
            )}
            onClick={toggleTimer}
          >
            {isActive ? (
              <Pause className="w-6 h-6" />
            ) : isCompleted ? (
              <RotateCcw className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </Button>
          
          {/* Additional Controls - Only show when timer is not active */}
          {!isActive && (
            <div className="flex space-x-2">
              {/* Skip Button */}
              {isCountdown && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                        onClick={skipSession}
                    className={cn(
                          "rounded-full transition-all duration-300",
                      currentMode === "focus" ? 
                        "hover:bg-cyan-100 dark:hover:bg-cyan-900" : 
                        "hover:bg-primary/10"
                    )}
                  >
                    {currentMode === "focus" ? (
                        <Coffee className="w-4 h-4" />
                    ) : (
                        <FastForward className="w-4 h-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {currentMode === "focus" ? 
                        "Skip to break" : 
                        "Skip to focus"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
              )}

              {/* Reset Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetTimer}
                      className="rounded-full"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Reset Timer
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
