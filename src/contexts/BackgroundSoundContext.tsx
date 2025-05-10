import React, { createContext, useContext, useState, useEffect } from "react";

// Global audio elements to ensure they persist between renders
let rainAudio: HTMLAudioElement | null = null;
let cafeAudio: HTMLAudioElement | null = null;
let birdsAudio: HTMLAudioElement | null = null;
let currentVolume = 0.5;
let currentlyPlaying: string | null = null;

interface BackgroundSoundContextType {
  soundPlaying: string | null;
  playSound: (soundType: string | null) => void;
  volume: number;
  setVolume: (v: number) => void;
}

const BackgroundSoundContext = createContext<BackgroundSoundContextType | undefined>(undefined);

// Initialize audio elements outside of React lifecycle
function initializeAudio() {
  if (!rainAudio) {
    rainAudio = new Audio("/sounds/rain.mp3");
    rainAudio.loop = true;
  }
  
  if (!cafeAudio) {
    cafeAudio = new Audio("/sounds/cafe.mp3");
    cafeAudio.loop = true;
  }
  
  if (!birdsAudio) {
    birdsAudio = new Audio("/sounds/bird.mp3");
    birdsAudio.loop = true;
  }
  
  // Get saved volume from localStorage
  const savedVolume = localStorage.getItem("meowdoro-sound-volume");
  if (savedVolume) {
    currentVolume = parseFloat(savedVolume);
  }
  
  // Set volume for all audio elements
  [rainAudio, cafeAudio, birdsAudio].forEach(audio => {
    if (audio) {
      audio.volume = currentVolume;
    }
  });
}

// Initialize on script load
initializeAudio();

export const BackgroundSoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundPlaying, setSoundPlaying] = useState<string | null>(() => currentlyPlaying);
  const [volume, setVolumeState] = useState<number>(() => currentVolume);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllSounds();
    };
  }, []);
  
  const stopAllSounds = () => {
    [rainAudio, cafeAudio, birdsAudio].forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    currentlyPlaying = null;
  };
  
  const playSound = (soundType: string | null) => {
    // Stop all sounds first
    stopAllSounds();
    
    // If null or clicking the same sound, just stop it
    if (!soundType || soundType === currentlyPlaying) {
      setSoundPlaying(null);
      currentlyPlaying = null;
      return;
    }
    
    // Play the selected sound
    setSoundPlaying(soundType);
    currentlyPlaying = soundType;
    
    let audioToPlay: HTMLAudioElement | null = null;
    
    switch(soundType) {
      case "rain":
        audioToPlay = rainAudio;
        break;
      case "cafe":
        audioToPlay = cafeAudio;
        break;
      case "birds":
        audioToPlay = birdsAudio;
        break;
      default:
        setSoundPlaying(null);
        currentlyPlaying = null;
        return;
    }
    
    if (audioToPlay) {
      audioToPlay.volume = currentVolume;
      audioToPlay.play().catch(console.error);
    }
  };
  
  const setVolume = (newVolume: number) => {
    // Update state
    setVolumeState(newVolume);
    
    // Update global volume
    currentVolume = newVolume;
    
    // Save to localStorage
    localStorage.setItem("meowdoro-sound-volume", newVolume.toString());
    
    // Update all audio elements immediately
    [rainAudio, cafeAudio, birdsAudio].forEach(audio => {
      if (audio) {
        audio.volume = newVolume;
      }
    });
  };
  
  return (
    <BackgroundSoundContext.Provider value={{ 
      soundPlaying, 
      playSound, 
      volume, 
      setVolume 
    }}>
      {children}
    </BackgroundSoundContext.Provider>
  );
};

export const useBackgroundSounds = () => {
  const ctx = useContext(BackgroundSoundContext);
  if (!ctx) throw new Error("useBackgroundSounds must be used within a BackgroundSoundProvider");
  return ctx;
}; 