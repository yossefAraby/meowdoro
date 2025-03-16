import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Clock
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [selectedColor, setSelectedColor] = useState("bg-white dark:bg-card");
  
  const { toast } = useToast();
  
  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("meowdoro-items", JSON.stringify(items));
  }, [items]);
  
  const addItem = () => {
    if (!content.trim()) return;
    
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
        
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 bg-secondary/50 p-4 rounded-xl">
          <Tabs defaultValue="task" value={activeTab} onValueChange={(v) => setActiveTab(v as ItemType)} className="mb-4 sm:mb-0">
            <TabsList>
              <TabsTrigger value="task" className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Task
              </TabsTrigger>
              <TabsTrigger value="note" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Note
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex-1">
            <Input
              placeholder="Title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-2"
            />
            <div className="flex items-start gap-2">
              <Input
                placeholder={activeTab === "task" ? "Add a new task..." : "Add a new note..."}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addItem();
                  }
                }}
              />
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <div className={`w-4 h-4 rounded-full ${selectedColor}`}></div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="grid grid-cols-4 gap-1 p-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          className={`w-8 h-8 rounded-full cursor-pointer ${color.value}`}
                          onClick={() => setSelectedColor(color.value)}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button className="shrink-0" onClick={addItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground">
            <p className="mb-2">No {activeTab}s found</p>
            <p>Create your first {activeTab} using the form above.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <Card 
              key={item.id}
              className={`overflow-hidden transition-all-150 hover:shadow-soft-md ${item.color}`}
            >
              <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    {item.isPinned && <Pin className="w-3 h-3 text-primary" />}
                    <h3 className="font-medium">{item.title}</h3>
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
                        onClick={() => toggleItemCompletion(item.id)}
                      >
                        <CheckSquare className="mr-2 h-4 w-4" />
                        Mark as {item.isCompleted ? 'incomplete' : 'complete'}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={() => toggleItemPin(item.id)}
                    >
                      <Pin className="mr-2 h-4 w-4" />
                      {item.isPinned ? 'Unpin' : 'Pin to top'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              
              <CardContent className="p-4">
                <p className={item.isCompleted ? "line-through text-muted-foreground" : ""}>
                  {item.content}
                </p>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(item.createdAt)}</span>
                </div>
                
                {item.type === "task" && (
                  <button 
                    onClick={() => toggleItemCompletion(item.id)}
                    className={`w-5 h-5 rounded border flex items-center justify-center ${
                      item.isCompleted ? 'bg-primary border-primary' : 'border-foreground/30'
                    }`}
                  >
                    {item.isCompleted && <CheckSquare className="w-4 h-4 text-primary-foreground" />}
                  </button>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;
