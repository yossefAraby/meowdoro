
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
  
  // Cat SVG elements based on the current mood
  const renderCat = () => {
    switch (mood) {
      case "sleeping":
        return (
          <div className="relative">
            <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="60" cy="60" rx="40" ry="20" fill="currentColor" className="text-primary/20" />
              <path d="M40 40C40 40 50 25 60 25C70 25 80 40 80 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M45 35C45 35 50 30 60 30C70 30 75 35 75 35" fill="currentColor" />
              <ellipse cx="45" cy="45" rx="5" ry="3" fill="currentColor" />
              <ellipse cx="75" cy="45" rx="5" ry="3" fill="currentColor" />
              {/* Sleeping Z's */}
              <text x="85" y="25" fontSize="14" fontWeight="bold" fill="currentColor">Z</text>
              <text x="95" y="15" fontSize="10" fontWeight="bold" fill="currentColor">z</text>
              <text x="103" y="5" fontSize="6" fontWeight="bold" fill="currentColor">z</text>
              {/* Closed eyes */}
              <path d="M50 45 L60 45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M80 45 L70 45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        );
        
      case "happy":
        return (
          <div className="relative animate-float">
            <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="60" cy="60" rx="40" ry="20" fill="currentColor" className="text-primary/20" />
              <path d="M40 40C40 40 50 25 60 25C70 25 80 40 80 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M45 35C45 35 50 30 60 30C70 30 75 35 75 35" fill="currentColor" />
              <ellipse cx="45" cy="42" rx="5" ry="5" fill="currentColor" />
              <ellipse cx="75" cy="42" rx="5" ry="5" fill="currentColor" />
              <circle cx="45" cy="40" r="2" fill="white" />
              <circle cx="75" cy="40" r="2" fill="white" />
              {/* Happy mouth */}
              <path d="M55 55 Q60 65 65 55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              {/* Stars around the happy cat */}
              <path d="M20 20 L25 20 L22.5 15 L20 20 Z" fill="currentColor" />
              <path d="M90 25 L95 25 L92.5 20 L90 25 Z" fill="currentColor" />
              <path d="M105 40 L110 40 L107.5 35 L105 40 Z" fill="currentColor" />
            </svg>
          </div>
        );
        
      case "focused":
        return (
          <div className="relative">
            <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="60" cy="60" rx="40" ry="20" fill="currentColor" className="text-primary/20" />
              <path d="M40 40C40 40 50 25 60 25C70 25 80 40 80 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M45 35C45 35 50 30 60 30C70 30 75 35 75 35" fill="currentColor" />
              <ellipse cx="45" cy="42" rx="3" ry="5" fill="currentColor" />
              <ellipse cx="75" cy="42" rx="3" ry="5" fill="currentColor" />
              <circle cx="45" cy="40" r="1" fill="white" />
              <circle cx="75" cy="40" r="1" fill="white" />
              {/* Focused mouth */}
              <line x1="57" y1="55" x2="63" y2="55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        );
        
      case "idle":
      default:
        return (
          <div className="relative">
            <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="60" cy="60" rx="40" ry="20" fill="currentColor" className="text-primary/20" />
              <path d="M40 40C40 40 50 25 60 25C70 25 80 40 80 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M45 35C45 35 50 30 60 30C70 30 75 35 75 35" fill="currentColor" />
              <ellipse cx="45" cy="42" rx="5" ry="3" fill="currentColor" />
              <ellipse cx="75" cy="42" rx="5" ry="3" fill="currentColor" />
              <circle cx="45" cy="42" r="1" fill="white" />
              <circle cx="75" cy="42" r="1" fill="white" />
              {/* Neutral mouth */}
              <path d="M55 52 Q60 55 65 52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        );
    }
  };
  
  return (
    <div className={cn("transition-all duration-300", animation, className)}>
      {renderCat()}
    </div>
  );
};
