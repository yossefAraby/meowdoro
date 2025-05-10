import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cat, 
  Send, 
  Plus, 
  Settings,
  Trash2,
  MessageSquare,
  RefreshCw,
  Copy,
  BrainCircuit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PricingDialog } from "@/components/pricing/PricingDialog";

// Types
interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  isLoading?: boolean;
  isStreaming?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: ChatMessage[];
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  isPremium: boolean;
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

const DEFAULT_API_KEY = "AIzaSyDTbR2SMAp2xlGCN3y0QGTNu58NKPEOC-k";
const STORAGE_KEY = "meowdoro-chat-history";

const Chat: React.FC = () => {
  // State
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
  const [activeConversation, setActiveConversation] = useState<string>('default');
  const [chatInput, setChatInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>("gemini");
  const [includeContextData, setIncludeContextData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  // Refs
  const { toast } = useToast();
  const geminiServiceRef = useRef<GeminiService | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Gemini service
  useEffect(() => {
    try {
      geminiServiceRef.current = new GeminiService(DEFAULT_API_KEY);
    } catch (error) {
      console.error("Error initializing Gemini:", error);
    }
  }, []);

  // Auto-select the most recent chat on mount or when conversations change
  useEffect(() => {
    if (
      conversations.length > 0 &&
      !conversations.some((c) => c.id === activeConversation)
    ) {
      setActiveConversation(conversations[0].id);
    }
  }, [activeConversation, conversations]);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  // Initialize chat with AI greeting
  const initializeChat = async (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation || conversation.messages.length > 0) return;

    try {
      const greeting = await geminiServiceRef.current!.generateResponse(
        "Introduce yourself as a cat study companion",
        {}
      );
      
      const newMessage: ChatMessage = {
        id: generateMessageId(),
        text: greeting,
        sender: "ai",
        timestamp: new Date()
      };
      
      updateConversation(conversationId, [newMessage]);
    } catch (error) {
      console.error("Error generating greeting:", error);
      const fallbackMessage: ChatMessage = {
        id: generateMessageId(),
        text: "Hi there! I'm your Meowdoro AI assistant. How can I help with your productivity today?",
        sender: "ai",
        timestamp: new Date()
      };
      updateConversation(conversationId, [fallbackMessage]);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversations, activeConversation]);

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

  // Handle creating a new chat
  const handleNewChat = () => {
    const newConversationId = generateMessageId();
    const newConversation: Conversation = {
      id: newConversationId,
      title: `New Chat ${conversations.length}`,
      lastMessage: 'Start a new conversation',
      timestamp: new Date(),
      messages: []
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversationId);
    initializeChat(newConversationId);
    
    // Focus the input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle selecting a conversation
  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle deleting a conversation
  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (activeConversation === id) {
      const newConversationId = generateMessageId();
      const newConversation: Conversation = {
        id: newConversationId,
        title: 'New Chat',
        lastMessage: 'Start a new conversation',
        timestamp: new Date(),
        messages: []
      };
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversation(newConversationId);
    }
  };

  // Handle regenerating the last AI response
  const handleRegenerateMessage = async () => {
    const conversation = conversations.find(c => c.id === activeConversation);
    if (!conversation) return;

    const messages = conversation.messages;
    const lastUserMessageIndex = [...messages].reverse().findIndex(msg => msg.sender === "user");
    
    if (lastUserMessageIndex === -1) return;
    
    const lastUserMessage = [...messages].reverse()[lastUserMessageIndex];
    const updatedMessages = messages.slice(0, messages.length - lastUserMessageIndex);
    
    updateConversation(activeConversation, []);
    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversation) {
        return { ...conv, messages: updatedMessages };
      }
      return conv;
    }));
    
    await handleSendMessage(null, lastUserMessage.text);
  };

  // Handle copying a message
  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied.",
    });
  };

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent | null, forcedText?: string) => {
    if (e) e.preventDefault();
    
    const messageText = forcedText || chatInput;
    if (!messageText.trim()) return;

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      text: messageText,
      sender: "user",
      timestamp: new Date()
    };
    
    updateConversation(activeConversation, [userMessage]);
    if (!forcedText) setChatInput('');
    
    const loadingMessage: ChatMessage = {
      id: generateMessageId(),
      text: "",
      sender: "ai",
      timestamp: new Date(),
      isLoading: true,
      isStreaming: false
    };
    
    updateConversation(activeConversation, [loadingMessage]);
    setIsLoading(true);

    try {
      if (selectedModel === "gemini") {
        // Set up context if enabled
        let context = undefined;
        if (includeContextData) {
          const mockNotes = ["Studying for math exam", "Need to review chapter 5"];
          const mockTasks = ["Complete math homework", "Review notes from last session"];
          context = { notes: mockNotes, tasks: mockTasks };
        }

        // Get current conversation for context
        const conversation = conversations.find(c => c.id === activeConversation);
        const messageContext = conversation?.messages
          .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
          .join('\n') || '';
        
        // Construct the full prompt
        const fullPrompt = `Message history:\n${messageContext}\n\nUser: ${messageText}\nAssistant:`;

        // Start streaming simulation
        setConversations(prev => prev.map(conv => {
          if (conv.id === activeConversation) {
            const updatedMessages = conv.messages.map(msg => 
              msg.id === loadingMessage.id 
                ? { ...msg, isLoading: false, isStreaming: true }
                : msg
            );
            return { ...conv, messages: updatedMessages };
          }
          return conv;
        }));

        const response = await geminiServiceRef.current!.generateResponse(fullPrompt, context);
        
        // Simulate streaming by adding characters one by one
        const responseChars = response.split('');
        let streamedText = '';
        
        for (let i = 0; i < responseChars.length; i++) {
          streamedText += responseChars[i];
          
          setConversations(prev => prev.map(conv => {
            if (conv.id === activeConversation) {
              const updatedMessages = conv.messages.map(msg => 
                msg.id === loadingMessage.id 
                  ? { ...msg, text: streamedText }
                  : msg
              );
              return { ...conv, messages: updatedMessages };
            }
            return conv;
          }));
          
          await new Promise(resolve => setTimeout(resolve, 5));
        }
        
        // Mark streaming as complete
        setConversations(prev => prev.map(conv => {
          if (conv.id === activeConversation) {
            const updatedMessages = conv.messages.map(msg => 
              msg.id === loadingMessage.id 
                ? { ...msg, isStreaming: false }
                : msg
            );
            return { ...conv, messages: updatedMessages };
          }
          return conv;
        }));
      } else if (selectedModel === "deepseek") {
        const proMessage: ChatMessage = {
          id: generateMessageId(),
          text: "This premium model requires a Pro subscription. Would you like to upgrade your plan?",
          sender: "ai",
          timestamp: new Date()
        };
        
        setConversations(prev => prev.map(conv => {
          if (conv.id === activeConversation) {
            const messages = conv.messages.filter(msg => msg.id !== loadingMessage.id);
            return { ...conv, messages: [...messages, proMessage] };
          }
          return conv;
        }));
      }
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        text: error instanceof Error ? error.message : "Sorry, something went wrong. Please try again.",
        sender: "ai",
        timestamp: new Date()
      };
      
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversation) {
          const messages = conv.messages.filter(msg => msg.id !== loadingMessage.id);
          return { ...conv, messages: [...messages, errorMessage] };
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

  // Get current conversation
  const currentConversation = conversations.find(c => c.id === activeConversation);

  const handleModelChange = (modelId: string) => {
    if (models.find(m => m.id === modelId)?.isPremium) {
      setIsPricingOpen(true);
    } else {
      setSelectedModel(modelId);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row fixed inset-0 bg-background pt-20" style={{ height: '100vh' }}>
        {/* Sidebar */}
        <div className="w-80 border-r flex flex-col h-full">
          {/* New chat button */}
          <div className="p-4 border-b">
            <Button 
              className="w-full justify-start gap-2"
              onClick={handleNewChat}
            >
              <Plus className="h-4 w-4" /> New chat
            </Button>
          </div>

          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {conversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "group flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50 transition-colors",
                    activeConversation === conversation.id && "bg-accent"
                  )}
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <MessageSquare className="h-5 w-5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{conversation.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(conversation.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Settings - Now fixed at bottom */}
          <div className="p-4 border-t space-y-4 bg-background">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Model</h3>
              <Select
                value={selectedModel}
                onValueChange={handleModelChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {models.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center gap-2">
                        {model.name}
                        {model.isPremium && (
                          <Badge variant="secondary" className="text-xs">PRO</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Include Context</h3>
                <p className="text-xs text-muted-foreground">
                  Add notes and tasks to AI context
                </p>
              </div>
              <Switch
                checked={includeContextData}
                onCheckedChange={setIncludeContextData}
              />
            </div>
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col h-full min-h-0">
          {/* Chat header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <Cat className="h-5 w-5 text-primary" />
              <span className="font-medium">Meowdoro AI</span>
              <Badge 
                variant="outline"
                className="text-xs bg-primary/10 text-primary border-primary/20"
              >
                <BrainCircuit className="h-3 w-3 mr-1" /> 2.0 Flash
              </Badge>
            </div>
          </div>

          {/* Messages - Flex grow and scroll */}
          <div 
            ref={chatContainerRef}
            className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4"
            style={{ maxHeight: '100vh' }}
          >
            <AnimatePresence>
              {currentConversation?.messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    "group flex gap-4 max-w-3xl mx-auto",
                    message.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                    {message.sender === "user" ? (
                      <div className="bg-primary/20 w-full h-full rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">You</span>
                      </div>
                    ) : (
                      <div className="bg-accent/50 w-full h-full rounded-full flex items-center justify-center">
                        <Cat className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>

                  {/* Message content */}
                  <div className="flex-1 space-y-1">
                    {message.isLoading ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                          <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.2s" }} />
                          <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.4s" }} />
                        </div>
                        <span>Thinking...</span>
                      </div>
                    ) : (
                      <>
                        <div className={cn(
                          "prose prose-sm dark:prose-invert max-w-none",
                          message.isStreaming && "animate-pulse"
                        )}>
                          <ReactMarkdown>{message.text}</ReactMarkdown>
                        </div>
                        
                        {/* Message actions */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => handleCopyMessage(message.text)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          
                          {message.sender === "ai" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={handleRegenerateMessage}
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Regenerate
                            </Button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input area - Now fixed at bottom */}
          <div className="p-4 border-t bg-background">
            <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
              <div className="relative">
                <Input
                  ref={inputRef}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Message Meowdoro..."
                  className="pr-20"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  disabled={isLoading || !chatInput.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Meowdoro AI may produce inaccurate information about people, places, or facts.
              </p>
            </form>
          </div>
        </div>
      </div>
      <PricingDialog 
        open={isPricingOpen} 
        onClose={() => setIsPricingOpen(false)} 
      />
    </>
  );
};

export default Chat; 