import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Star, ChevronLeft, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";

const badgeConfig = {
  "best-seller": { label: "Best Seller", className: "bg-primary text-primary-foreground" },
  "limited-stock": { label: "Limited Stock", className: "bg-warning text-warning-foreground" },
  "deal": { label: "Deal", className: "bg-destructive text-destructive-foreground" },
};

const fakeReviews = [
  { id: 1, name: "Adebayo O.", rating: 5, date: "2 weeks ago", text: "Excellent product! Fast delivery and exactly as described. Very happy with my purchase." },
  { id: 2, name: "Chioma N.", rating: 4, date: "1 month ago", text: "Good quality, works perfectly. Packaging could have been better but overall satisfied." },
  { id: 3, name: "Ibrahim M.", rating: 5, date: "1 month ago", text: "Best price I found anywhere. Product is genuine and works great. Will buy again!" },
  { id: 4, name: "Funke A.", rating: 4, date: "2 months ago", text: "Nice product. Took a few days to arrive but worth the wait. Recommended." },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Shop
          </Button>
        </div>
      </Layout>
    );
  }

  // Simulate multiple images using the same image
  const images = [product.image, product.image, product.image];

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      original_price: product.original_price,
      image: product.image,
      vendor_name: product.vendor_name,
      stock_count: product.stock_count,
    }, quantity);
    toast.success(`${quantity}x ${product.name.slice(0, 30)}... added to cart`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 luxury-transition"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary border border-border">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {product.badge && (
                <Badge className={`absolute top-3 left-3 text-xs font-semibold ${badgeConfig[product.badge].className}`}>
                  {badgeConfig[product.badge].label}
                </Badge>
              )}
              {product.discount_percentage > 0 && (
                <Badge variant="secondary" className="absolute top-3 right-3 text-xs font-bold bg-foreground text-background">
                  -{product.discount_percentage}%
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 luxury-transition ${
                    selectedImageIndex === i ? "border-primary" : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <img src={img} alt={`View ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.vendor_name}</p>
              <h1 className="text-2xl font-bold text-foreground leading-tight">{product.name}</h1>
              <p className="text-xs text-muted-foreground mt-1">SKU: {product.sku}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= Math.round(product.rating) ? "fill-warning text-warning" : "text-border"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.review_count.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">₦{product.price.toLocaleString()}</span>
              {product.original_price > product.price && (
                <span className="text-lg text-muted-foreground line-through">₦{product.original_price.toLocaleString()}</span>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Stock */}
            {product.stock_count < 20 ? (
              <p className="text-sm text-destructive font-medium">Only {product.stock_count} left in stock</p>
            ) : (
              <p className="text-sm text-success font-medium">In Stock</p>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-secondary luxury-transition rounded-l-lg"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 text-sm font-medium text-foreground">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock_count, quantity + 1))}
                  className="p-2 hover:bg-secondary luxury-transition rounded-r-lg"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button onClick={handleAddToCart} className="flex-1 h-11 text-sm font-semibold rounded-full">
                <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
              </Button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
              {[
                { icon: Truck, label: "Free Delivery" },
                { icon: Shield, label: "1 Year Warranty" },
                { icon: RotateCcw, label: "Easy Returns" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 text-center">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-[11px] text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Specifications & Reviews */}
        <Tabs defaultValue="specs" className="mt-12">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({fakeReviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="specs" className="mt-4">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              {Object.entries(product.specifications).map(([key, value], i) => (
                <div
                  key={key}
                  className={`flex justify-between px-4 py-3 text-sm ${i % 2 === 0 ? "bg-secondary/50" : ""}`}
                >
                  <span className="text-muted-foreground font-medium">{key}</span>
                  <span className="text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4 space-y-4">
            {fakeReviews.map((review) => (
              <div key={review.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">{review.name}</span>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${star <= review.rating ? "fill-warning text-warning" : "text-border"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.text}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProductDetail;
