import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package, Eye, EyeOff, Sparkles, FolderTree, Plus } from "lucide-react";
import { fetchAllCategories, fetchAllProducts } from "@/lib/catalogue";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: products = [] } = useQuery({ queryKey: ["admin-products"], queryFn: fetchAllProducts });
  const { data: categories = [] } = useQuery({ queryKey: ["all-categories"], queryFn: fetchAllCategories });

  const visible = products.filter((p) => p.is_visible).length;
  const hidden = products.length - visible;
  const seasonalVisible = products.filter((p) => p.is_seasonal && p.is_visible).length;

  const stats = [
    { label: "Total products", value: products.length, icon: Package },
    { label: "Visible on site", value: visible, icon: Eye },
    { label: "Hidden", value: hidden, icon: EyeOff },
    { label: "Seasonal live", value: seasonalVisible, icon: Sparkles },
    { label: "Categories", value: categories.length, icon: FolderTree },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your catalogue.</p>
        </div>
        <Link to="/admin/products/new" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          <Plus className="h-4 w-4" /> Add product
        </Link>
      </div>

      <div className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <s.icon className="h-5 w-5 text-primary" />
            <p className="mt-3 font-display text-3xl font-semibold">{s.value}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Link to="/admin/products" className="rounded-2xl border border-border bg-card p-6 hover:border-primary/40">
          <Package className="h-6 w-6 text-primary" />
          <h2 className="mt-3 font-display text-xl font-semibold">Manage products</h2>
          <p className="mt-1 text-sm text-muted-foreground">Add, edit, toggle visibility, and run bulk seasonal updates.</p>
        </Link>
        <Link to="/admin/categories" className="rounded-2xl border border-border bg-card p-6 hover:border-primary/40">
          <FolderTree className="h-6 w-6 text-primary" />
          <h2 className="mt-3 font-display text-xl font-semibold">Manage categories</h2>
          <p className="mt-1 text-sm text-muted-foreground">Organise products into categories used across the site.</p>
        </Link>
      </div>
    </div>
  );
}
