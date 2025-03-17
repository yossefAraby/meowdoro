
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    // Set a dummy user in localStorage to simulate login
    localStorage.setItem("meowdoro-user", JSON.stringify({ id: "user-1", name: "User" }));
    
    // Navigate to the timer page
    navigate("/timer");
  };
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 min-h-[calc(100vh-5rem)] flex flex-col justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Stay focused with your <span className="text-primary">purr-sonal</span> productivity companion
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Meowdoro helps you stay focused and productive with a fun, cat-themed timer and task management app.
          </p>
          
          <div className="pt-4">
            <Button size="lg" className="rounded-full px-8" onClick={handleGetStarted}>
              Get Started
            </Button>
          </div>
        </div>
        
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/30 rounded-full"></div>
            
            <div className="relative z-10 bg-card rounded-2xl shadow-xl overflow-hidden border">
              <div className="aspect-video bg-muted p-4">
                <div className="h-6 w-24 bg-primary/20 rounded-full mb-4"></div>
                <div className="h-32 w-32 mx-auto bg-primary/30 rounded-full"></div>
                <div className="mt-6 space-y-2">
                  <div className="h-4 w-2/3 mx-auto bg-muted-foreground/20 rounded-full"></div>
                  <div className="h-4 w-1/2 mx-auto bg-muted-foreground/20 rounded-full"></div>
                </div>
              </div>
              
              <div className="p-4 grid grid-cols-2 gap-2">
                <div className="h-16 bg-muted rounded-lg"></div>
                <div className="h-16 bg-muted rounded-lg"></div>
                <div className="h-16 bg-muted rounded-lg"></div>
                <div className="h-16 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
