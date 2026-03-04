import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { toast } from "sonner";



interface ProductForm {
  name: string;
  description: string;
  category: string;
  vendor_name: string;
  sku: string;
  price: string;
  discount_price: string;
  original_price: string;
  stock_count: string;
  image: string;
  badge: string;
}

const emptyForm: ProductForm = {
  name: "", description: "", category: "Electronics", vendor_name: "CephasTech",
  sku: "", price: "", discount_price: "", original_price: "", stock_count: "0",
  image: "", badge: "",
};

const AdminProducts = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (product: ProductForm & { id?: string }) => {
      const payload = {
        name: product.name,
        description: product.description || null,
        category: product.category,
        vendor_name: product.vendor_name,
        sku: product.sku || null,
        price: parseFloat(product.price),
        discount_price: product.discount_price ? parseFloat(product.discount_price) : null,
        original_price: product.original_price ? parseFloat(product.original_price) : null,
        stock_count: parseInt(product.stock_count) || 0,
        image: product.image || null,
        badge: product.badge || null,
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
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const openEdit = (product: any) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      category: product.category,
      vendor_name: product.vendor_name,
      sku: product.sku || "",
      price: String(product.price),
      discount_price: product.discount_price ? String(product.discount_price) : "",
      original_price: product.original_price ? String(product.original_price) : "",
      stock_count: String(product.stock_count),
      image: product.image || "",
      badge: product.badge || "",
    });
    setDialogOpen(true);
  };

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    upsertMutation.mutate({ ...form, id: editingId ?? undefined });
  };

  const set = (key: keyof ProductForm, val: string) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Products ({products.length})</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openNew}>
              <Plus className="h-4 w-4 mr-1" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Product" : "Add Product"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label>Name *</Label>
                  <Input value={form.name} onChange={(e) => set("name", e.target.value)} required />
                </div>
                <div className="col-span-2">
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} />
                </div>
                <div>
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
                <div>
                  <Label>Vendor</Label>
                  <Input value={form.vendor_name} onChange={(e) => set("vendor_name", e.target.value)} />
                </div>
                <div>
                  <Label>Price *</Label>
                  <Input type="number" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} required />
                </div>
                <div>
                  <Label>Discount Price</Label>
                  <Input type="number" step="0.01" value={form.discount_price} onChange={(e) => set("discount_price", e.target.value)} />
                </div>
                <div>
                  <Label>Original Price</Label>
                  <Input type="number" step="0.01" value={form.original_price} onChange={(e) => set("original_price", e.target.value)} />
                </div>
                <div>
                  <Label>Stock Count</Label>
                  <Input type="number" value={form.stock_count} onChange={(e) => set("stock_count", e.target.value)} />
                </div>
                <div>
                  <Label>SKU</Label>
                  <Input value={form.sku} onChange={(e) => set("sku", e.target.value)} />
                </div>
                <div>
                  <Label>Badge</Label>
                  <Select value={form.badge} onValueChange={(v) => set("badge", v)}>
                    <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Best Seller">Best Seller</SelectItem>
                      <SelectItem value="Deal">Deal</SelectItem>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Limited">Limited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Image URL</Label>
                  <Input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://..." />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={upsertMutation.isPending}>
                {upsertMutation.isPending ? "Saving..." : editingId ? "Update Product" : "Add Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading products...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p>No products yet. Add your first product!</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Badge</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {p.image && (
                        <img src={p.image} alt={p.name} className="h-10 w-10 rounded object-cover" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.vendor_name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{p.category}</TableCell>
                  <TableCell>
                    <span className="font-semibold text-sm">${p.price}</span>
                    {p.original_price && (
                      <span className="text-xs text-muted-foreground line-through ml-1">${p.original_price}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm ${p.stock_count === 0 ? "text-destructive" : ""}`}>
                      {p.stock_count}
                    </span>
                  </TableCell>
                  <TableCell>
                    {p.badge && <Badge variant="secondary" className="text-xs">{p.badge}</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm("Delete this product?")) deleteMutation.mutate(p.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
