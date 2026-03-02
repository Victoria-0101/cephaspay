import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Star, SlidersHorizontal } from "lucide-react";
import { categories, brands } from "@/data/products";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface FilterSidebarProps {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  priceRange: number[];
  onPriceRangeChange: (range: number[]) => void;
  selectedBrands: string[];
  onBrandsChange: (brands: string[]) => void;
  minRating: number;
  onMinRatingChange: (rating: number) => void;
  inStockOnly: boolean;
  onInStockOnlyChange: (v: boolean) => void;
}

const FilterContent = ({
  selectedCategory, onCategoryChange,
  priceRange, onPriceRangeChange,
  selectedBrands, onBrandsChange,
  minRating, onMinRatingChange,
  inStockOnly, onInStockOnlyChange,
}: FilterSidebarProps) => {
  const toggleBrand = (brand: string) => {
    onBrandsChange(
      selectedBrands.includes(brand)
        ? selectedBrands.filter((b) => b !== brand)
        : [...selectedBrands, brand]
    );
  };

  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-2">Category</h4>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onCategoryChange(cat.name)}
              className={`w-full text-left text-sm px-2 py-1.5 rounded luxury-transition ${
                selectedCategory === cat.name
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {cat.name} <span className="text-muted-foreground text-xs">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Price Range</h4>
        <Slider
          min={0}
          max={1500}
          step={10}
          value={priceRange}
          onValueChange={onPriceRangeChange}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Brand */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-2">Brand</h4>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <span className="text-muted-foreground">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Customer Rating */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-2">Customer Rating</h4>
        <div className="space-y-1">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => onMinRatingChange(r)}
              className={`flex items-center gap-1 w-full text-left px-2 py-1 rounded text-sm luxury-transition ${
                minRating === r ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
              }`}
            >
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`h-3 w-3 ${s <= r ? "fill-warning text-warning" : "text-border"}`} />
                ))}
              </div>
              <span className="text-xs">& Up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <Checkbox checked={inStockOnly} onCheckedChange={(v) => onInStockOnlyChange(!!v)} />
          <span className="text-muted-foreground">In Stock Only</span>
        </label>
      </div>
    </div>
  );
};

const FilterSidebar = (props: FilterSidebarProps) => {
  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-56 shrink-0">
        <h3 className="text-base font-semibold text-foreground mb-4">Filters</h3>
        <FilterContent {...props} />
      </aside>

      {/* Mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="lg:hidden flex items-center gap-1.5">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <FilterContent {...props} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default FilterSidebar;
