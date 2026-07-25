import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { SiteShell } from "@/components/site-shell";
import { fetchCategories, fetchVisibleProducts, type Product } from "@/lib/catalogue";

const searchSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
});


export const Route = createFileRoute("/catalogue")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Catalogue — Prince Confectionery Departmental" },
      { name: "description", content: "Browse 200+ wholesale namkeen, biscuits, sweets, snacks and confectionery products by category." },
      { property: "og:title", content: "Full Product Catalogue — Prince Confectionery" },
      { property: "og:description", content: "Explore our complete wholesale range categorised by namkeen, biscuits, sweets and more." },
    ],
  }),
  component: CataloguePage,
});

function CataloguePage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/catalogue" });
  const [query, setQuery] = useState(search.q ?? "");

  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const { data: products = [], isLoading } = useQuery({ queryKey: ["products", "visible"], queryFn: fetchVisibleProducts });

  const filtered = useMemo(() => {
    let res = products;
    if (search.category) {
      const cat = categories.find((c) => c.slug === search.category);
      if (cat) res = res.filter((p) => p.category_id === cat.id);
    }
    if (search.q) {
      const q = search.q.toLowerCase();
      res = res.filter((p) => p.name.toLowerCase().includes(q));
    }
    return res;
  }, [products, categories, search]);


  const currentCategory = categories.find((c) => c.slug === search.category);

  return (
    <SiteShell>
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Catalogue</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-foreground sm:text-5xl">
            {currentCategory ? currentCategory.name : "Our complete range"}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "product" : "products"} available.
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ search: (p: { category?: string; q?: string }) => ({ ...p, q: query || undefined }) });
              }}
              className="relative flex-1 max-w-md"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full border border-border bg-background px-10 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(""); navigate({ search: (p: { category?: string; q?: string }) => ({ ...p, q: undefined }) }); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>

        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Categories</h2>
          <nav className="mt-3 flex flex-wrap gap-2 lg:flex-col">
            <Link
              to="/catalogue"
              search={(p: { category?: string; q?: string }) => ({ ...p, category: undefined })}
              className={`rounded-md px-3 py-2 text-sm transition ${!search.category ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
            >
              All products
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                to="/catalogue"
                search={(p: { category?: string; q?: string }) => ({ ...p, category: c.slug })}
                className={`rounded-md px-3 py-2 text-sm transition ${search.category === c.slug ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
              >
                {c.name}
              </Link>
            ))}

          </nav>
        </aside>

        {/* Grid */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-16 text-center">
              <p className="font-display text-lg text-foreground">No products found</p>
              <p className="mt-2 text-sm text-muted-foreground">Try clearing filters or browsing another category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {filtered.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}

function ProductCard({ p }: { p: Product }) {
  return (
    <Link
      to="/product/$slug"
      params={{ slug: p.slug }}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/40 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {p.image_url ? (
          <img src={p.image_url} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid h-full w-full place-items-center font-display text-3xl text-muted-foreground/40">P</div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display text-base font-semibold text-foreground line-clamp-1">{p.name}</h3>
        {p.pack_sizes.length > 0 && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{p.pack_sizes.join(" • ")}</p>
        )}
      </div>
    </Link>
  );
}
