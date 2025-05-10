import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Sun, Moon, Menu, LogOut, User, Sparkles } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { NavbarLogo } from "./NavbarLogo";
import { NavbarMenu, navItems } from "./NavbarMenu";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PricingDialog } from "@/components/pricing/PricingDialog";
import { FishCurrency } from "@/components/shop/FishCurrency";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, setMode } = useTheme();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  
  // Check if the user is authenticated or in guest mode (using localStorage)
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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 glass animate-fade-in hidden md:block">
      <div className="container mx-auto">
        <nav className="flex justify-between items-center py-4">
          <NavbarLogo />
          
          {/* Show navbar menu for both authenticated users AND guests */}
          {(user || isGuest) && <NavbarMenu />}
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Fish Currency */}
            {(user || isGuest) && <FishCurrency />}
            
            <button 
              onClick={toggleMode} 
              className="p-2 rounded-full hover:bg-accent/50 transition-all duration-150"
              aria-label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {mode === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            {!isLoading && (
              user ? (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/20 rounded-full p-3">
                          <User className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{user.user_metadata?.username || user.email}</h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-2 space-y-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => setShowPricingDialog(true)}
                          className="w-full gap-2"
                        >
                          <Sparkles className="h-4 w-4 text-primary" />
                          Upgrade to Pro
                        </Button>
                        
                        <Button 
                          variant="outline"
                          size="sm" 
                          onClick={handleSignOut}
                          className="w-full gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ) : (
                isGuest ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      localStorage.removeItem("meowdoro-user");
                      window.dispatchEvent(new Event('auth-change'));
                      navigate("/");
                      toast({
                        title: "Signed out from guest mode",
                        description: "You've been signed out from guest mode.",
                      });
                    }}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                ) : (
                  <AuthDialog />
                )
              )
            )}
            
            {/* Mobile Menu - Hide on all screen sizes as we'll use the new MobileNavbar instead */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col h-full py-6">
                  <div className="text-xl font-bold mb-6">Meowdoro</div>
                  
                  <div className="space-y-2">
                    {(user || isGuest) ? (
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
                        
                        {user && (
                          <Button
                            variant="outline"
                            onClick={() => setShowPricingDialog(true)} 
                            className="w-full mt-4 gap-2"
                          >
                            <Sparkles className="h-4 w-4 text-primary" />
                            Upgrade to Pro
                          </Button>
                        )}
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
      
      {/* Pricing Dialog */}
      <PricingDialog 
        open={showPricingDialog} 
        onClose={() => setShowPricingDialog(false)} 
      />
    </div>
  );
};
