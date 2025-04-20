
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PartyMember {
  id: string;
  first_name: string;
  joined_at: string;
}

interface PartyMembersProps {
  partyId: string;
  members: PartyMember[];
  isHost: boolean;
  onMemberRemoved: (memberId: string) => void;
}

export const PartyMembers = ({ partyId, members, isHost, onMemberRemoved }: PartyMembersProps) => {
  const { toast } = useToast();

  const removeMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('party_members')
        .delete()
        .eq('party_id', partyId)
        .eq('user_id', memberId);
      
      if (error) throw error;
      
      onMemberRemoved(memberId);
      
      toast({
        title: "Member removed",
        description: "The member has been removed from the party."
      });
    } catch (error: any) {
      toast({
        title: "Error removing member",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Party Members</h3>
      <div className="space-y-2">
        {members.map((member) => (
          <div 
            key={member.id}
            className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50"
          >
            <span>{member.first_name}</span>
            {isHost && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeMember(member.id)}
                className="h-8 w-8 text-destructive/70 hover:text-destructive"
              >
                <UserX className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
