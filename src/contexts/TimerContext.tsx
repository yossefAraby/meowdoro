import React, { createContext, useContext, useState, useEffect } from 'react';

interface TimerContextType {
  timeRemaining: number;
  isActive: boolean;
  isCompleted: boolean;
  currentMode: 'focus' | 'break' | 'longBreak';
  completedSessions: number;
  setTimeRemaining: (time: number) => void;
  setIsActive: (active: boolean) => void;
  setIsCompleted: (completed: boolean) => void;
  setCurrentMode: (mode: 'focus' | 'break' | 'longBreak') => void;
  setCompletedSessions: (sessions: number) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or defaults
  const [timeRemaining, setTimeRemaining] = useState(() => {
    try {
      const saved = localStorage.getItem('timerState');
      if (saved) {
        const parsed = JSON.parse(saved);
        return typeof parsed.timeRemaining === 'number' && !isNaN(parsed.timeRemaining) 
          ? parsed.timeRemaining 
          : 0;
      }
    } catch (e) {
      console.error('Error loading timer state:', e);
    }
    return 0;
  });

  const [isActive, setIsActive] = useState(() => {
    try {
      const saved = localStorage.getItem('timerState');
      return saved ? JSON.parse(saved).isActive : false;
    } catch (e) {
      console.error('Error loading timer state:', e);
      return false;
    }
  });

  const [isCompleted, setIsCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem('timerState');
      return saved ? JSON.parse(saved).isCompleted : false;
    } catch (e) {
      console.error('Error loading timer state:', e);
      return false;
    }
  });

  const [currentMode, setCurrentMode] = useState<'focus' | 'break' | 'longBreak'>(() => {
    try {
      const saved = localStorage.getItem('timerState');
      return saved ? JSON.parse(saved).currentMode : 'focus';
    } catch (e) {
      console.error('Error loading timer state:', e);
      return 'focus';
    }
  });

  const [completedSessions, setCompletedSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('timerState');
      return saved ? JSON.parse(saved).completedSessions : 0;
    } catch (e) {
      console.error('Error loading timer state:', e);
      return 0;
    }
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      const timerState = {
        timeRemaining: typeof timeRemaining === 'number' && !isNaN(timeRemaining) ? timeRemaining : 0,
        isActive,
        isCompleted,
        currentMode,
        completedSessions,
      };
      localStorage.setItem('timerState', JSON.stringify(timerState));
    } catch (e) {
      console.error('Error saving timer state:', e);
    }
  }, [timeRemaining, isActive, isCompleted, currentMode, completedSessions]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        // Page is hidden, pause the timer
        setIsActive(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive]);

  return (
    <TimerContext.Provider
      value={{
        timeRemaining,
        isActive,
        isCompleted,
        currentMode,
        completedSessions,
        setTimeRemaining,
        setIsActive,
        setIsCompleted,
        setCurrentMode,
        setCompletedSessions,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}; 