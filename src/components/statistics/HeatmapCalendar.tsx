
import React from 'react';
import { useTheme } from 'next-themes';

export const HeatmapCalendar = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Generate 6 months of sample data
  const generateHeatmapData = () => {
    const data = [];
    // Go back 6 months
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    startDate.setDate(1);
    
    const endDate = new Date();
    
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      // 0-4 represents activity level (0 = no activity, 4 = high activity)
      const activityLevel = Math.floor(Math.random() * 5);
      
      data.push({
        date: new Date(currentDate),
        value: activityLevel
      });
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
  };
  
  const heatmapData = generateHeatmapData();
  
  // Group by month and day of week for rendering
  const monthsData = () => {
    const months = {};
    
    heatmapData.forEach(day => {
      const monthKey = `${day.date.getFullYear()}-${day.date.getMonth()}`;
      
      if (!months[monthKey]) {
        months[monthKey] = {
          name: day.date.toLocaleString('default', { month: 'short' }),
          year: day.date.getFullYear(),
          days: Array(31).fill(null)
        };
      }
      
      months[monthKey].days[day.date.getDate() - 1] = day;
    });
    
    return Object.values(months);
  };
  
  const getColorForValue = (value) => {
    if (value === null || value === undefined) return 'var(--muted)'; // No data
    
    const opacity = [0.1, 0.25, 0.5, 0.75, 1][value];
    return `hsla(var(--primary), ${opacity})`;
  };
  
  const months = monthsData();
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {months.map((month) => (
          <div key={`${month.year}-${month.name}`} className="flex flex-col">
            <h4 className="text-xs font-medium mb-1">{month.name}</h4>
            <div className="grid grid-cols-7 gap-1">
              {[...Array(7)].map((_, dayOfWeekIndex) => (
                <div key={dayOfWeekIndex} className="w-3 h-3">
                  {month.days
                    .filter((day) => day && day.date.getDay() === dayOfWeekIndex)
                    .map((day) => (
                      <div
                        key={day.date.toISOString()}
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: getColorForValue(day.value) }}
                        title={`${day.date.toLocaleDateString()}: ${day.value > 0 ? `${day.value * 30} minutes` : 'No activity'}`}
                      />
                    ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center items-center gap-2">
        <div className="text-xs text-muted-foreground">Less</div>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((value) => (
            <div
              key={value}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getColorForValue(value) }}
            />
          ))}
        </div>
        <div className="text-xs text-muted-foreground">More</div>
      </div>
    </div>
  );
};
