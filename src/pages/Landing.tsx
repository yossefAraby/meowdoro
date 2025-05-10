import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
  ExternalLink,
  BrainCircuit
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PricingDialog } from "@/components/pricing/PricingDialog";

const InteractiveLogo: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef<number>();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastUpdateRef = useRef<number>(0);
  const THROTTLE_MS = 32; // Reduced to 30fps for better performance

  // Memoized rotation calculations
  const { rotationX, rotationY } = useMemo(() => ({
    rotationX: (0.5 - mousePosition.y) * 50,
    rotationY: (mousePosition.x - 0.5) * 50
  }), [mousePosition.x, mousePosition.y]);

  // Debounced and throttled mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    if (now - lastUpdateRef.current < THROTTLE_MS) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
          const rect = heroSection.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          
          // Only update if mouse is within hero section
          if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
            setMousePosition({ x, y });
            setIsHovered(true);
            lastUpdateRef.current = now;
          } else {
            setIsHovered(false);
          }
        }
      });
    }, 20); // Increased debounce to 20ms
  }, []);

  useEffect(() => {
    const options = { passive: true };
    window.addEventListener('mousemove', handleMouseMove, options);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleMouseMove]);

  // Memoized transform style
  const transformStyle = useMemo(() => ({
    transform: isHovered 
      ? `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`
      : 'rotateY(0deg) rotateX(0deg)',
    transformStyle: 'preserve-3d',
    willChange: 'transform',
    backfaceVisibility: 'hidden',
  }), [isHovered, rotationX, rotationY]);

  return (
    <div 
      className="relative cursor-pointer perspective-1000"
      onClick={onClick}
      style={{ 
        willChange: 'transform',
        transform: 'translate3d(0,0,0)',
        contain: 'layout style paint', // Performance optimization
      }}
    >
      {/* Logo container with 3D transform */}
      <div 
        className="relative z-10 transition-transform duration-300 ease-out"
        style={transformStyle}
      >
        <img 
          src="/lovable-uploads/6c3148ec-dc2e-4a2b-a5b6-482ca6e3b664.png" 
          alt="Meowdoro Logo" 
          className="w-56 h-56 md:w-72 md:h-72 drop-shadow-lg"
          style={{
            transform: 'translateZ(40px)',
            transition: 'transform 0.3s ease-out',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            contain: 'layout style paint', // Performance optimization
          }}
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
};

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
    // Check if user is signed in or guest
    const isGuest = localStorage.getItem("meowdoro-user") !== null;
    const isSignedIn = !!localStorage.getItem("supabase.auth.token"); // or use a better check if available
    if (isGuest || isSignedIn) {
      navigate("/timer");
    } else {
      // This will trigger the auth dialog to open
      const authTrigger = document.querySelector('[data-auth-trigger="true"]');
      if (authTrigger instanceof HTMLElement) {
        authTrigger.click();
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section with better light/dark mode support */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden hero-section">
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
              <InteractiveLogo onClick={() => navigate('/timer')} />
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <BrainCircuit className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">AI Cat Companion</h3>
                <p className="text-foreground/70 dark:text-muted-foreground">
                  Chat with your AI cat friend for study tips, motivation, and productivity advice
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/60 dark:bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Cat Shop</h3>
                <p className="text-foreground/70 dark:text-muted-foreground">
                  Customize your cat companion with unique colors, animations, and special effects
                </p>
              </CardContent>
            </Card>

            <div className="lg:col-span-3 flex justify-center gap-6">
              <Card className="bg-card/60 dark:bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-md hover:-translate-y-1 w-full max-w-md">
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

              <Card className="bg-card/60 dark:bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-md hover:-translate-y-1 w-full max-w-md">
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
                Download our APK file directly to your Android device for the fullscreen mobile experience
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
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Cat className="h-6 w-6 text-primary" />
              About Meowdoro
            </DialogTitle>
            <DialogDescription>
              A delightful productivity app that combines the Pomodoro technique with a friendly cat companion
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-bold mb-3">What is Meowdoro?</h3>
              <p className="text-muted-foreground">
                Meowdoro is a productivity app that helps you stay focused using the Pomodoro technique, enhanced with a friendly cat companion. Work in focused sessions, take breaks, and let your AI cat friend keep you motivated.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3">Implemented Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Focus Timer</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Customizable focus sessions</li>
                    <li>Short and long breaks</li>
                    <li>Daily focus tracking</li>
                    <li>Background sounds</li>
                  </ul>
                </div>

                <div className="bg-card p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">AI Cat Companion</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Chat with your AI cat friend</li>
                    <li>Productivity advice</li>
                    <li>Study tips</li>
                    <li>Notes integration</li>
                  </ul>
                </div>

                <div className="bg-card p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Task Management</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Create notes and checklists</li>
                    <li>Pin important tasks</li>
                    <li>Color coding system</li>
                    <li>Archive and trash feature</li>
                  </ul>
                </div>

                <div className="bg-card p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Cat Shop & Party Mode</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Customize your cat's appearance</li>
                    <li>Create study parties with friends</li>
                    <li>Shared party timer</li>
                    <li>Party task management</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3">Project Resources</h3>
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-between"
                  onClick={() => window.open("https://github.com/yossefAraby/meowdoro", "_blank")}
                >
                  <span className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    GitHub Repository
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-between"
                  onClick={() => window.open("https://drive.google.com/file/d/1DJyIQpF7Uqw6z4upBb_eW_fu-9EgYSte/view?usp=sharing", "_blank")}
                >
                  <span className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Features Overview (PDF)
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-between"
                  onClick={() => window.open("https://drive.google.com/file/d/1c9SgZpXhoq9T3qp5Mg4Ab-X3ipe5HjQ_/view?usp=sharing", "_blank")}
                >
                  <span className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Business Overview (PDF)
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-between"
                  onClick={() => window.open("https://drive.google.com/drive/folders/1PSlfA4CEFicqDzLigzNABTCdHp-F_dfv?usp=sharing", "_blank")}
                >
                  <span className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    User Research & Wireframes
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </section>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Cat className="h-4 w-4" />
              <span>Meowdoro v2.0</span>
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
