import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchAllCategories, fetchAllProducts } from "@/lib/catalogue";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const qc = useQueryClient();
  const { data: products = [] } = useQuery({ queryKey: ["admin-products"], queryFn: fetchAllProducts });
  const { data: categories = [] } = useQuery({ queryKey: ["all-categories"], queryFn: fetchAllCategories });
  const [q, setQ] = useState("");
  const [filterCat, setFilterCat] = useState<string>("");
  const [filterVis, setFilterVis] = useState<"all" | "visible" | "hidden" | "seasonal">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (filterCat && p.category_id !== filterCat) return false;
      if (filterVis === "visible" && !p.is_visible) return false;
      if (filterVis === "hidden" && p.is_visible) return false;
      if (filterVis === "seasonal" && !p.is_seasonal) return false;
      return true;
    });
  }, [products, q, filterCat, filterVis]);

  const toggleVis = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
      const { error } = await supabase.from("products").update({ is_visible: value }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products", "visible"] });
    },
  });

  const bulkUpdate = useMutation({
    mutationFn: async ({ ids, value }: { ids: string[]; value: boolean }) => {
      const { error } = await supabase.from("products").update({ is_visible: value }).in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products", "visible"] });
      setSelected(new Set());
      toast.success("Updated");
    },
  });

  const bulkDelete = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("products").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products", "visible"] });
      setSelected(new Set());
      toast.success("Deleted");
    },
  });

  function toggle(id: string) {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">{products.length} total • {filtered.length} shown</p>
        </div>
        <Link to="/admin/products/new" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          <Plus className="h-4 w-4" /> Add product
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm" />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterVis} onChange={(e) => setFilterVis(e.target.value as any)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
          <option value="all">All</option>
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
          <option value="seasonal">Seasonal</option>
        </select>
      </div>

      {selected.size > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <button onClick={() => bulkUpdate.mutate({ ids: [...selected], value: true })} className="rounded-md bg-background px-3 py-1.5 text-xs font-medium border border-border">Show all</button>
          <button onClick={() => bulkUpdate.mutate({ ids: [...selected], value: false })} className="rounded-md bg-background px-3 py-1.5 text-xs font-medium border border-border">Hide all</button>
          <button
            onClick={() => { if (confirm(`Delete ${selected.size} product(s)?`)) bulkDelete.mutate([...selected]); }}
            className="rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground"
          >Delete</button>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-3 text-left w-8"></th>
              <th className="px-3 py-3 text-left">Product</th>
              <th className="px-3 py-3 text-left hidden md:table-cell">Category</th>
              <th className="px-3 py-3 text-left hidden lg:table-cell">Pack sizes</th>
              <th className="px-3 py-3 text-left">Visible</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const cat = categories.find((c) => c.id === p.category_id);
              return (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-3 py-3"><input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} /></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                        {p.image_url ? <img src={p.image_url} alt="" className="h-full w-full object-cover" /> : null}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{p.name}</p>
                        {p.is_seasonal && <span className="text-[10px] uppercase tracking-wider text-primary">{p.season_label || "Seasonal"}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell text-muted-foreground">{cat?.name || "—"}</td>
                  <td className="px-3 py-3 hidden lg:table-cell text-muted-foreground text-xs">{p.pack_sizes.join(", ") || "—"}</td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => toggleVis.mutate({ id: p.id, value: !p.is_visible })}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${p.is_visible ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                    >
                      {p.is_visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {p.is_visible ? "Visible" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Link to="/admin/products/$id/edit" params={{ id: p.id }} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs hover:bg-muted">
                      <Pencil className="h-3 w-3" /> Edit
                    </Link>
                    <button
                      onClick={async () => {
                        if (!confirm(`Delete "${p.name}"?`)) return;
                        const { error } = await supabase.from("products").delete().eq("id", p.id);
                        if (error) toast.error(error.message);
                        else {
                          toast.success("Deleted");
                          qc.invalidateQueries({ queryKey: ["admin-products"] });
                          qc.invalidateQueries({ queryKey: ["products", "visible"] });
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-16 text-center text-sm text-muted-foreground">No products to show.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
