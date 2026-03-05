import { Search, ShoppingCart, User, MapPin, ChevronDown, Menu, X, Clock } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const megaMenuCategories = [
  {
    title: "Phones",
    links: ["iPhone", "Samsung Galaxy", "Google Pixel", "OnePlus", "All Phones"],
  },
  {
    title: "Accessories",
    links: ["Cases & Covers", "Chargers", "Headphones", "Screen Protectors", "Cables"],
  },
  {
    title: "Electronics",
    links: ["Tablets", "Laptops", "Smartwatches", "Speakers", "Cameras"],
  },
  {
    title: "Deals",
    links: ["Today's Deals", "Flash Sales", "Clearance", "Bundle Offers", "Coupons"],
  },
];

const recentSearches = ["iPhone 15 Pro case", "USB-C charger", "wireless earbuds", "Samsung S24"];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Top bar */}
      <div className="bg-foreground text-background">
        <div className="container mx-auto px-4 flex items-center justify-between h-8 text-xs">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="hidden sm:inline">Deliver to</span>
            <button className="font-semibold underline decoration-dotted">Lagos, NG</button>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">Sell on CephasTech</a>
            <a href="#" className="hover:underline hidden sm:inline">Help</a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center gap-3">
          {/* Mobile menu btn */}
          <button
            className="md:hidden p-1.5 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <a href="/" className="shrink-0 flex items-center gap-1.5">
            <img src={logo} alt="CephasTech" className="h-8 w-auto object-contain" />
            <span className="text-lg font-bold tracking-tight text-foreground hidden sm:inline">
              CephasTech
            </span>
          </a>

          {/* Search */}
          <div ref={searchRef} className="flex-1 max-w-2xl relative">
            <div className="flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-r-none border-r-0 h-10 text-xs px-3 shrink-0 hidden md:flex">
                    All <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>All Categories</DropdownMenuItem>
                  <DropdownMenuItem>Phones</DropdownMenuItem>
                  <DropdownMenuItem>Accessories</DropdownMenuItem>
                  <DropdownMenuItem>Electronics</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="relative flex-1">
                <Input
                  placeholder="Search phones, accessories, electronics..."
                  className="h-10 rounded-none md:rounded-l-none rounded-l-md border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                />
              </div>
              <Button size="icon" className="h-10 w-11 rounded-l-none shrink-0">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Recent searches dropdown */}
            {searchFocused && !searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 p-2">
                <p className="text-xs font-medium text-muted-foreground px-2 py-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Recent Searches
                </p>
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-accent luxury-transition"
                    onClick={() => { setSearchQuery(term); setSearchFocused(false); }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1 text-xs h-10">
                  <User className="h-4 w-4" />
                  <div className="text-left">
                    <span className="text-[10px] text-muted-foreground block leading-none">Hello, Sign in</span>
                    <span className="font-semibold text-xs leading-none">Account</span>
                  </div>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild><a href="/login">Sign In</a></DropdownMenuItem>
                <DropdownMenuItem asChild><a href="/login">Create Account</a></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Your Orders</DropdownMenuItem>
                <DropdownMenuItem>Wish List</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Button variant="ghost" size="sm" className="relative h-10 px-2">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-0.5 -right-0.5 h-5 min-w-[20px] p-0 flex items-center justify-center text-[10px] font-bold rounded-full">
                3
              </Badge>
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Mega Menu Bar */}
      <div className="hidden md:block border-t border-border bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-10 gap-6 text-sm">
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button className="flex items-center gap-1 font-medium text-foreground hover:text-primary luxury-transition h-10">
                <Menu className="h-4 w-4" /> All Categories <ChevronDown className="h-3 w-3" />
              </button>

              {megaMenuOpen && (
                <div className="absolute left-0 top-full bg-popover border border-border rounded-b-lg shadow-xl z-50 w-[600px] p-6 grid grid-cols-4 gap-6 animate-fade-in">
                  {megaMenuCategories.map((cat) => (
                    <div key={cat.title}>
                      <h4 className="font-semibold text-sm text-foreground mb-2">{cat.title}</h4>
                      <ul className="space-y-1.5">
                        {cat.links.map((link) => (
                          <li key={link}>
                            <a href="#" className="text-xs text-muted-foreground hover:text-primary luxury-transition">
                              {link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {["Today's Deals", "New Arrivals", "Best Sellers", "Customer Service"].map((link) => (
              <a key={link} href="#" className="text-muted-foreground hover:text-primary luxury-transition whitespace-nowrap">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-background animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <a href="/login" className="flex items-center gap-2 py-2 border-b border-border pb-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Hello, Sign in</span>
            </a>
            {megaMenuCategories.map((cat) => (
              <div key={cat.title}>
                <h4 className="text-sm font-semibold text-foreground mb-1">{cat.title}</h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  {cat.links.map((link) => (
                    <a key={link} href="#" className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full hover:text-primary luxury-transition">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
