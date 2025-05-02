
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/layout/ThemeProvider";
import { Navbar } from "./components/layout/Navbar";
import { useState, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";

// Import page components
import Landing from "./pages/Landing";
import Docs from "./pages/Docs";
import Timer from "./pages/Timer";
import Tasks from "./pages/Tasks";
import Party from "./pages/Party";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("meowdoro-user") !== null || 
    localStorage.getItem("supabase.auth.token") !== null
  );
  
  useEffect(() => {
    const checkAuth = () => {
      const guestUser = localStorage.getItem("meowdoro-user");
      const supabaseAuth = localStorage.getItem("supabase.auth.token");
      setIsAuthenticated(guestUser !== null || supabaseAuth !== null);
    };
    
    checkAuth();
    
    window.addEventListener('storage', checkAuth);
    window.addEventListener('auth-change', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            
            <BrowserRouter>
              <Navbar />
              
              <main className="pt-20 min-h-screen">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/docs" element={<Docs />} />
                  
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
                    element={<Navigate to="/timer" replace />} 
                  />
                  <Route 
                    path="/settings" 
                    element={<Navigate to="/timer" replace />} 
                  />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
