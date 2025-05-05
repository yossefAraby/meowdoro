
import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, Clock, CheckSquare, Star, Activity, Award, TrendingUp, ListChecks, Timer, Check
} from "lucide-react";
import { CatCompanion } from "@/components/timer/CatCompanion";
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { format, subDays, startOfWeek, parseISO } from "date-fns";

// Define types for the statistics data
type DailyStats = {
  day: string;
  focusTime: number;
  tasksCompleted: number;
};

type StatsData = {
  totalFocusTime: number;
  totalTasks: number;
  totalCompletedTasks: number;
  totalNotes: number;
  goalsMet: number;
  dailyStats: DailyStats[];
  weeklyAverage: number;
  bestDay: string;
  streak: number;
};

type Achievement = {
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
};

const Statistics: React.FC = () => {
  const [activeView, setActiveView] = useState("weekly");
  const [statsData, setStatsData] = useState<StatsData>({
    totalFocusTime: 0,
    totalTasks: 0,
    totalCompletedTasks: 0,
    totalNotes: 0,
    goalsMet: 0,
    dailyStats: [],
    weeklyAverage: 0,
    bestDay: "Friday",
    streak: 0,
  });
  const [catStatus, setCatStatus] = useState<"idle" | "happy" | "focused">("idle");
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Color palette updated with cyan instead of purple
  const colors = {
    primary: "#1EAEDB", // Cyan/blue color
    green: "#10B981",
    yellow: "#F59E0B",
    pink: "#EC4899",
    orange: "#F97316",
  };

  // Achievements data with real tracking
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      name: "Focus Novice",
      description: "Complete 5 focus sessions",
      icon: <Clock className="w-8 h-8 text-primary" />,
      unlocked: false,
      progress: 0,
      maxProgress: 5
    },
    {
      name: "Task Master",
      description: "Complete 20 tasks",
      icon: <CheckSquare className="w-8 h-8 text-green-500" />,
      unlocked: false,
      progress: 0,
      maxProgress: 20
    },
    {
      name: "Note Taker",
      description: "Create 10 notes",
      icon: <ListChecks className="w-8 h-8 text-yellow-500" />,
      unlocked: false,
      progress: 0,
      maxProgress: 10
    },
    {
      name: "Consistency King",
      description: "Maintain a 7-day streak",
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      unlocked: false,
      progress: 0,
      maxProgress: 7
    },
    {
      name: "Goal Getter",
      description: "Reach your daily goal 5 times",
      icon: <Star className="w-8 h-8 text-orange-500" />,
      unlocked: false,
      progress: 0,
      maxProgress: 5
    },
    {
      name: "Pomodoro Pro",
      description: "Accumulate 10 hours of focus time",
      icon: <Award className="w-8 h-8 text-pink-500" />,
      unlocked: false,
      progress: 0,
      maxProgress: 600
    }
  ]);
  
  // Week days for data
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  // Generate dates for the current week
  const generateWeekDates = () => {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    
    return weekDays.map((_, index) => {
      const date = new Date(startOfCurrentWeek);
      date.setDate(date.getDate() + index);
      return format(date, "yyyy-MM-dd");
    });
  };
  
  const weekDates = generateWeekDates();
  
  // Load real data from localStorage or fetch from database
  useEffect(() => {
    const loadUserStats = async () => {
      try {
        // Get focus time from localStorage
        const storedMinutes = parseInt(localStorage.getItem("meowdoro-focus-minutes") || "0", 10);
        
        // Get tasks data from localStorage
        const tasksData = JSON.parse(localStorage.getItem("meowdoro-tasks") || "[]");
        const completedTasks = tasksData.filter((task: any) => task.completed).length;
        
        // Get notes data (if available)
        const notesData = JSON.parse(localStorage.getItem("meowdoro-notes") || "[]");
        
        // Calculate streak (for now just a placeholder)
        const lastSessionDate = localStorage.getItem("meowdoro-last-session") || "";
        const streak = lastSessionDate ? 
          (Math.abs(new Date().getTime() - new Date(lastSessionDate).getTime()) < 48 * 60 * 60 * 1000 ? 1 : 0) : 0;
        
        // Get daily goal completions
        const dailyGoalMinutes = 90; // 90 minutes per day is the goal
        const dailyGoalsMet = parseInt(localStorage.getItem("meowdoro-goals-met") || "0", 10);
        
        // Generate daily stats for the week
        const dailyStats = weekDays.map((day, index) => {
          const dateKey = weekDates[index];
          const dailyFocusKey = `meowdoro-focus-${dateKey}`;
          const dailyTasksKey = `meowdoro-tasks-completed-${dateKey}`;
          
          const focusTime = parseInt(localStorage.getItem(dailyFocusKey) || "0", 10);
          const tasksCompleted = parseInt(localStorage.getItem(dailyTasksKey) || "0", 10);
          
          return { day, focusTime, tasksCompleted };
        });
        
        // Calculate weekly average
        const weeklyTotal = dailyStats.reduce((sum, day) => sum + day.focusTime, 0);
        const weeklyAverage = Math.round(weeklyTotal / 7);
        
        // Find best day
        let bestDay = "None";
        let maxFocusTime = 0;
        dailyStats.forEach(day => {
          if (day.focusTime > maxFocusTime) {
            maxFocusTime = day.focusTime;
            bestDay = day.day;
          }
        });
        
        // Update achievements based on actual data
        const updatedAchievements = [...achievements];
        
        // Focus sessions (assume 1 session is 25 mins)
        const focusSessions = Math.floor(storedMinutes / 25);
        updatedAchievements[0].progress = focusSessions;
        updatedAchievements[0].unlocked = focusSessions >= updatedAchievements[0].maxProgress;
        
        // Completed tasks
        updatedAchievements[1].progress = completedTasks;
        updatedAchievements[1].unlocked = completedTasks >= updatedAchievements[1].maxProgress;
        
        // Notes
        updatedAchievements[2].progress = notesData.length;
        updatedAchievements[2].unlocked = notesData.length >= updatedAchievements[2].maxProgress;
        
        // Streak
        updatedAchievements[3].progress = streak;
        updatedAchievements[3].unlocked = streak >= updatedAchievements[3].maxProgress;
        
        // Goals met
        updatedAchievements[4].progress = dailyGoalsMet;
        updatedAchievements[4].unlocked = dailyGoalsMet >= updatedAchievements[4].maxProgress;
        
        // Focus time (in minutes)
        updatedAchievements[5].progress = storedMinutes;
        updatedAchievements[5].unlocked = storedMinutes >= updatedAchievements[5].maxProgress;
        
        setAchievements(updatedAchievements);
        
        // Set all stats data
        setStatsData({
          totalFocusTime: storedMinutes,
          totalTasks: tasksData.length,
          totalCompletedTasks: completedTasks,
          totalNotes: notesData.length,
          goalsMet: dailyGoalsMet,
          dailyStats,
          weeklyAverage,
          bestDay,
          streak,
        });
        
        // Update some localStorage values for next time
        localStorage.setItem("meowdoro-last-session", new Date().toISOString());
        
      } catch (error) {
        console.error("Error loading user stats:", error);
        toast({
          title: "Error loading statistics",
          description: "We couldn't load your statistics data. Please try again.",
          variant: "destructive"
        });
      }
    };
    
    loadUserStats();
    
    // Update cat status when viewing achievements
    if (activeView === "achievements") {
      setCatStatus("happy");
    } else {
      setCatStatus("focused");
    }
    
  }, [activeView, toast]);
  
  // Chart configurations - Fix the structure to match ChartConfig type
  const chartConfig = {
    focusTime: {
      label: "Focus Time",
      color: colors.primary,
    },
    tasks: {
      label: "Tasks",
      color: colors.green,
    },
    notes: {
      label: "Notes",
      color: colors.primary,
    },
    completed: {
      label: "Completed",
      color: colors.green,
    },
    pending: {
      label: "Pending",
      color: "#CBD5E1",
    },
    goal: {
      label: "Daily Goal",
      color: colors.pink,
    }
  };
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 page-transition">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Activity className="h-7 w-7 text-primary" />
        Your Meowdoro Statistics
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Focus Time Card */}
        <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Total Focus Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.floor(statsData.totalFocusTime / 60)}h {statsData.totalFocusTime % 60}m
            </div>
            <p className="text-sm text-muted-foreground">
              Weekly average: {Math.floor(statsData.weeklyAverage / 60)}h {statsData.weeklyAverage % 60}m
            </p>
          </CardContent>
        </Card>
        
        {/* Tasks Completed Card */}
        <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-green-500" />
              Tasks Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {statsData.totalCompletedTasks}
            </div>
            <p className="text-sm text-muted-foreground">
              Out of {statsData.totalTasks} total tasks
            </p>
          </CardContent>
        </Card>
        
        {/* Goals Met Card */}
        <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Goals Met
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {statsData.goalsMet}
            </div>
            <p className="text-sm text-muted-foreground">
              Current streak: {statsData.streak} days
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="weekly" value={activeView} onValueChange={setActiveView} className="mb-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="weekly" className="gap-2">
            <Calendar className="h-4 w-4" />
            Weekly Progress
          </TabsTrigger>
          <TabsTrigger value="achievements" className="gap-2">
            <Award className="h-4 w-4" />
            Achievements
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly" className="space-y-6">
          <Card className="overflow-hidden border-primary/10">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-primary" />
                Weekly Focus & Tasks
              </CardTitle>
              <CardDescription>
                Your productivity during the current week
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] pt-8">
              <ChartContainer config={chartConfig} className="h-80">
                <BarChart
                  data={statsData.dailyStats}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" orientation="left" stroke={colors.primary} />
                  <YAxis yAxisId="right" orientation="right" stroke={colors.green} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    yAxisId="left"
                    dataKey="focusTime" 
                    name="focusTime"
                    fill={colors.primary} 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="tasksCompleted" 
                    name="tasks" 
                    fill={colors.green} 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-transparent to-primary/5">
              <div className="text-sm text-muted-foreground">
                Your most productive day is usually <span className="font-medium text-primary">{statsData.bestDay}</span>
              </div>
            </CardFooter>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="overflow-hidden border-primary/10">
              <CardHeader className="bg-gradient-to-r from-green-500/10 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Task Completion
                </CardTitle>
                <CardDescription>
                  Distribution of completed vs. remaining tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={chartConfig}
                  className="h-64"
                >
                  <PieChart>
                    <Pie
                      data={[
                        { name: "completed", value: statsData.totalCompletedTasks },
                        { name: "pending", value: statsData.totalTasks - statsData.totalCompletedTasks }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      labelLine={false}
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell key="cell-0" fill={colors.green} />
                      <Cell key="cell-1" fill="#CBD5E1" />
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="bg-gradient-to-r from-transparent to-green-500/5">
                <div className="text-sm text-muted-foreground">
                  You've completed <span className="font-medium text-green-500">{statsData.totalTasks > 0 ? Math.round((statsData.totalCompletedTasks / statsData.totalTasks) * 100) : 0}%</span> of your tasks.
                </div>
              </CardFooter>
            </Card>
            
            <Card className="overflow-hidden border-primary/10">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Daily Focus Time
                </CardTitle>
                <CardDescription>
                  Minutes spent focusing over the week
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={chartConfig}
                  className="h-64"
                >
                  <LineChart
                    data={statsData.dailyStats.map(stat => ({ ...stat, goal: 90 }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="focusTime" 
                      name="focusTime"
                      stroke={colors.primary} 
                      strokeWidth={2} 
                      dot={{ r: 4, fill: colors.primary }} 
                      activeDot={{ r: 6, strokeWidth: 2, fill: colors.primary }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="goal" 
                      name="goal"
                      stroke={colors.pink} 
                      strokeDasharray="5 5" 
                      strokeWidth={2} 
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="bg-gradient-to-r from-transparent to-primary/5">
                <div className="text-sm text-muted-foreground">
                  You reached your daily goal of 90 minutes {statsData.goalsMet} times this week.
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="bg-primary/5 backdrop-blur-sm p-6 rounded-lg border border-primary/10">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-shrink-0">
                <div className="bg-white/10 rounded-full p-4 border border-primary/20">
                  <Star className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Productivity Tip</h3>
                <p className="text-muted-foreground">
                  Focus on completing one task at a time for better productivity. Your best focus time appears to be around {statsData.bestDay}. Try to schedule your most important tasks then.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <Card 
                key={index} 
                className={cn(
                  "hover:shadow-md transition-all",
                  achievement.unlocked 
                    ? "border-primary/40 bg-gradient-to-br from-primary/5 to-transparent" 
                    : ""
                )}
              >
                <CardHeader className="pb-2 relative">
                  {achievement.unlocked && (
                    <span className="absolute top-2 right-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    </span>
                  )}
                  <CardTitle className="text-lg flex items-center gap-2">
                    {achievement.icon}
                    {achievement.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {achievement.description}
                  </p>
                  <div className="w-full bg-muted rounded-full h-2.5 mb-1">
                    <div 
                      className={cn(
                        "h-2.5 rounded-full", 
                        achievement.unlocked 
                          ? "bg-primary" 
                          : "bg-primary/60"
                      )}
                      style={{ width: `${Math.min(100, (achievement.progress / achievement.maxProgress) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right text-muted-foreground">
                    {achievement.progress}/{achievement.maxProgress}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
            <CardHeader>
              <CardTitle>Achievement Progress</CardTitle>
              <CardDescription>
                You've unlocked {achievements.filter(a => a.unlocked).length} of {achievements.length} achievements
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="w-full bg-muted rounded-full h-3 mb-2">
                <div 
                  className="h-3 rounded-full bg-primary"
                  style={{ width: `${(achievements.filter(a => a.unlocked).length / achievements.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Cat companion */}
      <div className="fixed bottom-6 right-6">
        <CatCompanion status={catStatus} />
      </div>
    </div>
  );
};

export default Statistics;
