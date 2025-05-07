import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";

interface PartyTask {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
  user_id: string;
  party_id: string;
}

export default function PartyTasks() {
  const [tasks, setTasks] = useState<PartyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskText, setNewTaskText] = useState("");
  const { user } = useAuth();
  const [activeParty, setActiveParty] = useState<{ id: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchActiveParty = async () => {
      if (!user) return;

      try {
        const { data: partyData, error: partyError } = await supabase
          .from("parties")
          .select("id")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .single();

        if (partyError) throw partyError;
        setActiveParty(partyData);
      } catch (error) {
        console.error("Error fetching active party:", error);
        setLoading(false);
      }
    };

    fetchActiveParty();
  }, [user]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!activeParty?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("party_tasks")
          .select("*")
          .eq("party_id", activeParty.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTasks(data || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast({
          title: "Error",
          description: "Failed to load tasks. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [activeParty?.id, toast]);

  const addTask = async () => {
    if (!newTaskText.trim() || !activeParty?.id || !user) return;

    try {
      const { data, error } = await supabase
        .from("party_tasks")
        .insert([
          {
            text: newTaskText.trim(),
            party_id: activeParty.id,
            user_id: user.id,
            completed: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setTasks((prev) => [data, ...prev]);
      setNewTaskText("");
      toast({
        title: "Success",
        description: "Task added successfully!",
      });
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("party_tasks")
        .update({ completed: !completed })
        .eq("id", taskId);

      if (error) throw error;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: !completed } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("party_tasks")
        .delete()
        .eq("id", taskId);

      if (error) throw error;

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      toast({
        title: "Success",
        description: "Task deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!activeParty) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">No Active Party</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You need to be part of an active party to manage tasks.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="Add a new task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <Button onClick={addTask} disabled={!newTaskText.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <AnimatePresence>
        {tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <h3 className="text-lg font-medium">No Tasks Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your first task to get started!
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id, task.completed)}
                />
                <span
                  className={`flex-1 ${
                    task.completed ? "text-muted-foreground line-through" : ""
                  }`}
                >
                  {task.text}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 