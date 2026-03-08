import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, brands } from "@/data/products";

interface HorizontalFilterBarProps {
  searchQuery: string;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  sortBy: string;
  onSortChange: (val: string) => void;
  selectedBrand: string;
  onBrandChange: (val: string) => void;
  onSearchChange: (val: string) => void;
  resultCount: number;
}

const HorizontalFilterBar = ({
  searchQuery,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  selectedBrand,
  onBrandChange,
  onSearchChange,
  resultCount,
}: HorizontalFilterBarProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-3 mb-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Category */}
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-9 w-[140px] text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.name} value={cat.name} className="text-sm">
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Brand */}
          <Select value={selectedBrand} onValueChange={onBrandChange}>
            <SelectTrigger className="h-9 w-[130px] text-xs">
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-sm">All Brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand} className="text-sm">
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="h-9 w-[160px] text-xs">
              <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default" className="text-sm">Default</SelectItem>
              <SelectItem value="price-asc" className="text-sm">Price: Low to High</SelectItem>
              <SelectItem value="price-desc" className="text-sm">Price: High to Low</SelectItem>
              <SelectItem value="rating" className="text-sm">Highest Rated</SelectItem>
              <SelectItem value="newest" className="text-sm">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:block">
          {resultCount} results
        </span>
      </div>
    </div>
  );
};

export default HorizontalFilterBar;
