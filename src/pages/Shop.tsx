
import React, { useState } from "react";
import { useShop, availableSiteColors, availableBackgrounds, availableIconPacks, CustomizationItem } from "@/contexts/ShopContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Cat, Image, Package, Gift, Radio, Fish, PlusCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CustomizableCat } from "@/components/shop/CustomizableCat";

const Shop = () => {
  const { 
    fishCount, 
    spendFish, 
    addFish,
    purchasedItems, 
    purchaseItem, 
    activateItem,
    activeSiteColor,
    activeCatColor,
    activeBackground,
    backgroundOpacity,
    setBackgroundOpacity
  } = useShop();
  
  const [currentTab, setCurrentTab] = useState("colors");
  const [showAdDialog, setShowAdDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  // Check if item is purchased
  const isItemPurchased = (category: string, id: string) => {
    return purchasedItems.some(item => item.category === category && item.id === id);
  };
  
  // Check if item is active
  const isItemActive = (category: string, value: string) => {
    switch (category) {
      case "site_color":
        return activeSiteColor === value;
      case "cat_color":
        return activeCatColor === value;
      case "background":
        return activeBackground === value;
      default:
        return false;
    }
  };
  
  // Handle watching ad
  const handleWatchAd = () => {
    setShowAdDialog(true);
    // Simulate ad view after 3 seconds
    setTimeout(() => {
      addFish(1);
      setShowAdDialog(false);
      toast.success("You earned 1 fish from watching an ad!");
    }, 3000);
  };
  
  // Handle friend invite
  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    // In a real app, this would send an invitation email
    addFish(5);
    setInviteEmail("");
    setShowInviteDialog(false);
    toast.success("Invitation sent! You earned 5 fish!");
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 page-transition">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Meowdoro Shop</h1>
          <p className="text-muted-foreground">Customize your experience with fish currency</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
            <Fish className="h-5 w-5 text-primary" />
            <span className="text-xl font-bold">{fishCount}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowAdDialog(true)}
            >
              <Radio className="h-4 w-4" />
              Watch Ad
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowInviteDialog(true)}
            >
              <Gift className="h-4 w-4" />
              Invite Friend
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="colors" className="flex gap-2 items-center">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Site Colors</span>
          </TabsTrigger>
          
          <TabsTrigger value="cat" className="flex gap-2 items-center">
            <Cat className="h-4 w-4" />
            <span className="hidden sm:inline">Cat Styles</span>
          </TabsTrigger>
          
          <TabsTrigger value="backgrounds" className="flex gap-2 items-center">
            <Image className="h-4 w-4" />
            <span className="hidden sm:inline">Backgrounds</span>
          </TabsTrigger>
          
          <TabsTrigger value="icons" className="flex gap-2 items-center">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Icon Packs</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Site Colors</h2>
          <p className="text-muted-foreground mb-6">Customize the primary color of your Meowdoro app (10 fish each)</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {availableSiteColors.map(color => {
              const isPurchased = isItemPurchased('site_color', color.id) || color.id === 'cyan';
              const isActive = isItemActive('site_color', color.value);
              
              return (
                <Card key={color.id} className={cn("overflow-hidden", isActive && "ring-2 ring-primary")}>
                  <div 
                    className="h-24 w-full" 
                    style={{ backgroundColor: color.value.startsWith('#') ? color.value : `hsl(var(--themes-${color.value}))` }}
                  />
                  <CardHeader className="p-3">
                    <CardTitle className="text-base">{color.name}</CardTitle>
                  </CardHeader>
                  <CardFooter className="p-3 pt-0">
                    {isPurchased ? (
                      <Button 
                        variant={isActive ? "secondary" : "outline"} 
                        className="w-full"
                        onClick={() => activateItem({
                          id: color.id,
                          name: color.name,
                          category: "site_color",
                          value: color.value,
                          price: 10,
                          isActive,
                          isPurchased: true
                        })}
                      >
                        {isActive ? "Active" : "Use"}
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        className="w-full"
                        onClick={() => purchaseItem({
                          id: color.id,
                          name: color.name,
                          category: "site_color",
                          value: color.value,
                          price: 10,
                          isActive: false,
                          isPurchased: false
                        })}
                      >
                        <Fish className="h-4 w-4 mr-2" />
                        10 Fish
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="cat" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Cat Colors</h2>
          <p className="text-muted-foreground mb-6">Change the color of your Meowdoro cat companion (10 fish each)</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {availableSiteColors.map(color => {
              const isPurchased = isItemPurchased('cat_color', color.id) || color.id === 'cyan';
              const isActive = isItemActive('cat_color', color.value);
              
              return (
                <Card key={color.id} className={cn("overflow-hidden", isActive && "ring-2 ring-primary")}>
                  <div className="h-32 w-full flex items-center justify-center bg-background">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-[6px]"></div>
                      <CustomizableCat size="lg" className="relative z-10" />
                    </div>
                  </div>
                  <CardHeader className="p-3">
                    <CardTitle className="text-base">{color.name} Cat</CardTitle>
                  </CardHeader>
                  <CardFooter className="p-3 pt-0">
                    {isPurchased ? (
                      <Button 
                        variant={isActive ? "secondary" : "outline"} 
                        className="w-full"
                        onClick={() => activateItem({
                          id: color.id,
                          name: color.name,
                          category: "cat_color",
                          value: color.value,
                          price: 10,
                          isActive,
                          isPurchased: true
                        })}
                      >
                        {isActive ? "Active" : "Use"}
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        className="w-full"
                        onClick={() => purchaseItem({
                          id: color.id,
                          name: color.name,
                          category: "cat_color",
                          value: color.value,
                          price: 10,
                          isActive: false,
                          isPurchased: false
                        })}
                      >
                        <Fish className="h-4 w-4 mr-2" />
                        10 Fish
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="backgrounds" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Backgrounds</h2>
          <p className="text-muted-foreground mb-6">Customize the background of your app (5-10 fish each)</p>
          
          {activeBackground !== "none" && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Background Opacity</h3>
              <Slider 
                value={[backgroundOpacity * 100]} 
                min={10} 
                max={100} 
                step={10}
                onValueChange={(value) => setBackgroundOpacity(value[0] / 100)}
                className="w-full max-w-xs"
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {availableBackgrounds.map(bg => {
              const isPurchased = isItemPurchased('background', bg.id) || bg.id === 'default';
              const isActive = isItemActive('background', bg.value);
              const price = bg.type === 'pattern' ? 10 : 5;
              
              return (
                <Card key={bg.id} className={cn("overflow-hidden", isActive && "ring-2 ring-primary")}>
                  <div 
                    className={cn(
                      "h-32 w-full", 
                      bg.type === 'pattern' && bg.value
                    )} 
                    style={bg.type === 'color' && bg.value !== 'none' ? { backgroundColor: bg.value } : undefined}
                  />
                  <CardHeader className="p-3">
                    <CardTitle className="text-base">{bg.name}</CardTitle>
                    <CardDescription>{bg.type === 'pattern' ? 'Pattern' : 'Solid Color'}</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-3 pt-0">
                    {isPurchased ? (
                      <Button 
                        variant={isActive ? "secondary" : "outline"} 
                        className="w-full"
                        onClick={() => activateItem({
                          id: bg.id,
                          name: bg.name,
                          category: "background",
                          value: bg.value,
                          price,
                          isActive,
                          isPurchased: true
                        })}
                      >
                        {isActive ? "Active" : "Use"}
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        className="w-full"
                        onClick={() => purchaseItem({
                          id: bg.id,
                          name: bg.name,
                          category: "background",
                          value: bg.value,
                          price,
                          isActive: false,
                          isPurchased: false
                        })}
                      >
                        <Fish className="h-4 w-4 mr-2" />
                        {price} Fish
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="icons" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Icon Packs</h2>
          <p className="text-muted-foreground mb-6">Change the style of icons in the app (15 fish each)</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {availableIconPacks.map(pack => {
              const isPurchased = isItemPurchased('icon_pack', pack.id) || pack.id === 'default';
              const isActive = pack.value === activeBackground;
              
              return (
                <Card key={pack.id} className={cn("overflow-hidden", isActive && "ring-2 ring-primary")}>
                  <div className="h-32 w-full bg-muted flex items-center justify-center gap-4">
                    {pack.id === 'default' && (
                      <>
                        <Timer className="w-8 h-8 text-primary" />
                        <CheckSquare className="w-8 h-8 text-primary" />
                        <Users className="w-8 h-8 text-primary" />
                      </>
                    )}
                    {pack.id === 'rounded' && (
                      <>
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Timer className="w-5 h-5 text-primary" />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <CheckSquare className="w-5 h-5 text-primary" />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                      </>
                    )}
                    {pack.id === 'minimal' && (
                      <>
                        <Timer className="w-8 h-8 text-primary stroke-[1.25]" />
                        <CheckSquare className="w-8 h-8 text-primary stroke-[1.25]" />
                        <Users className="w-8 h-8 text-primary stroke-[1.25]" />
                      </>
                    )}
                  </div>
                  <CardHeader className="p-3">
                    <CardTitle className="text-base">{pack.name}</CardTitle>
                  </CardHeader>
                  <CardFooter className="p-3 pt-0">
                    {isPurchased ? (
                      <Button 
                        variant={isActive ? "secondary" : "outline"} 
                        className="w-full"
                        onClick={() => activateItem({
                          id: pack.id,
                          name: pack.name,
                          category: "icon_pack",
                          value: pack.value,
                          price: 15,
                          isActive,
                          isPurchased: true
                        })}
                      >
                        {isActive ? "Active" : "Use"}
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        className="w-full"
                        onClick={() => purchaseItem({
                          id: pack.id,
                          name: pack.name,
                          category: "icon_pack",
                          value: pack.value,
                          price: 15,
                          isActive: false,
                          isPurchased: false
                        })}
                      >
                        <Fish className="h-4 w-4 mr-2" />
                        15 Fish
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Watch Ad Dialog */}
      <Dialog open={showAdDialog} onOpenChange={setShowAdDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Watching Advertisement</DialogTitle>
            <DialogDescription>
              This is a demonstration of the ad feature. In a real app, this would show an actual advertisement.
            </DialogDescription>
          </DialogHeader>
          
          <div className="h-40 bg-muted rounded-md flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium">AD PLACEHOLDER</p>
              <p className="text-sm text-muted-foreground mt-2">You'll receive 1 fish after watching</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Invite Friend Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a Friend</DialogTitle>
            <DialogDescription>
              Enter your friend's email to send them an invitation to Meowdoro. You'll receive 5 fish for each friend who joins!
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleInvite} className="space-y-4">
            <Input
              type="email"
              placeholder="friend@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
            />
            
            <Button type="submit" className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              Send Invite
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Shop;
