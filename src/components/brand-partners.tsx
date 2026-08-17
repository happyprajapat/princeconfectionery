import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";
import { SITE } from "@/lib/site";

/** Per-brand ambient tint + optical size normalisation for each source asset. */
const BRAND_STYLE = [
  { glow: "30 92% 60%", scale: 1.06 }, // Ginni — warm red/gold
  { glow: "355 80% 58%", scale: 1.16 }, // Shree Bajrang — red/gold
  { glow: "148 58% 48%", scale: 1.0 }, // Mom's Basket — green/warm
];

function BrandColumn({
  brand,
  i,
  reduce,
  active,
  setActive,
}: {
  brand: (typeof SITE.brands)[number];
  i: number;
  reduce: boolean | null;
  active: number | null;
  setActive: (i: number | null) => void;
}) {
  const s = BRAND_STYLE[i % BRAND_STYLE.length];
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const dimmed = active !== null && active !== i;

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPointer({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : i * 0.12 }}
      className="relative"
      style={{ ["--glow" as string]: `hsl(${s.glow})` }}
    >
      <div
        onMouseMove={reduce ? undefined : onMove}
        onMouseEnter={() => setActive(i)}
        onMouseLeave={() => {
          setActive(null);
          setPointer(null);
        }}
        className={`group relative flex flex-col items-center px-2 py-6 text-center transition-opacity duration-500 sm:px-4 sm:py-8 ${
          dimmed ? "opacity-70" : "opacity-100"
        }`}
      >
        {/* cursor light — lighting, not a UI shape */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background: pointer
              ? `radial-gradient(240px circle at ${pointer.x}px ${pointer.y}px, color-mix(in oklab, var(--glow) 12%, transparent), transparent 70%)`
              : "transparent",
          }}
        />

        {/* normalised logo stage — same box for all three, optical scale per asset */}
        <div className="relative grid h-36 w-full place-items-center sm:h-44 lg:h-52">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-1/2 h-[130%] -translate-y-1/2 blur-2xl transition-opacity duration-700"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,255,255,0.30), rgba(255,255,255,0.10) 60%, transparent 80%)",
              opacity: dimmed ? 0.55 : 1,
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-4 top-1/2 h-[120%] -translate-y-1/2 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in oklab, var(--glow) 34%, transparent), transparent 78%)",
            }}
          />
          <img
            src={brand.logo}
            alt={`${brand.name} logo`}
            loading="lazy"
            style={{ ["--s" as string]: String(s.scale) }}
            className="relative h-full w-full max-w-[18rem] object-contain [transform:scale(var(--s))] transition-transform duration-700 ease-out group-hover:[transform:scale(calc(var(--s)*1.05))] motion-reduce:transition-none motion-reduce:group-hover:[transform:scale(var(--s))]"
          />
        </div>

        <h3
          className={`mt-7 flex min-h-[3.4rem] items-start justify-center font-hero text-[clamp(1.05rem,2vw,1.3rem)] font-extrabold uppercase leading-tight tracking-[0.08em] transition-colors duration-500 text-balance ${
            dimmed ? "text-white/60" : "text-white/90"
          } group-hover:text-white`}
        >
          {brand.name}
        </h3>
        <p className="mx-auto mt-3 max-w-[17rem] text-[0.83rem] leading-relaxed text-white/50 text-pretty">
          {brand.tagline}
        </p>
      </div>
    </motion.li>
  );
}

export function BrandPartners() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  return (
    <section
      aria-labelledby="brand-partners-heading"
      className="relative isolate overflow-hidden bg-[oklch(0.17_0.045_268)] py-20 sm:py-24 lg:py-28"
    >
      {/* three barely-visible light zones, one per brand */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 40% at 17% 58%, rgba(255,190,120,0.07), transparent 70%), radial-gradient(45% 40% at 50% 58%, rgba(255,140,140,0.06), transparent 70%), radial-gradient(45% 40% at 83% 58%, rgba(140,235,180,0.06), transparent 70%)",
        }}
      />
      {/* soft top/bottom falloff so the section blends into neighbours */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-28"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.22), transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.22), transparent)" }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8">
        <motion.header
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/45">
            Authorized Distributor
          </p>
          <h2
            id="brand-partners-heading"
            className="mt-5 font-hero text-[clamp(1.75rem,5.5vw,2.9rem)] font-extrabold leading-[1.1] tracking-tight text-white text-balance"
          >
            Trusted Brands.
            <br />
            Official Partnerships.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/55">
            Authorized distributor of leading food brands across Chandigarh, Mohali &amp; Panchkula.
          </p>
        </motion.header>

        <ul className="mx-auto mt-12 grid max-w-sm grid-cols-1 gap-2 sm:mt-16 sm:max-w-none sm:grid-cols-3 sm:gap-4 lg:gap-8">
          {SITE.brands.map((b, i) => (
            <BrandColumn
              key={b.name}
              brand={b}
              i={i}
              reduce={reduce}
              active={active}
              setActive={setActive}
            />
          ))}
        </ul>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          whileInView={reduce ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-12 text-center sm:mt-16"
        >
          <Link
            to="/catalogue"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-white/65 transition-colors duration-300 hover:text-white"
          >
            View Brand Collections
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
