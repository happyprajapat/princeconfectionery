import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, useInView, useMotionValue, useTransform, animate, useScroll, useSpring } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Phone, MessageCircle, ShieldCheck, Truck, Award, Boxes, Leaf, PackageCheck,
  Star, CheckCircle2, MapPin,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/site";
import { fetchCategories, fetchVisibleProducts, fetchFeaturedProducts, type Product } from "@/lib/catalogue";

const WA = `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
  "Hello Prince Confectionery Departmental, I would like information about your products."
)}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prince Confectionery Departmental — Premium Wholesale Namkeen, Sweets & Snacks" },
      { name: "description", content: "Premium namkeen, biscuits, sweets, bakery products, roasted snacks, dry fruits & grocery for retail and wholesale customers in Tricity." },
      { property: "og:title", content: "Prince Confectionery Departmental" },
      { property: "og:description", content: "200+ premium products across namkeen, sweets, bakery, roasted snacks, dry fruits & grocery — wholesale & retail." },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const { data: products = [] } = useQuery({ queryKey: ["products", "visible"], queryFn: fetchVisibleProducts });
  const { data: featuredPicks = [] } = useQuery({ queryKey: ["products", "featured"], queryFn: fetchFeaturedProducts });
  const featured = (featuredPicks.length > 0 ? featuredPicks : products).slice(0, 6);

  return (
    <SiteShell>
      <ScrollProgress />
      <Hero />
      <MarqueeStrip />
      <Brands />
      <Stats productCount={products.length} categoryCount={categories.length || 8} />
      <Editorial />
      <FeaturedProducts products={featured} />
      <WhyUs />
      <Inquiry />
    </SiteShell>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 });
  return (
    <motion.div
      style={{ scaleX: x, transformOrigin: "0% 50%" }}
      className="fixed inset-x-0 top-0 z-50 h-[2px] bg-brass"
    />
  );
}

/* ---------- HERO — Structural Editorial ---------- */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-dot-grid opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-[1400px] px-6 pt-16 pb-20 lg:px-12 lg:pt-24 lg:pb-28">
        {/* Meta row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-maroon-10 pb-4 text-xs">
          <span className="eyebrow">Est. {new Date().getFullYear() - SITE.yearsExperience} — Chandigarh</span>
          <span className="hidden sm:inline eyebrow text-foreground/70">Volume 01 · The Wholesale Edit</span>
          <span className="eyebrow text-foreground/70">Issue N° {String(new Date().getFullYear())}</span>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Left — huge editorial headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="lg:col-span-8"
          >
            <p className="eyebrow">The House of Prince — since {new Date().getFullYear() - SITE.yearsExperience}</p>
            <h1 className="mt-6 font-display font-medium leading-[0.9] tracking-[-0.04em] text-[clamp(3rem,9vw,8.5rem)] text-foreground">
              Namkeen.
              <br />
              <span className="italic font-light">Mithai.</span>
              <br />
              <span className="text-brass">Bakery.</span>
            </h1>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                to="/catalogue"
                className="group inline-flex items-center gap-3 bg-maroon px-7 py-4 text-sm font-medium tracking-wide text-[color:var(--cream)] transition hover:bg-[color:var(--maroon-2)]"
              >
                Open the catalogue
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href={WA} target="_blank" rel="noreferrer"
                className="group inline-flex items-center gap-2 border-b border-foreground/40 pb-1 text-sm font-medium text-foreground transition hover:border-brass hover:text-brass"
              >
                <MessageCircle className="h-4 w-4" /> Message on WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Right — editorial column */}
          <motion.aside
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-4 lg:pl-8 lg:border-l lg:border-maroon-10 flex flex-col justify-between gap-8"
          >
            <div>
              <span className="eyebrow">The house note</span>
              <p className="mt-4 font-display text-2xl leading-snug tracking-tight text-foreground text-balance">
                A wholesale supply house curating <span className="italic">200+ premium products</span> for shopkeepers, kirana stores and hotels across the Tricity.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <MetaBlock label="Delivered" value="Tricity" />
              <MetaBlock label="Legacy" value={`${SITE.yearsExperience}+ yrs`} />
              <MetaBlock label="Products" value="200+" />
              <MetaBlock label="Range" value="Seasonal" />
            </div>
          </motion.aside>
        </div>

        {/* Bottom rule + running signals */}
        <div className="mt-16 border-t border-maroon-10 pt-4 flex flex-wrap items-center justify-between gap-4 text-[11px] uppercase tracking-[0.24em] text-foreground/60">
          <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-brass" /> Wholesale rates</span>
          <span className="hidden sm:inline-flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-brass" /> Retail welcome</span>
          <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-brass" /> Fresh stock daily</span>
          <span className="hidden md:inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-brass" /> Chandigarh · Mohali · Panchkula</span>
        </div>
      </div>
    </section>
  );
}

function MetaBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="eyebrow text-foreground/60">{label}</div>
      <div className="mt-1 font-display text-xl text-foreground">{value}</div>
    </div>
  );
}

/* ---------- MARQUEE STRIP ---------- */
function MarqueeStrip() {
  const words = ["Namkeen", "Biscuits", "Sweets", "Snacks", "Roasted", "Bakery", "Rusk", "Dry Fruits", "Grocery", "Confectionery"];
  const row = [...words, ...words];
  return (
    <div className="border-y border-maroon-10 bg-[color:var(--cream-2)] py-5 overflow-hidden">
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="font-display text-2xl md:text-3xl font-light italic text-foreground/70 inline-flex items-center gap-12">
            {w}
            <span className="h-1.5 w-1.5 rounded-full bg-brass" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- BRANDS — numbered editorial ---------- */
function Brands() {
  return (
    <section className="relative mx-auto max-w-[1400px] px-6 lg:px-12 py-24">
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow">Section 01 — Distributions</p>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-[1] tracking-[-0.03em] text-foreground">
            Authorised distributor of <span className="italic">three iconic</span> food brands.
          </h2>
          <p className="mt-5 max-w-sm text-sm text-muted-foreground leading-relaxed">
            Proud to represent these houses across Chandigarh, Mohali & Panchkula — bringing their signature products to your shelves.
          </p>
        </div>
        <div className="lg:col-span-8 grid gap-px bg-[color:var(--border)] border border-maroon-10 sm:grid-cols-3">
          {SITE.brands.map((b, i) => (
            <motion.div
              key={b.name}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group relative bg-background p-6 flex flex-col"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-xs tracking-[0.3em] text-brass">0{i + 1}</span>
                <ArrowUpRight className="h-4 w-4 text-foreground/40 transition group-hover:text-brass group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <div className="mt-6 aspect-square w-full grid place-items-center overflow-hidden bg-white rounded-sm">
                <img src={b.logo} alt={b.name} className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105" />
              </div>
              <h3 className="mt-5 font-display text-lg text-foreground leading-tight">{b.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{b.tagline}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- STATS — editorial ledger ---------- */
function Counter({ to, suffix = "", duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toString() + suffix);
  const [text, setText] = useState("0" + suffix);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, { duration, ease: "easeOut" });
    const unsub = rounded.on("change", setText);
    return () => { controls.stop(); unsub(); };
  }, [inView, to, duration, mv, rounded]);
  return <span ref={ref}>{text}</span>;
}

function Stats({ productCount, categoryCount }: { productCount: number; categoryCount: number }) {
  const stats = [
    { value: SITE.yearsExperience, suffix: "+", label: "Years of Trust" },
    { value: Math.max(productCount, 200), suffix: "+", label: "Products" },
    { value: categoryCount, suffix: "+", label: "Categories" },
    { value: 3, suffix: "", label: "Cities Served" },
  ];
  return (
    <section className="bg-maroon text-[color:var(--cream)]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-20">
        <div className="flex items-baseline justify-between border-b border-[color:var(--cream)]/20 pb-4">
          <p className="eyebrow text-brass">Section 02 — The Ledger</p>
          <span className="text-xs tracking-[0.28em] uppercase opacity-60">By the numbers</span>
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-[color:var(--cream)]/15">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }}
              className="px-6 first:pl-0"
            >
              <div className="font-display text-6xl md:text-7xl font-light tracking-[-0.04em] text-brass">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-3 text-xs uppercase tracking-[0.24em] opacity-80">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- EDITORIAL PULL QUOTE ---------- */
function Editorial() {
  return (
    <section className="relative mx-auto max-w-[1200px] px-6 lg:px-12 py-24">
      <motion.blockquote
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.8 }}
        className="relative"
      >
        <span aria-hidden className="absolute -top-4 -left-2 font-display text-[8rem] leading-none text-brass/40 select-none">"</span>
        <p className="relative font-display text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-[-0.02em] text-foreground text-balance">
          Every festival, every counter, every kirana shelf across the Tricity — <span className="italic text-brass">we've been there for {SITE.yearsExperience} years.</span>
        </p>
        <footer className="mt-8 flex items-center gap-4 text-sm">
          <span className="h-px w-12 bg-brass" />
          <span className="uppercase tracking-[0.24em] text-foreground/70">{SITE.owner} — Proprietor</span>
        </footer>
      </motion.blockquote>
    </section>
  );
}

/* ---------- FEATURED — magazine grid ---------- */
function FeaturedProducts({ products }: { products: Product[] }) {
  const [cover, ...rest] = products;
  return (
    <section className="relative bg-[color:var(--cream-2)]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-24">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-maroon-10 pb-6">
          <div>
            <p className="eyebrow">Section 03 — House Picks</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl tracking-[-0.03em]">
              Customer <span className="italic">favourites</span>
            </h2>
          </div>
          <Link to="/catalogue" className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-brass border-b border-foreground/40 hover:border-brass pb-1">
            Browse all products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="mt-10 border border-dashed border-maroon-10 p-12 text-center">
            <p className="text-sm text-muted-foreground">Products will appear here once added from the admin panel.</p>
            <Link to="/auth" className="mt-3 inline-block text-sm font-semibold text-brass hover:underline">
              Sign in to add products →
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            {cover && <CoverCard p={cover} />}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
              {rest.map((p, i) => <SmallCard key={p.id} p={p} i={i} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CoverCard({ p }: { p: Product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7 }}
      className="lg:col-span-5"
    >
      <Link to="/product/$slug" params={{ slug: p.slug }} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden bg-background">
          {p.image_url ? (
            <img src={p.image_url} alt={p.name} className="h-full w-full object-cover transition duration-1000 group-hover:scale-105" />
          ) : (
            <div className="grid h-full w-full place-items-center font-display text-8xl text-brass/40">P</div>
          )}
          <span className="absolute left-4 top-4 eyebrow bg-background/90 px-3 py-1.5">Cover Pick</span>
          {p.is_seasonal && (
            <span className="absolute right-4 top-4 inline-flex items-center gap-1 bg-brass px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-maroon">
              <Star className="h-3 w-3" /> {p.season_label || "Seasonal"}
            </span>
          )}
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl leading-tight text-foreground">{p.name}</h3>
            {p.pack_sizes.length > 0 && (
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{p.pack_sizes.join(" · ")}</p>
            )}
          </div>
          <ArrowUpRight className="h-5 w-5 text-foreground transition group-hover:text-brass group-hover:-translate-y-0.5 group-hover:translate-x-0.5 shrink-0 mt-1" />
        </div>
      </Link>
    </motion.div>
  );
}

function SmallCard({ p, i }: { p: Product; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: i * 0.06 }}
    >
      <Link to="/product/$slug" params={{ slug: p.slug }} className="group block">
        <div className="relative aspect-square overflow-hidden bg-background">
          {p.image_url ? (
            <img src={p.image_url} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          ) : (
            <div className="grid h-full w-full place-items-center font-display text-4xl text-brass/40">P</div>
          )}
          {p.is_seasonal && (
            <span className="absolute left-2 top-2 bg-brass px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-maroon">
              {p.season_label || "Seasonal"}
            </span>
          )}
        </div>
        <h3 className="mt-3 font-display text-sm text-foreground line-clamp-1">{p.name}</h3>
        {p.pack_sizes.length > 0 && (
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground line-clamp-1">{p.pack_sizes.join(" · ")}</p>
        )}
      </Link>
    </motion.div>
  );
}

/* ---------- WHY US — editorial list ---------- */
function WhyUs() {
  const items = [
    { icon: <Award className="h-5 w-5" />, title: "Quality Products", desc: "Hand-picked from trusted brands, regularly checked for freshness." },
    { icon: <Boxes className="h-5 w-5" />, title: "Wholesale Rates", desc: "Sharp pricing for shopkeepers, retailers and bulk buyers." },
    { icon: <PackageCheck className="h-5 w-5" />, title: "Wide Range", desc: "200+ SKUs across an ever-evolving range of categories — all in one place." },
    { icon: <Leaf className="h-5 w-5" />, title: "Fresh Stock Daily", desc: "Rotating inventory and seasonal specials, never stale." },
    { icon: <ShieldCheck className="h-5 w-5" />, title: "Trusted Supplier", desc: `${SITE.yearsExperience}+ years of relationships with retailers across Tricity.` },
    { icon: <Truck className="h-5 w-5" />, title: "Premium Packaging", desc: "Travel-safe packing that keeps your stock shelf-ready." },
  ];
  return (
    <section className="relative mx-auto max-w-[1400px] px-6 lg:px-12 py-24">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow">Section 04 — Why Prince</p>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-[1] tracking-[-0.03em]">
            Built on <span className="italic">trust</span> & <span className="text-brass">taste.</span>
          </h2>
        </div>
        <ul className="lg:col-span-8 grid gap-px bg-[color:var(--border)] border border-maroon-10 sm:grid-cols-2">
          {items.map((it, i) => (
            <motion.li
              key={it.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-background p-7"
            >
              <div className="flex items-center gap-3">
                <span className="font-display text-xs tracking-[0.3em] text-brass">0{i + 1}</span>
                <span className="h-px flex-1 bg-maroon/10" />
                <span className="text-foreground/60">{it.icon}</span>
              </div>
              <h3 className="mt-6 font-display text-xl text-foreground">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- INQUIRY ---------- */
function Inquiry() {
  const [form, setForm] = useState({ name: "", mobile: "", business: "", products: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const msg =
      `*New Wholesale Inquiry*%0A` +
      `*Name:* ${form.name}%0A` +
      `*Mobile:* ${form.mobile}%0A` +
      `*Business:* ${form.business}%0A` +
      `*Products Required:* ${form.products}%0A` +
      `*Message:* ${form.message}`;
    const url = `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${msg}`;
    window.open(url, "_blank");
    setTimeout(() => setSubmitting(false), 800);
  };

  const inputCls =
    "w-full border-0 border-b border-[color:var(--cream)]/25 bg-transparent px-0 py-3 text-sm text-[color:var(--cream)] placeholder:text-[color:var(--cream)]/50 transition focus:border-brass focus:outline-none focus:ring-0";

  return (
    <section className="relative overflow-hidden bg-ink text-[color:var(--cream)]">
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <p className="eyebrow">Section 05 — Correspondence</p>
            <h2 className="mt-4 font-display text-5xl sm:text-6xl leading-[0.95] tracking-[-0.03em]">
              Let's talk <span className="italic text-brass">business.</span>
            </h2>
            <p className="mt-6 text-[color:var(--cream)]/70 leading-relaxed max-w-sm">
              Tell us what you need. We'll get back with rates, availability and packaging — usually within the same day.
            </p>
            <div className="mt-10 space-y-4 text-sm">
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="flex items-center gap-4 border-b border-[color:var(--cream)]/15 pb-4 hover:text-brass transition">
                <Phone className="h-4 w-4 text-brass" /> {SITE.phone}
              </a>
              <a href={WA} target="_blank" rel="noreferrer" className="flex items-center gap-4 border-b border-[color:var(--cream)]/15 pb-4 hover:text-brass transition">
                <MessageCircle className="h-4 w-4 text-brass" /> {SITE.whatsapp}
              </a>
              <div className="flex items-center gap-4 border-b border-[color:var(--cream)]/15 pb-4">
                <MapPin className="h-4 w-4 text-brass" /> Delivered across Chandigarh · Mohali · Panchkula
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={onSubmit} className="lg:col-span-7 lg:pl-12 lg:border-l lg:border-[color:var(--cream)]/15"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <input required maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className={inputCls} />
              <input required maxLength={15} value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="Mobile number" className={inputCls} inputMode="tel" />
              <input maxLength={120} value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} placeholder="Business / shop name" className={`${inputCls} sm:col-span-2`} />
              <input maxLength={200} value={form.products} onChange={(e) => setForm({ ...form, products: e.target.value })} placeholder="Products required (e.g. Kaju Patisa 5kg)" className={`${inputCls} sm:col-span-2`} />
              <textarea maxLength={500} rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Anything else?" className={`${inputCls} sm:col-span-2 resize-none`} />
            </div>
            <button
              type="submit" disabled={submitting}
              className="mt-8 inline-flex items-center justify-center gap-3 bg-brass px-8 py-4 text-sm font-medium tracking-wide text-maroon transition hover:bg-[color:var(--brass-2)] disabled:opacity-60"
            >
              {submitting ? "Opening WhatsApp…" : (<>Send Inquiry <ArrowUpRight className="h-4 w-4" /></>)}
            </button>
            <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-[color:var(--cream)]/50">
              Your inquiry opens in WhatsApp — the fastest way to reach us.
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
