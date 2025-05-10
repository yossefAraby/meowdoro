import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        "Free limited Gemini model",
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
        "Unlimited Gemini + Deepseek access",
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

  // Detect if we're on a mobile device
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on mount
    checkIfMobile();
    
    // Add listener for resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className={cn(
        "sm:max-w-xl md:max-w-3xl lg:max-w-4xl",
        "p-4 md:p-6",
        "w-[95vw] md:w-auto"
      )}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl md:text-2xl font-bold">
            <Sparkles className="h-5 w-5 text-primary" /> Plans & Pricing
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-2 md:py-4">
          {/* Billing cycle tabs */}
          <div className="flex justify-center mb-4 md:mb-6">
            <Tabs 
              value={billingCycle} 
              onValueChange={(value) => setBillingCycle(value as "monthly" | "yearly")}
              className="w-full max-w-xs md:max-w-sm"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly" className="relative">
                  Yearly
                  <span className="absolute -top-2 -right-1 text-[10px] md:text-xs bg-primary/20 text-primary px-1 md:px-2 py-0.5 rounded-full">
                    Save 20%
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Pricing cards - stacked on mobile, side by side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {pricingTiers.map((tier) => (
              <div 
                key={tier.name}
                className={cn(
                  "rounded-xl border p-4 md:p-6 flex flex-col",
                  tier.highlighted && "border-primary/50 shadow-lg shadow-primary/10 relative"
                )}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    Recommended
                  </div>
                )}
                
                <div className="mb-3 md:mb-4">
                  <h3 className="text-lg md:text-xl font-bold">{tier.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{tier.description}</p>
                </div>
                
                <div className="mb-4 md:mb-6">
                  <div className="flex items-baseline">
                    <span className="text-2xl md:text-3xl font-bold">
                      {billingCycle === "yearly" && tier.yearlyPrice ? tier.yearlyPrice : tier.price}
                    </span>
                    {(tier.price !== "$0") && (
                      <span className="text-xs md:text-sm text-muted-foreground ml-1">
                        /month
                        {billingCycle === "yearly" && " billed annually"}
                      </span>
                    )}
                  </div>
                </div>
                
                <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8 text-sm md:text-base">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex">
                      <Check className="text-primary h-4 w-4 md:h-5 md:w-5 mr-2 shrink-0 mt-0.5 md:mt-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-auto">
                  <Button 
                    className={cn("w-full", 
                      tier.name === "Free" && user ? "bg-muted hover:bg-muted text-muted-foreground" : ""
                    )}
                    size={isMobile ? "sm" : "default"}
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
          
          <div className="mt-4 md:mt-8 text-center text-xs md:text-sm text-muted-foreground">
            Questions about our plans? <a href="#" className="text-primary hover:underline">Contact us</a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
