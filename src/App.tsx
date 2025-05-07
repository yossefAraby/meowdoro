
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/layout/ThemeProvider";
import { Navbar } from "./components/layout/Navbar";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./hooks/use-toast";

// Import page components
import Landing from "./pages/Landing";
import Docs from "./pages/Docs";
import Timer from "./pages/Timer";
import Tasks from "./pages/Tasks";
import Party from "./pages/Party";
import Statistics from "./pages/Statistics";
import Shop from "./pages/Shop";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const isGuest = localStorage.getItem("meowdoro-user") !== null;
  
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user && !isGuest) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/docs" element={<Docs />} />
      
      <Route path="/timer" element={
        <ProtectedRoute>
          <Timer />
        </ProtectedRoute>
      } />
      <Route path="/tasks" element={
        <ProtectedRoute>
          <Tasks />
        </ProtectedRoute>
      } />
      <Route path="/party" element={
        <ProtectedRoute>
          <Party />
        </ProtectedRoute>
      } />
      <Route path="/statistics" element={
        <ProtectedRoute>
          <Statistics />
        </ProtectedRoute>
      } />
      <Route path="/shop" element={
        <ProtectedRoute>
          <Shop />
        </ProtectedRoute>
      } />
      
      <Route path="/stats" element={<Navigate to="/statistics" replace />} />
      <Route path="/settings" element={<Navigate to="/timer" replace />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              
              <BrowserRouter>
                <Navbar />
                <main className="pt-20 min-h-screen">
                  <AppRoutes />
                </main>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
