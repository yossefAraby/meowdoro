
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CustomizableCat } from "@/components/shop/CustomizableCat";

export const NavbarLogo = () => {
  // Use try/catch to handle cases where the component might be rendered
  // outside of a Router context
  let navigate;
  try {
    navigate = useNavigate();
  } catch (error) {
    console.warn("NavbarLogo: Router context not available");
  }
  
  const handleNavigation = () => {
    if (navigate) {
      navigate("/");
    } else {
      // Fallback for when navigate is not available
      window.location.href = "/";
    }
  };
  
  return (
    <div 
      className="flex items-center gap-2 cursor-pointer transition-all hover:opacity-80"
      onClick={handleNavigation}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-[6px]"></div>
        <CustomizableCat size="sm" className="relative z-10" />
      </div>
      <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        Meowdoro
      </span>
    </div>
  );
};
