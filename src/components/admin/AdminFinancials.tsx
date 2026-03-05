import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, TrendingUp, Clock, CreditCard, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const PAGE_SIZE = 10;

const AdminFinancials = () => {
  const [page, setPage] = useState(0);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const delivered = orders.filter((o: any) => o.status === "delivered");
  const pending = orders.filter((o: any) => o.status === "pending" || o.status === "processing");

  const totalRevenue = delivered.reduce((s: number, o: any) => s + Number(o.total || 0), 0);
  const pendingRevenue = pending.reduce((s: number, o: any) => s + Number(o.total || 0), 0);
  const platformFees = totalRevenue * 0.029; // 2.9% fee simulation
  const netPayout = totalRevenue - platformFees;

  // Transaction list = all orders as transactions
  const transactions = orders.map((o: any) => ({
    id: o.id,
    date: o.created_at,
    customer: o.customer_name,
    amount: Number(o.total || 0),
    fee: Number(o.total || 0) * 0.029,
    net: Number(o.total || 0) * 0.971,
    status: o.status === "delivered" ? "paid" : o.status === "cancelled" ? "refunded" : "pending",
  }));

  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);
  const paged = transactions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Financial Reconciliation</h1>
        <p className="text-sm text-muted-foreground">Track your revenue, fees, and payouts</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)
        ) : (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[hsl(var(--success))]/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-[hsl(var(--success))]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Revenue</p>
                    <p className="text-xl font-bold">₦{totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[hsl(var(--warning))]/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-[hsl(var(--warning))]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pending Balance</p>
                    <p className="text-xl font-bold">₦{pendingRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Transaction Fees</p>
                    <p className="text-xl font-bold">₦{platformFees.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    <p className="text-[10px] text-muted-foreground">2.9% processing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Net Payout</p>
                    <p className="text-xl font-bold">₦{netPayout.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-16">
              <DollarSign className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-muted-foreground font-medium">No transactions yet</p>
              <p className="text-xs text-muted-foreground mt-1">Financial data appears as orders are completed</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Net</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-xs">#{tx.id.slice(0, 8)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(tx.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm">{tx.customer}</TableCell>
                      <TableCell className="text-sm font-medium">₦{tx.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                      <TableCell className="text-xs text-destructive">-₦{tx.fee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                      <TableCell className="text-sm font-semibold">₦{tx.net.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                      <TableCell>
                        <Badge
                          variant={tx.status === "paid" ? "default" : tx.status === "refunded" ? "destructive" : "secondary"}
                          className="text-[10px] capitalize"
                        >
                          {tx.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4">
                  <p className="text-xs text-muted-foreground">
                    Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, transactions.length)} of {transactions.length}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFinancials;
