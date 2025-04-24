
import React from "react";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskItemProps {
  task: {
    id: string;
    text: string;
    completed: boolean;
  };
  onToggleComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = ({ task, onToggleComplete, onDelete }: TaskItemProps) => {
  return (
    <div
      key={task.id}
      className="flex items-center space-x-2 p-2 hover:bg-accent/50 rounded-md"
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggleComplete(task.id, task.completed)}
        id={`party-task-${task.id}`}
      />
      <label
        htmlFor={`party-task-${task.id}`}
        className={`flex-1 cursor-pointer ${
          task.completed ? "line-through text-muted-foreground" : ""
        }`}
      >
        {task.text}
      </label>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => onDelete(task.id)}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
