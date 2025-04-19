
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TaskInputProps {
  newTaskText: string;
  onTextChange: (text: string) => void;
  onAddTask: () => void;
}

export const TaskInput = ({ newTaskText, onTextChange, onAddTask }: TaskInputProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Input
        placeholder="Add a task for the party..."
        value={newTaskText}
        onChange={(e) => onTextChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onAddTask()}
        className="flex-1"
      />
      <Button onClick={onAddTask} size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
