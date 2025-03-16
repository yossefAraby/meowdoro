
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "cyan" | "green" | "yellow";
type Mode = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  mode: Mode;
  setTheme: (theme: Theme) => void;
  setMode: (mode: Mode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "cyan",
  mode: "light",
  setTheme: () => {},
  setMode: () => {},
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

  useEffect(() => {
    localStorage.setItem("meowdoro-theme", theme);
    
    // Remove any existing theme classes and add the new one
    document.documentElement.classList.remove("theme-cyan", "theme-green", "theme-yellow");
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

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
