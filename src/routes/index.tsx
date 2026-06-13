import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, useInView, useMotionValue, useTransform, animate, useScroll, useSpring } from "framer-motion";
import {
  ArrowRight, Sparkles, Phone, MessageCircle, ShieldCheck, Truck, Award, Boxes, Leaf, PackageCheck,
  Cookie, Cake, Candy, Wheat, Croissant, Nut, ShoppingBasket, Flame, Star, CheckCircle2, Handshake,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/site";
import { fetchCategories, fetchVisibleProducts, fetchFeaturedProducts, type Product, type Category } from "@/lib/catalogue";

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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, delay: i * 0.06 },
  }),
};

function Home() {
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const { data: products = [] } = useQuery({ queryKey: ["products", "visible"], queryFn: fetchVisibleProducts });
  const featured = products.slice(0, 6);

  return (
    <SiteShell>
      <ScrollProgress />
      <Hero />
      <Brands />
      <Stats productCount={products.length} categoryCount={categories.length || 8} />
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
      className="fixed inset-x-0 top-0 z-50 h-[3px] gradient-brand"
    />
  );
}

function Brands() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 gradient-brand-soft" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80 shadow-sm">
            <Handshake className="h-3.5 w-3.5 text-violet-c" /> Authorized distributor
          </span>
          <h2 className="mt-5 font-display text-4xl font-extrabold sm:text-5xl">
            Premier distributors of <span className="text-gradient-brand">trusted brands</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Proud authorized distributor of three iconic food brands across Tricity —
            Chandigarh, Mohali & Panchkula.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {SITE.brands.map((b, i) => (
            <motion.div
              key={b.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 text-center hover-lift hover:shadow-glow"
            >
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full gradient-brand opacity-0 blur-3xl transition group-hover:opacity-20" />
              <div className="relative mx-auto grid h-52 place-items-center overflow-hidden rounded-2xl bg-white">
                <img
                  src={b.logo}
                  alt={b.name}
                  className="h-full w-full object-contain p-2 transition group-hover:scale-105"
                />
              </div>
              <h3 className="relative mt-6 font-display text-xl font-bold text-foreground">{b.name}</h3>
              <p className="relative mt-1 text-sm text-muted-foreground">{b.tagline}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* animated gradient mesh background */}
      <div className="absolute inset-0 bg-mesh animate-gradient" aria-hidden />
      <div className="absolute inset-0 bg-dot-grid opacity-40" aria-hidden />

      {/* floating decorative shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full gradient-brand opacity-20 blur-3xl animate-float-slow" />
        <div className="absolute top-40 -right-24 h-80 w-80 rounded-full gradient-warm opacity-25 blur-3xl animate-float" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-violet-c/20 blur-3xl animate-float-slow" />
        <FloatingIcon className="left-[8%] top-[22%]" delay={0}><Cookie className="h-6 w-6" /></FloatingIcon>
        <FloatingIcon className="right-[10%] top-[18%]" delay={1.2}><Candy className="h-6 w-6" /></FloatingIcon>
        <FloatingIcon className="left-[14%] bottom-[18%]" delay={2}><Cake className="h-6 w-6" /></FloatingIcon>
        <FloatingIcon className="right-[16%] bottom-[24%]" delay={0.6}><Nut className="h-6 w-6" /></FloatingIcon>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-28 sm:px-6 lg:px-8 lg:pt-28 lg:pb-36 text-center">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-violet-c" />
            Tricity's Premium Confectionery House
          </span>
        </motion.div>

        <motion.h1
          initial="hidden" animate="show" custom={1} variants={fadeUp}
          className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl text-balance"
        >
          <span className="text-gradient-brand">Prince Confectionery</span>
          <br />
          <span className="text-foreground">Departmental</span>
        </motion.h1>

        <motion.p
          initial="hidden" animate="show" custom={2} variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl text-balance"
        >
          Premium <span className="text-gradient-warm font-semibold">Namkeen, Bakery, Sweets & Snacks</span> for
          retail and wholesale customers — curated from 200+ trusted products.
        </motion.p>

        <motion.div
          initial="hidden" animate="show" custom={3} variants={fadeUp}
          className="mt-9 flex flex-wrap justify-center gap-3"
        >
          <Link
            to="/catalogue"
            className="group inline-flex items-center gap-2 rounded-full gradient-brand px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:scale-105"
          >
            Browse Products
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
          <a
            href={WA}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 text-sm font-semibold text-foreground transition hover:scale-105"
          >
            <MessageCircle className="h-4 w-4 text-emerald" /> Contact on WhatsApp
          </a>
        </motion.div>

        <motion.div
          initial="hidden" animate="show" custom={4} variants={fadeUp}
          className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-medium text-muted-foreground"
        >
          {["Wholesale rates", "Retail welcome", "Fresh stock daily", "Tricity delivery"].map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald" /> {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FloatingIcon({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <div
      className={`absolute hidden md:grid h-12 w-12 place-items-center rounded-2xl glass text-violet-c shadow-glow animate-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

/* ---------- STATS ---------- */
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
    { value: Math.max(productCount, 200), suffix: "+", label: "Products" },
    { value: categoryCount, suffix: "+", label: "Categories" },
    { value: 100, suffix: "%", label: "Quality Assured" },
    { value: SITE.yearsExperience, suffix: "+", label: "Years of Trust" },
  ];
  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-3 rounded-3xl border border-border bg-card/60 p-6 shadow-glow backdrop-blur-xl sm:grid-cols-4 sm:p-8"
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`text-center ${i !== 0 ? "sm:border-l sm:border-border/60" : ""}`}
            >
              <p className="font-display text-3xl font-extrabold sm:text-4xl text-gradient-brand">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- CATEGORIES ---------- */
const CATEGORY_VISUAL: Record<string, { icon: React.ReactNode; gradient: string }> = {
  "namkeen":          { icon: <Flame className="h-6 w-6" />,            gradient: "from-orange-500 via-red-500 to-rose-500" },
  "biscuits":         { icon: <Cookie className="h-6 w-6" />,           gradient: "from-amber-500 via-orange-500 to-red-500" },
  "sweets":           { icon: <Candy className="h-6 w-6" />,            gradient: "from-pink-500 via-fuchsia-500 to-violet-500" },
  "snacks":           { icon: <Flame className="h-6 w-6" />,            gradient: "from-yellow-500 via-amber-500 to-orange-500" },
  "roasted-items":    { icon: <Nut className="h-6 w-6" />,              gradient: "from-amber-600 via-orange-600 to-rose-600" },
  "roasted-snacks":   { icon: <Nut className="h-6 w-6" />,              gradient: "from-amber-600 via-orange-600 to-rose-600" },
  "confectionery":    { icon: <Candy className="h-6 w-6" />,            gradient: "from-violet-500 via-purple-500 to-fuchsia-500" },
  "dry-cakes":        { icon: <Cake className="h-6 w-6" />,             gradient: "from-rose-500 via-pink-500 to-fuchsia-500" },
  "bakery-products":  { icon: <Croissant className="h-6 w-6" />,        gradient: "from-amber-400 via-orange-500 to-rose-500" },
  "rusk":             { icon: <Wheat className="h-6 w-6" />,            gradient: "from-yellow-600 via-amber-600 to-orange-600" },
  "dry-fruits":       { icon: <Nut className="h-6 w-6" />,              gradient: "from-emerald-500 via-teal-500 to-cyan-500" },
  "grocery":          { icon: <ShoppingBasket className="h-6 w-6" />,   gradient: "from-blue-500 via-indigo-500 to-violet-500" },
};

function Categories({ categories }: { categories: Category[] }) {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-c">Shop by category</p>
        <h2 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
          Explore our <span className="text-gradient-brand">complete range</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          A constantly evolving range — refreshed every season with new arrivals
          and festive specials. Hand-picked for freshness and value.
        </p>
      </motion.div>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c, i) => {
          const v = CATEGORY_VISUAL[c.slug] ?? { icon: <Boxes className="h-6 w-6" />, gradient: "from-indigo-500 via-violet-500 to-fuchsia-500" };
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link
                to="/catalogue"
                search={{ category: c.slug }}
                className="group relative block overflow-hidden rounded-3xl border border-border bg-card p-6 hover-lift hover:shadow-glow"
              >
                <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${v.gradient} opacity-20 blur-2xl transition group-hover:opacity-50 group-hover:scale-125`} />
                <div className={`relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${v.gradient} text-white shadow-glow transition group-hover:scale-110 group-hover:rotate-6`}>
                  {v.icon}
                </div>
                <h3 className="relative mt-5 font-display text-lg font-bold text-foreground">{c.name}</h3>
                <p className="relative mt-1 text-xs text-muted-foreground">Explore range</p>
                <ArrowRight className="relative mt-4 h-4 w-4 text-violet-c opacity-0 transition group-hover:opacity-100 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- FEATURED ---------- */
function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-brand-soft" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-c">Featured</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
              Customer <span className="text-gradient-warm">favourites</span>
            </h2>
          </div>
          <Link to="/catalogue" className="inline-flex items-center gap-1 text-sm font-semibold text-violet-c hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-card p-12 text-center">
            <p className="text-sm text-muted-foreground">Products will appear here once added from the admin panel.</p>
            <Link to="/auth" className="mt-3 inline-block text-sm font-semibold text-violet-c hover:underline">
              Sign in to add products →
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
            {products.map((p, i) => <FeaturedCard key={p.id} p={p} i={i} />)}
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedCard({ p, i }: { p: Product; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: i * 0.06 }}
    >
      <Link
        to="/product/$slug" params={{ slug: p.slug }}
        className="group block overflow-hidden rounded-3xl border border-border bg-card hover-lift hover:shadow-glow"
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          {p.image_url ? (
            <img src={p.image_url} alt={p.name} loading="lazy"
                 className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
          ) : (
            <div className="grid h-full w-full place-items-center font-display text-4xl text-muted-foreground/30 gradient-brand-soft">P</div>
          )}
          {p.is_seasonal && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full gradient-warm px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-glow-warm">
              <Star className="h-3 w-3" /> {p.season_label || "Seasonal"}
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent p-4 transition group-hover:translate-y-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-foreground">
              View details <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-display text-base font-bold text-foreground line-clamp-1">{p.name}</h3>
          {p.pack_sizes.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{p.pack_sizes.join(" • ")}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

/* ---------- WHY US ---------- */
function WhyUs() {
  const items = [
    { icon: <Award className="h-6 w-6" />, title: "Quality Products", desc: "Hand-picked from trusted brands, regularly checked for freshness." },
    { icon: <Boxes className="h-6 w-6" />, title: "Wholesale Rates", desc: "Sharp pricing for shopkeepers, retailers and bulk buyers." },
    { icon: <PackageCheck className="h-6 w-6" />, title: "Wide Product Range", desc: "200+ SKUs across an ever-evolving range of categories — all in one place." },
    { icon: <Leaf className="h-6 w-6" />, title: "Fresh Stock Daily", desc: "Rotating inventory and seasonal specials, never stale." },
    { icon: <ShieldCheck className="h-6 w-6" />, title: "Trusted Supplier", desc: `${SITE.yearsExperience}+ years of relationships with retailers across the Tricity.` },
    { icon: <Truck className="h-6 w-6" />, title: "Premium Packaging", desc: "Travel-safe packing that keeps your stock shelf-ready." },
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-c">Why choose us</p>
        <h2 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
          Built on <span className="text-gradient-brand">trust & taste</span>
        </h2>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 hover-lift hover:shadow-glow"
          >
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full gradient-brand opacity-0 blur-2xl transition group-hover:opacity-20" />
            <div className="relative grid h-12 w-12 place-items-center rounded-2xl gradient-brand text-white shadow-glow transition group-hover:scale-110">
              {it.icon}
            </div>
            <h3 className="relative mt-5 font-display text-lg font-bold text-foreground">{it.title}</h3>
            <p className="relative mt-2 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
          </motion.div>
        ))}
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
    "w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-violet-c focus:outline-none focus:ring-4 focus:ring-violet-c/15";

  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-navy" aria-hidden />
      <div className="absolute inset-0 bg-mesh opacity-40 animate-gradient" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="grid gap-10 lg:grid-cols-[1fr_1.2fr] items-stretch"
        >
          <div className="text-white">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber">Wholesale inquiry</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
              Let's talk <span className="text-gradient-warm">business.</span>
            </h2>
            <p className="mt-4 text-white/70 leading-relaxed">
              Tell us what you need. We'll get back with rates, availability and packaging options — usually within the same day.
            </p>
            <div className="mt-8 space-y-3">
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 rounded-2xl glass-dark px-4 py-3 text-sm text-white transition hover:bg-white/10">
                <span className="grid h-9 w-9 place-items-center rounded-xl gradient-warm"><Phone className="h-4 w-4" /></span>
                {SITE.phone}
              </a>
              <a href={WA} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl glass-dark px-4 py-3 text-sm text-white transition hover:bg-white/10">
                <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: "linear-gradient(135deg,#25D366,#128C7E)" }}><MessageCircle className="h-4 w-4" /></span>
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <form onSubmit={onSubmit} className="rounded-3xl glass p-6 shadow-glow sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <input required maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className={inputCls} />
              <input required maxLength={15} value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="Mobile number" className={inputCls} inputMode="tel" />
              <input maxLength={120} value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} placeholder="Business / shop name" className={`${inputCls} sm:col-span-2`} />
              <input maxLength={200} value={form.products} onChange={(e) => setForm({ ...form, products: e.target.value })} placeholder="Products required (e.g. Kaju Patisa 5kg)" className={`${inputCls} sm:col-span-2`} />
              <textarea maxLength={500} rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Anything else?" className={`${inputCls} sm:col-span-2 resize-none`} />
            </div>
            <button
              type="submit" disabled={submitting}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full gradient-brand px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02] disabled:opacity-60"
            >
              {submitting ? "Opening WhatsApp…" : (<>Send Inquiry <ArrowRight className="h-4 w-4" /></>)}
            </button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Your inquiry opens in WhatsApp — fastest way to reach us.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

