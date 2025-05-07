import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Trash, 
  Edit, 
  PinIcon,
  Search, 
  CheckSquare, 
  ListPlus,
  Palette,
  Users,
  Archive,
  MoreVertical,
  Bell
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PartyTasks from "@/components/tasks/PartyTasks";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

// Types
type Task = {
  id: string;
  text: string;
  completed: boolean;
};

type NoteType = 'note' | 'checklist';

type Note = {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  tasks: Task[];
  color: string;
  pinned: boolean;
  archived: boolean;
  trashed: boolean;
  labels: Label[];
  createdAt: Date;
};

type Label = {
  id: string;
  name: string;
  added: boolean;
};

// Color options
const colorOptions = [
  { name: 'Default', value: 'default', class: 'bg-card' },
  { name: 'Red', value: 'red', class: 'bg-red-100 dark:bg-red-900/40' },
  { name: 'Green', value: 'green', class: 'bg-green-100 dark:bg-green-900/40' },
  { name: 'Blue', value: 'blue', class: 'bg-blue-100 dark:bg-blue-900/40' },
  { name: 'Yellow', value: 'yellow', class: 'bg-yellow-100 dark:bg-yellow-900/40' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-100 dark:bg-purple-900/40' }
];

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Tasks: React.FC = () => {
  console.log('Tasks component rendering'); // Debug log

  // State for notes and search
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const savedNotes = localStorage.getItem('notes');
      return savedNotes ? JSON.parse(savedNotes) : [];
    } catch (error) {
      console.error('Error loading notes from localStorage:', error);
      return [];
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [hasActiveParty, setHasActiveParty] = useState(false);
  const { user } = useAuth();
  
  // State for creating new notes
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [noteType, setNoteType] = useState<NoteType>('note');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTasks, setNewTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedColor, setSelectedColor] = useState('default');
  const [isPinned, setIsPinned] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
  
  // Refs
  const editorRef = useRef<HTMLDivElement>(null);
  const taskInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Save notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('notes', JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes to localStorage:', error);
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive",
      });
    }
  }, [notes, toast]);
  
  // Handle clicking outside the editor
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
        if (newTitle || newContent || newTasks.length > 0) {
          saveNote();
        } else {
          setIsEditorOpen(false);
        }
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [newTitle, newContent, newTasks]);

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      const inTitle = note.title.toLowerCase().includes(query);
      const inContent = note.content.toLowerCase().includes(query);
      const inTasks = note.tasks.some(task => task.text.toLowerCase().includes(query));
      
      return inTitle || inContent || inTasks;
    })
    .sort((a, b) => {
      // Pinned notes first
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      // Then by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Create a new task
  const addTask = () => {
    if (!newTaskText.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false
    };
    
    setNewTasks([...newTasks, newTask]);
    setNewTaskText('');
    if (taskInputRef.current) taskInputRef.current.focus();
  };
  
  // Handle delete task
  const deleteTask = (id: string) => {
    setNewTasks(newTasks.filter(task => task.id !== id));
  };
  
  // Save the current note
  const saveNote = () => {
    if (!newTitle && !newContent && newTasks.length === 0) {
      setIsEditorOpen(false);
      resetEditor();
      return;
    }
    
    const newNote: Note = {
      id: Date.now().toString(),
      title: newTitle,
      content: noteType === 'note' ? newContent : '',
      type: noteType,
      tasks: noteType === 'checklist' ? newTasks : [],
      color: selectedColor,
      pinned: isPinned,
      archived: false,
      trashed: false,
      labels: selectedLabels,
      createdAt: new Date()
    };
    
    setNotes([newNote, ...notes]);
    resetEditor();
    
    toast({
      title: "Note created",
      description: "Your note has been saved successfully."
    });
  };
  
  // Reset editor state
  const resetEditor = () => {
    setNewTitle('');
    setNewContent('');
    setNewTasks([]);
    setNewTaskText('');
    setSelectedColor('default');
    setIsPinned(false);
    setSelectedLabels([]);
    setIsEditorOpen(false);
  };
  
  // Toggle pin status
  const togglePin = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, pinned: !note.pinned } : note
    ));
  };
  
  // Change note color
  const changeColor = (id: string, color: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, color } : note
    ));
  };
  
  // Delete note
  const deleteNote = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, trashed: true } : note
    ));
    
    toast({
      title: "Note moved to trash",
      description: "You can restore it from the trash later."
    });
  };
  
  // Restore note
  const restoreNote = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, trashed: false } : note
    ));
    
    toast({
      title: "Note restored",
      description: "Your note has been restored."
    });
  };
  
  // Archive note
  const archiveNote = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, archived: !note.archived } : note
    ));
    
    toast({
      title: "Note archived",
      description: "You can find it in the archive."
    });
  };
  
  // Toggle task completion
  const toggleTaskCompletion = (noteId: string, taskId: string) => {
    setNotes(notes.map(note => {
      if (note.id !== noteId) return note;
      
      return {
        ...note,
        tasks: note.tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      };
    }));
  };
  
  // Get color class
  const getColorClass = (color: string) => {
    const option = colorOptions.find(opt => opt.value === color);
    return option ? option.class : 'bg-card';
  };

  return (
    <ErrorBoundary>
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="personal" className="gap-2">
              <CheckSquare className="h-4 w-4" />
              Personal Notes
            </TabsTrigger>
            <TabsTrigger value="party" disabled={!hasActiveParty} className="gap-2">
              <Users className="h-4 w-4" />
              Party Tasks
            </TabsTrigger>
          </TabsList>
        
          <TabsContent value="personal" className="space-y-6">
            {/* Search bar */}
            <div className="max-w-lg mx-auto mb-6 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search notes"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Note editor */}
            <motion.div 
              ref={editorRef}
              className={cn(
                "max-w-lg mx-auto mb-8 rounded-lg border shadow transition-all",
                getColorClass(selectedColor),
                isPinned && "ring-1 ring-primary",
                isEditorOpen ? "p-4" : "hover:shadow-md cursor-pointer min-h-12"
              )}
              onClick={() => !isEditorOpen && setIsEditorOpen(true)}
              layout
            >
              <AnimatePresence mode="wait">
                {isEditorOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Input
                        type="text"
                        placeholder="Title"
                        className="flex-1 border-none px-0 text-lg font-medium focus-visible:ring-0 bg-transparent"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn("h-8 w-8 p-0", isPinned && "text-primary")}
                        onClick={() => setIsPinned(!isPinned)}
                      >
                        <PinIcon className={cn("h-4 w-4", isPinned && "fill-primary")} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Palette className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-auto flex p-1 gap-1">
                          {colorOptions.map(color => (
                            <button
                              key={color.value}
                              className={cn(
                                "w-6 h-6 rounded-full border hover:scale-110 transition-transform",
                                color.class,
                                selectedColor === color.value && "ring-2 ring-primary"
                              )}
                              onClick={() => setSelectedColor(color.value)}
                              title={color.name}
                            />
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    {noteType === 'note' ? (
                      <Textarea
                        placeholder="Take a note..."
                        className="w-full resize-none border-none px-0 focus-visible:ring-0 min-h-[100px] bg-transparent"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                      />
                    ) : (
                      <div className="space-y-2 mb-3">
                        {newTasks.map(task => (
                          <motion.div 
                            key={task.id} 
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                          >
                            <Checkbox 
                              checked={task.completed}
                              onCheckedChange={() => {
                                setNewTasks(newTasks.map(t => 
                                  t.id === task.id ? { ...t, completed: !t.completed } : t
                                ));
                              }}
                            />
                            <span className={cn(
                              "flex-1",
                              task.completed && "line-through text-muted-foreground"
                            )}>
                              {task.text}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 opacity-50 hover:opacity-100"
                              onClick={() => deleteTask(task.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        ))}
                        
                        <div className="flex items-center gap-2">
                          <Input
                            ref={taskInputRef}
                            type="text"
                            placeholder="Add item..."
                            className="border-none focus-visible:ring-0 px-0 bg-transparent"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTask()}
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={addTask}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-4 pt-2 border-t">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={cn(noteType === 'note' && "bg-primary/10")}
                          onClick={() => setNoteType('note')}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Note
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className={cn(noteType === 'checklist' && "bg-primary/10")}
                          onClick={() => setNoteType('checklist')}
                        >
                          <CheckSquare className="h-4 w-4 mr-2" />
                          Checklist
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={resetEditor}>
                          Cancel
                        </Button>
                        <Button variant="default" size="sm" onClick={saveNote}>
                          Save
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="p-4 text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Click to add a note...
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* Notes grid */}
            <div className="grid gap-4 auto-rows-auto">
              <AnimatePresence mode="popLayout">
                {filteredNotes.map(note => (
                  <motion.div 
                    key={note.id} 
                    className={cn(
                      "rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow relative p-4 flex flex-col min-h-[100px] h-full group",
                      getColorClass(note.color)
                    )}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    {note.pinned && (
                      <div className="absolute top-2 right-2">
                        <PinIcon className="h-4 w-4 text-primary fill-primary" />
                      </div>
                    )}
                    
                    <div className="flex-1 mb-2">
                      {note.title && (
                        <h3 className="font-medium text-lg mb-2 pr-6">{note.title}</h3>
                      )}
                      
                      {note.type === 'note' ? (
                        <div className="whitespace-pre-wrap break-words">
                          {note.content}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {note.tasks.map(task => (
                            <motion.div 
                              key={task.id} 
                              className="flex items-start gap-2"
                              layout
                            >
                              <Checkbox 
                                checked={task.completed}
                                id={`task-${task.id}`}
                                onCheckedChange={() => toggleTaskCompletion(note.id, task.id)}
                                className="mt-0.5"
                              />
                              <label 
                                htmlFor={`task-${task.id}`}
                                className={cn(
                                  "flex-1",
                                  task.completed && "line-through text-muted-foreground"
                                )}
                              >
                                {task.text}
                              </label>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Labels */}
                    {note.labels.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {note.labels.map(label => (
                          <span 
                            key={label.id}
                            className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                          >
                            {label.name}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-end mt-auto space-x-1 opacity-0 group-hover:opacity-100 hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0"
                        onClick={() => togglePin(note.id)}
                      >
                        <PinIcon className={cn("h-4 w-4", note.pinned && "fill-primary")} />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0"
                        onClick={() => archiveNote(note.id)}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => changeColor(note.id, 'default')}>
                            <Palette className="h-4 w-4 mr-2" />
                            Change Color
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Bell className="h-4 w-4 mr-2" />
                            Add Reminder
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Add Image
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Make a Copy
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Tag className="h-4 w-4 mr-2" />
                            Add Label
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => deleteNote(note.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {notes.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <ListPlus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">No notes yet</h3>
                <p className="text-muted-foreground mb-4">
                  Click the input above to create your first note
                </p>
              </motion.div>
            )}
            
            {notes.length > 0 && filteredNotes.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">No matching notes</h3>
                <p className="text-muted-foreground mb-4">
                  Try a different search term
                </p>
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="party">
            <PartyTasks />
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
};

export default Tasks; 