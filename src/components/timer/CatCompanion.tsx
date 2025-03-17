
import React from "react";
import { cn } from "@/lib/utils";
import { Cat } from "lucide-react";

interface CatCompanionProps {
  status: "sleeping" | "idle" | "happy" | "focused";
  className?: string;
}

export const CatCompanion: React.FC<CatCompanionProps> = ({
  status = "idle",
  className
}) => {
  // Determine color and animation based on status
  const getIconProps = () => {
    switch (status) {
      case "sleeping":
        return { 
          color: "text-muted-foreground", 
          extraIcons: <div className="absolute -top-3 -right-2 text-sm opacity-70">💤</div>
        };
      case "happy":
        return { 
          color: "text-primary", 
          extraIcons: <div className="absolute -top-2 -right-2 text-sm">✨</div>
        };
      case "focused":
        return { 
          color: "text-primary", 
          extraIcons: <div className="absolute -top-2 -right-2 text-sm">💡</div>
        };
      case "idle":
      default:
        return { 
          color: "text-foreground", 
          extraIcons: null
        };
    }
  };
  
  const { color, extraIcons } = getIconProps();
  
  return (
    <div className={cn(
      "relative p-3 rounded-full shadow-md bg-background/50 backdrop-blur-sm",
      "animate-float transition-all duration-300",
      className
    )}>
      <Cat className={cn("h-8 w-8", color)} />
      {extraIcons}
    </div>
  );
};
