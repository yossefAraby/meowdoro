
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, Calendar, Star, Timer, CheckSquare, ChevronsUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from "recharts";

interface DailyStats {
  date: string;
  focusMinutes: number;
  completedTasks: number;
  stars: number;
}

// Mock data generator for demonstration
const generateMockData = (): DailyStats[] => {
  const today = new Date();
  const data: DailyStats[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      focusMinutes: Math.floor(Math.random() * 120) + 30,
      completedTasks: Math.floor(Math.random() * 8) + 1,
      stars: Math.floor(Math.random() * 3) + 1,
    });
  }
  
  return data;
};

const Stats: React.FC = () => {
  const [stats, setStats] = useState<DailyStats[]>([]);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [totalCompletedTasks, setTotalCompletedTasks] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  
  useEffect(() => {
    // In a real app, this would load actual user statistics
    // For now, we'll generate mock data
    const mockData = generateMockData();
    setStats(mockData);
    
    // Calculate totals
    const focusSum = mockData.reduce((sum, day) => sum + day.focusMinutes, 0);
    const starsSum = mockData.reduce((sum, day) => sum + day.stars, 0);
    const tasksSum = mockData.reduce((sum, day) => sum + day.completedTasks, 0);
    
    setTotalFocusMinutes(focusSum);
    setTotalStars(starsSum);
    setTotalCompletedTasks(tasksSum);
    setBestStreak(3); // Mock streak
  }, []);
  
  // Format time in hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 page-transition">
      <h1 className="text-2xl font-bold mb-8">Your Productivity Stats</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Focus Time" 
          value={formatTime(totalFocusMinutes)} 
          icon={Timer} 
          description="All-time focus minutes" 
          trend="+15% from last week"
          trendUp={true}
        />
        <StatCard 
          title="Stars Earned" 
          value={totalStars.toString()} 
          icon={Star} 
          description="Goal achievements" 
          trend="+3 this week"
          trendUp={true}
        />
        <StatCard 
          title="Tasks Completed" 
          value={totalCompletedTasks.toString()} 
          icon={CheckSquare} 
          description="Finished tasks" 
          trend="+8 from last week"
          trendUp={true}
        />
        <StatCard 
          title="Best Streak" 
          value={`${bestStreak} days`} 
          icon={ChevronsUp} 
          description="Consecutive focus days" 
          trend="Current: 2 days"
          trendUp={false}
        />
      </div>
      
      {/* Charts */}
      <Tabs defaultValue="focus" className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="focus" className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Focus Time
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="stars" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Stars
            </TabsTrigger>
          </TabsList>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <TabsContent value="focus" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="date" />
                  <YAxis unit="m" />
                  <Tooltip 
                    formatter={(value: number) => [`${value} min`, 'Focus Time']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="focusMinutes" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorFocus)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="tasks" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={stats}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value} tasks`, 'Completed']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Bar
                    dataKey="completedTasks"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="stars" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={stats}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value} stars`, 'Earned']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Bar
                    dataKey="stars"
                    fill="hsl(45, 100%, 50%)"
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
      
      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
          <CardDescription>Your productivity for the past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-secondary/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  Focus Time
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold">{formatTime(totalFocusMinutes)}</div>
                <p className="text-sm text-muted-foreground">Daily average: {formatTime(Math.floor(totalFocusMinutes / 7))}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  Completed Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold">{totalCompletedTasks}</div>
                <p className="text-sm text-muted-foreground">Daily average: {(totalCompletedTasks / 7).toFixed(1)}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Stars Earned
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold">{totalStars}</div>
                <p className="text-sm text-muted-foreground">Daily average: {(totalStars / 7).toFixed(1)}</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper component for stat cards
const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.FC<{ className?: string }>;
  description: string;
  trend: string;
  trendUp: boolean;
}> = ({ title, value, icon: Icon, description, trend, trendUp }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trendUp ? 'text-green-500' : 'text-muted-foreground'} flex items-center gap-1 mt-1`}>
          {trendUp && <ChevronsUp className="w-3 h-3" />}
          {trend}
        </p>
      </CardContent>
    </Card>
  );
};

export default Stats;
