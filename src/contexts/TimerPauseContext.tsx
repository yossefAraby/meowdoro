import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface TimerPauseContextType {
  registerPause: () => void;
  registerModeSwitch: () => void;
}

const TimerPauseContext = createContext<TimerPauseContextType | undefined>(undefined);

export const TimerPauseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const location = useLocation();
  
  // Use refs to track notification state and prevent spam
  const hasShownNotificationRef = useRef(false);
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Called when user manually pauses timer
  const registerPause = useCallback(() => {
    // Reset notification state when user manually pauses
    hasShownNotificationRef.current = false;
  }, []);

  // Called when user switches timer mode
  const registerModeSwitch = useCallback(() => {
    // Reset notification state when user switches modes
    hasShownNotificationRef.current = false;
  }, []);

  // Check timer status from localStorage
  const checkTimerStatus = useCallback(() => {
    const timerActive = localStorage.getItem("meowdoro-timer-active") === "true";
    const stopwatchActive = localStorage.getItem("meowdoro-stopwatch-active") === "true";
    const isActive = timerActive || stopwatchActive;
    
    // Only show notification if timer is active and we're not on the timer page
    const isNotOnTimerPage = location.pathname !== "/timer";
    
    console.log("Global TimerPause - Checking conditions:", { 
      timerActive: isActive, 
      currentPath: location.pathname,
      shouldShow: isActive && isNotOnTimerPage,
      hasShownNotification: hasShownNotificationRef.current
    });
    
    if (isActive && isNotOnTimerPage && !hasShownNotificationRef.current) {
      console.log("Global TimerPause - Showing notification");
      
      // Show toast notification
      toast({
        title: "Timer is paused",
        description: "The timer will continue running once you return to the timer page.",
        duration: 5000,
        variant: "default",
      });
      
      // Mark that we've shown the notification
      hasShownNotificationRef.current = true;
      
      // Reset the notification state after 1 minute to allow showing again if still away
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current);
      }
      
      notificationTimerRef.current = setTimeout(() => {
        hasShownNotificationRef.current = false;
      }, 60000); // 1 minute cooldown
    } else if (!isActive || !isNotOnTimerPage) {
      // Reset notification state when timer is no longer active or we're back on timer page
      hasShownNotificationRef.current = false;
      
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current);
        notificationTimerRef.current = null;
      }
    }
  }, [location.pathname, toast]);

  // Setup effects to check timer status
  useEffect(() => {
    console.log("Global TimerPause - Location changed:", location.pathname);
    checkTimerStatus();
  }, [checkTimerStatus, location.pathname]);

  // Listen for storage events to detect timer changes from other tabs/components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "meowdoro-timer-active" || e.key === "meowdoro-stopwatch-active") {
        console.log("Global TimerPause - Storage changed:", e.key, e.newValue);
        checkTimerStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Poll less frequently (every 3 seconds) to reduce unnecessary checks
    const intervalId = setInterval(checkTimerStatus, 3000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
      
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current);
      }
    };
  }, [checkTimerStatus]);

  return (
    <TimerPauseContext.Provider value={{ registerPause, registerModeSwitch }}>
      {children}
    </TimerPauseContext.Provider>
  );
};

export const useTimerPause = () => {
  const context = useContext(TimerPauseContext);
  if (context === undefined) {
    throw new Error('useTimerPause must be used within a TimerPauseProvider');
  }
  return context;
}; 