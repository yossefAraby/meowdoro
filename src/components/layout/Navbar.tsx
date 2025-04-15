
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Timer, 
  CheckSquare, 
  Users, 
  Sun, 
  Moon, 
  Menu,
  BookOpen,
  Cat,
  LogIn,
  UserPlus,
  Smartphone,
  Globe
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, setMode } = useTheme();
  const { toast } = useToast();
  
  // Authentication state and form fields
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(
    localStorage.getItem("meowdoro-user") !== null
  );
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  // Effect to check authentication status on mount and when localStorage changes
  React.useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("meowdoro-user");
      setIsAuthenticated(user !== null);
    };
    
    // Check initially
    checkAuth();
    
    // Setup event listener for storage changes
    window.addEventListener('storage', checkAuth);
    
    // Custom event for auth changes within the same window
    window.addEventListener('auth-change', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);
  
  const navItems = [
    { path: "/timer", icon: Timer, label: "Timer" },
    { path: "/tasks", icon: CheckSquare, label: "Tasks" },
    { path: "/party", icon: Users, label: "Party" },
  ];

  const toggleMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  const handleJoinNow = () => {
    // Save user data to localStorage
    localStorage.setItem("meowdoro-user", JSON.stringify({ email: "demo@meowdoro.app" }));
    
    // Notify about authentication change
    window.dispatchEvent(new Event('auth-change'));
    
    // Navigate to timer page
    navigate("/timer");
    
    // Close the dialog if it's open
    setShowAuthDialog(false);
    
    toast({
      title: "Welcome to Meowdoro!",
      description: "You've joined as a guest. Your progress won't be saved between sessions."
    });
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo login functionality
    if (email && password) {
      localStorage.setItem("meowdoro-user", JSON.stringify({ id: "user-1", name: email.split('@')[0], email }));
      
      // Dispatch custom event to notify about auth change
      window.dispatchEvent(new Event('auth-change'));
      
      // Close the dialog
      setShowAuthDialog(false);
      
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
      
      // Dispatch custom event to notify about auth change
      window.dispatchEvent(new Event('auth-change'));
      
      // Close the dialog
      setShowAuthDialog(false);
      
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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 glass animate-fade-in">
      <div className="container mx-auto">
        <nav className="flex justify-between items-center py-4">
          {/* Logo and App Name */}
          <div 
            className="flex items-center gap-2 cursor-pointer transition-all hover:opacity-80"
            onClick={() => navigate("/")}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-[6px]"></div>
              <img 
                src="/lovable-uploads/6c3148ec-dc2e-4a2b-a5b6-482ca6e3b664.png" 
                alt="Meowdoro Logo" 
                className="w-8 h-8 relative z-10"
              />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Meowdoro</span>
          </div>

          {/* Navigation Links - Desktop - Centered */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 space-x-1 sm:space-x-2">
            {isAuthenticated && navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-150",
                  location.pathname === item.path 
                    ? "text-primary bg-accent/50" 
                    : "text-foreground/60 hover:text-primary hover:bg-accent/30"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs mt-1">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Right Side - Mode Toggle & Actions */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleMode} 
              className="p-2 rounded-full hover:bg-accent/50 transition-all duration-150"
              aria-label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {mode === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            {isAuthenticated ? (
              <></>
            ) : (
              <div className="flex gap-2">
                <Link to="/" onClick={() => document.querySelector<HTMLButtonElement>('[data-docs-trigger]')?.click()}>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="hidden sm:inline-flex items-center gap-1"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden md:inline">Learn More</span>
                  </Button>
                </Link>
                
                {/* Auth Dialog Trigger */}
                <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="hidden sm:inline-flex items-center gap-1"
                    >
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <Tabs defaultValue="login" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="login">
                        <form onSubmit={handleLogin} className="space-y-4">
                          <div className="relative">
                            <Input 
                              type="email" 
                              placeholder="Email" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          
                          <div className="relative">
                            <Input 
                              type="password" 
                              placeholder="Password" 
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
                            <Input 
                              type="text" 
                              placeholder="Name" 
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                          
                          <div className="relative">
                            <Input 
                              type="email" 
                              placeholder="Email" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          
                          <div className="relative">
                            <Input 
                              type="password" 
                              placeholder="Password" 
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
                      className="w-full mt-4 bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary hover:text-primary/90"
                      onClick={handleJoinNow}
                    >
                      Join as a guest
                    </Button>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  size="sm" 
                  className="hidden sm:inline-flex items-center gap-1"
                  onClick={handleJoinNow}
                >
                  <Cat className="h-4 w-4" />
                  Get Started
                </Button>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col h-full py-6">
                  <div className="text-xl font-bold mb-6">Meowdoro</div>
                  
                  <div className="space-y-2">
                    {isAuthenticated ? (
                      <>
                        {navItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg transition-all",
                              location.pathname === item.path 
                                ? "bg-accent text-primary" 
                                : "hover:bg-accent/50"
                            )}
                          >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </>
                    ) : (
                      <div className="mt-auto space-y-3">
                        <Link to="/" onClick={() => document.querySelector<HTMLButtonElement>('[data-docs-trigger]')?.click()} className="block w-full">
                          <Button 
                            variant="outline"
                            className="w-full flex items-center gap-2"
                          >
                            <BookOpen className="h-4 w-4" />
                            <span>Learn More</span>
                          </Button>
                        </Link>
                        
                        <Button 
                          variant="outline"
                          className="w-full flex items-center gap-2"
                          onClick={() => {
                            setShowAuthDialog(true);
                            document.querySelector<HTMLButtonElement>('.nj-modal-close')?.click();
                          }}
                        >
                          <LogIn className="h-4 w-4" />
                          <span>Sign In</span>
                        </Button>
                        
                        <Button 
                          className="w-full flex items-center gap-2"
                          onClick={handleJoinNow}
                        >
                          <Cat className="h-4 w-4" />
                          <span>Get Started</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </div>
  );
};
