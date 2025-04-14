
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, BookOpen, Cat, Timer, CheckSquare, Users } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isAuthenticated: boolean;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { path: "/timer", icon: Timer, label: "Timer" },
    { path: "/tasks", icon: CheckSquare, label: "Tasks" },
    { path: "/party", icon: Users, label: "Party" },
  ];
  
  const handleJoinNow = () => {
    // Save user data to localStorage
    localStorage.setItem("meowdoro-user", JSON.stringify({ email: "demo@meowdoro.app" }));
    
    // Notify about authentication change
    window.dispatchEvent(new Event('auth-change'));
    
    // Navigate to timer page
    navigate("/timer");
  };

  return (
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
                    <span>Learn More</span>
                  </Button>
                </Link>
                <Button 
                  className="w-full flex items-center gap-2"
                  onClick={handleJoinNow}
                >
                  <Cat className="h-4 w-4" />
                  <span>Get Started</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
