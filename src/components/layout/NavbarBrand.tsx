
import React from "react";
import { useNavigate } from "react-router-dom";

export const NavbarBrand: React.FC = () => {
  const navigate = useNavigate();
  
  return (
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
          loading="eager" // Ensure this loads quickly as it's important for branding
        />
      </div>
      <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Meowdoro</span>
    </div>
  );
};
