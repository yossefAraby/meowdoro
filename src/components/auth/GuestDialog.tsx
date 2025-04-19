
import React from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const GuestDialog = ({ onClose }: { onClose?: () => void }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleContinueAsGuest = () => {
    // Set a dummy user in localStorage to simulate login
    localStorage.setItem("meowdoro-user", JSON.stringify({ id: "guest", name: "Guest" }));
    
    // Dispatch custom event to notify about auth change
    window.dispatchEvent(new Event('auth-change'));
    
    // Navigate to the timer page
    navigate("/timer");
    
    toast({
      title: "Welcome to Meowdoro!",
      description: "You've joined as a guest. Your progress won't be saved between sessions."
    });
    
    if (onClose) onClose();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          Continue as Guest
        </Button>
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Continue as Guest?</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            As a guest, you can use most features but your progress won't be saved between sessions.
            Consider creating an account to:
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Save your timer preferences</li>
            <li>Keep track of your tasks</li>
            <li>Join study parties with friends</li>
            <li>Sync across devices</li>
          </ul>
        </div>
        
        <div className="flex justify-end gap-3">
          <DialogTrigger asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogTrigger>
          <Button onClick={handleContinueAsGuest}>Continue as Guest</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
