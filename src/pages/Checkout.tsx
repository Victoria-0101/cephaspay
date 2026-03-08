import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle, CreditCard, Loader2, ShieldCheck } from "lucide-react";

const Checkout = () => {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [form, setForm] = useState({ name: "", email: user?.email || "", phone: "", address: "", city: "", state: "" });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  // Handle Paystack callback — verify payment when redirected back
  useEffect(() => {
    const reference = searchParams.get("reference");
    const trxref = searchParams.get("trxref");
    const ref = reference || trxref;

    if (ref && !verifying && !placed) {
      setVerifying(true);
      verifyPayment(ref);
    }
  }, [searchParams]);

  const verifyPayment = async (reference: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("paystack", {
        body: { reference },
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      // Construct full URL with query param
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/paystack?action=verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ reference }),
        }
      );

      const result = await res.json();

      if (result.status && result.data?.status === "success") {
        clearCart();
        setPlaced(true);
        toast.success("Payment successful! Your order is confirmed.");
      } else {
        toast.error("Payment verification failed. Please contact support.");
      }
    } catch (err: any) {
      toast.error("Could not verify payment. Please contact support.");
    } finally {
      setVerifying(false);
    }
  };

  if (items.length === 0 && !placed && !verifying && !searchParams.get("reference") && !searchParams.get("trxref")) {
    navigate("/cart");
    return null;
  }

  const handlePayWithPaystack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.address) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!user) {
      toast.error("Please sign in to place an order");
      navigate("/login");
      return;
    }

    setPlacing(true);

    try {
      // 1. Create the order first with "pending" status
      const orderItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          customer_name: form.name,
          customer_email: form.email,
          items: orderItems,
          total: totalPrice,
          shipping_address: `${form.address}, ${form.city}, ${form.state}`,
          status: "pending",
        })
        .select("id")
        .single();

      if (orderError) throw orderError;

      // 2. Initialize Paystack transaction
      const callbackUrl = `${window.location.origin}/checkout`;
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;

      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/paystack?action=initialize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            email: form.email,
            amount: totalPrice,
            callback_url: callbackUrl,
            metadata: {
              order_id: order.id,
              customer_name: form.name,
              custom_fields: [
                { display_name: "Customer Name", variable_name: "customer_name", value: form.name },
                { display_name: "Phone", variable_name: "phone", value: form.phone },
              ],
            },
          }),
        }
      );

      const result = await res.json();

      if (result.status && result.data?.authorization_url) {
        // 3. Redirect to Paystack payment page
        window.location.href = result.data.authorization_url;
      } else {
        throw new Error(result.error || result.message || "Failed to initialize payment");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate payment");
    } finally {
      setPlacing(false);
    }
  };

  if (verifying) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-2">Verifying Payment...</h1>
          <p className="text-muted-foreground text-sm">Please wait while we confirm your payment.</p>
        </div>
      </Layout>
    );
  }

  if (placed) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <CheckCircle className="h-16 w-16 text-[hsl(var(--success))] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground text-sm mb-6">Thank you for your purchase. We'll send a confirmation to your email.</p>
          <Button onClick={() => navigate("/")} className="rounded-full">Continue Shopping</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Checkout</h1>

        {!user && (
          <div className="bg-accent/50 border border-border rounded-lg p-4 mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Please sign in to place your order</p>
            <Button size="sm" onClick={() => navigate("/login")}>Sign In</Button>
          </div>
        )}

        <form onSubmit={handlePayWithPaystack}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-card border border-border rounded-lg p-5 space-y-4">
                <h2 className="font-bold text-foreground">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="John Doe" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="john@example.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+234..." />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Lagos" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="address">Address *</Label>
                  <Input id="address" value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="123 Main Street" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={form.state} onChange={(e) => update("state", e.target.value)} placeholder="Lagos State" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-5 sticky top-32 space-y-4">
                <h2 className="font-bold text-foreground">Order Summary</h2>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity} × ₦{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({totalItems})</span>
                    <span>₦{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery</span>
                    <span className="text-[hsl(var(--success))] font-medium">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border">
                    <span>Total</span>
                    <span>₦{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full h-11 font-semibold"
                  disabled={placing || !user}
                >
                  {placing ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</>
                  ) : (
                    <><CreditCard className="h-4 w-4 mr-2" /> Pay with Paystack</>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secured by Paystack · 256-bit SSL encryption
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
