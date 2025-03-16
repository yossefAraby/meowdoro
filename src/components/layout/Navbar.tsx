
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Timer, 
  CheckSquare, 
  Users, 
  BarChart, 
  Settings, 
  Sun, 
  Moon, 
  Cat
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { mode, setMode } = useTheme();
  
  const navItems = [
    { 
      path: "/timer", 
      icon: Timer, 
      label: "Timer" 
    },
    { 
      path: "/tasks", 
      icon: CheckSquare, 
      label: "Tasks" 
    },
    { 
      path: "/party", 
      icon: Users, 
      label: "Party" 
    },
    { 
      path: "/stats", 
      icon: BarChart, 
      label: "Stats" 
    },
  ];

  const getPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath === "/") return "Landing";
    
    const item = navItems.find(item => item.path === currentPath);
    return item ? item.label : "";
  };

  const toggleMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto">
        <nav className="flex justify-between items-center py-4">
          {/* Logo and App Name */}
          <div className="flex items-center gap-2">
            <div className="text-primary w-8 h-8">
              <div className="relative">
                <Timer className="w-8 h-8" />
                <Cat className="w-4 h-4 absolute -top-1 -right-1" />
              </div>
            </div>
            <span className="font-bold text-xl">Meowdoro</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center justify-center space-x-1 sm:space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-all-150",
                  location.pathname === item.path 
                    ? "text-primary bg-accent/50" 
                    : "text-foreground/60 hover:text-primary hover:bg-accent/30"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs mt-1">
                  {location.pathname === item.path ? item.label : ""}
                </span>
              </Link>
            ))}
          </div>

          {/* Right Side - Current Page, Theme Toggle & Settings */}
          <div className="flex items-center space-x-2">
            <span className="font-medium">{getPageTitle()}</span>
            
            <button 
              onClick={toggleMode} 
              className="p-2 rounded-full hover:bg-accent/50 transition-all-150"
            >
              {mode === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            <Link 
              to="/settings" 
              className={cn(
                "p-2 rounded-full transition-all-150",
                location.pathname === "/settings" 
                  ? "text-primary bg-accent/50" 
                  : "text-foreground/60 hover:text-primary hover:bg-accent/30"
              )}
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};
