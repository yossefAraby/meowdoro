import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Plus,
  Menu,
  Users,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Import our components
import NoteSidebar from "@/components/notes/NoteSidebar";
import NoteEditor from "@/components/notes/NoteEditor";
import MasonryGrid from "@/components/notes/MasonryGrid";
import EditLabelsDialog from "@/components/notes/EditLabelsDialog";

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

interface Note {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'checklist';
  tasks: { id: string; text: string; completed: boolean }[];
  color: string;
  pinned: boolean;
  archived: boolean;
  trashed: boolean;
  labels: { id: string; name: string; added: boolean }[];
  createdAt: Date;
  attachments?: { 
    id: string;
    name: string;
    type: string;
    size: number;
    data: string;
  }[];
}

const Tasks: React.FC = () => {
  // State for notes
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const savedNotes = localStorage.getItem('notes');
      return savedNotes ? JSON.parse(savedNotes) : [];
    } catch (error) {
      console.error('Error loading notes from localStorage:', error);
      return [];
    }
  });

  // Labels state
  const [labels, setLabels] = useState<{ id: string; name: string; added: boolean }[]>(() => {
    try {
      const savedLabels = localStorage.getItem('labels');
      return savedLabels ? JSON.parse(savedLabels) : [];
    } catch (error) {
      console.error('Error loading labels from localStorage:', error);
      return [];
    }
  });
  
  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [activeView, setActiveView] = useState('notes');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditLabelsOpen, setIsEditLabelsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [hasActiveParty, setHasActiveParty] = useState(false);
  const { user } = useAuth();

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
  
  // Save labels to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('labels', JSON.stringify(labels));
    } catch (error) {
      console.error('Error saving labels to localStorage:', error);
      toast({
        title: "Error",
        description: "Failed to save labels",
        variant: "destructive",
      });
    }
  }, [labels, toast]);

  // Check if user is in a party
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

  // Check party status when user changes
  useEffect(() => {
    if (user) {
      checkPartyStatus();
    }
  }, [user]);

  // Handle view changes
  const handleViewChange = (view: string) => {
    if (view === 'edit-labels') {
      setIsEditLabelsOpen(true);
        } else {
      setActiveView(view);
      setIsSidebarOpen(false);
    }
  };

  // Handle sidebar collapse
  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  // Filter notes based on active view and search query
  const getFilteredNotes = () => {
    // Check if we have an active label from the URL (format: "labels/labelId")
    const activeLabel = activeView.startsWith('labels/') ? activeView.split('/')[1] : undefined;
    
    return notes
      .filter(note => {
        // Filter by view type
        if (activeView === 'archive') return note.archived && !note.trashed;
        if (activeView === 'trash') return note.trashed;
        if (activeView === 'notes') return !note.archived && !note.trashed;
        if (activeView === 'labels') {
          return !note.archived && !note.trashed && note.labels.some(nl => 
            labels.some(l => l.added && nl.added)
          );
        }
        if (activeView.startsWith('labels/') && activeLabel) {
          return !note.archived && !note.trashed && note.labels.some(nl => 
            nl.id === activeLabel && nl.added
          );
        }
        return true;
      })
    .filter(note => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      const inTitle = note.title.toLowerCase().includes(query);
      const inContent = note.content.toLowerCase().includes(query);
      const inTasks = note.tasks.some(task => task.text.toLowerCase().includes(query));
        const inLabels = note.labels.some(label => label.name.toLowerCase().includes(query));
        
        return inTitle || inContent || inTasks || inLabels;
      });
  };

  const filteredNotes = getFilteredNotes();
  const pinnedNotes = filteredNotes.filter(note => note.pinned);
  const unpinnedNotes = filteredNotes.filter(note => !note.pinned);

  // Handle note creation
  const handleCreateNote = (noteData: { 
    title: string; 
    content: string; 
    type: 'note' | 'checklist'; 
    tasks: { id: string; text: string; completed: boolean }[]; 
    color: string; 
    pinned: boolean;
    labels: { id: string; name: string; added: boolean }[];
    attachments?: { id: string; name: string; type: string; size: number; data: string; }[];
  }) => {
    const newNote: Note = {
      id: Date.now().toString(),
      ...noteData,
      archived: false,
      trashed: false,
      createdAt: new Date(),
    };
    
    setNotes(prev => [newNote, ...prev]);
    setIsEditorOpen(false);
    
    toast({
      title: "Note created",
      description: "Your note has been saved successfully."
    });
  };
  
  // Handle note updates
  const handleUpdateNote = (noteData: { 
    title: string; 
    content: string; 
    type: 'note' | 'checklist'; 
    tasks: { id: string; text: string; completed: boolean }[]; 
    color: string; 
    pinned: boolean;
    labels: { id: string; name: string; added: boolean }[];
    attachments?: { id: string; name: string; type: string; size: number; data: string; }[];
  }) => {
    if (!editingNote) return;
    
    setNotes(prev => prev.map(note => 
      note.id === editingNote.id
        ? { ...note, ...noteData }
        : note
    ));
    
    setEditingNote(undefined);
    
    toast({
      title: "Note updated",
      description: "Your note has been updated successfully."
    });
  };
  
  // Toggle pin status
  const handlePinNote = (id: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, pinned: !note.pinned } : note
    ));
  };
  
  // Change note color
  const handleColorChange = (id: string, color: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, color } : note
    ));
  };
  
  // Delete/Restore note
  const handleDeleteNote = (id: string) => {
    if (activeView === 'trash') {
      // Permanently delete if already in trash
      setNotes(prev => prev.filter(note => note.id !== id));
      toast({
        title: "Note deleted",
        description: "The note has been permanently deleted."
      });
    } else {
      // Move to trash
      setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, trashed: true } : note
    ));
    toast({
      title: "Note moved to trash",
        description: "The note has been moved to trash."
    });
    }
  };
  
  // Toggle archive status
  const handleArchiveNote = (id: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, archived: !note.archived } : note
    ));
    
    toast({
      title: "Note archived",
      description: "The note has been archived."
    });
  };
  
  // Toggle task completion
  const handleToggleTask = (noteId: string, taskId: string) => {
    setNotes(prev => prev.map(note => {
      if (note.id !== noteId) return note;
      
      return {
        ...note,
        tasks: note.tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      };
    }));
  };
  
  // Restore from trash
  const handleRestoreNote = (id: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, trashed: false } : note
    ));
    
    toast({
      title: "Note restored",
      description: "The note has been restored."
    });
  };

  // Update labels (used by the EditLabelsDialog)
  const handleLabelsUpdate = (updatedLabels: { id: string; name: string; added: boolean }[]) => {
    setLabels(updatedLabels);

    // Also update all notes that use any of the labels that were changed
    setNotes(prevNotes => prevNotes.map(note => {
      // Check if any of the note's labels have been updated/deleted
      const updatedNoteLabels = note.labels.filter(noteLabel => 
        updatedLabels.some(updatedLabel => updatedLabel.id === noteLabel.id)
      );
      
      // If the note's labels changed, update the note
      if (updatedNoteLabels.length !== note.labels.length) {
        return {
          ...note,
          labels: updatedNoteLabels
        };
      }
      return note;
    }));

    toast({
      title: "Labels updated",
      description: "Your labels have been updated successfully."
    });
  };

  // Empty trash
  const handleEmptyTrash = () => {
    setNotes(prev => prev.filter(note => !note.trashed));
    
    toast({
      title: "Trash emptied",
      description: "All notes in trash have been permanently deleted."
    });
  };

  // Get page title based on active view
  const getPageTitle = () => {
    switch (activeView) {
      case 'notes': return 'Notes';
      case 'archive': return 'Archive';
      case 'trash': return 'Trash';
      case 'labels': return 'Labels';
      default: return 'Notes';
    }
  };

  // Render content based on active view
  const renderContent = () => {
    if (filteredNotes.length === 0) {
      return (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            {activeView === 'notes' ? (
              <Search className="h-8 w-8 text-primary" />
            ) : activeView === 'archive' ? (
              <Search className="h-8 w-8 text-primary" />
            ) : (
              <Search className="h-8 w-8 text-primary" />
            )}
          </div>
          <h3 className="text-xl font-medium mb-2">
            {activeView === 'notes' 
              ? searchQuery ? 'No matching notes' : 'No notes yet'
              : activeView === 'archive'
              ? 'No archived notes'
              : activeView === 'labels'
              ? 'No labeled notes' 
              : 'No notes in trash'
            }
          </h3>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery('')} className="mt-4">
              Clear Search
            </Button>
          )}
        </motion.div>
      );
    }

    return (
      <>
        {/* Pinned Notes */}
        {pinnedNotes.length > 0 && (
          <MasonryGrid
            notes={pinnedNotes}
            title="PINNED"
            onNoteClick={setEditingNote}
            onNotePin={handlePinNote}
            onNoteDelete={activeView === 'trash' ? handleRestoreNote : handleDeleteNote}
            onNoteArchive={handleArchiveNote}
            onNoteColorChange={handleColorChange}
            onTaskToggle={handleToggleTask}
            onNoteSelect={handleNoteSelect}
            selectedNotes={selectedNotes}
            selectionMode={selectionMode}
          />
        )}

        {/* Other Notes */}
        {unpinnedNotes.length > 0 && (
          <MasonryGrid
            notes={unpinnedNotes}
            title={pinnedNotes.length > 0 ? "OTHERS" : undefined}
            onNoteClick={setEditingNote}
            onNotePin={handlePinNote}
            onNoteDelete={activeView === 'trash' ? handleRestoreNote : handleDeleteNote}
            onNoteArchive={handleArchiveNote}
            onNoteColorChange={handleColorChange}
            onTaskToggle={handleToggleTask}
            onNoteSelect={handleNoteSelect}
            selectedNotes={selectedNotes}
            selectionMode={selectionMode}
          />
        )}
      </>
    );
  };

  // Handle note selection
  const handleNoteSelect = (id: string, selected: boolean) => {
    setSelectedNotes(prev => {
      if (selected) {
        return [...prev, id];
      } else {
        return prev.filter(noteId => noteId !== id);
      }
    });
  };

  // Toggle selection mode
  const toggleSelectionMode = () => {
    setSelectionMode(prev => !prev);
    if (selectionMode) {
      setSelectedNotes([]);
    }
  };

  // Bulk operations on selected notes
  const deleteSelectedNotes = () => {
    if (selectedNotes.length === 0) return;
    
    if (activeView === 'trash') {
      // Permanently delete
      setNotes(prev => prev.filter(note => !selectedNotes.includes(note.id)));
      toast({
        title: `${selectedNotes.length} notes deleted`,
        description: "Selected notes have been permanently deleted."
      });
    } else {
      // Move to trash
      setNotes(prev => prev.map(note => 
        selectedNotes.includes(note.id) ? { ...note, trashed: true } : note
      ));
      toast({
        title: `${selectedNotes.length} notes moved to trash`,
        description: "Selected notes have been moved to trash."
      });
    }
    
    setSelectedNotes([]);
    setSelectionMode(false);
  };

  const archiveSelectedNotes = () => {
    if (selectedNotes.length === 0) return;
    
    setNotes(prev => prev.map(note => 
      selectedNotes.includes(note.id) ? { ...note, archived: true } : note
    ));
    
    toast({
      title: `${selectedNotes.length} notes archived`,
      description: "Selected notes have been archived."
    });
    
    setSelectedNotes([]);
    setSelectionMode(false);
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen md:h-[calc(100vh-5rem)] mt-2 md:mt-0">
        {/* Sidebar */}
        <div className={cn(
          "h-full transition-all duration-300 md:block",
          isSidebarOpen ? "block" : "hidden md:block",
          isSidebarCollapsed ? "w-16" : "w-64"
        )}>
          <NoteSidebar
            activeView={activeView}
            onViewChange={handleViewChange}
            onCollapse={handleSidebarCollapse}
            onToggleSelection={toggleSelectionMode}
            isSelectionMode={selectionMode}
            labels={labels}
            activeLabel={activeView.startsWith('labels/') ? activeView.split('/')[1] : undefined}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-0 mb-2">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="personal" className="gap-2">
                <FileText className="h-4 w-4" />
                Personal Notes
              </TabsTrigger>
              <TabsTrigger value="party" disabled={!hasActiveParty} className="gap-2">
                <Users className="h-4 w-4" />
                Party Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              {/* Header */}
              <header className="flex items-center justify-center p-2 md:p-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="md:hidden absolute left-2"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                
                <div className="w-full max-w-xl relative md:mx-0 mx-8">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search"
                    className="pl-10 shadow-sm h-9 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </header>

              {/* Selection actions */}
              {selectionMode && selectedNotes.length > 0 && (
                <div className="flex items-center justify-center gap-2 pb-2">
                  <span className="text-sm">{selectedNotes.length} selected</span>
                  
                  {activeView !== 'archive' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={archiveSelectedNotes}
                    >
                      Archive
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={deleteSelectedNotes}
                  >
                    {activeView === 'trash' ? "Delete permanently" : "Delete"}
                  </Button>
                </div>
              )}
                      
              {/* Main content area */}
              <div className="flex-1 overflow-y-auto p-4 pb-24 md:pb-4">
                {/* Note editor - only render if editing or creating */}
                {(isEditorOpen || editingNote) && (
                  <NoteEditor
                    isOpen={true}
                    initialNote={editingNote}
                    onSave={editingNote ? handleUpdateNote : handleCreateNote}
                    onClose={() => {
                      setIsEditorOpen(false);
                      setEditingNote(undefined);
                    }}
                  />
                )}
                
                {/* Notes grid */}
                {renderContent()}
              </div>

              {/* Floating action button */}
              {!isEditorOpen && !editingNote && activeView === 'notes' && (
                <Button
                  className="fixed right-6 bottom-24 md:bottom-6 h-14 w-14 rounded-full shadow-lg"
                  onClick={() => setIsEditorOpen(true)}
                >
                  <Plus className="h-6 w-6" />
                  <span className="sr-only">Create note</span>
                </Button>
              )}
            </TabsContent>

            <TabsContent value="party">
              <div className="py-8 text-center">
                {!hasActiveParty ? (
                  <div className="mb-4">
                    <Users className="h-16 w-16 mx-auto text-muted-foreground mb-2" />
                    <h3 className="text-xl font-semibold mb-2">No Active Party</h3>
                    <p className="text-muted-foreground mb-4">
                      Join a study party to access shared notes.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Party Notes</h3>
                    <p className="text-muted-foreground">
                      Coming soon! You'll be able to share and collaborate on notes with your party members.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
                    
        {/* Edit Labels Dialog */}
        <EditLabelsDialog
          open={isEditLabelsOpen}
          onOpenChange={setIsEditLabelsOpen}
          labels={labels}
          onLabelsUpdate={handleLabelsUpdate}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Tasks; 