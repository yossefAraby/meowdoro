
import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, Clock, CheckSquare, Star, Activity, Award, TrendingUp, ListChecks
} from "lucide-react";
import { CatCompanion } from "@/components/timer/CatCompanion";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  
  // Sample color palette for the charts
  const colors = {
    purple: "#8B5CF6",
    blue: "#3B82F6", 
    green: "#10B981",
    yellow: "#F59E0B",
    pink: "#EC4899",
    orange: "#F97316",
  };

  // Sample achievements data
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      name: "Focus Novice",
      description: "Complete 5 focus sessions",
      icon: <Clock className="w-8 h-8 text-blue-500" />,
      unlocked: true,
      progress: 12,
      maxProgress: 5
    },
    {
      name: "Task Master",
      description: "Complete 20 tasks",
      icon: <CheckSquare className="w-8 h-8 text-green-500" />,
      unlocked: true,
      progress: 24,
      maxProgress: 20
    },
    {
      name: "Note Taker",
      description: "Create 10 notes",
      icon: <ListChecks className="w-8 h-8 text-yellow-500" />,
      unlocked: false,
      progress: 7,
      maxProgress: 10
    },
    {
      name: "Consistency King",
      description: "Maintain a 7-day streak",
      icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
      unlocked: false,
      progress: 4,
      maxProgress: 7
    },
    {
      name: "Goal Getter",
      description: "Reach your daily goal 5 times",
      icon: <Star className="w-8 h-8 text-orange-500" />,
      unlocked: false,
      progress: 3,
      maxProgress: 5
    },
    {
      name: "Pomodoro Pro",
      description: "Accumulate 10 hours of focus time",
      icon: <Award className="w-8 h-8 text-pink-500" />,
      unlocked: false,
      progress: 540,
      maxProgress: 600
    }
  ]);
  
  // Week days for data
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  // Load mock data for now or fetch from localStorage/database
  useEffect(() => {
    // Generate mock daily stats data
    const generateMockDailyStats = () => {
      const daily: DailyStats[] = [];
      let totalTime = 0;
      let total = 0;
      let completed = 0;
      let goals = 0;
      
      weekDays.forEach((day, index) => {
        // Random values between 25-120 minutes for focus time
        const focusTime = Math.floor(Math.random() * 95) + 25;
        // Random values between 2-8 for tasks completed
        const tasksCompleted = Math.floor(Math.random() * 6) + 2;
        
        daily.push({ day, focusTime, tasksCompleted });
        
        totalTime += focusTime;
        total += index % 2 === 0 ? tasksCompleted + 2 : tasksCompleted + 1;
        completed += tasksCompleted;
        
        // Count days where the daily goal was met (90 minutes)
        if (focusTime >= 90) {
          goals++;
        }
      });
      
      // Actually use data from localStorage if available
      const storedMinutes = parseInt(localStorage.getItem("meowdoro-focus-minutes") || "0", 10);
      if (storedMinutes > 0) {
        totalTime = storedMinutes;
      }
      
      return {
        dailyStats: daily,
        totalFocusTime: totalTime,
        totalTasks: total,
        totalCompletedTasks: completed,
        totalNotes: Math.floor(Math.random() * 10) + 5,
        goalsMet: goals,
        weeklyAverage: Math.round(totalTime / 7),
        bestDay: weekDays[Math.floor(Math.random() * weekDays.length)],
        streak: Math.floor(Math.random() * 5) + 1,
      };
    };
    
    setStatsData(generateMockDailyStats());
    
    // Note: In a real app, you would fetch this data from your Supabase database
    // if (user) {
    //   fetchUserStats();
    // }
  }, [user]);
  
  // Make the cat happy when viewing achievements
  useEffect(() => {
    if (activeView === "achievements") {
      setCatStatus("happy");
    } else {
      setCatStatus("focused");
    }
  }, [activeView]);
  
  // const fetchUserStats = async () => {
  //   try {
  //     // This would be actual database calls to fetch user statistics
  //     // const { data, error } = await supabase.from('user_stats').select('*').eq('user_id', user.id);
  //     // if (error) throw error;
  //     // Process and set the data
  //   } catch (error) {
  //     console.error("Error fetching user stats:", error);
  //     toast({
  //       title: "Error loading statistics",
  //       description: "We couldn't load your statistics. Please try again later.",
  //       variant: "destructive"
  //     });
  //   }
  // };
  
  // Chart configurations
  const chartConfig = {
    focusTime: {
      purple: "#8B5CF6",
    },
    tasks: {
      green: "#10B981",
    },
    notes: {
      blue: "#3B82F6",
    },
    completed: {
      yellow: "#F59E0B",
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
        <Card className="hover:shadow-md transition-shadow">
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
        <Card className="hover:shadow-md transition-shadow">
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
        <Card className="hover:shadow-md transition-shadow">
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
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="weekly" className="gap-2">
            <Calendar className="h-4 w-4" />
            Weekly Progress
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="achievements" className="gap-2">
            <Award className="h-4 w-4" />
            Achievements
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Focus & Tasks</CardTitle>
              <CardDescription>
                Your productivity during the current week
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] pt-4">
              <ChartContainer
                config={chartConfig}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={statsData.dailyStats}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" orientation="left" stroke={colors.purple} />
                    <YAxis yAxisId="right" orientation="right" stroke={colors.green} />
                    <ChartTooltip 
                      content={(props) => (
                        <ChartTooltipContent {...props} />
                      )} 
                    />
                    <Bar 
                      yAxisId="left"
                      dataKey="focusTime" 
                      name="Focus minutes" 
                      fill={colors.purple} 
                      radius={[4, 4, 0, 0]} 
                    />
                    <Bar 
                      yAxisId="right"
                      dataKey="tasksCompleted" 
                      name="Tasks completed" 
                      fill={colors.green} 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                Your most productive day is usually <span className="font-medium">{statsData.bestDay}</span>
              </div>
            </CardFooter>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Completion</CardTitle>
                <CardDescription>
                  Distribution of completed vs. remaining tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={{
                    completed: {
                      label: "Completed",
                      color: colors.green
                    },
                    pending: {
                      label: "Pending",
                      color: "#CBD5E1"
                    }
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Completed", value: statsData.totalCompletedTasks, dataKey: "completed" },
                          { name: "Pending", value: statsData.totalTasks - statsData.totalCompletedTasks, dataKey: "pending" }
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
                      <ChartTooltip 
                        content={(props) => (
                          <ChartTooltipContent {...props} />
                        )} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  You've completed <span className="font-medium">{Math.round((statsData.totalCompletedTasks / statsData.totalTasks) * 100)}%</span> of your tasks.
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Daily Focus Time</CardTitle>
                <CardDescription>
                  Minutes spent focusing over the week
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={{
                    focusTime: {
                      label: "Focus Time",
                      color: colors.purple
                    },
                    goal: {
                      label: "Daily Goal",
                      color: colors.pink
                    }
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={statsData.dailyStats.map(stat => ({ ...stat, goal: 90 }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip 
                        content={(props) => (
                          <ChartTooltipContent {...props} />
                        )} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="focusTime" 
                        name="Focus Time" 
                        stroke={colors.purple} 
                        strokeWidth={2} 
                        dot={{ r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="goal" 
                        name="Daily Goal" 
                        stroke={colors.pink} 
                        strokeDasharray="5 5" 
                        strokeWidth={2} 
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  You reached your daily goal of 90 minutes {statsData.goalsMet} times this week.
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Productivity Trends</CardTitle>
              <CardDescription>
                Your focus time and task completion over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="bg-muted/50 rounded-full p-8 mb-4 inline-block">
                    <Activity className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Coming Soon!</h3>
                  <p className="text-muted-foreground">
                    Historical trend analysis will be available once we collect more data about your productivity patterns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <Card 
                key={index} 
                className={`hover:shadow-md transition-shadow ${achievement.unlocked ? 'border-primary/40' : ''}`}
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
                      className={`h-2.5 rounded-full ${achievement.unlocked ? 'bg-primary' : 'bg-primary/60'}`}
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
