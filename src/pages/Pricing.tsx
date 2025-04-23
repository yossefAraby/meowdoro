
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChevronsUp, Check, X } from "lucide-react";

const Pricing: React.FC = () => {
  const [annual, setAnnual] = useState(false);
  
  // Calculate discounted prices for annual billing (20% discount)
  const getPrice = (monthly: number) => {
    const annualPrice = monthly * 12 * 0.8;
    return annual ? annualPrice.toFixed(0) : monthly.toFixed(0);
  };
  
  const period = annual ? "year" : "month";

  // Features for each tier
  const features = {
    free: {
      included: ["Up to 60 min focus time daily", "Basic task management", "Access to public study parties"],
      excluded: ["Unlimited focus time", "Advanced task analytics", "Priority support", "Custom sounds", "Private study parties", "API access"],
    },
    starter: {
      included: [
        "Up to 3 hours focus time daily", 
        "Task management with tags", 
        "Access to all study parties", 
        "Custom sounds"
      ],
      excluded: ["Unlimited focus time", "Advanced task analytics", "Priority support", "API access"],
    },
    pro: {
      included: [
        "Unlimited focus time", 
        "Task management with tags", 
        "Advanced task analytics", 
        "Access to all study parties", 
        "Custom sounds and themes", 
        "Priority support",
        "API access"
      ],
      excluded: [],
    },
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-16 page-transition">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that works for you and your productivity goals. All plans include our core features.
        </p>
        
        <div className="flex items-center justify-center mt-8 space-x-2">
          <Label htmlFor="billing-toggle" className={!annual ? "font-medium" : "text-muted-foreground"}>
            Monthly
          </Label>
          <Switch 
            id="billing-toggle" 
            checked={annual} 
            onCheckedChange={setAnnual}
          />
          <Label htmlFor="billing-toggle" className={annual ? "font-medium" : "text-muted-foreground"}>
            Annual <Badge variant="outline" className="ml-2 bg-primary/10">Save 20%</Badge>
          </Label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Tier */}
        <Card className="border-muted/70 flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>Get started with essential productivity tools</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">$0</span>
              <span className="text-muted-foreground ml-1">/ forever</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {features.free.included.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check size={18} className="text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
              {features.free.excluded.map((feature) => (
                <li key={feature} className="flex items-center text-muted-foreground">
                  <X size={18} className="mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Get Started
            </Button>
          </CardFooter>
        </Card>
        
        {/* Starter Tier */}
        <Card className="border-muted/70 flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">Starter</CardTitle>
            <CardDescription>Perfect for dedicated focus sessions</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">${getPrice(5)}</span>
              <span className="text-muted-foreground ml-1">/ {period}</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {features.starter.included.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check size={18} className="text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
              {features.starter.excluded.map((feature) => (
                <li key={feature} className="flex items-center text-muted-foreground">
                  <X size={18} className="mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Choose Starter
            </Button>
          </CardFooter>
        </Card>
        
        {/* Pro Tier */}
        <Card className="border-primary flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl">
            Most Popular
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">Pro</CardTitle>
            <CardDescription>Unlock maximum productivity</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">${getPrice(12)}</span>
              <span className="text-muted-foreground ml-1">/ {period}</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {features.pro.included.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check size={18} className="text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <ChevronsUp className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Need something custom?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          For teams or organizations with special requirements, we offer custom solutions.
        </p>
        <Button variant="outline" size="lg">
          Contact Sales
        </Button>
      </div>
    </div>
  );
};

export default Pricing;
