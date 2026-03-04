import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Package, ShoppingCart, Users, DollarSign,
  ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import logo from "@/assets/logo.jpg";

export type AdminView = "overview" | "inventory" | "orders" | "customers" | "financials";

const navItems: { id: AdminView; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "customers", label: "Customers", icon: Users },
  { id: "financials", label: "Financials", icon: DollarSign },
];

interface Props {
  activeView: AdminView;
  onViewChange: (v: AdminView) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const AdminSidebar = ({ activeView, onViewChange, collapsed, onToggleCollapse, mobileOpen, onMobileClose }: Props) => {
  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "hidden lg:flex flex-col bg-sidebar-background border-r border-sidebar-border h-screen sticky top-0 z-30 overflow-hidden"
        )}
      >
        <div className="flex items-center justify-between h-14 px-3 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <img src={logo} alt="CephasTech" className="h-7 w-auto" />
              <span className="font-bold text-sm text-sidebar-foreground">CephasTech</span>
            </div>
          )}
          {collapsed && (
            <img src={logo} alt="CephasTech" className="h-7 w-auto mx-auto" />
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-sidebar-foreground/60 hover:text-sidebar-foreground shrink-0"
            onClick={onToggleCollapse}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-1">
          {navItems.map((item) => {
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium luxury-transition",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="p-3 border-t border-sidebar-border">
            <div className="rounded-lg bg-primary/5 p-3">
              <p className="text-xs font-medium text-sidebar-foreground">Need help?</p>
              <p className="text-[10px] text-sidebar-foreground/60 mt-0.5">Visit our documentation</p>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          exit={{ x: -280 }}
          transition={{ duration: 0.2 }}
          className="fixed left-0 top-0 bottom-0 w-[280px] bg-sidebar-background border-r border-sidebar-border z-50 flex flex-col lg:hidden"
        >
          <div className="flex items-center justify-between h-14 px-3 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <img src={logo} alt="CephasTech" className="h-7 w-auto" />
              <span className="font-bold text-sm text-sidebar-foreground">CephasTech</span>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onMobileClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="flex-1 py-3 px-2 space-y-1">
            {navItems.map((item) => {
              const active = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium luxury-transition",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </motion.aside>
      )}
    </>
  );
};

export default AdminSidebar;
