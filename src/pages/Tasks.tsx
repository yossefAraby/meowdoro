import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckSquare, 
  FileText, 
  Plus, 
  MoreVertical, 
  Trash, 
  Edit,
  Pin,
  Clock,
  Palette
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Task and note types
type ItemType = "task" | "note";

interface Item {
  id: string;
  type: ItemType;
  title: string;
  content: string;
  isPinned: boolean;
  isCompleted?: boolean;
  color?: string;
  createdAt: number;
}

const Tasks: React.FC = () => {
  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem("meowdoro-items");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeTab, setActiveTab] = useState<ItemType>("task");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedColor, setSelectedColor] = useState("bg-white dark:bg-card");
  
  const { toast } = useToast();
  
  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("meowdoro-items", JSON.stringify(items));
  }, [items]);
  
  const addItem = () => {
    if (!content.trim() && !title.trim()) return;
    
    const newItem: Item = {
      id: Date.now().toString(),
      type: activeTab,
      title: title.trim() || (activeTab === "task" ? "Task" : "Note"),
      content,
      isPinned: false,
      isCompleted: activeTab === "task" ? false : undefined,
      color: selectedColor,
      createdAt: Date.now()
    };
    
    setItems([newItem, ...items]);
    setTitle("");
    setContent("");
    setIsExpanded(false);
    setSelectedColor("bg-white dark:bg-card");
    
    toast({
      title: `New ${activeTab} added`,
      description: title.trim() || content.substring(0, 20) + "...",
    });
  };
  
  const toggleItemCompletion = (id: string) => {
    setItems(
      items.map(item => 
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };
  
  const toggleItemPin = (id: string) => {
    setItems(
      items.map(item => 
        item.id === id ? { ...item, isPinned: !item.isPinned } : item
      )
    );
  };
  
  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    
    toast({
      title: "Item deleted",
      description: "The item has been removed."
    });
  };
  
  const updateItemColor = (id: string, color: string) => {
    setItems(
      items.map(item => 
        item.id === id ? { ...item, color } : item
      )
    );
  };
  
  // Filter and sort items
  const filteredItems = items
    .filter(item => item.type === activeTab)
    .sort((a, b) => {
      // First by pinned status
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // Then by creation date (newest first)
      return b.createdAt - a.createdAt;
    });
  
  const colorOptions = [
    { value: "bg-white dark:bg-card", label: "Default" },
    { value: "bg-primary/10", label: "Primary" },
    { value: "bg-pink-100 dark:bg-pink-900/20", label: "Pink" },
    { value: "bg-orange-100 dark:bg-orange-900/20", label: "Orange" },
    { value: "bg-amber-100 dark:bg-amber-900/20", label: "Yellow" },
    { value: "bg-emerald-100 dark:bg-emerald-900/20", label: "Green" },
    { value: "bg-sky-100 dark:bg-sky-900/20", label: "Sky" },
    { value: "bg-violet-100 dark:bg-violet-900/20", label: "Purple" },
  ];
  
  // Format the creation date 
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 page-transition">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">My Tasks & Notes</h1>
        
        <div className="max-w-2xl mx-auto">
          <Tabs defaultValue="task" value={activeTab} onValueChange={(v) => setActiveTab(v as ItemType)} className="mb-4">
            <TabsList className="w-full">
              <TabsTrigger value="task" className="flex-1 flex items-center justify-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Task
              </TabsTrigger>
              <TabsTrigger value="note" className="flex-1 flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Note
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Card className={cn("transition-all duration-300 shadow-soft hover:shadow-soft-md", selectedColor)}>
            <CardContent className="p-4">
              {isExpanded && (
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mb-2 border-0 bg-transparent p-0 text-lg font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              )}
              
              <Textarea
                placeholder={activeTab === "task" ? "Add a task..." : "Take a note..."}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                className={cn(
                  "min-h-[40px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                  isExpanded ? "min-h-[80px]" : ""
                )}
              />
              
              {isExpanded && (
                <div className="flex items-center justify-between mt-4">
                  <div className="flex space-x-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <Palette className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="p-2">
                        <div className="grid grid-cols-4 gap-1">
                          {colorOptions.map((color) => (
                            <button
                              key={color.value}
                              className={`w-7 h-7 rounded-full cursor-pointer ${color.value}`}
                              onClick={() => setSelectedColor(color.value)}
                              title={color.label}
                            />
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setIsExpanded(false);
                        setTitle("");
                        setContent("");
                        setSelectedColor("bg-white dark:bg-card");
                      }}
                    >
                      Close
                    </Button>
                    <Button size="sm" onClick={addItem}>
                      {activeTab === "task" ? "Add task" : "Add note"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Pinned Items Section */}
      {filteredItems.some(item => item.isPinned) && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">PINNED</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems
              .filter(item => item.isPinned)
              .map((item) => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  onToggleCompletion={toggleItemCompletion}
                  onTogglePin={toggleItemPin}
                  onDelete={deleteItem}
                  onUpdateColor={updateItemColor}
                  colorOptions={colorOptions}
                />
              ))
            }
          </div>
        </div>
      )}
      
      {/* Other Items Section */}
      <div>
        {filteredItems.some(item => item.isPinned) && (
          <h2 className="text-sm font-medium text-muted-foreground mb-2">OTHERS</h2>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-12">
              <p className="mb-2">No {activeTab}s found</p>
              <p>Create your first {activeTab} using the form above.</p>
            </div>
          ) : (
            filteredItems
              .filter(item => !item.isPinned)
              .map((item) => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  onToggleCompletion={toggleItemCompletion}
                  onTogglePin={toggleItemPin}
                  onDelete={deleteItem}
                  onUpdateColor={updateItemColor}
                  colorOptions={colorOptions}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
};

// Item Card Component
const ItemCard: React.FC<{
  item: Item;
  onToggleCompletion: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateColor: (id: string, color: string) => void;
  colorOptions: { value: string; label: string }[];
}> = ({ 
  item, 
  onToggleCompletion, 
  onTogglePin, 
  onDelete,
  onUpdateColor,
  colorOptions 
}) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-150 hover:shadow-soft-md border",
        item.color
      )}
    >
      <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            {item.isPinned && <Pin className="w-3 h-3 text-primary" />}
            <h3 className={cn("font-medium", item.isCompleted && "line-through text-muted-foreground")}>
              {item.title}
            </h3>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="-mr-2 -mt-2 h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {item.type === "task" && (
              <DropdownMenuItem 
                onClick={() => onToggleCompletion(item.id)}
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                Mark as {item.isCompleted ? 'incomplete' : 'complete'}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={() => onTogglePin(item.id)}
            >
              <Pin className="mr-2 h-4 w-4" />
              {item.isPinned ? 'Unpin' : 'Pin to top'}
            </DropdownMenuItem>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Palette className="mr-2 h-4 w-4" />
                  Change color
                </DropdownMenuItem>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" className="p-2">
                <div className="grid grid-cols-4 gap-1">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      className={`w-7 h-7 rounded-full cursor-pointer ${color.value}`}
                      onClick={() => onUpdateColor(item.id, color.value)}
                      title={color.label}
                    />
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(item.id)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="p-4">
        <p className={cn(item.isCompleted && "line-through text-muted-foreground")}>
          {item.content}
        </p>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{formatDate(item.createdAt)}</span>
        </div>
        
        {item.type === "task" && (
          <button 
            onClick={() => onToggleCompletion(item.id)}
            className={cn(
              "w-5 h-5 rounded border flex items-center justify-center transition-colors", 
              item.isCompleted ? 'bg-primary border-primary' : 'border-foreground/30'
            )}
          >
            {item.isCompleted && <CheckSquare className="w-4 h-4 text-primary-foreground" />}
          </button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Tasks;
