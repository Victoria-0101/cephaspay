import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Eye, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

const statusConfig: Record<string, { color: string; bg: string }> = {
  pending: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  processing: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  shipped: { color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  delivered: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  cancelled: { color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

const AdminOrderFulfillment = () => {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    );
  }

  const grouped = statuses.reduce((acc, status) => {
    acc[status] = orders.filter((o: any) => o.status === status);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Order Fulfillment</h1>
          <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === "kanban" ? "default" : "outline"} size="sm" onClick={() => setViewMode("kanban")}>
            Kanban
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            List
          </Button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-muted-foreground font-medium">No orders yet</p>
          <p className="text-xs text-muted-foreground mt-1">Orders will appear here when customers make purchases</p>
        </div>
      ) : viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 items-start">
          {statuses.map((status) => (
            <div key={status} className={`rounded-xl border p-3 ${statusConfig[status].bg}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-semibold capitalize ${statusConfig[status].color}`}>{status}</h3>
                <Badge variant="secondary" className="text-[10px] h-5">{grouped[status].length}</Badge>
              </div>
              <div className="space-y-2">
                {grouped[status].map((order: any) => (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="cursor-pointer hover:shadow-md luxury-transition" onClick={() => setSelectedOrder(order)}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-mono font-medium">#{order.id.slice(0, 6)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm font-medium truncate">{order.customer_name}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">
                            {Array.isArray(order.items) ? order.items.length : 0} items
                          </p>
                          <p className="text-sm font-bold">₦{Number(order.total).toLocaleString()}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                {grouped[status].length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-6">No orders</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List view */
        <div className="space-y-2">
          {orders.map((order: any) => (
            <Card key={order.id} className="cursor-pointer hover:shadow-sm luxury-transition" onClick={() => setSelectedOrder(order)}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-xs font-mono font-medium">#{order.id.slice(0, 8)}</p>
                  <div>
                    <p className="text-sm font-medium">{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-bold">₦{Number(order.total).toLocaleString()}</p>
                  <Badge variant="outline" className={`capitalize text-xs ${statusConfig[order.status]?.color}`}>
                    {order.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id?.slice(0, 8)}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="text-sm font-medium">{selectedOrder.customer_name}</p>
                  <p className="text-xs text-muted-foreground">{selectedOrder.customer_email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Order Date</p>
                  <p className="text-sm font-medium">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-lg font-bold">₦{Number(selectedOrder.total).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(v) => {
                      updateStatus.mutate({ id: selectedOrder.id, status: v });
                      setSelectedOrder({ ...selectedOrder, status: v });
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s} value={s} className="capitalize text-xs">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedOrder.shipping_address && (
                <div>
                  <p className="text-xs text-muted-foreground">Shipping Address</p>
                  <p className="text-sm">{selectedOrder.shipping_address}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-muted-foreground mb-2">Items</p>
                {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                  <div className="space-y-2">
                    {selectedOrder.items.map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between bg-muted/50 rounded-lg p-2">
                        <p className="text-sm">{item.name || `Item ${i + 1}`}</p>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity || 1}</p>
                          <p className="text-sm font-semibold">₦{item.price ? Number(item.price).toLocaleString() : "—"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No item details</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrderFulfillment;
