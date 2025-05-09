import React from "react";
import { Settings, Settings2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface TimerSettingsProps {
  // Timer settings
  focusMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
  dailyGoal: number;
  completionSound: string;
  customYoutubeUrl: string;
  showFocusBar?: boolean;
  showFishBar?: boolean;
  
  // Setter functions
  setFocusMinutes: (minutes: number) => void;
  setBreakMinutes: (minutes: number) => void;
  setLongBreakMinutes: (minutes: number) => void;
  setSessionsBeforeLongBreak: (sessions: number) => void;
  setDailyGoal: (minutes: number) => void;
  setCompletionSound: (url: string) => void;
  setCustomYoutubeUrl: (url: string) => void;
  setShowFocusBar?: (show: boolean) => void;
  setShowFishBar?: (show: boolean) => void;
  
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
  showFocusBar = true,
  showFishBar = true,
  setFocusMinutes,
  setBreakMinutes,
  setLongBreakMinutes,
  setSessionsBeforeLongBreak,
  setDailyGoal,
  setCompletionSound,
  setCustomYoutubeUrl,
  setShowFocusBar,
  setShowFishBar,
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
          <Settings2 className="h-5 w-5" />
        </Button>
      </SettingsTrigger>
      <SettingsContent className="max-w-md">
        <SettingsHeader>
          <SettingsTitle>Pomodoro Settings</SettingsTitle>
          <SettingsDescription>
            Customize your focus, break times and goals
          </SettingsDescription>
        </SettingsHeader>
        
        <div className="space-y-6 mt-4 px-1">
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
          
          {/* Individual Progress Bar Toggles */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Progress Bar Settings</h3>
            
            {/* Today's Focus Bar Toggle */}
            {setShowFocusBar && (
              <div className="flex items-center justify-between">
                <Label htmlFor="show-focus-bar">Show Today's Focus Bar</Label>
                <Switch
                  id="show-focus-bar"
                  checked={showFocusBar}
                  onCheckedChange={setShowFocusBar}
                />
              </div>
            )}
            
            {/* Fish Progress Bar Toggle */}
            {setShowFishBar && (
              <div className="flex items-center justify-between">
                <Label htmlFor="show-fish-bar">Show Fish Progress Bar</Label>
                <Switch
                  id="show-fish-bar"
                  checked={showFishBar}
                  onCheckedChange={setShowFishBar}
                />
              </div>
            )}
          </div>
        </div>
        
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
