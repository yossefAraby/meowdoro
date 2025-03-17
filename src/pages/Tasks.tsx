
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  MoreVertical, 
  Trash, 
  Edit, 
  Copy, 
  X, 
  Search, 
  CheckSquare, 
  ListPlus,
  Palette,
  PinIcon,
} from "lucide-react";

// Types for our notes
type TaskItem = {
  id: string;
  text: string;
  completed: boolean;
};

type NoteType = 'note' | 'list';

type Note = {
  id: string;
  type: NoteType;
  title: string;
  content: string;
  tasks?: TaskItem[];
  color: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const colorOptions = [
  { name: 'Default', value: 'default', class: 'bg-card' },
  { name: 'Red', value: 'red', class: 'bg-red-100 dark:bg-red-900/80' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-100 dark:bg-orange-900/80' },
  { name: 'Yellow', value: 'yellow', class: 'bg-yellow-100 dark:bg-yellow-900/80' },
  { name: 'Green', value: 'green', class: 'bg-green-100 dark:bg-green-900/80' },
  { name: 'Teal', value: 'teal', class: 'bg-teal-100 dark:bg-teal-900/80' },
  { name: 'Blue', value: 'blue', class: 'bg-blue-100 dark:bg-blue-900/80' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-100 dark:bg-purple-900/80' },
  { name: 'Pink', value: 'pink', class: 'bg-pink-100 dark:bg-pink-900/80' },
  { name: 'Gray', value: 'gray', class: 'bg-gray-100 dark:bg-gray-900/80' },
];

const Tasks: React.FC = () => {
  // Main state
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('meowdoro-notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  
  // UI state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [composeType, setComposeType] = useState<NoteType>('note');
  const [isComposerExpanded, setIsComposerExpanded] = useState(false);
  
  // New note state
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTasks, setNewNoteTasks] = useState<TaskItem[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  
  // Edit note state
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  const { toast } = useToast();
  const composeRef = useRef<HTMLDivElement>(null);
  
  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('meowdoro-notes', JSON.stringify(notes));
  }, [notes]);
  
  // Handle clicking outside composer to collapse it if empty
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (composeRef.current && !composeRef.current.contains(event.target as Node)) {
        if (newNoteTitle === '' && newNoteContent === '' && newNoteTasks.length === 0) {
          setIsComposerExpanded(false);
        }
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [newNoteTitle, newNoteContent, newNoteTasks]);
  
  // Filter and search notes
  const filteredNotes = notes.filter(note => {
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = note.title.toLowerCase().includes(query);
      const matchesContent = note.content.toLowerCase().includes(query);
      const matchesTasks = note.tasks?.some(task => task.text.toLowerCase().includes(query));
      
      return matchesTitle || matchesContent || matchesTasks;
    }
    
    return true;
  });
  
  // Sort notes: pinned first, then by updatedAt date
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
  
  // Create a new note
  const handleCreateNote = () => {
    if (!newNoteTitle && !newNoteContent && newNoteTasks.length === 0) {
      return;
    }
    
    const newNote: Note = {
      id: Date.now().toString(),
      type: composeType,
      title: newNoteTitle,
      content: composeType === 'note' ? newNoteContent : '',
      tasks: composeType === 'list' ? newNoteTasks : undefined,
      color: 'default',
      pinned: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setNotes([newNote, ...notes]);
    
    // Reset form
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteTasks([]);
    setNewTaskText('');
    setIsComposerExpanded(false);
    
    toast({
      title: "Note created",
      description: "Your note has been saved."
    });
  };
  
  // Pin/unpin a note
  const togglePin = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? {...note, pinned: !note.pinned, updatedAt: new Date()} : note
    ));
  };
  
  // Change note color
  const changeNoteColor = (id: string, color: string) => {
    setNotes(notes.map(note => 
      note.id === id ? {...note, color, updatedAt: new Date()} : note
    ));
  };
  
  // Delete a note
  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    
    toast({
      title: "Note deleted",
      description: "Your note has been deleted."
    });
  };
  
  // Duplicate a note
  const duplicateNote = (note: Note) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      title: `${note.title} (Copy)`,
      pinned: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setNotes([newNote, ...notes]);
    
    toast({
      title: "Note duplicated",
      description: "A copy of your note has been created."
    });
  };
  
  // Add a task to a list note
  const addTask = (id: string, text: string) => {
    if (!text.trim()) return;
    
    setNotes(notes.map(note => {
      if (note.id === id && note.type === 'list') {
        const newTask: TaskItem = {
          id: Date.now().toString(),
          text: text.trim(),
          completed: false
        };
        
        return {
          ...note,
          tasks: [...(note.tasks || []), newTask],
          updatedAt: new Date()
        };
      }
      return note;
    }));
  };
  
  // Toggle a task's completed status
  const toggleTask = (noteId: string, taskId: string) => {
    setNotes(notes.map(note => {
      if (note.id === noteId && note.tasks) {
        return {
          ...note,
          tasks: note.tasks.map(task => 
            task.id === taskId ? {...task, completed: !task.completed} : task
          ),
          updatedAt: new Date()
        };
      }
      return note;
    }));
  };
  
  // Delete a task from a list note
  const deleteTask = (noteId: string, taskId: string) => {
    setNotes(notes.map(note => {
      if (note.id === noteId && note.tasks) {
        return {
          ...note,
          tasks: note.tasks.filter(task => task.id !== taskId),
          updatedAt: new Date()
        };
      }
      return note;
    }));
  };
  
  // Add a task to the new note composer
  const addNewNoteTask = () => {
    if (!newTaskText.trim()) return;
    
    const newTask: TaskItem = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false
    };
    
    setNewNoteTasks([...newNoteTasks, newTask]);
    setNewTaskText('');
  };
  
  // Delete a task from the new note composer
  const deleteNewNoteTask = (id: string) => {
    setNewNoteTasks(newNoteTasks.filter(task => task.id !== id));
  };
  
  // Expand the composer and optionally set type
  const expandComposer = (type?: NoteType) => {
    if (type) {
      setComposeType(type);
    }
    setIsComposerExpanded(true);
  };
  
  // Get note background color class
  const getNoteColorClass = (color: string) => {
    const colorOption = colorOptions.find(option => option.value === color);
    return colorOption ? colorOption.class : 'bg-card';
  };
  
  // Begin editing a note
  const startEditingNote = (note: Note) => {
    setEditingNote(note);
  };
  
  // Save edits to a note
  const saveEditedNote = () => {
    if (!editingNote) return;
    
    setNotes(notes.map(note => 
      note.id === editingNote.id ? {...editingNote, updatedAt: new Date()} : note
    ));
    
    setEditingNote(null);
    
    toast({
      title: "Note updated",
      description: "Your changes have been saved."
    });
  };
  
  // Update a task in the editing note
  const updateEditingNoteTask = (taskId: string, text: string) => {
    if (!editingNote || !editingNote.tasks) return;
    
    setEditingNote({
      ...editingNote,
      tasks: editingNote.tasks.map(task => 
        task.id === taskId ? {...task, text} : task
      )
    });
  };
  
  // Add a task to the editing note
  const addTaskToEditingNote = () => {
    if (!editingNote || !newTaskText.trim()) return;
    
    const newTask: TaskItem = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false
    };
    
    setEditingNote({
      ...editingNote,
      tasks: [...(editingNote.tasks || []), newTask]
    });
    
    setNewTaskText('');
  };
  
  // Delete a task from the editing note
  const deleteTaskFromEditingNote = (taskId: string) => {
    if (!editingNote || !editingNote.tasks) return;
    
    setEditingNote({
      ...editingNote,
      tasks: editingNote.tasks.filter(task => task.id !== taskId)
    });
  };
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 page-transition">
      {/* Search bar */}
      <div className="relative max-w-xl mx-auto mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search your notes"
          className="pl-10 shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Note composer */}
      <div 
        ref={composeRef}
        className={`mb-8 rounded-lg border shadow-sm transition-all duration-200 overflow-hidden max-w-xl mx-auto`}
      >
        <div className="p-4">
          {isComposerExpanded && (
            <Input
              placeholder="Title"
              className="w-full border-none text-lg font-medium mb-2 p-0 focus-visible:ring-0"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
            />
          )}
          
          {composeType === 'note' ? (
            <Textarea
              placeholder={isComposerExpanded ? "Take a note..." : "Click to add a note..."}
              className={`w-full resize-none border-none focus-visible:ring-0 p-0 ${
                isComposerExpanded ? 'min-h-[100px]' : 'h-12'
              }`}
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              onClick={() => expandComposer()}
            />
          ) : (
            <div className="space-y-2">
              {newNoteTasks.map(task => (
                <div key={task.id} className="flex items-center gap-2">
                  <Checkbox checked={task.completed} onCheckedChange={() => {
                    setNewNoteTasks(
                      newNoteTasks.map(t => t.id === task.id ? {...t, completed: !t.completed} : t)
                    );
                  }} />
                  <span className="flex-grow">{task.text}</span>
                  <Button variant="ghost" size="icon" onClick={() => deleteNewNoteTask(task.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center gap-2">
                <Input
                  placeholder={isComposerExpanded ? "Add list item..." : "Click to add a list..."}
                  className="flex-grow border-none focus-visible:ring-0 p-0"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onClick={() => expandComposer('list')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newTaskText.trim()) {
                      addNewNoteTask();
                    }
                  }}
                />
                {isComposerExpanded && (
                  <Button variant="ghost" size="icon" onClick={addNewNoteTask}>
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        
        {isComposerExpanded && (
          <div className="flex justify-between items-center p-2 border-t">
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setComposeType('note')}
                className={composeType === 'note' ? 'bg-accent/50' : ''}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setComposeType('list')}
                className={composeType === 'list' ? 'bg-accent/50' : ''}
              >
                <CheckSquare className="h-4 w-4" />
              </Button>
            </div>
            
            <Button variant="default" size="sm" onClick={handleCreateNote}>
              Save
            </Button>
          </div>
        )}
      </div>
      
      {/* Notes masonry grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-min">
        {sortedNotes.map(note => (
          <div 
            key={note.id} 
            className={`relative rounded-lg border shadow-sm overflow-hidden ${
              getNoteColorClass(note.color)
            } transition-all hover:shadow-md ${
              note.pinned ? 'ring-1 ring-primary' : ''
            } h-fit`}
          >
            {note.pinned && (
              <div className="absolute top-1 right-1 text-primary">
                <PinIcon className="h-4 w-4 fill-primary" />
              </div>
            )}
            
            {editingNote?.id === note.id ? (
              // Edit mode
              <div className="p-4">
                <Input
                  placeholder="Title"
                  className="w-full border-none text-lg font-medium mb-2 p-0 focus-visible:ring-0"
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({...editingNote, title: e.target.value})}
                />
                
                {editingNote.type === 'note' ? (
                  <Textarea
                    placeholder="Note content..."
                    className="w-full resize-none border-none focus-visible:ring-0 p-0 min-h-[100px]"
                    value={editingNote.content}
                    onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                  />
                ) : (
                  <div className="space-y-2">
                    {editingNote.tasks?.map(task => (
                      <div key={task.id} className="flex items-center gap-2">
                        <Checkbox 
                          checked={task.completed}
                          onCheckedChange={() => {
                            if (!editingNote.tasks) return;
                            setEditingNote({
                              ...editingNote,
                              tasks: editingNote.tasks.map(t => 
                                t.id === task.id ? {...t, completed: !t.completed} : t
                              )
                            });
                          }}
                        />
                        <Input
                          className="flex-grow border-none focus-visible:ring-0 p-0"
                          value={task.text}
                          onChange={(e) => updateEditingNoteTask(task.id, e.target.value)}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteTaskFromEditingNote(task.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Add item..."
                        className="flex-grow border-none focus-visible:ring-0 p-0"
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newTaskText.trim()) {
                            addTaskToEditingNote();
                          }
                        }}
                      />
                      <Button variant="ghost" size="icon" onClick={addTaskToEditingNote}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between mt-4">
                  <Button variant="ghost" size="sm" onClick={() => setEditingNote(null)}>
                    Cancel
                  </Button>
                  <Button variant="default" size="sm" onClick={saveEditedNote}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              // View mode
              <>
                <div className="p-4">
                  {note.title && (
                    <h3 className="text-lg font-medium mb-1">{note.title}</h3>
                  )}
                  
                  {note.type === 'note' ? (
                    <div className="whitespace-pre-wrap">
                      {note.content || <span className="text-muted-foreground italic">Empty note</span>}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {note.tasks && note.tasks.length > 0 ? (
                        note.tasks.map(task => (
                          <div key={task.id} className="flex items-start gap-2">
                            <Checkbox 
                              id={`task-${task.id}`}
                              checked={task.completed}
                              onCheckedChange={() => toggleTask(note.id, task.id)}
                              className="mt-1"
                            />
                            <label 
                              htmlFor={`task-${task.id}`}
                              className={`flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                            >
                              {task.text}
                            </label>
                          </div>
                        ))
                      ) : (
                        <span className="text-muted-foreground italic">Empty list</span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center p-2 border-t bg-background/40">
                  <div className="flex">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => togglePin(note.id)}
                      title={note.pinned ? "Unpin" : "Pin"}
                    >
                      <PinIcon className="h-4 w-4" />
                    </Button>
                    
                    {note.type === 'list' && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setComposeType('list');
                          setNewTaskText('');
                          setIsComposerExpanded(true);
                          expandComposer('list');
                        }}
                        title="Add item"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => startEditingNote(note)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => duplicateNote(note)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Make a copy
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem>
                        <Palette className="h-4 w-4 mr-2" />
                        <span>Background</span>
                        
                        <div className="ml-auto flex gap-1">
                          {colorOptions.map(color => (
                            <button
                              key={color.value}
                              className={`w-4 h-4 rounded-full ${color.class} border border-border hover:scale-125 transition-transform`}
                              onClick={(e) => {
                                e.stopPropagation();
                                changeNoteColor(note.id, color.value);
                              }}
                              title={color.name}
                            />
                          ))}
                        </div>
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
                            <AlertDialogTitle>Delete note?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
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
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      
      {/* Empty state */}
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
      
      {/* Filtered empty state */}
      {notes.length > 0 && sortedNotes.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Search className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">No matching notes</h3>
          <p className="text-muted-foreground mb-4">
            Try changing your search
          </p>
          <Button variant="outline" onClick={() => setSearchQuery('')}>
            Clear search
          </Button>
        </div>
      )}
    </div>
  );
};

export default Tasks;
