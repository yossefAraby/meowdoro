import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  MessageSquare, 
  ArchiveIcon,
  TrashIcon,
  Tag,
  PencilIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  collapsed?: boolean;
  expandable?: boolean;
  expanded?: boolean;
  onExpand?: () => void;
  count?: number;
}

const SidebarItem = ({ 
  icon, 
  label, 
  active, 
  onClick, 
  collapsed, 
  expandable,
  expanded,
  onExpand,
  count 
}: SidebarItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center rounded-r-full py-3 px-6 text-sm font-medium transition-colors relative",
        active
          ? "bg-primary/15 text-primary dark:bg-primary/25 dark:text-primary"
          : "text-foreground/80 hover:bg-muted hover:text-foreground dark:text-foreground/80 dark:hover:text-foreground"
      )}
      title={collapsed ? label : undefined}
    >
      <span className={cn("mr-3", collapsed && "mr-0")}>{icon}</span>
      {!collapsed && (
        <>
          <span className="flex-1 text-left">{label}</span>
          
          {count !== undefined && count > 0 && (
            <span className="text-xs text-muted-foreground ml-2">{count}</span>
          )}
          
          {expandable && (
            <button 
              className="ml-2 p-1 rounded-full hover:bg-background"
              onClick={(e) => {
                e.stopPropagation();
                onExpand?.();
              }}
            >
              {expanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
          )}
        </>
      )}
    </button>
  );
};

interface SubItemProps {
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SubItem = ({ label, active, onClick }: SubItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center py-2 px-10 text-xs font-medium transition-colors",
        active
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <span className="truncate">{label}</span>
    </button>
  );
};

interface NoteSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onCollapse?: (collapsed: boolean) => void;
  onToggleSelection?: () => void;
  isSelectionMode?: boolean;
  labels?: { id: string; name: string; added: boolean }[];
  activeLabel?: string;
}

const NoteSidebar = ({ 
  activeView, 
  onViewChange, 
  onCollapse,
  onToggleSelection,
  isSelectionMode = false,
  labels = [],
  activeLabel
}: NoteSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [labelsExpanded, setLabelsExpanded] = useState(false);
  const availableLabels = labels.filter(l => l.name);

  useEffect(() => {
    // Auto-expand labels section when labels view is active
    if (activeView === 'labels') {
      setLabelsExpanded(true);
    }
  }, [activeView]);

  const toggleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
  };

  const handleSelectModeToggle = () => {
    onToggleSelection?.();
  };

  return (
    <div className={cn(
      "h-full border-r bg-background relative transition-all duration-300 flex flex-col",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="flex-1 flex flex-col gap-2 p-2 overflow-y-auto pb-16 md:pt-2 pt-12">
        <SidebarItem
          icon={<MessageSquare className="h-5 w-5" />}
          label="Notes"
          active={activeView === 'notes'}
          onClick={() => onViewChange('notes')}
          collapsed={collapsed}
        />
        
        <SidebarItem
          icon={<Tag className="h-5 w-5" />}
          label="Labels"
          active={activeView === 'labels' && !activeLabel}
          onClick={() => onViewChange('labels')}
          collapsed={collapsed}
          expandable={!collapsed && availableLabels.length > 0}
          expanded={labelsExpanded}
          onExpand={() => setLabelsExpanded(!labelsExpanded)}
        />
        
        {!collapsed && labelsExpanded && availableLabels.length > 0 && (
          <div className="border-l ml-8 pl-2">
            {availableLabels.map(label => (
              <SubItem 
                key={label.id}
                label={label.name}
                active={activeView === 'labels' && activeLabel === label.id}
                onClick={() => onViewChange(`labels/${label.id}`)}
              />
            ))}
          </div>
        )}
        
        <SidebarItem
          icon={<PencilIcon className="h-5 w-5" />}
          label="Edit labels"
          active={activeView === 'edit-labels'}
          onClick={() => onViewChange('edit-labels')}
          collapsed={collapsed}
        />
        
        <SidebarItem
          icon={<ArchiveIcon className="h-5 w-5" />}
          label="Archive"
          active={activeView === 'archive'}
          onClick={() => onViewChange('archive')}
          collapsed={collapsed}
        />
        
        <SidebarItem
          icon={<TrashIcon className="h-5 w-5" />}
          label="Trash"
          active={activeView === 'trash'}
          onClick={() => onViewChange('trash')}
          collapsed={collapsed}
        />

        {onToggleSelection && (
          <SidebarItem
            icon={isSelectionMode ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
            label={isSelectionMode ? "Cancel selection" : "Select notes"}
            active={isSelectionMode}
            onClick={handleSelectModeToggle}
            collapsed={collapsed}
          />
        )}
      </div>
      
      {/* Collapse button positioned on the right side near bottom */}
      <Button
        variant="ghost"
        size="icon"
        className="sticky right-0 left-auto ml-auto bottom-8 h-6 w-6 rounded-l-full shadow-sm bg-muted/50 hover:bg-muted transform translate-x-1/2 z-10"
        style={{ top: '80%' }}
        onClick={toggleCollapse}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
};

export default NoteSidebar; 