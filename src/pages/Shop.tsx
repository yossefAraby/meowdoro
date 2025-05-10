import React, { useState, useEffect, useCallback } from "react";
import { useShop, availableSiteColors, availableBackgrounds, availableIconPacks, CustomizationItem } from "@/contexts/ShopContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Cat, Image, ShoppingBag, Gift, Radio, Fish, PlusCircle, Timer, CheckSquare, Users, Trash2 } from "lucide-react";
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
  const [showDailyRewardDialog, setShowDailyRewardDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [rewardToDelete, setRewardToDelete] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [customColor, setCustomColor] = useState("#5EC7ED");
  const [customColorName, setCustomColorName] = useState("");
  const [customCatColor, setCustomCatColor] = useState("#5EC7ED");
  const [customCatColorName, setCustomCatColorName] = useState("");
  
  // States for custom rewards
  const [rewardTitle, setRewardTitle] = useState("Coffee Break");
  const [rewardDescription, setRewardDescription] = useState("Take a 15-minute coffee break");
  const [rewardPrice, setRewardPrice] = useState("5");
  const [rewardImage, setRewardImage] = useState("https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=500&auto=format");
  const [customRewards, setCustomRewards] = useState<any[]>([]);
  const [isValidImageUrl, setIsValidImageUrl] = useState(true);
  const [isCreatingReward, setIsCreatingReward] = useState(false);
  const [rewardsRedeemed, setRewardsRedeemed] = useState<number>(() => {
    try {
      const count = localStorage.getItem('meowdoro-rewards-redeemed');
      return count ? parseInt(count, 10) : 0;
    } catch {
      return 0;
    }
  });
  
  // Load custom rewards from localStorage
  useEffect(() => {
    try {
      const savedRewards = localStorage.getItem('meowdoro-custom-rewards');
      if (savedRewards) {
        setCustomRewards(JSON.parse(savedRewards));
      }
    } catch (error) {
      console.error("Error loading rewards:", error);
    }
  }, [currentTab]);

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
      addFish(1);
      localStorage.setItem('meowdoro-last-visit', today);
      setShowDailyRewardDialog(true);
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
  
  // Direct CSS reset function for immediate theme changes
  const resetToDefaultColor = useCallback(() => {
    // 1. Get the root element
    const root = document.documentElement;
    
    // 2. Remove any theme classes
    ["cyan", "green", "yellow", "lavender", "peach", "mint", "rose"].forEach(themeName => {
      root.classList.remove(`theme-${themeName}`);
    });
    
    // 3. Reset CSS custom properties directly
    // The default cyan color HSL values
    const mode = document.documentElement.classList.contains("dark") ? "dark" : "light";
    const primaryHue = 195; // Cyan hue
    const primarySaturation = 83;
    const primaryLightness = mode === "dark" ? 65 : 45;
    
    // Apply them directly
    root.style.setProperty('--primary', `${primaryHue} ${primarySaturation}% ${primaryLightness}%`);
    
    // 4. Update localStorage
    localStorage.setItem("meowdoro-theme", "cyan");
    
    // 5. Update React state
    activateItem({
      id: "cyan",
      name: "Cyan",
      category: "site_color",
      value: "cyan",
      price: 0,
      isActive: true,
      isPurchased: true
    });
    
    // 6. Update theme context - but this happens after the direct DOM changes
    setTheme("cyan");
    
    // 7. Notify the user
    toast.success("Reset to default Cyan color");
  }, [activateItem, setTheme, toast]);
  
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

  // Validate image URL
  const validateImageUrl = (url: string) => {
    if (!url) return true; // Empty URL is considered valid (will use default)
    
    try {
      new URL(url);
      // Basic check if URL ends with image extension
      const isImageUrl = /\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i.test(url);
      // For unsplash URLs
      const isUnsplashUrl = url.includes('unsplash.com');
      
      setIsValidImageUrl(isImageUrl || isUnsplashUrl);
      return isImageUrl || isUnsplashUrl;
    } catch {
      setIsValidImageUrl(false);
      return false;
    }
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 page-transition">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Meowdoro Shop</h1>
          <p className="text-muted-foreground">Check in daily for free fish!</p>
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
        <TabsList className="grid grid-cols-5 mb-8">
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
          
          <TabsTrigger value="rewards" className="flex gap-2 items-center">
            <Gift className="h-4 w-4" />
            <span className="hidden sm:inline">Rewards</span>
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
                  
                  <div className="flex flex-col gap-2 items-start">
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
                    
                    <Button 
                      variant="outline" 
                      className="inline-flex mt-2"
                      onClick={resetToDefaultColor}
                    >
                      {activeSiteColor === "cyan" ? "Default Active" : "Reset to Default"}
                    </Button>
                  </div>
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
                          onClick={() => handleSiteColorActivation(color)}
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
        
        <TabsContent value="rewards" className="space-y-4">
          <style>
            {`
              @keyframes rewardRedeemAnimation {
                0% { transform: scale(1); box-shadow: 0 0 0 rgba(74, 222, 128, 0); }
                50% { transform: scale(1.05); box-shadow: 0 0 15px rgba(74, 222, 128, 0.5); }
                100% { transform: scale(1); box-shadow: 0 0 0 rgba(74, 222, 128, 0); }
              }
              
              .animate-reward-redeem {
                animation: rewardRedeemAnimation 1s ease-in-out;
              }
            `}
          </style>
          <h2 className="text-xl font-semibold mb-4">Custom Rewards</h2>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <p className="text-muted-foreground">Create your own custom rewards to keep yourself motivated</p>
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
              <Gift className="h-5 w-5 text-primary" />
              <span className="text-sm"><span className="font-bold">{rewardsRedeemed}</span> rewards redeemed</span>
            </div>
          </div>
          
          {/* Custom Reward Creator */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create a Custom Reward</CardTitle>
              <CardDescription>Design personalized rewards to motivate your productivity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Reward Title</label>
                    <Input 
                      placeholder="e.g., Coffee Break"
                      className="max-w-xs"
                      value={rewardTitle}
                      onChange={(e) => setRewardTitle(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Input 
                      placeholder="e.g., Take a 15-minute coffee break"
                      className="max-w-xs"
                      value={rewardDescription}
                      onChange={(e) => setRewardDescription(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Fish Price</label>
                    <Input 
                      placeholder="e.g., 5"
                      type="number"
                      min="1"
                      max="100"
                      className="max-w-xs"
                      value={rewardPrice}
                      onChange={(e) => setRewardPrice(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Banner Image URL (optional)</label>
                    <div className="flex flex-col space-y-1">
                      <Input 
                        placeholder="https://example.com/image.jpg"
                        className={cn("max-w-xs", !isValidImageUrl && "border-red-500")}
                        value={rewardImage}
                        onChange={(e) => {
                          setRewardImage(e.target.value);
                          validateImageUrl(e.target.value);
                        }}
                      />
                      {!isValidImageUrl && (
                        <p className="text-xs text-red-500">
                          Please enter a valid image URL (.jpg, .png, .gif, etc.)
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Leave empty to use default image
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="default" 
                    className="mt-2"
                    disabled={!rewardTitle || !rewardDescription || !rewardPrice || !isValidImageUrl || isCreatingReward}
                    onClick={async () => {
                      if (!rewardTitle || !rewardDescription || !rewardPrice) {
                        toast.error("Please fill in all required fields.");
                        return;
                      }
                      
                      if (!isValidImageUrl) {
                        toast.error("Please enter a valid image URL or leave it empty.");
                        return;
                      }
                      
                      setIsCreatingReward(true);
                      
                      try {
                        // Create a new reward object
                        const newReward = {
                          id: `reward_${Date.now()}`,
                          title: rewardTitle,
                          description: rewardDescription,
                          price: parseInt(rewardPrice, 10),
                          imageUrl: rewardImage || 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=500&auto=format'
                        };
                        
                        // Get existing rewards from localStorage
                        let rewards = [...customRewards];
                        
                        // Add new reward and save to localStorage
                        rewards.push(newReward);
                        localStorage.setItem('meowdoro-custom-rewards', JSON.stringify(rewards));
                        setCustomRewards(rewards);
                        
                        // Reset form
                        setRewardTitle("Coffee Break");
                        setRewardDescription("Take a 15-minute coffee break");
                        setRewardPrice("5");
                        setRewardImage("https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=500&auto=format");
                        
                        toast.success("Custom reward created successfully!");
                      } catch (error) {
                        console.error("Error creating reward:", error);
                        toast.error("Failed to create reward. Please try again.");
                      } finally {
                        setIsCreatingReward(false);
                      }
                    }}
                  >
                    {isCreatingReward ? (
                      <>Creating...</>
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Reward
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="flex-1">
                  <div className="text-sm font-medium mb-2">Preview</div>
                  <Card className="overflow-hidden h-[300px] flex flex-col">
                    <div 
                      className="h-40 bg-cover bg-center"
                      style={{ 
                        backgroundImage: `url(${rewardImage})` 
                      }}
                    />
                    <CardHeader>
                      <CardTitle>{rewardTitle}</CardTitle>
                      <CardDescription>{rewardDescription}</CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto">
                      <Button className="w-full">
                        <Fish className="h-4 w-4 mr-2" />
                        {rewardPrice} Fish
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* User's Custom Rewards */}
          <h3 className="text-lg font-semibold mt-8 mb-4">Your Custom Rewards</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {customRewards.length > 0 ? (
              customRewards.map((reward) => (
                <Card 
                  key={reward.id} 
                  className="overflow-hidden flex flex-col transition-all"
                  id={`reward-card-${reward.id}`}
                >
                  <div 
                    className="h-40 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${reward.imageUrl})`,
                      backgroundColor: '#f3f4f6' // Fallback background color
                    }}
                  >
                    {/* Image error fallback */}
                    <img 
                      src={reward.imageUrl}
                      alt=""
                      className="hidden"
                      onError={(e) => {
                        // If image fails to load, show a fallback gradient
                        const target = e.target as HTMLImageElement;
                        const parent = target.parentElement;
                        if (parent) {
                          parent.style.backgroundImage = 'linear-gradient(to bottom right, #f59e0b, #ef4444)';
                        }
                      }}
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{reward.title}</CardTitle>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto">
                    <div className="w-full flex gap-2">
                      <Button 
                        className="flex-1"
                        onClick={async () => {
                          // Check if user has enough fish
                          const success = await spendFish(reward.price);
                          if (success) {
                            // Update redeemed count
                            const newCount = rewardsRedeemed + 1;
                            setRewardsRedeemed(newCount);
                            localStorage.setItem('meowdoro-rewards-redeemed', newCount.toString());
                            
                            // Create redeem animation
                            const card = document.getElementById(`reward-card-${reward.id}`);
                            if (card) {
                              card.classList.add('animate-reward-redeem');
                              setTimeout(() => {
                                card.classList.remove('animate-reward-redeem');
                              }, 1000);
                            }
                            
                            toast.success(`Reward redeemed! Enjoy your ${reward.title}!`);
                          } else {
                            toast.error("Not enough fish to redeem this reward.");
                          }
                        }}
                      >
                        <Fish className="h-4 w-4 mr-2" />
                        {reward.price} Fish
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => {
                          // Show confirmation dialog first
                          setRewardToDelete(reward.id);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">You haven't created any custom rewards yet.</p>
              </div>
            )}
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

      {/* Daily Reward Dialog */}
      <Dialog open={showDailyRewardDialog} onOpenChange={setShowDailyRewardDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Daily Reward!
            </DialogTitle>
            <DialogDescription>
              Welcome back to Meowdoro! Here's your daily reward of 1 fish.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
              <Fish className="h-8 w-8" />
              <span>+1</span>
            </div>
          </div>

          <Button 
            className="w-full" 
            onClick={() => setShowDailyRewardDialog(false)}
          >
            Claim Reward
          </Button>
        </DialogContent>
      </Dialog>

      {/* Delete Reward Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Reward</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this reward? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDeleteDialog(false);
                setRewardToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                if (rewardToDelete) {
                  try {
                    const updatedRewards = customRewards.filter(r => r.id !== rewardToDelete);
                    localStorage.setItem('meowdoro-custom-rewards', JSON.stringify(updatedRewards));
                    setCustomRewards(updatedRewards);
                    toast.success("Reward deleted successfully!");
                  } catch (error) {
                    console.error("Error deleting reward:", error);
                    toast.error("Failed to delete reward. Please try again.");
                  }
                  setShowDeleteDialog(false);
                  setRewardToDelete(null);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Shop;
