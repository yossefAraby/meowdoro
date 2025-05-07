
import { Timer, CheckSquare, Users } from "lucide-react";

export const IconPacks = {
  default: {
    Timer,
    CheckSquare,
    Users
  },
  
  rounded: {
    Timer: (props: any) => (
      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
        <Timer className="w-4 h-4 text-primary" {...props} />
      </div>
    ),
    CheckSquare: (props: any) => (
      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
        <CheckSquare className="w-4 h-4 text-primary" {...props} />
      </div>
    ),
    Users: (props: any) => (
      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
        <Users className="w-4 h-4 text-primary" {...props} />
      </div>
    )
  },
  
  minimal: {
    Timer: (props: any) => (
      <Timer className="stroke-[1.25]" {...props} />
    ),
    CheckSquare: (props: any) => (
      <CheckSquare className="stroke-[1.25]" {...props} />
    ),
    Users: (props: any) => (
      <Users className="stroke-[1.25]" {...props} />
    )
  }
};
