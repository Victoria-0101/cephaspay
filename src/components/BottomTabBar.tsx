import { Home, Search, ShoppingCart, User, Grid3X3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const tabs = [
  { icon: Home, label: "Home" },
  { icon: Grid3X3, label: "Categories" },
  { icon: Search, label: "Search" },
  { icon: ShoppingCart, label: "Cart", badge: 3 },
  { icon: User, label: "Account" },
];

const BottomTabBar = () => {
  return (
    <div className="bottom-tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          className="flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-primary luxury-transition relative px-3 py-1"
        >
          <div className="relative">
            <tab.icon className="h-5 w-5" />
            {tab.badge && (
              <Badge className="absolute -top-1.5 -right-2.5 h-4 min-w-[16px] p-0 flex items-center justify-center text-[9px] font-bold rounded-full">
                {tab.badge}
              </Badge>
            )}
          </div>
          <span className="text-[10px] font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomTabBar;
