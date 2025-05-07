
import React, { useState } from "react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Cat } from "lucide-react";

// Study tips for the cat to share
const studyTips = [
  "Use the Pomodoro technique: 25 minutes of focus, then a 5-minute break.",
  "Stay hydrated! Drink water regularly to keep your brain functioning optimally.",
  "Take short breaks to stretch and move around every 30 minutes.",
  "Put your phone on silent or in another room to minimize distractions.",
  "Try the 'two-minute rule' - if a task takes less than two minutes, do it now.",
  "Break large tasks into smaller, manageable chunks.",
  "Set specific goals for each study session.",
  "Study in a clean, well-lit environment.",
  "Use active recall instead of passive re-reading.",
  "Explain concepts out loud as if teaching someone else.",
  "Create mind maps to visualize connections between ideas.",
  "Get enough sleep - your brain consolidates learning during rest.",
  "Review your notes within 24 hours of taking them to improve retention.",
  "Use spaced repetition for long-term memory improvement.",
  "Play background sounds like white noise or instrumental music to mask distractions.",
  "Alternate between different subjects to maintain interest.",
  "Reward yourself after completing challenging tasks.",
  "Practice meditation or deep breathing to reduce stress before studying.",
  "Use colored pens or highlighters to organize information visually.",
  "Study difficult subjects when you're most alert."
];

interface CatCompanionProps {
  status: "sleeping" | "idle" | "happy" | "focused";
}

export const CatCompanion: React.FC<CatCompanionProps> = ({ status }) => {
  // Get a random tip when the component mounts
  const [tip, setTip] = useState(() => {
    const randomIndex = Math.floor(Math.random() * studyTips.length);
    return studyTips[randomIndex];
  });
  
  // Function to get a new random tip
  const getRandomTip = () => {
    let randomIndex = Math.floor(Math.random() * studyTips.length);
    
    // Make sure we don't get the same tip twice
    if (studyTips.length > 1) {
      const currentTip = tip;
      while (studyTips[randomIndex] === currentTip) {
        randomIndex = Math.floor(Math.random() * studyTips.length);
      }
    }
    
    setTip(studyTips[randomIndex]);
  };
  
  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className="text-5xl sm:text-6xl cursor-pointer hover:scale-110 hover:rotate-3 transition-all duration-300"
              onClick={getRandomTip}
              aria-label="Get study tip"
            >
              <Cat 
                className={`w-14 h-14 sm:w-16 sm:h-16 text-primary drop-shadow-lg
                  ${status === "sleeping" ? "opacity-50" : ""}
                  ${status === "happy" ? "text-primary animate-pulse-soft" : ""}
                  ${status === "focused" ? "text-primary" : ""}
                `}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs bg-card/90 backdrop-blur-sm border-primary/20">
            <p className="text-foreground">{tip}</p>
            <p className="text-xs text-muted-foreground mt-1">Click for another tip!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
