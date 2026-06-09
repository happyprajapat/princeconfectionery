import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles, Truck, ShieldCheck, Phone } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/site";
import { fetchCategories, fetchVisibleProducts } from "@/lib/catalogue";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prince Confectionery Departmental — Wholesale Namkeen, Sweets & Snacks in Tricity" },
      { name: "description", content: "Wholesale supplier of namkeen, biscuits, sweets, snacks, roasted items, confectionery and dry cakes across Chandigarh, Mohali and Panchkula." },
      { property: "og:title", content: "Prince Confectionery Departmental — Tricity Wholesale" },
      { property: "og:description", content: "Browse our full range of namkeen, sweets, biscuits and seasonal specials. Trusted wholesale partner across Tricity." },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const { data: products = [] } = useQuery({ queryKey: ["products", "visible"], queryFn: fetchVisibleProducts });

  const seasonal = products.filter((p) => p.is_seasonal).slice(0, 4);
  const featured = products.slice(0, 6);

  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative overflow-hidden bg-grain">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3 w-3" /> Tricity Wholesale
            </span>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] text-foreground sm:text-6xl lg:text-7xl text-balance">
              Sweet, savoury &<br />
              <span className="text-primary italic">festive favourites</span><br />
              for every shop.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground text-balance">
              {SITE.tagline}. Browse our complete range — categorised, always fresh, with seasonal specials rotating year-round.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/catalogue"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90"
              >
                Browse catalogue <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                <Phone className="h-4 w-4" /> Talk to us
              </a>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-6">
              <Stat value="200+" label="Products" />
              <Stat value="7" label="Categories" />
              <Stat value="All season" label="Availability" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" />
            <img
              src={heroImg}
              alt="Assorted wholesale namkeen, sweets, biscuits and roasted items"
              width={1600}
              height={1024}
              className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
          <Feature icon={<Truck className="h-5 w-5" />} title="Tricity-wide delivery" desc="Reliable supply across Chandigarh, Mohali & Panchkula." />
          <Feature icon={<Sparkles className="h-5 w-5" />} title="Seasonal specials" desc="Diwali, Holi, Rakhi & festive range — refreshed every season." />
          <Feature icon={<ShieldCheck className="h-5 w-5" />} title="Trusted by retailers" desc="Years of relationships with shops across the region." />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Shop by category</p>
            <h2 className="mt-2 font-display text-4xl font-semibold text-foreground">Our full range</h2>
          </div>
          <Link to="/catalogue" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/catalogue"
              search={{ category: c.slug }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-lg"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 transition group-hover:bg-primary/15" />
              <h3 className="relative font-display text-xl font-semibold text-foreground">{c.name}</h3>
              <p className="relative mt-1 text-sm text-muted-foreground">Explore range</p>
              <ArrowRight className="relative mt-6 h-4 w-4 text-primary opacity-0 transition group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>

      {/* SEASONAL */}
      {seasonal.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">In season now</p>
          <h2 className="mt-2 font-display text-4xl font-semibold text-foreground">Festive specials</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {seasonal.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-4xl font-semibold text-foreground">Latest in catalogue</h2>
          <Link to="/catalogue" className="text-sm font-medium text-primary hover:underline">See all</Link>
        </div>
        {featured.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Products will appear here once added from the admin panel.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
            {featured.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </section>
    </SiteShell>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">{icon}</div>
      <div>
        <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function ProductCard({ p }: { p: { id: string; name: string; slug: string; image_url: string | null; is_seasonal: boolean; season_label: string | null; pack_sizes: string[] } }) {
  return (
    <Link
      to="/product/$slug"
      params={{ slug: p.slug }}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/40 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {p.image_url ? (
          <img src={p.image_url} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="grid h-full w-full place-items-center font-display text-3xl text-muted-foreground/40">P</div>
        )}
        {p.is_seasonal && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
            {p.season_label || "Seasonal"}
          </span>
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
