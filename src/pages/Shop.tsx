import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Fish, Palette, PaintBucket, Star } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Define shop item categories and types
type ItemCategory = "colors" | "backgrounds" | "icons" | "aiCredits";
type ShopItem = {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  price: number;
  isFeatured?: boolean;
  isPremium?: boolean;
  value: string; // This could be a color code, background URL, etc.
  preview?: React.ReactNode;
};

export default function Shop() {
  const [userFish, setUserFish] = useState(0);
  const [catHappiness, setCatHappiness] = useState(0);
  const { user } = useAuth();
  
  // Load user fish count from localStorage
  useEffect(() => {
    const savedFish = localStorage.getItem("meowdoro-user-fish") || "0";
    setUserFish(parseInt(savedFish, 10));
    
    const savedHappiness = localStorage.getItem("meowdoro-cat-happiness") || "0";
    setCatHappiness(parseInt(savedHappiness, 10));
  }, []);
  
  // Save user fish count to localStorage
  const updateUserFish = (newCount: number) => {
    setUserFish(newCount);
    localStorage.setItem("meowdoro-user-fish", newCount.toString());
  };
  
  // Update cat happiness
  const updateCatHappiness = (newHappiness: number) => {
    setCatHappiness(newHappiness);
    localStorage.setItem("meowdoro-cat-happiness", newHappiness.toString());
  };
  
  // Handle buying an item
  const handleBuyItem = (item: ShopItem) => {
    if (userFish < item.price) {
      toast.error("Not enough fish! Keep focusing to earn more.");
      return;
    }
    
    // Process purchase
    const newFishCount = userFish - item.price;
    updateUserFish(newFishCount);
    
    // Apply customization based on category
    switch (item.category) {
      case "colors":
        localStorage.setItem("meowdoro-theme-color", item.value);
        document.documentElement.style.setProperty('--primary', item.value);
        toast.success(`Applied new color theme: ${item.name}`);
        break;
      case "backgrounds":
        localStorage.setItem("meowdoro-background", item.value);
        document.body.style.backgroundImage = `url(${item.value})`;
        toast.success(`Applied new background: ${item.name}`);
        break;
      case "icons":
        localStorage.setItem("meowdoro-icon-pack", item.value);
        toast.success(`Applied new icon pack: ${item.name}`);
        break;
      case "aiCredits":
        const currentCredits = parseInt(localStorage.getItem("meowdoro-ai-credits") || "0", 10);
        localStorage.setItem("meowdoro-ai-credits", (currentCredits + parseInt(item.value, 10)).toString());
        toast.success(`Added ${item.value} AI credits!`);
        break;
    }
    
    // Save purchase to user's inventory if they're logged in
    if (user) {
      savePurchaseToDatabase(item);
    }
  };
  
  // Save purchase to Supabase if user is authenticated
  const savePurchaseToDatabase = async (item: ShopItem) => {
    try {
      if (!user) return;
      
      // This would save the purchase to Supabase if the database schema is set up
      // For now, we're just using localStorage
      console.log("Saved purchase to database", item);
    } catch (error) {
      console.error("Error saving purchase:", error);
    }
  };
  
  // Feed the cat
  const feedCat = () => {
    if (userFish < 1) {
      toast.error("You need at least 1 fish to feed the cat!");
      return;
    }
    
    // Decrease fish count
    const newFishCount = userFish - 1;
    updateUserFish(newFishCount);
    
    // Increase cat happiness
    const newHappiness = Math.min(catHappiness + 10, 100);
    updateCatHappiness(newHappiness);
    
    toast.success("Meow! Your cat is happier now!");
  };
  
  // Color theme items
  const colorItems: ShopItem[] = [
    {
      id: "color1",
      name: "Ocean Blue",
      description: "A calming blue theme",
      category: "colors",
      price: 5,
      value: "#0EA5E9",
      preview: <div className="h-8 w-8 rounded-full bg-[#0EA5E9]" />
    },
    {
      id: "color2",
      name: "Forest Green",
      description: "A refreshing green theme",
      category: "colors",
      price: 5,
      value: "#10B981",
      preview: <div className="h-8 w-8 rounded-full bg-[#10B981]" />
    },
    {
      id: "color3",
      name: "Sunset Orange",
      description: "A warm orange theme",
      category: "colors",
      price: 5,
      value: "#F97316",
      preview: <div className="h-8 w-8 rounded-full bg-[#F97316]" />
    },
    {
      id: "color4",
      name: "Royal Purple",
      description: "A luxurious purple theme",
      category: "colors",
      price: 10,
      value: "#8B5CF6",
      isFeatured: true,
      preview: <div className="h-8 w-8 rounded-full bg-[#8B5CF6]" />
    },
    {
      id: "color5",
      name: "Cherry Red",
      description: "A vibrant red theme",
      category: "colors",
      price: 5,
      value: "#EF4444",
      preview: <div className="h-8 w-8 rounded-full bg-[#EF4444]" />
    },
  ];
  
  // Background items
  const backgroundItems: ShopItem[] = [
    {
      id: "bg1",
      name: "Gradient Wave",
      description: "Soft flowing gradient background",
      category: "backgrounds",
      price: 15,
      value: "/backgrounds/gradient-wave.png",
      preview: <div className="h-14 w-full rounded bg-gradient-to-r from-blue-300 to-purple-400" />
    },
    {
      id: "bg2",
      name: "Forest Pattern",
      description: "Calming forest-inspired pattern",
      category: "backgrounds",
      price: 20,
      value: "/backgrounds/forest-pattern.png",
      preview: <div className="h-14 w-full rounded bg-gradient-to-r from-green-200 to-green-500" />
    },
    {
      id: "bg3",
      name: "Night Sky",
      description: "Starry night background",
      category: "backgrounds",
      price: 25,
      isFeatured: true,
      value: "/backgrounds/night-sky.png",
      preview: <div className="h-14 w-full rounded bg-gradient-to-r from-slate-900 to-blue-900" />
    }
  ];
  
  // Icon pack items
  const iconItems: ShopItem[] = [
    {
      id: "icon1",
      name: "Minimalist",
      description: "Clean, simple icon set",
      category: "icons",
      price: 30,
      value: "minimalist"
    },
    {
      id: "icon2",
      name: "Colorful",
      description: "Vibrant, playful icon set",
      category: "icons",
      price: 35,
      isFeatured: true,
      value: "colorful"
    },
    {
      id: "icon3",
      name: "Retro",
      description: "Vintage-inspired icon set",
      category: "icons",
      price: 40,
      isPremium: true,
      value: "retro"
    }
  ];
  
  // AI credit items
  const aiCreditItems: ShopItem[] = [
    {
      id: "ai1",
      name: "10 AI Credits",
      description: "Use for premium AI features",
      category: "aiCredits",
      price: 5,
      value: "10"
    },
    {
      id: "ai2",
      name: "25 AI Credits",
      description: "Best value pack",
      category: "aiCredits",
      price: 10,
      isFeatured: true,
      value: "25"
    },
    {
      id: "ai3",
      name: "100 AI Credits",
      description: "Power user pack",
      category: "aiCredits",
      price: 35,
      isPremium: true,
      value: "100"
    }
  ];
  
  // Render function for shop items
  const renderShopItems = (items: ShopItem[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} className={`overflow-hidden transition-shadow hover:shadow-lg ${item.isFeatured ? 'border-primary/50' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </div>
                {item.isPremium && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                    Premium
                  </Badge>
                )}
                {item.isFeatured && !item.isPremium && (
                  <Badge className="bg-primary/10 text-primary">
                    Featured
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {item.preview && (
                <div className="mb-4">{item.preview}</div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-sm font-medium">
                <Fish className="h-4 w-4" />
                <span>{item.price}</span>
              </div>
              <Button 
                onClick={() => handleBuyItem(item)}
                disabled={userFish < item.price}
                variant={userFish >= item.price ? "default" : "outline"}
              >
                {userFish >= item.price ? "Buy" : "Not enough fish"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 page-transition">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Shop</h1>
          <p className="text-muted-foreground">Customize your Meowdoro experience</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Card className="w-auto">
            <CardContent className="py-3 flex items-center gap-2">
              <Fish className="h-5 w-5 text-primary" />
              <div className="font-medium text-lg">{userFish} Fish</div>
            </CardContent>
          </Card>
          
          <Button onClick={feedCat} className="gap-2">
            <Fish className="h-4 w-4" />
            Feed Cat ({catHappiness}% Happy)
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="colors" className="space-y-4">
        <TabsList className="grid grid-cols-4 h-auto sm:h-10">
          <TabsTrigger value="colors" className="flex items-center gap-2 px-2 py-2">
            <Palette className="h-4 w-4 hidden sm:inline" />
            <span>Colors</span>
          </TabsTrigger>
          <TabsTrigger value="backgrounds" className="flex items-center gap-2 px-2 py-2">
            <PaintBucket className="h-4 w-4 hidden sm:inline" />
            <span>Backgrounds</span>
          </TabsTrigger>
          <TabsTrigger value="icons" className="flex items-center gap-2 px-2 py-2">
            <Star className="h-4 w-4 hidden sm:inline" />
            <span>Icon Packs</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2 px-2 py-2">
            <Star className="h-4 w-4 hidden sm:inline" />
            <span>AI Credits</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors" className="space-y-4">
          <h2 className="text-xl font-medium">Color Themes</h2>
          {renderShopItems(colorItems)}
        </TabsContent>
        
        <TabsContent value="backgrounds" className="space-y-4">
          <h2 className="text-xl font-medium">Background Themes</h2>
          {renderShopItems(backgroundItems)}
        </TabsContent>
        
        <TabsContent value="icons" className="space-y-4">
          <h2 className="text-xl font-medium">Icon Packs</h2>
          {renderShopItems(iconItems)}
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-4">
          <h2 className="text-xl font-medium">AI Credits</h2>
          {renderShopItems(aiCreditItems)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
