import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import HeroCarousel from "@/components/HeroCarousel";
import FilterSidebar from "@/components/FilterSidebar";
import { products as staticProducts } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { ArrowRight, TrendingUp, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1500000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  const { data: dbProducts, isLoading: loading } = useQuery({
    queryKey: ["storefront-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      return (data || []).map((p): Product => ({
        id: p.id,
        name: p.name,
        vendor_name: p.vendor_name,
        price: Number(p.price),
        original_price: Number(p.original_price ?? p.price),
        discount_percentage: p.original_price && p.original_price > p.price
          ? Math.round(((Number(p.original_price) - Number(p.price)) / Number(p.original_price)) * 100)
          : 0,
        image: p.image || "/placeholder.svg",
        category: p.category,
        description: p.description || "",
        rating: Number(p.rating ?? 0),
        review_count: p.review_count ?? 0,
        stock_count: p.stock_count,
        badge: (p.badge === "best-seller" || p.badge === "limited-stock" || p.badge === "deal") ? p.badge : undefined,
        sku: p.sku || "",
        specifications: (p.specifications as Record<string, string>) || {},
      }));
    },
  });

  const products = [...(dbProducts || []), ...staticProducts];

  const filtered = products.filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery) && !p.description?.toLowerCase().includes(searchQuery) && !p.category.toLowerCase().includes(searchQuery)) return false;
    if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (selectedBrands.length > 0 && !selectedBrands.some((b) => p.vendor_name.toLowerCase().includes(b.toLowerCase()))) return false;
    if (p.rating < minRating) return false;
    if (inStockOnly && p.stock_count === 0) return false;
    return true;
  });

  return (
    <Layout>
      {/* Hero */}
      <HeroCarousel />

      {/* Category quick links */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["Phones", "Accessories", "Electronics", "Deals", "New Arrivals", "Best Sellers"].map((cat) => (
            <Button
              key={cat}
              variant="outline"
              size="sm"
              className="shrink-0 rounded-full text-xs h-8"
              onClick={() => setSelectedCategory(cat === "Deals" || cat === "New Arrivals" || cat === "Best Sellers" ? "All" : cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 pb-10">
        <div className="flex items-start gap-8">
          {/* Sidebar */}
          <FilterSidebar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            selectedBrands={selectedBrands}
            onBrandsChange={setSelectedBrands}
            minRating={minRating}
            onMinRatingChange={setMinRating}
            inStockOnly={inStockOnly}
            onInStockOnlyChange={setInStockOnly}
          />

          {/* Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h2 className="text-lg font-bold text-foreground">
                  {searchQuery ? `Results for "${searchParams.get("q")}"` : selectedCategory === "All" ? "All Products" : selectedCategory}
                </h2>
                <span className="text-xs text-muted-foreground">({filtered.length} results)</span>
              </div>
              <a
                href="#"
                className="text-xs font-medium text-primary hover:text-primary/80 luxury-transition flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : filtered.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
            </div>

            {!loading && filtered.length === 0 && (
              <div className="text-center py-20 space-y-4">
                <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <SearchX className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-foreground">No results found</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    {searchQuery
                      ? `We couldn't find anything matching "${searchParams.get("q")}". Try a different search term.`
                      : "No products match your current filters. Try adjusting them."}
                  </p>
                </div>
                {searchQuery && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Try searching for:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {["iPhone", "Samsung", "Charger", "Headphones", "Laptop"].map((term) => (
                        <Button
                          key={term}
                          variant="outline"
                          size="sm"
                          className="rounded-full text-xs h-7"
                          onClick={() => navigate(`/?q=${encodeURIComponent(term)}`)}
                        >
                          {term}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                  setSelectedCategory("All");
                  setPriceRange([0, 1500000]);
                  setSelectedBrands([]);
                  setMinRating(0);
                  setInStockOnly(false);
                  navigate("/");
                }}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
