
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, LineChart, PieChart, AreaChart } from '@/components/statistics/Charts';
import { HeatmapCalendar } from '@/components/statistics/HeatmapCalendar';
import { FocusStreakCard } from '@/components/statistics/FocusStreakCard';
import { MostProductiveCard } from '@/components/statistics/MostProductiveCard';
import { Calendar, BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react';

const Statistics: React.FC = () => {
  const [period, setPeriod] = useState('week');

  return (
    <div className="container mx-auto px-4 py-6 page-transition">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
          <p className="text-muted-foreground">Track your productivity and focus statistics</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Time Range</SelectLabel>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Focus Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23.5 hrs</div>
            <p className="text-xs text-muted-foreground mt-1">+14% from last {period}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sessions Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground mt-1">+5% from last {period}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Daily Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.4 hrs</div>
            <p className="text-xs text-muted-foreground mt-1">+7% from last {period}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground mt-1">+2% from last {period}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Focus Time Trend</CardTitle>
          <CardDescription>Your focus time distribution over the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <AreaChart />
          </div>
        </CardContent>
      </Card>

      {/* Chart tabs */}
      <Tabs defaultValue="daily" className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" /> Daily Distribution
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4" /> Session Length
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" /> Categories
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="daily" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Daily Focus Distribution</CardTitle>
              <CardDescription>When you focus the most during the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <BarChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Focus Session Length</CardTitle>
              <CardDescription>Duration of your focus sessions over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <LineChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Focus Categories</CardTitle>
              <CardDescription>Distribution of time across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <PieChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Activity calendar */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Activity Calendar
            </CardTitle>
            <CardDescription>Your focus activity for the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <HeatmapCalendar />
            </div>
          </CardContent>
        </Card>

        {/* Focus streak */}
        <Card>
          <CardHeader>
            <CardTitle>Focus Streak</CardTitle>
            <CardDescription>Your current and best streaks</CardDescription>
          </CardHeader>
          <CardContent>
            <FocusStreakCard currentStreak={7} bestStreak={14} />
          </CardContent>
        </Card>

        {/* Most productive time */}
        <Card>
          <CardHeader>
            <CardTitle>Most Productive Time</CardTitle>
            <CardDescription>When you're most productive</CardDescription>
          </CardHeader>
          <CardContent>
            <MostProductiveCard
              mostProductiveDay="Tuesday"
              mostProductiveTime="10:00 AM - 12:00 PM" 
            />
          </CardContent>
        </Card>

        {/* Achievement card */}
        <Card className="md:col-span-2 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
            <CardDescription>Your productivity milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {['10 Day Streak', '50 Hours Focused', '100 Tasks Completed', '5 Projects Finished'].map((achievement) => (
                <div key={achievement} className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-2 text-sm font-medium">
                  {achievement}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
