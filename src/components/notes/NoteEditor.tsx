import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  PinIcon, 
  ArchiveIcon, 
  Palette, 
  TagIcon,
  ImageIcon, 
  MoreVertical,
  Plus,
  CheckSquare,
  ListChecks,
  X,
  Bold,
  Italic,
  Underline,
  Heading,
  List,
  ListOrdered,
  Quote,
  PaperclipIcon,
  FileIcon,
  DownloadIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface Label {
  id: string;
  name: string;
  added: boolean;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string;
}

interface NoteEditorProps {
  isOpen: boolean;
  initialNote?: {
    id: string;
    title: string;
    content: string;
    type: 'note' | 'checklist';
    tasks: Task[];
    color: string;
    pinned: boolean;
    labels: Label[];
    attachments?: Attachment[];
  };
  onSave: (note: { 
    title: string; 
    content: string; 
    type: 'note' | 'checklist'; 
    tasks: Task[]; 
    color: string; 
    pinned: boolean;
    labels: Label[];
    attachments?: Attachment[];
  }) => void;
  onClose: () => void;
}

// Get all available labels (temporary implementation until integrated with main state)
const getAvailableLabels = (): Label[] => {
  try {
    const savedLabels = localStorage.getItem('labels');
    return savedLabels ? JSON.parse(savedLabels) : [];
  } catch (error) {
    console.error('Error loading labels from localStorage:', error);
    return [];
  }
};

const NoteEditor: React.FC<NoteEditorProps> = ({
  isOpen,
  initialNote,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [type, setType] = useState<'note' | 'checklist'>(initialNote?.type || 'note');
  const [tasks, setTasks] = useState<Task[]>(initialNote?.tasks || []);
  const [pinned, setPinned] = useState(initialNote?.pinned || false);
  const [color, setColor] = useState(initialNote?.color || 'bg-card');
  const [labels, setLabels] = useState<Label[]>(initialNote?.labels || []);
  const [attachments, setAttachments] = useState<Attachment[]>(initialNote?.attachments || []);
  const [newTaskText, setNewTaskText] = useState('');
  const [isExpanded, setIsExpanded] = useState(!!initialNote);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isLabelsPopoverOpen, setIsLabelsPopoverOpen] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [availableLabels, setAvailableLabels] = useState<Label[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const taskInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize content when the editor mounts
  useEffect(() => {
    if (isOpen && !isExpanded) {
      setIsExpanded(true);
    }
  }, [isOpen]);

  // Update state when initialNote changes
  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title);
      setContent(initialNote.content);
      setType(initialNote.type);
      setTasks(initialNote.tasks);
      setPinned(initialNote.pinned);
      setColor(initialNote.color);
      setLabels(initialNote.labels || []);
      setAttachments(initialNote.attachments || []);
    }
  }, [initialNote]);
  
  // Update editor content when content state changes
  useEffect(() => {
    if (editorRef.current && content) {
      // Only update if the current content is different to avoid cursor jumping
      if (editorRef.current.innerHTML !== content) {
        editorRef.current.innerHTML = content;
      }
    }
  }, []);

  // Load available labels
  useEffect(() => {
    setAvailableLabels(getAvailableLabels());
  }, [isLabelsPopoverOpen]);

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      // Ensure we're not just clicking on a popover
      const isClickingPopover = 
        (e.target as HTMLElement).closest('[data-radix-popper-content-wrapper]') ||
        (e.target as HTMLElement).closest('[role="dialog"]');
      
      if (!isClickingPopover) {
        handleSave();
      }
    }
  };

  useEffect(() => {
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, title, content, tasks, pinned, color, labels, attachments]); // Include dependencies to ensure proper saving

  const handleSave = () => {
    // Get the latest content from the editor
    const currentContent = editorRef.current?.innerHTML || content;
    
    // Don't save empty notes unless they have tasks or attachments
    if ((!title.trim() && !currentContent.trim() && tasks.length === 0 && attachments.length === 0) || !isExpanded) {
      resetForm();
      return;
    }
    
    onSave({
      title: title.trim(),
      content: type === 'note' ? currentContent.trim() : '',
      type,
      tasks: type === 'checklist' ? tasks : [],
      color,
      pinned,
      labels,
      attachments: attachments.length > 0 ? attachments : undefined
    });
    
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setType('note');
    setTasks([]);
    setPinned(false);
    setColor('bg-card');
    setLabels([]);
    setAttachments([]);
    setNewTaskText('');
    setIsExpanded(false);
    onClose();
  };

  // New function to handle content changes
  const handleContentChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const addTask = () => {
    if (!newTaskText.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false
    };
    
    setTasks(prev => [...prev, newTask]);
    setNewTaskText('');
    setTimeout(() => {
      if (taskInputRef.current) {
        taskInputRef.current.focus();
      }
    }, 0);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const updateTaskText = (id: string, text: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, text } : task
    ));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type === 'checklist' && newTaskText.trim()) {
      e.preventDefault();
      addTask();
    }
  };

  const toggleType = () => {
    setType(prev => prev === 'note' ? 'checklist' : 'note');
  };

  const toggleLabel = (label: Label) => {
    const labelIndex = labels.findIndex(l => l.id === label.id);
    if (labelIndex >= 0) {
      // If label exists in the note, toggle its 'added' status
      setLabels(prev => prev.map(l => 
        l.id === label.id ? { ...l, added: !l.added } : l
      ));
    } else {
      // If label doesn't exist in the note, add it
      setLabels(prev => [...prev, { ...label, added: true }]);
    }
  };

  const isLabelAdded = (id: string): boolean => {
    return labels.some(label => label.id === id && label.added);
  };

  // Improved text formatting functions
  const formatText = (format: string) => {
    if (!editorRef.current) return;

    // Focus the editor
    editorRef.current.focus();
    
    // Execute the appropriate command based on format
    switch (format) {
      case 'bold':
        document.execCommand('bold', false);
        break;
      case 'italic':
        document.execCommand('italic', false);
        break;
      case 'underline':
        document.execCommand('underline', false);
        break;
      case 'heading':
        // Insert a heading
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const selectedText = range.toString();
          
          // Create heading element
          const h3 = document.createElement('h3');
          h3.style.fontSize = '1.25rem';
          h3.style.fontWeight = 'bold';
          h3.style.margin = '0.75rem 0 0.5rem';
          
          if (selectedText) {
            h3.textContent = selectedText;
            range.deleteContents();
            range.insertNode(h3);
          } else {
            h3.innerHTML = '&nbsp;'; // Add a non-breaking space
            range.insertNode(h3);
            // Place caret inside heading
            const newRange = document.createRange();
            newRange.setStart(h3, 0);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
        }
        break;
      case 'list':
        document.execCommand('insertUnorderedList', false);
        break;
      case 'ordered-list':
        document.execCommand('insertOrderedList', false);
        break;
      case 'quote':
        document.execCommand('formatBlock', false, '<blockquote>');
        // Add styling to blockquote
        const blockquotes = editorRef.current.querySelectorAll('blockquote');
        blockquotes.forEach(blockquote => {
          blockquote.style.borderLeft = '4px solid #e5e7eb';
          blockquote.style.paddingLeft = '1rem';
          blockquote.style.margin = '0.75rem 0';
          blockquote.style.fontStyle = 'italic';
          blockquote.style.color = 'var(--muted-foreground)';
        });
        break;
      default:
        return;
    }
    
    // Update content state after formatting
    handleContentChange();
  };
  
  // File upload handling
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit');
      return;
    }
    
    // Convert file to Base64
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const newAttachment: Attachment = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type,
          size: file.size,
          data: event.target.result as string
        };
        
        setAttachments(prev => [...prev, newAttachment]);
      }
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };
  
  const downloadAttachment = (attachment: Attachment) => {
    const link = document.createElement('a');
    link.href = attachment.data;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const colors = [
    { name: 'Default', value: 'bg-card' },
    { name: 'Red', value: 'bg-red-100 dark:bg-red-900/40' },
    { name: 'Orange', value: 'bg-orange-100 dark:bg-orange-900/40' },
    { name: 'Yellow', value: 'bg-yellow-100 dark:bg-yellow-900/40' },
    { name: 'Green', value: 'bg-green-100 dark:bg-green-900/40' },
    { name: 'Teal', value: 'bg-teal-100 dark:bg-teal-900/40' },
    { name: 'Blue', value: 'bg-blue-100 dark:bg-blue-900/40' },
    { name: 'Purple', value: 'bg-purple-100 dark:bg-purple-900/40' },
    { name: 'Pink', value: 'bg-pink-100 dark:bg-pink-900/40' },
    { name: 'Brown', value: 'bg-amber-100 dark:bg-amber-900/40' },
    { name: 'Gray', value: 'bg-gray-100 dark:bg-gray-800' }
  ];

  if (!isOpen) return null;

  return (
    <div className="max-w-[800px] mx-auto mb-8 note-editor">
      <AnimatePresence>
        <motion.div
          ref={containerRef}
          initial={false}
          animate={isExpanded ? {
            width: "100%",
            minHeight: type === 'checklist' ? "auto" : "min(80vh, 600px)",
            scale: 1,
            y: 0
          } : {
            width: "600px",
            height: "auto",
            scale: 0.98,
            y: 0
          }}
          className={cn(
            "relative mx-auto rounded-lg border shadow-lg p-4",
            color
          )}
          onClick={() => !isExpanded && setIsExpanded(true)}
        >
          <div className="space-y-4">
            {/* Title input - only visible when expanded */}
            {isExpanded && (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="border-none bg-transparent px-4 text-xl font-medium placeholder:text-muted-foreground/50 focus-visible:ring-0"
                data-testid="note-title-input"
              />
            )}
            
            {/* Text formatting bar - only for notes and when expanded */}
            {isExpanded && type === 'note' && (
              <div className="flex flex-wrap items-center gap-1 border-b pb-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => formatText('bold')}
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Bold</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => formatText('italic')}
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Italic</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => formatText('underline')}
                      >
                        <Underline className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Underline</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <div className="h-6 w-px bg-border mx-1" />
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => formatText('heading')}
                      >
                        <Heading className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Heading</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => formatText('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Bullet List</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => formatText('ordered-list')}
                      >
                        <ListOrdered className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Numbered List</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => formatText('quote')}
                      >
                        <Quote className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Quote</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <div className="h-6 w-px bg-border mx-1" />
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <PaperclipIcon className="h-4 w-4" />
                        </Button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={handleFileUpload}
                          accept="*/*"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Attach File (10MB max)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
            
            {/* Content - either rich editor or checklist */}
            {type === 'note' ? (
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className={cn(
                  "min-h-[200px] resize-none bg-transparent border-0 focus:outline-none text-sm leading-relaxed px-4 py-2 rounded-md prose prose-sm max-w-none text-foreground dark:prose-invert empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50",
                  isExpanded && "min-h-[400px]"
                )}
                onInput={handleContentChange}
                data-placeholder="Take a note..."
              />
            ) : (
              <div className="space-y-2">
                {/* Existing tasks */}
                {tasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 group">
                    <Checkbox 
                      checked={task.completed}
                      onClick={() => toggleTaskCompletion(task.id)}
                    />
                    <Input
                      value={task.text}
                      onChange={(e) => updateTaskText(task.id, e.target.value)}
                      className={cn(
                        "border-none bg-transparent p-0 h-auto focus-visible:ring-0 text-foreground",
                        task.completed && "line-through text-muted-foreground"
                      )}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      onClick={() => deleteTask(task.id)}
                    >
                      <span className="sr-only">Delete task</span>
                      <span aria-hidden className="text-sm">×</span>
                    </Button>
                  </div>
                ))}
                
                {/* Add new task input */}
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-sm border border-primary/50" />
                  <Input
                    ref={taskInputRef}
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="List item"
                    className="border-none bg-transparent p-0 h-auto focus-visible:ring-0 text-foreground"
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
            )}

            {/* File attachments */}
            {attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground">Attachments</h4>
                <div className="space-y-2">
                  {attachments.map(attachment => (
                    <div 
                      key={attachment.id} 
                      className="flex items-center justify-between rounded-md border bg-background/50 p-2 gap-2"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm truncate">{attachment.name}</span>
                        <span className="text-xs text-muted-foreground">({formatFileSize(attachment.size)})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadAttachment(attachment);
                          }}
                        >
                          <DownloadIcon className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAttachment(attachment.id);
                          }}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Labels display */}
            {labels.filter(l => l.added).length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {labels.filter(l => l.added).map(label => (
                  <div 
                    key={label.id}
                    className="flex items-center gap-1 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5"
                  >
                    <span>{label.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1 hover:bg-primary/20"
                      onClick={() => toggleLabel(label)}
                    >
                      <X className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Footer with action buttons - only visible when expanded */}
            {isExpanded && (
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowColorPicker(!showColorPicker);
                    }}
                    title="Background options"
                  >
                    <Palette className="h-4 w-4" />
                  </Button>
                  
                  <Popover open={isLabelsPopoverOpen} onOpenChange={setIsLabelsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        title="Add label"
                      >
                        <TagIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-60 p-2">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm mb-2">Add label</h4>
                        {availableLabels.length === 0 ? (
                          <p className="text-xs text-muted-foreground py-2">
                            No labels available. Create labels from the sidebar.
                          </p>
                        ) : (
                          availableLabels.map(label => (
                            <div 
                              key={label.id}
                              className="flex items-center cursor-pointer hover:bg-muted rounded px-2 py-1"
                              onClick={() => toggleLabel(label)}
                            >
                              <div className={cn(
                                "w-4 h-4 rounded-sm border mr-2 flex items-center justify-center",
                                isLabelAdded(label.id) && "bg-primary border-primary"
                              )}>
                                {isLabelAdded(label.id) && (
                                  <CheckSquare className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <span className="text-sm">{label.name}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={toggleType}
                    title={type === 'note' ? "Convert to checklist" : "Convert to note"}
                  >
                    {type === 'note' ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <ListChecks className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPinned(!pinned);
                    }}
                    title={pinned ? "Unpin note" : "Pin note"}
                  >
                    <PinIcon className={cn("h-4 w-4", pinned && "fill-current text-amber-500")} />
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className="text-sm font-medium"
                >
                  Close
                </Button>
              </div>
            )}
          </div>
          
          {/* Color picker popup */}
          {showColorPicker && (
            <div className="absolute bottom-full left-2 mb-2 rounded-lg border bg-background p-1 shadow-lg z-10">
              <div className="grid grid-cols-4 gap-1 p-1">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    className={cn(
                      'h-6 w-6 rounded-full border',
                      c.value.split(' ')[0] // Just take first color class for the button
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      setColor(c.value);
                      setShowColorPicker(false);
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default NoteEditor; 