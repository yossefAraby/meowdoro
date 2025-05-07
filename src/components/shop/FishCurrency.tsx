
import React from "react";
import { Fish } from "lucide-react";
import { useShop } from "@/contexts/ShopContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const FishCurrency: React.FC = () => {
  const { fishCount } = useShop();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary">
            <Fish className="w-4 h-4" />
            <span className="text-sm font-medium">{fishCount}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-sm">Fish - Customize your app in the Shop</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
