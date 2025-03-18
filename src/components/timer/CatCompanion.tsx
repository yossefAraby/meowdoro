
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Cat } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Study tips array with 100 tips
const STUDY_TIPS = [
  "Use the Pomodoro technique: 25 minutes of focus followed by a 5-minute break.",
  "Drink water regularly to stay hydrated during study sessions.",
  "Study in a clean, distraction-free environment.",
  "Take short breaks to stretch and move around.",
  "Review material before bedtime for better retention.",
  "Explain concepts out loud as if teaching someone else.",
  "Use mind maps to connect related concepts.",
  "Set specific, achievable goals for each study session.",
  "Listen to instrumental music or nature sounds while studying.",
  "Switch between different subjects to maintain engagement.",
  "Start with the most challenging material when your mind is fresh.",
  "Use color-coded notes to organize information visually.",
  "Try the 'chunking' technique for memorizing complex information.",
  "Practice retrieval by testing yourself regularly.",
  "Get adequate sleep before and after studying.",
  "Use flashcards for active recall practice.",
  "Create acronyms or mnemonic devices for difficult information.",
  "Try the Feynman technique: explain concepts in simple terms.",
  "Avoid multitasking - focus on one thing at a time.",
  "Study in natural light when possible.",
  "Review notes within 24 hours of taking them.",
  "Use the spaced repetition technique for long-term retention.",
  "Create a consistent study schedule.",
  "Take regular eye breaks using the 20-20-20 rule (look 20 feet away for 20 seconds every 20 minutes).",
  "Use analogies to relate new concepts to familiar ones.",
  "Practice active reading by highlighting and summarizing.",
  "Create a dedicated study space your brain associates with focus.",
  "Try standing while studying to increase alertness.",
  "Use visual cues and symbols in your notes.",
  "Rewrite complex notes in your own words.",
  "Study with a group to gain different perspectives.",
  "Use online resources to supplement your learning.",
  "Take practice tests under exam-like conditions.",
  "Learn keyboard shortcuts to work more efficiently.",
  "Reward yourself after completing study goals.",
  "Break large tasks into smaller, manageable chunks.",
  "Use sticky notes for important reminders and concepts.",
  "Try studying at different times to find your peak productivity hours.",
  "Limit social media use during study sessions.",
  "Use a noise-canceling app or headphones in noisy environments.",
  "Keep a study journal to track progress and insights.",
  "Apply what you learn to real-world scenarios.",
  "Use the 'question, answer, evidence' method when reading.",
  "Create a 'brain dump' before starting to clear your mind.",
  "Set a timer to create a sense of urgency.",
  "Use physical activity as a study break to boost blood flow to the brain.",
  "Try teaching the material to someone else.",
  "Use visualization techniques for abstract concepts.",
  "Take power naps (20 minutes) when feeling mentally tired.",
  "Create associations between new information and existing knowledge.",
  "Study similar subjects consecutively for connection building.",
  "Start with a brief review of previous material before new content.",
  "Create a distraction list for random thoughts that pop up.",
  "Use 'deep work' sessions - 90 minutes of uninterrupted focus.",
  "Try the 'popcorn method': alternate between focused work and brief movement.",
  "Keep your study materials organized and accessible.",
  "Learn your learning style (visual, auditory, kinesthetic) and adapt study methods.",
  "Use the 'rubber duck debugging' method: explain problems to an inanimate object.",
  "Create a 'done list' alongside your to-do list.",
  "Try studying in different locations to improve memory recall.",
  "Use white noise or ambient sounds to mask distractions.",
  "Practice gratitude before studying to put your mind in a positive state.",
  "Create concept diagrams to visualize relationships between ideas.",
  "Use the 'five more' rule: do five more minutes, problems, or pages when tired.",
  "Try reverse outlining after writing to check for logical flow.",
  "Use the 'forced productivity' technique: set a timer for just 5 minutes of work.",
  "Keep healthy snacks nearby during long study sessions.",
  "Study with proper posture to prevent fatigue and discomfort.",
  "Create personal examples for abstract concepts.",
  "Use the 'focused-diffuse' technique: alternate between focused work and relaxation.",
  "Try studying in natural settings occasionally.",
  "Record yourself explaining difficult concepts and listen back.",
  "Create a pre-study ritual to signal to your brain it's time to focus.",
  "Keep a glass of water nearby during study sessions.",
  "Use hand-writing for better memory encoding when appropriate.",
  "Try the 'scan, question, read, recite, review' (SQ3R) reading method.",
  "Block distracting websites during study sessions.",
  "Explain your mistakes when practicing problems.",
  "Create 'if-then' plans for potential distractions.",
  "Use text-to-speech tools to listen to materials while resting your eyes.",
  "Schedule tasks according to your energy levels throughout the day.",
  "Try the '50/10 rule': 50 minutes of focus followed by 10 minutes of rest.",
  "Make studying a social activity when appropriate.",
  "Use gamification to make studying more engaging.",
  "Create a 'curiosity list' of questions while studying to research later.",
  "Try the 'interleaving' technique: mix different problems or subjects.",
  "Use cognitive offloading: write things down instead of trying to remember everything.",
  "Track your productivity patterns over time.",
  "Create summary sheets for each subject or chapter.",
  "Study first thing in the morning when willpower is highest.",
  "Take a walk before studying to increase alertness.",
  "Use humor to make difficult material more memorable.",
  "Try meditating briefly before studying to clear your mind.",
  "Create a growth mindset by viewing challenges as opportunities.",
  "Practice deliberate focus on one task without switching.",
  "Keep your study area at a comfortable temperature.",
  "Identify and eliminate recurring distractions.",
  "Try studying before or after exercise when your brain is active.",
  "Create visual timelines for historical or sequential information.",
  "Use positive affirmations to boost confidence before difficult subjects."
];

interface CatCompanionProps {
  status: "sleeping" | "idle" | "happy" | "focused";
  className?: string;
}

export const CatCompanion: React.FC<CatCompanionProps> = ({
  status = "idle",
  className
}) => {
  const [tip, setTip] = useState(() => {
    // Select a random tip on initial render
    const randomIndex = Math.floor(Math.random() * STUDY_TIPS.length);
    return STUDY_TIPS[randomIndex];
  });
  
  // Get a new random tip
  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * STUDY_TIPS.length);
    setTip(STUDY_TIPS[randomIndex]);
  };
  
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "relative p-4 rounded-full shadow-md bg-background/60 backdrop-blur-sm",
              "animate-float transition-all duration-300 hover:scale-110 cursor-help",
              className
            )}
            onMouseEnter={getRandomTip}
          >
            <Cat className={cn("h-10 w-10", getColor())} />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="max-w-xs p-4 text-center">
          <p>{tip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
