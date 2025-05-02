
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Cat, Users, Link, Copy, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Interfaces for party and membership data
interface Party {
  id: string;
  name: string;
  code: string;
  created_by: string;
  created_at: string;
}

interface PartyMembership {
  id: string;
  party_id: string;
  user_id: string;
  joined_at: string;
}

const Party: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("create");
  const [partyName, setPartyName] = useState("");
  const [partyCode, setPartyCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeParty, setActiveParty] = useState<Party | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  const { toast } = useToast();
  
  // Check if user is already in a party
  useEffect(() => {
    if (user) {
      checkActiveParty();
    }
  }, [user]);

  const checkActiveParty = async () => {
    if (!user) return;
    
    try {
      // Get party memberships for current user
      const { data: memberships, error: membershipError } = await supabase
        .from('party_members')
        .select('*, party:party_id(*)')
        .eq('user_id', user.id)
        .order('joined_at', { ascending: false })
        .limit(1) as any;
      
      if (membershipError) throw membershipError;
      
      if (memberships && memberships.length > 0) {
        // User is in a party
        setActiveParty(memberships[0].party as unknown as Party);
      }
    } catch (error: any) {
      console.error("Error checking party status:", error);
    }
  };

  const generatePartyCode = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to create a study party.",
        variant: "destructive"
      });
      return;
    }
    
    if (!partyName.trim()) {
      toast({
        title: "Party name required",
        description: "Please enter a name for your study party.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { data, error } = await supabase
        .from('study_parties')
        .insert({
          name: partyName,
          code,
          created_by: user?.id
        })
        .select()
        .single() as any;
      
      if (error) throw error;
      
      // Join the party you created
      const { error: joinError } = await supabase
        .from('party_members')
        .insert({
          party_id: data.id,
          user_id: user?.id
        }) as any;
      
      if (joinError) throw joinError;
      
      setGeneratedCode(code);
      setActiveParty(data as Party);
      
      toast({
        title: "Party created!",
        description: `Your study party "${partyName}" is ready to share.`
      });
    } catch (error: any) {
      console.error("Error creating party:", error);
      toast({
        title: "Error creating party",
        description: error.message,
        variant: "destructive"
      });
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const joinParty = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to join a study party.",
        variant: "destructive"
      });
      return;
    }
    
    if (!partyCode.trim()) {
      toast({
        title: "Party code required",
        description: "Please enter a valid party code to join.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      // First find the party
      const { data: party, error: findError } = await supabase
        .from('study_parties')
        .select('*')
        .eq('code', partyCode.toUpperCase())
        .single() as any;
      
      if (findError) {
        if (findError.code === 'PGRST116') {
          throw new Error("Invalid party code. Please check and try again.");
        }
        throw findError;
      }
      
      // Check if already a member
      const { data: existingMembership, error: membershipCheckError } = await supabase
        .from('party_members')
        .select('*')
        .eq('party_id', party.id)
        .eq('user_id', user?.id)
        .maybeSingle() as any;
        
      if (membershipCheckError) throw membershipCheckError;
      
      if (existingMembership) {
        setActiveParty(party as Party);
        toast({
          title: "Already a member",
          description: "You are already a member of this party."
        });
        return;
      }
      
      // Then join it
      const { error: joinError } = await supabase
        .from('party_members')
        .insert({
          party_id: party.id,
          user_id: user?.id
        }) as any;
      
      if (joinError) throw joinError;
      
      setActiveParty(party as Party);
      
      toast({
        title: "Joined successfully!",
        description: `You have joined the study party "${party.name}".`
      });
      
      // Reset the form
      setPartyCode("");
      setActiveTab("create");
    } catch (error: any) {
      console.error("Error joining party:", error);
      toast({
        title: "Error joining party",
        description: error.message,
        variant: "destructive"
      });
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const leaveParty = async () => {
    if (!user || !activeParty) return;
    
    try {
      const { error } = await supabase
        .from('party_members')
        .delete()
        .eq('party_id', activeParty.id)
        .eq('user_id', user.id) as any;
      
      if (error) throw error;
      
      setActiveParty(null);
      
      toast({
        title: "Left party",
        description: "You have left the study party."
      });
    } catch (error: any) {
      toast({
        title: "Error leaving party",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Share this code with friends to invite them."
    });
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };
  
  // Show active party view if user is in a party
  if (activeParty) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8 page-transition">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Active Study Party</h1>
          <p className="text-muted-foreground">You're currently studying with friends in "{activeParty.name}"</p>
        </div>
        
        <Card className="glass shadow-soft-lg overflow-hidden mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <Users className="h-8 w-8 text-primary" />
              </div>
              
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-1">{activeParty.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">Party Code: {activeParty.code}</p>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mb-4"
                  onClick={() => copyToClipboard(activeParty.code)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Share Code
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <Button 
                  className="w-full" 
                  onClick={() => navigateTo("/timer")}
                >
                  <Cat className="h-4 w-4 mr-2" />
                  Party Timer
                </Button>
                <Button 
                  className="w-full" 
                  onClick={() => navigateTo("/tasks")}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Party Tasks
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                className="mt-8" 
                onClick={leaveParty}
              >
                Leave Party
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Cat Illustrations */}
        <div className="mt-16 flex justify-center items-end gap-12">
          <div className="relative">
            <div className="animate-float">
              <Cat className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <div className="h-8 border-t-2 border-dashed border-primary/30 w-20"></div>
          
          <div className="relative">
            <div className="animate-float" style={{ animationDelay: "1s" }}>
              <Cat className="h-12 w-12 text-foreground" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
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
                
                <Button 
                  className="w-full" 
                  onClick={generatePartyCode}
                  disabled={isLoading}
                >
                  <Users className="mr-2 h-4 w-4" />
                  {isLoading ? "Creating..." : "Create Study Party"}
                </Button>
                
                {errorMessage && (
                  <div className="text-sm text-destructive mt-2">
                    {errorMessage}
                  </div>
                )}
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
              
              <Button 
                className="w-full" 
                onClick={joinParty}
                disabled={isLoading}
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                {isLoading ? "Joining..." : "Join Study Party"}
              </Button>
              
              {errorMessage && (
                <div className="text-sm text-destructive mt-2">
                  {errorMessage}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
      
      {/* Cat Illustrations using Lucide icons with animation */}
      <div className="mt-16 flex justify-center items-end gap-12">
        <div className="relative">
          <div className="animate-float">
            <Cat className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <div className="h-8 border-t-2 border-dashed border-primary/30 w-20"></div>
        
        <div className="relative">
          <div className="animate-float" style={{ animationDelay: "1s" }}>
            <Cat className="h-12 w-12 text-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Party;
