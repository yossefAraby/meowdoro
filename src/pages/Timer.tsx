
import React, { useState, useEffect } from "react";
import { TimerCircle } from "@/components/timer/TimerCircle";
import { ProgressBar } from "@/components/timer/ProgressBar";
import { CatCompanion } from "@/components/timer/CatCompanion";
import { SoundControls } from "@/components/timer/SoundControls";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Timer as TimerIcon, Clock } from "lucide-react";

const Timer: React.FC = () => {
  const [isCountdown, setIsCountdown] = useState(true);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(() => {
    return parseInt(localStorage.getItem("meowdoro-focus-minutes") || "0", 10);
  });
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [catStatus, setCatStatus] = useState<"sleeping" | "idle" | "happy" | "focused">("idle");
  const [timerCompleted, setTimerCompleted] = useState(false);
  const [soundPlaying, setSoundPlaying] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const rainAudio = React.useRef<HTMLAudioElement | null>(null);
  const cafeAudio = React.useRef<HTMLAudioElement | null>(null);
  const birdsAudio = React.useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    rainAudio.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-1253.mp3");
    cafeAudio.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-coffee-shop-ambience-583.mp3");
    birdsAudio.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-singing-58.mp3");
    
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
    
    const newTotal = totalFocusMinutes + 25;
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
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 page-transition">
      <div className="flex flex-col items-center">
        {/* Mode Toggle and Sound Controls */}
        <div className="w-full flex justify-end space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <Label htmlFor="timer-mode" className={!isCountdown ? "text-muted-foreground" : ""}>Timer</Label>
            <Switch 
              id="timer-mode" 
              checked={!isCountdown}
              onCheckedChange={toggleTimerMode}
            />
            <Label htmlFor="timer-mode" className={isCountdown ? "text-muted-foreground" : ""}>Stopwatch</Label>
          </div>
          
          <SoundControls 
            soundPlaying={soundPlaying} 
            onPlaySound={playSound} 
          />
        </div>
        
        <TimerCircle 
          initialMinutes={25}
          isCountdown={isCountdown}
          onTimerComplete={handleTimerComplete}
          onTimerUpdate={handleTimerUpdate}
        />
        
        <div className="mt-12 w-full">
          <ProgressBar currentMinutes={totalFocusMinutes} />
        </div>
      </div>
      
      <div className="fixed bottom-6 right-6">
        <CatCompanion status={catStatus} />
      </div>
    </div>
  );
};

export default Timer;
