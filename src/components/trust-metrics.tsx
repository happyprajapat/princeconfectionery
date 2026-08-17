import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, animate } from "framer-motion";

type Stat = {
  index: string;
  value: number;
  suffix: string;
  label: string;
  count: boolean;
};

const STATS: Stat[] = [
  { index: "01", value: 200, suffix: "+", label: "Products", count: true },
  { index: "02", value: 11, suffix: "+", label: "Categories", count: true },
  { index: "03", value: 3, suffix: "", label: "Brand Partnerships", count: false },
  { index: "04", value: 26, suffix: "+", label: "Years of Trust", count: true },
];

function StatValue({
  stat,
  start,
  delay,
  reduced,
  onDone,
}: {
  stat: Stat;
  start: boolean;
  delay: number;
  reduced: boolean;
  onDone: () => void;
}) {
  const [text, setText] = useState(reduced || !stat.count ? String(stat.value) : "0");

  useEffect(() => {
    if (!start) return;
    if (reduced || !stat.count) {
      setText(String(stat.value));
      onDone();
      return;
    }
    const controls = animate(0, stat.value, {
      duration: 1.2,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setText(String(Math.round(v))),
      onComplete: onDone,
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  return (
    <>
      {text}
      <span>{stat.suffix}</span>
    </>
  );
}

export function TrustMetrics() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduced = !!useReducedMotion();
  const [glow, setGlow] = useState<Record<number, boolean>>({});

  return (
    <section
      ref={ref}
      aria-label="Business scale and trust metrics"
      className="relative isolate overflow-hidden bg-[oklch(0.17_0.045_268)] py-20 sm:py-24 lg:py-28"
    >
      {/* atmospheric depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 0%, oklch(0.35 0.13 285 / 0.35), transparent 70%), radial-gradient(50% 60% at 15% 100%, oklch(0.32 0.12 265 / 0.28), transparent 72%), radial-gradient(50% 60% at 85% 100%, oklch(0.32 0.12 300 / 0.22), transparent 72%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.75 0.12 285 / 0.4), transparent)" }}
      />

      {/* one-time light sweep */}
      {!reduced && (
        <motion.div
          aria-hidden
          initial={{ x: "-120%", opacity: 0 }}
          animate={inView ? { x: "120%", opacity: [0, 0.5, 0] } : {}}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-y-0 w-1/2 blur-2xl"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.7 0.14 288 / 0.18), transparent)",
          }}
        />
      )}

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center font-sans text-[11px] font-semibold uppercase tracking-[0.34em] text-white/45"
        >
          Our Scale
        </motion.p>

        <div className="mt-10 grid grid-cols-2 gap-y-12 sm:mt-14 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: reduced ? 0 : 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col items-center px-2 text-center sm:px-4"
            >
              <span
                aria-hidden
                className={`pointer-events-none absolute inset-y-0 left-0 w-px ${
                  i % 2 === 0 ? "hidden" : ""
                } ${i === 0 ? "lg:hidden" : "lg:block"}`}
                style={{
                  background:
                    "linear-gradient(180deg, transparent, oklch(0.85 0.05 285 / 0.18), transparent)",
                }}
              />
              {/* hover radial light */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(circle, oklch(0.6 0.16 288 / 0.35), transparent 70%)" }}
              />

              <span className="relative font-sans text-[10px] font-semibold tracking-[0.3em] text-white/25">
                {s.index}
              </span>

              <span
                className="relative mt-3 font-hero text-5xl font-extrabold leading-none tracking-tight transition-transform duration-500 sm:text-6xl lg:text-7xl group-hover:scale-[1.04]"
                style={{
                  backgroundImage: "linear-gradient(160deg, #A78BFA 0%, #8B5CF6 45%, #4F46E5 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  filter: glow[i]
                    ? "drop-shadow(0 0 26px rgba(139,92,246,0.45))"
                    : "drop-shadow(0 0 12px rgba(139,92,246,0.18))",
                  transitionProperty: "transform, filter",
                }}
              >
                <StatValue
                  stat={s}
                  start={inView}
                  reduced={reduced}
                  delay={0.2 + i * 0.12}
                  onDone={() => setGlow((g) => ({ ...g, [i]: true }))}
                />
              </span>

              <motion.span
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: reduced ? 0 : 0.9 + i * 0.12 }}
                className="relative mt-4 max-w-[10rem] font-sans text-[10px] font-semibold uppercase leading-relaxed tracking-[0.2em] text-white/55 transition-colors duration-300 group-hover:text-white/85 sm:text-[11px]"
              >
                {s.label}
              </motion.span>
            </motion.div>
          ))}
        </div>

        {/* subtle travelling underline */}
        <div className="relative mx-auto mt-14 h-px w-full max-w-4xl overflow-hidden bg-white/5">
          {!reduced && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={inView ? { x: "100%" } : {}}
              transition={{ duration: 2.2, ease: "easeInOut", delay: 0.4 }}
              className="h-full w-1/3"
              style={{
                background: "linear-gradient(90deg, transparent, oklch(0.75 0.14 288 / 0.8), transparent)",
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
