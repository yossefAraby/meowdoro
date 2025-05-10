import React, { useEffect, useRef } from "react";
import { Clock, Timer as TimerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SoundControls } from "@/components/timer/SoundControls";
import { useBackgroundSounds } from "@/contexts/BackgroundSoundContext";

interface AudioControlsProps {
  isCountdown: boolean;
  toggleTimerMode: () => void;
  soundPlaying: string | null;
  onPlaySound: (soundType: string) => void;
  volume: number;
  setVolume: (value: number) => void;
  children?: React.ReactNode;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  isCountdown,
  toggleTimerMode,
  soundPlaying,
  onPlaySound,
  volume,
  setVolume,
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
        volume={volume}
        onVolumeChange={setVolume}
      />
      
      {/* Additional controls */}
      {children}
    </div>
  );
};
