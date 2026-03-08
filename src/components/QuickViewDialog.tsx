import { Product } from "@/types/product";
import { ShoppingCart, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface QuickViewDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuickViewDialog = ({ product, open, onOpenChange }: QuickViewDialogProps) => {
  const { addItem } = useCart();
  const navigate = useNavigate();

  if (!product) return null;

  const handleAddToCart = () => {
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
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="grid sm:grid-cols-2 gap-0">
          {/* Image */}
          <div className="aspect-square bg-secondary relative">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            {product.badge && (
              <Badge className="absolute top-3 left-3 text-xs">
                {product.badge === "best-seller" ? "Best Seller" : product.badge === "limited-stock" ? "Limited Stock" : "Deal"}
              </Badge>
            )}
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col">
            <DialogHeader className="text-left mb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.vendor_name}</p>
              <DialogTitle className="text-base font-semibold leading-snug mt-1">{product.name}</DialogTitle>
              <DialogDescription className="sr-only">Quick view of {product.name}</DialogDescription>
            </DialogHeader>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3.5 w-3.5 ${star <= Math.round(product.rating) ? "fill-warning text-warning" : "text-border"}`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {product.rating} ({product.review_count.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-foreground">₦{product.price.toLocaleString()}</span>
              {product.original_price > product.price && (
                <span className="text-sm text-muted-foreground line-through">₦{product.original_price.toLocaleString()}</span>
              )}
              {product.discount_percentage > 0 && (
                <Badge variant="secondary" className="text-[10px] font-bold bg-foreground text-background">-{product.discount_percentage}%</Badge>
              )}
            </div>

            {/* Stock indicator */}
            <div className="mb-3">
              {product.stock_count > 20 ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[hsl(var(--success))]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))]" /> In Stock
                </span>
              ) : product.stock_count > 0 ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[hsl(var(--warning))]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--warning))]" /> Only {product.stock_count} left
                </span>
              ) : (
                <span className="text-xs font-medium text-destructive">Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
              {product.description}
            </p>

            {/* Actions */}
            <div className="space-y-2 mt-auto">
              <Button className="w-full h-10 font-semibold" onClick={handleAddToCart} disabled={product.stock_count === 0}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="w-full h-10 text-sm"
                onClick={() => { onOpenChange(false); navigate(`/product/${product.id}`); }}
              >
                View Full Details
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewDialog;
