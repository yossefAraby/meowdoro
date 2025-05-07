
import React from 'react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart as RechartsAreaChart,
  Area
} from 'recharts';

// Sample data for the charts
const dailyData = [
  { name: '6AM', minutes: 25 },
  { name: '8AM', minutes: 55 },
  { name: '10AM', minutes: 120 },
  { name: '12PM', minutes: 75 },
  { name: '2PM', minutes: 40 },
  { name: '4PM', minutes: 85 },
  { name: '6PM', minutes: 65 },
  { name: '8PM', minutes: 30 },
];

const sessionData = [
  { day: 'Mon', avg: 23 },
  { day: 'Tue', avg: 27 },
  { day: 'Wed', avg: 21 },
  { day: 'Thu', avg: 32 },
  { day: 'Fri', avg: 22 },
  { day: 'Sat', avg: 18 },
  { day: 'Sun', avg: 15 },
];

const categoryData = [
  { name: 'Study', value: 45 },
  { name: 'Work', value: 30 },
  { name: 'Personal', value: 15 },
  { name: 'Other', value: 10 },
];

const areaData = [
  { date: '04/30', focus: 2.4 },
  { date: '05/01', focus: 3.1 },
  { date: '05/02', focus: 2.8 },
  { date: '05/03', focus: 3.5 },
  { date: '05/04', focus: 4.2 },
  { date: '05/05', focus: 3.7 },
  { date: '05/06', focus: 3.0 },
  { date: '05/07', focus: 3.9 },
  { date: '05/08', focus: 4.5 },
  { date: '05/09', focus: 4.1 },
  { date: '05/10', focus: 3.6 },
  { date: '05/11', focus: 3.2 },
  { date: '05/12', focus: 3.8 },
  { date: '05/13', focus: 4.0 },
  { date: '05/14', focus: 4.3 },
];

// Colors for charts
const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

// Bar chart component
export const BarChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={dailyData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis 
          dataKey="name" 
          stroke="var(--muted-foreground)" 
          fontSize={12}
          tickLine={false}
        />
        <YAxis 
          stroke="var(--muted-foreground)" 
          fontSize={12}
          tickLine={false}
          label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { fill: 'var(--muted-foreground)', fontSize: 12 } }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--card)', 
            borderColor: 'var(--border)',
            color: 'var(--foreground)',
          }}
          cursor={{ fill: 'var(--accent)' }}
        />
        <Bar 
          dataKey="minutes" 
          fill="var(--primary)" 
          radius={[4, 4, 0, 0]}
          barSize={30}
          animationBegin={200}
          animationDuration={1200}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

// Line chart component
export const LineChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={sessionData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis 
          dataKey="day" 
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
        />
        <YAxis 
          stroke="var(--muted-foreground)" 
          fontSize={12}
          tickLine={false}
          label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { fill: 'var(--muted-foreground)', fontSize: 12 } }}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: 'var(--card)', 
            borderColor: 'var(--border)',
            color: 'var(--foreground)',
          }}
        />
        <Line 
          type="monotone" 
          dataKey="avg" 
          stroke="var(--primary)" 
          activeDot={{ r: 8 }}
          strokeWidth={2}
          animationBegin={200}
          animationDuration={1500}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

// Pie chart component
export const PieChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <Pie
          data={categoryData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          innerRadius={40}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          animationBegin={200}
          animationDuration={1500}
        >
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ 
            backgroundColor: 'var(--card)', 
            borderColor: 'var(--border)',
            color: 'var(--foreground)',
          }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

// Area chart component
export const AreaChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart
        data={areaData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis 
          dataKey="date" 
          stroke="var(--muted-foreground)" 
          fontSize={12}
          tickLine={false}
        />
        <YAxis 
          stroke="var(--muted-foreground)" 
          fontSize={12}
          tickLine={false}
          label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fill: 'var(--muted-foreground)', fontSize: 12 } }}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: 'var(--card)', 
            borderColor: 'var(--border)',
            color: 'var(--foreground)',
          }}
        />
        <Area 
          type="monotone" 
          dataKey="focus" 
          stroke="var(--primary)" 
          fillOpacity={1}
          fill="url(#colorFocus)"
          animationBegin={200}
          animationDuration={1500}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};
