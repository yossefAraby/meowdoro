import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  ListTodo,
  Users,
  BarChart,
  BookOpen,
  Mail,
  Lock,
  User,
  Cat,
  Sparkles,
  Heart,
  Coffee,
  ArrowRight
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [showDocsDialog, setShowDocsDialog] = useState(false);
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  
  const handleContinueAsGuest = () => {
    // Set a dummy user in localStorage to simulate login
    localStorage.setItem("meowdoro-user", JSON.stringify({ id: "user-1", name: "Guest" }));
    
    // Navigate to the timer page
    navigate("/timer");
    
    toast({
      title: "Welcome, Guest!",
      description: "You've entered as a guest. Your progress won't be saved between sessions."
    });
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo login functionality
    if (email && password) {
      localStorage.setItem("meowdoro-user", JSON.stringify({ id: "user-1", name: email.split('@')[0], email }));
      navigate("/timer");
      
      toast({
        title: "Successfully logged in",
        description: "Welcome back to Meowdoro!"
      });
    } else {
      toast({
        title: "Login failed",
        description: "Please enter your email and password",
        variant: "destructive"
      });
    }
  };
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo signup functionality
    if (email && password && name) {
      localStorage.setItem("meowdoro-user", JSON.stringify({ id: "user-1", name, email }));
      navigate("/timer");
      
      toast({
        title: "Account created",
        description: "Welcome to Meowdoro!"
      });
    } else {
      toast({
        title: "Signup failed",
        description: "Please fill out all fields",
        variant: "destructive"
      });
    }
  };

  // Feature cards for the interactive hero section
  const featureCards = [
    {
      id: "timer",
      icon: Clock,
      title: "Timer",
      description: "Customizable focus sessions with smart breaks"
    },
    {
      id: "tasks",
      icon: ListTodo,
      title: "Tasks",
      description: "Organize your tasks and notes with our minimalist interface"
    },
    {
      id: "party",
      icon: Users,
      title: "Study Party",
      description: "Join virtual study sessions with friends to stay motivated"
    },
    {
      id: "cat",
      icon: Cat,
      title: "Companion",
      description: "Your virtual cat buddy to keep you company during study sessions"
    }
  ];
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section - Improved Design */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#101828] via-[#151f38] to-background/80"></div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/20 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container max-w-screen-xl mx-auto px-4 md:px-8 relative z-10 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left content - Text and CTA */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div className="inline-block mb-4">
                <span className="inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-full bg-primary/15 text-primary backdrop-blur-sm border border-primary/20">
                  <Cat className="w-4 h-4 mr-2" />
                  Focus better with a feline friend
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Stay focused with
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70 font-extrabold">Meowdoro</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0">
                A purr-fectly delightful cat-themed productivity app that helps you maintain focus and accomplish more.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
                <Button 
                  onClick={handleContinueAsGuest}
                  size="lg" 
                  className="rounded-full px-8 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full px-8 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white backdrop-blur-sm"
                  onClick={() => setShowDocsDialog(true)}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Documentation
                </Button>
              </div>
            </div>
            
            {/* Right content - Feature cards with interactive styling */}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:max-w-none">
                {featureCards.map((feature) => (
                  <div 
                    key={feature.id}
                    className={`
                      group cursor-pointer transition-all duration-300 shadow-lg shadow-black/20
                      bg-[#0F1726] backdrop-blur-md rounded-xl border border-[#1E293B]
                      hover:border-primary/50 hover:bg-[#111D35] p-8 text-center
                      ${activeFeature === feature.id ? 'border-primary/80 scale-105' : ''}
                    `}
                    onMouseEnter={() => setActiveFeature(feature.id)}
                    onMouseLeave={() => setActiveFeature(null)}
                    onClick={() => {
                      if (feature.id === 'timer') navigate('/timer');
                      else if (feature.id === 'tasks') navigate('/tasks');
                      else if (feature.id === 'party') navigate('/party');
                      else toast({
                        title: "Meet your companion",
                        description: "Your virtual cat buddy will keep you company during study sessions."
                      });
                    }}
                  >
                    <div className={`
                      rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4
                      ${activeFeature === feature.id ? 'bg-primary/25 scale-110' : 'bg-primary/10'}
                      transition-all duration-300 ease-in-out group-hover:bg-primary/20
                    `}>
                      <feature.icon 
                        className={`
                          transition-all duration-300
                          ${activeFeature === feature.id ? 'text-primary scale-110' : 'text-[#5EB4EB]'}
                          group-hover:text-primary
                        `} 
                        size={28}
                      />
                    </div>
                    <h3 className="text-gray-200 font-medium text-lg transition-colors duration-300 group-hover:text-primary">
                      {feature.title}
                    </h3>
                    <p className={`
                      mt-2 text-sm transition-all duration-300 max-h-0 opacity-0 overflow-hidden
                      ${activeFeature === feature.id ? 'max-h-20 opacity-100 mt-2' : ''}
                      text-gray-400 group-hover:max-h-20 group-hover:opacity-100
                    `}>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>
      
      {/* Features section with Purr-sonal Productivity Tools */}
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
      
      {/* Login / Signup Section with Enhanced Logo Animation */}
      <section className="py-20 bg-gradient-to-br from-background to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-dots"></div>
        </div>
        
        {/* Cat Logo with Enhanced Animation and Glow */}
        <div className="relative max-w-xs mx-auto mb-12">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-soft"></div>
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-lg animate-pulse-soft" style={{ animationDelay: '0.5s' }}></div>
          <img 
            src="/lovable-uploads/6c3148ec-dc2e-4a2b-a5b6-482ca6e3b664.png" 
            alt="Meowdoro Logo" 
            className="w-32 h-32 mx-auto relative z-10 animate-float" 
            style={{ animation: 'pulse-soft 3s infinite ease-in-out' }}
          />
        </div>
        
        <div className="container max-w-md mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6">Get Started</h2>
          
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-xl">
            <CardContent className="p-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="email" 
                        placeholder="Email" 
                        className="pl-10" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="password" 
                        placeholder="Password" 
                        className="pl-10" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="text" 
                        placeholder="Name" 
                        className="pl-10" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="email" 
                        placeholder="Email" 
                        className="pl-10" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="password" 
                        placeholder="Password" 
                        className="pl-10" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Sign Up
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={handleContinueAsGuest}
              >
                Continue as Guest
              </Button>
            </CardContent>
          </Card>
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
