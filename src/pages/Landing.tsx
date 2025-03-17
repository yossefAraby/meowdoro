
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Clock, 
  ListTodo, 
  Users, 
  BarChart, 
  Cat, 
  CheckCircle, 
  Coffee,
  ChevronDown,
  X
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [showDocsDialog, setShowDocsDialog] = useState(false);
  
  const handleGetStarted = () => {
    // Set a dummy user in localStorage to simulate login
    localStorage.setItem("meowdoro-user", JSON.stringify({ id: "user-1", name: "User" }));
    
    // Navigate to the timer page
    navigate("/timer");
  };
  
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col">
      {/* Hero section with gradient background */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl"></div>
        </div>
        
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border text-sm mb-4">
                <Cat className="h-4 w-4 text-primary" />
                <span>Focus better with your feline companion</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Stay focused with your <span className="text-primary">purr-sonal</span> productivity companion
              </h1>
              
              <p className="text-lg text-muted-foreground">
                Meowdoro helps you stay focused and productive with a fun, cat-themed timer and task management app.
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" className="rounded-full px-8" onClick={handleGetStarted}>
                  Get Started
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8" onClick={() => setShowDocsDialog(true)}>
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative w-full max-w-md animate-float">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/30 rounded-full"></div>
                
                <div className="relative z-10 bg-card rounded-2xl shadow-xl overflow-hidden border">
                  <div className="aspect-video bg-muted p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="h-6 w-24 bg-primary/20 rounded-full"></div>
                      <Cat className="h-6 w-6 text-primary animate-pulse-soft" />
                    </div>
                    <div className="h-32 w-32 mx-auto rounded-full border-8 border-primary/30 flex items-center justify-center">
                      <div className="text-lg font-bold">25:00</div>
                    </div>
                    <div className="mt-6 space-y-2">
                      <div className="h-4 w-2/3 mx-auto bg-muted-foreground/20 rounded-full"></div>
                      <div className="h-4 w-1/2 mx-auto bg-muted-foreground/20 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="p-4 grid grid-cols-2 gap-2">
                    <div className="h-16 bg-muted rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary/70" />
                    </div>
                    <div className="h-16 bg-muted rounded-lg flex items-center justify-center">
                      <ListTodo className="h-6 w-6 text-primary/70" />
                    </div>
                    <div className="h-16 bg-muted rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary/70" />
                    </div>
                    <div className="h-16 bg-muted rounded-lg flex items-center justify-center">
                      <BarChart className="h-6 w-6 text-primary/70" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-20 bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Designed to keep you productive, focused, and entertained with our feline assistant
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-card hover:bg-card/80 transition-all duration-300 rounded-xl p-6 shadow-sm border flex flex-col items-center text-center hover-scale">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Pomodoro Timer</h3>
              <p className="text-muted-foreground">
                Stay focused with customizable pomodoro sessions and break timers
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-card hover:bg-card/80 transition-all duration-300 rounded-xl p-6 shadow-sm border flex flex-col items-center text-center hover-scale">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ListTodo className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Task Management</h3>
              <p className="text-muted-foreground">
                Organize your tasks, notes, and to-do lists in one place
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-card hover:bg-card/80 transition-all duration-300 rounded-xl p-6 shadow-sm border flex flex-col items-center text-center hover-scale">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Study Party</h3>
              <p className="text-muted-foreground">
                Join study sessions with friends to stay motivated together
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-card hover:bg-card/80 transition-all duration-300 rounded-xl p-6 shadow-sm border flex flex-col items-center text-center hover-scale">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Stats Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your productivity and progress with visual statistics
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/10">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <div className="inline-block animate-float mb-6">
            <Cat className="h-16 w-16 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Ready to be more productive?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join thousands of users who have improved their focus and productivity with Meowdoro.
          </p>
          <Button size="lg" className="rounded-full px-8" onClick={handleGetStarted}>
            Get Started for Free
          </Button>
        </div>
      </section>
      
      {/* Documentation dialog */}
      <Dialog open={showDocsDialog} onOpenChange={setShowDocsDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cat className="h-5 w-5 text-primary" />
              Meowdoro Documentation
            </DialogTitle>
            <DialogDescription>
              A quick guide to getting started with your purr-sonal productivity companion
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 my-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Pomodoro Timer
              </h3>
              <p className="text-muted-foreground mb-2">
                The Pomodoro Technique is a time management method that uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Start a focused work session (default 25 minutes)</li>
                <li>Take a short break (default 5 minutes)</li>
                <li>After 4 work sessions, take a longer break (default 15 minutes)</li>
                <li>Your cat companion changes mood based on your current status</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <ListTodo className="h-4 w-4 text-primary" />
                Task Management
              </h3>
              <p className="text-muted-foreground mb-2">
                Keep track of your tasks, notes, and to-do lists in one place with a Google Keep-like interface.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Create notes and checklists</li>
                <li>Pin important items to the top</li>
                <li>Color-code your notes for easy organization</li>
                <li>Search your notes by title or content</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Study Party
              </h3>
              <p className="text-muted-foreground mb-2">
                Create or join study sessions with friends to stay motivated and accountable.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Create a study room and share the code with friends</li>
                <li>Join friends' study sessions with a room code</li>
                <li>Coming soon: chat, shared timer, and accountability features</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <BarChart className="h-4 w-4 text-primary" />
                Stats Tracking
              </h3>
              <p className="text-muted-foreground mb-2">
                Monitor your productivity and progress with visual statistics and insights.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Track your daily and weekly focus time</li>
                <li>See your productivity trends over time</li>
                <li>Set goals and monitor your progress</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Coffee className="h-4 w-4 text-primary" />
                Tips for Productivity
              </h3>
              <p className="text-muted-foreground mb-2">
                Get the most out of your Meowdoro experience with these productivity tips:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Block out distractions during focus sessions</li>
                <li>Take proper breaks to recharge</li>
                <li>Set clear goals for each pomodoro session</li>
                <li>Use the task list to keep track of what you need to accomplish</li>
                <li>Customize your work environment with themes and backgrounds</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Cat className="h-4 w-4" />
              <span>Meowdoro v1.0</span>
            </div>
            
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Landing;
