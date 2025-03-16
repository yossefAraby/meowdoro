
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/layout/ThemeProvider";
import { Navbar } from "./components/layout/Navbar";
import Landing from "./pages/Landing";
import Timer from "./pages/Timer";
import Tasks from "./pages/Tasks";
import Party from "./pages/Party";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Check if the user is authenticated (simplified for now)
  const isAuthenticated = localStorage.getItem("meowdoro-user") !== null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {/* Only show Navbar for authenticated routes */}
            {isAuthenticated && <Navbar />}
            
            <main className={isAuthenticated ? "pt-20 min-h-screen" : "min-h-screen"}>
              <Routes>
                {/* Public route */}
                <Route path="/" element={<Landing />} />
                
                {/* Protected routes */}
                <Route path="/timer" element={isAuthenticated ? <Timer /> : <Navigate to="/" />} />
                <Route path="/tasks" element={isAuthenticated ? <Tasks /> : <Navigate to="/" />} />
                <Route path="/party" element={isAuthenticated ? <Party /> : <Navigate to="/" />} />
                <Route path="/stats" element={isAuthenticated ? <Stats /> : <Navigate to="/" />} />
                <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/" />} />
                
                {/* Catch-all route */}
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
