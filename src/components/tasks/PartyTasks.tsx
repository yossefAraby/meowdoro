
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Users, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmptyPartyState } from "./EmptyPartyState";
import { TaskInput } from "./TaskInput";
import { TaskItem } from "./TaskItem";

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
        .limit(1) as any; // Use type assertion here
      
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
      const { data, error } = await supabase
        .from('party_tasks')
        .select('*')
        .eq('party_id', activeParty.id)
        .order('created_at', { ascending: true }) as any;
      
      if (error) throw error;
      
      setPartyTasks(data || []);
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
      
      const { data, error } = await supabase
        .from('party_tasks')
        .insert(newTask)
        .select() as any;
      
      if (error) throw error;
      
      if (data) {
        setPartyTasks([...partyTasks, data[0] as unknown as PartyTask]);
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
      const { error } = await supabase
        .from('party_tasks')
        .update({ completed: !currentStatus })
        .eq('id', taskId) as any;
      
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
      const { error } = await supabase
        .from('party_tasks')
        .delete()
        .eq('id', taskId) as any;
      
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
    return <EmptyPartyState />;
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
        <TaskInput 
          newTaskText={newTaskText}
          onTextChange={setNewTaskText}
          onAddTask={addTask}
        />

        <div className="space-y-2 mt-4">
          {partyTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No party tasks yet. Add one to get started!
            </p>
          ) : (
            partyTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={toggleTaskCompletion}
                onDelete={deleteTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
