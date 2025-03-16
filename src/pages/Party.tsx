
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Cat, Users, Link, Copy, ArrowRight } from "lucide-react";

const Party: React.FC = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [partyName, setPartyName] = useState("");
  const [partyCode, setPartyCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  
  const { toast } = useToast();
  
  const generatePartyCode = () => {
    if (!partyName.trim()) {
      toast({
        title: "Party name required",
        description: "Please enter a name for your study party.",
        variant: "destructive"
      });
      return;
    }
    
    // Generate a random alphanumeric code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedCode(code);
    
    toast({
      title: "Party created!",
      description: `Your study party "${partyName}" is ready to share.`
    });
  };
  
  const joinParty = () => {
    if (!partyCode.trim()) {
      toast({
        title: "Party code required",
        description: "Please enter a valid party code to join.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would verify the code and join the room
    toast({
      title: "Joining party...",
      description: "This feature is coming soon!"
    });
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Share this code with friends to invite them."
    });
  };
  
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8 page-transition">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Study Together</h1>
        <p className="text-muted-foreground">Create or join a study party to stay motivated with friends</p>
      </div>
      
      <Card className="glass shadow-soft-lg overflow-hidden">
        <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="create" className="gap-2">
              <Users className="w-4 h-4" />
              Create Party
            </TabsTrigger>
            <TabsTrigger value="join" className="gap-2">
              <Link className="w-4 h-4" />
              Join Party
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="p-6">
            {!generatedCode ? (
              <div className="space-y-4">
                <CardDescription>
                  Create a new study party and invite friends to join you
                </CardDescription>
                
                <Input
                  placeholder="Enter party name"
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                />
                
                <Button className="w-full" onClick={generatePartyCode}>
                  <Users className="mr-2 h-4 w-4" />
                  Create Study Party
                </Button>
              </div>
            ) : (
              <div className="space-y-6 text-center">
                <div>
                  <h3 className="text-lg font-medium mb-1">"{partyName}" party created!</h3>
                  <p className="text-muted-foreground mb-4">Share this code with friends</p>
                  
                  <div className="relative mx-auto max-w-xs">
                    <Input
                      className="text-center text-lg font-mono py-6 tracking-widest"
                      value={generatedCode}
                      readOnly
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2"
                      onClick={() => copyToClipboard(generatedCode)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setPartyName("");
                      setGeneratedCode("");
                    }}
                  >
                    Create Another Party
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="join" className="p-6">
            <div className="space-y-4">
              <CardDescription>
                Enter a party code to join friends in a study session
              </CardDescription>
              
              <Input
                placeholder="Enter party code"
                className="text-center font-mono tracking-widest"
                value={partyCode}
                onChange={(e) => setPartyCode(e.target.value.toUpperCase())}
              />
              
              <Button className="w-full" onClick={joinParty}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Join Study Party
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
      
      {/* Cat Illustrations */}
      <div className="mt-16 relative">
        <div className="absolute left-0 right-0 -top-8 text-center text-muted-foreground text-sm">
          <span>They're waiting for you to join their study session</span>
        </div>
        
        <div className="flex justify-center items-end gap-4">
          <div className="relative">
            <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -scale-x-100">
              <ellipse cx="60" cy="60" rx="40" ry="20" fill="currentColor" className="text-primary/20" />
              <path d="M40 40C40 40 50 25 60 25C70 25 80 40 80 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M45 35C45 35 50 30 60 30C70 30 75 35 75 35" fill="currentColor" />
              <ellipse cx="45" cy="42" rx="5" ry="5" fill="currentColor" />
              <ellipse cx="75" cy="42" rx="5" ry="5" fill="currentColor" />
              <circle cx="45" cy="40" r="2" fill="white" />
              <circle cx="75" cy="40" r="2" fill="white" />
              <path d="M55 52 Q60 55 65 52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            
            {/* Thinking bubble */}
            <div className="absolute -top-10 -left-5 bg-white dark:bg-card p-2 rounded-lg shadow-soft w-24 text-center text-xs animate-pulse-soft">
              <span>Let's study together!</span>
            </div>
          </div>
          
          <div className="h-8 border-t-2 border-dashed border-primary/30 w-20"></div>
          
          <div className="relative">
            <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="60" cy="60" rx="40" ry="20" fill="currentColor" className="text-primary/20" />
              <path d="M40 40C40 40 50 25 60 25C70 25 80 40 80 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M45 35C45 35 50 30 60 30C70 30 75 35 75 35" fill="currentColor" />
              <ellipse cx="45" cy="42" rx="5" ry="5" fill="currentColor" />
              <ellipse cx="75" cy="42" rx="5" ry="5" fill="currentColor" />
              <circle cx="45" cy="40" r="2" fill="white" />
              <circle cx="75" cy="40" r="2" fill="white" />
              <path d="M55 55 Q60 65 65 55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            
            {/* Books or study materials */}
            <div className="absolute -top-8 right-2">
              <div className="w-8 h-10 rounded-sm bg-accent rotate-6 border border-primary/20"></div>
              <div className="w-8 h-10 rounded-sm bg-primary/20 absolute top-1 right-1 -rotate-3 border border-primary/20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Party;
