import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timer, CheckSquare, Users, BarChart, Cat } from "lucide-react";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demonstration purposes, we'll just store a simple user object
    localStorage.setItem("meowdoro-user", JSON.stringify({ email }));
    
    // Navigate to the timer page after "authentication"
    navigate("/timer");
  };

  const handleGetStarted = () => {
    // Set a demo user to allow navigation to protected routes
    localStorage.setItem("meowdoro-user", JSON.stringify({ email: "demo@meowdoro.app" }));
    // Navigate to the timer page
    navigate("/timer");
  };
  
  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-6 py-20 lg:py-32">
        <div className="container max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                <Cat className="w-4 h-4" />
                <span>Focus with feline precision</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Stay focused with your <br />
                <span className="text-primary">purr-sonal</span> productivity companion
              </h1>
              
              <p className="text-lg text-muted-foreground">
                Meowdoro combines the Pomodoro technique with interactive cat companions, 
                task management, and collaborative study sessions to keep you motivated.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="gap-2" onClick={handleGetStarted}>
                  Get Started
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="flex-1 relative animate-float">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="relative glass rounded-3xl overflow-hidden p-6 shadow-soft-lg">
                  <div className="text-5xl font-mono font-bold text-center mb-4">25:00</div>
                  <div className="w-16 h-16 flex items-center justify-center mx-auto rounded-full bg-primary text-primary-foreground">
                    <Cat className="w-10 h-10" />
                  </div>
                  <div className="mt-8 space-y-3">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-primary"></div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Today's Focus</span>
                      <span className="text-sm font-medium">30/60 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-secondary/50 py-20">
        <div className="container max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Features that make studying delightful</h2>
            <p className="text-muted-foreground">
              Meowdoro combines productive focus tools with adorable companions to make studying enjoyable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={Timer} 
              title="Focus Timer" 
              description="Customizable Pomodoro timer with visual progress tracking and gentle alerts."
            />
            <FeatureCard 
              icon={CheckSquare} 
              title="Task Management" 
              description="Organize your tasks and notes in a clean, intuitive interface inspired by Google Keep."
            />
            <FeatureCard 
              icon={Users} 
              title="Study Parties" 
              description="Create or join study groups to stay accountable and motivated together."
            />
            <FeatureCard 
              icon={BarChart} 
              title="Progress Stats" 
              description="Track your focus time, completed tasks, and earned rewards over time."
            />
          </div>
        </div>
      </div>
      
      {/* Authentication Section */}
      <div className="container max-w-md px-6 py-20">
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <form onSubmit={handleAuth}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">Login</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Create a new account to start using Meowdoro</CardDescription>
              </CardHeader>
              <form onSubmit={handleAuth}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="reg-email" className="text-sm font-medium">Email</label>
                    <Input 
                      id="reg-email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="reg-password" className="text-sm font-medium">Password</label>
                    <Input 
                      id="reg-password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      placeholder="••••••••" 
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">Register</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Helper component for features
const FeatureCard: React.FC<{ 
  icon: React.FC<{ className?: string }>, 
  title: string, 
  description: string 
}> = ({ icon: Icon, title, description }) => {
  return (
    <div className="glass p-6 rounded-xl shadow-soft-md transition-all-150 hover:shadow-soft-lg hover:translate-y-[-5px]">
      <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Landing;
