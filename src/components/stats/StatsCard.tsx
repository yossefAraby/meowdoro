
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronsUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.FC<{ className?: string }>;
  description: string;
  trend?: string;
  trendUp?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  trendUp 
}) => {
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
        {trend && (
          <p className={`text-xs ${trendUp ? 'text-green-500' : 'text-muted-foreground'} flex items-center gap-1 mt-1`}>
            {trendUp && <ChevronsUp className="w-3 h-3" />}
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
