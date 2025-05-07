import React, { useState, useEffect } from "react";
import { TimerCircle } from "@/components/timer/TimerCircle";
import { ProgressBar } from "@/components/timer/ProgressBar";
import { AudioControls, useBackgroundSounds } from "@/components/timer/AudioControls";
import { TimerSettings } from "@/components/timer/TimerSettings";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Clock, Fish } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PartyTimer } from "@/components/timer/PartyTimer";
import MeowAIButton from "@/components/ai/MeowAIButton";
import { toast } from "sonner";

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
  
  // Timer state
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [timerCompleted, setTimerCompleted] = useState(false);
  const [currentMode, setCurrentMode] = useState<"focus" | "break" | "longBreak">("focus");
  const [activeTab, setActiveTab] = useState('personal');
  const [hasActiveParty, setHasActiveParty] = useState(false);
  const { user } = useAuth();
  
  // User fish count
  const [userFish, setUserFish] = useState(() => {
    return parseInt(localStorage.getItem("meowdoro-user-fish") || "0", 10);
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
  const { soundPlaying, playSound } = useBackgroundSounds();
  
  // Save user fish to localStorage
  const updateUserFish = (newCount: number) => {
    setUserFish(newCount);
    localStorage.setItem("meowdoro-user-fish", newCount.toString());
  };
  
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
  
  // Handle timer completion
  const handleTimerComplete = () => {
    setTimerCompleted(true);
    
    // Only increment total focus minutes when a focus session completes
    if (currentMode === "focus") {
      const newTotal = totalFocusMinutes + focusMinutes;
      setTotalFocusMinutes(newTotal);
      
      // Save the focus minutes along with the current date
      localStorage.setItem("meowdoro-focus-minutes", newTotal.toString());
      localStorage.setItem("meowdoro-focus-date", new Date().toDateString());
      
      // Award fish for completed focus session (1 fish per full 25 minutes)
      if (focusMinutes >= 25) {
        const fishEarned = Math.floor(focusMinutes / 25);
        const newFishCount = userFish + fishEarned;
        updateUserFish(newFishCount);
        
        toast({
          title: `Focus session completed! +${fishEarned} fish`,
          description: `You've focused for ${newTotal} minutes today.`,
        });
        
        // Also show a sonner toast for fish
        toast.success(`You earned ${fishEarned} fish! 🐟`, {
          description: "Use them in the Shop to customize your experience."
        });
      } else {
        toast({
          title: "Focus session completed!",
          description: `You've focused for ${newTotal} minutes today.`,
        });
      }
    } else if (currentMode === "break") {
      toast({
        title: "Break completed!",
        description: "Time to get back to focusing.",
      });
    } else if (currentMode === "longBreak") {
      toast({
        title: "Long break completed!",
        description: "Ready for another productive focus session?",
      });
    }
  };
  
  // Handle timer updates
  const handleTimerUpdate = (seconds: number) => {
    setCurrentSeconds(seconds);
    
    // For stopwatch, increment focus time every minute
    if (!isCountdown && seconds % 60 === 0 && seconds > 0) {
      const additionalMinute = 1;
      const newTotal = totalFocusMinutes + additionalMinute;
      setTotalFocusMinutes(newTotal);
      
      // Save the focus minutes along with the current date
      localStorage.setItem("meowdoro-focus-minutes", newTotal.toString());
      localStorage.setItem("meowdoro-focus-date", new Date().toDateString());
    }
    
    setTimerCompleted(false);
  };
  
  // Handle mode changes (focus, break, long break)
  const handleModeChange = (mode: "focus" | "break" | "longBreak") => {
    setCurrentMode(mode);
  };
  
  // Toggle between countdown and stopwatch modes
  const toggleTimerMode = () => {
    setIsCountdown(!isCountdown);
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
    
    toast({
      title: "Timer settings saved",
      description: "Your Pomodoro settings have been updated.",
    });
  };
  
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
            {/* Fish count display */}
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Fish className="h-4 w-4 text-primary" />
              <span>{userFish} Fish</span>
            </div>
            
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
                setFocusMinutes={setFocusMinutes}
                setBreakMinutes={setBreakMinutes}
                setLongBreakMinutes={setLongBreakMinutes}
                setSessionsBeforeLongBreak={setSessionsBeforeLongBreak}
                setDailyGoal={setDailyGoal}
                setCompletionSound={setCompletionSound}
                setCustomYoutubeUrl={setCustomYoutubeUrl}
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
              onTimerUpdate={handleTimerUpdate}
              onModeChange={handleModeChange}
              soundUrl={completionSound}
            />
            
            {/* Progress bar */}
            <div className="mt-12 w-full max-w-lg mx-auto">
              <ProgressBar currentMinutes={totalFocusMinutes} goalMinutes={dailyGoal} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="party">
          <PartyTimer />
        </TabsContent>
      </Tabs>
      
      {/* AI Chat button */}
      <div className="fixed bottom-6 right-6">
        <MeowAIButton />
      </div>
    </div>
  );
};

export default Timer;
