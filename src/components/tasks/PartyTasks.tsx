
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Users, Plus, Trash } from "lucide-react";

interface PartyTask {
  id: string;
  text: string;
  completed: boolean;
  party_id: string;
  created_by: string;
  created_at: string;
}

interface Party {
  id: string;
  name: string;
  code: string;
}

export const PartyTasks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeParty, setActiveParty] = useState<Party | null>(null);
  const [partyTasks, setPartyTasks] = useState<PartyTask[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchActiveParty();
    }
  }, [user]);

  useEffect(() => {
    if (activeParty) {
      fetchPartyTasks();
    }
  }, [activeParty]);

  const fetchActiveParty = async () => {
    if (!user) return;
    
    try {
      const { data: memberships, error } = await supabase
        .from('party_members')
        .select('party:party_id(*)')
        .eq('user_id', user.id)
        .order('joined_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      if (memberships && memberships.length > 0) {
        setActiveParty(memberships[0].party as unknown as Party);
      } else {
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Error fetching active party:", error);
      setIsLoading(false);
    }
  };

  const fetchPartyTasks = async () => {
    if (!activeParty) return;
    
    try {
      // Here we need to use a string literal for the table name since it's not in the types yet
      const { data, error } = await supabase
        .from('party_tasks')
        .select('*')
        .eq('party_id', activeParty.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setPartyTasks(data as PartyTask[] || []);
    } catch (error: any) {
      console.error("Error fetching party tasks:", error);
      toast({
        title: "Error loading tasks",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async () => {
    if (!activeParty || !user || !newTaskText.trim()) return;
    
    try {
      const newTask = {
        text: newTaskText.trim(),
        completed: false,
        party_id: activeParty.id,
        created_by: user.id
      };
      
      // Here we need to use a string literal for the table name
      const { data, error } = await supabase
        .from('party_tasks')
        .insert(newTask)
        .select();
      
      if (error) throw error;
      
      if (data) {
        setPartyTasks([...partyTasks, data[0] as PartyTask]);
      }
      setNewTaskText("");
      
      toast({
        title: "Task added",
        description: "The task has been added to your party."
      });
    } catch (error: any) {
      console.error("Error adding task:", error);
      toast({
        title: "Error adding task",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const toggleTaskCompletion = async (taskId: string, currentStatus: boolean) => {
    try {
      // Here we need to use a string literal for the table name
      const { error } = await supabase
        .from('party_tasks')
        .update({ completed: !currentStatus })
        .eq('id', taskId);
      
      if (error) throw error;
      
      setPartyTasks(partyTasks.map(task => 
        task.id === taskId ? { ...task, completed: !currentStatus } : task
      ));
    } catch (error: any) {
      console.error("Error updating task:", error);
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      // Here we need to use a string literal for the table name
      const { error } = await supabase
        .from('party_tasks')
        .delete()
        .eq('id', taskId);
      
      if (error) throw error;
      
      setPartyTasks(partyTasks.filter(task => task.id !== taskId));
      
      toast({
        title: "Task deleted",
        description: "The task has been removed from your party."
      });
    } catch (error: any) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div className="py-8 text-center">Loading party tasks...</div>;
  }

  if (!activeParty) {
    return (
      <div className="py-8 text-center">
        <div className="mb-4">
          <Users className="h-16 w-16 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-xl font-semibold mb-2">No Active Party</h3>
          <p className="text-muted-foreground mb-4">
            Join a study party to access shared tasks.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <Users className="h-5 w-5 mr-2" />
          {activeParty.name} Tasks
        </h3>
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
          Party Mode
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Add a task for the party..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            className="flex-1"
          />
          <Button onClick={addTask} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 mt-4">
          {partyTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No party tasks yet. Add one to get started!
            </p>
          ) : (
            partyTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center space-x-2 p-2 hover:bg-accent/50 rounded-md"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id, task.completed)}
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
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
