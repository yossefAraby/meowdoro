
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GuestDialogProps {
  onClose?: () => void;
}

export const GuestDialog: React.FC<GuestDialogProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContinueAsGuest = () => {
    if (!firstName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your first name to continue.",
        variant: "destructive",
      });
      return;
    }

    // Store guest info in localStorage
    const guestUser = {
      id: `guest-${Date.now()}`,
      first_name: firstName.trim(),
      isGuest: true
    };
    localStorage.setItem("meowdoro-user", JSON.stringify(guestUser));
    
    toast({
      title: "Welcome!",
      description: "You've joined as a guest. Some features will be limited.",
    });
    
    // Dispatch auth change event
    window.dispatchEvent(new Event('auth-change'));
    
    navigate("/timer");
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Continue as Guest</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Continue as Guest</DialogTitle>
          <DialogDescription>
            Enter your name to use Meowdoro without creating an account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              As a guest, you'll have access to:
            </p>
            <ul className="text-sm space-y-1 list-disc pl-5">
              <li>Pomodoro timer</li>
              <li>Local task management</li>
              <li>Background sounds</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Create an account to unlock all features including syncing across devices, 
              study parties, and more!
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleContinueAsGuest}>
            Continue as Guest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
