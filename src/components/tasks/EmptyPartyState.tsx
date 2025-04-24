
import React from "react";
import { Users } from "lucide-react";

export const EmptyPartyState = () => {
  return (
    <div className="py-8 text-center">
      <div className="mb-4">
        <Users className="h-16 w-16 mx-auto text-muted-foreground mb-2" />
        <h3 className="text-xl font-semibold mb-2">No Active Party</h3>
        <p className="text-muted-foreground mb-4">
          Join a study party to access shared tasks.
        </p>
      </div>
    </div>
  );
};
