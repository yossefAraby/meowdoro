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
  const [focusMinutes, setFocusMinutes] = useState(() => {
    return parseInt(localStorage.getItem("meowdoro-focus-time") || "25", 10);
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
    rainAudio.current = new Audio("https://assets.coderrocketfuel.com/pomodoro-times-up.mp3");
    cafeAudio.current = new Audio("https://assets.coderrocketfuel.com/pomodoro-times-up.mp3");
    birdsAudio.current = new Audio("https://assets.coderrocketfuel.com/pomodoro-times-up.mp3");
    
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
    if (timerCompleted) {
      setCatStatus("happy");
    } else if (!isCountdown) {
      setCatStatus("idle");
    } else if (currentSeconds > 0 && isCountdown) {
      setCatStatus("focused");
    } else {
      setCatStatus("idle");
    }
    
    if (totalFocusMinutes === 30 || totalFocusMinutes === 60 || totalFocusMinutes === 90) {
      setCatStatus("happy");
      setTimeout(() => {
        setCatStatus(isCountdown ? "focused" : "idle");
      }, 3000);
    }
  }, [timerCompleted, isCountdown, currentSeconds, totalFocusMinutes]);
  
  const handleTimerComplete = () => {
    setTimerCompleted(true);
    
    const newTotal = totalFocusMinutes + focusMinutes;
    setTotalFocusMinutes(newTotal);
    localStorage.setItem("meowdoro-focus-minutes", newTotal.toString());
    
    toast({
      title: "Focus session completed!",
      description: `You've focused for ${newTotal} minutes today.`,
    });
    
    setCatStatus("happy");
    
    setTimeout(() => {
      setCatStatus("sleeping");
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
  
  const saveFocusSettings = () => {
    localStorage.setItem("meowdoro-focus-time", focusMinutes.toString());
    localStorage.setItem("meowdoro-daily-goal", dailyGoal.toString());
    
    toast({
      title: "Settings saved",
      description: `Focus time: ${focusMinutes} minutes, Daily goal: ${dailyGoal} minutes`,
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
                <SettingsTitle>Timer Settings</SettingsTitle>
                <SettingsDescription>
                  Adjust your focus time and daily goals
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
                <Button onClick={saveFocusSettings}>Save Settings</Button>
                <SettingsClose asChild>
                  <Button variant="outline">Cancel</Button>
                </SettingsClose>
              </SettingsFooter>
            </SettingsContent>
          </SettingsContainer>
        </div>
        
        <TimerCircle 
          initialMinutes={focusMinutes}
          isCountdown={isCountdown}
          onTimerComplete={handleTimerComplete}
          onTimerUpdate={handleTimerUpdate}
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
