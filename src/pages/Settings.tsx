
import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/layout/ThemeProvider";
import { useToast } from "@/hooks/use-toast";
import { Image, Upload, Trash, Check } from "lucide-react";

const Settings: React.FC = () => {
  const { toast } = useToast();
  const { theme, setTheme, mode, setMode, transparency, setTransparency } = useTheme();
  const [selectedBackground, setSelectedBackground] = useState(() => {
    return localStorage.getItem("meowdoro-background") || "none";
  });
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState(() => {
    return localStorage.getItem("meowdoro-custom-background-url") || "";
  });
  const [backgroundOpacity, setBackgroundOpacity] = useState(() => {
    return Number(localStorage.getItem("meowdoro-background-opacity") || "1");
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Background options
  const backgroundOptions = [
    { value: 'none', label: 'None', preview: ''},
    { value: 'gradient-1', label: 'Blue Gradient', preview: 'bg-gradient-to-r from-blue-500/20 to-purple-500/20'},
    { value: 'gradient-2', label: 'Green Gradient', preview: 'bg-gradient-to-r from-green-500/20 to-teal-500/20'},
    { value: 'gradient-3', label: 'Pink Gradient', preview: 'bg-gradient-to-r from-pink-500/20 to-orange-500/20'},
    { value: 'pattern-1', label: 'Dots', preview: 'bg-gray-100 dark:bg-gray-800 bg-[radial-gradient(circle,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]'},
    { value: 'pattern-2', label: 'Grid', preview: 'bg-gray-100 dark:bg-gray-800 bg-[linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]'},
    { value: 'custom', label: 'Custom Image', preview: customBackgroundUrl ? `bg-[url('${customBackgroundUrl}')] bg-cover bg-center` : 'bg-gray-200 dark:bg-gray-700'},
  ];
  
  const saveSettings = () => {
    // Save background settings
    localStorage.setItem("meowdoro-background", selectedBackground);
    localStorage.setItem("meowdoro-background-opacity", backgroundOpacity.toString());
    
    // Clear any existing backgrounds first
    document.body.style.backgroundImage = '';
    document.body.style.backgroundSize = '';
    document.body.style.backgroundPosition = '';
    document.body.style.backgroundAttachment = '';
    document.body.className = document.body.className
      .replace(/bg-\S+/g, '')
      .replace(/opacity-\S+/g, '');
    
    if (selectedBackground === 'custom' && customBackgroundUrl) {
      localStorage.setItem("meowdoro-custom-background-url", customBackgroundUrl);
      
      // Apply background to body with opacity
      document.body.style.backgroundImage = `url('${customBackgroundUrl}')`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.backgroundBlendMode = 'overlay';
      document.body.style.opacity = backgroundOpacity.toString();
    } else if (selectedBackground === 'none') {
      // Already cleared above
    } else {
      // Apply preset background
      const option = backgroundOptions.find(opt => opt.value === selectedBackground);
      if (option) {
        const classes = option.preview.split(' ');
        classes.forEach(cls => {
          if (cls.trim()) document.body.classList.add(cls.trim());
        });
      }
    }
    
    // Notify user
    toast({
      title: "Settings saved!",
      description: "Your changes have been applied."
    });
  };
  
  const resetSettings = () => {
    // Reset background settings
    setSelectedBackground('none');
    setCustomBackgroundUrl('');
    setBackgroundOpacity(1);
    
    // Remove background
    document.body.style.backgroundImage = '';
    document.body.style.backgroundSize = '';
    document.body.style.backgroundPosition = '';
    document.body.style.backgroundAttachment = '';
    document.body.style.backgroundBlendMode = '';
    document.body.className = document.body.className
      .replace(/bg-\S+/g, '')
      .replace(/opacity-\S+/g, '');
    
    // Clear localStorage
    localStorage.removeItem("meowdoro-background");
    localStorage.removeItem("meowdoro-custom-background-url");
    localStorage.removeItem("meowdoro-background-opacity");
    
    // Notify user
    toast({
      title: "Settings reset",
      description: "All settings have been reverted to default values."
    });
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
      const dataUrl = event.target?.result as string;
      setCustomBackgroundUrl(dataUrl);
      setSelectedBackground('custom');
    };
    reader.readAsDataURL(file);
  };
  
  // Theme color options
  const themeOptions = [
    { value: 'cyan', color: 'bg-[hsl(195,75%,65%)]', name: 'Cyan' },
    { value: 'green', color: 'bg-[hsl(145,75%,60%)]', name: 'Green' },
    { value: 'yellow', color: 'bg-[hsl(45,75%,65%)]', name: 'Yellow' },
    { value: 'lavender', color: 'bg-[hsl(270,75%,75%)]', name: 'Lavender' },
    { value: 'peach', color: 'bg-[hsl(25,75%,70%)]', name: 'Peach' },
    { value: 'mint', color: 'bg-[hsl(165,75%,65%)]', name: 'Mint' },
    { value: 'rose', color: 'bg-[hsl(355,75%,70%)]', name: 'Rose' }
  ];
  
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
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {themeOptions.map(option => (
                  <div 
                    key={option.value}
                    className={`flex flex-col items-center gap-2 p-3 cursor-pointer rounded-lg border-2 transition-all ${theme === option.value ? 'border-primary' : 'border-transparent hover:border-primary/30'}`}
                    onClick={() => setTheme(option.value as any)}
                  >
                    <div className={`w-12 h-12 rounded-full ${option.color}`}></div>
                    <span className="text-sm">{option.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-base mb-2 block">Mode</Label>
              <div className="flex gap-4">
                <div 
                  className={`flex-1 flex flex-col items-center gap-2 p-3 cursor-pointer rounded-lg border-2 transition-all ${mode === 'light' ? 'border-primary' : 'border-transparent hover:border-primary/30'}`}
                  onClick={() => setMode('light')}
                >
                  <div className="w-12 h-12 rounded-full bg-[#f8f9fa] border"></div>
                  <span className="text-sm">Light</span>
                </div>
                <div 
                  className={`flex-1 flex flex-col items-center gap-2 p-3 cursor-pointer rounded-lg border-2 transition-all ${mode === 'dark' ? 'border-primary' : 'border-transparent hover:border-primary/30'}`}
                  onClick={() => setMode('dark')}
                >
                  <div className="w-12 h-12 rounded-full bg-[#212529]"></div>
                  <span className="text-sm">Dark</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="transparency-toggle" className="text-base">UI Transparency</Label>
                <p className="text-sm text-muted-foreground">
                  Enable transparency effects (lighter on system resources when disabled)
                </p>
              </div>
              <Switch
                id="transparency-toggle"
                checked={transparency}
                onCheckedChange={setTransparency}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Background Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Background</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {backgroundOptions.map(option => (
                <div 
                  key={option.value}
                  className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all h-24 ${
                    selectedBackground === option.value ? 'border-primary' : 'border-transparent hover:border-primary/30'
                  }`}
                  onClick={() => setSelectedBackground(option.value)}
                >
                  {/* Background preview */}
                  <div className={`absolute inset-0 ${option.preview}`}>
                    {option.value === 'custom' && !customBackgroundUrl && (
                      <div className="flex items-center justify-center h-full">
                        <Image className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  {/* Selected indicator */}
                  {selectedBackground === option.value && (
                    <div className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  
                  {/* Label */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                    {option.label}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Custom image upload */}
            {selectedBackground === 'custom' && (
              <div className="space-y-4">
                <Label className="text-base mb-2 block">Custom Background Image</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="text"
                    placeholder="Image URL"
                    value={customBackgroundUrl}
                    onChange={(e) => setCustomBackgroundUrl(e.target.value)}
                    className="flex-grow"
                  />
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="hidden sm:inline">Upload</span>
                  </Button>
                  {customBackgroundUrl && (
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setCustomBackgroundUrl('')}
                      className="text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
                
                <div>
                  <Label className="text-base mb-2 block">Background Opacity</Label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="range"
                      min="0.3"
                      max="1"
                      step="0.05"
                      value={backgroundOpacity}
                      onChange={(e) => setBackgroundOpacity(parseFloat(e.target.value))}
                      className="flex-grow" 
                    />
                    <span className="w-10 text-center">{Math.round(backgroundOpacity * 100)}%</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Upload an image or enter a URL. Images should be less than 5MB.
                </p>
              </div>
            )}
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
