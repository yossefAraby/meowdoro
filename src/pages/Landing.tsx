import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  ListTodo,
  Users,
  BookOpen,
  Cat,
  Sparkles,
  Heart,
  Coffee,
  ArrowRight,
  Download,
  Smartphone,
  Laptop,
  ExternalLink
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PricingDialog } from "@/components/pricing/PricingDialog";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [showLearnMoreDialog, setShowLearnMoreDialog] = useState(false);
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const { toast } = useToast();
  
  const handleJoinUs = () => {
    // Set a dummy user in localStorage to simulate login
    localStorage.setItem("meowdoro-user", JSON.stringify({ id: "user-1", name: "Guest" }));
    
    // Dispatch custom event to notify about auth change
    window.dispatchEvent(new Event('auth-change'));
    
    // Navigate to the timer page
    navigate("/timer");
    
    toast({
      title: "Welcome to Meowdoro!",
      description: "You've joined as a guest. Your progress won't be saved between sessions."
    });
  };
  
  const handleDownloadApk = () => {
    toast({
      title: "Download Started",
      description: "Your Meowdoro APK download will begin shortly."
    });
    
    // Use the real APK download link
    window.location.href = "https://drive.google.com/uc?export=download&id=1xvm8vnooJHohNbHQBP_qGyZuYXxhgbP_";
  };

  const handleGetStarted = () => {
    // This will trigger the auth dialog to open
    const authTrigger = document.querySelector('[data-auth-trigger="true"]');
    if (authTrigger instanceof HTMLElement) {
      authTrigger.click();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section with better light/dark mode support */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Background with better light/dark mode compatibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-background dark:from-primary/5 dark:via-background/80 dark:to-background"></div>
        
        {/* Decorative elements with better visibility in light mode */}
        <div className="absolute inset-0 overflow-hidden opacity-30 dark:opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary/30 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/30 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container max-w-screen-xl mx-auto px-4 relative z-10 py-16">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Left content - Text and CTA */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div className="inline-block mb-4">
                <span className="inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-full bg-primary/20 text-primary border border-primary/20 shadow-sm">
                  <Cat className="w-4 h-4 mr-2" />
                  Focus better with a feline friend
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Stay focused with
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-primary/80 font-extrabold">Meowdoro</span>
              </h1>
              
              <p className="text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 text-foreground/90 dark:text-muted-foreground">
                A purr-fectly delightful cat-themed productivity app that helps you maintain focus and accomplish more.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
                <Button 
                  onClick={handleGetStarted}
                  size="lg" 
                  className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full px-8 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary backdrop-blur-sm"
                  onClick={() => setShowLearnMoreDialog(true)}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Learn More
                </Button>
              </div>
              
              <div className="mt-4 sm:mt-4">
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="rounded-full px-8 text-primary hover:bg-primary/10"
                  onClick={() => setShowPricingDialog(true)}
                >
                  <ArrowRight className="mr-2 h-4 w-4 fill-current" />
                  See plans and pricing
                </Button>
              </div>
            </div>
            
            {/* Right content - Enhanced Meowdoro Logo */}
            <div className="flex-1 flex justify-center items-center">
              <div className="relative group">
                {/* Multiple glow layers with different animations and better light mode visibility */}
                <div className="absolute inset-0 bg-primary/40 dark:bg-primary/30 rounded-full blur-3xl animate-pulse-soft"></div>
                <div className="absolute inset-0 bg-primary/30 dark:bg-primary/20 rounded-full blur-2xl animate-pulse-soft" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute inset-0 bg-primary/20 dark:bg-primary/10 rounded-full blur-xl animate-pulse-soft" style={{ animationDelay: '0.6s' }}></div>
                
                {/* Logo image with hover animation */}
                <img 
                  src="/lovable-uploads/6c3148ec-dc2e-4a2b-a5b6-482ca6e3b664.png" 
                  alt="Meowdoro Logo" 
                  className="w-56 h-56 md:w-72 md:h-72 relative z-10 transition-all duration-500 
                  group-hover:scale-110 group-hover:rotate-3 cursor-pointer drop-shadow-lg"
                  onClick={() => navigate('/timer')}
                />
                
                {/* Shimmer effect on hover with better light mode visibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 dark:via-primary/20 to-transparent 
                  z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer" 
                  style={{ backgroundSize: '200% 100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section with improved light mode visibility */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute inset-0 bg-grid"></div>
        </div>
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold inline-block relative">
              Purr-sonal Productivity Tools
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/60 dark:bg-primary/50 rounded-full"></span>
            </h2>
            <p className="text-foreground/80 dark:text-muted-foreground max-w-2xl mx-auto mt-4">
              Tools designed to boost your productivity with a touch of feline charm
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/60 dark:bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Pomodoro Timer</h3>
                <p className="text-foreground/70 dark:text-muted-foreground">
                  Customizable focus sessions with smart breaks to maximize productivity
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/60 dark:bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                  <ListTodo className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Task Management</h3>
                <p className="text-foreground/70 dark:text-muted-foreground">
                  Organize your tasks and notes with our minimalist interface
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/60 dark:bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Study Party</h3>
                <p className="text-foreground/70 dark:text-muted-foreground">
                  Join virtual study sessions with friends to stay motivated together
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Download Options Section - replacing login/signup section */}
      <section className="py-20 bg-gradient-to-br from-background to-accent/10 dark:to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute inset-0 bg-dots"></div>
        </div>
        
        {/* Cat Logo with Enhanced Animation and Glow */}
        <div className="relative max-w-xs mx-auto mb-12">
          <div className="absolute inset-0 bg-primary/30 dark:bg-primary/20 rounded-full blur-xl animate-pulse-soft"></div>
          <div className="absolute inset-0 bg-primary/20 dark:bg-primary/10 rounded-full blur-lg animate-pulse-soft" style={{ animationDelay: '0.5s' }}></div>
          <img 
            src="/lovable-uploads/6c3148ec-dc2e-4a2b-a5b6-482ca6e3b664.png" 
            alt="Meowdoro Logo" 
            className="w-32 h-32 mx-auto relative z-10 animate-float drop-shadow-lg" 
          />
        </div>
        
        <div className="container max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6">Access Meowdoro Anywhere</h2>
          <p className="text-foreground/80 dark:text-muted-foreground max-w-2xl mx-auto mb-10">
            Choose how you want to use Meowdoro - download our Android app or use the online version on any device
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Android App Option */}
            <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-primary/20 rounded-lg p-6 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Android App</h3>
              <p className="text-foreground/70 dark:text-muted-foreground mb-6">
                Download the APK file directly to your Android device for the best mobile experience with offline support
              </p>
              <Button
                onClick={handleDownloadApk}
                className="w-full flex items-center justify-center gap-2"
              >
                <Download className="h-5 w-5" />
                Download APK
              </Button>
            </div>
            
            {/* Online App Option */}
            <div className="bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-primary/20 rounded-lg p-6 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center">
                  <Laptop className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Web App</h3>
              <p className="text-foreground/70 dark:text-muted-foreground mb-6">
                Use Meowdoro directly in your browser on any device without installation, perfect for desktop and quick access
              </p>
              <Button
                onClick={handleGetStarted}
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <ExternalLink className="h-5 w-5" />
                Use Online
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Learn More dialog with updated content */}
      <Dialog open={showLearnMoreDialog} onOpenChange={setShowLearnMoreDialog}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Learn More
            </DialogTitle>
            <DialogDescription>
              Quick guide to getting the most out of Meowdoro
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 my-4 pr-2">
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
                Getting Started
              </h3>
              <p className="text-muted-foreground mb-4">
                Meowdoro helps you focus using the Pomodoro technique - alternating between focused work sessions and refreshing breaks.
              </p>
              
              <div className="space-y-3 bg-card p-4 rounded-lg">
                <h4 className="font-semibold text-base">Quick Start Guide:</h4>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li><strong>Create an account</strong> or join as a guest to get started</li>
                  <li><strong>Timer Page:</strong> Use the focus timer with customizable durations</li>
                  <li><strong>Tasks Page:</strong> Create and organize notes for your work</li>
                  <li><strong>Party Page:</strong> Study with friends in virtual sessions</li>
                </ol>
              </div>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Using the Timer
              </h3>
              <div className="space-y-3 bg-card p-4 rounded-lg">
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Focus Session:</strong> Default 25 minutes of concentrated work</li>
                  <li><strong>Short Break:</strong> Default 5 minutes to rest</li>
                  <li><strong>Long Break:</strong> Default 15 minutes after completing several focus sessions</li>
                  <li><strong>Controls:</strong> Play/pause, skip to next session, and adjust settings</li>
                  <li><strong>Cat Companion:</strong> Click on the cat for study tips and motivation</li>
                </ul>
              </div>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <ListTodo className="h-5 w-5 text-primary" />
                Task Management
              </h3>
              <div className="space-y-3 bg-card p-4 rounded-lg">
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Create Notes:</strong> Add titles and content for your tasks</li>
                  <li><strong>Organization:</strong> Pin important notes to the top</li>
                  <li><strong>Color Coding:</strong> Use different colors to categorize your notes</li>
                  <li><strong>Search:</strong> Quickly find notes with the search function</li>
                </ul>
              </div>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Study Party
              </h3>
              <div className="space-y-3 bg-card p-4 rounded-lg">
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Join Together:</strong> Create or join virtual study rooms</li>
                  <li><strong>Stay Motivated:</strong> See when friends are focusing or taking breaks</li>
                  <li><strong>Accountability:</strong> Increase productivity through group study</li>
                  <li><strong>Cat Avatars:</strong> Each user gets a unique cat representation</li>
                </ul>
              </div>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Coffee className="h-5 w-5 text-primary" />
                Productivity Tips
              </h3>
              <div className="space-y-3 bg-card p-4 rounded-lg">
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>One Task at a Time:</strong> Focus on a single task during each session</li>
                  <li><strong>Take Real Breaks:</strong> Step away from the screen during break time</li>
                  <li><strong>Set Daily Goals:</strong> Aim for 4-8 completed focus sessions per day</li>
                  <li><strong>Minimize Distractions:</strong> Close unnecessary tabs and silence notifications</li>
                  <li><strong>Hydrate:</strong> Keep water nearby during your study sessions</li>
                </ul>
              </div>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Cat className="h-5 w-5 text-primary" />
                Cat Companion
              </h3>
              <div className="space-y-3 bg-card p-4 rounded-lg">
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Interactive Friend:</strong> Your virtual cat changes mood based on timer state</li>
                  <li><strong>Study Tips:</strong> Click on the cat for helpful productivity advice</li>
                  <li><strong>Mood States:</strong> The cat appears focused during work, happy during breaks, and sleepy when paused</li>
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
      
      {/* Pricing Dialog */}
      <PricingDialog 
        open={showPricingDialog} 
        onClose={() => setShowPricingDialog(false)} 
      />
    </div>
  );
};

export default Landing;
