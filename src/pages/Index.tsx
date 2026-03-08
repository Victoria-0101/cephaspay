import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import HeroCarousel from "@/components/HeroCarousel";
import HorizontalFilterBar from "@/components/HorizontalFilterBar";
import QuickViewDialog from "@/components/QuickViewDialog";
import { products as staticProducts } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q")?.toLowerCase() || "";

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [localSearch, setLocalSearch] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

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
  const searchQuery = urlQuery || localSearch.toLowerCase();

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery) && !p.description?.toLowerCase().includes(searchQuery) && !p.category.toLowerCase().includes(searchQuery)) return false;
      if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
      if (selectedBrand !== "all" && !p.vendor_name.toLowerCase().includes(selectedBrand.toLowerCase())) return false;
      return true;
    });

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedBrand, sortBy]);

  const clearAll = () => {
    setSelectedCategory("All");
    setSortBy("default");
    setSelectedBrand("all");
    setLocalSearch("");
    navigate("/");
  };

  return (
    <Layout>
      <HeroCarousel />

      <section id="products" className="container mx-auto px-4 py-6 pb-10">
        {/* Horizontal filter bar */}
        <HorizontalFilterBar
          searchQuery={urlQuery ? searchParams.get("q") || "" : localSearch}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedBrand={selectedBrand}
          onBrandChange={setSelectedBrand}
          onSearchChange={(val) => {
            setLocalSearch(val);
            if (urlQuery) navigate("/");
          }}
          resultCount={filtered.length}
        />

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : filtered.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onQuickView={setQuickViewProduct}
                />
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
                  ? `We couldn't find anything matching "${searchQuery}". Try a different search term.`
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
            <Button variant="outline" size="sm" className="mt-2" onClick={clearAll}>
              Clear All Filters
            </Button>
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      <QuickViewDialog
        product={quickViewProduct}
        open={!!quickViewProduct}
        onOpenChange={(open) => !open && setQuickViewProduct(null)}
      />
    </Layout>
  );
};

export default Index;
