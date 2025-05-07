import React, { useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Coffee, FastForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useShop } from "@/contexts/ShopContext";
import { useTimer } from '@/contexts/TimerContext';

// This component handles the circular timer display and controls
interface TimerCircleProps {
  initialMinutes?: number;          // Starting minutes for countdown
  isCountdown?: boolean;            // If true, counts down; if false, counts up
  breakMinutes?: number;            // Length of short break in minutes
  longBreakMinutes?: number;        // Length of long break in minutes
  sessionsBeforeLongBreak?: number; // Number of focus sessions before a long break
  onTimerComplete?: () => void;     // Function to call when timer completes
  onTimerUpdate?: (seconds: number) => void; // Function to call on each second
  onModeChange?: (mode: "focus" | "break" | "longBreak") => void; // Function to call when mode changes
  soundUrl?: string;                // Custom sound to play when timer completes
  timeRemaining: number;
  isActive: boolean;
  isCompleted: boolean;
  currentMode: "focus" | "break" | "longBreak";
  completedSessions: number;
  onTimeUpdate?: (seconds: number) => void;
  onSessionComplete?: () => void;
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
  timeRemaining: propTimeRemaining,
  isActive: propIsActive,
  isCompleted: propIsCompleted,
  currentMode: propCurrentMode,
  completedSessions: propCompletedSessions,
  onTimeUpdate,
  onSessionComplete,
}) => {
  const {
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
  } = useTimer();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef<number>(Date.now());
  
  // Add shop context
  const { addFish } = useShop();
  
  // Update context when props change
  useEffect(() => {
    setTimeRemaining(propTimeRemaining);
    setIsActive(propIsActive);
    setIsCompleted(propIsCompleted);
    setCurrentMode(propCurrentMode);
    setCompletedSessions(propCompletedSessions);
  }, [propTimeRemaining, propIsActive, propIsCompleted, propCurrentMode, propCompletedSessions]);
  
  // Timer logic
  useEffect(() => {
    let lastTickTime = Date.now();
    let animationFrameId: number;

    const tick = () => {
      const now = Date.now();
      const delta = now - lastTickTime;
      lastTickTime = now;

      if (isActive) {
        if (isCountdown) {
          const newTime = Math.max(0, timeRemaining - delta / 1000);
          if (!isNaN(newTime)) {
            setTimeRemaining(newTime);
            onTimeUpdate?.(newTime);

            if (newTime <= 0) {
              setIsActive(false);
              setIsCompleted(true);
              if (soundUrl && soundUrl.trim() !== "") {
                // Skip YouTube URLs (handled elsewhere)
                if (!soundUrl.includes("youtube.com") && !soundUrl.includes("youtu.be")) {
                  const audio = new Audio(soundUrl);
                  audio.play().catch(console.error);
                }
              }
              onSessionComplete?.();

              // Handle session completion
              if (currentMode === "focus") {
                const newCompletedSessions = completedSessions + 1;
                setCompletedSessions(newCompletedSessions);
                if (initialMinutes >= 25) {
                  addFish(1);
                }
                if (newCompletedSessions % sessionsBeforeLongBreak === 0) {
                  setCurrentMode("longBreak");
                } else {
                  setCurrentMode("break");
                }
              } else {
                setCurrentMode("focus");
              }
            }
          }
        } else {
          const newTime = timeRemaining + delta / 1000;
          if (!isNaN(newTime)) {
            setTimeRemaining(newTime);
            onTimeUpdate?.(newTime);
          }
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    if (isActive) {
      animationFrameId = requestAnimationFrame(tick);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isActive, isCountdown, timeRemaining, currentMode, completedSessions, onTimeUpdate, onTimerComplete, addFish]);

  // Initialize audio
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    audioRef.current = new Audio(soundUrl || "https://assets.mixkit.co/sfx/preview/mixkit-software-interface-back-2575.mp3");
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [soundUrl]);
  
  // Update initial time when mode changes
  useEffect(() => {
    if (!isActive) {
      // Set appropriate time based on current mode
      if (isCountdown) {
        let newTime = 0;
        if (currentMode === "focus") {
          newTime = initialMinutes * 60;
        } else if (currentMode === "break") {
          newTime = breakMinutes * 60;
        } else if (currentMode === "longBreak") {
          newTime = longBreakMinutes * 60;
        }
        if (!isNaN(newTime)) {
          setTimeRemaining(newTime);
        }
      } else {
        // In stopwatch mode, always set to zero
        setTimeRemaining(0);
        setCompletedSessions(0);
        setCurrentMode("focus");
      }
    }
    
    // Notify parent components of updates
    if (onTimerUpdate) onTimerUpdate(timeRemaining);
    if (onModeChange) onModeChange(currentMode);
  }, [currentMode, initialMinutes, breakMinutes, longBreakMinutes, isCountdown, isActive]);
  
  // Reset timer when countdown mode changes
  useEffect(() => {
    if (isCountdown) {
      // Reset to default values for countdown mode
      if (currentMode === "focus") {
        setTimeRemaining(initialMinutes * 60);
      } else if (currentMode === "break") {
        setTimeRemaining(breakMinutes * 60);
      } else if (currentMode === "longBreak") {
        setTimeRemaining(longBreakMinutes * 60);
      }
    } else {
      // Reset everything to zero for stopwatch mode
      setTimeRemaining(0);
      setCompletedSessions(0);
      setCurrentMode("focus");
    }
  }, [isCountdown]);
  
  // Start/pause the timer
  const toggleTimer = () => {
    if (isCompleted) {
      resetTimer();
    } else {
      setIsActive(!isActive);
    }
  };

  // Skip current session
  const skipToBreak = () => {
    if (currentMode === "focus") {
      // Skip the current focus session and move to break
      setIsActive(false);
      clearInterval(timerRef.current!);
      
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
      clearInterval(timerRef.current!);
      setCurrentMode("focus");
    }
  };
  
  // Reset the timer to its initial state
  const resetTimer = () => {
    setIsActive(false);
    setIsCompleted(false);
    
    if (isCountdown) {
      // Reset time based on current mode for countdown
      if (currentMode === "focus") {
        setTimeRemaining(initialMinutes * 60);
      } else if (currentMode === "break") {
        setTimeRemaining(breakMinutes * 60);
      } else if (currentMode === "longBreak") {
        setTimeRemaining(longBreakMinutes * 60);
      }
    } else {
      // Always set to zero in stopwatch mode
      setTimeRemaining(0);
    }
    
    // Update parent component
    if (onTimerUpdate) {
      onTimerUpdate(isCountdown ? 
        (currentMode === "focus" ? initialMinutes * 60 : 
         currentMode === "break" ? breakMinutes * 60 : 
         longBreakMinutes * 60) : 0);
    }
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
  
  // Calculate progress percentage for the circle
  const progress = isCountdown 
    ? ((initialMinutes * 60 - timeRemaining) / (initialMinutes * 60)) * 100
    : 0; // For stopwatch, we don't show progress in the circle
  
  // Calculate the SVG arc path for the progress circle
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
        {/* Time display */}
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
          
          {/* Skip/Take Break Button - only shown for countdown timer when not active */}
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
