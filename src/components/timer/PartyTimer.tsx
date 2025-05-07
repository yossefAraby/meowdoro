import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Users, Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Party {
  id: string;
  name: string;
  code: string;
}

export const PartyTimer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeParty, setActiveParty] = useState<Party | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeInSeconds, setTimeInSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [partyMembers, setPartyMembers] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchActiveParty();
    }
  }, [user]);

  useEffect(() => {
    if (activeParty) {
      subscribeToPartyUpdates();
      fetchPartyMembers();
    }

    return () => {
      if (activeParty) {
        supabase.removeChannel('party-timer');
      }
    };
  }, [activeParty]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimeInSeconds(prev => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const fetchActiveParty = async () => {
    if (!user) return;
    
    try {
      const { data: memberships, error } = await supabase
        .from('party_members')
        .select('party:party_id(*)')
        .eq('user_id', user.id)
        .order('joined_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      if (memberships && memberships.length > 0) {
        setActiveParty(memberships[0].party);
      } else {
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Error fetching active party:", error);
      setIsLoading(false);
    }
  };

  const fetchPartyMembers = async () => {
    if (!activeParty) return;
    
    try {
      const { data, error } = await supabase
        .from('party_members')
        .select('user_id')
        .eq('party_id', activeParty.id);
      
      if (error) throw error;
      
      if (data) {
        setPartyMembers(data.map((member: any) => member.user_id));
      }
    } catch (error: any) {
      console.error("Error fetching party members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToPartyUpdates = () => {
    if (!activeParty) return;

    const channel = supabase.channel('party-timer')
      .on(
        'broadcast',
        { event: 'timer-update' },
        (payload) => {
          if (payload.payload.party_id === activeParty.id) {
            const { action, time } = payload.payload;
            
            if (action === 'start') {
              setIsRunning(true);
              setTimeInSeconds(time);
            } else if (action === 'pause') {
              setIsRunning(false);
              setTimeInSeconds(time);
            } else if (action === 'reset') {
              setIsRunning(false);
              setTimeInSeconds(0);
            }
          }
        }
      )
      .subscribe();
  };

  const broadcastTimerUpdate = (action: 'start' | 'pause' | 'reset') => {
    if (!activeParty) return;
    
    supabase.channel('party-timer').send({
      type: 'broadcast',
      event: 'timer-update',
      payload: {
        party_id: activeParty.id,
        action,
        time: action === 'reset' ? 0 : timeInSeconds
      }
    });
  };

  const startTimer = () => {
    setIsRunning(true);
    broadcastTimerUpdate('start');
    
    toast({
      title: "Party timer started",
      description: "Everyone in the party can see this timer."
    });
  };

  const pauseTimer = () => {
    setIsRunning(false);
    broadcastTimerUpdate('pause');
    
    toast({
      title: "Party timer paused",
      description: "Timer has been paused for everyone."
    });
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeInSeconds(0);
    broadcastTimerUpdate('reset');
    
    toast({
      title: "Party timer reset",
      description: "Timer has been reset for everyone."
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  if (isLoading) {
    return <div className="py-8 text-center">Loading party timer...</div>;
  }

  if (!activeParty) {
    return (
      <div className="py-8 text-center">
        <div className="mb-4">
          <Users className="h-16 w-16 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-xl font-semibold mb-2">No Active Party</h3>
          <p className="text-muted-foreground mb-4">
            Join a study party to access the shared timer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <Users className="h-5 w-5 mr-2" />
          {activeParty.name} Timer
        </h3>
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
          Party Mode
        </span>
      </div>

      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="text-4xl font-mono font-bold">
          {formatTime(timeInSeconds)}
        </div>

        <div className="flex space-x-2">
          {!isRunning ? (
            <Button onClick={startTimer} className="gap-2">
              <Play className="h-4 w-4" />
              Start
            </Button>
          ) : (
            <Button onClick={pauseTimer} variant="secondary" className="gap-2">
              <Pause className="h-4 w-4" />
              Pause
            </Button>
          )}
          <Button onClick={resetTimer} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="text-sm text-muted-foreground mt-4">
          <span>Studying with {partyMembers.length} {partyMembers.length === 1 ? 'person' : 'people'}</span>
        </div>
      </div>
    </div>
  );
};
