
import React from "react";
import { Link } from "react-router-dom";
import { 
  Timer, 
  CheckSquare, 
  Users, 
  Settings, 
  Cat,
  Moon,
  Volume2,
  PinIcon,
  Palette,
  BookOpen,
  Coffee,
  ArrowLeft,
  Sparkles,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Docs: React.FC = () => {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 page-transition pb-20">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1" 
          asChild
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </Button>
      </div>
    
      <div className="mb-12 text-center">
        <div className="text-primary w-20 h-20 mx-auto mb-6">
          <div className="relative">
            <Timer className="w-20 h-20" />
            <Cat className="w-10 h-10 absolute -top-2 -right-2" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-3">Learn More</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Your quick guide to becoming more productive with Meowdoro
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Table of Contents - Desktop */}
        <div className="hidden md:block">
          <div className="sticky top-24">
            <h3 className="font-bold text-lg mb-3">Contents</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#getting-started" className="hover:text-primary transition-colors">Getting Started</a>
              </li>
              <li>
                <a href="#timer" className="hover:text-primary transition-colors">Timer</a>
              </li>
              <li>
                <a href="#task-management" className="hover:text-primary transition-colors">Task Management</a>
              </li>
              <li>
                <a href="#study-party" className="hover:text-primary transition-colors">Study Party</a>
              </li>
              <li>
                <a href="#cat-companion" className="hover:text-primary transition-colors">Cat Companion</a>
              </li>
              <li>
                <a href="#customization" className="hover:text-primary transition-colors">Customization</a>
              </li>
              <li>
                <a href="#productivity-tips" className="hover:text-primary transition-colors">Productivity Tips</a>
              </li>
              <li>
                <a href="#shortcuts" className="hover:text-primary transition-colors">Keyboard Shortcuts</a>
              </li>
            </ul>
          </div>
        </div>
      
        {/* Main Content */}
        <div className="md:col-span-3 space-y-10">
          <section id="getting-started" className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Getting Started
            </h2>
            <div className="space-y-4">
              <p>
                Meowdoro combines the Pomodoro technique with a cat theme to make focusing on tasks more enjoyable. Here's how to get started:
              </p>
              
              <div className="bg-card p-4 rounded-lg border space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
                  <div>
                    <h4 className="font-medium">Create an Account or Join as Guest</h4>
                    <p className="text-sm text-muted-foreground">Sign up or use the "Join as guest" option on the homepage to get started immediately.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
                  <div>
                    <h4 className="font-medium">Start Your Timer</h4>
                    <p className="text-sm text-muted-foreground">Head to the Timer page and press play to begin your first focus session.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
                  <div>
                    <h4 className="font-medium">Create Tasks</h4>
                    <p className="text-sm text-muted-foreground">Visit the Tasks page to keep track of what you need to work on during your focus sessions.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">4</div>
                  <div>
                    <h4 className="font-medium">Study with Friends</h4>
                    <p className="text-sm text-muted-foreground">Use the Party page to join virtual study sessions for added motivation.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <section id="timer" className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary" />
              Pomodoro Timer
            </h2>
            <div className="space-y-4">
              <p>
                The Pomodoro technique helps you maintain focus through structured work sessions followed by refreshing breaks.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Focus Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    25-minute sessions (default) for concentrated work on a single task
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Short Break</h4>
                  <p className="text-sm text-muted-foreground">
                    5-minute rests (default) between focus sessions
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Long Break</h4>
                  <p className="text-sm text-muted-foreground">
                    15-minute breaks (default) after completing several focus sessions
                  </p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mt-4">Quick Tips:</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><span className="font-medium">Play/Pause Button:</span> Start or pause your current session</li>
                <li><span className="font-medium">Skip Button:</span> Move to the next session type</li>
                <li><span className="font-medium">Sound Controls:</span> Customize notifications and background sounds</li>
                <li><span className="font-medium">Cat Companion:</span> Click for study tips and motivation</li>
              </ul>
            </div>
          </section>
          
          <section id="task-management" className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              Task Management
            </h2>
            <div className="space-y-4">
              <p>
                The Tasks page gives you a clean interface for keeping track of your notes and to-do items.
              </p>
              
              <div className="bg-card p-4 rounded-lg border space-y-4">
                <h3 className="text-lg font-semibold">Quick Tips:</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><span className="font-medium">Create Notes:</span> Click the "+" button to add a new note</li>
                  <li><span className="font-medium">Pin Important Notes:</span> Keep critical items at the top</li>
                  <li><span className="font-medium">Color Code:</span> Use colors to categorize by project or priority</li>
                  <li><span className="font-medium">Search:</span> Use the search bar to find specific notes</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section id="study-party" className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Study Party
            </h2>
            <div className="space-y-4">
              <p>
                Study Party allows you to work alongside friends virtually, providing motivation through shared accountability.
              </p>
              
              <div className="bg-card p-4 rounded-lg border space-y-4">
                <h3 className="text-lg font-semibold">Quick Tips:</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><span className="font-medium">Create a Room:</span> Start a new study space and invite friends</li>
                  <li><span className="font-medium">Join Existing:</span> Enter a room code to join friends</li>
                  <li><span className="font-medium">Status Updates:</span> See who's focusing and who's on a break</li>
                  <li><span className="font-medium">Synchronize Breaks:</span> Coordinate break times with your group</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section id="cat-companion" className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Cat className="h-5 w-5 text-primary" />
              Cat Companion
            </h2>
            <div className="space-y-4">
              <p>
                Your virtual cat companion changes expressions to match your work state and offers helpful tips.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card p-4 rounded-lg border text-center">
                  <div className="text-3xl mb-2">🧐</div>
                  <h4 className="font-medium mb-1">Focused</h4>
                  <p className="text-xs text-muted-foreground">During focus sessions</p>
                </div>
                <div className="bg-card p-4 rounded-lg border text-center">
                  <div className="text-3xl mb-2">😸</div>
                  <h4 className="font-medium mb-1">Happy</h4>
                  <p className="text-xs text-muted-foreground">During breaks</p>
                </div>
                <div className="bg-card p-4 rounded-lg border text-center">
                  <div className="text-3xl mb-2">😴</div>
                  <h4 className="font-medium mb-1">Sleeping</h4>
                  <p className="text-xs text-muted-foreground">When timer is paused</p>
                </div>
                <div className="bg-card p-4 rounded-lg border text-center">
                  <div className="text-3xl mb-2">😺</div>
                  <h4 className="font-medium mb-1">Idle</h4>
                  <p className="text-xs text-muted-foreground">Default state</p>
                </div>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Pro Tip
                </h4>
                <p className="text-sm">
                  Click on your cat companion at any time to receive study tips and productivity advice!
                </p>
              </div>
            </div>
          </section>
          
          <section id="customization" className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Customization
            </h2>
            <div className="space-y-4">
              <p>
                Meowdoro offers several ways to customize your productivity experience.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Timer className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Timer Settings</h4>
                  </div>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>Adjust focus session length</li>
                    <li>Customize break durations</li>
                    <li>Set sessions before long break</li>
                  </ul>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Sound Settings</h4>
                  </div>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>Enable/disable notifications</li>
                    <li>Choose ambient background sounds</li>
                    <li>Adjust volume levels</li>
                  </ul>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Moon className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Appearance</h4>
                  </div>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>Switch between light and dark themes</li>
                    <li>Toggle between different theme colors</li>
                  </ul>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Notifications</h4>
                  </div>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>Session start/end alerts</li>
                    <li>Reminder notifications</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          
          <section id="productivity-tips" className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Coffee className="h-5 w-5 text-primary" />
              Productivity Tips
            </h2>
            <div className="space-y-4">
              <p>
                Get the most out of Meowdoro with these quick tips:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Single-Tasking</h4>
                  <p className="text-sm text-muted-foreground">
                    Focus on one specific task during each session. Multitasking reduces effectiveness.
                  </p>
                </div>
                
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Take Real Breaks</h4>
                  <p className="text-sm text-muted-foreground">
                    Step away from your screen during breaks. Stretch or do a quick physical activity.
                  </p>
                </div>
                
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Start Small</h4>
                  <p className="text-sm text-muted-foreground">
                    Begin with 1-2 focus sessions per day and gradually increase as you build the habit.
                  </p>
                </div>
                
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Track Progress</h4>
                  <p className="text-sm text-muted-foreground">
                    After completing focus sessions, review what you've accomplished and plan next.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <section id="shortcuts" className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Keyboard Shortcuts
            </h2>
            <div className="space-y-4">
              <p>
                Power users can navigate Meowdoro more efficiently with these keyboard shortcuts:
              </p>
              
              <div className="bg-card p-4 rounded-lg border">
                <h4 className="font-medium mb-3">Timer Controls</h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="font-medium">Space</div>
                  <div>Play/Pause timer</div>
                  
                  <div className="font-medium">S</div>
                  <div>Skip to next session</div>
                  
                  <div className="font-medium">M</div>
                  <div>Toggle sound mute</div>
                  
                  <div className="font-medium">+ / -</div>
                  <div>Increase/decrease volume</div>
                </div>
              </div>
              
              <div className="bg-card p-4 rounded-lg border">
                <h4 className="font-medium mb-3">Navigation</h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="font-medium">T</div>
                  <div>Go to Timer page</div>
                  
                  <div className="font-medium">N</div>
                  <div>Go to Tasks page</div>
                  
                  <div className="font-medium">P</div>
                  <div>Go to Party page</div>
                  
                  <div className="font-medium">Esc</div>
                  <div>Close dialogs/modals</div>
                </div>
              </div>
            </div>
          </section>
          
          <div className="pt-10 text-center">
            <p className="mb-4">Ready to boost your productivity with Meowdoro?</p>
            <Link to="/">
              <Button size="lg" className="rounded-full">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
