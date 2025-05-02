
import React, { useState, useEffect, useRef } from "react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Cat, X, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
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
  // Chat message container ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem("meowdoro-gemini-key") || "AIzaSyDTbR2SMAp2xlGCN3y0QGTNu58NKPEOC-k";
  });
  const { toast } = useToast();
  
  // Save the API key to localStorage
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("meowdoro-gemini-key", apiKey);
    }
  }, [apiKey]);
  
  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
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

  // Open chat dialog when clicking on the cat
  const handleCatClick = () => {
    setIsChatOpen(true);
  };

  // Function to handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
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
    
    try {
      // Always use AI response
      await generateAIResponse(userMessage.text);
    } catch (error) {
      console.error("Error generating AI response:", error);
      setIsTyping(false);
      
      toast({
        title: "AI Connection Issue",
        description: "Unable to connect to AI service. Please check your API key.",
        variant: "destructive"
      });
    }
  };
  
  // Function to generate AI response using Gemini API
  const generateAIResponse = async (userMessage: string) => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are Meowdoro, a cat-themed AI study assistant. You should respond with short, helpful advice about productivity, studying, and focus. Use cat puns when possible, but sparingly. Keep responses under 150 characters. 
                  
                  The user message is: "${userMessage}"`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 150,
          }
        })
      });
      
      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        const catMessage: ChatMessage = {
          text: aiResponse.trim(),
          sender: "cat",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, catMessage]);
      } else {
        throw new Error("Invalid API response");
      }
    } catch (error) {
      console.error("Error with Gemini API:", error);
      throw error;
    } finally {
      setIsTyping(false);
    }
  };
  
  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className="text-5xl sm:text-6xl cursor-pointer hover:scale-110 hover:rotate-3 transition-all duration-300"
              onClick={handleCatClick}
              aria-label="Chat with Meowdoro"
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
            <p className="text-xs text-muted-foreground mt-1">Click for a chat!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {/* Chat Dialog with improved UI */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="max-w-md max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cat className="h-5 w-5 text-primary" />
              Chat with Meowdoro
              <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full flex items-center">
                <BrainCircuit className="h-3 w-3 mr-1" />
                AI Powered
              </span>
            </DialogTitle>
            <DialogClose className="absolute top-4 right-4">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          
          {/* Chat messages with improved styling */}
          <div className="flex flex-col h-[50vh] overflow-y-auto pr-2 mb-4 scrollbar-none">
            <div className="flex-1 space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'bg-accent/80 border border-border shadow-sm'
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
                  <div className="max-w-[80%] rounded-lg px-4 py-2 bg-accent/80 border border-border shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Invisible div for auto-scrolling */}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Chat input with improved styling */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Meowdoro something..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button 
              type="submit" 
              size="sm" 
              disabled={isTyping || !chatInput.trim()}
            >
              Send
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground text-center mt-2">
            Powered by Google Gemini API
          </p>
          
          {/* API Key setting */}
          <div className="mt-4 p-3 bg-primary/5 rounded-md border border-primary/10">
            <p className="text-xs font-medium mb-2">Gemini API Key</p>
            <div className="flex gap-2">
              <Input 
                type="password"
                value={apiKey || ''}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="text-xs"
              />
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
                onClick={() => {
                  if (apiKey) {
                    localStorage.setItem("meowdoro-gemini-key", apiKey);
                    toast({
                      title: "API Key Saved",
                      description: "Your Gemini API key has been saved."
                    });
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
