
import React, { useState } from "react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Cat, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

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

// AI cat responses for the chat
const catResponses = [
  "Meow! That's an interesting question. Based on productivity research, I'd suggest breaking that task into smaller parts.",
  "Purr-fect timing! I just read a study about that. The key is consistency and regular breaks.",
  "I'm feline good about your progress! Keep it up and remember to stay hydrated.",
  "Hmm, let me think... *paws for a moment* The research suggests setting specific, measurable goals for each session.",
  "According to neuroscience, your brain needs both focus and rest cycles. That's why the Pomodoro technique works so well!",
  "Meow-velous question! Time-blocking your calendar can help with that particular challenge.",
  "I'm pawsitive that you're making progress! Remember that learning is not linear - it's okay to have ups and downs.",
  "My whiskers tell me you need a quick break. Stand up, stretch, and then get back to it!",
  "The most effective students don't just re-read material - they test themselves on it! Try active recall instead.",
  "I've been lapping up knowledge about this! The key is to create connections between new and existing information.",
  "According to my cat-culations, your approach makes sense, but have you considered batching similar tasks together?",
  "Paw-don me, but have you tried the Eisenhower Matrix for prioritizing your tasks? It's quite effective!",
  "I'm not kitten around - consistent sleep schedules dramatically improve cognitive performance!",
  "My tail is twitching with excitement about your question! Research shows alternating study topics improves retention.",
  "Meow-nificent progress! Remember that even a few minutes of focused work is better than none."
];

interface CatCompanionProps {
  status: "sleeping" | "idle" | "happy" | "focused";
}

// Type for chat messages
interface ChatMessage {
  text: string;
  sender: "user" | "cat";
  timestamp: Date;
}

export const CatCompanion: React.FC<CatCompanionProps> = ({ status }) => {
  // Get a random tip when the component mounts
  const [tip, setTip] = useState(() => {
    const randomIndex = Math.floor(Math.random() * studyTips.length);
    return studyTips[randomIndex];
  });
  
  // State for chat functionality
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: "Hi there! I'm your Meowdoro study buddy. Ask me anything about productivity or studying!",
      sender: "cat",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  
  // Function to get a new random tip
  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * studyTips.length);
    setTip(studyTips[randomIndex]);
  };

  // Function to handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatInput.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      text: chatInput,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setChatInput("");
    
    // Simulate AI thinking
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * catResponses.length);
      const catMessage: ChatMessage = {
        text: catResponses[randomIndex],
        sender: "cat",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, catMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className="text-5xl sm:text-6xl cursor-pointer hover:scale-110 hover:rotate-3 transition-all duration-300"
              onClick={getRandomTip}
              aria-label="Click for a study tip"
            >
              <Cat 
                className={`w-14 h-14 sm:w-16 sm:h-16 text-primary
                  ${status === "sleeping" ? "opacity-50" : ""}
                  ${status === "happy" ? "text-primary animate-pulse-soft" : ""}
                  ${status === "focused" ? "text-primary" : ""}
                `}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs">
            <p>{tip}</p>
            <p className="text-xs text-muted-foreground mt-1">Click for another tip!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {/* Chat button */}
      <Button 
        size="sm"
        variant="outline"
        className="absolute -top-2 -right-2 rounded-full w-7 h-7 p-0 bg-primary/10 border-primary/20 hover:bg-primary/20"
        onClick={() => setIsChatOpen(true)}
      >
        <MessageSquare className="w-3 h-3 text-primary" />
      </Button>
      
      {/* Chat Dialog */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="max-w-md max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cat className="h-5 w-5 text-primary" />
              Chat with Meowdoro
            </DialogTitle>
            <DialogClose className="absolute top-4 right-4">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          
          {/* Chat messages */}
          <div className="flex flex-col h-[50vh] overflow-y-auto pr-2 mb-4">
            <div className="flex-1 space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-accent border border-border'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-4 py-2 bg-accent border border-border">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Chat input */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Meowdoro something..."
              className="flex-1"
            />
            <Button type="submit" size="sm">Send</Button>
          </form>
          
          <p className="text-xs text-muted-foreground text-center">
            This is a demo chat with pre-defined responses. In a real app, this would connect to an LLM API.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};
