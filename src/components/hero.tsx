import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { SITE } from "@/lib/site";
import { HeroShowcase } from "@/components/hero-showcase";

const HEADLINE = ["Tricity's Trusted", "Wholesale Partner", "for Snacks & Bakery"];

export function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay },
  });

  return (
    <section className="relative isolate overflow-hidden hero-canvas-light">
      <div className="pointer-events-none absolute inset-0 -z-10 hero-halo" aria-hidden />

      <div className="mx-auto flex max-w-6xl flex-col items-center px-5 pb-16 pt-16 text-center sm:px-8 sm:pb-24 sm:pt-24 lg:pb-28 lg:pt-28">
        <motion.h1
          className="font-hero text-[2.15rem] font-extrabold leading-[1.1] tracking-[-0.035em] text-foreground sm:text-6xl lg:text-[4.4rem]"
        >
          {HEADLINE.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className="block"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.12 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          {...rise(0.5)}
          className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground sm:mt-7 sm:max-w-xl sm:text-lg"
        >
          Serving retailers with premium brands and carefully selected local favourites for over{" "}
          {SITE.yearsExperience} years.
        </motion.p>

        <motion.div {...rise(0.62)} className="mt-9 sm:mt-10">
          <Link
            to="/catalogue"
            className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-9 text-sm font-semibold tracking-wide text-primary-foreground shadow-[0_18px_40px_-20px_var(--primary)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_54px_-22px_var(--primary)]"
          >
            Explore Catalogue
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="mt-16 w-full sm:mt-20">
          <HeroShowcase />
        </div>

        <motion.div
          {...rise(1.1)}
          className="mt-12 flex flex-col items-center gap-2 text-muted-foreground/70 sm:mt-14"
          aria-hidden
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.28em]">Scroll</span>
          <motion.span
            animate={reduce ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
