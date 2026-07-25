import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Package, Eye, EyeOff, FolderTree, Plus, Star, TrendingUp,
  Layers, ImageOff, ArrowUpRight, Activity, Boxes,
} from "lucide-react";
import { fetchAllCategories, fetchAllProducts } from "@/lib/catalogue";
import { useMemo } from "react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: products = [], isLoading: pl } = useQuery({ queryKey: ["admin-products"], queryFn: fetchAllProducts });
  const { data: categories = [], isLoading: cl } = useQuery({ queryKey: ["all-categories"], queryFn: fetchAllCategories });

  const visible = products.filter((p) => p.is_visible).length;
  const hidden = products.length - visible;
  const featured = products.filter((p) => p.featured_order !== null).length;
  const missingImage = products.filter((p) => !p.image_url).length;
  const hiddenCats = categories.filter((c) => !c.is_active).length;

  // Products per category (for the bar chart)
  const byCategory = useMemo(() => {
    const map = new Map<string, { name: string; count: number; visible: number; active: boolean }>();
    for (const c of categories) map.set(c.id, { name: c.name, count: 0, visible: 0, active: c.is_active });
    map.set("__none", { name: "Uncategorised", count: 0, visible: 0, active: true });
    for (const p of products) {
      const key = p.category_id ?? "__none";
      const entry = map.get(key);
      if (!entry) continue;
      entry.count += 1;
      if (p.is_visible) entry.visible += 1;
    }
    return [...map.values()].filter((v) => v.count > 0).sort((a, b) => b.count - a.count);
  }, [products, categories]);

  const maxCount = Math.max(1, ...byCategory.map((c) => c.count));

  const recent = [...products]
    .sort((a, b) => (a.created_at > b.created_at ? -1 : 1))
    .slice(0, 6);

  const stats = [
    { label: "Total products", value: products.length, icon: Package, tint: "from-indigo-500 to-blue-500" },
    { label: "Visible", value: visible, icon: Eye, tint: "from-emerald-500 to-teal-500" },
    { label: "Hidden", value: hidden, icon: EyeOff, tint: "from-slate-500 to-slate-700" },
    { label: "Categories", value: categories.length, sub: hiddenCats ? `${hiddenCats} hidden` : "all live", icon: FolderTree, tint: "from-fuchsia-500 to-purple-600" },
    { label: "Featured on home", value: featured, icon: Star, tint: "from-amber-500 to-orange-500" },
    { label: "Missing image", value: missingImage, icon: ImageOff, tint: "from-rose-500 to-red-500" },
  ];

  const loading = pl || cl;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-black/20 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Admin dashboard</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Welcome back 👋</h1>
            <p className="mt-2 max-w-lg text-sm text-white/80">
              A quick look at your catalogue health — products, categories, visibility and what's live on the public site right now.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/products/new" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-white/90">
              <Plus className="h-4 w-4" /> Add product
            </Link>
            <Link to="/admin/featured" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 hover:bg-white/20">
              <Star className="h-4 w-4" /> Home featured
            </Link>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${s.tint}`} />
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.tint} text-white shadow-md`}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 font-display text-3xl font-extrabold tracking-tight">
              {loading ? <span className="inline-block h-7 w-10 animate-pulse rounded bg-muted" /> : s.value}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
            {s.sub && <p className="mt-0.5 text-[11px] text-muted-foreground/80">{s.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Category breakdown */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" /> Products by category
              </h2>
              <p className="text-xs text-muted-foreground">Visible vs total per category</p>
            </div>
            <Link to="/admin/categories" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
              Manage <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {byCategory.length === 0 && !loading && (
              <p className="text-sm text-muted-foreground">No products yet. Add your first product to see the breakdown.</p>
            )}
            {byCategory.map((c) => {
              const pct = (c.count / maxCount) * 100;
              const visPct = c.count === 0 ? 0 : (c.visible / c.count) * 100;
              return (
                <div key={c.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium flex items-center gap-2">
                      {c.name}
                      {!c.active && <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">hidden</span>}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      <span className="font-semibold text-foreground">{c.visible}</span> / {c.count}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all"
                      style={{ width: `${pct}%` }}
                    >
                      <div className="h-full rounded-full bg-white/30" style={{ width: `${100 - visPct}%`, marginLeft: `${visPct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visibility donut + quick actions */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" /> Public visibility
            </h2>
            <div className="mt-4 flex items-center gap-5">
              <Donut visible={visible} hidden={hidden} />
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Visible <span className="ml-auto font-semibold tabular-nums">{visible}</span></div>
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-slate-400" /> Hidden <span className="ml-auto font-semibold tabular-nums">{hidden}</span></div>
                <div className="flex items-center gap-2 pt-1 border-t border-border"><TrendingUp className="h-3.5 w-3.5 text-primary" /> <span className="text-xs text-muted-foreground">{products.length ? Math.round((visible / products.length) * 100) : 0}% live</span></div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold flex items-center gap-2">
              <Boxes className="h-5 w-5 text-primary" /> Quick actions
            </h2>
            <div className="mt-4 grid gap-2">
              <QuickLink to="/admin/products" icon={Package} label="Manage products" />
              <QuickLink to="/admin/categories" icon={FolderTree} label="Manage categories" />
              <QuickLink to="/admin/featured" icon={Star} label="Home featured" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent products */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Recently added</h2>
          <Link to="/admin/products" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((p) => {
            const cat = categories.find((c) => c.id === p.category_id);
            return (
              <Link
                key={p.id}
                to="/admin/products/$id/edit"
                params={{ id: p.id }}
                className="group flex items-center gap-3 rounded-xl border border-border bg-background p-3 hover:border-primary/40 hover:shadow-sm"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {p.image_url ? <img src={p.image_url} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-muted-foreground/40 text-xs">—</div>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{cat?.name || "Uncategorised"}</p>
                </div>
                <span className={`text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5 ${p.is_visible ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                  {p.is_visible ? "Live" : "Hidden"}
                </span>
              </Link>
            );
          })}
          {recent.length === 0 && !loading && (
            <p className="col-span-full text-sm text-muted-foreground">No products yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickLink({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-medium hover:border-primary/40 hover:bg-muted/50 transition"
    >
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span>{label}</span>
      <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
    </Link>
  );
}

function Donut({ visible, hidden }: { visible: number; hidden: number }) {
  const total = visible + hidden || 1;
  const pct = visible / total;
  const R = 34;
  const C = 2 * Math.PI * R;
  const dash = C * pct;
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={R} fill="none" stroke="currentColor" strokeWidth="10" className="text-muted" />
        <circle
          cx="40" cy="40" r={R} fill="none"
          stroke="url(#donutGrad)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${dash} ${C - dash}`}
        />
        <defs>
          <linearGradient id="donutGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-display text-lg font-extrabold">{Math.round(pct * 100)}%</span>
      </div>
    </div>
  );
}
