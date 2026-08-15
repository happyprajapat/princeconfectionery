import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";
import { SITE } from "@/lib/site";

/** Per-brand ambient tint + optical size normalisation for each source asset. */
const BRAND_STYLE = [
  { glow: "28 90% 58%", scale: 1, index: "01" }, // Ginni — warm gold
  { glow: "355 78% 55%", scale: 1.08, index: "02" }, // Shree Bajrang — red/gold
  { glow: "148 55% 46%", scale: 0.94, index: "03" }, // Mom's Basket — green/warm
];

function BrandRow({
  brand,
  i,
  reduce,
}: {
  brand: (typeof SITE.brands)[number];
  i: number;
  reduce: boolean | null;
}) {
  const s = BRAND_STYLE[i % BRAND_STYLE.length];
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPointer({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : i * 0.14 }}
    >
      <Link
        to="/catalogue"
        aria-label={`Explore ${brand.name} products`}
        onMouseMove={reduce ? undefined : onMove}
        onMouseLeave={() => setPointer(null)}
        style={{ ["--glow" as string]: `hsl(${s.glow})` }}
        className="group relative block overflow-hidden rounded-none outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--glow)_70%,transparent)] focus-visible:ring-offset-0"
      >
        {/* cursor-following ambient light */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{
            background: pointer
              ? `radial-gradient(220px circle at ${pointer.x}px ${pointer.y}px, color-mix(in oklab, var(--glow) 16%, transparent), transparent 70%)`
              : "radial-gradient(60% 120% at 50% 50%, color-mix(in oklab, var(--glow) 8%, transparent), transparent 70%)",
          }}
        />

        <div className="relative grid grid-cols-1 items-center gap-9 py-10 sm:gap-10 sm:py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:py-14 lg:py-16">
          {/* logo stage — normalised optical area, soft floating light plate (no card) */}
          <div className="relative mx-auto grid h-28 w-full max-w-[19rem] place-items-center rounded-[999px] bg-white/95 px-8 py-4 shadow-[0_28px_70px_-30px_rgba(0,0,0,0.85)] transition-shadow duration-500 sm:h-32 md:mx-0 md:h-36 lg:h-40">

            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-8 -inset-y-6 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in oklab, var(--glow) 30%, transparent), transparent)",
              }}
            />

            <img
              src={brand.logo}
              alt={`${brand.name} logo`}
              loading="lazy"
              style={{ ["--s" as string]: String(s.scale) }}
              className="relative h-full w-full object-contain transition-transform duration-500 ease-out [transform:scale(var(--s))] group-hover:[transform:scale(calc(var(--s)*1.05))] motion-reduce:transition-none motion-reduce:group-hover:[transform:scale(var(--s))]"
            />
          </div>

          {/* editorial text column */}
          <div className="min-w-0 text-center md:text-left">
            <span className="text-[11px] font-semibold tabular-nums tracking-[0.3em] text-white/35">
              {s.index}
            </span>
            <h3 className="mt-3 font-hero text-[clamp(1.35rem,5vw,2rem)] font-extrabold leading-tight tracking-tight text-white/85 transition-colors duration-300 group-hover:text-white text-balance">
              {brand.name}
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/55 md:mx-0">
              {brand.tagline}
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-white/50 transition-all duration-300 group-hover:gap-2.5 group-hover:text-white">
              Explore Brand
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.li>
  );
}

export function BrandPartners() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="brand-partners-heading"
      className="relative isolate overflow-hidden bg-[oklch(0.17_0.045_268)] py-16 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 20% 0%, color-mix(in oklab, var(--violet-c) 22%, transparent), transparent 70%), radial-gradient(60% 50% at 90% 100%, color-mix(in oklab, var(--indigo-c) 18%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8">
        <motion.header
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/45">
            Authorized Distributor
          </p>
          <h2
            id="brand-partners-heading"
            className="mt-5 font-hero text-[clamp(1.9rem,7vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight text-white text-balance"
          >
            Trusted Brands.
            <br />
            Official Partnerships.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/55 sm:text-[0.95rem]">
            Authorized distributor of leading food brands across Chandigarh, Mohali &amp; Panchkula.
          </p>
        </motion.header>

        <ul className="mt-10 divide-y divide-white/10 border-y border-white/10 sm:mt-14">
          {SITE.brands.map((b, i) => (
            <BrandRow key={b.name} brand={b} i={i} reduce={reduce} />
          ))}
        </ul>
      </div>
    </section>
  );
}
