
import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimerCircleProps {
  initialMinutes?: number;
  isCountdown?: boolean;
  onTimerComplete?: () => void;
  onTimerUpdate?: (seconds: number) => void;
}

export const TimerCircle: React.FC<TimerCircleProps> = ({
  initialMinutes = 25,
  isCountdown = true,
  onTimerComplete,
  onTimerUpdate,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(isCountdown ? initialMinutes * 60 : 0);
  const [initialTime] = useState(isCountdown ? initialMinutes * 60 : 0);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  
  const intervalRef = useRef<number | null>(null);
  
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
  }, [isActive, isCountdown, onTimerComplete, onTimerUpdate]);
  
  // Reset timer when mode changes
  useEffect(() => {
    resetTimer();
  }, [isCountdown, initialMinutes]);
  
  const toggleTimer = () => {
    if (isCompleted) {
      resetTimer();
    } else {
      setIsActive(!isActive);
    }
  };

  const takeBreak = () => {
    resetTimer();
    setIsBreak(true);
    // In a real app, you might change the timer duration here
    // For now, we'll just show visual feedback
    setTimeout(() => {
      setIsBreak(false);
    }, 300);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setIsCompleted(false);
    setTimeRemaining(isCountdown ? initialMinutes * 60 : 0);
    if (onTimerUpdate) onTimerUpdate(isCountdown ? initialMinutes * 60 : 0);
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
  
  return (
    <div className="relative w-72 h-72 mx-auto">
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
          className="text-primary transition-all duration-1000 ease-in-out"
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
              isBreak && "bg-amber-500 hover:bg-amber-600"
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
          
          {/* Take Break Button - Now below the main button */}
          {isCountdown && !isActive && !isCompleted && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full transition-all duration-300 hover:bg-amber-100 dark:hover:bg-amber-900 flex items-center gap-2"
              onClick={takeBreak}
            >
              <Coffee className="w-4 h-4" />
              <span>Take a break</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
