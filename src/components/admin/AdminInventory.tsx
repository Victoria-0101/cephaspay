import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, Package, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface ProductForm {
  name: string; description: string; category: string; vendor_name: string;
  sku: string; price: string; discount_price: string; original_price: string;
  stock_count: string; image: string; badge: string;
}

const emptyForm: ProductForm = {
  name: "", description: "", category: "Electronics", vendor_name: "CephasTech",
  sku: "", price: "", discount_price: "", original_price: "", stock_count: "0",
  image: "", badge: "",
};

const PAGE_SIZE = 10;

const AdminInventory = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [inlineEditing, setInlineEditing] = useState<{ id: string; field: string } | null>(null);
  const [inlineValue, setInlineValue] = useState("");
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (product: ProductForm & { id?: string }) => {
      const payload = {
        name: product.name, description: product.description || null,
        category: product.category, vendor_name: product.vendor_name,
        sku: product.sku || null, price: parseFloat(product.price),
        discount_price: product.discount_price ? parseFloat(product.discount_price) : null,
        original_price: product.original_price ? parseFloat(product.original_price) : null,
        stock_count: parseInt(product.stock_count) || 0,
        image: product.image || null, badge: product.badge || null,
      };
      if (product.id) {
        const { error } = await supabase.from("products").update(payload).eq("id", product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success(editingId ? "Product updated" : "Product added");
      setSheetOpen(false); setEditingId(null); setForm(emptyForm);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("products").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setSelectedIds(new Set());
      toast.success("Deleted successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const inlineUpdateMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: string; value: number }) => {
      const { error } = await supabase.from("products").update({ [field]: value }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setInlineEditing(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const filtered = products.filter((p: any) => {
    if (statusFilter === "active" && p.stock_count <= 0) return false;
    if (statusFilter === "out_of_stock" && p.stock_count > 0) return false;
    if (statusFilter === "draft" && p.badge !== "Draft") return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const openEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      name: p.name, description: p.description || "", category: p.category,
      vendor_name: p.vendor_name, sku: p.sku || "", price: String(p.price),
      discount_price: p.discount_price ? String(p.discount_price) : "",
      original_price: p.original_price ? String(p.original_price) : "",
      stock_count: String(p.stock_count), image: p.image || "", badge: p.badge || "",
    });
    setSheetOpen(true);
  };

  const set = (key: keyof ProductForm, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const toggleAll = () => {
    if (selectedIds.size === paged.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paged.map((p: any) => p.id)));
    }
  };

  const handleInlineSubmit = (id: string, field: string) => {
    const numValue = field === "stock_count" ? parseInt(inlineValue) : parseFloat(inlineValue);
    if (isNaN(numValue)) { toast.error("Invalid value"); return; }
    inlineUpdateMutation.mutate({ id, field, value: numValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) { toast.error("Name and price required"); return; }
    upsertMutation.mutate({ ...form, id: editingId ?? undefined });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
          <p className="text-sm text-muted-foreground">{products.length} products total</p>
        </div>
        <Button size="sm" onClick={() => { setEditingId(null); setForm(emptyForm); setSheetOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
          <SelectTrigger className="w-[150px] h-9 text-sm">
            <Filter className="h-3.5 w-3.5 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        {selectedIds.size > 0 && (
          <Button variant="destructive" size="sm" className="h-9"
            onClick={() => { if (confirm(`Delete ${selectedIds.size} products?`)) deleteMutation.mutate([...selectedIds]); }}>
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete ({selectedIds.size})
          </Button>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : paged.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-muted-foreground font-medium">No products found</p>
          <p className="text-xs text-muted-foreground mt-1">Add your first product to get started</p>
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-x-auto bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox checked={selectedIds.size === paged.length && paged.length > 0} onCheckedChange={toggleAll} />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((p: any) => (
                  <TableRow key={p.id} className="group">
                    <TableCell>
                      <Checkbox checked={selectedIds.has(p.id)} onCheckedChange={() => toggleSelect(p.id)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {p.image ? (
                          <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover border border-border" />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.vendor_name} · {p.sku || "No SKU"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{p.category}</Badge></TableCell>
                    <TableCell>
                      {inlineEditing?.id === p.id && inlineEditing.field === "price" ? (
                        <Input
                          autoFocus type="number" step="0.01" className="h-7 w-20 text-xs"
                          value={inlineValue}
                          onChange={(e) => setInlineValue(e.target.value)}
                          onBlur={() => handleInlineSubmit(p.id, "price")}
                          onKeyDown={(e) => { if (e.key === "Enter") handleInlineSubmit(p.id, "price"); if (e.key === "Escape") setInlineEditing(null); }}
                        />
                      ) : (
                        <button
                          className="text-sm font-semibold hover:text-primary cursor-pointer"
                          onClick={() => { setInlineEditing({ id: p.id, field: "price" }); setInlineValue(String(p.price)); }}
                        >
                          ${p.price}
                        </button>
                      )}
                    </TableCell>
                    <TableCell>
                      {inlineEditing?.id === p.id && inlineEditing.field === "stock_count" ? (
                        <Input
                          autoFocus type="number" className="h-7 w-16 text-xs"
                          value={inlineValue}
                          onChange={(e) => setInlineValue(e.target.value)}
                          onBlur={() => handleInlineSubmit(p.id, "stock_count")}
                          onKeyDown={(e) => { if (e.key === "Enter") handleInlineSubmit(p.id, "stock_count"); if (e.key === "Escape") setInlineEditing(null); }}
                        />
                      ) : (
                        <button
                          className={`text-sm cursor-pointer hover:text-primary ${p.stock_count <= 5 ? "text-destructive font-semibold" : ""}`}
                          onClick={() => { setInlineEditing({ id: p.id, field: "stock_count" }); setInlineValue(String(p.stock_count)); }}
                        >
                          {p.stock_count}
                        </button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.stock_count > 0 ? "default" : "destructive"} className="text-[10px]">
                        {p.stock_count > 0 ? "Active" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 luxury-transition">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                          onClick={() => { if (confirm("Delete?")) deleteMutation.mutate([p.id]); }}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
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

      {/* Add/Edit Product Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingId ? "Edit Product" : "Add Product"}</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label>Product Name *</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => set("category", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Phones">Phones</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Vendor</Label>
                <Input value={form.vendor_name} onChange={(e) => set("vendor_name", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Price *</Label>
                <Input type="number" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Discount</Label>
                <Input type="number" step="0.01" value={form.discount_price} onChange={(e) => set("discount_price", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Original</Label>
                <Input type="number" step="0.01" value={form.original_price} onChange={(e) => set("original_price", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input type="number" value={form.stock_count} onChange={(e) => set("stock_count", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input value={form.sku} onChange={(e) => set("sku", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Badge</Label>
              <Select value={form.badge} onValueChange={(v) => set("badge", v)}>
                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Best Seller">Best Seller</SelectItem>
                  <SelectItem value="Deal">Deal</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Limited">Limited</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://..." />
              {form.image && <img src={form.image} alt="Preview" className="h-20 w-20 rounded-lg object-cover border" />}
            </div>
            <Button type="submit" className="w-full" disabled={upsertMutation.isPending}>
              {upsertMutation.isPending ? "Saving..." : editingId ? "Update Product" : "Add Product"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminInventory;
