
import React, { useState } from "react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

// Study tips array
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
  "Study difficult subjects when you're most alert.",
  "Create flashcards for key concepts and review them regularly.",
  "Try studying in different locations to improve memory recall.",
  "Use the Feynman Technique: explain concepts in simple terms to test understanding.",
  "Set a timer to create a sense of urgency and improve focus.",
  "Take regular exercise to boost brain function and reduce stress.",
  "Use mnemonic devices to remember complex information.",
  "Create connections between new information and things you already know.",
  "Study with a partner to stay accountable and discuss concepts.",
  "Try the 'chunking' method to group related information.",
  "Write down your distracting thoughts to deal with later.",
  "Use online tools to block distracting websites during study time.",
  "Create a consistent study routine to build a productive habit.",
  "Review previous material before starting new topics.",
  "Try standing while studying to increase alertness.",
  "Keep healthy snacks nearby to maintain energy levels.",
  "Create a study playlist that helps you focus.",
  "Take brief power naps (15-20 minutes) when feeling mentally fatigued.",
  "Use visual aids like diagrams and flowcharts when possible.",
  "Practice past papers or sample questions under timed conditions.",
  "Schedule study sessions at the same time each day to build consistency.",
  "Use the SQ3R method: Survey, Question, Read, Recite, Review.",
  "Try the 50/10 rule: 50 minutes of focused work, 10 minutes of break.",
  "Study first thing in the morning when your mind is fresh.",
  "Set realistic expectations for each study session.",
  "Create a distraction-free zone dedicated solely to studying.",
  "Consider using aromatherapy (like peppermint or rosemary) to improve concentration.",
  "Practice self-care and maintain a healthy work-life balance.",
  "Use retrieval practice - quiz yourself regularly on the material.",
  "Try interleaving - mixing different topics rather than focusing on just one.",
  "Ask questions when you don't understand something.",
  "Create a 'done list' to track your accomplishments.",
  "Teach concepts to someone else to solidify your understanding.",
  "Start with the hardest subject when your energy is highest.",
  "Set specific, measurable goals for each study session.",
  "Try the 'Pomodoro' technique: 25 min focus, 5 min break, repeat.",
  "Review material right before sleep to help consolidation.",
  "Use a timer to create a sense of focus and urgency.",
  "Take proper breaks - move around, get fresh air, rest your eyes.",
  "Keep a small notebook for ideas that pop up while studying.",
  "Create a dedicated study space that your brain associates with focus.",
  "Use active learning techniques like summarizing and questioning.",
  "Try study buddies for accountability and different perspectives.",
  "Prioritize understanding over memorization when possible.",
  "Break large projects into smaller, manageable chunks.",
  "Regularly review and revise notes to strengthen memory.",
  "Stay hydrated - your brain needs water to function optimally.",
  "Get enough sleep - memory consolidation happens during rest.",
  "Use visual aids like mind maps and diagrams.",
  "Test yourself regularly instead of just re-reading material.",
  "Try different study environments to find what works best for you.",
  "Use the 'chunking' technique to group related information.",
  "Practice deep work - focused concentration without distractions.",
  "Create connections between new material and things you already know.",
  "Use spaced repetition to review material at optimal intervals.",
  "Try explaining complex concepts in simple terms.",
  "Reward yourself after completing challenging tasks.",
  "Use digital tools mindfully - they can help or hinder focus.",
  "Maintain a healthy diet with brain-boosting foods.",
  "Exercise regularly to improve cognitive function and reduce stress.",
  "Practice mindfulness to improve concentration and reduce anxiety.",
  "Set deadlines for yourself, even for small tasks.",
  "Use memory techniques like the Method of Loci for difficult material.",
  "Create a study routine that works with your natural energy levels.",
  "Use keyboard shortcuts and other productivity hacks.",
  "Take regular breaks to prevent burnout and maintain focus.",
  "Review material right before bedtime to enhance memory.",
  "Try color-coding your notes for better organization.",
  "Use the Feynman Technique: explain concepts simply to test understanding.",
  "Create a distraction list for thoughts that arise during study.",
  "Adjust your environment - lighting, temperature, noise level.",
  "Practice deliberate focus on one task at a time.",
  "Try standing or walking while reviewing material.",
  "Use positive affirmations to overcome study anxiety.",
  "Create a pre-study ritual to get your brain in focus mode.",
  "Alternate between subjects to maintain interest and energy.",
  "Do your most challenging work during your peak energy hours.",
  "Reflect on what you've learned after each study session.",
  "Maintain a growth mindset - see challenges as opportunities.",
  "Use retrieval practice by testing yourself frequently.",
  "Take care of your physical health to support cognitive function.",
  "Use analogies to understand and remember complex concepts.",
  "Remember your 'why' - keep your motivation visible.",
  "Focus on consistency rather than occasional marathon sessions."
];

interface CatCompanionProps {
  status: "sleeping" | "idle" | "happy" | "focused";
}

export const CatCompanion: React.FC<CatCompanionProps> = ({ status }) => {
  const [tip, setTip] = useState(() => {
    const randomIndex = Math.floor(Math.random() * studyTips.length);
    return studyTips[randomIndex];
  });
  
  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * studyTips.length);
    setTip(studyTips[randomIndex]);
  };
  
  let emoji = "😺";
  
  switch (status) {
    case "sleeping":
      emoji = "😴";
      break;
    case "happy":
      emoji = "😸";
      break;
    case "focused":
      emoji = "🧐";
      break;
    default:
      emoji = "😺";
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="text-4xl sm:text-5xl cursor-pointer hover:scale-110 hover:rotate-3 transition-all duration-300"
            onClick={getRandomTip}
          >
            {emoji}
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <p>{tip}</p>
          <p className="text-xs text-muted-foreground mt-1">Click for another tip!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
