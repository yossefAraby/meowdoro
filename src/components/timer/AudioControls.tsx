
import React, { useEffect, useRef } from "react";
import { Clock, Timer as TimerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SoundControls } from "@/components/timer/SoundControls";

interface AudioControlsProps {
  isCountdown: boolean;
  toggleTimerMode: () => void;
  soundPlaying: string | null;
  onPlaySound: (soundType: string) => void;
  children?: React.ReactNode;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  isCountdown,
  toggleTimerMode,
  soundPlaying,
  onPlaySound,
  children
}) => {
  return (
    <div className="w-full flex justify-end space-x-4 mb-6">
      {/* Timer mode toggle button */}
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
      
      {/* Sound controls */}
      <SoundControls 
        soundPlaying={soundPlaying} 
        onPlaySound={onPlaySound} 
      />
      
      {/* Additional controls */}
      {children}
    </div>
  );
};

// A custom hook to manage background sounds
export const useBackgroundSounds = () => {
  const [soundPlaying, setSoundPlaying] = React.useState<string | null>(null);
  
  // Audio references
  const rainAudio = useRef<HTMLAudioElement | null>(null);
  const cafeAudio = useRef<HTMLAudioElement | null>(null);
  const birdsAudio = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio elements
  useEffect(() => {
    rainAudio.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-distant-thunder-storm-1294.mp3");
    cafeAudio.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-coffee-shop-ambience-612.mp3");
    birdsAudio.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3");
    
    // Set all audio to loop
    [rainAudio.current, cafeAudio.current, birdsAudio.current].forEach(audio => {
      if (audio) {
        audio.loop = true;
      }
    });
    
    // Cleanup function
    return () => {
      [rainAudio.current, cafeAudio.current, birdsAudio.current].forEach(audio => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, []);
  
  // Function to play/stop sounds
  const playSound = (soundType: string) => {
    // Stop all sounds first
    [rainAudio.current, cafeAudio.current, birdsAudio.current].forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    
    // If clicking the same sound, just stop it
    if (soundType === soundPlaying) {
      setSoundPlaying(null);
      return;
    }
    
    // Play the selected sound
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
  
  return {
    soundPlaying,
    playSound
  };
};
