
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TimerCircle } from "@/components/timer/TimerCircle";
import { TimerSettings } from "@/components/timer/TimerSettings";
import { ProgressBar } from "@/components/timer/ProgressBar";
import { CatCompanion } from "@/components/timer/CatCompanion";
import { SoundControls } from "@/components/timer/SoundControls";
import { AudioControls, useBackgroundSounds } from "@/components/timer/AudioControls";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, SkipForward, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FrontEndGuide from "@/components/guide/FrontEndGuide";

// Type definitions
type TimerMode = "focus" | "shortBreak" | "longBreak";

// Component
const Timer: React.FC = () => {
  // State for timer control
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<TimerMode>("focus");
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettingsCard, setShowSettingsCard] = useState(false);
  const { toast } = useToast();
  const { soundPlaying, playSound } = useBackgroundSounds();

  // Timer settings
  const [focusDuration, setFocusDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4);
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [autoStartFocus, setAutoStartFocus] = useState(false);

  // Manage time left when timer mode or duration settings change
  useEffect(() => {
    if (!isRunning) {
      if (timerMode === "focus") {
        setTimeLeft(focusDuration * 60);
      } else if (timerMode === "shortBreak") {
        setTimeLeft(shortBreakDuration * 60);
      } else {
        setTimeLeft(longBreakDuration * 60);
      }
    }
  }, [
    timerMode,
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    isRunning,
  ]);

  // Timer tick logic
  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Timer completed
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  // Handle timer completion
  const handleTimerComplete = () => {
    setIsRunning(false);

    const notificationMessage =
      timerMode === "focus"
        ? "Focus session complete! Take a break."
        : "Break time over! Ready to focus?";

    toast({
      title: "Timer Complete",
      description: notificationMessage,
    });

    // Update session count and next mode
    if (timerMode === "focus") {
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);

      // Determine if it's time for a long break
      if (newCompletedSessions % sessionsBeforeLongBreak === 0) {
        setTimerMode("longBreak");
        if (autoStartBreaks) setIsRunning(true);
      } else {
        setTimerMode("shortBreak");
        if (autoStartBreaks) setIsRunning(true);
      }
    } else {
      // After any break, go back to focus mode
      setTimerMode("focus");
      if (autoStartFocus) setIsRunning(true);
    }
  };

  // Start or pause timer
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // Skip to next mode
  const skipToNextMode = () => {
    setIsRunning(false);

    // Cycle: focus -> shortBreak/longBreak -> focus
    if (timerMode === "focus") {
      // Determine if it's time for a long break
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);

      if (newCompletedSessions % sessionsBeforeLongBreak === 0) {
        setTimerMode("longBreak");
      } else {
        setTimerMode("shortBreak");
      }
    } else {
      setTimerMode("focus");
    }
  };

  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const calculateProgress = (): number => {
    let totalDuration;
    if (timerMode === "focus") {
      totalDuration = focusDuration * 60;
    } else if (timerMode === "shortBreak") {
      totalDuration = shortBreakDuration * 60;
    } else {
      totalDuration = longBreakDuration * 60;
    }

    return ((totalDuration - timeLeft) / totalDuration) * 100;
  };

  // Toggle between countdown timer and stopwatch
  const [isCountdown, setIsCountdown] = useState(true);
  const toggleTimerMode = () => {
    setIsCountdown(!isCountdown);
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 flex flex-col items-center gap-8 px-4 page-transition">
      <div className="w-full max-w-3xl">
        <Tabs
          defaultValue="timer"
          className="w-full"
          onValueChange={(value) => {
            if (value === "settings") {
              setShowSettingsCard(true);
            } else {
              setShowSettingsCard(false);
            }
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="timer" className="relative">
                Timer
              </TabsTrigger>
              <TabsTrigger value="settings" className="relative">
                <Settings className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center font-medium text-sm">
              <span>Sessions: {completedSessions}</span>
            </div>
          </div>
          
          <TabsContent value="timer" className="space-y-8">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex justify-center">
                  <span className="text-2xl">
                    {timerMode === "focus"
                      ? "Focus Time"
                      : timerMode === "shortBreak"
                      ? "Short Break"
                      : "Long Break"}
                  </span>
                </CardTitle>
                <CardDescription className="flex justify-center">
                  {timerMode === "focus"
                    ? "Stay focused on your task"
                    : "Take a break and relax"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative mb-4">
                  <TimerCircle progress={calculateProgress()} />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold">
                    {formatTime(timeLeft)}
                  </div>
                </div>
                
                <ProgressBar 
                  currentMinutes={focusDuration - Math.floor(timeLeft / 60)}
                  goalMinutes={90}
                />
                
                <div className="flex items-center justify-center gap-4 my-6">
                  <Button
                    size="lg"
                    onClick={toggleTimer}
                    className="px-5 h-12 w-12 rounded-full"
                  >
                    {isRunning ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-0.5" />
                    )}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={skipToNextMode}
                    className="px-5 h-12 w-12 rounded-full"
                  >
                    <SkipForward className="h-6 w-6" />
                  </Button>
                </div>
                
                <CatCompanion 
                  status={isRunning ? "focused" : timerMode === "focus" ? "idle" : "happy"} 
                />
              </CardContent>
            </Card>

            {/* Sound controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="w-full flex justify-center">
                <AudioControls 
                  isCountdown={isCountdown}
                  toggleTimerMode={toggleTimerMode}
                  soundPlaying={soundPlaying}
                  onPlaySound={playSound}
                />
              </div>
              <div className="w-full flex justify-center">
                <SoundControls 
                  soundPlaying={soundPlaying}
                  onPlaySound={playSound}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            {showSettingsCard && (
              <TimerSettings
                focusMinutes={focusDuration}
                breakMinutes={shortBreakDuration}
                longBreakMinutes={longBreakDuration}
                sessionsBeforeLongBreak={sessionsBeforeLongBreak}
                dailyGoal={90}
                completionSound=""
                customYoutubeUrl=""
                setFocusMinutes={setFocusDuration}
                setBreakMinutes={setShortBreakDuration}
                setLongBreakMinutes={setLongBreakDuration}
                setSessionsBeforeLongBreak={setSessionsBeforeLongBreak}
                setDailyGoal={() => {}}
                setCompletionSound={() => {}}
                setCustomYoutubeUrl={() => {}}
                saveSettings={() => {
                  toast({
                    title: "Settings Saved",
                    description: "Your timer settings have been updated.",
                  });
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Front-End Guide */}
      <FrontEndGuide
        title="Timer Page"
        description="Guide for implementing the Pomodoro timer interface"
        colors={[
          { name: "Primary", value: "hsl(var(--primary))", description: "Used for buttons, progress indicators" },
          { name: "Background", value: "hsl(var(--background))", description: "Main page background" },
          { name: "Card", value: "hsl(var(--card))", description: "Timer card background" },
          { name: "Foreground", value: "hsl(var(--foreground))", description: "Main text color" },
          { name: "Muted", value: "hsl(var(--muted-foreground))", description: "Secondary text color" },
          { name: "Focus Color", value: "#3498db", description: "Focus mode indicator color" },
          { name: "Short Break Color", value: "#2ecc71", description: "Short break mode indicator color" },
          { name: "Long Break Color", value: "#9b59b6", description: "Long break mode indicator color" }
        ]}
        fonts={[
          { 
            name: "System Default", 
            family: "system-ui, sans-serif", 
            weights: ["400", "500", "600", "700", "800"],
            source: "System fonts"
          }
        ]}
        assets={[
          { 
            name: "Lucide Icons", 
            type: "icon", 
            source: "lucide-react", 
            description: "Icons used throughout the interface: Play, Pause, Skip, Settings, etc."
          },
          {
            name: "shadcn/ui Components",
            type: "icon",
            source: "shadcn/ui",
            description: "UI components like Button, Card, Tabs, etc."
          },
          {
            name: "Cat Images",
            type: "image",
            source: "src/assets/cat/*.svg",
            description: "SVG illustrations of cats in different states (focus, break, idle)"
          }
        ]}
        buildSteps={[
          "Install required dependencies: npm install lucide-react @radix-ui/react-tabs @radix-ui/react-slider",
          "Create the timer circle component to visualize progress",
          "Implement the progress bar component for linear visualization",
          "Set up the timer state management with useEffect for the countdown",
          "Create the cat companion component with different states",
          "Implement settings panel with adjustable durations",
          "Add sound controls for timer notifications",
          "Create YouTube audio integration for background sounds",
          "Implement session tracking and automatic mode switching",
          "Style with Tailwind CSS, focusing on visual hierarchy and feedback"
        ]}
        codeSnippets={[
          {
            title: "Timer State Management",
            language: "typescript",
            code: `// State for timer control
const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
const [isRunning, setIsRunning] = useState(false);
const [timerMode, setTimerMode] = useState<TimerMode>("focus");

// Timer tick logic
useEffect(() => {
  let interval: number | undefined;

  if (isRunning && timeLeft > 0) {
    interval = window.setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
  } else if (isRunning && timeLeft === 0) {
    // Timer completed
    handleTimerComplete();
  }

  return () => {
    if (interval) clearInterval(interval);
  };
}, [isRunning, timeLeft]);`,
            description: "Core timer functionality with React state and effects"
          },
          {
            title: "Progress Calculation",
            language: "typescript",
            code: `// Calculate progress percentage
const calculateProgress = (): number => {
  let totalDuration;
  if (timerMode === "focus") {
    totalDuration = focusDuration * 60;
  } else if (timerMode === "shortBreak") {
    totalDuration = shortBreakDuration * 60;
  } else {
    totalDuration = longBreakDuration * 60;
  }

  return ((totalDuration - timeLeft) / totalDuration) * 100;
};`,
            description: "Function to calculate progress percentage for visual indicators"
          }
        ]}
        additionalNotes="The Timer page is the core functional component of the Meowdoro app, implementing the Pomodoro technique. The design focuses on clear visualization of the current timer state, with multiple progress indicators (circle and bar) for at-a-glance understanding. The cat companion provides visual feedback about the current mode, and settings are easily accessible but not distracting from the main timer interface."
      />
    </div>
  );
};

export default Timer;
