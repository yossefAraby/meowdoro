
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

export const GuestDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContinueAsGuest = () => {
    toast({
      title: "Continuing as guest",
      description: "You can create an account later to save your progress.",
    });
    navigate("/timer");
    setIsOpen(false);
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
            You can use Meowdoro without creating an account, but your progress won't be saved.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
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
