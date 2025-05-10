import React from 'react';
import { cn } from '@/lib/utils';
import { 
  PinIcon, 
  Trash2Icon, 
  Palette, 
  ArchiveIcon,
  MoreVertical,
  BellIcon,
  Clock,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from "framer-motion";
import DOMPurify from 'dompurify';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'checklist';
  tasks: Task[];
  color: string;
  labels: Label[];
  pinned: boolean;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
  onTaskToggle?: (noteId: string, taskId: string) => void;
  onClick: () => void;
  onSelect?: (id: string, selected: boolean) => void;
  selected?: boolean;
  selectionMode?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({
  id,
  title,
  content,
  type,
  tasks,
  color,
  labels,
  pinned,
  onPin,
  onDelete,
  onArchive,
  onColorChange,
  onTaskToggle,
  onClick,
  onSelect,
  selected = false,
  selectionMode = false,
}) => {
  const [showActions, setShowActions] = React.useState(false);

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

  const renderContent = () => {
    if (type === 'checklist' && tasks.length > 0) {
      const displayTasks = tasks.slice(0, 8); // Limit displayed tasks
      const hasMore = tasks.length > 8;
      
      return (
        <div className="space-y-1.5 mt-2">
          {displayTasks.map(task => (
            <div key={task.id} className="flex items-start gap-2 group">
              <Checkbox
                checked={task.completed}
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskToggle?.(id, task.id);
                }}
                className="mt-0.5 h-4 w-4"
              />
              <span className={cn(
                "text-sm leading-tight flex-1",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.text}
              </span>
            </div>
          ))}
          {hasMore && (
            <div className="text-xs text-muted-foreground pt-1">
              {tasks.length - 8} more items...
            </div>
          )}
        </div>
      );
    }
    
    if (content) {
      const processedContent = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'u', 'strong', 'em', 'mark', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote'],
        ALLOWED_ATTR: ['style', 'class']
      });
      
      const trimmedContent = content.length > 300 
        ? processedContent.substring(0, 300) + '...' 
        : processedContent;
      
      return (
        <div 
          className="text-sm text-foreground/90 prose-sm max-w-none whitespace-pre-line leading-relaxed"
          dangerouslySetInnerHTML={{ __html: trimmedContent }}
        />
      );
    }
    
    return null;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'group relative rounded-lg border shadow-sm transition-all overflow-hidden',
        color,
        selected && 'ring-2 ring-primary',
        selectionMode && 'ring-1 ring-primary/20',
        selectionMode && 'after:absolute after:inset-0 after:bg-primary/5 after:z-0 after:pointer-events-none',
        selectionMode && !selected && 'hover:ring-primary/30 hover:after:bg-primary/10'
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
      }}
      onClick={selectionMode && onSelect ? (e) => {
        e.stopPropagation();
        onSelect(id, !selected);
      } : onClick}
    >
      {/* Selection checkbox */}
      {onSelect && selectionMode && (
        <div className="absolute left-2 top-2 z-20 transition-opacity">
          <div
            className={cn(
              "h-5 w-5 rounded-full flex items-center justify-center",
              selected ? "bg-primary text-primary-foreground" : "bg-background border-2 border-muted-foreground/30 hover:border-primary"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(id, !selected);
            }}
          >
            {selected && <Check className="h-3 w-3" />}
          </div>
        </div>
      )}

      {/* Pin button */}
      <div className="absolute right-1 top-1 z-10">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-7 rounded-full",
            pinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onPin(id);
          }}
        >
          <PinIcon className={cn("h-3.5 w-3.5", pinned && "fill-current text-amber-500")} />
        </Button>
      </div>

      {/* Note content */}
      <div className={cn(
        "p-3.5",
        selectionMode && "pl-9",
        "relative z-10"
      )}>
        {title && (
          <h3 className="font-medium leading-tight mb-1.5 pr-6">
            {title}
          </h3>
        )}
        
        {renderContent()}

        {/* Labels */}
        {labels && labels.filter(l => l.added).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {labels.filter(l => l.added).map(label => (
              <span 
                key={label.id} 
                className="px-2 py-0.5 bg-background/50 text-xs rounded-full"
              >
                {label.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!selectionMode && (
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1 p-1.5 bg-gradient-to-t from-background/80 to-transparent transition-opacity z-10",
            showActions ? "opacity-100" : "opacity-0"
          )}
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Palette className="h-3.5 w-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-1.5" align="start">
              <div className="grid grid-cols-4 gap-1">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    className={cn(
                      'h-6 w-6 rounded-full border transition-transform hover:scale-110',
                      c.value.split(' ')[0]
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onColorChange(id, c.value);
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onArchive(id);
            }}
          >
            <ArchiveIcon className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
          >
            <Trash2Icon className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default NoteCard; 