
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/layout/ThemeProvider";
import { Navbar } from "./components/layout/Navbar";
import { useState, useEffect } from "react";

// Pages
import Landing from "./pages/Landing";
import Timer from "./pages/Timer";
import Tasks from "./pages/Tasks";
import Party from "./pages/Party";
import Docs from "./pages/Docs";
import Stats from "./pages/Stats";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";

// Create a new query client for React Query
const queryClient = new QueryClient();

const App = () => {
  // Use state to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("meowdoro-user") !== null
  );
  
  // Effect to update auth state when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("meowdoro-user");
      setIsAuthenticated(user !== null);
    };
    
    // Check initially
    checkAuth();
    
    // Setup event listeners for storage changes across tabs
    window.addEventListener('storage', checkAuth);
    
    // Custom event for auth changes within the same window
    window.addEventListener('auth-change', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          {/* Toast notifications */}
          <Toaster />
          <Sonner />
          
          <BrowserRouter>
            {/* Navbar is always visible */}
            <Navbar />
            
            <main className="pt-20 min-h-screen">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/docs" element={<Docs />} />
                <Route path="/pricing" element={<Pricing />} />
                
                {/* Protected routes - redirect to home if not logged in */}
                <Route 
                  path="/timer" 
                  element={isAuthenticated ? <Timer /> : <Navigate to="/" replace />} 
                />
                <Route 
                  path="/tasks" 
                  element={isAuthenticated ? <Tasks /> : <Navigate to="/" replace />} 
                />
                <Route 
                  path="/party" 
                  element={isAuthenticated ? <Party /> : <Navigate to="/" replace />} 
                />
                <Route 
                  path="/stats" 
                  element={isAuthenticated ? <Stats /> : <Navigate to="/" replace />} 
                />
                
                {/* Redirect settings to timer */}
                <Route 
                  path="/settings" 
                  element={<Navigate to="/timer" replace />} 
                />
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
