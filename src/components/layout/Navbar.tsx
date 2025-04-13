
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Timer, 
  CheckSquare, 
  Users, 
  Sun, 
  Moon,
  Menu,
  Cat
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, setMode } = useTheme();
  
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem("meowdoro-user") !== null;
  
  const navItems = [
    { path: "/timer", icon: Timer, label: "Timer" },
    { path: "/tasks", icon: CheckSquare, label: "Tasks" },
    { path: "/party", icon: Users, label: "Party" },
  ];

  const toggleMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  const handleGetStarted = () => {
    localStorage.setItem("meowdoro-user", JSON.stringify({ email: "demo@meowdoro.app" }));
    navigate("/timer");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto">
        <nav className="flex justify-between items-center h-16">
          {/* Logo and App Name */}
          <div 
            className="flex items-center gap-2 cursor-pointer transition-all hover:opacity-80"
            onClick={() => navigate("/")}
          >
            <img 
              src="/lovable-uploads/6c3148ec-dc2e-4a2b-a5b6-482ca6e3b664.png" 
              alt="Meowdoro Logo" 
              className="w-8 h-8"
            />
            <span className="font-bold text-xl text-primary">Meowdoro</span>
          </div>

          {/* Main Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated && navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  location.pathname === item.path 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button 
              onClick={toggleMode} 
              className="p-2 rounded-md hover:bg-accent/50 transition-all"
              aria-label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {mode === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            {/* Auth Button */}
            {!isAuthenticated && (
              <Button 
                size="sm" 
                onClick={handleGetStarted}
                className="hidden sm:flex items-center gap-1"
              >
                <Cat className="h-4 w-4" />
                Get Started
              </Button>
            )}
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col h-full py-6">
                  <div className="text-xl font-bold mb-6">Meowdoro</div>
                  
                  <div className="space-y-2">
                    {isAuthenticated ? (
                      navItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg transition-all",
                            location.pathname === item.path 
                              ? "bg-primary/10 text-primary" 
                              : "hover:bg-primary/5"
                          )}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </Link>
                      ))
                    ) : (
                      <Button 
                        className="w-full mt-4 flex items-center gap-2 justify-center"
                        onClick={handleGetStarted}
                      >
                        <Cat className="h-4 w-4" />
                        <span>Get Started</span>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </div>
  );
};
