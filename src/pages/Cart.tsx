import Layout from "@/components/Layout";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground text-sm mb-6">Add some products to get started</p>
          <Button onClick={() => navigate("/")} className="rounded-full">
            Continue Shopping
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Shopping Cart ({totalItems} items)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-card border border-border rounded-lg p-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md cursor-pointer"
                  onClick={() => navigate(`/product/${item.id}`)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.vendor_name}</p>
                  <h3
                    className="text-sm font-medium text-foreground line-clamp-2 cursor-pointer hover:text-primary luxury-transition"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    {item.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-bold text-foreground">₦{item.price.toLocaleString()}</span>
                    {item.original_price > item.price && (
                      <span className="text-xs text-muted-foreground line-through">₦{item.original_price.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border rounded-lg">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-secondary luxury-transition rounded-l-lg">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-sm font-medium text-foreground">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-secondary luxury-transition rounded-r-lg">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-destructive hover:text-destructive/80 luxury-transition p-1.5">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-5 sticky top-32 space-y-4">
              <h2 className="font-bold text-foreground">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₦{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span className="text-success font-medium">Free</span>
                </div>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-foreground">
                <span>Total</span>
                <span>₦{totalPrice.toLocaleString()}</span>
              </div>
              <Button className="w-full rounded-full h-11 font-semibold" onClick={() => navigate("/checkout")}>
                Proceed to Checkout <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
              <Button variant="outline" className="w-full rounded-full" onClick={() => navigate("/")}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
