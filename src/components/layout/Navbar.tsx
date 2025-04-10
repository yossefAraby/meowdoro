
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Timer, 
  CheckSquare, 
  Users, 
  Sun, 
  Moon, 
  Menu,
  BookOpen,
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
            <img 
              src="/lovable-uploads/46a2db65-1fbf-46dd-9574-6b4bf1852060.png" 
              alt="Meowdoro Logo" 
              className="w-8 h-8 text-primary"
            />
            <span className="font-bold text-xl">Meowdoro</span>
          </div>

          {/* Navigation Links - Desktop - Centered */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 space-x-1 sm:space-x-2">
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
              aria-label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {mode === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            {isAuthenticated ? (
              <></>
            ) : (
              <div className="flex gap-2">
                <Link to="/" onClick={() => document.querySelector<HTMLButtonElement>('[data-docs-trigger]')?.click()}>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="hidden sm:inline-flex items-center gap-1"
                  >
                    <BookOpen className="h-4 w-4" />
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
                  
                  <div className="space-y-2">
                    {isAuthenticated ? (
                      <>
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
                      </>
                    ) : (
                      <div className="mt-auto space-y-3">
                        <Link to="/" onClick={() => document.querySelector<HTMLButtonElement>('[data-docs-trigger]')?.click()} className="block w-full">
                          <Button 
                            variant="outline"
                            className="w-full flex items-center gap-2"
                          >
                            <BookOpen className="h-4 w-4" />
                            <span>Documentation</span>
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
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </div>
  );
};
