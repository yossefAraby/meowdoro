
import { NavLink } from "react-router-dom";
import { Clock, CheckSquare, Users, BarChart3, Fish } from "lucide-react";
import { cn } from "@/lib/utils";

// Define navbar items with their paths, labels, and icons
export const navItems = [
  {
    path: "/timer",
    label: "Timer",
    icon: Clock
  },
  {
    path: "/tasks",
    label: "Tasks",
    icon: CheckSquare
  },
  {
    path: "/party",
    label: "Party",
    icon: Users
  },
  {
    path: "/statistics",
    label: "Stats",
    icon: BarChart3
  },
  {
    path: "/shop",
    label: "Shop",
    icon: Fish
  }
];

export const NavbarMenu = () => {
  return (
    <div className="hidden md:flex space-x-1">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
              isActive
                ? "bg-muted text-primary"
                : "text-foreground/70 hover:text-foreground hover:bg-accent"
            )
          }
        >
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};
