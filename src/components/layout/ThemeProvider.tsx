
import React, { createContext, useContext, useEffect, useState } from "react";
import { useShop } from "@/contexts/ShopContext";

type Theme = "cyan" | "green" | "yellow" | "lavender" | "peach" | "mint" | "rose" | string;
type Mode = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  mode: Mode;
  transparency: boolean;
  setTheme: (theme: Theme) => void;
  setMode: (mode: Mode) => void;
  setTransparency: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "cyan",
  mode: "light",
  transparency: true,
  setTheme: () => {},
  setMode: () => {},
  setTransparency: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("meowdoro-theme");
    return (saved as Theme) || "cyan";
  });
  
  const [mode, setMode] = useState<Mode>(() => {
    // Check for system preference first, then saved preference
    const saved = localStorage.getItem("meowdoro-mode");
    if (saved) return saved as Mode;
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return "dark";
    }
    return "light";
  });
  
  const [transparency, setTransparency] = useState<boolean>(() => {
    const saved = localStorage.getItem("meowdoro-transparency");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem("meowdoro-theme", theme);
    
    // Remove any existing theme classes and add the new one
    document.documentElement.classList.remove(
      "theme-cyan", 
      "theme-green", 
      "theme-yellow", 
      "theme-lavender", 
      "theme-peach",
      "theme-mint",
      "theme-rose"
    );
    
    if (["cyan", "green", "yellow", "lavender", "peach", "mint", "rose"].includes(theme)) {
      if (theme !== "cyan") {
        document.documentElement.classList.add(`theme-${theme}`);
      }
    } else {
      // Handle custom colors (not predefined themes)
      const root = document.documentElement;
      const color = theme;
      
      // Set the HSL values for custom color
      if (color.startsWith('#')) {
        try {
          // Convert hex to RGB
          const hex = color.substring(1);
          const r = parseInt(hex.substring(0, 2), 16) / 255;
          const g = parseInt(hex.substring(2, 4), 16) / 255;
          const b = parseInt(hex.substring(4, 6), 16) / 255;
          
          // Find max and min RGB values
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          
          // Calculate lightness
          const l = (max + min) / 2;
          
          // Calculate saturation
          let s = 0;
          if (max !== min) {
            s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
          }
          
          // Calculate hue
          let h = 0;
          if (max !== min) {
            if (max === r) h = (g - b) / (max - min) + (g < b ? 6 : 0);
            else if (max === g) h = (b - r) / (max - min) + 2;
            else h = (r - g) / (max - min) + 4;
            h *= 60;
          }
          
          // Set custom primary color
          root.style.setProperty('--primary', `${h} ${s * 100}% ${mode === 'dark' ? 65 : 45}%`);
        } catch (error) {
          console.error("Error converting hex color:", error);
          // Fallback to default
          root.style.removeProperty('--primary');
        }
      }
    }
  }, [theme, mode]);

  useEffect(() => {
    localStorage.setItem("meowdoro-mode", mode);
    
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);
  
  useEffect(() => {
    localStorage.setItem("meowdoro-transparency", transparency.toString());
    
    if (transparency) {
      document.documentElement.classList.add("transparency-enabled");
      document.documentElement.classList.remove("transparency-disabled");
    } else {
      document.documentElement.classList.add("transparency-disabled");
      document.documentElement.classList.remove("transparency-enabled");
    }
  }, [transparency]);

  return (
    <ThemeContext.Provider value={{ theme, mode, transparency, setTheme, setMode, setTransparency }}>
      {children}
    </ThemeContext.Provider>
  );
};
