
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon, BookOpen, Cat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

interface NavbarActionsProps {
  isAuthenticated: boolean;
}

export const NavbarActions: React.FC<NavbarActionsProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const { mode, setMode } = useTheme();
  
  const toggleMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };
  
  const handleJoinNow = () => {
    // Save user data to localStorage
    localStorage.setItem("meowdoro-user", JSON.stringify({ email: "demo@meowdoro.app" }));
    
    // Notify about authentication change
    window.dispatchEvent(new Event('auth-change'));
    
    // Navigate to timer page
    navigate("/timer");
  };

  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={toggleMode} 
        className="p-2 rounded-full hover:bg-accent/50 transition-all duration-150"
        aria-label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
      >
        {mode === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>
      
      {!isAuthenticated && (
        <div className="flex gap-2">
          <Link to="/" onClick={() => document.querySelector<HTMLButtonElement>('[data-docs-trigger]')?.click()}>
            <Button 
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex items-center gap-1"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:inline">Learn More</span>
            </Button>
          </Link>
          <Button 
            size="sm" 
            className="hidden sm:inline-flex items-center gap-1"
            onClick={handleJoinNow}
          >
            <Cat className="h-4 w-4" />
            Get Started
          </Button>
        </div>
      )}
    </div>
  );
};
