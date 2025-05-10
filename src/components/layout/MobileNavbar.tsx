import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Timer, Clipboard, ClipboardList, MoreHorizontal, Home, Sun, Moon, LogOut, User, Sparkles, Store, Cat, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { PricingDialog } from "@/components/pricing/PricingDialog";

export const MobileNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, setMode } = useTheme();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  
  const isGuest = localStorage.getItem("meowdoro-user") !== null;
  
  const toggleMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("meowdoro-user");
    window.dispatchEvent(new Event('auth-change'));
    navigate("/");
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
  };

  // Mobile navigation items
  const mobileNavItems = [
    { path: "/timer", icon: Timer, label: "Timer" },
    { path: "/tasks", icon: Clipboard, label: "Notes" }
  ];

  // Items for the "More" grid
  const moreItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/chat", icon: Cat, label: "Chat" },
    { path: "/party", icon: Users, label: "Party" },
    { path: "/shop", icon: Store, label: "Shop" },
  ];

  // Handle navigation and close popover
  const handleNavigate = (path: string) => {
    navigate(path);
    setMoreOpen(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass">
      <div className="container mx-auto">
        <div className="flex justify-around items-center py-3 px-4">
          {/* Timer and Notes buttons */}
          {mobileNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all",
                location.pathname === item.path 
                  ? "text-primary" 
                  : "text-foreground/60 hover:text-primary"
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
          
          {/* More Dropdown */}
          <Popover open={moreOpen} onOpenChange={setMoreOpen}>
            <PopoverTrigger asChild>
              <button className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all",
                "text-foreground/60 hover:text-primary"
              )}>
                <MoreHorizontal className="w-6 h-6" />
                <span className="text-xs mt-1">More</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-screen h-[50vh] p-6" align="center" side="top" sideOffset={10}>
              <div className="grid grid-cols-3 gap-5 h-full">
                {/* Navigation grid items */}
                {moreItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-accent/50 transition-all"
                  >
                    <item.icon className="w-7 h-7 mb-2" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}

                {/* Theme toggle */}
                <button 
                  onClick={() => {
                    toggleMode();
                    setMoreOpen(false);
                  }} 
                  className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-accent/50 transition-all"
                >
                  {mode === "light" ? (
                    <>
                      <Moon className="w-7 h-7 mb-2" />
                      <span className="text-sm">Dark</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-7 h-7 mb-2" />
                      <span className="text-sm">Light</span>
                    </>
                  )}
                </button>

                {/* Upgrade button for authenticated users */}
                {user && (
                  <button 
                    onClick={() => {
                      setShowPricingDialog(true);
                      setMoreOpen(false);
                    }}
                    className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-accent/50 transition-all"
                  >
                    <Sparkles className="w-7 h-7 mb-2 text-primary" />
                    <span className="text-sm">Upgrade</span>
                  </button>
                )}

                {/* Account/Logout button */}
                {user || isGuest ? (
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setMoreOpen(false);
                    }}
                    className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-accent/50 transition-all"
                  >
                    <LogOut className="w-7 h-7 mb-2" />
                    <span className="text-sm">Logout</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/");
                      setMoreOpen(false);
                    }}
                    className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-accent/50 transition-all"
                  >
                    <User className="w-7 h-7 mb-2" />
                    <span className="text-sm">Login</span>
                  </button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Pricing Dialog */}
      <PricingDialog 
        open={showPricingDialog} 
        onClose={() => setShowPricingDialog(false)} 
      />
    </div>
  );
}; 