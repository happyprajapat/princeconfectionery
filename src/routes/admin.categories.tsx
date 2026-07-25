import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchAllCategories, slugify } from "@/lib/catalogue";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const qc = useQueryClient();
  const { data: categories = [] } = useQuery({ queryKey: ["all-categories"], queryFn: fetchAllCategories });
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  function refresh() {
    qc.invalidateQueries({ queryKey: ["all-categories"] });
    qc.invalidateQueries({ queryKey: ["categories"] });
  }

  async function add() {
    const name = newName.trim();
    if (!name) return;
    const { error } = await supabase.from("categories").insert({
      name, slug: `${slugify(name)}-${Date.now().toString(36).slice(-3)}`,
      sort_order: categories.length,
    });
    if (error) toast.error(error.message);
    else { toast.success("Category added"); setNewName(""); refresh(); }
  }

  async function rename(id: string) {
    const name = editName.trim();
    if (!name) return;
    const { error } = await supabase.from("categories").update({ name }).eq("id", id);
    if (error) toast.error(error.message);
    else { setEditing(null); refresh(); }
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Delete category "${name}"? Products will be unassigned.`)) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); refresh(); }
  }

  async function toggleActive(id: string, current: boolean) {
    const { error } = await supabase.from("categories").update({ is_active: !current }).eq("id", id);
    if (error) toast.error(error.message);
    else refresh();
  }

  async function move(id: string, dir: -1 | 1) {
    const idx = categories.findIndex((c) => c.id === id);
    const swap = categories[idx + dir];
    if (!swap) return;
    await supabase.from("categories").update({ sort_order: swap.sort_order }).eq("id", id);
    await supabase.from("categories").update({ sort_order: categories[idx].sort_order }).eq("id", swap.id);
    refresh();
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Categories</h1>
      <p className="text-sm text-muted-foreground">Organise how products are grouped. <span className="font-medium text-foreground">Hiding a category also hides all its products from the public site</span> — you can re-enable it any time.</p>


      <div className="mt-6 flex gap-2 max-w-md">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") add(); }}
          placeholder="New category name"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <button onClick={add} className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
        {categories.map((c, i) => (
          <li key={c.id} className="flex items-center gap-3 px-4 py-3">
            <div className="flex flex-col">
              <button onClick={() => move(c.id, -1)} disabled={i === 0} className="text-xs text-muted-foreground disabled:opacity-30">▲</button>
              <button onClick={() => move(c.id, 1)} disabled={i === categories.length - 1} className="text-xs text-muted-foreground disabled:opacity-30">▼</button>
            </div>
            <div className="flex-1">
              {editing === c.id ? (
                <input value={editName} onChange={(e) => setEditName(e.target.value)} className="rounded border border-border bg-background px-2 py-1 text-sm" autoFocus />
              ) : (
                <span className="font-medium">{c.name}</span>
              )}
              {!c.is_active && <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">Inactive</span>}
            </div>
            <button onClick={() => toggleActive(c.id, c.is_active)} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${c.is_active ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
              {c.is_active ? "Visible" : "Hidden"}
            </button>

            {editing === c.id ? (
              <>
                <button onClick={() => rename(c.id)} className="text-primary"><Check className="h-4 w-4" /></button>
                <button onClick={() => setEditing(null)} className="text-muted-foreground"><X className="h-4 w-4" /></button>
              </>
            ) : (
              <button onClick={() => { setEditing(c.id); setEditName(c.name); }} className="text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></button>
            )}
            <button onClick={() => remove(c.id, c.name)} className="text-destructive hover:opacity-80"><Trash2 className="h-4 w-4" /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}
