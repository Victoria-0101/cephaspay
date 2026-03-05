import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const PAGE_SIZE = 10;

const AdminCustomers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Aggregate customers from orders
  const customerMap = new Map<string, { email: string; name: string; orders: number; totalSpent: number; lastOrder: string }>();
  orders.forEach((o: any) => {
    const key = o.customer_email;
    const existing = customerMap.get(key);
    if (existing) {
      existing.orders++;
      existing.totalSpent += Number(o.total || 0);
      if (o.created_at > existing.lastOrder) existing.lastOrder = o.created_at;
    } else {
      customerMap.set(key, {
        email: o.customer_email,
        name: o.customer_name,
        orders: 1,
        totalSpent: Number(o.total || 0),
        lastOrder: o.created_at,
      });
    }
  });

  let customers = Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    customers = customers.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }

  const totalPages = Math.ceil(customers.length / PAGE_SIZE);
  const paged = customers.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        <p className="text-sm text-muted-foreground">{customers.length} customers</p>
      </div>

      <div className="flex gap-4 mb-2">
        <Card className="flex-1">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{customers.length}</p>
              <p className="text-xs text-muted-foreground">Total Customers</p>
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[hsl(var(--success))]/10 flex items-center justify-center">
              <span className="text-[hsl(var(--success))] font-bold text-sm">₦</span>
            </div>
            <div>
              <p className="text-2xl font-bold">
                ₦{customers.length > 0 ? Math.round(customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length).toLocaleString() : 0}
              </p>
              <p className="text-xs text-muted-foreground">Avg. Lifetime Value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
          className="pl-9 h-9 text-sm"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : paged.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-muted-foreground font-medium">No customers yet</p>
          <p className="text-xs text-muted-foreground mt-1">Customer data will populate from orders</p>
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-x-auto bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent (LTV)</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Segment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((c) => (
                  <TableRow key={c.email}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{c.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{c.orders}</TableCell>
                    <TableCell className="text-sm font-semibold">₦{c.totalSpent.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(c.lastOrder).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={c.totalSpent > 500 ? "default" : c.totalSpent > 100 ? "secondary" : "outline"} className="text-[10px]">
                        {c.totalSpent > 500 ? "VIP" : c.totalSpent > 100 ? "Regular" : "New"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, customers.length)} of {customers.length}
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 0} onClick={() => setPage(page - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs px-2">{page + 1} / {totalPages}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminCustomers;
