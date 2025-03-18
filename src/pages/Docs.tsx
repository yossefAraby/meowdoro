
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
  BarChart,
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
        <h1 className="text-4xl font-bold mb-3">Meowdoro Documentation</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Your complete guide to becoming more productive with your feline companion
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Table of Contents - Desktop */}
        <div className="hidden md:block">
          <div className="sticky top-24">
            <h3 className="font-bold text-lg mb-3">Contents</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#introduction" className="hover:text-primary transition-colors">Introduction</a>
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
                <a href="#statistics" className="hover:text-primary transition-colors">Statistics</a>
              </li>
              <li>
                <a href="#cat-companion" className="hover:text-primary transition-colors">Cat Companion</a>
              </li>
              <li>
                <a href="#customization" className="hover:text-primary transition-colors">Customization</a>
              </li>
              <li>
                <a href="#getting-started" className="hover:text-primary transition-colors">Getting Started</a>
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
        <div className="md:col-span-3 space-y-12">
          <section id="introduction">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Introduction to Meowdoro
            </h2>
            <div className="space-y-4">
              <p>
                Meowdoro is a productivity application that combines the proven effectiveness of the Pomodoro technique with a delightful cat theme. Designed to make focusing on tasks more enjoyable, Meowdoro helps you structure your work sessions, take appropriate breaks, and track your productivity.
              </p>
              <p>
                The application features a customizable timer, task management system, study party mode for group productivity, comprehensive statistics, and a virtual cat companion that provides motivation and study tips throughout your sessions.
              </p>
              <div className="bg-accent/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2">What is the Pomodoro Technique?</h4>
                <p className="text-sm">
                  The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It breaks work into intervals, traditionally 25 minutes in length, separated by short breaks. After a set number of work intervals, a longer break is taken. This method aims to improve focus and reduce mental fatigue.
                </p>
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
                The core of Meowdoro is the Pomodoro timer, which helps you maintain focus through structured work sessions followed by refreshing breaks.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">Timer Modes</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Focus Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    Default 25-minute sessions dedicated to concentrated work on a single task. Your cat companion shows a focused expression during these sessions.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Short Break</h4>
                  <p className="text-sm text-muted-foreground">
                    Default 5-minute rests between focus sessions to give your mind a brief rest. Your cat companion appears happy during breaks.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Long Break</h4>
                  <p className="text-sm text-muted-foreground">
                    Default 15-minute extended breaks taken after completing a set number of focus sessions (typically 4).
                  </p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mt-6">Timer Controls</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium">Play/Pause</p>
                    <p className="text-sm text-muted-foreground">Start or pause the current timer session</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <div className="w-3 h-3 border-2 border-primary rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium">Skip</p>
                    <p className="text-sm text-muted-foreground">Move to the next timer mode (focus → break or break → focus)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Bell className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Sound Settings</p>
                    <p className="text-sm text-muted-foreground">Customize notification sounds and background audio</p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mt-6">Sound Features</h3>
              <div className="space-y-2">
                <p>Meowdoro includes several sound options to enhance your focus sessions:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Timer completion notifications</li>
                  <li>Ambient background sounds (rain, cafe, birds)</li>
                  <li>Volume control for all audio</li>
                  <li>Custom YouTube audio integration</li>
                </ul>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg mt-6 border border-primary/20">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Pro Tip
                </h4>
                <p className="text-sm">
                  Customize your timer durations in Settings to match your personal attention span. Some users prefer shorter 15-minute focus sessions with 3-minute breaks, while others may work better with longer 50-minute sessions and 10-minute breaks.
                </p>
              </div>
            </div>
          </section>
          
          <section id="task-management" className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              Task Management
            </h2>
            <div className="space-y-4">
              <p>
                The Tasks page provides a clean, minimal interface for keeping track of your notes and to-do items, inspired by Google Keep.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">Creating Notes</h3>
              <div className="space-y-2">
                <p>The note creation interface allows you to:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Create text notes with titles and content</li>
                  <li>Adjust the color of notes for visual organization</li>
                  <li>Pin important notes to keep them at the top</li>
                </ul>
              </div>
              
              <h3 className="text-lg font-semibold mt-6">Note Organization</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <PinIcon className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Pinning</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pin your most important notes to keep them at the top of your list for quick access, regardless of when they were created.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Color Coding</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Assign different colors to your notes to visually categorize them by project, priority, or any system that works for you.
                  </p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mt-6">Search & Filter</h3>
              <p>
                Quickly find specific notes using the search function, which scans through both titles and content to help you locate exactly what you need.
              </p>
              
              <div className="bg-primary/5 p-4 rounded-lg mt-6 border border-primary/20">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Pro Tip
                </h4>
                <p className="text-sm">
                  Consider creating a daily task note at the start of each day, listing the specific tasks you want to accomplish during your focus sessions. Pin this note to keep it accessible throughout the day.
                </p>
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
                Study Party is a social productivity feature that allows you to work alongside friends virtually, providing motivation through shared accountability.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">How It Works</h3>
              <div className="space-y-2">
                <p>To use Study Party:</p>
                <ol className="list-decimal list-inside ml-2 space-y-2">
                  <li>Create a study room or join an existing one with a room code</li>
                  <li>Each participant appears with their cat avatar in the virtual room</li>
                  <li>Everyone's status (focusing, on break, or idle) is visible to the group</li>
                  <li>Optional chat functionality for brief coordination</li>
                </ol>
              </div>
              
              <h3 className="text-lg font-semibold mt-6">Benefits of Group Study</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Accountability</h4>
                  <p className="text-sm text-muted-foreground">
                    Knowing that others can see your status creates positive pressure to maintain focus during work sessions.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Motivation</h4>
                  <p className="text-sm text-muted-foreground">
                    Seeing others working diligently can inspire you to stay on task and resist distractions.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Community</h4>
                  <p className="text-sm text-muted-foreground">
                    Creates a sense of belonging and shared purpose, even when studying or working remotely.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Coordination</h4>
                  <p className="text-sm text-muted-foreground">
                    Synchronize break times with friends to chat briefly before returning to focused work.
                  </p>
                </div>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg mt-6 border border-primary/20">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Pro Tip
                </h4>
                <p className="text-sm">
                  For maximum productivity, consider establishing ground rules with your study group, such as limiting chat to break times only and setting shared goals for the number of focus sessions to complete.
                </p>
              </div>
            </div>
          </section>
          
          <section id="statistics" className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Statistics
            </h2>
            <div className="space-y-4">
              <p>
                The Statistics page offers insights into your productivity patterns, helping you track progress and identify areas for improvement.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">Available Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Daily Focus Time</h4>
                  <p className="text-sm text-muted-foreground">
                    Track the total minutes you've spent in focus mode each day, with progress toward your daily goal.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Weekly Overview</h4>
                  <p className="text-sm text-muted-foreground">
                    View your productivity across the week to identify patterns and trends in your focus habits.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Focus Sessions</h4>
                  <p className="text-sm text-muted-foreground">
                    Count of completed focus sessions per day and historical averages.
                  </p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mt-6">Using Your Statistics</h3>
              <div className="space-y-2">
                <p>Your productivity data can help you:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Identify your most productive days and times</li>
                  <li>Set realistic goals based on your historical performance</li>
                  <li>Track improvement over time</li>
                  <li>Experiment with different timer durations and see the impact</li>
                </ul>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg mt-6 border border-primary/20">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Pro Tip
                </h4>
                <p className="text-sm">
                  Review your statistics at the end of each week to identify patterns. If you notice certain days consistently have lower productivity, consider adjusting your schedule or environment for those days.
                </p>
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
                Your virtual cat companion adds a fun, motivational element to the Meowdoro experience, changing expressions to match your work state and offering helpful tips.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">Cat Moods</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card p-4 rounded-lg border text-center">
                  <div className="text-3xl mb-2">🧐</div>
                  <h4 className="font-medium mb-1">Focused</h4>
                  <p className="text-xs text-muted-foreground">
                    During focus sessions
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border text-center">
                  <div className="text-3xl mb-2">😸</div>
                  <h4 className="font-medium mb-1">Happy</h4>
                  <p className="text-xs text-muted-foreground">
                    During breaks
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border text-center">
                  <div className="text-3xl mb-2">😴</div>
                  <h4 className="font-medium mb-1">Sleeping</h4>
                  <p className="text-xs text-muted-foreground">
                    When timer is paused
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border text-center">
                  <div className="text-3xl mb-2">😺</div>
                  <h4 className="font-medium mb-1">Idle</h4>
                  <p className="text-xs text-muted-foreground">
                    Default state
                  </p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mt-6">Study Tips</h3>
              <p>
                Your cat companion provides access to over 100 curated study and productivity tips. Simply click on the cat to see a new tip, which can help you:
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Learn new productivity techniques</li>
                <li>Find ways to improve focus</li>
                <li>Discover memory and learning strategies</li>
                <li>Get ideas for effective break activities</li>
              </ul>
              
              <div className="bg-primary/5 p-4 rounded-lg mt-6 border border-primary/20">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Pro Tip
                </h4>
                <p className="text-sm">
                  Try implementing one new study tip each day to gradually build a collection of effective productivity techniques that work for your personal learning style.
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
                Meowdoro offers extensive customization options to personalize your productivity experience.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">Timer Settings</h3>
              <div className="space-y-2">
                <p>Customize your timer durations to match your work style:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Focus session length (5-90 minutes)</li>
                  <li>Short break duration (1-30 minutes)</li>
                  <li>Long break duration (10-60 minutes)</li>
                  <li>Number of sessions before a long break (1-8)</li>
                </ul>
              </div>
              
              <h3 className="text-lg font-semibold mt-6">Sound Settings</h3>
              <div className="space-y-2">
                <p>Personalize your audio experience:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Enable/disable notification sounds</li>
                  <li>Choose from various notification tones</li>
                  <li>Select background ambient sounds</li>
                  <li>Add custom YouTube audio links</li>
                  <li>Adjust volume levels</li>
                </ul>
              </div>
              
              <h3 className="text-lg font-semibold mt-6">Appearance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Moon className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Theme Mode</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes based on your preference or environment.
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Color Themes</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Choose from various accent colors: cyan (default), green, yellow, lavender, peach, mint, and rose.
                  </p>
                </div>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg mt-6 border border-primary/20">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Pro Tip
                </h4>
                <p className="text-sm">
                  Experiment with different timer durations to find what works best for you. Some tasks may benefit from shorter, more frequent focus sessions, while others might require longer, deeper concentration periods.
                </p>
              </div>
            </div>
          </section>
          
          <section id="getting-started" className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary" />
              Getting Started Guide
            </h2>
            <div className="space-y-4">
              <p>
                Follow these steps to begin your productive journey with Meowdoro:
              </p>
              
              <div className="space-y-6 mt-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Create Your Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Sign up to save your settings, statistics, and notes across devices. This also enables features like Study Party.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Customize Your Timer</h4>
                    <p className="text-sm text-muted-foreground">
                      Visit Settings to adjust focus and break durations to match your preferences. The default 25-5 pattern works well for most users, but feel free to experiment.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Set Up Your Tasks</h4>
                    <p className="text-sm text-muted-foreground">
                      Create notes or task lists for the items you want to work on during your focus sessions. Having a clear plan helps maintain focus.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Choose Your Sounds</h4>
                    <p className="text-sm text-muted-foreground">
                      Select notification sounds that work for you, and decide whether you want background ambient noise during your focus sessions.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    5
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Start Your First Session</h4>
                    <p className="text-sm text-muted-foreground">
                      Press the play button on the timer page to begin your first focus session. Remember to work on just one task during this time.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg mt-6 border border-primary/20">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Pro Tip
                </h4>
                <p className="text-sm">
                  During your first week, try to complete at least 4 focus sessions per day. This helps establish the habit while allowing you to experience the full cycle of work and breaks.
                </p>
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
                Get the most out of Meowdoro with these expert productivity suggestions:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Single-Tasking</h4>
                  <p className="text-sm text-muted-foreground">
                    Focus on one specific task during each Pomodoro session. Multitasking reduces effectiveness and makes it harder to maintain concentration.
                  </p>
                </div>
                
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Environment Setup</h4>
                  <p className="text-sm text-muted-foreground">
                    Create a dedicated workspace with minimal distractions. Consider using ambient sounds to mask background noise if needed.
                  </p>
                </div>
                
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Take Real Breaks</h4>
                  <p className="text-sm text-muted-foreground">
                    During breaks, step away from your screen. Stretch, move around, or do a quick physical activity to refresh your mind.
                  </p>
                </div>
                
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Task Batching</h4>
                  <p className="text-sm text-muted-foreground">
                    Group similar tasks together and tackle them in consecutive Pomodoro sessions to reduce mental context switching.
                  </p>
                </div>
                
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Review Progress</h4>
                  <p className="text-sm text-muted-foreground">
                    After completing a set of focus sessions, review what you've accomplished and plan your next tasks.
                  </p>
                </div>
                
                <div className="bg-card p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Start Small</h4>
                  <p className="text-sm text-muted-foreground">
                    Begin with 1-2 focus sessions per day and gradually increase as you build the habit. Consistency matters more than quantity.
                  </p>
                </div>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg mt-6 border border-primary/20">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Advanced Tip
                </h4>
                <p className="text-sm">
                  If you find yourself consistently unable to focus for the full 25 minutes, try the "Pomodoro Hierarchy" technique: Start with shorter sessions (10-15 minutes) and gradually increase the duration as your focus muscles strengthen.
                </p>
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
              
              <div className="bg-card p-4 rounded-lg border mt-4">
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
              
              <div className="bg-card p-4 rounded-lg border mt-4">
                <h4 className="font-medium mb-3">Navigation</h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="font-medium">T</div>
                  <div>Go to Timer page</div>
                  
                  <div className="font-medium">N</div>
                  <div>Go to Tasks page</div>
                  
                  <div className="font-medium">P</div>
                  <div>Go to Party page</div>
                  
                  <div className="font-medium">S</div>
                  <div>Go to Stats page</div>
                  
                  <div className="font-medium">Esc</div>
                  <div>Close dialogs/modals</div>
                </div>
              </div>
              
              <div className="bg-card p-4 rounded-lg border mt-4">
                <h4 className="font-medium mb-3">Tasks Page</h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="font-medium">Ctrl/⌘ + N</div>
                  <div>New note</div>
                  
                  <div className="font-medium">Ctrl/⌘ + F</div>
                  <div>Search notes</div>
                  
                  <div className="font-medium">Ctrl/⌘ + P</div>
                  <div>Pin/unpin selected note</div>
                  
                  <div className="font-medium">Delete</div>
                  <div>Delete selected note</div>
                </div>
              </div>
            </div>
          </section>
          
          <div className="pt-16 text-center">
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
