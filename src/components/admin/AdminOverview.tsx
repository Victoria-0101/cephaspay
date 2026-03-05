import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ShoppingCart, TrendingUp, AlertTriangle, Package } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const revenueData = [
  { month: "Jan", revenue: 4200 }, { month: "Feb", revenue: 5800 },
  { month: "Mar", revenue: 7200 }, { month: "Apr", revenue: 6100 },
  { month: "May", revenue: 8400 }, { month: "Jun", revenue: 9200 },
  { month: "Jul", revenue: 7800 }, { month: "Aug", revenue: 10500 },
  { month: "Sep", revenue: 11200 }, { month: "Oct", revenue: 9800 },
  { month: "Nov", revenue: 13400 }, { month: "Dec", revenue: 15000 },
];

const sparkData = (vals: number[]) => vals.map((v, i) => ({ v, i }));

const KPICard = ({ title, value, change, icon: Icon, spark, color }: {
  title: string; value: string; change: string; icon: typeof DollarSign;
  spark: number[]; color: string;
}) => (
  <Card className="relative overflow-hidden">
    <CardContent className="p-4 md:p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className={`text-xs font-medium ${change.startsWith("+") ? "text-[hsl(var(--success))]" : "text-destructive"}`}>
            {change} vs last month
          </p>
        </div>
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="h-10 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData(spark)}>
            <defs>
              <linearGradient id={`spark-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={1.5}
              fill={`url(#spark-${title})`} dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

const AdminOverview = () => {
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: orders = [], isLoading: loadingOrders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*");
      if (error) throw error;
      return data;
    },
  });

  const totalRevenue = orders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const lowStockCount = products.filter((p: any) => p.stock_count <= 5).length;

  const bestSellers = [...products]
    .sort((a: any, b: any) => (b.review_count || 0) - (a.review_count || 0))
    .slice(0, 5);

  const loading = loadingProducts || loadingOrders;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-5"><Skeleton className="h-24 w-full" /></CardContent></Card>
          ))
        ) : (
          <>
            <KPICard
              title="Total Revenue" value={`₦${totalRevenue.toLocaleString()}`} change="+12.5%"
              icon={DollarSign} spark={[30, 45, 38, 52, 48, 60, 55]}
              color="bg-primary/10 text-primary"
            />
            <KPICard
              title="Total Orders" value={String(orders.length)} change="+8.2%"
              icon={ShoppingCart} spark={[20, 35, 28, 42, 38, 45, 50]}
              color="bg-[hsl(var(--info))]/10 text-[hsl(var(--info))]"
            />
            <KPICard
              title="Avg. Order Value" value={`₦${avgOrderValue.toFixed(2)}`} change="+3.1%"
              icon={TrendingUp} spark={[40, 38, 45, 42, 48, 44, 50]}
              color="bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]"
            />
            <KPICard
              title="Inventory Alerts" value={String(lowStockCount)} change={lowStockCount > 0 ? `${lowStockCount} low` : "All good"}
              icon={AlertTriangle} spark={[5, 8, 3, 6, 4, 7, lowStockCount]}
              color="bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]"
            />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Sales Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickFormatter={(v) => `₦${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`₦${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Best Selling Products */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Best Selling</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : bestSellers.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-40" />
                No products yet
              </div>
            ) : (
              <Table>
                <TableBody>
                  {bestSellers.map((p: any, i: number) => (
                    <TableRow key={p.id}>
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                          {p.image && <img src={p.image} alt="" className="h-8 w-8 rounded object-cover" />}
                          <div>
                            <p className="text-xs font-medium truncate max-w-[120px]">{p.name}</p>
                            <p className="text-[10px] text-muted-foreground">{p.category}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-2.5">
                        <p className="text-xs font-semibold">₦{Number(p.price).toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">{p.stock_count} in stock</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
