
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface GuestNameFormProps {
  onSubmit: (firstName: string) => void;
}

export const GuestNameForm = ({ onSubmit }: GuestNameFormProps) => {
  const [firstName, setFirstName] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your first name to continue.",
        variant: "destructive",
      });
      return;
    }
    onSubmit(firstName.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">Welcome to Meowdoro!</h2>
        <p className="text-muted-foreground">Please enter your name to continue.</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          placeholder="Enter your first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          autoFocus
        />
      </div>
      
      <Button type="submit" className="w-full">
        Continue
      </Button>
    </form>
  );
};
