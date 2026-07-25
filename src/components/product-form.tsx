import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { X, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchAllCategories, slugify, type Product } from "@/lib/catalogue";

export type ProductFormValues = {
  name: string;
  category_id: string | null;
  description: string;
  pack_sizes: string[];
  image_url: string | null;
  is_visible: boolean;
};

export function ProductForm({ initial, productId }: { initial?: Product; productId?: string }) {
  const navigate = useNavigate();
  const { data: categories = [] } = useQuery({ queryKey: ["all-categories"], queryFn: fetchAllCategories });

  const [values, setValues] = useState<ProductFormValues>({
    name: initial?.name ?? "",
    category_id: initial?.category_id ?? null,
    description: initial?.description ?? "",
    pack_sizes: initial?.pack_sizes ?? [],
    image_url: initial?.image_url ?? null,
    is_visible: initial?.is_visible ?? true,
  });
  const [packInput, setPackInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof ProductFormValues>(k: K, v: ProductFormValues[K]) {
    setValues((s) => ({ ...s, [k]: v }));
  }

  function addPack() {
    const t = packInput.trim();
    if (!t) return;
    if (values.pack_sizes.includes(t)) return;
    update("pack_sizes", [...values.pack_sizes, t]);
    setPackInput("");
  }

  async function handleImage(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      update("image_url", data.publicUrl);
      toast.success("Image uploaded");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = initial?.slug ?? `${slugify(values.name)}-${Date.now().toString(36).slice(-4)}`;
      const payload = {
        name: values.name,
        slug,
        category_id: values.category_id,
        description: values.description || null,
        pack_sizes: values.pack_sizes,
        image_url: values.image_url,
        is_visible: values.is_visible,
      };
      if (productId) {
        const { error } = await supabase.from("products").update(payload).eq("id", productId);
        if (error) throw error;
        toast.success("Product updated");
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
        toast.success("Product created");
      }
      navigate({ to: "/admin/products" });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-6">
      <Field label="Product name">
        <input required value={values.name} onChange={(e) => update("name", e.target.value)} className="input" />
      </Field>

      <Field label="Category">
        <select value={values.category_id ?? ""} onChange={(e) => update("category_id", e.target.value || null)} className="input">
          <option value="">No category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}{!c.is_active ? " (hidden)" : ""}</option>)}
        </select>
      </Field>

      <Field label="Description">
        <textarea rows={4} value={values.description} onChange={(e) => update("description", e.target.value)} className="input" />
      </Field>

      <Field label="Pack sizes">
        <div className="flex flex-wrap gap-2 mb-2">
          {values.pack_sizes.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs">
              {s}
              <button type="button" onClick={() => update("pack_sizes", values.pack_sizes.filter((x) => x !== s))}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={packInput}
            onChange={(e) => setPackInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPack(); } }}
            placeholder="e.g. 200g, 500g, 1kg"
            className="input flex-1"
          />
          <button type="button" onClick={addPack} className="rounded-lg border border-border bg-background px-4 py-2 text-sm">Add</button>
        </div>
      </Field>

      <Field label="Image">
        <div className="flex items-center gap-4">
          {values.image_url ? (
            <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-border">
              <img src={values.image_url} alt="" className="h-full w-full object-cover" />
              <button type="button" onClick={() => update("image_url", null)} className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-destructive text-destructive-foreground">
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="grid h-24 w-24 place-items-center rounded-lg border border-dashed border-border text-muted-foreground">
              <Upload className="h-5 w-5" />
            </div>
          )}
          <label className="cursor-pointer rounded-lg border border-border bg-background px-4 py-2 text-sm hover:bg-muted">
            {uploading ? "Uploading..." : "Choose image"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImage(f); }} />
          </label>
        </div>
      </Field>

      <div className="rounded-xl border border-border bg-card p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={values.is_visible} onChange={(e) => update("is_visible", e.target.checked)} />
          <span className="text-sm font-medium">Visible on public website</span>
        </label>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">
          {saving ? "Saving..." : productId ? "Update product" : "Create product"}
        </button>
        <button type="button" onClick={() => navigate({ to: "/admin/products" })} className="rounded-full border border-border bg-background px-6 py-2.5 text-sm">
          Cancel
        </button>
      </div>

      <style>{`
        .input { width: 100%; border-radius: 0.5rem; border: 1px solid var(--color-border); background: var(--color-background); padding: 0.55rem 0.75rem; font-size: 0.875rem; }
        .input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 1px var(--color-primary); }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{label}</label>
      {children}
    </div>
  );
}
