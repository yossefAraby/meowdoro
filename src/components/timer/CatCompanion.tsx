
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
  // Determine color based on status
  const getColor = () => {
    switch (status) {
      case "sleeping":
        return "text-muted-foreground";
      case "happy":
      case "focused":
        return "text-primary";
      case "idle":
      default:
        return "text-foreground";
    }
  };
  
  return (
    <div className={cn(
      "relative p-3 rounded-full shadow-md bg-background/60 backdrop-blur-sm",
      "animate-float transition-all duration-300",
      className
    )}>
      <Cat className={cn("h-8 w-8", getColor())} />
    </div>
  );
};
