
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import { TimerCircle } from "@/components/timer/TimerCircle";
import { TimerSettings } from "@/components/timer/TimerSettings";
import { ProgressBar } from "@/components/timer/ProgressBar";
import { CatCompanion } from "@/components/timer/CatCompanion";
import { SoundControls } from "@/components/timer/SoundControls";
import { Button } from "@/components/ui/button";
import { AudioControls } from "@/components/timer/AudioControls";
import { Settings, Users } from "lucide-react";
import { PartyTimer } from "@/components/timer/PartyTimer";
import { format } from "date-fns";

// Default timer settings
const defaultSettings = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  autoStartBreaks: true,
  autoStartPomodoros: false,
  longBreakInterval: 4,
};

const Timer: React.FC = () => {
  // States
  const [timerMode, setTimerMode] = useState("pomodoro");  
  const [timerSettings, setTimerSettings] = useState(defaultSettings);
  const [isPaused, setIsPaused] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(timerSettings.pomodoro * 60);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(timerSettings.pomodoro * 60);
  const [showSettings, setShowSettings] = useState(false);
  const [catStatus, setCatStatus] = useState<"idle" | "focused" | "happy">("idle");
  const [activeTab, setActiveTab] = useState("solo");
  
  // Update the time remaining when the settings change
  useEffect(() => {
    let seconds = 0;
    
    switch (timerMode) {
      case "pomodoro":
        seconds = timerSettings.pomodoro * 60;
        break;
      case "short-break":
        seconds = timerSettings.shortBreak * 60;
        break;
      case "long-break":
        seconds = timerSettings.longBreak * 60;
        break;
      default:
        seconds = timerSettings.pomodoro * 60;
    }
    
    setTimeRemaining(seconds);
    setTotalSeconds(seconds);
    
  }, [timerMode, timerSettings]);
  
  // Timer effect
  useEffect(() => {
    let interval: number | undefined;
    
    if (!isPaused && timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
      
      // Update cat status to focused during active pomodoro
      if (timerMode === "pomodoro") {
        setCatStatus("focused");
      } else {
        setCatStatus("happy");
      }
    } else if (timeRemaining === 0) {
      // Timer completed
      handleTimerComplete();
    } else {
      setCatStatus("idle");
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaused, timeRemaining, timerMode]);
  
  // Save completed pomodoro sessions to localStorage
  useEffect(() => {
    const savedCompletedPomodoros = localStorage.getItem("meowdoro-completed-pomodoros");
    if (savedCompletedPomodoros) {
      setCompletedPomodoros(parseInt(savedCompletedPomodoros, 10));
    }
  }, []);
  
  // Handle timer completion
  const handleTimerComplete = () => {
    // Play notification sound (to be implemented)
    setIsPaused(true);
    
    if (timerMode === "pomodoro") {
      // Track focus time in localStorage for statistics
      const focusMinutes = timerSettings.pomodoro;
      const currentFocusMinutes = parseInt(localStorage.getItem("meowdoro-focus-minutes") || "0", 10);
      localStorage.setItem("meowdoro-focus-minutes", (currentFocusMinutes + focusMinutes).toString());
      
      // Track the date for this session
      const today = format(new Date(), "yyyy-MM-dd");
      const dailyFocusKey = `meowdoro-focus-${today}`;
      const dailyFocusMinutes = parseInt(localStorage.getItem(dailyFocusKey) || "0", 10);
      localStorage.setItem(dailyFocusKey, (dailyFocusMinutes + focusMinutes).toString());
      
      // Update completed pomodoros
      const newCompletedPomodoros = completedPomodoros + 1;
      setCompletedPomodoros(newCompletedPomodoros);
      localStorage.setItem("meowdoro-completed-pomodoros", newCompletedPomodoros.toString());
      
      // Check if daily goal is met (90 minutes)
      if (dailyFocusMinutes + focusMinutes >= 90) {
        const goalsMetCount = parseInt(localStorage.getItem("meowdoro-goals-met") || "0", 10);
        localStorage.setItem("meowdoro-goals-met", (goalsMetCount + 1).toString());
      }
      
      // Store the last session date
      localStorage.setItem("meowdoro-last-session", new Date().toISOString());
      
      // Determine which break to take
      const pomodorosUntilLongBreak = timerSettings.longBreakInterval;
      if ((newCompletedPomodoros % pomodorosUntilLongBreak) === 0) {
        // Time for a long break
        setTimerMode("long-break");
      } else {
        // Time for a short break
        setTimerMode("short-break");
      }
      
      // Auto-start breaks if enabled
      if (timerSettings.autoStartBreaks) {
        setIsPaused(false);
      }
    } else {
      // Break timer completed, switch back to pomodoro
      setTimerMode("pomodoro");
      
      // Auto-start pomodoros if enabled
      if (timerSettings.autoStartPomodoros) {
        setIsPaused(false);
      }
    }
  };
  
  // Calculate progress percentage
  const progressPercentage = ((totalSeconds - timeRemaining) / totalSeconds) * 100;
  
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 flex flex-col items-center page-transition">
      {/* Solo/Party tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full max-w-md mb-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="solo">
            Solo Timer
          </TabsTrigger>
          <TabsTrigger value="party" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Party Timer
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="solo" className="w-full">
          <Card className="border-t-0 rounded-tl-none">
            <CardContent className="pt-6">
              {/* Timer mode selector */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex bg-accent/50 rounded-lg p-1">
                  <Button
                    variant={timerMode === "pomodoro" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTimerMode("pomodoro")}
                    className={timerMode === "pomodoro" ? "" : "text-muted-foreground hover:text-foreground"}
                  >
                    Pomodoro
                  </Button>
                  <Button 
                    variant={timerMode === "short-break" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTimerMode("short-break")}
                    className={timerMode === "short-break" ? "" : "text-muted-foreground hover:text-foreground"}
                  >
                    Short Break
                  </Button>
                  <Button 
                    variant={timerMode === "long-break" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTimerMode("long-break")}
                    className={timerMode === "long-break" ? "" : "text-muted-foreground hover:text-foreground"}
                  >
                    Long Break
                  </Button>
                </div>
              </div>
              
              {/* Main timer circle */}
              <div className="flex justify-center mb-6">
                <TimerCircle 
                  timeRemaining={timeRemaining} 
                  isPaused={isPaused} 
                  setIsPaused={setIsPaused}
                  timerMode={timerMode}
                />
              </div>
              
              {/* Progress bar */}
              <div className="mb-6">
                <ProgressBar percentage={progressPercentage} />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>
                    {completedPomodoros} pomodoros today
                  </span>
                  <span>
                    {timerMode === "pomodoro" ? "Focus time" : "Break time"}
                  </span>
                </div>
              </div>
              
              {/* Sound controls + settings */}
              <div className="flex justify-between items-center">
                <AudioControls />
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Settings panel */}
              {showSettings && (
                <div className="mt-6">
                  <TimerSettings
                    settings={timerSettings}
                    onSettingsChange={setTimerSettings}
                    onClose={() => setShowSettings(false)}
                  />
                </div>
              )}
              
              {/* Sound controls */}
              {!showSettings && <SoundControls />}
              
              {/* Cat companion */}
              <div className="fixed bottom-6 right-6">
                <CatCompanion status={catStatus} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="party" className="w-full">
          <PartyTimer />
        </TabsContent>
      </Tabs>  
    </div>
  );
};

export default Timer;
