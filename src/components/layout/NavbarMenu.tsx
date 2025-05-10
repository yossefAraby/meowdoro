import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Timer, Clipboard, Users, Activity, Store, Cat } from "lucide-react";
import { cn } from "@/lib/utils";

export const navItems = [
  { path: "/timer", icon: Timer, label: "Timer" },
  { path: "/tasks", icon: Clipboard, label: "Notes" },
  { path: "/chat", icon: Cat, label: "Chat" },
  { path: "/party", icon: Users, label: "Party" },
  { path: "/shop", icon: Store, label: "Shop" },
];

export const NavbarMenu = () => {
  const location = useLocation();
  const [timerActive, setTimerActive] = useState(false);
  
  // Check if timer is active by looking at localStorage
  useEffect(() => {
    const checkTimerStatus = () => {
      const timerActive = localStorage.getItem("meowdoro-timer-active") === "true";
      const stopwatchActive = localStorage.getItem("meowdoro-stopwatch-active") === "true";
      setTimerActive(timerActive || stopwatchActive);
    };
    
    // Check immediately when component mounts
    checkTimerStatus();
    
    // Listen for storage events to detect changes from other tabs
    const handleStorageChange = () => {
      checkTimerStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Setup an interval to periodically check timer status
    const intervalId = setInterval(checkTimerStatus, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);
  
  return (
    <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 space-x-1">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-150 relative",
            location.pathname === item.path 
              ? "text-primary bg-accent/50" 
              : "text-foreground/60 hover:text-primary hover:bg-accent/30"
          )}
        >
          <item.icon className="w-5 h-5" />
          {item.path === "/timer" && timerActive && location.pathname !== "/timer" && (
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
          <span className="text-xs mt-1">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};
