
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CatCompanionProps {
  status: "sleeping" | "idle" | "happy" | "focused";
  className?: string;
}

export const CatCompanion: React.FC<CatCompanionProps> = ({
  status = "idle",
  className
}) => {
  const [mood, setMood] = useState(status);
  const [animation, setAnimation] = useState("");
  
  useEffect(() => {
    if (status !== mood) {
      // Add transition animation when status changes
      setAnimation("animate-pulse-soft");
      
      // Set the new mood after a brief delay
      const timer = setTimeout(() => {
        setMood(status);
        
        // Remove the animation after it completes
        setTimeout(() => {
          setAnimation("");
        }, 300);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [status, mood]);
  
  // Render cat emoji based on mood
  const renderCat = () => {
    const baseClass = "text-4xl transition-all duration-300";
    
    switch (mood) {
      case "sleeping":
        return (
          <div className="relative">
            <span className={cn(baseClass, "opacity-90")}>😴</span>
            <div className="absolute -top-4 -right-4 text-lg animate-float opacity-70">💤</div>
          </div>
        );
        
      case "happy":
        return (
          <div className="relative animate-float">
            <span className={cn(baseClass)}>😸</span>
            <div className="absolute -top-3 -right-3 text-lg animate-pulse-soft">✨</div>
          </div>
        );
        
      case "focused":
        return (
          <div className="relative">
            <span className={cn(baseClass)}>🐱</span>
            <div className="absolute -top-2 -right-2 text-sm">💡</div>
          </div>
        );
        
      case "idle":
      default:
        return (
          <div className="relative">
            <span className={cn(baseClass)}>🐈</span>
          </div>
        );
    }
  };
  
  return (
    <div className={cn("transition-all duration-300", animation, className, "bg-background/50 backdrop-blur-sm p-3 rounded-full shadow-md")}>
      {renderCat()}
    </div>
  );
};
