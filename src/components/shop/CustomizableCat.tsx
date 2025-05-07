import React from "react";
import { cn } from "@/lib/utils";
import { useShop } from "@/contexts/ShopContext";

interface CustomizableCatProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  previewColor?: string;
}

export const CustomizableCat: React.FC<CustomizableCatProps> = ({
  size = "md",
  className,
  onClick,
  previewColor
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
    // Use preview color if provided
    const colorToUse = previewColor || activeCatColor;

    // For reset color
    if (colorToUse === "reset") {
      return {}; // No filter for reset color
    }

    // For named themes
    if (['cyan', 'green', 'yellow', 'lavender', 'peach', 'mint', 'rose'].includes(colorToUse)) {
      return {
        filter: `brightness(0) saturate(100%) invert(67%) sepia(72%) saturate(380%) hue-rotate(var(--${colorToUse}-hue, 165deg)) brightness(97%) contrast(88%)`
      };
    }
    
    // For custom colors (hex values)
    if (colorToUse.startsWith('#')) {
      return {
        filter: `brightness(0) saturate(100%) invert(67%) sepia(72%) saturate(380%) hue-rotate(${getHueFromHex(colorToUse)}deg) brightness(97%) contrast(88%)`
      };
    }

    // Default to no filter if no valid color is set
    return {};
  };

  // Helper function to convert hex to hue
  const getHueFromHex = (hex: string) => {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    
    if (max === min) {
      h = 0; // achromatic
    } else {
      const d = max - min;
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h = h * 60;
    }
    
    return h;
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
        src="/cat images/idle.png" 
        alt="Meowdoro Cat" 
        className={cn("object-contain", sizeClasses[size])}
        style={getColorStyle()}
      />
    </div>
  );
};
