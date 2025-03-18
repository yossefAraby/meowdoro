
import React, { useState, useEffect, useRef } from "react";
import { TimerCircle } from "@/components/timer/TimerCircle";
import { ProgressBar } from "@/components/timer/ProgressBar";
import { CatCompanion } from "@/components/timer/CatCompanion";
import { SoundControls } from "@/components/timer/SoundControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Timer as TimerIcon, Clock, Settings, Music, Volume2 } from "lucide-react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  const [completionSound, setCompletionSound] = useState(() => {
    return localStorage.getItem("meowdoro-completion-sound") || "";
  });
  const [customYoutubeUrl, setCustomYoutubeUrl] = useState(() => {
    return localStorage.getItem("meowdoro-youtube-sound") || "";
  });
  
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
  
  // Audio references
  const rainAudio = useRef<HTMLAudioElement | null>(null);
  const cafeAudio = useRef<HTMLAudioElement | null>(null);
  const birdsAudio = useRef<HTMLAudioElement | null>(null);
  const youtubePlayer = useRef<HTMLIFrameElement | null>(null);
  
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
    localStorage.setItem("meowdoro-completion-sound", completionSound);
    localStorage.setItem("meowdoro-youtube-sound", customYoutubeUrl);
    
    toast({
      title: "Timer settings saved",
      description: "Your Pomodoro settings have been updated.",
    });
  };
  
  const testCustomSound = () => {
    if (completionSound) {
      const audio = new Audio(completionSound);
      audio.play().catch(err => {
        toast({
          title: "Sound Test Failed",
          description: "Unable to play this sound URL. Please check the URL and try again.",
          variant: "destructive"
        });
      });
    } else {
      toast({
        title: "No Custom Sound",
        description: "Please enter a valid sound URL first.",
        variant: "destructive"
      });
    }
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
            <SettingsContent className="max-w-md">
              <SettingsHeader>
                <SettingsTitle>Pomodoro Settings</SettingsTitle>
                <SettingsDescription>
                  Customize your focus, break times and goals
                </SettingsDescription>
              </SettingsHeader>
              
              <Tabs defaultValue="timer" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="timer">Timer</TabsTrigger>
                  <TabsTrigger value="sounds">Sounds</TabsTrigger>
                </TabsList>
                
                <TabsContent value="timer" className="space-y-6 mt-4 px-1">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="focus-time">Focus Time: {focusMinutes} minutes</label>
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
                      <label htmlFor="break-time">Short Break: {breakMinutes} minutes</label>
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
                      <label htmlFor="long-break-time">Long Break: {longBreakMinutes} minutes</label>
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
                      <label htmlFor="sessions-before-long-break">
                        Sessions before long break: {sessionsBeforeLongBreak}
                      </label>
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
                      <label htmlFor="daily-goal">Daily Goal: {dailyGoal} minutes</label>
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
                </TabsContent>
                
                <TabsContent value="sounds" className="space-y-6 mt-4 px-1">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Completion Sound URL</label>
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="Enter sound URL" 
                        value={completionSound}
                        onChange={(e) => setCompletionSound(e.target.value)}
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={testCustomSound}
                        title="Test Sound"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter a URL to an audio file that will play when the timer completes.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium">YouTube Sound URL</label>
                    <Input 
                      placeholder="Enter YouTube video URL" 
                      value={customYoutubeUrl}
                      onChange={(e) => setCustomYoutubeUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter a YouTube URL for background sound or completion notifications.
                    </p>
                  </div>
                  
                  {customYoutubeUrl && customYoutubeUrl.includes("youtube.com") && (
                    <div className="pt-2">
                      <p className="text-sm font-medium mb-2">YouTube Preview:</p>
                      <div className="aspect-video w-full rounded-md overflow-hidden">
                        <iframe
                          ref={youtubePlayer}
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${customYoutubeUrl.split("v=")[1]?.split("&")[0]}`}
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
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
          soundUrl={completionSound}
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
