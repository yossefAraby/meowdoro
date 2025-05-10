import React, { useState, useEffect, useCallback, useRef } from "react";
import { TimerCircle } from "@/components/timer/TimerCircle";
import { ProgressBar } from "@/components/timer/ProgressBar";
import { AudioControls } from "@/components/timer/AudioControls";
import { useBackgroundSounds } from "@/contexts/BackgroundSoundContext";
import { TimerSettings } from "@/components/timer/TimerSettings";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PartyTimer } from "@/components/timer/PartyTimer";
import MeowAIButton from "@/components/ai/MeowAIButton";
import { useShop } from "@/contexts/ShopContext";
import { useLocation } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { useTimerPause } from "@/contexts/TimerPauseContext";

// Define the keys for localStorage
const STORAGE_KEYS = {
  TIMER_SECONDS: "meowdoro-timer-seconds",
  TIMER_ACTIVE: "meowdoro-timer-active",
  TIMER_MODE: "meowdoro-timer-mode",
  TIMER_TIMESTAMP: "meowdoro-timer-timestamp",
  TIMER_COUNTDOWN: "meowdoro-timer-countdown",
  STOPWATCH_SECONDS: "meowdoro-stopwatch-seconds",
  STOPWATCH_ACTIVE: "meowdoro-stopwatch-active",
  STOPWATCH_TIMESTAMP: "meowdoro-stopwatch-timestamp",
  COMPLETED_SESSIONS: "meowdoro-completed-sessions",
  FOCUS_DATE: "meowdoro-focus-date",
  FOCUS_MINUTES: "meowdoro-focus-minutes",
  FOCUS_PROGRESS: "meowdoro-focus-progress",
  LAST_UPDATE: "meowdoro-last-update"
};

const Timer: React.FC = () => {
  // Timer state - whether countdown or count-up
  const [isCountdown, setIsCountdown] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.TIMER_COUNTDOWN) !== "false";
  });
  
  // Track focus time and progress
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(() => {
    // Check if the current date matches the stored date
    const storedDate = localStorage.getItem(STORAGE_KEYS.FOCUS_DATE);
    const currentDate = new Date().toDateString();
    
    // If dates match, return saved minutes, otherwise return 0
    if (storedDate === currentDate) {
      return parseInt(localStorage.getItem(STORAGE_KEYS.FOCUS_MINUTES) || "0", 10);
    } else {
      // Reset minutes for new day
      localStorage.setItem(STORAGE_KEYS.FOCUS_DATE, currentDate);
      localStorage.setItem(STORAGE_KEYS.FOCUS_MINUTES, "0");
      return 0;
    }
  });
  
  // Timer state for countdown mode
  const [timerSeconds, setTimerSeconds] = useState(() => {
    const savedSeconds = localStorage.getItem(STORAGE_KEYS.TIMER_SECONDS);
    if (savedSeconds) {
      return parseInt(savedSeconds, 10);
    } else {
      // Default to focus minutes
      const focusMin = parseInt(localStorage.getItem("meowdoro-focus-time") || "25", 10);
      return focusMin * 60;
    }
  });
  
  const [timerActive, setTimerActive] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.TIMER_ACTIVE) === "true";
  });
  
  const [timerCompleted, setTimerCompleted] = useState(false);
  
  const [timerMode, setTimerMode] = useState<"focus" | "break" | "longBreak">(() => {
    return (localStorage.getItem(STORAGE_KEYS.TIMER_MODE) as "focus" | "break" | "longBreak") || "focus";
  });
  
  // Stopwatch state - completely separate from timer
  const [stopwatchSeconds, setStopwatchSeconds] = useState(() => {
    const savedSeconds = localStorage.getItem(STORAGE_KEYS.STOPWATCH_SECONDS);
    return savedSeconds ? parseInt(savedSeconds, 10) : 0;
  });
  
  const [stopwatchActive, setStopwatchActive] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.STOPWATCH_ACTIVE) === "true";
  });
  
  // Session tracking
  const [completedSessions, setCompletedSessions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_SESSIONS);
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [currentSessionProgress, setCurrentSessionProgress] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOCUS_PROGRESS);
    return saved ? parseInt(saved, 10) : 0;
  });
  
  // UI state
  const [activeTab, setActiveTab] = useState('personal');
  const [hasActiveParty, setHasActiveParty] = useState(false);
  const { user } = useAuth();
  
  // Progress bar visibility
  const [showFocusBar, setShowFocusBar] = useState(() => {
    return localStorage.getItem("meowdoro-show-focus-bar") !== "false";
  });
  
  const [showFishBar, setShowFishBar] = useState(() => {
    return localStorage.getItem("meowdoro-show-fish-bar") !== "false";
  });
  
  const [showMeowAI, setShowMeowAI] = useState(() => {
    // Default to hidden on mobile, visible on desktop
    const isMobileDevice = window.innerWidth <= 768;
    const savedValue = localStorage.getItem("meowdoro-show-meow-ai");
    return savedValue !== null ? savedValue === "true" : !isMobileDevice;
  });
  
  // Settings from localStorage
  const [completionSound, setCompletionSound] = useState(() => {
    return localStorage.getItem("meowdoro-completion-sound") || "";
  });
  const [customYoutubeUrl, setCustomYoutubeUrl] = useState(() => {
    return localStorage.getItem("meowdoro-youtube-sound") || "";
  });
  
  // Pomodoro timer settings
  const [focusMinutes, setFocusMinutes] = useState(() => {
    return parseInt(localStorage.getItem("meowdoro-focus-time") || "25", 10);
  });
  const [breakMinutes, setBreakMinutes] = useState(() => {
    return parseInt(localStorage.getItem("meowdoro-break-time") || "5", 10);
  });
  const [longBreakMinutes, setLongBreakMinutes] = useState(() => {
    return parseInt(localStorage.getItem("meowdoro-long-break-time") || "15", 10);
  });
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(() => {
    return parseInt(localStorage.getItem("meowdoro-sessions-before-long-break") || "4", 10);
  });
  const [dailyGoal, setDailyGoal] = useState(() => {
    return parseInt(localStorage.getItem("meowdoro-daily-goal") || "90", 10);
  });
  
  const { toast } = useToast();
  const { soundPlaying, playSound, volume, setVolume } = useBackgroundSounds();
  const { addFish } = useShop();
  
  // Get pause notification functions from global context
  const { registerPause, registerModeSwitch } = useTimerPause();
  
  const location = useLocation();
  
  // Create a reference to track previous elapsed minutes
  const prevElapsedMinutesRef = useRef(0);
  
  // Define callbacks first before using them in useEffect hooks
  const checkPartyStatus = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('party_members')
        .select('party_id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (error) throw error;
      
      setHasActiveParty(data && data.length > 0);
    } catch (error) {
      console.error("Error checking party status:", error);
    }
  }, [user]);
  
  // Handle timer completion
  const handleTimerComplete = useCallback(() => {
    setTimerCompleted(true);
    
    // Only increment total focus minutes when a focus session completes
    if (timerMode === "focus") {
      // Calculate how much to add (only what wasn't already counted from real-time updates)
      // If we already added progress in real-time, this may be zero
      const additionalMinutes = Math.max(0, focusMinutes - currentSessionProgress);
      
      // Ensure we never lose progress by taking the max
      const newTotal = Math.max(totalFocusMinutes, totalFocusMinutes + additionalMinutes);
      
      setTotalFocusMinutes(newTotal);
      
      // Save the focus minutes along with the current date
      localStorage.setItem(STORAGE_KEYS.FOCUS_MINUTES, newTotal.toString());
      localStorage.setItem(STORAGE_KEYS.FOCUS_DATE, new Date().toDateString());
      
      // Update completed sessions
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);
      
      // Determine next mode
      if (newCompletedSessions % sessionsBeforeLongBreak === 0) {
        setTimerMode("longBreak");
        setTimerSeconds(longBreakMinutes * 60);
      } else {
        setTimerMode("break");
        setTimerSeconds(breakMinutes * 60);
      }
      
      toast({
        title: "Focus session completed!",
        description: `You've focused for ${newTotal} minutes today.`,
      });
    } else if (timerMode === "break") {
      setTimerMode("focus");
      setTimerSeconds(focusMinutes * 60);
      
      toast({
        title: "Break completed!",
        description: "Time to focus again.",
      });
    } else if (timerMode === "longBreak") {
      setTimerMode("focus");
      setTimerSeconds(focusMinutes * 60);
      
      toast({
        title: "Long break completed!",
        description: "Ready for a new focus session?",
      });
    }
    
    // Play completion sound if set
    if (completionSound) {
      playSound(completionSound);
    }
    
    // Add fish reward on timer completion
    if (timerMode === "focus") {
      const fishReward = Math.ceil(focusMinutes / 10); // 1 fish for each 10 minutes
      addFish(fishReward);
      toast({
        title: `${fishReward} fish earned!`,
        description: "Keep up the great work!",
      });
    }
  }, [timerMode, focusMinutes, currentSessionProgress, totalFocusMinutes, completedSessions, 
      sessionsBeforeLongBreak, longBreakMinutes, breakMinutes, toast, completionSound, playSound, addFish]);
  
  // Handle timer updates for countdown mode
  const handleTimerUpdate = useCallback((seconds: number) => {
    setTimerSeconds(seconds);
    
    // Only track progress in focus mode
    if (timerMode === "focus") {
      // Calculate elapsed minutes in current session
      const totalSessionSeconds = focusMinutes * 60;
      const elapsedSeconds = totalSessionSeconds - seconds;
      const elapsedMinutes = Math.floor(elapsedSeconds / 60);
      
      // Update current session progress
      setCurrentSessionProgress(elapsedMinutes);
      
      // Update total focus minutes in real-time
      if (elapsedMinutes > 0) {
        // Always keep the highest value to never lose progress
        const newTotal = Math.max(totalFocusMinutes, totalFocusMinutes + (elapsedMinutes - currentSessionProgress));
        setTotalFocusMinutes(newTotal);
        
        // Save progress
        localStorage.setItem(STORAGE_KEYS.FOCUS_MINUTES, newTotal.toString());
        localStorage.setItem(STORAGE_KEYS.FOCUS_DATE, new Date().toDateString());
        localStorage.setItem(STORAGE_KEYS.FOCUS_PROGRESS, elapsedMinutes.toString());
      }
    }
    
    setTimerCompleted(false);
  }, [timerMode, focusMinutes, totalFocusMinutes, currentSessionProgress]);
  
  // Handle stopwatch updates
  const handleStopwatchUpdate = useCallback((seconds: number, isActive: boolean = false) => {
    setStopwatchSeconds(seconds);
    
    // Only update progress if stopwatch is active or if this is not a reset
    if (isActive || seconds > 0) {
      // Calculate elapsed minutes
      const elapsedMinutes = Math.floor(seconds / 60);
      
      // Update current session progress
      setCurrentSessionProgress(elapsedMinutes);
      
      // Only update if minutes have changed
      if (elapsedMinutes > prevElapsedMinutesRef.current) {
        // Calculate the incremental minutes (only the new minute)
        const incrementalMinutes = elapsedMinutes - prevElapsedMinutesRef.current;
        
        // Update total focus minutes with just the increment
        const newTotal = totalFocusMinutes + incrementalMinutes;
        setTotalFocusMinutes(newTotal);
        
        // Save progress
        localStorage.setItem(STORAGE_KEYS.FOCUS_MINUTES, newTotal.toString());
        localStorage.setItem(STORAGE_KEYS.FOCUS_DATE, new Date().toDateString());
        localStorage.setItem(STORAGE_KEYS.FOCUS_PROGRESS, elapsedMinutes.toString());
        
        // Update the previous elapsed minutes reference
        prevElapsedMinutesRef.current = elapsedMinutes;
      }
    } else {
      // Reset the reference when stopwatch is reset
      prevElapsedMinutesRef.current = 0;
    }
  }, [totalFocusMinutes]);
  
  // Handle mode change while preserving progress
  const handleModeChange = useCallback((mode: "focus" | "break" | "longBreak") => {
    setTimerMode(mode);
    
    if (mode === "focus") {
      setTimerSeconds(focusMinutes * 60);
    } else if (mode === "break") {
      setTimerSeconds(breakMinutes * 60);
    } else {
      setTimerSeconds(longBreakMinutes * 60);
    }
    
    setTimerActive(false);
    setTimerCompleted(false);
    
    // Don't reset progress when changing modes
    // currentSessionProgress and totalFocusMinutes are preserved
  }, [focusMinutes, breakMinutes, longBreakMinutes]);
  
  // Modify toggleTimerMode to preserve progress when switching modes
  const toggleTimerMode = useCallback(() => {
    // Toggle between countdown and stopwatch
    const newCountdownMode = !isCountdown;
    setIsCountdown(newCountdownMode);
    
    // Notify our tracker about mode switch
    registerModeSwitch();
    
    // Save preference to localStorage
    localStorage.setItem(STORAGE_KEYS.TIMER_COUNTDOWN, newCountdownMode.toString());
    
    // Reset current active timer but preserve progress
    if (timerActive || stopwatchActive) {
      if (newCountdownMode) {
        // Switching to countdown, reset timer
        setStopwatchActive(false);
        setTimerActive(false);
        handleModeChange(timerMode);
      } else {
        // Switching to stopwatch
        setTimerActive(false);
        setStopwatchActive(false);
        setStopwatchSeconds(0);
        // Reset the minute tracking reference when switching to stopwatch
        prevElapsedMinutesRef.current = 0;
        // Don't reset progress when switching to stopwatch
        handleStopwatchUpdate(0, false);
      }
      
      toast({
        title: `Switched to ${newCountdownMode ? "Pomodoro Timer" : "Stopwatch"}`,
        description: "Timer has been reset, but your progress is preserved.",
      });
    } else {
      // Reset appropriate timer based on new mode
      if (newCountdownMode) {
        handleModeChange(timerMode);
      } else {
        setStopwatchSeconds(0);
        // Reset the minute tracking reference when switching to stopwatch
        prevElapsedMinutesRef.current = 0;
        // Don't reset progress when switching to stopwatch
        handleStopwatchUpdate(0, false);
      }
      
      toast({
        title: `Switched to ${newCountdownMode ? "Pomodoro Timer" : "Stopwatch"}`,
      });
    }
  }, [isCountdown, timerActive, stopwatchActive, timerMode, handleModeChange, toast, registerModeSwitch, handleStopwatchUpdate]);
  
  // Use the appropriate timer state based on mode
  const seconds = isCountdown ? timerSeconds : stopwatchSeconds;
  const isActive = isCountdown ? timerActive : stopwatchActive;
  const setIsActive = isCountdown ? setTimerActive : setStopwatchActive;

  // Create a wrapper for the onTimerUpdate callback to handle stopwatch resets
  const onTimerUpdateWrapper = useCallback((seconds: number) => {
    if (isCountdown) {
      handleTimerUpdate(seconds);
    } else {
      // If the stopwatch is being reset to 0, we need to reset the prevElapsedMinutesRef
      if (seconds === 0) {
        prevElapsedMinutesRef.current = 0;
      }
      handleStopwatchUpdate(seconds, false);
    }
  }, [isCountdown, handleTimerUpdate, handleStopwatchUpdate]);

  // Custom wrapper for setIsActive that also registers pause events
  const handleSetIsActive = useCallback((active) => {
    // If changing from active to inactive, register as manual pause
    if ((timerActive || stopwatchActive) && !active) {
      registerPause();
    }
    setIsActive(active);
  }, [timerActive, stopwatchActive, registerPause, setIsActive]);
  
  // Now all the useEffects after defining the callbacks
  
  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIMER_SECONDS, timerSeconds.toString());
    localStorage.setItem(STORAGE_KEYS.TIMER_ACTIVE, timerActive.toString());
    localStorage.setItem(STORAGE_KEYS.TIMER_MODE, timerMode);
    localStorage.setItem(STORAGE_KEYS.TIMER_COUNTDOWN, isCountdown.toString());
    localStorage.setItem(STORAGE_KEYS.COMPLETED_SESSIONS, completedSessions.toString());
    localStorage.setItem(STORAGE_KEYS.FOCUS_PROGRESS, currentSessionProgress.toString());
    
    // Update timestamp when timer state changes
    if (timerActive) {
      localStorage.setItem(STORAGE_KEYS.TIMER_TIMESTAMP, Date.now().toString());
    }
    
    // Broadcast changes to other tabs
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, Date.now().toString());
  }, [timerSeconds, timerActive, timerMode, isCountdown, completedSessions, currentSessionProgress]);
  
  // Save stopwatch state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STOPWATCH_SECONDS, stopwatchSeconds.toString());
    localStorage.setItem(STORAGE_KEYS.STOPWATCH_ACTIVE, stopwatchActive.toString());
    
    if (stopwatchActive) {
      localStorage.setItem(STORAGE_KEYS.STOPWATCH_TIMESTAMP, Date.now().toString());
    }
  }, [stopwatchSeconds, stopwatchActive]);
  
  // Listen for localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.LAST_UPDATE) {
        // Reload timer state from localStorage to sync between tabs
        const savedTimerActive = localStorage.getItem(STORAGE_KEYS.TIMER_ACTIVE) === "true";
        const savedTimerSeconds = parseInt(localStorage.getItem(STORAGE_KEYS.TIMER_SECONDS) || "0", 10);
        const savedTimerMode = localStorage.getItem(STORAGE_KEYS.TIMER_MODE) as "focus" | "break" | "longBreak";
        const savedStopwatchActive = localStorage.getItem(STORAGE_KEYS.STOPWATCH_ACTIVE) === "true";
        const savedStopwatchSeconds = parseInt(localStorage.getItem(STORAGE_KEYS.STOPWATCH_SECONDS) || "0", 10);
        
        setTimerActive(savedTimerActive);
        setTimerSeconds(savedTimerSeconds);
        setTimerMode(savedTimerMode || "focus");
        setStopwatchActive(savedStopwatchActive);
        setStopwatchSeconds(savedStopwatchSeconds);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Calculate elapsed time when component mounts if timer was active
  useEffect(() => {
    if (timerActive) {
      const timestamp = localStorage.getItem(STORAGE_KEYS.TIMER_TIMESTAMP);
      if (timestamp) {
        const startTime = parseInt(timestamp, 10);
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        
        if (isCountdown) {
          // For countdown timer, subtract elapsed time
          const newSeconds = Math.max(0, timerSeconds - elapsedSeconds);
          setTimerSeconds(newSeconds);
          
          // Check if timer should be completed
          if (newSeconds === 0) {
          setTimerActive(false);
          setTimerCompleted(true);
          handleTimerComplete();
          }
        }
      }
    }
  }, [timerActive, timerSeconds, isCountdown, handleTimerComplete]);
  
  // Calculate elapsed time for stopwatch when component mounts if active
  useEffect(() => {
    if (stopwatchActive) {
      const timestamp = localStorage.getItem(STORAGE_KEYS.STOPWATCH_TIMESTAMP);
      if (timestamp) {
        const startTime = parseInt(timestamp, 10);
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        setStopwatchSeconds(stopwatchSeconds + elapsedSeconds);
      }
    }
  }, [stopwatchActive, stopwatchSeconds]);
  
  // Save progress bar visibility settings
  useEffect(() => {
    localStorage.setItem("meowdoro-show-focus-bar", showFocusBar.toString());
  }, [showFocusBar]);
  
  useEffect(() => {
    localStorage.setItem("meowdoro-show-fish-bar", showFishBar.toString());
  }, [showFishBar]);
  
  useEffect(() => {
    localStorage.setItem("meowdoro-show-meow-ai", showMeowAI.toString());
  }, [showMeowAI]);
  
  // Check if user is in a party
  useEffect(() => {
    if (user) {
      checkPartyStatus();
    }
  }, [user, checkPartyStatus]);
  
  // Check for day change when component mounts or becomes active
  useEffect(() => {
    const checkDayChange = () => {
      const storedDate = localStorage.getItem("meowdoro-focus-date");
      const currentDate = new Date().toDateString();
      
      if (storedDate !== currentDate) {
        // Reset for new day
        localStorage.setItem("meowdoro-focus-date", currentDate);
        localStorage.setItem("meowdoro-focus-minutes", "0");
        setTotalFocusMinutes(0);
      }
    };
    
    // Check immediately when component mounts
    checkDayChange();
    
    // Also check periodically (every minute)
    const intervalId = setInterval(checkDayChange, 60000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Initialize timer on mount and when settings change
  useEffect(() => {
    if (isCountdown && !timerActive) {
      if (timerMode === "focus") {
        setTimerSeconds(focusMinutes * 60);
      } else if (timerMode === "break") {
        setTimerSeconds(breakMinutes * 60);
      } else {
        setTimerSeconds(longBreakMinutes * 60);
      }
    }
  }, [isCountdown, focusMinutes, breakMinutes, longBreakMinutes, timerMode]);

  // Timer effect to update countdown or stopwatch
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    // Only run timer if active
    if (timerActive && isCountdown) {
      intervalId = setInterval(() => {
        setTimerSeconds(prev => {
          const newSeconds = prev - 1;
          if (newSeconds <= 0) {
            clearInterval(intervalId);
            setTimerActive(false);
            setTimerCompleted(true);
            handleTimerComplete();
            return 0;
          }
          
          // Update progress every second
          handleTimerUpdate(newSeconds);
          return newSeconds;
        });
      }, 1000);
    } else if (stopwatchActive && !isCountdown) {
      intervalId = setInterval(() => {
        setStopwatchSeconds(prev => {
          const newSeconds = prev + 1;
          
          // Check if we've crossed a minute boundary
          const prevMinutes = Math.floor(prev / 60);
          const newMinutes = Math.floor(newSeconds / 60);
          
          // Only update progress when crossing a minute boundary
          if (newMinutes > prevMinutes) {
            // We need to call this outside of this setState callback to avoid the TypeScript error
            setTimeout(() => handleStopwatchUpdate(newSeconds, true), 0);
          }
          
          return newSeconds;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timerActive, stopwatchActive, isCountdown, handleTimerComplete, handleTimerUpdate, handleStopwatchUpdate]);

  const saveTimerSettings = () => {
    // Save all timer settings to localStorage
    localStorage.setItem("meowdoro-focus-time", focusMinutes.toString());
    localStorage.setItem("meowdoro-break-time", breakMinutes.toString());
    localStorage.setItem("meowdoro-long-break-time", longBreakMinutes.toString());
    localStorage.setItem("meowdoro-sessions-before-long-break", sessionsBeforeLongBreak.toString());
    localStorage.setItem("meowdoro-daily-goal", dailyGoal.toString());
    localStorage.setItem("meowdoro-show-meow-ai", showMeowAI.toString());
    
    // Update current timer based on settings
    if (isCountdown && !timerActive) {
      if (timerMode === "focus") {
      setTimerSeconds(focusMinutes * 60);
      } else if (timerMode === "break") {
        setTimerSeconds(breakMinutes * 60);
      } else {
        setTimerSeconds(longBreakMinutes * 60);
      }
    }
    
    toast({
      title: "Settings saved",
      description: "Your timer settings have been updated.",
    });
  };
  
  // Define missing callbacks
  const onTimerComplete = () => {
    // This function is intentionally left empty as handleTimerComplete
    // already handles all the necessary logic
  };
  
  const onModeChange = (mode: "focus" | "break" | "longBreak") => {
    // This function is intentionally left empty as handleModeChange
    // already handles all the necessary logic
  };
  
  return (
    <PageContainer className="max-w-4xl pt-0 md:pt-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-0 mb-2 md:mb-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="personal" className="gap-2">
            <Clock className="h-4 w-4" />
            Personal Timer
          </TabsTrigger>
          <TabsTrigger value="party" disabled={!hasActiveParty} className="gap-2">
            <Users className="h-4 w-4" />
            Party Timer
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="space-y-6">
          <div className="flex flex-col items-center">
            {/* Timer controls */}
            <AudioControls
              isCountdown={isCountdown}
              toggleTimerMode={toggleTimerMode}
              soundPlaying={soundPlaying}
              onPlaySound={playSound}
              volume={volume}
              setVolume={setVolume}
            >
              {/* Settings button */}
              <TimerSettings
                focusMinutes={focusMinutes}
                breakMinutes={breakMinutes}
                longBreakMinutes={longBreakMinutes}
                sessionsBeforeLongBreak={sessionsBeforeLongBreak}
                dailyGoal={dailyGoal}
                completionSound={completionSound}
                customYoutubeUrl={customYoutubeUrl}
                showFocusBar={showFocusBar}
                showFishBar={showFishBar}
                showMeowAI={showMeowAI}
                setFocusMinutes={setFocusMinutes}
                setBreakMinutes={setBreakMinutes}
                setLongBreakMinutes={setLongBreakMinutes}
                setSessionsBeforeLongBreak={setSessionsBeforeLongBreak}
                setDailyGoal={setDailyGoal}
                setCompletionSound={setCompletionSound}
                setCustomYoutubeUrl={setCustomYoutubeUrl}
                setShowFocusBar={setShowFocusBar}
                setShowFishBar={setShowFishBar}
                setShowMeowAI={setShowMeowAI}
                saveSettings={saveTimerSettings}
              />
            </AudioControls>
            
            {/* Main timer circle */}
            <TimerCircle 
              initialMinutes={focusMinutes}
              breakMinutes={breakMinutes}
              longBreakMinutes={longBreakMinutes}
              sessionsBeforeLongBreak={sessionsBeforeLongBreak}
              isCountdown={isCountdown}
              onTimerComplete={onTimerComplete}
              onTimerUpdate={onTimerUpdateWrapper}
              onModeChange={onModeChange}
              soundUrl={completionSound}
              timeRemaining={seconds}
              isActive={isActive}
              isCompleted={timerCompleted}
              currentMode={timerMode}
              completedSessions={completedSessions}
              setTimeRemaining={isCountdown ? setTimerSeconds : setStopwatchSeconds}
              setIsActive={handleSetIsActive}
              setIsCompleted={setTimerCompleted}
              setCurrentMode={setTimerMode}
              setCompletedSessions={setCompletedSessions}
            />
            
            {/* Progress bars */}
            <div className="mt-12 w-full max-w-lg mx-auto">
              {(showFocusBar || showFishBar) && (
                <ProgressBar 
                  currentMinutes={totalFocusMinutes} 
                  goalMinutes={dailyGoal}
                  fishProgress={totalFocusMinutes}
                  showFocusBar={showFocusBar}
                  showFishBar={showFishBar}
                  currentMode={timerMode}
                />
              )}
            </div>
            
            {/* Mobile spacing at bottom */}
            <div className="h-36 md:hidden w-full" aria-hidden="true"></div>
          </div>
        </TabsContent>
        
        <TabsContent value="party">
          <PartyTimer />
        </TabsContent>
      </Tabs>
      
      {/* AI Chat button */}
      <div className="relative md:fixed md:bottom-6 md:right-6 flex justify-end mb-6 mr-6">
        {showMeowAI && <MeowAIButton timerMode={timerMode} />}
      </div>
    </PageContainer>
  );
};

export default Timer;
