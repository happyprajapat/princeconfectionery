import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";

/** Subtle per-brand accent used only on hover/focus. */
const ACCENTS = ["16 85% 55%", "355 75% 52%", "150 55% 42%"];

export function BrandPartners() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="brand-partners-heading"
      className="relative overflow-hidden border-y border-border/60 bg-background py-20 sm:py-24 lg:py-28"
    >
      {/* very subtle radial depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 0%, color-mix(in oklab, var(--violet-c) 9%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8">
        <motion.header
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Authorized Distributor
          </p>
          <h2
            id="brand-partners-heading"
            className="mt-4 font-hero text-[clamp(1.6rem,6vw,2.5rem)] font-extrabold leading-[1.15] tracking-tight text-foreground text-balance"
          >
            Trusted Brands. Official Partnerships.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
            Authorized distributor of leading food brands across Chandigarh, Mohali &amp; Panchkula.
          </p>
        </motion.header>

        <ul className="mt-12 grid gap-6 sm:mt-14 md:grid-cols-3 md:gap-6 lg:gap-8">
          {SITE.brands.map((b, i) => (
            <motion.li
              key={b.name}
              initial={reduce ? false : { opacity: 0, y: 44 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : i * 0.12 }}
              className="h-full"
            >
              <Link
                to="/catalogue"
                aria-label={`Explore ${b.name} products`}
                style={{ ["--brand-accent" as string]: `hsl(${ACCENTS[i % ACCENTS.length]})` }}
                className="group flex h-full flex-col rounded-[28px] border border-border/70 bg-card p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-[transform,box-shadow,border-color] duration-300 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-6 lg:p-7 md:hover:-translate-y-1.5 md:hover:border-[color-mix(in_oklab,var(--brand-accent)_45%,transparent)] md:hover:shadow-[0_18px_50px_-24px_var(--brand-accent)]"
              >
                <div className="grid aspect-[16/9] w-full place-items-center overflow-hidden rounded-[20px] bg-white p-4 sm:p-5">
                  <img
                    src={b.logo}
                    alt={`${b.name} logo`}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-300 ease-out md:group-hover:scale-[1.04]"
                  />
                </div>

                <h3 className="mt-6 font-hero text-lg font-bold leading-snug tracking-tight text-foreground">
                  {b.name}
                </h3>
                <p className="mt-2 text-[0.8rem] leading-relaxed text-muted-foreground">{b.tagline}</p>
                <div className="grow" />

                <span className="mt-6 inline-flex self-start items-center gap-1.5 text-[0.8rem] font-semibold text-foreground/70 transition-colors duration-300 ease-out md:opacity-70 md:group-hover:opacity-100 md:group-hover:text-foreground">
                  Explore Brand
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out md:group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
