
import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Coffee, FastForward, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface TimerCircleProps {
  initialMinutes?: number;
  isCountdown?: boolean;
  breakMinutes?: number;
  longBreakMinutes?: number;
  sessionsBeforeLongBreak?: number;
  onTimerComplete?: () => void;
  onTimerUpdate?: (seconds: number) => void;
  onModeChange?: (mode: "focus" | "break" | "longBreak") => void;
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
}) => {
  const [timeRemaining, setTimeRemaining] = useState(isCountdown ? initialMinutes * 60 : 0);
  const [initialTime, setInitialTime] = useState(isCountdown ? initialMinutes * 60 : 0);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentMode, setCurrentMode] = useState<"focus" | "break" | "longBreak">("focus");
  const [completedSessions, setCompletedSessions] = useState(0);
  
  const intervalRef = useRef<number | null>(null);
  
  // Update initial time when mode changes
  useEffect(() => {
    if (currentMode === "focus") {
      setInitialTime(initialMinutes * 60);
      setTimeRemaining(initialMinutes * 60);
    } else if (currentMode === "break") {
      setInitialTime(breakMinutes * 60);
      setTimeRemaining(breakMinutes * 60);
    } else if (currentMode === "longBreak") {
      setInitialTime(longBreakMinutes * 60);
      setTimeRemaining(longBreakMinutes * 60);
    }
    
    if (onTimerUpdate) onTimerUpdate(timeRemaining);
    if (onModeChange) onModeChange(currentMode);
  }, [currentMode, initialMinutes, breakMinutes, longBreakMinutes]);
  
  // Reset timer when countdown mode changes
  useEffect(() => {
    resetTimer();
  }, [isCountdown]);
  
  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining(prev => {
          // For countdown timer
          if (isCountdown) {
            const newTime = prev - 1;
            
            // Check if timer is completed
            if (newTime <= 0) {
              clearInterval(intervalRef.current!);
              setIsActive(false);
              setIsCompleted(true);
              
              // Handle session completion based on current mode
              if (currentMode === "focus") {
                const newCompletedSessions = completedSessions + 1;
                setCompletedSessions(newCompletedSessions);
                
                // Determine if next break should be a long break
                if (newCompletedSessions % sessionsBeforeLongBreak === 0) {
                  setCurrentMode("longBreak");
                } else {
                  setCurrentMode("break");
                }
              } else {
                // After break or long break, go back to focus mode
                setCurrentMode("focus");
              }
              
              if (onTimerComplete) onTimerComplete();
              return 0;
            }
            
            if (onTimerUpdate) onTimerUpdate(newTime);
            return newTime;
          } 
          // For stopwatch
          else {
            const newTime = prev + 1;
            if (onTimerUpdate) onTimerUpdate(newTime);
            return newTime;
          }
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isCountdown, currentMode, completedSessions, onTimerComplete, onTimerUpdate]);
  
  const toggleTimer = () => {
    if (isCompleted) {
      resetTimer();
    } else {
      setIsActive(!isActive);
    }
  };

  const skipToBreak = () => {
    if (currentMode === "focus") {
      // Skip the current focus session and move to break
      setIsActive(false);
      clearInterval(intervalRef.current!);
      
      // Determine if we should take a long break
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);
      
      if (newCompletedSessions % sessionsBeforeLongBreak === 0) {
        setCurrentMode("longBreak");
      } else {
        setCurrentMode("break");
      }
    } else {
      // Skip the current break and go back to focus
      setIsActive(false);
      clearInterval(intervalRef.current!);
      setCurrentMode("focus");
    }
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setIsCompleted(false);
    
    // Reset time based on current mode
    if (currentMode === "focus") {
      setTimeRemaining(isCountdown ? initialMinutes * 60 : 0);
    } else if (currentMode === "break") {
      setTimeRemaining(breakMinutes * 60);
    } else if (currentMode === "longBreak") {
      setTimeRemaining(longBreakMinutes * 60);
    }
    
    if (onTimerUpdate) {
      onTimerUpdate(isCountdown ? 
        (currentMode === "focus" ? initialMinutes * 60 : 
         currentMode === "break" ? breakMinutes * 60 : 
         longBreakMinutes * 60) : 0);
    }
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const progress = isCountdown 
    ? ((initialTime - timeRemaining) / initialTime) * 100
    : 0; // For stopwatch, we don't show progress in the circle
  
  // Calculate the SVG arc path
  const calculateArc = () => {
    const radius = 90; // SVG coordinate system
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress / 100);
    
    return {
      strokeDasharray: `${circumference} ${circumference}`,
      strokeDashoffset: strokeDashoffset
    };
  };
  
  const arcStyle = calculateArc();
  
  // Get color based on current mode
  const getModeColor = () => {
    switch (currentMode) {
      case "focus":
        return "text-primary";
      case "break":
        return "text-cyan-500";
      case "longBreak":
        return "text-amber-500";
      default:
        return "text-primary";
    }
  };
  
  return (
    <div className="relative w-72 h-72 mx-auto">
      {/* Mode indicator */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-medium rounded-full px-3 py-1 bg-background/80 backdrop-blur-sm border">
        {currentMode === "focus" ? "Focus Session" : 
         currentMode === "break" ? "Short Break" : "Long Break"}
        {isCountdown && <span className="ml-2 text-xs">({completedSessions} completed)</span>}
      </div>
      
      {/* Progress Circle */}
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
          className={cn("transition-all duration-1000 ease-in-out", getModeColor())}
          style={arcStyle}
          transform="rotate(-90, 100, 100)"
        />
      </svg>
      
      {/* Timer Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-mono font-bold mb-4">{formatTime(timeRemaining)}</div>
        
        <div className="flex flex-col items-center justify-center space-y-3">
          {/* Main Timer Button (Start/Pause/Reset) */}
          <Button 
            size="lg"
            className={cn(
              "rounded-full w-16 h-16 p-0 flex items-center justify-center transition-all duration-300",
              isCompleted && "bg-green-500 hover:bg-green-600",
              currentMode === "break" && "bg-cyan-500 hover:bg-cyan-600",
              currentMode === "longBreak" && "bg-amber-500 hover:bg-amber-600"
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
          
          {/* Skip/Take Break Button */}
          {isCountdown && !isActive && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "rounded-full transition-all duration-300 flex items-center gap-2",
                      currentMode === "focus" ? 
                        "hover:bg-cyan-100 dark:hover:bg-cyan-900" : 
                        "hover:bg-primary/10"
                    )}
                    onClick={skipToBreak}
                  >
                    {currentMode === "focus" ? (
                      <>
                        <Coffee className="w-4 h-4" />
                        <span>Take a break</span>
                      </>
                    ) : (
                      <>
                        <FastForward className="w-4 h-4" />
                        <span>Skip to focus</span>
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {currentMode === "focus" ? 
                    "Skip current focus session and take a break" : 
                    "Skip break and start focusing"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
};
