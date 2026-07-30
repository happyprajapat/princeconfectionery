import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ShieldCheck, Boxes, Handshake, Sparkles, PackageCheck, Store } from "lucide-react";
import { useCallback, type ReactNode } from "react";
import { SITE } from "@/lib/site";

const STATS = [
  { value: `${SITE.yearsExperience}+`, label: "Years serving retailers", icon: ShieldCheck },
  { value: "200+", label: "Products in catalogue", icon: Boxes },
  { value: "3", label: "Trusted brand partners", icon: Handshake },
];

const SHOWCASE = [
  {
    title: "Brand Portfolio",
    subtitle: "Ginni · Shree Bajrang · Mom's Basket",
    icon: Handshake,
    className: "lg:col-span-3 lg:row-span-2",
    tall: true,
  },
  { title: "Local Favourites", subtitle: "Hand-picked regional specialities", icon: Store, className: "lg:col-span-2" },
  { title: "Bulk Supply", subtitle: "Consistent stock, Tricity-wide", icon: PackageCheck, className: "lg:col-span-2" },
];

export function Hero() {
  const reduce = useReducedMotion();

  /* mouse parallax */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.4 });
  const tiltX = useTransform(sy, [-0.5, 0.5], [8, -8]);
  const tiltY = useTransform(sx, [-0.5, 0.5], [-10, 10]);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduce) return;
      const r = e.currentTarget.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    },
    [mx, my, reduce],
  );

  const reset = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const rise = (i: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay: 0.08 * i },
  });

  return (
    <section
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="relative isolate overflow-hidden bg-hero-canvas"
    >
      {/* layered gradients + soft glows */}
      <div className="absolute inset-0 -z-10 hero-aurora animate-aurora" aria-hidden />
      <div className="absolute inset-0 -z-10 hero-grid opacity-[0.5]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-royal/25 blur-[120px]" />
        <div className="absolute -right-32 top-10 h-[26rem] w-[26rem] rounded-full bg-gold/20 blur-[130px]" />
        <div className="absolute -bottom-40 left-1/3 h-[24rem] w-[24rem] rounded-full bg-primary/15 blur-[120px]" />
        {/* abstract geometry */}
        <div className="absolute right-[6%] top-[12%] hidden h-40 w-40 rotate-12 rounded-[2.5rem] border border-foreground/10 lg:block" />
        <div className="absolute left-[4%] bottom-[14%] hidden h-28 w-28 -rotate-6 rounded-full border border-foreground/10 lg:block" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8 lg:pb-32 lg:pt-24">
        {/* LEFT */}
        <div>
          <motion.span
            {...rise(0)}
            className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-card/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/70 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Wholesale distribution since {SITE.established}
          </motion.span>

          <h1 className="mt-7 font-display text-[2.6rem] font-extrabold leading-[1.06] tracking-[-0.03em] text-foreground sm:text-6xl lg:text-[4.15rem]">
            {["Supplying Tricity's", "retailers with", "trusted quality."].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className={`block ${i === 2 ? "text-primary" : ""}`}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: "100%" }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.12 + i * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            {...rise(5)}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            For over {SITE.yearsExperience} years, Prince Confectionery Departmental has kept shop shelves
            stocked across Chandigarh, Mohali and Panchkula — an enormous range of namkeen, biscuits,
            sweets, bakery and grocery, spanning three trusted brand partnerships alongside carefully
            selected local favourites.
          </motion.p>

          <motion.div {...rise(6)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/catalogue"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-12px_var(--primary),0_2px_8px_-3px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-14px_var(--primary)]"
            >
              Explore Catalogue
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-foreground/12 bg-card/60 px-7 py-4 text-sm font-semibold text-foreground backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card"
            >
              Contact Us
            </Link>
          </motion.div>

          <div className="mt-12 grid grid-cols-3 gap-3 sm:gap-5">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.75 + i * 0.1 }}
                className="rounded-2xl border border-foreground/10 bg-card/60 p-4 backdrop-blur-md transition-colors duration-300 hover:border-primary/30 sm:p-5"
              >
                <s.icon className="h-4 w-4 text-gold" />
                <div className="mt-3 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-[11px] font-medium leading-snug text-muted-foreground sm:text-xs">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT — floating showcase */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          style={reduce ? undefined : { rotateX: tiltX, rotateY: tiltY, transformPerspective: 1200 }}
          className="relative grid grid-cols-2 gap-4 lg:grid-cols-5 lg:grid-rows-2"
        >
          {SHOWCASE.map((c, i) => (
            <ShowcaseCard key={c.title} index={i} reduce={!!reduce} className={c.className} tall={c.tall}>
              <c.icon className="h-5 w-5 text-gold" />
              <div className="mt-auto">
                <div className="font-display text-lg font-bold tracking-tight text-foreground">{c.title}</div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.subtitle}</p>
              </div>
            </ShowcaseCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ShowcaseCard({
  children,
  index,
  className = "",
  tall = false,
  reduce,
}: {
  children: ReactNode;
  index: number;
  className?: string;
  tall?: boolean;
  reduce: boolean;
}) {
  return (
    <motion.div
      animate={reduce ? undefined : { y: [0, -10, 0] }}
      transition={{ duration: 9 + index * 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.8 }}
      className={`group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-card/55 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 ${
        tall ? "min-h-[17rem] lg:min-h-full" : "min-h-[10.5rem]"
      } ${className}`}
      style={{
        boxShadow:
          "0 1px 0 0 color-mix(in oklab, var(--foreground) 6%, transparent) inset, 0 24px 60px -30px color-mix(in oklab, var(--royal) 60%, transparent), 0 6px 18px -12px rgba(0,0,0,0.25)",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-40 bg-gradient-to-b from-foreground/[0.06] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {/* placeholder plate for future product photography */}
      <div className="pointer-events-none absolute inset-4 -z-10 rounded-[1.25rem] border border-dashed border-foreground/[0.08]" />
      {children}
    </motion.div>
  );
}
