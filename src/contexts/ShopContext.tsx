import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define the types for our customizations
export type CustomizationCategory = "site_color" | "cat_color" | "background" | "icon_pack";

export interface CustomizationItem {
  id: string;
  name: string;
  category: CustomizationCategory;
  value: string;
  price: number;
  isActive: boolean;
  isPurchased: boolean;
}

// Define the available themes
export const availableSiteColors = [
  { id: "cyan", name: "Cyan", value: "cyan" },
  { id: "green", name: "Green", value: "green" },
  { id: "yellow", name: "Yellow", value: "yellow" },
  { id: "lavender", name: "Lavender", value: "lavender" },
  { id: "peach", name: "Peach", value: "peach" },
  { id: "mint", name: "Mint", value: "mint" },
  { id: "rose", name: "Rose", value: "rose" },
  { id: "blue", name: "Blue", value: "#3B82F6" },
  { id: "purple", name: "Purple", value: "#8B5CF6" },
  { id: "red", name: "Red", value: "#EF4444" }
];

// Available backgrounds
export const availableBackgrounds = [
  { id: "default", name: "Default", value: "none", type: "color" },
  { id: "light-dots", name: "Light Dots", value: "bg-dots", type: "pattern" },
  { id: "light-grid", name: "Light Grid", value: "bg-grid", type: "pattern" },
  { id: "dark-navy", name: "Dark Navy", value: "#1e293b", type: "color" },
  { id: "soft-gray", name: "Soft Gray", value: "#f8fafc", type: "color" }
];

// Available icon packs
export const availableIconPacks = [
  { id: "default", name: "Default", value: "default" },
  { id: "rounded", name: "Rounded", value: "rounded" },
  { id: "minimal", name: "Minimal", value: "minimal" }
];

// Context interface
interface ShopContextType {
  fishCount: number;
  addFish: (amount: number) => void;
  spendFish: (amount: number) => Promise<boolean>;
  purchasedItems: CustomizationItem[];
  purchaseItem: (item: CustomizationItem) => Promise<boolean>;
  loadSavedItem: (item: CustomizationItem) => void; // New function to load items without spending fish
  sellItem: (item: CustomizationItem) => Promise<boolean>;
  activateItem: (item: CustomizationItem) => Promise<boolean>;
  activeSiteColor: string;
  activeCatColor: string;
  activeBackground: string;
  activeIconPack: string;
  backgroundOpacity: number;
  setBackgroundOpacity: (opacity: number) => void;
  isLoading: boolean;
}

// Default context value
const ShopContext = createContext<ShopContextType>({
  fishCount: 0,
  addFish: () => {},
  spendFish: async () => false,
  purchasedItems: [],
  purchaseItem: async () => false,
  loadSavedItem: () => {}, // Initialize the new function
  sellItem: async () => false,
  activateItem: async () => false,
  activeSiteColor: "cyan",
  activeCatColor: "reset",
  activeBackground: "none",
  activeIconPack: "default",
  backgroundOpacity: 0.5,
  setBackgroundOpacity: () => {},
  isLoading: true,
});

export const useShop = () => useContext(ShopContext);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [fishCount, setFishCount] = useState(0);
  const [purchasedItems, setPurchasedItems] = useState<CustomizationItem[]>([]);
  const [activeSiteColor, setActiveSiteColor] = useState("cyan");
  const [activeCatColor, setActiveCatColor] = useState("reset");
  const [activeBackground, setActiveBackground] = useState("none");
  const [activeIconPack, setActiveIconPack] = useState("default");
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.5);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data on mount
  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      // Default values for non-logged in users
      setFishCount(0);
      setPurchasedItems([]);
      setActiveSiteColor("cyan");
      setActiveCatColor("reset");
      setActiveBackground("none");
      setActiveIconPack("default");
      setIsLoading(false);
      
      // Load from localStorage for guest users
      const guestFishCount = localStorage.getItem("meowdoro-fish-count");
      if (guestFishCount) {
        setFishCount(parseInt(guestFishCount, 10));
      }
      
      const storedSiteColor = localStorage.getItem("meowdoro-theme");
      if (storedSiteColor) {
        setActiveSiteColor(storedSiteColor);
      }
      
      const storedCatColor = localStorage.getItem("meowdoro-cat-color");
      if (storedCatColor) {
        setActiveCatColor(storedCatColor);
      }
      
      const storedBackground = localStorage.getItem("meowdoro-background");
      if (storedBackground) {
        setActiveBackground(storedBackground);
      }
      
      const storedIconPack = localStorage.getItem("meowdoro-icon-pack");
      if (storedIconPack) {
        setActiveIconPack(storedIconPack);
      }
      
      const storedOpacity = localStorage.getItem("meowdoro-background-opacity");
      if (storedOpacity) {
        setBackgroundOpacity(parseFloat(storedOpacity));
      }
      
      // Load custom colors from localStorage
      const storedCustomColors = localStorage.getItem('meowdoro-custom-colors');
      if (storedCustomColors) {
        try {
          const customColors = JSON.parse(storedCustomColors) as CustomizationItem[];
          customColors.forEach(color => {
            // Use loadSavedItem instead of purchaseItem to avoid spending fish
            loadSavedItem(color);
          });
        } catch (error) {
          console.error("Error loading custom colors from localStorage:", error);
        }
      }
    }
  }, [user]);

  // Fetch user data from Supabase
  const fetchUserData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Fetch fish count
      const { data: currencyData, error: currencyError } = await supabase
        .from('user_currency')
        .select('fish_count')
        .eq('id', user.id)
        .single();
      
      if (currencyError) throw currencyError;
      
      if (currencyData) {
        setFishCount(currencyData.fish_count);
      }
      
      // Fetch user customizations
      const { data: customizationsData, error: customizationsError } = await supabase
        .from('user_customizations')
        .select('*')
        .eq('user_id', user.id);
        
      if (customizationsError) throw customizationsError;
      
      if (customizationsData) {
        const purchased: CustomizationItem[] = [];
        
        // Process site colors
        availableSiteColors.forEach(color => {
          const isPurchased = customizationsData.some(
            item => item.category === 'site_color' && item.item_id === color.id
          );
          
          const active = customizationsData.some(
            item => item.category === 'site_color' && item.item_id === color.id && item.is_active
          );
          
          if (active) {
            setActiveSiteColor(color.value);
          }
          
          if (isPurchased) {
            purchased.push({
              id: color.id,
              name: color.name,
              category: 'site_color',
              value: color.value,
              price: 10,
              isActive: active,
              isPurchased: true
            });
          }
        });
        
        // Process cat colors
        availableSiteColors.forEach(color => {
          const isPurchased = customizationsData.some(
            item => item.category === 'cat_color' && item.item_id === color.id
          );
          
          const active = customizationsData.some(
            item => item.category === 'cat_color' && item.item_id === color.id && item.is_active
          );
          
          if (active) {
            setActiveCatColor(color.value);
          }
          
          if (isPurchased) {
            purchased.push({
              id: color.id,
              name: color.name,
              category: 'cat_color',
              value: color.value,
              price: 10,
              isActive: active,
              isPurchased: true
            });
          }
        });
        
        // Process backgrounds
        availableBackgrounds.forEach(bg => {
          const isPurchased = customizationsData.some(
            item => item.category === 'background' && item.item_id === bg.id
          );
          
          const active = customizationsData.some(
            item => item.category === 'background' && item.item_id === bg.id && item.is_active
          );
          
          if (active) {
            setActiveBackground(bg.value);
          }
          
          if (isPurchased) {
            purchased.push({
              id: bg.id,
              name: bg.name,
              category: 'background',
              value: bg.value,
              price: bg.type === 'pattern' ? 10 : 5,
              isActive: active,
              isPurchased: true
            });
          }
        });
        
        // Process icon packs
        availableIconPacks.forEach(pack => {
          const isPurchased = customizationsData.some(
            item => item.category === 'icon_pack' && item.item_id === pack.id
          );
          
          const active = customizationsData.some(
            item => item.category === 'icon_pack' && item.item_id === pack.id && item.is_active
          );
          
          if (active) {
            setActiveIconPack(pack.value);
          }
          
          if (isPurchased) {
            purchased.push({
              id: pack.id,
              name: pack.name,
              category: 'icon_pack',
              value: pack.value,
              price: 15,
              isActive: active,
              isPurchased: true
            });
          }
        });
        
        setPurchasedItems(purchased);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user customizations");
    } finally {
      setIsLoading(false);
    }
  };

  // Add fish
  const addFish = async (amount: number) => {
    if (amount <= 0) return;
    
    const newTotal = fishCount + amount;
    setFishCount(newTotal);
    
    if (user) {
      try {
        const { error } = await supabase
          .from('user_currency')
          .update({ fish_count: newTotal, updated_at: new Date().toISOString() })
          .eq('id', user.id);
          
        if (error) throw error;
      } catch (error) {
        console.error("Error updating fish count:", error);
        // Revert UI change if database update fails
        setFishCount(fishCount);
        toast.error("Failed to update fish count");
        return;
      }
    } else {
      // Store in localStorage for guest users
      localStorage.setItem("meowdoro-fish-count", newTotal.toString());
    }
    
    toast.success(`You earned ${amount} fish${amount > 1 ? 'es' : ''}!`);
  };

  // Spend fish
  const spendFish = async (amount: number): Promise<boolean> => {
    if (amount <= 0) return true;
    if (fishCount < amount) {
      toast.error("Not enough fish!");
      return false;
    }
    
    const newTotal = fishCount - amount;
    setFishCount(newTotal);
    
    if (user) {
      try {
        const { error } = await supabase
          .from('user_currency')
          .update({ fish_count: newTotal, updated_at: new Date().toISOString() })
          .eq('id', user.id);
          
        if (error) throw error;
      } catch (error) {
        console.error("Error updating fish count:", error);
        // Revert UI change if database update fails
        setFishCount(fishCount);
        toast.error("Failed to update fish count");
        return false;
      }
    } else {
      // Store in localStorage for guest users
      localStorage.setItem("meowdoro-fish-count", newTotal.toString());
    }
    
    return true;
  };

  // Load a saved item without spending fish (for items loaded from localStorage)
  const loadSavedItem = (item: CustomizationItem) => {
    // Check if already in purchased items
    if (purchasedItems.some(i => i.category === item.category && i.id === item.id)) {
      return; // Already loaded, do nothing
    }
    
    // Add to purchased items without spending fish
    const newItem = { ...item, isPurchased: true };
    setPurchasedItems(prevItems => [...prevItems, newItem]);
  };

  // Sell item
  const sellItem = async (item: CustomizationItem): Promise<boolean> => {
    // Check if item is active
    let isActive = false;
    switch (item.category) {
      case 'site_color':
        isActive = activeSiteColor === item.value;
        break;
      case 'cat_color':
        isActive = activeCatColor === item.value;
        break;
      case 'background':
        isActive = activeBackground === item.value;
        break;
      case 'icon_pack':
        isActive = activeIconPack === item.value;
        break;
    }

    if (isActive) {
      toast.error("Can't sell an active color!");
      return false;
    }

    // Check if item is owned
    if (!purchasedItems.some(i => i.category === item.category && i.id === item.id)) {
      toast.error("You don't own this item!");
      return false;
    }

    // Add fish
    addFish(1);

    // Remove from purchased items
    setPurchasedItems(prevItems => 
      prevItems.filter(i => !(i.category === item.category && i.id === item.id))
    );

    // Update localStorage
    if (!user) {
      const guestPurchases = JSON.parse(localStorage.getItem("meowdoro-purchases") || "[]");
      const updatedPurchases = guestPurchases.filter((p: any) => 
        !(p.category === item.category && p.item_id === item.id)
      );
      localStorage.setItem("meowdoro-purchases", JSON.stringify(updatedPurchases));
    }

    toast.success(`Sold ${item.name} for 1 fish!`);
    return true;
  };

  // Purchase item
  const purchaseItem = async (item: CustomizationItem): Promise<boolean> => {
    // Check if already purchased
    if (purchasedItems.some(i => i.category === item.category && i.id === item.id)) {
      toast.info("You already own this item!");
      return false;
    }
    
    // Spend fish
    const success = await spendFish(item.price);
    if (!success) return false;
    
    // Add to purchased items
    const newItem = { ...item, isPurchased: true };
    setPurchasedItems([...purchasedItems, newItem]);
    
    if (user) {
      try {
        const { error } = await supabase
          .from('user_customizations')
          .insert({
            user_id: user.id,
            category: item.category,
            item_id: item.id,
            is_active: false
          });
          
        if (error) throw error;
      } catch (error) {
        console.error("Error saving purchase:", error);
        // Revert UI changes if database update fails
        setPurchasedItems(purchasedItems);
        addFish(item.price); // Refund fish
        toast.error("Failed to save purchase");
        return false;
      }
    } else {
      // Store in localStorage for guest users
      const guestPurchases = JSON.parse(localStorage.getItem("meowdoro-purchases") || "[]");
      guestPurchases.push({
        category: item.category,
        item_id: item.id,
        is_active: false
      });
      localStorage.setItem("meowdoro-purchases", JSON.stringify(guestPurchases));
    }
    
    toast.success(`Successfully purchased ${item.name}!`);
    return true;
  };

  // Activate item
  const activateItem = async (item: CustomizationItem): Promise<boolean> => {
    // Check if item is purchased
    const isPurchased = purchasedItems.some(i => i.category === item.category && i.id === item.id);
    
    // Allow reset color without purchase
    if (!isPurchased && item.category !== 'site_color' && item.id !== 'cyan' && item.id !== 'reset') {
      toast.error("You need to purchase this item first!");
      return false;
    }
    
    // Update active status in state
    const updatedItems = purchasedItems.map(i => {
      if (i.category === item.category) {
        return { ...i, isActive: i.id === item.id };
      }
      return i;
    });
    
    setPurchasedItems(updatedItems);
    
    // Update active item based on category
    switch (item.category) {
      case 'site_color':
        setActiveSiteColor(item.value);
        localStorage.setItem("meowdoro-theme", item.value);
        break;
      case 'cat_color':
        setActiveCatColor(item.value);
        localStorage.setItem("meowdoro-cat-color", item.value);
        break;
      case 'background':
        setActiveBackground(item.value);
        localStorage.setItem("meowdoro-background", item.value);
        break;
      case 'icon_pack':
        setActiveIconPack(item.value);
        localStorage.setItem("meowdoro-icon-pack", item.value);
        break;
    }
    
    if (user) {
      try {
        // First, deactivate all items in the category
        const { error: deactivateError } = await supabase
          .from('user_customizations')
          .update({ is_active: false })
          .eq('user_id', user.id)
          .eq('category', item.category);
          
        if (deactivateError) throw deactivateError;
        
        // Then, activate the selected item
        if (isPurchased) {
          const { error: activateError } = await supabase
            .from('user_customizations')
            .update({ is_active: true })
            .eq('user_id', user.id)
            .eq('category', item.category)
            .eq('item_id', item.id);
            
          if (activateError) throw activateError;
        }
      } catch (error) {
        console.error("Error activating item:", error);
        toast.error("Failed to activate item");
        return false;
      }
    } else {
      // Store in localStorage for guest users
      const guestPurchases = JSON.parse(localStorage.getItem("meowdoro-purchases") || "[]");
      const updatedPurchases = guestPurchases.map((p: any) => {
        if (p.category === item.category) {
          return { ...p, is_active: p.item_id === item.id };
        }
        return p;
      });
      localStorage.setItem("meowdoro-purchases", JSON.stringify(updatedPurchases));
    }
    
    return true;
  };

  return (
    <ShopContext.Provider value={{
      fishCount,
      addFish,
      spendFish,
      purchasedItems,
      purchaseItem,
      loadSavedItem,
      sellItem,
      activateItem,
      activeSiteColor,
      activeCatColor,
      activeBackground,
      activeIconPack,
      backgroundOpacity,
      setBackgroundOpacity,
      isLoading
    }}>
      {children}
    </ShopContext.Provider>
  );
};
