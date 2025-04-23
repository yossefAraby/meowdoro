
export interface DailyStats {
  date: string;
  focusMinutes: number;
  completedTasks: number;
  stars: number;
}

// Mock data generator for demonstration
export const generateMockData = (days: number = 7): DailyStats[] => {
  const today = new Date();
  const data: DailyStats[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
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

// Format time in hours and minutes
export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};
