
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
  ArrowRight,
  Heart,
  Coffee,
  Sparkles,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero section */}
      <section className="relative pt-24 pb-16 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none"></div>
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-card/60 backdrop-blur-sm px-4 py-2 rounded-full border text-sm">
                <Cat className="h-4 w-4 text-primary" />
                <span className="text-foreground/80">Focus better with a feline friend</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Stay focused with <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Meowdoro</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg">
                A purr-fectly delightful cat-themed productivity app that helps you maintain focus and accomplish more.
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button 
                  size="lg" 
                  className="group rounded-full px-8 relative overflow-hidden"
                  onClick={handleGetStarted}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-full px-8 flex items-center gap-2 border-primary/20 hover:border-primary/50 transition-colors"
                  onClick={() => setShowDocsDialog(true)}
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Documentation</span>
                </Button>
              </div>
            </div>
            
            <div className="relative mx-auto md:ml-auto w-full max-w-md">
              <div className="relative aspect-square w-full">
                <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-primary/10 rounded-2xl blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-primary/10 rounded-2xl blur-3xl"></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                    <Card className="bg-card/80 backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6 flex items-center justify-center">
                        <Clock className="h-10 w-10 text-primary" />
                      </CardContent>
                    </Card>
                    <Card className="bg-card/80 backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6 flex items-center justify-center">
                        <ListTodo className="h-10 w-10 text-primary" />
                      </CardContent>
                    </Card>
                    <Card className="bg-card/80 backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6 flex items-center justify-center">
                        <Users className="h-10 w-10 text-primary" />
                      </CardContent>
                    </Card>
                    <Card className="bg-card/80 backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6 flex items-center justify-center">
                        <Cat className="h-10 w-10 text-primary" />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-grid"></div>
        </div>
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold inline-block relative">
              Purr-sonal Productivity Tools
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/50 rounded-full"></span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
              Tools designed to boost your productivity with a touch of feline charm
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Pomodoro Timer</h3>
                <p className="text-muted-foreground">
                  Customizable focus sessions with smart breaks to maximize productivity
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ListTodo className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Task Management</h3>
                <p className="text-muted-foreground">
                  Organize your tasks and notes with our minimalist interface
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Study Party</h3>
                <p className="text-muted-foreground">
                  Join virtual study sessions with friends to stay motivated together
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Stats Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor your progress with visual statistics and insights
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-20 bg-gradient-to-br from-background to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-dots"></div>
        </div>
        <div className="container max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-block mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
            <Cat className="h-16 w-16 text-primary relative z-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Ready to boost your productivity?</h2>
          <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
            Experience focus like never before with your new feline productivity companion.
          </p>
          <Button 
            size="lg" 
            className="rounded-full px-8 py-6 text-lg group"
            onClick={handleGetStarted}
          >
            <span className="flex items-center gap-2">
              Start Your Purr-ductivity Journey
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
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
          
          <div className="space-y-8 my-4 pr-2">
            <div className="flex justify-between items-center">
              <a 
                href="https://drive.google.com/file/d/1c9SgZpXhoq9T3qp5Mg4Ab-X3ipe5HjQ_/view?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <Button variant="outline" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Project Overview PDF
                </Button>
              </a>
            </div>
            
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
                Purr-sonalized Features
              </h3>
              <p className="text-muted-foreground mb-4">
                Features designed to make your productivity experience uniquely yours.
              </p>
              
              <div className="space-y-3 ml-1">
                <h4 className="font-semibold text-base">Customize Your Experience:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Cat Personalities:</strong> Choose a cat companion that matches your vibe</li>
                  <li><strong>Focus Themes:</strong> Select color schemes that help you concentrate</li>
                  <li><strong>Custom Timer Settings:</strong> Tailor session lengths to your personal workflow</li>
                  <li><strong>Notification Styles:</strong> Pick sounds that motivate without disrupting</li>
                </ul>
              </div>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Self-Care Reminders
              </h3>
              <p className="text-muted-foreground mb-4">
                Because productivity is as much about rest as it is about work.
              </p>
              
              <div className="space-y-3 ml-1">
                <h4 className="font-semibold text-base">Healthy Habits:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Stretching Prompts:</strong> Gentle reminders to move during breaks</li>
                  <li><strong>Hydration Nudges:</strong> Your cat companion will remind you to drink water</li>
                  <li><strong>Eye Rest Tips:</strong> Suggestions to reduce eye strain during screen time</li>
                  <li><strong>Mindfulness Moments:</strong> Brief breathing exercises between sessions</li>
                </ul>
              </div>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Coffee className="h-5 w-5 text-primary" />
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
