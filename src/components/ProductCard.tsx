import { Product } from "@/types/product";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  return (
    <div
      className="group opacity-0 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover luxury-transition group-hover:scale-105"
          loading="lazy"
        />
        <button
          className="absolute bottom-3 right-3 p-2.5 rounded-full bg-background/90 backdrop-blur-sm text-foreground opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 luxury-transition shadow-sm hover:bg-primary hover:text-primary-foreground"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
        <span className="absolute top-3 left-3 text-[10px] font-medium uppercase tracking-widest text-muted-foreground bg-background/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
          {product.category}
        </span>
      </div>

      {/* Info */}
      <div>
        <h3 className="text-sm font-medium text-foreground leading-snug mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
          {product.description}
        </p>
        <p className="text-sm font-semibold text-foreground">
          ${product.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
