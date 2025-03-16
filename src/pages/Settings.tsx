
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RadioGroup,
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { useTheme } from "@/components/layout/ThemeProvider";
import { useToast } from "@/hooks/use-toast";

const Settings: React.FC = () => {
  const { toast } = useToast();
  const { theme, setTheme, mode, setMode } = useTheme();
  
  // Timer settings
  const [focusMinutes, setFocusMinutes] = useState(() => {
    return localStorage.getItem("meowdoro-focus-length") || "25";
  });
  const [breakMinutes, setBreakMinutes] = useState(() => {
    return localStorage.getItem("meowdoro-break-length") || "5";
  });
  const [longBreakMinutes, setLongBreakMinutes] = useState(() => {
    return localStorage.getItem("meowdoro-long-break-length") || "15";
  });
  
  // Goal settings
  const [firstGoal, setFirstGoal] = useState(() => {
    return localStorage.getItem("meowdoro-first-goal") || "30";
  });
  const [secondGoal, setSecondGoal] = useState(() => {
    return localStorage.getItem("meowdoro-second-goal") || "60";
  });
  const [thirdGoal, setThirdGoal] = useState(() => {
    return localStorage.getItem("meowdoro-third-goal") || "90";
  });
  
  const saveSettings = () => {
    // Save timer settings
    localStorage.setItem("meowdoro-focus-length", focusMinutes);
    localStorage.setItem("meowdoro-break-length", breakMinutes);
    localStorage.setItem("meowdoro-long-break-length", longBreakMinutes);
    
    // Save goal settings
    localStorage.setItem("meowdoro-first-goal", firstGoal);
    localStorage.setItem("meowdoro-second-goal", secondGoal);
    localStorage.setItem("meowdoro-third-goal", thirdGoal);
    
    // Notify user
    toast({
      title: "Settings saved!",
      description: "Your changes have been applied."
    });
  };
  
  const resetSettings = () => {
    // Reset timer settings
    setFocusMinutes("25");
    setBreakMinutes("5");
    setLongBreakMinutes("15");
    
    // Reset goal settings
    setFirstGoal("30");
    setSecondGoal("60");
    setThirdGoal("90");
    
    // Save to localStorage
    localStorage.setItem("meowdoro-focus-length", "25");
    localStorage.setItem("meowdoro-break-length", "5");
    localStorage.setItem("meowdoro-long-break-length", "15");
    localStorage.setItem("meowdoro-first-goal", "30");
    localStorage.setItem("meowdoro-second-goal", "60");
    localStorage.setItem("meowdoro-third-goal", "90");
    
    // Notify user
    toast({
      title: "Settings reset",
      description: "All settings have been reverted to default values."
    });
  };
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 page-transition">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid gap-6">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Theme</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-base mb-2 block">Color Theme</Label>
              <RadioGroup 
                value={theme} 
                onValueChange={(value) => setTheme(value as any)}
                className="flex flex-wrap gap-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cyan" id="cyan" />
                  <Label htmlFor="cyan" className="cursor-pointer">Cyan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="green" id="green" />
                  <Label htmlFor="green" className="cursor-pointer">Green</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yellow" id="yellow" />
                  <Label htmlFor="yellow" className="cursor-pointer">Yellow</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label className="text-base mb-2 block">Mode</Label>
              <RadioGroup 
                value={mode} 
                onValueChange={(value) => setMode(value as any)}
                className="flex flex-wrap gap-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="cursor-pointer">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="cursor-pointer">Dark</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
        
        {/* Timer Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Timer</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="focusMinutes">Focus Length (minutes)</Label>
                <Input
                  id="focusMinutes"
                  type="number"
                  min="1"
                  max="120"
                  value={focusMinutes}
                  onChange={(e) => setFocusMinutes(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="breakMinutes">Short Break (minutes)</Label>
                <Input
                  id="breakMinutes"
                  type="number"
                  min="1"
                  max="30"
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="longBreakMinutes">Long Break (minutes)</Label>
                <Input
                  id="longBreakMinutes"
                  type="number"
                  min="5"
                  max="60"
                  value={longBreakMinutes}
                  onChange={(e) => setLongBreakMinutes(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Goals Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Daily Goals</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="firstGoal">First Star (minutes)</Label>
                <Input
                  id="firstGoal"
                  type="number"
                  min="1"
                  max="200"
                  value={firstGoal}
                  onChange={(e) => setFirstGoal(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="secondGoal">Second Star (minutes)</Label>
                <Input
                  id="secondGoal"
                  type="number"
                  min="1"
                  max="300"
                  value={secondGoal}
                  onChange={(e) => setSecondGoal(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="thirdGoal">Third Star (minutes)</Label>
                <Input
                  id="thirdGoal"
                  type="number"
                  min="1"
                  max="500"
                  value={thirdGoal}
                  onChange={(e) => setThirdGoal(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <Button 
            variant="destructive" 
            onClick={resetSettings}
          >
            Reset to Default
          </Button>
          <Button onClick={saveSettings}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
