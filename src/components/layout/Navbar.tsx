
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Timer, 
  CheckSquare, 
  Users, 
  BarChart, 
  Settings, 
  Sun, 
  Moon, 
  Cat,
  Menu,
  FileText
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
    { path: "/stats", icon: BarChart, label: "Stats" },
    { path: "/docs", icon: FileText, label: "Documentation" }
  ];

  const toggleMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  const handleLogin = () => {
    // Set a demo user to enable navigation to protected routes
    localStorage.setItem("meowdoro-user", JSON.stringify({ email: "demo@meowdoro.app" }));
    navigate("/timer");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 glass animate-fade-in">
      <div className="container mx-auto">
        <nav className="flex justify-between items-center py-4">
          {/* Logo and App Name */}
          <div 
            className="flex items-center gap-2 cursor-pointer transition-all hover:opacity-80"
            onClick={() => navigate("/")}
          >
            <div className="text-primary w-8 h-8">
              <div className="relative">
                <Timer className="w-8 h-8" />
                <Cat className="w-4 h-4 absolute -top-1 -right-1" />
              </div>
            </div>
            <span className="font-bold text-xl">Meowdoro</span>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center justify-center space-x-1 sm:space-x-2">
            {isAuthenticated && navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-150",
                  location.pathname === item.path 
                    ? "text-primary bg-accent/50" 
                    : "text-foreground/60 hover:text-primary hover:bg-accent/30"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs mt-1">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Right Side - Mode Toggle & Actions */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleMode} 
              className="p-2 rounded-full hover:bg-accent/50 transition-all duration-150"
            >
              {mode === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            {isAuthenticated ? (
              <Link 
                to="/settings" 
                className={cn(
                  "p-2 rounded-full transition-all duration-150 hidden sm:inline-flex",
                  location.pathname === "/settings" 
                    ? "text-primary bg-accent/50" 
                    : "text-foreground/60 hover:text-primary hover:bg-accent/30"
                )}
              >
                <Settings className="w-5 h-5" />
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link to="/docs">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="hidden sm:inline-flex"
                  >
                    Learn More
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  className="hidden sm:inline-flex"
                  onClick={handleLogin}
                >
                  Get Started
                </Button>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col h-full py-6">
                  <div className="text-xl font-bold mb-6">Meowdoro</div>
                  
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg transition-all",
                            location.pathname === item.path 
                              ? "bg-accent text-primary" 
                              : "hover:bg-accent/50"
                          )}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                      
                      <Link
                        to="/settings"
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg transition-all",
                          location.pathname === "/settings" 
                            ? "bg-accent text-primary" 
                            : "hover:bg-accent/50"
                        )}
                      >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-auto space-y-3">
                      <Link to="/docs" className="block w-full">
                        <Button 
                          variant="outline"
                          className="w-full"
                        >
                          Learn More
                        </Button>
                      </Link>
                      <Button 
                        className="w-full"
                        onClick={handleLogin}
                      >
                        Get Started
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </div>
  );
};
