
import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Sun, Moon, Menu, User } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { NavbarLogo } from "./NavbarLogo";
import { NavbarMenu, navItems } from "./NavbarMenu";
import { cn } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, setMode } = useTheme();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  
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

  // Get user info from localStorage if guest
  const guestUser = user ? null : JSON.parse(localStorage.getItem("meowdoro-user") || "null");
  const isGuest = Boolean(guestUser);
  const displayName = user?.user_metadata?.first_name || guestUser?.first_name || "User";

  return (
    <div className="fixed top-0 left-0 right-0 z-50 glass animate-fade-in">
      <div className="container mx-auto">
        <nav className="flex justify-between items-center py-4">
          <NavbarLogo />
          
          {/* Show NavbarMenu for both authenticated and guest users */}
          <NavbarMenu />
          
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
              user || isGuest ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={handleSignOut}
                    >
                      <User className="h-4 w-4" />
                      {displayName}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <p className="font-medium">{displayName}</p>
                      {isGuest && (
                        <p className="text-muted-foreground text-xs">Guest Account</p>
                      )}
                      <p className="text-xs mt-1">Click to sign out</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
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
                    {/* Show navigation items for both authenticated and guest users */}
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
