
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Timer, 
  CheckSquare, 
  Users, 
  Sun, 
  Moon,
  Menu,
  Cat,
  LogOut
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, setMode } = useTheme();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  
  const navItems = [
    { path: "/timer", icon: Timer, label: "Timer" },
    { path: "/tasks", icon: CheckSquare, label: "Tasks" },
    { path: "/party", icon: Users, label: "Party" },
  ];

  const toggleMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
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
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-[6px]"></div>
              <img 
                src="/lovable-uploads/6c3148ec-dc2e-4a2b-a5b6-482ca6e3b664.png" 
                alt="Meowdoro Logo" 
                className="w-8 h-8 relative z-10"
              />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Meowdoro
            </span>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 space-x-1">
            {user && navItems.map((item) => (
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
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleMode} 
              className="p-2 rounded-full hover:bg-accent/50 transition-all duration-150"
              aria-label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {mode === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            {!isLoading && (
              user ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              ) : (
                <AuthDialog />
              )
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
                    {user ? (
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
                        <AuthDialog />
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
