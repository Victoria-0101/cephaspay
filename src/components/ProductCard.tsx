import { Product } from "@/types/product";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

interface ProductCardProps {
  product: Product;
  index: number;
}

const HighlightText = ({ text, query }: { text: string; query: string }) => {
  if (!query) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary/20 text-foreground rounded-sm px-0.5">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

const badgeConfig = {
  "best-seller": { label: "Best Seller", className: "bg-primary text-primary-foreground" },
  "limited-stock": { label: "Limited Stock", className: "bg-warning text-warning-foreground" },
  "deal": { label: "Deal", className: "bg-destructive text-destructive-foreground" },
};

const ProductCard = ({ product, index }: ProductCardProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      original_price: product.original_price,
      image: product.image,
      vendor_name: product.vendor_name,
      stock_count: product.stock_count,
    });
    toast.success(`${product.name.slice(0, 30)}... added to cart`);
  };

  return (
    <div
      className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg luxury-transition opacity-0 animate-fade-in cursor-pointer"
      style={{ animationDelay: `${index * 80}ms` }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-105 luxury-transition"
          loading="lazy"
        />
        {product.badge && (
          <Badge className={`absolute top-2 left-2 text-[10px] font-semibold ${badgeConfig[product.badge].className}`}>
            {badgeConfig[product.badge].label}
          </Badge>
        )}
        {product.discount_percentage > 0 && (
          <Badge variant="secondary" className="absolute top-2 right-2 text-[10px] font-bold bg-foreground text-background">
            -{product.discount_percentage}%
          </Badge>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{product.vendor_name}</p>
        <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${star <= Math.round(product.rating) ? "fill-warning text-warning" : "text-border"}`}
              />
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground">
            {product.rating} ({product.review_count.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold text-foreground">₦{product.price.toLocaleString()}</span>
          {product.original_price > product.price && (
            <span className="text-xs text-muted-foreground line-through">₦{product.original_price.toLocaleString()}</span>
          )}
        </div>

        {/* Stock */}
        {product.stock_count < 20 && (
          <p className="text-[10px] text-destructive font-medium">Only {product.stock_count} left in stock</p>
        )}

        {/* Add to cart */}
        <Button
          size="sm"
          className="w-full mt-1 h-8 text-xs font-semibold rounded-full"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-3.5 w-3.5 mr-1" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
