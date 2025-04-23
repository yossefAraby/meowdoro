
import React, { useState, useEffect } from "react";
import { StatsCard } from "@/components/stats/StatsCard";
import { ChartsSection } from "@/components/stats/ChartsSection";
import { WeeklyOverview } from "@/components/stats/WeeklyOverview";
import { DailyStats, generateMockData, formatTime } from "@/components/stats/MockDataService";
import { Timer, Star, CheckSquare, ChevronsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Stats: React.FC = () => {
  const [stats, setStats] = useState<DailyStats[]>([]);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [totalCompletedTasks, setTotalCompletedTasks] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real app, we would fetch actual user statistics from an API or database
    // For now, we'll load data from localStorage where available or use mock data
    const loadStats = async () => {
      setIsLoading(true);
      
      try {
        // Get focus time from localStorage
        const storedFocusMinutes = parseInt(localStorage.getItem("meowdoro-focus-minutes") || "0", 10);
        
        // For demo purposes, generate mock data
        const mockData = generateMockData(7);
        
        // Adjust the last day's focus minutes to match the stored value
        if (mockData.length > 0) {
          mockData[mockData.length - 1].focusMinutes = storedFocusMinutes;
        }
        
        setStats(mockData);
        
        // Calculate totals
        const focusSum = mockData.reduce((sum, day) => sum + day.focusMinutes, 0);
        const starsSum = mockData.reduce((sum, day) => sum + day.stars, 0);
        const tasksSum = mockData.reduce((sum, day) => sum + day.completedTasks, 0);
        
        setTotalFocusMinutes(focusSum);
        setTotalStars(starsSum);
        setTotalCompletedTasks(tasksSum);
        setBestStreak(3); // Mock streak
      } catch (error) {
        console.error("Error loading statistics:", error);
        toast({
          title: "Error loading statistics",
          description: "There was a problem loading your statistics.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStats();
  }, [toast]);
  
  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8 page-transition flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your statistics...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 page-transition">
      <h1 className="text-2xl font-bold mb-8">Your Productivity Stats</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Total Focus Time" 
          value={formatTime(totalFocusMinutes)} 
          icon={Timer} 
          description="All-time focus minutes" 
          trend="+15% from last week"
          trendUp={true}
        />
        <StatsCard 
          title="Stars Earned" 
          value={totalStars.toString()} 
          icon={Star} 
          description="Goal achievements" 
          trend="+3 this week"
          trendUp={true}
        />
        <StatsCard 
          title="Tasks Completed" 
          value={totalCompletedTasks.toString()} 
          icon={CheckSquare} 
          description="Finished tasks" 
          trend="+8 from last week"
          trendUp={true}
        />
        <StatsCard 
          title="Best Streak" 
          value={`${bestStreak} days`} 
          icon={ChevronsUp} 
          description="Consecutive focus days" 
          trend="Current: 2 days"
          trendUp={false}
        />
      </div>
      
      {/* Charts */}
      <ChartsSection stats={stats} />
      
      {/* Weekly Summary */}
      <WeeklyOverview stats={stats} />
    </div>
  );
};

export default Stats;
