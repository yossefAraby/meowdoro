import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, TrashIcon, PencilIcon, XIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Label {
  id: string;
  name: string;
  added: boolean;
}

interface EditLabelsDialogProps {
  open: boolean;
  onClose: () => void;
  labels: Label[];
  onLabelsChange: (labels: Label[]) => void;
}

const EditLabelsDialog: React.FC<EditLabelsDialogProps> = ({
  open,
  onClose,
  labels,
  onLabelsChange,
}) => {
  const [localLabels, setLocalLabels] = useState<Label[]>(labels);
  const [newLabelText, setNewLabelText] = useState('');
  const [error, setError] = useState('');
  const newLabelInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalLabels(labels);
  }, [labels]);

  const handleCreateLabel = () => {
    const trimmedText = newLabelText.trim();
    if (!trimmedText) {
      setError('Label name cannot be empty');
      return;
    }

    if (localLabels.some(label => label.name.toLowerCase() === trimmedText.toLowerCase())) {
      setError('Label already exists');
      return;
    }

    const newLabel: Label = {
      id: uuidv4(),
      name: trimmedText,
      added: false
    };

    const updatedLabels = [...localLabels, newLabel];
    setLocalLabels(updatedLabels);
    onLabelsChange(updatedLabels);
    setNewLabelText('');
    setError('');
  };

  const handleDeleteLabel = (id: string) => {
    const updatedLabels = localLabels.filter(label => label.id !== id);
    setLocalLabels(updatedLabels);
    onLabelsChange(updatedLabels);
  };

  const handleUpdateLabel = (id: string, newName: string) => {
    const trimmedName = newName.trim();
    if (!trimmedName) return;

    // Check if the name already exists (except for this label)
    const nameExists = localLabels.some(
      label => label.id !== id && label.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (nameExists) {
      setError('Label name already exists');
      return;
    }

    const updatedLabels = localLabels.map(label => 
      label.id === id ? { ...label, name: trimmedName } : label
    );
    
    setLocalLabels(updatedLabels);
    onLabelsChange(updatedLabels);
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreateLabel();
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {
      onClose();
      setError('');
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit labels</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Create new label input */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <PlusIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                ref={newLabelInputRef}
                value={newLabelText}
                onChange={(e) => {
                  setNewLabelText(e.target.value);
                  setError('');
                }}
                placeholder="Create new label"
                className="pl-10 pr-10"
                onKeyDown={handleKeyDown}
              />
              {newLabelText && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setNewLabelText('')}
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            <Button
              onClick={handleCreateLabel}
              disabled={!newLabelText.trim()}
            >
              Create
            </Button>
          </div>
          
          {error && (
            <div className="text-sm text-destructive px-1">
              {error}
            </div>
          )}

          {/* List of existing labels */}
          <div className="space-y-2 mt-4">
            {localLabels.map(label => (
              <div key={label.id} className="flex items-center gap-2 group">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <PencilIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <Input
                    className="pl-10 pr-10"
                    value={label.name}
                    onChange={(e) => handleUpdateLabel(label.id, e.target.value)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteLabel(label.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {localLabels.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No labels yet. Create your first label above.
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={onClose}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditLabelsDialog; 