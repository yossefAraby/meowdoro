import React, { useState, useEffect } from "react";
import { TimerCircle } from "@/components/timer/TimerCircle";
import { ProgressBar } from "@/components/timer/ProgressBar";
import { AudioControls, useBackgroundSounds } from "@/components/timer/AudioControls";
import { TimerSettings } from "@/components/timer/TimerSettings";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PartyTimer } from "@/components/timer/PartyTimer";
import MeowAIButton from "@/components/ai/MeowAIButton";
import { useShop } from "@/contexts/ShopContext";

const Timer: React.FC = () => {
  // Timer state - whether countdown or count-up
  const [isCountdown, setIsCountdown] = useState(true);
  
  // Track focus time and progress
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(() => {
    // Check if the current date matches the stored date
    const storedDate = localStorage.getItem("meowdoro-focus-date");
    const currentDate = new Date().toDateString();
    
    // If dates match, return saved minutes, otherwise return 0
    if (storedDate === currentDate) {
      return parseInt(localStorage.getItem("meowdoro-focus-minutes") || "0", 10);
    } else {
      // Reset minutes for new day
      localStorage.setItem("meowdoro-focus-date", currentDate);
      localStorage.setItem("meowdoro-focus-minutes", "0");
      return 0;
    }
  });
  
  // Timer state for countdown mode
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const [timerMode, setTimerMode] = useState<"focus" | "break" | "longBreak">("focus");
  
  // Stopwatch state - completely separate from timer
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [stopwatchActive, setStopwatchActive] = useState(false);
  
  // Session tracking
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentSessionProgress, setCurrentSessionProgress] = useState(0);
  
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
  
  // Save progress bar visibility settings
  useEffect(() => {
    localStorage.setItem("meowdoro-show-focus-bar", showFocusBar.toString());
  }, [showFocusBar]);
  
  useEffect(() => {
    localStorage.setItem("meowdoro-show-fish-bar", showFishBar.toString());
  }, [showFishBar]);
  
  // Check if user is in a party
  useEffect(() => {
    if (user) {
      checkPartyStatus();
    }
  }, [user]);
  
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

  const checkPartyStatus = async () => {
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
  };

  // Handle timer updates for countdown mode
  const handleTimerUpdate = (seconds: number) => {
    setTimerSeconds(seconds);
    
    // Only track progress in focus mode
    if (timerMode === "focus") {
      // Calculate elapsed minutes
      const elapsedSeconds = (focusMinutes * 60) - seconds;
      const elapsedMinutes = Math.floor(elapsedSeconds / 60);
      
      // Always save the current session progress
      setCurrentSessionProgress(elapsedMinutes);
      
      // If any time was spent, add it to the total (never subtract)
      if (elapsedMinutes > 0) {
        setTotalFocusMinutes(prevTotal => {
          // Only update if the new time is higher than what we've tracked before
          const newTotal = Math.max(prevTotal, totalFocusMinutes + elapsedMinutes);
          localStorage.setItem("meowdoro-focus-minutes", newTotal.toString());
          localStorage.setItem("meowdoro-focus-date", new Date().toDateString());
          return newTotal;
        });
      }
    }
    
    setTimerCompleted(false);
  };
  
  // Handle stopwatch updates
  const handleStopwatchUpdate = (seconds: number) => {
    setStopwatchSeconds(seconds);
    
    // Calculate elapsed minutes
    const elapsedMinutes = Math.floor(seconds / 60);
    setCurrentSessionProgress(elapsedMinutes);
    
    // Update total focus time in real-time for stopwatch
    if (elapsedMinutes > 0) {
      setTotalFocusMinutes(prev => {
        const newTotal = Math.max(prev, elapsedMinutes);
        localStorage.setItem("meowdoro-focus-minutes", newTotal.toString());
        localStorage.setItem("meowdoro-focus-date", new Date().toDateString());
        return newTotal;
      });
    }
  };
  
  // Handle timer completion
  const handleTimerComplete = () => {
    setTimerCompleted(true);
    
    // Only increment total focus minutes when a focus session completes
    // (but only for the difference not already counted)
    if (timerMode === "focus") {
      // Calculate how much to add (only what wasn't already counted from real-time updates)
      const additionalMinutes = Math.max(0, focusMinutes - currentSessionProgress);
      const newTotal = totalFocusMinutes + additionalMinutes;
      
      setTotalFocusMinutes(newTotal);
      
      // Save the focus minutes along with the current date
      localStorage.setItem("meowdoro-focus-minutes", newTotal.toString());
      localStorage.setItem("meowdoro-focus-date", new Date().toDateString());
      
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
        description: "Time to get back to focusing.",
      });
    } else if (timerMode === "longBreak") {
      setTimerMode("focus");
      setTimerSeconds(focusMinutes * 60);
      
      toast({
        title: "Long break completed!",
        description: "Ready for another productive focus session?",
      });
    }
    
    // Reset current session progress
    setCurrentSessionProgress(0);
  };
  
  // Timer animation logic - MOVED HERE AFTER FUNCTION DEFINITIONS
  useEffect(() => {
    let animationFrameId: number;
    let lastTickTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const delta = now - lastTickTime;
      lastTickTime = now;
      
      if (isCountdown && timerActive) {
        // Countdown timer logic
        const newTime = Math.max(0, timerSeconds - delta / 1000);
        setTimerSeconds(newTime);
        handleTimerUpdate(newTime);
        
        // Check if timer completed
        if (newTime <= 0) {
          setTimerActive(false);
          setTimerCompleted(true);
          handleTimerComplete();
          
          // Play completion sound
          if (completionSound && completionSound.trim() !== "") {
            const audio = new Audio(completionSound);
            audio.play().catch(console.error);
          }
        }
      } else if (!isCountdown && stopwatchActive) {
        // Stopwatch logic
        const newTime = stopwatchSeconds + delta / 1000;
        setStopwatchSeconds(newTime);
        handleStopwatchUpdate(newTime);
        
        // Give a fish every 25 minutes of stopwatch time
        const minutes = Math.floor(newTime / 60);
        if (minutes % 25 === 0 && minutes > 0 && Math.floor(newTime) % 60 === 0) {
          // Only trigger once per minute
          addFish?.(1);
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    if ((isCountdown && timerActive) || (!isCountdown && stopwatchActive)) {
      animationFrameId = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [
    isCountdown, timerActive, stopwatchActive, 
    timerSeconds, stopwatchSeconds, 
    handleTimerUpdate, handleStopwatchUpdate, handleTimerComplete,
    completionSound, addFish, focusMinutes
  ]);
  
  // Handle timer mode changes (focus, break, long break)
  const handleModeChange = (mode: "focus" | "break" | "longBreak") => {
    setTimerMode(mode);
  };
  
  // Toggle between countdown and stopwatch modes
  const toggleTimerMode = () => {
    // If switching from timer to stopwatch in focus mode, save progress
    if (isCountdown && timerMode === "focus") {
      // Save current progress to total
      const newTotal = totalFocusMinutes + currentSessionProgress;
      setTotalFocusMinutes(newTotal);
      localStorage.setItem("meowdoro-focus-minutes", newTotal.toString());
    }
    
    // Reset current session progress
    setCurrentSessionProgress(0);
    
    // Stop all timers
    setTimerActive(false);
    setStopwatchActive(false);
    
    // Switch modes
    setIsCountdown(!isCountdown);
    setTimerCompleted(false);
    
    // Reset appropriate timer
    if (isCountdown) {
      // Switching to stopwatch
      setStopwatchSeconds(0);
    } else {
      // Switching to timer - reset to focus mode
      setTimerMode("focus");
      setTimerSeconds(focusMinutes * 60);
    }
  };
  
  // Save timer settings to localStorage
  const saveTimerSettings = () => {
    localStorage.setItem("meowdoro-focus-time", focusMinutes.toString());
    localStorage.setItem("meowdoro-break-time", breakMinutes.toString());
    localStorage.setItem("meowdoro-long-break-time", longBreakMinutes.toString());
    localStorage.setItem("meowdoro-sessions-before-long-break", sessionsBeforeLongBreak.toString());
    localStorage.setItem("meowdoro-daily-goal", dailyGoal.toString());
    localStorage.setItem("meowdoro-completion-sound", completionSound);
    localStorage.setItem("meowdoro-youtube-sound", customYoutubeUrl);
    localStorage.setItem("meowdoro-show-focus-bar", showFocusBar.toString());
    localStorage.setItem("meowdoro-show-fish-bar", showFishBar.toString());
    
    // Reset timer with new settings if in countdown mode
    if (isCountdown) {
      setTimerSeconds(focusMinutes * 60);
    }
    
    toast({
      title: "Timer settings saved",
      description: "Your Pomodoro settings have been updated.",
    });
  };
  
  // Use the appropriate timer state based on mode
  const seconds = isCountdown ? timerSeconds : stopwatchSeconds;
  const isActive = isCountdown ? timerActive : stopwatchActive;
  const setIsActive = isCountdown ? setTimerActive : setStopwatchActive;
  const onTimerUpdate = isCountdown ? handleTimerUpdate : handleStopwatchUpdate;
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 page-transition">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
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
                setFocusMinutes={setFocusMinutes}
                setBreakMinutes={setBreakMinutes}
                setLongBreakMinutes={setLongBreakMinutes}
                setSessionsBeforeLongBreak={setSessionsBeforeLongBreak}
                setDailyGoal={setDailyGoal}
                setCompletionSound={setCompletionSound}
                setCustomYoutubeUrl={setCustomYoutubeUrl}
                setShowFocusBar={setShowFocusBar}
                setShowFishBar={setShowFishBar}
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
              onTimerComplete={handleTimerComplete}
              onTimerUpdate={onTimerUpdate}
              onModeChange={handleModeChange}
              soundUrl={completionSound}
              timeRemaining={seconds}
              isActive={isActive}
              isCompleted={timerCompleted}
              currentMode={timerMode}
              completedSessions={completedSessions}
              setTimeRemaining={isCountdown ? setTimerSeconds : setStopwatchSeconds}
              setIsActive={setIsActive}
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
                  fishProgress={totalFocusMinutes + currentSessionProgress}
                  showFocusBar={showFocusBar}
                  showFishBar={showFishBar}
                  currentMode={timerMode}
                />
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="party">
          <PartyTimer />
        </TabsContent>
      </Tabs>
      
      {/* AI Chat button */}
      <div className="fixed bottom-6 right-6">
        <MeowAIButton timerMode={timerMode} />
      </div>
    </div>
  );
};

export default Timer;
