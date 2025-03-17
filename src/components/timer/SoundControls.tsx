
import React from "react";
import { Button } from "@/components/ui/button";
import { Umbrella, Volume2, VolumeX, Coffee, Bird } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SoundControlsProps {
  soundPlaying: string | null;
  onPlaySound: (soundType: string) => void;
}

export const SoundControls: React.FC<SoundControlsProps> = ({
  soundPlaying,
  onPlaySound,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Volume2 className="w-5 h-5" />
          {soundPlaying && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Focus Sounds</h4>
          <div className="flex flex-col gap-2">
            <Button 
              variant={soundPlaying === "rain" ? "default" : "outline"} 
              size="sm" 
              className="justify-start gap-2" 
              onClick={() => onPlaySound("rain")}
            >
              <Umbrella className="w-4 h-4" />
              Rain
            </Button>
            <Button 
              variant={soundPlaying === "cafe" ? "default" : "outline"} 
              size="sm" 
              className="justify-start gap-2" 
              onClick={() => onPlaySound("cafe")}
            >
              <Coffee className="w-4 h-4" />
              Cafe
            </Button>
            <Button 
              variant={soundPlaying === "birds" ? "default" : "outline"} 
              size="sm" 
              className="justify-start gap-2" 
              onClick={() => onPlaySound("birds")}
            >
              <Bird className="w-4 h-4" />
              Birds
            </Button>
            {soundPlaying && (
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start gap-2 text-destructive hover:text-destructive" 
                onClick={() => onPlaySound(soundPlaying)}
              >
                <VolumeX className="w-4 h-4" />
                Stop Sound
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
