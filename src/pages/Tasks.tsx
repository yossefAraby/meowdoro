
import React, { useState, useEffect } from "react";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskInput } from "@/components/tasks/TaskInput";
import { TaskItem } from "@/components/tasks/TaskItem";
import { AlertCircle, ListTodo, Users, Check, Star } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { EmptyPartyState } from "@/components/tasks/EmptyPartyState";
import { PartyTasks } from "@/components/tasks/PartyTasks";
import { CatCompanion } from "@/components/timer/CatCompanion";
import { format } from "date-fns";

// Type definitions
interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  isToday: boolean;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState("personal");
  const [activeFilter, setActiveFilter] = useState<"all" | "today" | "completed">("all");
  const [catStatus, setCatStatus] = useState<"idle" | "happy" | "focused">("idle");
  
  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("meowdoro-tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("meowdoro-tasks", JSON.stringify(tasks));
    
    // Filter tasks based on the active filter
    filterTasks();
    
    // Set cat status based on task completion ratio
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    
    if (totalTasks === 0) {
      setCatStatus("idle");
    } else if ((completedTasks / totalTasks) > 0.7) {
      setCatStatus("happy");
    } else if ((completedTasks / totalTasks) > 0.3) {
      setCatStatus("focused");
    } else {
      setCatStatus("idle");
    }
  }, [tasks, activeFilter]);
  
  const filterTasks = () => {
    switch (activeFilter) {
      case "all":
        setFilteredTasks(tasks);
        break;
      case "today":
        setFilteredTasks(tasks.filter(task => task.isToday));
        break;
      case "completed":
        setFilteredTasks(tasks.filter(task => task.completed));
        break;
    }
  };
  
  const addTask = (title: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
      isToday: true,
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
  };
  
  const toggleTaskCompletion = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === id) {
          const newCompletionState = !task.completed;
          
          // Update stats in localStorage
          if (newCompletionState === true) {
            // Task completed - update stats
            const today = format(new Date(), "yyyy-MM-dd");
            const tasksCompletedKey = `meowdoro-tasks-completed-${today}`;
            const dailyTasksCompleted = parseInt(localStorage.getItem(tasksCompletedKey) || "0", 10);
            localStorage.setItem(tasksCompletedKey, (dailyTasksCompleted + 1).toString());
          }
          
          return { ...task, completed: newCompletionState };
        }
        return task;
      })
    );
  };
  
  const toggleTaskIsToday = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, isToday: !task.isToday } : task
      )
    );
  };
  
  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };
  
  const editTask = (id: string, newTitle: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
  };
  
  // Count completed tasks
  const completedTaskCount = tasks.filter(task => task.completed).length;
  const totalTaskCount = tasks.length;
  const completionPercentage = totalTaskCount > 0 ? (completedTaskCount / totalTaskCount) * 100 : 0;
  
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 page-transition">
      <Tabs 
        defaultValue="personal" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <ListTodo className="h-4 w-4" />
            Personal Tasks
          </TabsTrigger>
          <TabsTrigger value="party" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Party Tasks
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-primary" />
                  My Tasks
                </div>
                <div className="flex items-center text-sm">
                  <Star className={`h-4 w-4 ${completionPercentage >= 80 ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'} mr-1`}/>
                  {completedTaskCount}/{totalTaskCount}
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {/* Task input */}
              <div className="mb-4">
                <TaskInput onAddTask={addTask} />
              </div>
              
              {/* Task filters */}
              <div className="flex space-x-1 mb-4">
                <Button 
                  variant={activeFilter === "all" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveFilter("all")}
                  className="flex-1"
                >
                  All
                </Button>
                <Button 
                  variant={activeFilter === "today" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveFilter("today")}
                  className="flex-1"
                >
                  Today
                </Button>
                <Button 
                  variant={activeFilter === "completed" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveFilter("completed")}
                  className="flex-1"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Completed
                </Button>
              </div>
              
              {/* Task list */}
              <div className="space-y-2">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={toggleTaskCompletion}
                      onToggleToday={toggleTaskIsToday}
                      onDelete={deleteTask}
                      onEdit={editTask}
                    />
                  ))
                ) : (
                  <Alert className="bg-accent/30 border-accent">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No tasks found</AlertTitle>
                    <AlertDescription>
                      {activeFilter === "all" 
                        ? "You don't have any tasks yet. Add one above!"
                        : activeFilter === "today" 
                        ? "You don't have any tasks for today."
                        : "You don't have any completed tasks."}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              {/* Progress indicator */}
              {filteredTasks.length > 0 && activeFilter !== "completed" && (
                <div className="mt-6">
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-primary"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 text-center">
                    {completionPercentage.toFixed(0)}% complete
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Cat companion */}
          <div className="fixed bottom-6 right-6">
            <CatCompanion status={catStatus} />
          </div>
        </TabsContent>
        
        <TabsContent value="party">
          {/* Party tasks content */}
          <PartyTasks />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tasks;
