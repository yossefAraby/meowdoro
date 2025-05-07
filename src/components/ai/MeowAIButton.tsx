
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Cat, MessageSquare, X, Send, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Type for chat messages
interface ChatMessage {
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  isLoading?: boolean;
}

// Type for AI models
interface AIModel {
  id: string;
  name: string;
  description: string;
  isPremium: boolean;
}

const models: AIModel[] = [
  {
    id: "gemini",
    name: "Gemini Pro",
    description: "Google's Gemini Pro model - free tier",
    isPremium: false
  },
  {
    id: "deepseek",
    name: "DeepSeek Coder",
    description: "Specialized for coding assistance - premium",
    isPremium: true
  }
];

export const MeowAIButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: "Hi there! I'm your Meowdoro AI assistant. How can I help with your productivity today?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [selectedModel, setSelectedModel] = useState<string>("gemini");
  const [includeContextData, setIncludeContextData] = useState(false);
  const { toast } = useToast();
  
  // Function to handle opening and closing the chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
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
    setChatInput('');
    
    // Add loading message
    const loadingMessage: ChatMessage = {
      text: "...",
      sender: "ai",
      timestamp: new Date(),
      isLoading: true
    };
    
    setMessages(prev => [...prev, loadingMessage]);
    
    // Simulate AI response after delay
    setTimeout(() => {
      // Remove loading message
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
      // Generate response based on model
      const model = models.find(m => m.id === selectedModel);
      
      if (model?.isPremium) {
        // Premium model feature notification
        setMessages(prev => [
          ...prev, 
          {
            text: "This premium model requires a Pro subscription. Would you like to upgrade your plan?",
            sender: "ai",
            timestamp: new Date()
          }
        ]);
      } else {
        // Regular response
        const responses = [
          "I can help you maximize your focus sessions by setting clear goals for each one.",
          "Taking regular breaks is crucial. The Pomodoro technique is perfect for balancing focus and rest.",
          "Consider organizing your tasks by priority and deadline to make the most of your focus time.",
          "Ambient noise or lo-fi music can help create a consistent focus environment.",
          "I notice your focus times have been improving! Keep up the great work!"
        ];
        
        // Add context-aware message if the toggle is on
        if (includeContextData) {
          setMessages(prev => [
            ...prev, 
            {
              text: `Based on your recent task history, I see you've been working on ${Math.random() > 0.5 ? 'study materials' : 'project planning'}. ${responses[Math.floor(Math.random() * responses.length)]}`,
              sender: "ai",
              timestamp: new Date()
            }
          ]);
        } else {
          setMessages(prev => [
            ...prev, 
            {
              text: responses[Math.floor(Math.random() * responses.length)],
              sender: "ai",
              timestamp: new Date()
            }
          ]);
        }
      }
    }, 1500);
  };
  
  const handleModelChange = (modelId: string) => {
    if (models.find(m => m.id === modelId)?.isPremium) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to Pro to access premium AI models",
      });
    } else {
      setSelectedModel(modelId);
    }
  };

  return (
    <div className="relative z-50">
      {/* Chat Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={toggleChat} 
              size="icon" 
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground w-12 h-12"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Cat className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Ask Meowdoro AI anything</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 bg-card border rounded-lg shadow-lg overflow-hidden"
          >
            {/* Chat header */}
            <div className="p-3 border-b bg-muted/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cat className="h-5 w-5 text-primary" />
                <span className="font-medium">Meowdoro AI</span>
                <Badge 
                  variant="outline"
                  className="text-xs bg-primary/10 text-primary border-primary/20"
                >
                  <BrainCircuit className="h-3 w-3 mr-1" /> AI
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60" align="end">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm">AI Settings</h4>
                      
                      {/* Model selection */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium text-muted-foreground">Model</h5>
                        <div className="space-y-2">
                          {models.map((model) => (
                            <div 
                              key={model.id}
                              className={cn(
                                "flex items-center justify-between p-2 rounded-md cursor-pointer",
                                selectedModel === model.id ? "bg-primary/10" : "hover:bg-muted"
                              )}
                              onClick={() => handleModelChange(model.id)}
                            >
                              <div>
                                <div className="text-sm font-medium flex items-center gap-1">
                                  {model.name}
                                  {model.isPremium && (
                                    <Badge className="ml-1 text-xs" variant="secondary">PRO</Badge>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">{model.description}</div>
                              </div>
                              <div className={cn(
                                "w-3 h-3 rounded-full", 
                                selectedModel === model.id ? "bg-primary" : "bg-muted-foreground/30"
                              )} />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Include context toggle */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">Include context</div>
                          <div className="text-xs text-muted-foreground">Add notes and tasks to AI context</div>
                        </div>
                        <Switch 
                          checked={includeContextData} 
                          onCheckedChange={setIncludeContextData}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleChat}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Chat messages */}
            <div className="h-96 overflow-y-auto p-3 flex flex-col gap-3">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex",
                    message.sender === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div 
                    className={cn(
                      "max-w-[85%] rounded-lg p-3",
                      message.sender === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted border",
                      message.isLoading && "animate-pulse"
                    )}
                  >
                    {message.isLoading ? (
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Chat input */}
            <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2 bg-card/80">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!chatInput.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MeowAIButton;
