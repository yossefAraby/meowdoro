
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "cyan" | "green" | "yellow" | "lavender" | "peach" | "mint" | "rose";
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
    if (theme !== "cyan") {
      document.documentElement.classList.add(`theme-${theme}`);
    }
  }, [theme]);

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
