
import React, { useState, useEffect } from "react";
import { TimerCircle } from "@/components/timer/TimerCircle";
import { ProgressBar } from "@/components/timer/ProgressBar";
import { CatCompanion } from "@/components/timer/CatCompanion";
import { SoundControls } from "@/components/timer/SoundControls";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Timer as TimerIcon, Clock, Settings } from "lucide-react";
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

const Timer: React.FC = () => {
  const [isCountdown, setIsCountdown] = useState(true);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(() => {
    return parseInt(localStorage.getItem("meowdoro-focus-minutes") || "0", 10);
  });
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [catStatus, setCatStatus] = useState<"sleeping" | "idle" | "happy" | "focused">("idle");
  const [timerCompleted, setTimerCompleted] = useState(false);
  const [soundPlaying, setSoundPlaying] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState<"focus" | "break" | "longBreak">("focus");
  
  // Pomodoro settings
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
  const isMobile = useIsMobile();
  
  const rainAudio = React.useRef<HTMLAudioElement | null>(null);
  const cafeAudio = React.useRef<HTMLAudioElement | null>(null);
  const birdsAudio = React.useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    rainAudio.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-distant-thunder-storm-1294.mp3");
    cafeAudio.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-coffee-shop-ambience-612.mp3");
    birdsAudio.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3");
    
    [rainAudio.current, cafeAudio.current, birdsAudio.current].forEach(audio => {
      if (audio) {
        audio.loop = true;
      }
    });
    
    return () => {
      [rainAudio.current, cafeAudio.current, birdsAudio.current].forEach(audio => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, []);
  
  useEffect(() => {
    // Set cat status based on timer state and mode
    if (timerCompleted) {
      setCatStatus("happy");
    } else if (currentMode === "break" || currentMode === "longBreak") {
      setCatStatus("idle");
    } else if (currentSeconds > 0 && isCountdown && currentMode === "focus") {
      setCatStatus("focused");
    } else {
      setCatStatus("idle");
    }
    
    if (totalFocusMinutes === 30 || totalFocusMinutes === 60 || totalFocusMinutes === 90) {
      setCatStatus("happy");
      setTimeout(() => {
        setCatStatus(currentMode === "focus" ? "focused" : "idle");
      }, 3000);
    }
  }, [timerCompleted, isCountdown, currentSeconds, totalFocusMinutes, currentMode]);
  
  const handleTimerComplete = () => {
    setTimerCompleted(true);
    
    // Only increment total focus minutes when a focus session completes
    if (currentMode === "focus") {
      const newTotal = totalFocusMinutes + focusMinutes;
      setTotalFocusMinutes(newTotal);
      localStorage.setItem("meowdoro-focus-minutes", newTotal.toString());
      
      toast({
        title: "Focus session completed!",
        description: `You've focused for ${newTotal} minutes today.`,
      });
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
    
    setCatStatus("happy");
    
    setTimeout(() => {
      setCatStatus(currentMode === "focus" ? "sleeping" : "idle");
    }, 5000);
  };
  
  const handleTimerUpdate = (seconds: number) => {
    setCurrentSeconds(seconds);
    
    if (!isCountdown && seconds % 60 === 0 && seconds > 0) {
      const additionalMinute = 1;
      const newTotal = totalFocusMinutes + additionalMinute;
      setTotalFocusMinutes(newTotal);
      localStorage.setItem("meowdoro-focus-minutes", newTotal.toString());
    }
    
    setTimerCompleted(false);
  };
  
  const handleModeChange = (mode: "focus" | "break" | "longBreak") => {
    setCurrentMode(mode);
  };
  
  const toggleTimerMode = () => {
    setIsCountdown(!isCountdown);
  };
  
  const playSound = (soundType: string) => {
    [rainAudio.current, cafeAudio.current, birdsAudio.current].forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    
    if (soundType === soundPlaying) {
      setSoundPlaying(null);
      return;
    }
    
    setSoundPlaying(soundType);
    
    switch(soundType) {
      case "rain":
        rainAudio.current?.play();
        break;
      case "cafe":
        cafeAudio.current?.play();
        break;
      case "birds":
        birdsAudio.current?.play();
        break;
      default:
        setSoundPlaying(null);
    }
  };
  
  const saveTimerSettings = () => {
    localStorage.setItem("meowdoro-focus-time", focusMinutes.toString());
    localStorage.setItem("meowdoro-break-time", breakMinutes.toString());
    localStorage.setItem("meowdoro-long-break-time", longBreakMinutes.toString());
    localStorage.setItem("meowdoro-sessions-before-long-break", sessionsBeforeLongBreak.toString());
    localStorage.setItem("meowdoro-daily-goal", dailyGoal.toString());
    
    toast({
      title: "Timer settings saved",
      description: "Your Pomodoro settings have been updated.",
    });
  };

  const SettingsContainer = isMobile ? Drawer : Dialog;
  const SettingsTrigger = isMobile ? DrawerTrigger : DialogTrigger;
  const SettingsContent = isMobile ? DrawerContent : DialogContent;
  const SettingsHeader = isMobile ? DrawerHeader : DialogHeader;
  const SettingsTitle = isMobile ? DrawerTitle : DialogTitle;
  const SettingsDescription = isMobile ? DrawerDescription : DialogDescription;
  const SettingsFooter = isMobile ? DrawerFooter : DialogFooter;
  const SettingsClose = isMobile ? DrawerClose : DialogClose;
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 page-transition">
      <div className="flex flex-col items-center">
        <div className="w-full flex justify-end space-x-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={toggleTimerMode}
            title={isCountdown ? "Switch to Stopwatch" : "Switch to Timer"}
          >
            {isCountdown ? (
              <Clock className="w-5 h-5" />
            ) : (
              <TimerIcon className="w-5 h-5" />
            )}
          </Button>
          
          <SoundControls 
            soundPlaying={soundPlaying} 
            onPlaySound={playSound} 
          />
          
          <SettingsContainer>
            <SettingsTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Settings className="w-5 h-5" />
              </Button>
            </SettingsTrigger>
            <SettingsContent>
              <SettingsHeader>
                <SettingsTitle>Pomodoro Settings</SettingsTitle>
                <SettingsDescription>
                  Customize your focus, break times and goals
                </SettingsDescription>
              </SettingsHeader>
              <div className="px-4 py-2 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="focus-time">Focus Time: {focusMinutes} minutes</Label>
                  </div>
                  <Slider
                    id="focus-time"
                    defaultValue={[focusMinutes]}
                    max={60}
                    min={5}
                    step={5}
                    onValueChange={(value) => setFocusMinutes(value[0])}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="break-time">Short Break: {breakMinutes} minutes</Label>
                  </div>
                  <Slider
                    id="break-time"
                    defaultValue={[breakMinutes]}
                    max={15}
                    min={1}
                    step={1}
                    onValueChange={(value) => setBreakMinutes(value[0])}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="long-break-time">Long Break: {longBreakMinutes} minutes</Label>
                  </div>
                  <Slider
                    id="long-break-time"
                    defaultValue={[longBreakMinutes]}
                    max={30}
                    min={5}
                    step={5}
                    onValueChange={(value) => setLongBreakMinutes(value[0])}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sessions-before-long-break">
                      Sessions before long break: {sessionsBeforeLongBreak}
                    </Label>
                  </div>
                  <Slider
                    id="sessions-before-long-break"
                    defaultValue={[sessionsBeforeLongBreak]}
                    max={8}
                    min={2}
                    step={1}
                    onValueChange={(value) => setSessionsBeforeLongBreak(value[0])}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="daily-goal">Daily Goal: {dailyGoal} minutes</Label>
                  </div>
                  <Slider
                    id="daily-goal"
                    defaultValue={[dailyGoal]}
                    max={180}
                    min={30}
                    step={30}
                    onValueChange={(value) => setDailyGoal(value[0])}
                  />
                </div>
              </div>
              <SettingsFooter>
                <Button onClick={saveTimerSettings}>Save Settings</Button>
                <SettingsClose asChild>
                  <Button variant="outline">Cancel</Button>
                </SettingsClose>
              </SettingsFooter>
            </SettingsContent>
          </SettingsContainer>
        </div>
        
        <TimerCircle 
          initialMinutes={focusMinutes}
          breakMinutes={breakMinutes}
          longBreakMinutes={longBreakMinutes}
          sessionsBeforeLongBreak={sessionsBeforeLongBreak}
          isCountdown={isCountdown}
          onTimerComplete={handleTimerComplete}
          onTimerUpdate={handleTimerUpdate}
          onModeChange={handleModeChange}
        />
        
        <div className="mt-12 w-full max-w-lg mx-auto">
          <ProgressBar currentMinutes={totalFocusMinutes} goalMinutes={dailyGoal} />
        </div>
      </div>
      
      <div className="fixed bottom-6 right-6">
        <CatCompanion status={catStatus} />
      </div>
    </div>
  );
};

export default Timer;
