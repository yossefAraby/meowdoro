
import React from "react";
import { NavbarBrand } from "./NavbarBrand";
import { NavbarLinks } from "./NavbarLinks";
import { NavbarActions } from "./NavbarActions";
import { MobileMenu } from "./MobileMenu";

export const Navbar: React.FC = () => {
  // Check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(
    localStorage.getItem("meowdoro-user") !== null
  );
  
  // Effect to check authentication status on mount and when localStorage changes
  React.useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("meowdoro-user");
      setIsAuthenticated(user !== null);
    };
    
    // Check initially
    checkAuth();
    
    // Setup event listener for storage changes
    window.addEventListener('storage', checkAuth);
    
    // Custom event for auth changes within the same window
    window.addEventListener('auth-change', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 glass animate-fade-in">
      <div className="container mx-auto">
        <nav className="flex justify-between items-center py-4">
          {/* Logo and App Name */}
          <NavbarBrand />

          {/* Navigation Links - Desktop - Centered */}
          <NavbarLinks isAuthenticated={isAuthenticated} />

          {/* Right Side - Mode Toggle & Actions */}
          <div className="flex items-center space-x-2">
            <NavbarActions isAuthenticated={isAuthenticated} />
            
            {/* Mobile Menu Button */}
            <MobileMenu isAuthenticated={isAuthenticated} />
          </div>
        </nav>
      </div>
    </div>
  );
};
