import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, X, Send, Settings, Cat, Maximize2, Minimize2, Plus } from 'lucide-react';
import { CustomizableCat } from '@/components/shop/CustomizableCat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { GeminiService } from '@/services/gemini';
import ReactMarkdown from 'react-markdown';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useShop } from '@/contexts/ShopContext';
import { PricingDialog } from "@/components/pricing/PricingDialog";

// Type for chat messages
interface ChatMessage {
  id: string;
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

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: ChatMessage[];
}

const models: AIModel[] = [
  {
    id: "gemini",
    name: "Gemini",
    description: "Free tier",
    isPremium: false
  },
  {
    id: "deepseek",
    name: "Deepseek",
    description: "Premium",
    isPremium: true
  }
];

interface MeowAIButtonProps {
  timerMode: "focus" | "break" | "longBreak";
}

const DEFAULT_API_KEY = "AIzaSyDTbR2SMAp2xlGCN3y0QGTNu58NKPEOC-k";
const STORAGE_KEY = "meowdoro-chat-history";

export const MeowAIButton: React.FC<MeowAIButtonProps> = ({ timerMode }) => {
  const { activeCatColor } = useShop();
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>("gemini");
  const [includeContextData, setIncludeContextData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCatHappy, setIsCatHappy] = useState(false);
  const [showHappySprite, setShowHappySprite] = useState(false);
  const { toast } = useToast();
  const geminiServiceRef = useRef<GeminiService | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  // Get conversations from localStorage
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const savedConversations = localStorage.getItem(STORAGE_KEY);
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      // Convert string timestamps back to Date objects
      return parsed.map((conv: any) => ({
        ...conv,
        timestamp: new Date(conv.timestamp),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    }
    return [{
      id: 'default',
      title: 'New Chat',
      lastMessage: 'Start a new conversation',
      timestamp: new Date(),
      messages: []
    }];
  });

  const [activeConversation, setActiveConversation] = useState<string>(() => {
    return conversations[0]?.id || 'default';
  });
  
  // Initialize Gemini service with default API key
  useEffect(() => {
    try {
      geminiServiceRef.current = new GeminiService(DEFAULT_API_KEY);
    } catch (error) {
      console.error("Error initializing Gemini:", error);
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  // Watch for changes in localStorage from other components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const parsed = JSON.parse(e.newValue);
        setConversations(parsed.map((conv: any) => ({
          ...conv,
          timestamp: new Date(conv.timestamp),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        })));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Show notification when notes context is enabled
  useEffect(() => {
    if (includeContextData) {
      toast({
        title: "Notes Context Enabled",
        description: "Your notes will now be included in the AI chat context.",
        variant: "default",
      });
    }
  }, [includeContextData, toast]);

  // Generate unique IDs
  const generateMessageId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
  };

  // Update conversation messages
  const updateConversation = (conversationId: string, newMessages: ChatMessage[]) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedMessages = [...conv.messages, ...newMessages];
        return {
          ...conv,
          messages: updatedMessages,
          lastMessage: newMessages[newMessages.length - 1].text.substring(0, 50) + '...',
          timestamp: new Date()
        };
      }
      return conv;
    }));
  };

  // Function to handle opening and closing the chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatInput.trim()) return;

    // Show happy sprite with animation
    setShowHappySprite(true);
    setIsCatHappy(true);
    
    // Hide happy sprite after animation
    setTimeout(() => {
      setShowHappySprite(false);
      setIsCatHappy(false);
    }, 2000);
    
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      text: chatInput,
      sender: "user",
      timestamp: new Date()
    };
    
    updateConversation(activeConversation, [userMessage]);
    setChatInput('');
    
    const loadingMessage: ChatMessage = {
      id: generateMessageId(),
      text: "...",
      sender: "ai",
      timestamp: new Date(),
      isLoading: true
    };
    
    updateConversation(activeConversation, [loadingMessage]);
    setIsLoading(true);

    try {
      if (selectedModel === "gemini") {
        let context = undefined;
        if (includeContextData) {
          // Get real notes from localStorage instead of mock data
          let userNotes: string[] = [];
          try {
            const savedNotes = localStorage.getItem('notes');
            if (savedNotes) {
              const parsedNotes = JSON.parse(savedNotes);
              // Extract titles and content for context, limited to most recent 10 notes
              userNotes = parsedNotes
                .filter((note: any) => !note.trashed && !note.archived) // Only include active notes
                .slice(0, 10) // Limit to most recent 10 notes
                .map((note: any) => {
                  // Format note as a string with title and content
                  if (note.type === 'note') {
                    return `${note.title ? note.title + ': ' : ''}${note.content.replace(/<[^>]*>/g, '')}`;
                  } else if (note.type === 'checklist') {
                    // For checklists, include tasks
                    const taskList = note.tasks.map((task: any) => 
                      `${task.completed ? '✓' : '☐'} ${task.text}`
                    ).join(', ');
                    return `${note.title ? note.title + ': ' : ''}${taskList}`;
                  }
                  return note.title || '';
                })
                .filter((note: string) => note.trim() !== ''); // Remove empty notes
            }
          } catch (error) {
            console.error("Error loading notes from localStorage:", error);
            // Fallback to empty array if there's an error
            userNotes = [];
          }

          // Get tasks if available
          let userTasks: string[] = [];
          try {
            const savedTasks = localStorage.getItem('tasks');
            if (savedTasks) {
              const parsedTasks = JSON.parse(savedTasks);
              userTasks = parsedTasks
                .filter((task: any) => !task.completed) // Only include incomplete tasks
                .map((task: any) => task.text);
            }
          } catch (error) {
            console.error("Error loading tasks from localStorage:", error);
            // Fallback to empty array if there's an error
            userTasks = [];
          }

          context = {
            timerMode,
            notes: userNotes.length > 0 ? userNotes : ["No notes found"],
            tasks: userTasks.length > 0 ? userTasks : []
          };
        }

        const conversation = conversations.find(c => c.id === activeConversation);
        const messageContext = conversation?.messages
          .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
          .join('\n');

        const response = await geminiServiceRef.current!.generateResponse(
          `Message history:\n${messageContext}\n\nUser: ${chatInput}\nAssistant:`,
          context
        );
        
        setConversations(prev => prev.map(conv => {
          if (conv.id === activeConversation) {
            const messages = conv.messages.filter(msg => !msg.isLoading);
            return {
              ...conv,
              messages: [...messages, {
                id: generateMessageId(),
                text: response,
                sender: "ai",
                timestamp: new Date()
              }]
            };
          }
          return conv;
        }));
      } else if (selectedModel === "deepseek") {
        setConversations(prev => prev.map(conv => {
          if (conv.id === activeConversation) {
            const messages = conv.messages.filter(msg => !msg.isLoading);
            return {
              ...conv,
              messages: [...messages, {
                id: generateMessageId(),
                text: "This premium model requires a Pro subscription. Would you like to upgrade your plan?",
                sender: "ai",
                timestamp: new Date()
              }]
            };
          }
          return conv;
        }));
      }
    } catch (error) {
      console.error("Error generating response:", error);
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversation) {
          const messages = conv.messages.filter(msg => !msg.isLoading);
          return {
            ...conv,
            messages: [...messages, {
              id: generateMessageId(),
              text: error instanceof Error ? error.message : "Sorry, something went wrong. Please try again.",
              sender: "ai",
              timestamp: new Date()
            }]
          };
        }
        return conv;
      }));

      if (error instanceof Error && error.message.includes("API key")) {
        toast({
          title: "API Key Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleModelChange = (modelId: string) => {
    if (models.find(m => m.id === modelId)?.isPremium) {
      setIsPricingOpen(true);
    } else {
      setSelectedModel(modelId);
    }
  };

  // Get the correct color
  const getColorStyle = () => {
    // For named themes
    if (['cyan', 'green', 'yellow', 'lavender', 'peach', 'mint', 'rose'].includes(activeCatColor)) {
      return {
        filter: `brightness(0) saturate(100%) invert(67%) sepia(72%) saturate(380%) hue-rotate(var(--${activeCatColor}-hue, 165deg)) brightness(97%) contrast(88%)`
      };
    }
    
    // For custom colors (hex values)
    if (activeCatColor.startsWith('#')) {
      return {
        filter: `brightness(0) saturate(100%) invert(67%) sepia(72%) saturate(380%) hue-rotate(${getHueFromHex(activeCatColor)}deg) brightness(97%) contrast(88%)`
      };
    }

    // Default cyan color if no valid color is set
    return {
      filter: `brightness(0) saturate(100%) invert(67%) sepia(72%) saturate(380%) hue-rotate(165deg) brightness(97%) contrast(88%)`
    };
  };

  // Helper function to convert hex to hue
  const getHueFromHex = (hex: string) => {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    
    let h = 0;
    
    if (max === min) {
      h = 0; // achromatic
    } else {
      const d = max - min;
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h = h * 60;
    }
    
    return h;
  };

  // Get current conversation
  const currentConversation = conversations.find(c => c.id === activeConversation);

  return (
    <>
      <div className="relative z-50">
        {/* Pet Cat Image as Chat Button */}
        <div 
          className={cn(
            "relative w-28 h-28 cursor-pointer group",
            "transition-all duration-300 drop-shadow-lg",
            "hover:scale-110 hover:rotate-2"
          )}
          onClick={toggleChat}
        >
          <img
            src={
              isOpen
                ? "/cat images/chat.png"
                : (timerMode === 'break' ? "/cat images/break.png" : "/cat images/idle.png")
            }
            alt="Meowdoro Pet Cat"
            className={cn(
              "w-full h-full object-contain transition-opacity duration-300",
              "group-hover:opacity-0",
              showHappySprite && "opacity-0"
            )}
            style={getColorStyle()}
          />
          
          {/* Happy sprite with animation */}
          <AnimatePresence mode="wait">
            {showHappySprite && (
              <motion.img
                src="/cat images/happy.png"
                alt="Meowdoro Pet Cat Happy"
                className="absolute top-0 left-0 w-full h-full object-contain z-[60]"
                style={getColorStyle()}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotate: [0, -5, 5, -5, 5, 0],
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  opacity: { duration: 0.4, ease: "easeInOut" },
                  scale: { duration: 0.4, ease: "easeOut" },
                  rotate: { 
                    duration: 0.5,
                    times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                    ease: "easeInOut"
                  }
                }}
              />
            )}
          </AnimatePresence>
          
          {/* Hover state image */}
          <img
            src="/cat images/cheer.png"
            alt="Meowdoro Pet Cat Cheer"
            className="absolute top-0 left-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={getColorStyle()}
          />
        </div>

        {/* Chat Window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "absolute bottom-0 right-32 bg-card border rounded-lg shadow-lg overflow-hidden",
                isFullscreen ? "w-[800px] h-[600px]" : "w-80 sm:w-96",
                "transition-all duration-300"
              )}
              style={{ minHeight: isFullscreen ? '600px' : '24rem' }}
            >
              {/* Chat header */}
              <div className="p-3 border-b bg-muted/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cat className="w-5 h-5 text-primary" />
                  <span className="font-medium">Meowdoro AI</span>
                  <Badge 
                    variant="outline"
                    className="text-xs bg-primary/10 text-primary border-primary/20"
                  >
                    <BrainCircuit className="h-3 w-3 mr-1" /> 2.0 Flash
                  </Badge>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
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
              <div 
                ref={chatContainerRef}
                className={cn(
                  "overflow-y-auto p-3 flex flex-col gap-3",
                  isFullscreen ? "h-[calc(600px-8rem)]" : "h-96",
                  "scrollbar-hide"
                )}
              >
                {currentConversation?.messages.map((message) => (
                  <div 
                    key={message.id} 
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
                          <div className={cn(
                            "prose prose-sm max-w-none",
                            message.sender === "user" ? "text-primary-foreground" : "dark:prose-invert"
                          )}>
                            <ReactMarkdown>{message.text}</ReactMarkdown>
                          </div>
                          <p className={cn(
                            "text-xs opacity-70 mt-1",
                            message.sender === "user" ? "text-primary-foreground" : ""
                          )}>
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
                <div className="flex-1 relative">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (chatInput.trim()) {
                          handleSendMessage(e);
                        }
                      }
                    }}
                    placeholder="Ask anything... (Shift+Enter for new line)"
                    className="w-full resize-none min-h-[40px] max-h-[120px] px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    rows={1}
                    disabled={isLoading}
                    style={{ 
                      height: 'auto',
                      overflow: 'hidden'
                    }}
                    ref={(textarea) => {
                      if (textarea) {
                        textarea.style.height = 'auto';
                        textarea.style.height = `${Math.min(120, Math.max(40, textarea.scrollHeight))}px`;
                      }
                    }}
                  />
                </div>
                <Button type="submit" size="icon" disabled={isLoading || !chatInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <PricingDialog 
        open={isPricingOpen} 
        onClose={() => setIsPricingOpen(false)} 
      />
    </>
  );
};

export default MeowAIButton;
