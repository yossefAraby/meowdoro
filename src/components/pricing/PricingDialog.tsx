
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type PricingTier = {
  name: string;
  price: string;
  yearlyPrice?: string;
  description: string;
  features: string[];
  buttonText: string;
  highlighted?: boolean;
};

interface PricingDialogProps {
  open: boolean;
  onClose: () => void;
}

export const PricingDialog: React.FC<PricingDialogProps> = ({ open, onClose }) => {
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">("monthly");
  const { user } = useAuth();
  const { toast } = useToast();
  
  const pricingTiers: PricingTier[] = [
    {
      name: "Free",
      price: "$0",
      description: "Basic features for personal use",
      features: [
        "Full access to Pomodoro timer",
        "Full access to tasks/notes",
        "Limited to only one active party",
        "AI-Ready prompts linked to external LLMs",
      ],
      buttonText: user ? "Current Plan" : "Get Started",
    },
    {
      name: "Pro",
      price: "$5",
      yearlyPrice: "$4",
      description: "Everything you need for maximum productivity",
      features: [
        "Everything in Free plan",
        "Unlimited party access",
        "Monthly Meowdoro AI requests with tasks and study session analysis",
      ],
      buttonText: "Upgrade",
      highlighted: true,
    },
  ];
  
  const handleUpgrade = () => {
    // This would connect to a payment processor in a real app
    toast({
      title: "Upgrade coming soon!",
      description: "This feature is not yet implemented. Check back later!",
    });
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <Sparkles className="h-5 w-5 text-primary" /> Plans & Pricing
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {/* Billing cycle toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-muted/50 p-1 rounded-full inline-flex">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  billingCycle === "monthly" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  billingCycle === "yearly" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                Yearly <span className="text-xs opacity-80">Save 20%</span>
              </button>
            </div>
          </div>
          
          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pricingTiers.map((tier) => (
              <div 
                key={tier.name}
                className={cn(
                  "rounded-xl border p-6 flex flex-col",
                  tier.highlighted && "border-primary/50 shadow-lg shadow-primary/10 relative"
                )}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    Recommended
                  </div>
                )}
                
                <div className="mb-4">
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{tier.description}</p>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">
                      {billingCycle === "yearly" && tier.yearlyPrice ? tier.yearlyPrice : tier.price}
                    </span>
                    {(tier.price !== "$0") && (
                      <span className="text-sm text-muted-foreground ml-1">
                        /month
                        {billingCycle === "yearly" && " billed annually"}
                      </span>
                    )}
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex">
                      <Check className="text-primary h-5 w-5 mr-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-auto">
                  <Button 
                    className={cn("w-full", 
                      tier.name === "Free" && user ? "bg-muted hover:bg-muted text-muted-foreground" : ""
                    )}
                    variant={tier.highlighted ? "default" : "outline"}
                    onClick={tier.name === "Pro" ? handleUpgrade : onClose}
                    disabled={tier.name === "Free" && !!user}
                  >
                    {tier.buttonText}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Questions about our plans? <a href="#" className="text-primary hover:underline">Contact us</a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
