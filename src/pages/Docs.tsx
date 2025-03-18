
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
  Palette
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
    <div className="container max-w-3xl mx-auto py-8 px-4 page-transition">
      <div className="mb-8 text-center">
        <div className="text-primary w-16 h-16 mx-auto mb-4">
          <div className="relative">
            <Timer className="w-16 h-16" />
            <Cat className="w-8 h-8 absolute -top-2 -right-2" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Meowdoro Documentation</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Your purr-fect productivity companion that combines Pomodoro technique with playful cat companions
        </p>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="what-is-meowdoro">
          <AccordionTrigger>What is Meowdoro?</AccordionTrigger>
          <AccordionContent>
            <p className="mb-4">
              Meowdoro is a productivity app that combines the Pomodoro technique with a fun, cat-themed interface to help you stay focused and productive.
            </p>
            <p>
              With Meowdoro, you can set focused work sessions followed by short breaks, track your daily focus time, take notes, and enjoy the company of virtual cat companions that react to your productivity.
            </p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="pomodoro-technique">
          <AccordionTrigger>The Pomodoro Technique</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">The Pomodoro Technique is a time management method that uses timed intervals of focused work followed by short breaks:</p>
            <ol className="list-decimal list-inside space-y-2 mb-4 pl-2">
              <li>Choose a task to work on</li>
              <li>Set a timer for 25 minutes (a "Pomodoro")</li>
              <li>Work on the task until the timer rings</li>
              <li>Take a short break (5 minutes)</li>
              <li>After 4 Pomodoros, take a longer break (15-30 minutes)</li>
            </ol>
            <p>
              Meowdoro implements this technique with customizable work and break durations, along with visual and audio notifications.
            </p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="timer-features">
          <AccordionTrigger>Timer Features</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1 flex items-center">
                  <Timer className="w-4 h-4 mr-2" />
                  Focus and Break Timers
                </h4>
                <p>Set customizable durations for focus sessions, short breaks, and long breaks. The timer automatically switches between focus and break modes.</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1 flex items-center">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Sound Options
                </h4>
                <p>Choose from built-in ambient sounds (rain, cafe, birds) or add your own custom sounds and YouTube links for background music or notifications.</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1 flex items-center">
                  <Cat className="w-4 h-4 mr-2" />
                  Cat Companion
                </h4>
                <p>A virtual cat companion shows different moods based on your work state and offers helpful study tips when you hover over it.</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Daily Progress Tracking</h4>
                <p>Track your daily focus minutes with a progress bar that shows how close you are to your daily goal.</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="notes-features">
          <AccordionTrigger>Notes Features</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1 flex items-center">
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Notes and Checklists
                </h4>
                <p>Create both text notes and interactive checklists to organize your ideas and tasks.</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1 flex items-center">
                  <Palette className="w-4 h-4 mr-2" />
                  Colorful Organization
                </h4>
                <p>Customize your notes with different background colors to visually organize your information.</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1 flex items-center">
                  <PinIcon className="w-4 h-4 mr-2" />
                  Pinned Notes
                </h4>
                <p>Pin important notes to keep them at the top of your list for quick access.</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Search Functionality</h4>
                <p>Quickly find what you need with a powerful search feature that checks titles, content, and tasks.</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="party-mode">
          <AccordionTrigger>Party Mode</AccordionTrigger>
          <AccordionContent>
            <p className="mb-4">
              Party mode allows you to study together with others in a virtual environment. You can join or create study rooms with friends to motivate each other and track group productivity.
            </p>
            <p>
              Each participant appears with their cat avatar, showing their current status (focusing, on break, or away).
            </p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="statistics">
          <AccordionTrigger>Statistics and Analytics</AccordionTrigger>
          <AccordionContent>
            <p className="mb-4">
              The Stats page shows your productivity metrics, including:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Daily, weekly, and monthly focus time</li>
              <li>Completed focus sessions</li>
              <li>Streaks and consistency charts</li>
              <li>Most productive days and times</li>
            </ul>
            <p className="mt-4">
              Use these insights to understand your productivity patterns and improve your work habits.
            </p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="customization">
          <AccordionTrigger>Appearance Settings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1 flex items-center">
                  <Moon className="w-4 h-4 mr-2" />
                  Dark/Light Mode
                </h4>
                <p>Switch between light and dark themes to suit your preference and reduce eye strain.</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Theme Colors
                </h4>
                <p>Choose from different accent colors (cyan, green, yellow, lavender, peach, mint, rose) to personalize your experience.</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Transparency Effects</h4>
                <p>Enable transparency for a modern, glass-like effect on UI elements (can be disabled for better performance on low-end devices).</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="tips">
          <AccordionTrigger>Productivity Tips</AccordionTrigger>
          <AccordionContent>
            <p className="mb-4">
              Get the most out of Meowdoro with these tips:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Start with 25-minute focus sessions and 5-minute breaks</li>
              <li>Use ambient sounds to mask distractions</li>
              <li>Create a checklist before starting work sessions</li>
              <li>Set realistic daily goals (e.g., 4-6 focus sessions)</li>
              <li>Use the cat companion for random study tips</li>
              <li>Review your stats weekly to identify patterns</li>
              <li>Experiment with different session lengths to find what works best for you</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="mt-10 text-center">
        <p className="mb-4">Ready to boost your productivity with Meowdoro?</p>
        <Link to="/">
          <Button size="lg" className="rounded-full">
            Get Started Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Docs;
