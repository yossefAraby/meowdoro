
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Plus,
  Cat,
  Clock,
  CupSoda,
  Github,
  Briefcase,
  Book,
  Laptop,
  Coffee,
  Link,
  LinkIcon,
  Share2,
  Copy,
  Check,
  LucideUsers,
  ChevronRight
} from "lucide-react";
import FrontEndGuide from "@/components/guide/FrontEndGuide";

// Mock data for demonstration
const mockRooms = [
  {
    id: 1,
    name: "Study Group A",
    host: "Sarah",
    members: 4,
    activities: ["Reading", "Writing"],
    focused: 3,
    onBreak: 1,
  },
  {
    id: 2,
    name: "CS Project Team",
    host: "Mike",
    members: 6,
    activities: ["Coding", "Research"],
    focused: 5,
    onBreak: 1,
  },
  {
    id: 3,
    name: "Law School Friends",
    host: "Jessica",
    members: 3,
    activities: ["Reading", "Note-taking"],
    focused: 2,
    onBreak: 1,
  },
];

const mockMembers = [
  {
    id: 1,
    name: "You",
    status: "focused",
    avatar: "/placeholder.svg",
    focusTime: 45,
    activity: "Coding",
    isHost: true,
  },
  {
    id: 2,
    name: "Alex",
    status: "focused",
    avatar: "/placeholder.svg",
    focusTime: 32,
    activity: "Writing",
  },
  {
    id: 3,
    name: "Jamie",
    status: "focused",
    avatar: "/placeholder.svg",
    focusTime: 28,
    activity: "Reading",
  },
  {
    id: 4,
    name: "Taylor",
    status: "break",
    avatar: "/placeholder.svg",
    focusTime: 15,
    activity: "Research",
  },
];

const catAvatars = [
  { id: 1, name: "Ginger", image: "/placeholder.svg" },
  { id: 2, name: "Midnight", image: "/placeholder.svg" },
  { id: 3, name: "Snowball", image: "/placeholder.svg" },
  { id: 4, name: "Whiskers", image: "/placeholder.svg" },
  { id: 5, name: "Shadow", image: "/placeholder.svg" },
  { id: 6, name: "Cinnamon", image: "/placeholder.svg" },
];

// Activity icons mapping
const activityIcons: Record<string, React.ReactNode> = {
  Coding: <Laptop className="h-4 w-4" />,
  Reading: <Book className="h-4 w-4" />,
  Writing: <Github className="h-4 w-4" />,
  Research: <Briefcase className="h-4 w-4" />,
  "Note-taking": <Book className="h-4 w-4" />,
  Default: <Coffee className="h-4 w-4" />,
};

const Party: React.FC = () => {
  const [isInRoom, setIsInRoom] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomActivity, setNewRoomActivity] = useState("");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(1);

  const { toast } = useToast();

  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      toast({
        title: "Joining Room",
        description: `Attempting to join room with code: ${roomCode}`,
      });
      
      // Simulate API call delay
      setTimeout(() => {
        setIsInRoom(true);
        setSelectedRoom(1); // First mock room for demo
      }, 1000);
    }
  };

  const handleCreateRoom = () => {
    if (newRoomName) {
      toast({
        title: "Room Created",
        description: `Your study room "${newRoomName}" has been created!`,
      });
      
      // Simulate API call delay
      setTimeout(() => {
        setIsInRoom(true);
        setSelectedRoom(1); // First mock room for demo
        setShowCreateDialog(false);
      }, 1000);
    }
  };

  const handleLeaveRoom = () => {
    toast({
      title: "Left Room",
      description: "You have left the study room",
    });
    setIsInRoom(false);
    setSelectedRoom(null);
  };

  const handleCopyLink = () => {
    // Copy a fake room link to clipboard
    navigator.clipboard.writeText("https://meowdoro.app/join/STUDY123");
    setCopied(true);
    
    toast({
      title: "Link Copied",
      description: "Room link copied to clipboard!",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 page-transition">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Study Party
          </CardTitle>
          <CardDescription>
            Study with friends to stay motivated and accountable
          </CardDescription>
        </CardHeader>
      </Card>

      {!isInRoom ? (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Join a Room</CardTitle>
              <CardDescription>
                Enter a room code to join an existing study session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter room code (e.g. STUDY123)"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleJoinRoom}>Join</Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center my-6">
            <Separator className="flex-1" />
            <span className="mx-4 text-muted-foreground text-sm">OR</span>
            <Separator className="flex-1" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create a Room</CardTitle>
              <CardDescription>
                Start a new study session and invite friends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Create Room
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Study Room</DialogTitle>
                    <DialogDescription>
                      Set up a new room for you and your study buddies
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="room-name">Room Name</Label>
                      <Input
                        id="room-name"
                        placeholder="e.g. CS Study Group"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="activity">What are you working on?</Label>
                      <Input
                        id="activity"
                        placeholder="e.g. Coding, Reading, Writing"
                        value={newRoomActivity}
                        onChange={(e) => setNewRoomActivity(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Choose Your Cat Avatar</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {catAvatars.map((cat) => (
                          <div
                            key={cat.id}
                            className={`border rounded-lg p-2 cursor-pointer transition-all ${
                              selectedAvatar === cat.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => setSelectedAvatar(cat.id)}
                          >
                            <div className="flex flex-col items-center">
                              <Avatar className="h-14 w-14">
                                <AvatarImage src={cat.image} alt={cat.name} />
                                <AvatarFallback>
                                  <Cat className="h-8 w-8 text-primary" />
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs mt-1">{cat.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCreateDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateRoom}>Create Room</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Public Rooms</CardTitle>
              <CardDescription>
                Browse active study rooms you can join
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRooms.map((room) => (
                  <Card key={room.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{room.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-3 w-3" /> 
                            <span>
                              {room.members} participants ({room.focused} focused, {room.onBreak} on break)
                            </span>
                          </div>
                          <div className="flex gap-2 mt-1">
                            {room.activities.map((activity, idx) => (
                              <span 
                                key={idx} 
                                className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full"
                              >
                                {activity}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setIsInRoom(true);
                            setSelectedRoom(room.id);
                          }}
                        >
                          Join
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Tabs defaultValue="room" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="room">Room</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
          </TabsList>
          
          <TabsContent value="room" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Study Group A</CardTitle>
                  <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite Friends</DialogTitle>
                        <DialogDescription>
                          Share this link with friends to invite them to your study room
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="flex items-center space-x-2 mt-4">
                        <div className="grid flex-1 gap-2">
                          <Label htmlFor="link" className="sr-only">
                            Link
                          </Label>
                          <div className="flex items-center border rounded-md px-3 py-2 bg-accent/50">
                            <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                            <input
                              id="link"
                              value="https://meowdoro.app/join/STUDY123"
                              readOnly
                              className="flex-1 bg-transparent border-0 outline-none"
                            />
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="px-3" 
                          onClick={handleCopyLink}
                        >
                          <span className="sr-only">Copy</span>
                          {copied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">Room Code</h4>
                        <div className="text-center border rounded-md py-3 bg-accent/50 text-lg font-mono">
                          STUDY123
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Friends can enter this code on the join room screen
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <CardDescription>
                  Hosted by Sarah • 4 participants
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <LucideUsers className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">4</div>
                        <div className="text-muted-foreground text-sm">Participants</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">3:45</div>
                        <div className="text-muted-foreground text-sm">Total Focus Time</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Currently Working On</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="border rounded-full px-3 py-1 text-sm flex items-center gap-1.5">
                      <Book className="h-3 w-3" />
                      <span>Reading</span>
                      <span className="text-muted-foreground">(2)</span>
                    </div>
                    <div className="border rounded-full px-3 py-1 text-sm flex items-center gap-1.5">
                      <Github className="h-3 w-3" />
                      <span>Writing</span>
                      <span className="text-muted-foreground">(2)</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Status</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>3 focusing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>1 on break</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-accent/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Cat className="h-5 w-5 text-primary" />
                    <div className="text-sm font-medium">Group Cat Says</div>
                  </div>
                  <p className="text-sm mt-2">
                    "According to a 2018 study, students who study in groups of 3-5 are 70% more likely to retain information. Keep up the great teamwork!"
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleLeaveRoom}
                >
                  Leave Room
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="participants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Participants (4)</CardTitle>
                <CardDescription>
                  See who's studying with you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            <Cat className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{member.name}</span>
                            {member.isHost && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                Host
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {member.focusTime}m
                            </span>
                            <span className="flex items-center gap-1">
                              {(activityIcons as any)[member.activity] || activityIcons.Default}
                              {member.activity}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div 
                        className={`px-2 py-1 rounded-full text-xs ${
                          member.status === "focused" 
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" 
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                        }`}
                      >
                        {member.status === "focused" ? "Focusing" : "On Break"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Front-End Guide */}
      <FrontEndGuide
        title="Party Page"
        description="Guide for implementing the collaborative study room feature"
        colors={[
          { name: "Primary", value: "hsl(var(--primary))", description: "Used for buttons, highlights" },
          { name: "Primary/10", value: "bg-primary/10", description: "Used for tag backgrounds" },
          { name: "Background", value: "hsl(var(--background))", description: "Main page background" },
          { name: "Card", value: "hsl(var(--card))", description: "Card backgrounds" },
          { name: "Accent", value: "hsl(var(--accent))", description: "Used for hover states" },
          { name: "Muted", value: "hsl(var(--muted-foreground))", description: "Secondary text color" },
          { name: "Green", value: "#10b981", description: "Focus indicator color" },
          { name: "Blue", value: "#3b82f6", description: "Break indicator color" }
        ]}
        fonts={[
          { 
            name: "System Default", 
            family: "system-ui, sans-serif", 
            weights: ["400", "500", "600", "700"],
            source: "System fonts"
          }
        ]}
        assets={[
          { 
            name: "Lucide Icons", 
            type: "icon", 
            source: "lucide-react", 
            description: "Icons used throughout the interface: Users, Plus, Cat, etc."
          },
          {
            name: "shadcn/ui Components",
            type: "icon",
            source: "shadcn/ui",
            description: "UI components like Button, Card, Dialog, Avatar, etc."
          },
          {
            name: "Cat Avatars",
            type: "image",
            source: "/placeholder.svg",
            description: "Avatar images for user profiles (placeholder in the current implementation)"
          }
        ]}
        buildSteps={[
          "Install required dependencies: npm install lucide-react @radix-ui/react-dialog @radix-ui/react-avatar @radix-ui/react-tabs",
          "Create the basic page structure with room joining and creation",
          "Implement the avatar selection for customizing user appearance",
          "Create the public rooms list component",
          "Build the room viewing interface with status cards",
          "Implement the participant list with status indicators",
          "Add invitation sharing functionality",
          "Create responsive layouts with Tailwind CSS",
          "Add toast notifications for user feedback",
          "Implement tab navigation for room details and participants"
        ]}
        codeSnippets={[
          {
            title: "Room Data Structure",
            language: "typescript",
            code: `// Room data structure
type Room = {
  id: number;
  name: string;
  host: string;
  members: number;
  activities: string[];
  focused: number;
  onBreak: number;
};

// Member data structure
type Member = {
  id: number;
  name: string;
  status: "focused" | "break";
  avatar: string;
  focusTime: number;
  activity: string;
  isHost?: boolean;
};`,
            description: "TypeScript definitions for rooms and participants"
          },
          {
            title: "Room Sharing Dialog",
            language: "jsx",
            code: `<Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
  <DialogTrigger asChild>
    <Button variant="outline" size="sm">
      <Share2 className="h-4 w-4 mr-2" />
      Share
    </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Invite Friends</DialogTitle>
      <DialogDescription>
        Share this link with friends to invite them to your study room
      </DialogDescription>
    </DialogHeader>
    
    <div className="flex items-center space-x-2 mt-4">
      <div className="grid flex-1 gap-2">
        <Label htmlFor="link" className="sr-only">Link</Label>
        <div className="flex items-center border rounded-md px-3 py-2 bg-accent/50">
          <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
          <input
            id="link"
            value="https://meowdoro.app/join/STUDY123"
            readOnly
            className="flex-1 bg-transparent border-0 outline-none"
          />
        </div>
      </div>
      <Button 
        size="sm" 
        className="px-3" 
        onClick={handleCopyLink}
      >
        <span className="sr-only">Copy</span>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  </DialogContent>
</Dialog>`,
            description: "Room sharing dialog implementation with copy functionality"
          }
        ]}
        additionalNotes="The Party page implements a virtual collaborative space for users to study together remotely. The design focuses on making it easy to create or join rooms, see who's studying with you, and track group progress. Status indicators clearly show who's focusing and who's on a break. The share functionality makes it simple to invite others to join your study session."
      />
    </div>
  );
};

export default Party;
