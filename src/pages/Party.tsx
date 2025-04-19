import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Cat, Users, Link, Copy, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Party: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("create");
  const [partyName, setPartyName] = useState("");
  const [partyCode, setPartyCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  
  const { toast } = useToast();
  
  const generatePartyCode = async () => {
    if (!partyName.trim()) {
      toast({
        title: "Party name required",
        description: "Please enter a name for your study party.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { error } = await supabase
        .from('study_parties')
        .insert({
          name: partyName,
          code,
          created_by: user?.id
        });
      
      if (error) throw error;
      
      setGeneratedCode(code);
      toast({
        title: "Party created!",
        description: `Your study party "${partyName}" is ready to share.`
      });
    } catch (error: any) {
      toast({
        title: "Error creating party",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const joinParty = async () => {
    if (!partyCode.trim()) {
      toast({
        title: "Party code required",
        description: "Please enter a valid party code to join.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // First find the party
      const { data: party, error: findError } = await supabase
        .from('study_parties')
        .select('id')
        .eq('code', partyCode)
        .single();
      
      if (findError) throw findError;
      
      // Then join it
      const { error: joinError } = await supabase
        .from('party_members')
        .insert({
          party_id: party.id,
          user_id: user?.id
        });
      
      if (joinError) throw joinError;
      
      toast({
        title: "Joined successfully!",
        description: "You have joined the study party."
      });
      
      // Reset the form
      setPartyCode("");
      setActiveTab("create");
    } catch (error: any) {
      toast({
        title: "Error joining party",
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
