import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Plus, 
  MoreVertical, 
  Trash, 
  Edit, 
  Copy, 
  Check, 
  X, 
  Search, 
  StickyNote, 
  ListChecks 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Types for our cards
type TaskItem = {
  id: string;
  text: string;
  completed: boolean;
};

type CardType = 'note' | 'task';

type Card = {
  id: string;
  type: CardType;
  title: string;
  content: string;
  tasks?: TaskItem[];
  color: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const Tasks: React.FC = () => {
  const [cards, setCards] = useState<Card[]>(() => {
    const savedCards = localStorage.getItem('meowdoro-cards');
    return savedCards ? JSON.parse(savedCards) : [];
  });
  
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [newTaskText, setNewTaskText] = useState<string>('');
  
  const { toast } = useToast();
  
  // Save cards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('meowdoro-cards', JSON.stringify(cards));
  }, [cards]);
  
  // Filter and search cards
  const filteredCards = cards.filter(card => {
    // Apply type filter
    if (filter === 'notes' && card.type !== 'note') return false;
    if (filter === 'tasks' && card.type !== 'task') return false;
    if (filter === 'completed' && card.type === 'task') {
      const allTasksCompleted = card.tasks && card.tasks.length > 0 && card.tasks.every(task => task.completed);
      if (!allTasksCompleted) return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = card.title.toLowerCase().includes(query);
      const matchesContent = card.content.toLowerCase().includes(query);
      const matchesTasks = card.tasks?.some(task => task.text.toLowerCase().includes(query));
      
      return matchesTitle || matchesContent || matchesTasks;
    }
    
    return true;
  });
  
  // Sort cards: pinned first, then by updatedAt date
  filteredCards.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
  
  const handleCreateNewCard = (type: CardType) => {
    const newCard: Card = {
      id: Date.now().toString(),
      type,
      title: '',
      content: '',
      tasks: type === 'task' ? [] : undefined,
      color: 'default',
      pinned: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setCards([newCard, ...cards]);
    setEditingCard(newCard);
    
    toast({
      title: `New ${type} created`,
      description: "You can now add your content."
    });
  };
  
  const handleSaveCard = (card: Card) => {
    setCards(cards.map(c => c.id === card.id ? {...card, updatedAt: new Date()} : c));
    setEditingCard(null);
  };
  
  const handleDeleteCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
    
    toast({
      title: "Card deleted",
      description: "Your card has been deleted."
    });
  };
  
  const handleDuplicateCard = (card: Card) => {
    const newCard: Card = {
      ...card,
      id: Date.now().toString(),
      title: `${card.title} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setCards([newCard, ...cards]);
    
    toast({
      title: "Card duplicated",
      description: "A copy of your card has been created."
    });
  };
  
  const handleTogglePin = (id: string) => {
    setCards(cards.map(card => 
      card.id === id ? {...card, pinned: !card.pinned, updatedAt: new Date()} : card
    ));
  };
  
  const handleAddTask = (cardId: string, taskText: string) => {
    if (!taskText.trim()) return;
    
    const newTask: TaskItem = {
      id: Date.now().toString(),
      text: taskText,
      completed: false
    };
    
    setCards(cards.map(card => {
      if (card.id === cardId && card.tasks) {
        return {
          ...card,
          tasks: [...card.tasks, newTask],
          updatedAt: new Date()
        };
      }
      return card;
    }));
    
    setNewTaskText('');
  };
  
  const handleToggleTask = (cardId: string, taskId: string) => {
    setCards(cards.map(card => {
      if (card.id === cardId && card.tasks) {
        return {
          ...card,
          tasks: card.tasks.map(task => 
            task.id === taskId ? {...task, completed: !task.completed} : task
          ),
          updatedAt: new Date()
        };
      }
      return card;
    }));
  };
  
  const handleDeleteTask = (cardId: string, taskId: string) => {
    setCards(cards.map(card => {
      if (card.id === cardId && card.tasks) {
        return {
          ...card,
          tasks: card.tasks.filter(task => task.id !== taskId),
          updatedAt: new Date()
        };
      }
      return card;
    }));
  };
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 page-transition">
      {/* Header section - removed "My Tasks & Notes" heading */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        {/* Card creation buttons */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
            onClick={() => handleCreateNewCard('note')}
          >
            <Plus className="w-4 h-4" />
            New Note
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
            onClick={() => handleCreateNewCard('task')}
          >
            <Plus className="w-4 h-4" />
            New Task List
          </Button>
        </div>
        
        {/* Search and filter */}
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes & tasks..."
              className="w-full sm:w-[200px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select 
            value={filter} 
            onValueChange={setFilter}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="notes">Notes only</SelectItem>
              <SelectItem value="tasks">Tasks only</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Existing cards */}
        {filteredCards.map(card => (
          <Card 
            key={card.id} 
            className={`overflow-hidden transition-all hover:shadow-md ${card.pinned ? 'border-primary' : ''}`}
          >
            {editingCard?.id === card.id ? (
              // Edit mode
              <div className="p-4 space-y-3">
                <Input
                  placeholder="Title"
                  value={editingCard.title}
                  onChange={(e) => setEditingCard({...editingCard, title: e.target.value})}
                  className="font-medium text-lg"
                />
                
                {editingCard.type === 'note' ? (
                  <Textarea
                    placeholder="Add your notes here..."
                    value={editingCard.content}
                    onChange={(e) => setEditingCard({...editingCard, content: e.target.value})}
                    className="min-h-[100px]"
                  />
                ) : (
                  <div className="space-y-2">
                    {editingCard.tasks?.map(task => (
                      <div key={task.id} className="flex items-center gap-2">
                        <Checkbox 
                          checked={task.completed}
                          onCheckedChange={() => handleToggleTask(card.id, task.id)}
                        />
                        <Input 
                          value={task.text}
                          onChange={(e) => {
                            setEditingCard({
                              ...editingCard,
                              tasks: editingCard.tasks?.map(t => 
                                t.id === task.id ? {...t, text: e.target.value} : t
                              )
                            });
                          }}
                          className="flex-1"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setEditingCard({
                              ...editingCard,
                              tasks: editingCard.tasks?.filter(t => t.id !== task.id)
                            });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a task..."
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newTaskText.trim()) {
                            const newTask: TaskItem = {
                              id: Date.now().toString(),
                              text: newTaskText,
                              completed: false
                            };
                            setEditingCard({
                              ...editingCard,
                              tasks: [...(editingCard.tasks || []), newTask]
                            });
                            setNewTaskText('');
                          }
                        }}
                      />
                      <Button 
                        variant="outline"
                        onClick={() => {
                          if (newTaskText.trim()) {
                            const newTask: TaskItem = {
                              id: Date.now().toString(),
                              text: newTaskText,
                              completed: false
                            };
                            setEditingCard({
                              ...editingCard,
                              tasks: [...(editingCard.tasks || []), newTask]
                            });
                            setNewTaskText('');
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-2 pt-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditingCard(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleSaveCard(editingCard)}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              // View mode
              <>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {card.type === 'note' ? (
                          <StickyNote className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ListChecks className="h-4 w-4 text-muted-foreground" />
                        )}
                        {card.title || (card.type === 'note' ? 'Untitled Note' : 'Untitled Tasks')}
                      </CardTitle>
                      <CardDescription>
                        {new Date(card.updatedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="-mt-1">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingCard(card)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTogglePin(card.id)}>
                          {card.pinned ? (
                            <>
                              <span className="h-4 w-4 mr-2">📌</span>
                              Unpin
                            </>
                          ) : (
                            <>
                              <span className="h-4 w-4 mr-2">📌</span>
                              Pin
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateCard(card)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash className="h-4 w-4 mr-2 text-destructive" />
                              <span className="text-destructive">Delete</span>
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this card.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCard(card.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {card.type === 'note' ? (
                    <div className="whitespace-pre-wrap">
                      {card.content || <span className="text-muted-foreground italic">No content</span>}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {card.tasks && card.tasks.length > 0 ? (
                        card.tasks.map(task => (
                          <div key={task.id} className="flex items-start gap-2">
                            <Checkbox 
                              id={`task-${task.id}`}
                              checked={task.completed}
                              onCheckedChange={() => handleToggleTask(card.id, task.id)}
                              className="mt-0.5"
                            />
                            <label 
                              htmlFor={`task-${task.id}`}
                              className={`flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                            >
                              {task.text}
                            </label>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleDeleteTask(card.id, task.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-muted-foreground italic">No tasks</div>
                      )}
                    </div>
                  )}
                </CardContent>
                
                {card.type === 'task' && (
                  <CardFooter className="pt-0">
                    <div className="flex w-full gap-2">
                      <Input
                        placeholder="Add a task..."
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddTask(card.id, newTaskText);
                          }
                        }}
                        className="text-sm"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleAddTask(card.id, newTaskText)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                )}
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
