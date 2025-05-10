import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/layout/ThemeProvider";
import { Navbar } from "./components/layout/Navbar";
import { MobileNavbar } from "./components/layout/MobileNavbar";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./hooks/use-toast";
import { ShopProvider } from "./contexts/ShopContext";
import { TimerProvider } from '@/contexts/TimerContext';
import { BackgroundSoundProvider } from './contexts/BackgroundSoundContext';
import { PageContainer } from "./components/layout/PageContainer";
import { TimerPauseProvider } from './contexts/TimerPauseContext';

// Import page components
import Landing from "./pages/Landing";
import Docs from "./pages/Docs";
import Timer from "./pages/Timer";
import Tasks from "./pages/Tasks";
import Party from "./pages/Party";
import Shop from "./pages/Shop";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const isGuest = localStorage.getItem("meowdoro-user") !== null;
  
  // Show loading indicator while auth state is being determined
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // Redirect to landing page if neither authenticated nor guest
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
          <div className="h-full">
            <Tasks />
          </div>
        </ProtectedRoute>
      } />
      <Route path="/chat" element={
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      } />
      <Route path="/party" element={
        <ProtectedRoute>
          <Party />
        </ProtectedRoute>
      } />
      <Route path="/statistics" element={
        <ProtectedRoute>
          <PageContainer className="max-w-6xl page-transition">
            <h1 className="text-3xl font-bold mb-4">Statistics</h1>
            <p className="text-muted-foreground">Coming soon! We're working on bringing you detailed productivity insights.</p>
          </PageContainer>
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
            <ShopProvider>
              <TimerProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BackgroundSoundProvider>
                    <BrowserRouter>
                      <TimerPauseProvider>
                        <div className="min-h-screen bg-background font-sans antialiased scrollbar-hide">
                          <Navbar />
                          <main className="flex-1 pt-0 md:pt-20">
                            <AppRoutes />
                          </main>
                          <MobileNavbar />
                        </div>
                      </TimerPauseProvider>
                    </BrowserRouter>
                  </BackgroundSoundProvider>
                </TooltipProvider>
              </TimerProvider>
            </ShopProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
