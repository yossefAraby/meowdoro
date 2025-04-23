
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, CheckSquare, Star } from "lucide-react";
import { DailyStats, formatTime } from "./MockDataService";

interface WeeklyOverviewProps {
  stats: DailyStats[];
}

export const WeeklyOverview: React.FC<WeeklyOverviewProps> = ({ stats }) => {
  const totalFocusMinutes = stats.reduce((sum, day) => sum + day.focusMinutes, 0);
  const totalCompletedTasks = stats.reduce((sum, day) => sum + day.completedTasks, 0);
  const totalStars = stats.reduce((sum, day) => sum + day.stars, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Overview</CardTitle>
        <CardDescription>Your productivity for the past {stats.length} days</CardDescription>
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
              <p className="text-sm text-muted-foreground">
                Daily average: {formatTime(Math.floor(totalFocusMinutes / stats.length))}
              </p>
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
              <p className="text-sm text-muted-foreground">
                Daily average: {(totalCompletedTasks / stats.length).toFixed(1)}
              </p>
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
              <p className="text-sm text-muted-foreground">
                Daily average: {(totalStars / stats.length).toFixed(1)}
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
