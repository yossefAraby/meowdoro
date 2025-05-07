
import React from "react";
import { cn } from "@/lib/utils";
import { useShop } from "@/contexts/ShopContext";

interface CustomizableCatProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export const CustomizableCat: React.FC<CustomizableCatProps> = ({
  size = "md",
  className,
  onClick
}) => {
  const { activeCatColor } = useShop();
  
  // Size classes based on the size prop
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-14 h-14 sm:w-16 sm:h-16",
    lg: "w-20 h-20"
  };
  
  // Get the correct color
  const getColorStyle = () => {
    // For named themes
    if (['cyan', 'green', 'yellow', 'lavender', 'peach', 'mint', 'rose'].includes(activeCatColor)) {
      return {
        filter: `hue-rotate(var(--${activeCatColor}-hue, 0deg)) saturate(var(--${activeCatColor}-saturation, 100%))`,
        mixBlendMode: "screen" as const
      };
    }
    
    // For custom colors, use CSS filter to apply the color
    return {
      filter: `opacity(0.8) brightness(1.2) drop-shadow(0 0 0 ${activeCatColor})`,
      mixBlendMode: "screen" as const
    };
  };

  return (
    <div 
      className={cn(
        "relative cursor-pointer hover:scale-110 hover:rotate-3 transition-all duration-300",
        className
      )}
      onClick={onClick}
    >
      <img 
        src="/lovable-uploads/c70a5d9a-116f-4c19-914e-3f6bbdc78bd6.png" 
        alt="Meowdoro Cat" 
        className={cn("object-contain", sizeClasses[size])}
        style={getColorStyle()}
      />
    </div>
  );
};
