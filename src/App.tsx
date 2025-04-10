
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/layout/ThemeProvider";
import { Navbar } from "./components/layout/Navbar";

// Pages
import Landing from "./pages/Landing";
import Timer from "./pages/Timer";
import Tasks from "./pages/Tasks";
import Party from "./pages/Party";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import Docs from "./pages/Docs";
import NotFound from "./pages/NotFound";

// Create a new query client for React Query
const queryClient = new QueryClient();

const App = () => {
  // Simple auth check (this would be expanded in a real app)
  const isAuthenticated = localStorage.getItem("meowdoro-user") !== null;

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
                <Route 
                  path="/settings" 
                  element={isAuthenticated ? <Settings /> : <Navigate to="/" replace />} 
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
