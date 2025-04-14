
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Timer, CheckSquare, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
}

interface NavbarLinksProps {
  isAuthenticated: boolean;
}

export const NavbarLinks: React.FC<NavbarLinksProps> = ({ isAuthenticated }) => {
  const location = useLocation();
  
  const navItems: NavItem[] = [
    { path: "/timer", icon: Timer, label: "Timer" },
    { path: "/tasks", icon: CheckSquare, label: "Tasks" },
    { path: "/party", icon: Users, label: "Party" },
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 space-x-1 sm:space-x-2">
      {navItems.map((item) => (
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
  );
};
