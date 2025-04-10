
import React from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TimerSettingsProps {
  // Timer settings
  focusMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
  dailyGoal: number;
  completionSound: string;
  customYoutubeUrl: string;
  
  // Setter functions
  setFocusMinutes: (value: number) => void;
  setBreakMinutes: (value: number) => void;
  setLongBreakMinutes: (value: number) => void;
  setSessionsBeforeLongBreak: (value: number) => void;
  setDailyGoal: (value: number) => void;
  setCompletionSound: (value: string) => void;
  setCustomYoutubeUrl: (value: string) => void;
  
  // Save settings function
  saveSettings: () => void;
}

export const TimerSettings: React.FC<TimerSettingsProps> = ({
  focusMinutes,
  breakMinutes,
  longBreakMinutes,
  sessionsBeforeLongBreak,
  dailyGoal,
  completionSound,
  customYoutubeUrl,
  setFocusMinutes,
  setBreakMinutes,
  setLongBreakMinutes,
  setSessionsBeforeLongBreak,
  setDailyGoal,
  setCompletionSound,
  setCustomYoutubeUrl,
  saveSettings
}) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Test the custom sound URL
  const testCustomSound = () => {
    if (completionSound) {
      const audio = new Audio(completionSound);
      audio.play().catch(err => {
        toast({
          title: "Sound Test Failed",
          description: "Unable to play this sound URL. Please check the URL and try again.",
          variant: "destructive"
        });
      });
    } else {
      toast({
        title: "No Custom Sound",
        description: "Please enter a valid sound URL first.",
        variant: "destructive"
      });
    }
  };
  
  // Use appropriate component based on device (Drawer for mobile, Dialog for desktop)
  const SettingsContainer = isMobile ? Drawer : Dialog;
  const SettingsTrigger = isMobile ? DrawerTrigger : DialogTrigger;
  const SettingsContent = isMobile ? DrawerContent : DialogContent;
  const SettingsHeader = isMobile ? DrawerHeader : DialogHeader;
  const SettingsTitle = isMobile ? DrawerTitle : DialogTitle;
  const SettingsDescription = isMobile ? DrawerDescription : DialogDescription;
  const SettingsFooter = isMobile ? DrawerFooter : DialogFooter;
  const SettingsClose = isMobile ? DrawerClose : DialogClose;
  
  return (
    <SettingsContainer>
      <SettingsTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Settings className="w-5 h-5" />
        </Button>
      </SettingsTrigger>
      <SettingsContent className="max-w-md">
        <SettingsHeader>
          <SettingsTitle>Pomodoro Settings</SettingsTitle>
          <SettingsDescription>
            Customize your focus, break times and goals
          </SettingsDescription>
        </SettingsHeader>
        
        <Tabs defaultValue="timer" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="sounds">Sounds</TabsTrigger>
          </TabsList>
          
          {/* Timer settings tab */}
          <TabsContent value="timer" className="space-y-6 mt-4 px-1">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="focus-time">Focus Time: {focusMinutes} minutes</label>
              </div>
              <Slider
                id="focus-time"
                defaultValue={[focusMinutes]}
                max={60}
                min={5}
                step={5}
                onValueChange={(value) => setFocusMinutes(value[0])}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="break-time">Short Break: {breakMinutes} minutes</label>
              </div>
              <Slider
                id="break-time"
                defaultValue={[breakMinutes]}
                max={15}
                min={1}
                step={1}
                onValueChange={(value) => setBreakMinutes(value[0])}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="long-break-time">Long Break: {longBreakMinutes} minutes</label>
              </div>
              <Slider
                id="long-break-time"
                defaultValue={[longBreakMinutes]}
                max={30}
                min={5}
                step={5}
                onValueChange={(value) => setLongBreakMinutes(value[0])}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="sessions-before-long-break">
                  Sessions before long break: {sessionsBeforeLongBreak}
                </label>
              </div>
              <Slider
                id="sessions-before-long-break"
                defaultValue={[sessionsBeforeLongBreak]}
                max={8}
                min={2}
                step={1}
                onValueChange={(value) => setSessionsBeforeLongBreak(value[0])}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="daily-goal">Daily Goal: {dailyGoal} minutes</label>
              </div>
              <Slider
                id="daily-goal"
                defaultValue={[dailyGoal]}
                max={180}
                min={30}
                step={30}
                onValueChange={(value) => setDailyGoal(value[0])}
              />
            </div>
          </TabsContent>
          
          {/* Sounds settings tab */}
          <TabsContent value="sounds" className="space-y-6 mt-4 px-1">
            <div className="space-y-3">
              <label className="text-sm font-medium">Completion Sound URL</label>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Enter sound URL" 
                  value={completionSound}
                  onChange={(e) => setCompletionSound(e.target.value)}
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={testCustomSound}
                  title="Test Sound"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter a URL to an audio file that will play when the timer completes.
              </p>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">YouTube Sound URL</label>
              <Input 
                placeholder="Enter YouTube video URL" 
                value={customYoutubeUrl}
                onChange={(e) => setCustomYoutubeUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter a YouTube URL for background sound or completion notifications.
              </p>
            </div>
            
            {/* YouTube preview */}
            {customYoutubeUrl && customYoutubeUrl.includes("youtube.com") && (
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">YouTube Preview:</p>
                <div className="aspect-video w-full rounded-md overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${customYoutubeUrl.split("v=")[1]?.split("&")[0]}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <SettingsFooter>
          <Button onClick={saveSettings}>Save Settings</Button>
          <SettingsClose asChild>
            <Button variant="outline">Cancel</Button>
          </SettingsClose>
        </SettingsFooter>
      </SettingsContent>
    </SettingsContainer>
  );
};
