import React, { useState, useEffect, useRef } from "react";
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
  Users
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
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
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PartyTasks } from "@/components/tasks/PartyTasks";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  createdAt: Date;
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

const Tasks: React.FC = () => {
  // State for notes and search
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
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
  
  // Refs
  const editorRef = useRef<HTMLDivElement>(null);
  const taskInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Check if user is in a party
  useEffect(() => {
    if (user) {
      checkPartyStatus();
    }
  }, [user]);

  const checkPartyStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('party_members')
        .select('party_id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (error) throw error;
      
      setHasActiveParty(data && data.length > 0);
    } catch (error) {
      console.error("Error checking party status:", error);
    }
  };
  
  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);
  
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
    setNotes(notes.filter(note => note.id !== id));
    
    toast({
      title: "Note deleted",
      description: "Your note has been removed."
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
    <div className="container max-w-6xl mx-auto py-8 px-4 page-transition">
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
          <div 
            ref={editorRef}
            className={`max-w-lg mx-auto mb-8 ${getColorClass(selectedColor)} rounded-lg border shadow transition-all ${isPinned ? 'ring-1 ring-primary' : ''} ${
              isEditorOpen ? 'p-4' : 'hover:shadow-md cursor-pointer min-h-12'
            }`}
            onClick={() => !isEditorOpen && setIsEditorOpen(true)}
          >
            {isEditorOpen ? (
              <>
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
                    className={`h-8 w-8 p-0 ${isPinned ? 'text-primary' : ''}`}
                    onClick={() => setIsPinned(!isPinned)}
                  >
                    <PinIcon className={`h-4 w-4 ${isPinned ? 'fill-primary' : ''}`} />
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
                          className={`w-6 h-6 rounded-full ${color.class} border hover:scale-110 transition-transform ${selectedColor === color.value ? 'ring-2 ring-primary' : ''}`}
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
                      <div key={task.id} className="flex items-center gap-2">
                        <Checkbox 
                          checked={task.completed}
                          onCheckedChange={() => {
                            setNewTasks(newTasks.map(t => 
                              t.id === task.id ? { ...t, completed: !t.completed } : t
                            ));
                          }}
                        />
                        <span className={task.completed ? 'line-through text-muted-foreground flex-1' : 'flex-1'}>
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
                      </div>
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
                      className={noteType === 'note' ? 'bg-primary/10' : ''}
                      onClick={() => setNoteType('note')}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Note
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={noteType === 'checklist' ? 'bg-primary/10' : ''}
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
              </>
            ) : (
              <div className="p-4 text-muted-foreground">
                Click to add a note...
              </div>
            )}
          </div>
          
          {/* Notes grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-auto">
            {filteredNotes.map(note => (
              <div 
                key={note.id} 
                className={`${getColorClass(note.color)} rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow relative p-4 flex flex-col min-h-[100px] h-full`}
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
                        <div key={task.id} className="flex items-start gap-2">
                          <Checkbox 
                            checked={task.completed}
                            id={`task-${task.id}`}
                            onCheckedChange={() => toggleTaskCompletion(note.id, task.id)}
                            className="mt-0.5"
                          />
                          <label 
                            htmlFor={`task-${task.id}`}
                            className={`flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                          >
                            {task.text}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end mt-auto space-x-1 opacity-0 group-hover:opacity-100 hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                        <Palette className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="flex p-1 gap-1">
                      {colorOptions.map(color => (
                        <button
                          key={color.value}
                          className={`w-6 h-6 rounded-full ${color.class} border hover:scale-110 transition-transform`}
                          onClick={() => changeColor(note.id, color.value)}
                          title={color.name}
                        />
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0"
                    onClick={() => togglePin(note.id)}
                  >
                    <PinIcon className={`h-4 w-4 ${note.pinned ? 'fill-primary' : ''}`} />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-destructive/70 hover:text-destructive">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Note</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this note? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteNote(note.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
          
          {notes.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <ListPlus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">No notes yet</h3>
              <p className="text-muted-foreground mb-4">
                Click the input above to create your first note
              </p>
            </div>
          )}
          
          {notes.length > 0 && filteredNotes.length === 0 && (
            <div className="text-center py-12">
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
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="party">
          <PartyTasks />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tasks;
