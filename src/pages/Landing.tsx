import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Clock, 
  ListTodo, 
  Users, 
  BarChart, 
  Cat, 
  BookOpen,
  ChevronDown,
  X,
  Sparkles
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

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
              <div className="inline-flex items-center gap-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border text-sm mb-4 animate-pulse-soft">
                <Cat className="h-4 w-4 text-primary" />
                <span>Focus better with your feline companion</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Stay focused with your <span className="text-primary relative inline-block">
                  purr-sonal
                  <span className="absolute -top-1 -right-1">
                    <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                  </span>
                </span> productivity companion
              </h1>
              
              <p className="text-lg text-muted-foreground">
                Meowdoro helps you stay focused and productive with a fun, cat-themed timer and task management app.
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" className="rounded-full px-8 group relative overflow-hidden" onClick={handleGetStarted}>
                  <span className="relative z-10">Get Started</span>
                  <span className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-full px-8 flex items-center gap-2 group" 
                  onClick={() => setShowDocsDialog(true)}
                >
                  <BookOpen className="h-5 w-5 group-hover:scale-110 transition-all" />
                  <span>Documentation</span>
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative">
                <div className="grid grid-cols-2 gap-6 animate-float">
                  <div className="bg-card p-6 rounded-lg shadow-md border flex items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                    <Clock className="h-12 w-12 text-primary" />
                  </div>
                  <div className="bg-card p-6 rounded-lg shadow-md border flex items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:rotate-3">
                    <ListTodo className="h-12 w-12 text-primary" />
                  </div>
                  <div className="bg-card p-6 rounded-lg shadow-md border flex items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-rotate-3">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                  <div className="bg-card p-6 rounded-lg shadow-md border flex items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                    <Cat className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <div className="absolute -bottom-5 -right-5 bg-primary text-white p-3 rounded-full shadow-lg animate-bounce">
                  <Sparkles className="h-6 w-6" />
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
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20"></div>
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 relative inline-block">
              Features
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-full transform scale-x-50 group-hover:scale-x-100 transition-transform"></span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Designed to keep you productive, focused, and entertained with our feline assistant
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-card hover:bg-card/80 transition-all duration-300 rounded-xl p-6 shadow-sm border flex flex-col items-center text-center hover-scale group">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Pomodoro Timer</h3>
              <p className="text-muted-foreground">
                Stay focused with customizable pomodoro sessions and break timers
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-card hover:bg-card/80 transition-all duration-300 rounded-xl p-6 shadow-sm border flex flex-col items-center text-center hover-scale group">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <ListTodo className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Task Management</h3>
              <p className="text-muted-foreground">
                Organize your tasks, notes, and to-do lists in one place
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-card hover:bg-card/80 transition-all duration-300 rounded-xl p-6 shadow-sm border flex flex-col items-center text-center hover-scale group">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Study Party</h3>
              <p className="text-muted-foreground">
                Join study sessions with friends to stay motivated together
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-card hover:bg-card/80 transition-all duration-300 rounded-xl p-6 shadow-sm border flex flex-col items-center text-center hover-scale group">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
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
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10"></div>
        <div className="container max-w-3xl mx-auto px-4 text-center relative z-10">
          <div className="inline-block animate-float mb-6 relative">
            <Cat className="h-16 w-16 text-primary" />
            <span className="absolute -top-2 -right-2 animate-pulse">
              <Sparkles className="h-6 w-6 text-yellow-400" />
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Ready to be more productive?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join thousands of users who have improved their focus and productivity with Meowdoro.
          </p>
          <Button 
            size="lg" 
            className="rounded-full px-8 group relative overflow-hidden" 
            onClick={handleGetStarted}
          >
            <span className="relative z-10">Get Started for Free</span>
            <span className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
          </Button>
        </div>
      </section>
      
      {/* Documentation dialog */}
      <Dialog open={showDocsDialog} onOpenChange={setShowDocsDialog}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Meowdoro Documentation
            </DialogTitle>
            <DialogDescription>
              Comprehensive guide to getting the most out of your Meowdoro experience
            </DialogDescription>
          </DialogHeader>
          
          <Link to="/docs" className="text-primary hover:underline text-sm">
            Open full documentation page
          </Link>
          
          <div className="space-y-8 my-4 pr-2">
            {/* Documentation content - Included directly in Dialog to keep it simple */}
            <section>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Pomodoro Timer
              </h3>
              <p className="text-muted-foreground mb-4">
                The core of Meowdoro is its Pomodoro timer - a technique designed to enhance focus and productivity through structured work sessions and breaks.
              </p>
              
              <div className="space-y-3 ml-1">
                <h4 className="font-semibold text-base">How it works:</h4>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li><strong>Focus Session:</strong> Default 25 minutes of concentrated work</li>
                  <li><strong>Short Break:</strong> Default 5 minutes to rest briefly</li>
                  <li><strong>Long Break:</strong> Default 15 minutes after completing several focus sessions</li>
                  <li><strong>Cycle Repetition:</strong> Continue the pattern to maintain productivity</li>
                </ol>
                
                <h4 className="font-semibold text-base mt-3">Timer Features:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Fully customizable session durations</li>
                  <li>Visual progress tracking</li>
                  <li>Audio notifications for session completion</li>
                  <li>Custom sounds including YouTube audio integration</li>
                  <li>Interactive cat companion providing study tips</li>
                  <li>Skip option to move between sessions</li>
                </ul>
              </div>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <ListTodo className="h-5 w-5 text-primary" />
                Task Management
              </h3>
              <p className="text-muted-foreground mb-4">
                Keep track of your tasks and notes using our minimalist Google Keep-inspired interface.
              </p>
              
              <div className="space-y-3 ml-1">
                <h4 className="font-semibold text-base">Features:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Simple Note Creation:</strong> Quick and distraction-free input</li>
                  <li><strong>Organization:</strong> Color coding and pinning options</li>
                  <li><strong>Responsive Layout:</strong> Works on all device sizes</li>
                  <li><strong>Persistent Storage:</strong> Notes saved to browser storage</li>
                  <li><strong>Search:</strong> Find notes quickly</li>
                </ul>
                
                <h4 className="font-semibold text-base mt-3">Task Types:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Text notes for quick thoughts and ideas</li>
                  <li>Checklists for actionable tasks</li>
                </ul>
              </div>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Study Party
              </h3>
              <p className="text-muted-foreground mb-4">
                Study together virtually with friends to increase accountability and motivation.
              </p>
              
              <div className="space-y-3 ml-1">
                <h4 className="font-semibold text-base">How it works:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Create or Join:</strong> Host or enter existing study rooms</li>
                  <li><strong>Live Status:</strong> See who's focusing and who's on a break</li>
                  <li><strong>Cat Avatars:</strong> Unique virtual representations for each participant</li>
                  <li><strong>Shared Goals:</strong> Set group study targets</li>
                </ul>
                
                <h4 className="font-semibold text-base mt-3">Benefits:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Increased accountability</li>
                  <li>Reduced procrastination</li>
                  <li>Social motivation without distraction</li>
                  <li>Friendly competition to improve focus time</li>
                </ul>
              </div>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Statistics & Analytics
              </h3>
              <p className="text-muted-foreground mb-4">
                Track your productivity metrics over time to identify patterns and improve your work habits.
              </p>
              
              <div className="space-y-3 ml-1">
                <h4 className="font-semibold text-base">Available Stats:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Daily Focus Time:</strong> Total minutes spent focusing</li>
                  <li><strong>Weekly Overview:</strong> Visual representation of productivity patterns</li>
                  <li><strong>Session Counts:</strong> Number of completed focus sessions</li>
                  <li><strong>Streak Tracking:</strong> Consecutive days of meeting goals</li>
                  <li><strong>Comparison Tools:</strong> Measure against previous performance</li>
                </ul>
                
                <h4 className="font-semibold text-base mt-3">Using Analytics:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Identify your most productive hours</li>
                  <li>Recognize patterns in focus session quality</li>
                  <li>Set improvement goals based on data</li>
                  <li>Celebrate productivity streaks</li>
                </ul>
              </div>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Cat className="h-5 w-5 text-primary" />
                Cat Companion
              </h3>
              <p className="text-muted-foreground mb-4">
                Your virtual study buddy changes moods to match your work state and offers study tips.
              </p>
              
              <div className="space-y-3 ml-1">
                <h4 className="font-semibold text-base">Cat States:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Focused:</strong> When you're in a focus session</li>
                  <li><strong>Happy:</strong> During a well-deserved break</li>
                  <li><strong>Sleeping:</strong> When the timer is paused</li>
                  <li><strong>Idle:</strong> Default state when not in a session</li>
                </ul>
                
                <h4 className="font-semibold text-base mt-3">Study Tips:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Access over 100 curated productivity and study tips</li>
                  <li>Click the cat to get random advice</li>
                  <li>Tips based on proven learning and productivity techniques</li>
                </ul>
              </div>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Customization Options
              </h3>
              <p className="text-muted-foreground mb-4">
                Personalize your Meowdoro experience to match your preferences and work style.
              </p>
              
              <div className="space-y-3 ml-1">
                <h4 className="font-semibold text-base">Appearance:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Theme Colors:</strong> Multiple accent colors to choose from</li>
                  <li><strong>Dark/Light Mode:</strong> Switch based on lighting or preference</li>
                  <li><strong>Transparency Effects:</strong> Optional glass-like UI elements</li>
                </ul>
                
                <h4 className="font-semibold text-base mt-3">Timer Settings:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Adjust focus duration (5-90 minutes)</li>
                  <li>Customize short breaks (1-30 minutes)</li>
                  <li>Set long break intervals (10-60 minutes)</li>
                  <li>Define sessions before a long break (1-8)</li>
                  <li>Custom notification sounds</li>
                  <li>YouTube audio integration</li>
                </ul>
              </div>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Getting Started Guide
              </h3>
              <p className="text-muted-foreground mb-4">
                Follow these steps to begin your productive journey with Meowdoro:
              </p>
              
              <div className="space-y-3 ml-1">
                <ol className="list-decimal list-inside space-y-3 ml-2">
                  <li>
                    <strong>Create an account</strong> 
                    <p className="text-sm text-muted-foreground ml-6 mt-1">This allows you to save your settings and statistics across devices.</p>
                  </li>
                  <li>
                    <strong>Set up your timer preferences</strong>
                    <p className="text-sm text-muted-foreground ml-6 mt-1">Adjust focus and break durations to match your work style.</p>
                  </li>
                  <li>
                    <strong>Create a task list</strong>
                    <p className="text-sm text-muted-foreground ml-6 mt-1">Plan what you'll work on during your focus sessions.</p>
                  </li>
                  <li>
                    <strong>Choose your notification sounds</strong>
                    <p className="text-sm text-muted-foreground ml-6 mt-1">Select audio that works best for your environment.</p>
                  </li>
                  <li>
                    <strong>Start your first focus session</strong>
                    <p className="text-sm text-muted-foreground ml-6 mt-1">Press the play button and begin focusing on your task.</p>
                  </li>
                </ol>
                
                <h4 className="font-semibold text-base mt-4">Productivity Tips:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Start with one task per focus session for maximum effectiveness</li>
                  <li>Take your breaks seriously - step away from your screen</li>
                  <li>Review your statistics weekly to identify improvement areas</li>
                  <li>Use the cat companion's tips for fresh productivity ideas</li>
                  <li>Consider joining a study party for accountability</li>
                </ul>
              </div>
            </section>
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
