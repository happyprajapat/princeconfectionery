import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, X, Plus, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchAllProducts, type Product } from "@/lib/catalogue";

export const Route = createFileRoute("/admin/featured")({
  component: AdminFeatured,
});

const MAX = 6;

function AdminFeatured() {
  const qc = useQueryClient();
  const { data: products = [], isLoading } = useQuery({ queryKey: ["admin-products"], queryFn: fetchAllProducts });

  const initialIds = useMemo(
    () =>
      [...products]
        .filter((p) => p.featured_order != null)
        .sort((a, b) => (a.featured_order ?? 0) - (b.featured_order ?? 0))
        .map((p) => p.id),
    [products]
  );
  const [order, setOrder] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => setOrder(initialIds), [initialIds]);

  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const available = products.filter((p) => !order.includes(p.id) && p.is_visible);
  const filtered = available.filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()));
  const dirty = JSON.stringify(order) !== JSON.stringify(initialIds);

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const n = [...order];
    [n[i], n[j]] = [n[j], n[i]];
    setOrder(n);
  }
  function remove(id: string) {
    setOrder(order.filter((x) => x !== id));
  }
  function add(id: string) {
    if (order.length >= MAX) return toast.error(`Maximum ${MAX} products`);
    setOrder([...order, id]);
    setPickerOpen(false);
    setQ("");
  }

  const save = useMutation({
    mutationFn: async () => {
      // Clear all current featured, then set new order
      const { error: e1 } = await supabase.from("products").update({ featured_order: null }).not("featured_order", "is", null);
      if (e1) throw e1;
      for (let i = 0; i < order.length; i++) {
        const { error } = await supabase.from("products").update({ featured_order: i + 1 }).eq("id", order[i]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Featured products saved");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products", "featured"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" /> Home featured products
          </h1>
          <p className="text-sm text-muted-foreground">Pick up to {MAX} products to showcase on the homepage. Drag order with the arrow buttons.</p>
        </div>
        <button
          disabled={!dirty || save.isPending}
          onClick={() => save.mutate()}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {save.isPending ? "Saving..." : "Save changes"}
        </button>
      </div>

      {isLoading ? (
        <div className="mt-8 h-64 animate-pulse rounded-xl bg-muted" />
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {order.map((id, i) => {
              const p = byId.get(id);
              if (!p) return null;
              return (
                <div key={id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">{i + 1}</span>
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                    {p.image_url ? <img src={p.image_url} alt="" className="h-full w-full object-cover" /> : null}
                  </div>
                  <p className="flex-1 truncate text-sm font-medium">{p.name}</p>
                  <div className="flex gap-1">
                    <button onClick={() => move(i, -1)} disabled={i === 0} className="rounded-md p-1.5 hover:bg-muted disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                    <button onClick={() => move(i, 1)} disabled={i === order.length - 1} className="rounded-md p-1.5 hover:bg-muted disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
                    <button onClick={() => remove(id)} className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"><X className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              );
            })}
            {Array.from({ length: Math.max(0, MAX - order.length) }).map((_, i) => (
              <button
                key={`empty-${i}`}
                onClick={() => setPickerOpen(true)}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card/30 p-6 text-sm text-muted-foreground hover:border-primary hover:text-primary"
              >
                <Plus className="h-4 w-4" /> Add product
              </button>
            ))}
          </div>

          {pickerOpen && (
            <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4" onClick={() => setPickerOpen(false)}>
              <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold">Choose a product</h2>
                  <button onClick={() => setPickerOpen(false)}><X className="h-5 w-5" /></button>
                </div>
                <input
                  autoFocus value={q} onChange={(e) => setQ(e.target.value)}
                  placeholder="Search visible products..."
                  className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <div className="mt-3 max-h-80 overflow-auto space-y-1">
                  {filtered.map((p) => (
                    <button
                      key={p.id} onClick={() => add(p.id)}
                      className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-muted"
                    >
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                        {p.image_url ? <img src={p.image_url} alt="" className="h-full w-full object-cover" /> : null}
                      </div>
                      <span className="text-sm">{p.name}</span>
                    </button>
                  ))}
                  {filtered.length === 0 && <p className="p-4 text-center text-sm text-muted-foreground">No matching products.</p>}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
