import React, { useState, useEffect } from "react";
import { useShop, availableSiteColors, availableBackgrounds, availableIconPacks, CustomizationItem } from "@/contexts/ShopContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Cat, Image, ShoppingBag, Gift, Radio, Fish, PlusCircle, Timer, CheckSquare, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CustomizableCat } from "@/components/shop/CustomizableCat";
import { useTheme } from "@/components/layout/ThemeProvider";

const Shop = () => {
  const { 
    fishCount, 
    spendFish, 
    addFish,
    purchasedItems, 
    purchaseItem,
    loadSavedItem,
    sellItem,
    activateItem,
    activeSiteColor,
    activeCatColor,
    activeBackground,
    backgroundOpacity,
    setBackgroundOpacity
  } = useShop();
  
  const { setTheme } = useTheme();
  
  const [currentTab, setCurrentTab] = useState("colors");
  const [showAdDialog, setShowAdDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showFirstTimeGift, setShowFirstTimeGift] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [customColor, setCustomColor] = useState("#5EC7ED");
  const [customColorName, setCustomColorName] = useState("");
  const [customCatColor, setCustomCatColor] = useState("#5EC7ED");
  const [customCatColorName, setCustomCatColorName] = useState("");

  // Check for first-time visit and daily check-in
  useEffect(() => {
    const lastVisit = localStorage.getItem('meowdoro-last-visit');
    const today = new Date().toDateString();
    const hasReceivedGift = localStorage.getItem('meowdoro-first-gift');

    // Check for first-time gift
    if (!hasReceivedGift) {
      setShowFirstTimeGift(true);
      localStorage.setItem('meowdoro-first-gift', 'true');
    }

    // Check for daily check-in
    if (lastVisit !== today) {
      addFish(2);
      localStorage.setItem('meowdoro-last-visit', today);
      toast.success("Daily check-in reward: 2 fish!");
    }
  }, []);

  // We don't need to load custom colors here anymore since it's handled in the ShopContext

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
  
  // Function to handle site color activation with immediate theme change
  const handleSiteColorActivation = (color: CustomizationItem) => {
    activateItem(color);
    // Immediately update the theme
    setTheme(color.value);
  };
  
  // Store purchased colors in local storage
  useEffect(() => {
    if (purchasedItems.length > 0) {
      const customColors = purchasedItems.filter(item => 
        (item.category === 'site_color' || item.category === 'cat_color') && 
        item.id.startsWith('custom_')
      );
      
      if (customColors.length > 0) {
        localStorage.setItem('meowdoro-custom-colors', JSON.stringify(customColors));
      }
    }
  }, [purchasedItems]);
  
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
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Icon Packs</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Custom Color Shop</h2>
          <p className="text-muted-foreground mb-6">Create and purchase your own custom colors (10 fish each)</p>
          
          {/* Custom Color Picker */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create Your Color</CardTitle>
              <CardDescription>Choose any color you want for your Meowdoro app</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Pick a color</label>
                    <div className="flex gap-3 items-center">
                      <input 
                        type="color" 
                        value={customColor} 
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="w-12 h-12 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customColor}
                        onChange={(e) => {
                          // Validate hex color
                          const hex = e.target.value;
                          if (/^#([0-9A-F]{3}){1,2}$/i.test(hex)) {
                            setCustomColor(hex);
                          } else if (hex.startsWith('#') && hex.length <= 7) {
                            setCustomColor(hex);
                          }
                        }}
                        className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Name your color</label>
                    <Input 
                      value={customColorName} 
                      onChange={(e) => setCustomColorName(e.target.value)}
                      placeholder="My Awesome Color"
                      className="max-w-xs"
                    />
                  </div>
                  
                  <Button 
                    variant="default" 
                    className="mt-2"
                    disabled={!customColorName || customColorName.trim() === ''}
                    onClick={() => {
                      // Create a unique ID for the custom color
                      const colorId = `custom_${Date.now()}`;
                      purchaseItem({
                        id: colorId,
                        name: customColorName,
                        category: "site_color",
                        value: customColor,
                        price: 10,
                        isActive: false,
                        isPurchased: false
                      });
                      // Reset form
                      setCustomColorName('');
                    }}
                  >
                    <Fish className="h-4 w-4 mr-2" />
                    Purchase for 10 Fish
                  </Button>
                </div>
                
                <div className="flex-1">
                  <div className="text-sm font-medium mb-2">Preview</div>
                  <div className="rounded-lg overflow-hidden border">
                    <div 
                      className="h-32 w-full" 
                      style={{ backgroundColor: customColor }}
                    />
                    <div className="p-3 bg-card">
                      <h3 className="font-medium">{customColorName || 'Your Color'}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{customColor}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Purchased Colors */}
          <h3 className="text-lg font-semibold mt-8 mb-4">Your Color Collection</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* User's purchased colors */}
            {purchasedItems
              .filter(item => item.category === 'site_color')
              .map(color => {
                const isActive = isItemActive('site_color', color.value);
                
                return (
                  <Card key={color.id} className={cn("overflow-hidden relative", isActive && "ring-2 ring-primary")}>
                    <div 
                      className="h-24 w-full" 
                      style={{ backgroundColor: color.value.startsWith('#') ? color.value : `hsl(var(--themes-${color.value}))` }}
                    />
                    {!isActive && (
                      <Button 
                        variant="destructive"
                        className="w-8 h-8 p-0 rounded-full flex items-center justify-center absolute top-2 right-2 z-20 shadow-md"
                        onClick={() => sellItem(color)}
                        aria-label="Sell color"
                      >
                        $
                      </Button>
                    )}
                    <CardHeader className="p-3">
                      <CardTitle className="text-base">{color.name}</CardTitle>
                      <CardDescription className="text-xs">{color.value}</CardDescription>
                    </CardHeader>
                    <CardFooter className="p-3 pt-0">
                      <div className="flex w-full gap-2">
                        <Button 
                          variant={isActive ? "secondary" : "outline"} 
                          className="w-full"
                          onClick={() => handleSiteColorActivation({
                            ...color,
                            isActive
                          })}
                        >
                          {isActive ? "Active" : "Use"}
                        </Button>

                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
          </div>
        </TabsContent>
        
        <TabsContent value="cat" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Custom Cat Colors</h2>
          <p className="text-muted-foreground mb-6">Create and purchase custom colors for your Meowdoro cat companion (10 fish each)</p>
          
          {/* Custom Cat Color Picker */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create Your Cat Color</CardTitle>
              <CardDescription>Choose any color for your cat companion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Pick a color</label>
                    <div className="flex gap-3 items-center">
                      <input 
                        type="color" 
                        value={customCatColor} 
                        onChange={(e) => setCustomCatColor(e.target.value)}
                        className="w-12 h-12 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customCatColor}
                        onChange={(e) => {
                          // Validate hex color
                          const hex = e.target.value;
                          if (/^#([0-9A-F]{3}){1,2}$/i.test(hex)) {
                            setCustomCatColor(hex);
                          } else if (hex.startsWith('#') && hex.length <= 7) {
                            setCustomCatColor(hex);
                          }
                        }}
                        className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Name your cat color</label>
                    <Input 
                      value={customCatColorName} 
                      onChange={(e) => setCustomCatColorName(e.target.value)}
                      placeholder="My Awesome Cat"
                      className="max-w-xs"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2 items-start">
                    <Button 
                      variant="default" 
                      className="inline-flex"
                      disabled={!customCatColorName || customCatColorName.trim() === ''}
                      onClick={() => {
                        // Create a unique ID for the custom color
                        const colorId = `custom_cat_${Date.now()}`;
                        purchaseItem({
                          id: colorId,
                          name: customCatColorName,
                          category: "cat_color",
                          value: customCatColor,
                          price: 10,
                          isActive: false,
                          isPurchased: false
                        });
                        // Reset form
                        setCustomCatColorName('');
                      }}
                    >
                      <Fish className="h-4 w-4 mr-2" />
                      Purchase for 10 Fish
                    </Button>

                    <Button 
                      variant="outline" 
                      className="inline-flex"
                      onClick={() => activateItem({
                        id: "reset",
                        name: "Reset",
                        category: "cat_color",
                        value: "reset",
                        price: 0,
                        isActive: activeCatColor === "reset",
                        isPurchased: true
                      })}
                    >
                      {activeCatColor === "reset" ? "Default Active" : "Reset to Default"}
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="text-sm font-medium mb-2">Preview</div>
                  <div className="rounded-lg overflow-hidden border">
                    <div className="h-40 w-full flex items-center justify-center bg-background">
                      <div className="relative">
                        <div className="relative z-10">
                          <CustomizableCat size="lg" previewColor={customCatColor} />
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-card">
                      <h3 className="font-medium">{customCatColorName || 'Your Cat Color'}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{customCatColor}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Purchased Cat Colors */}
          <h3 className="text-lg font-semibold mt-8 mb-4">Your Cat Color Collection</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* User's purchased cat colors */}
            {purchasedItems
              .filter(item => item.category === 'cat_color')
              .map(color => {
                const isActive = isItemActive('cat_color', color.value);
                
                return (
                  <Card key={color.id} className={cn("overflow-hidden relative", isActive && "ring-2 ring-primary")}>
                    <div className="h-32 w-full flex items-center justify-center bg-background">
                      <div className="relative">
                        <div className="relative z-10">
                          <CustomizableCat size="lg" previewColor={color.value} />
                        </div>
                      </div>
                    </div>
                    {!isActive && (
                      <Button 
                        variant="destructive"
                        className="w-8 h-8 p-0 rounded-full flex items-center justify-center absolute top-2 right-2 z-20 shadow-md"
                        onClick={() => sellItem(color)}
                        aria-label="Sell color"
                      >
                        $
                      </Button>
                    )}
                    <CardHeader className="p-3">
                      <CardTitle className="text-base">{color.name}</CardTitle>
                      <CardDescription className="text-xs">{color.value}</CardDescription>
                    </CardHeader>
                    <CardFooter className="p-3 pt-0">
                      <div className="flex w-full gap-2">
                        <Button 
                          variant={isActive ? "secondary" : "outline"} 
                          className="w-full"
                          onClick={() => activateItem({
                            ...color,
                            isActive
                          })}
                        >
                          {isActive ? "Active" : "Use"}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
          </div>
        </TabsContent>
        
        <TabsContent value="backgrounds" className="space-y-4">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h2 className="text-2xl font-semibold mb-2">Coming Soon!</h2>
            <p className="text-muted-foreground">Background customization will be available in a future update.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="icons" className="space-y-4">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h2 className="text-2xl font-semibold mb-2">Coming Soon!</h2>
            <p className="text-muted-foreground">Icon pack customization will be available in a future update.</p>
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

      {/* First Time Gift Dialog */}
      <Dialog open={showFirstTimeGift} onOpenChange={setShowFirstTimeGift}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Welcome to Meowdoro Shop!
            </DialogTitle>
            <DialogDescription>
              As a special welcome gift, we're giving you 20 fish to start customizing your experience!
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
              <Fish className="h-8 w-8" />
              <span>+20</span>
            </div>
          </div>

          <Button 
            className="w-full" 
            onClick={() => {
              addFish(20);
              setShowFirstTimeGift(false);
            }}
          >
            Claim Gift
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Shop;
