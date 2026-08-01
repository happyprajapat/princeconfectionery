import { motion, useReducedMotion } from "framer-motion";

/**
 * Premium placeholder product composition.
 * Each `pack` is a self-contained slot — swap the inner block for a real
 * <img src="..." /> product photograph later without touching the layout.
 */
type Pack = {
  label: string;
  kind: "pouch" | "box" | "jar";
  /** relative height, 0–1 */
  scale: number;
  depth: number;
  tone: "royal" | "gold" | "cream";
};

const PACKS: Pack[] = [
  { label: "Namkeen", kind: "pouch", scale: 0.72, depth: 0.4, tone: "cream" },
  { label: "Bakery", kind: "box", scale: 0.9, depth: 0.75, tone: "gold" },
  { label: "Sweets", kind: "jar", scale: 1, depth: 1, tone: "royal" },
  { label: "Biscuits", kind: "box", scale: 0.86, depth: 0.7, tone: "cream" },
  { label: "Roasted", kind: "pouch", scale: 0.68, depth: 0.35, tone: "gold" },
];

export function HeroShowcase() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-4xl select-none" aria-hidden>
      {/* soft stage light */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 hero-stage" />

      <div className="flex items-end justify-center gap-[-1rem] px-2 sm:gap-0">
        {PACKS.map((p, i) => (
          <motion.div
            key={p.label}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.5 + i * 0.09 }}
            style={{ zIndex: Math.round(p.depth * 10) }}
            className={i === 0 || i === PACKS.length - 1 ? "hidden sm:block" : ""}
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -8 - p.depth * 5, 0] }}
              transition={{
                duration: 9 + i * 1.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.7,
              }}
              className="-mx-2 sm:-mx-3"
            >
              <PackShape pack={p} />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* grounding reflection */}
      <div className="pointer-events-none mx-auto mt-1 h-10 w-[78%] rounded-[100%] bg-foreground/[0.07] blur-2xl" />
    </div>
  );
}

function PackShape({ pack }: { pack: Pack }) {
  const height = 130 + pack.scale * 130;
  const width = pack.kind === "jar" ? 118 : pack.kind === "box" ? 132 : 104;

  const surface =
    pack.tone === "royal"
      ? "linear-gradient(150deg, color-mix(in oklab, var(--royal) 92%, white), color-mix(in oklab, var(--indigo-c) 78%, white))"
      : pack.tone === "gold"
        ? "linear-gradient(150deg, color-mix(in oklab, var(--gold-c) 70%, white), color-mix(in oklab, var(--amber-c) 55%, white))"
        : "linear-gradient(150deg, color-mix(in oklab, var(--background) 92%, var(--foreground) 4%), color-mix(in oklab, var(--background) 78%, var(--royal) 8%))";

  const radius =
    pack.kind === "pouch" ? "1.6rem 1.6rem 0.6rem 0.6rem" : pack.kind === "jar" ? "1.1rem" : "0.7rem";

  return (
    <div
      className="group relative transition-transform duration-500 ease-out hover:-translate-y-2"
      style={{
        height: `clamp(${height * 0.56}px, ${height / 8}vw, ${height}px)`,
        width: `clamp(${width * 0.56}px, ${width / 8}vw, ${width}px)`,
      }}
    >
      <div
        className="absolute inset-0 overflow-hidden border border-foreground/[0.07]"
        style={{
          borderRadius: radius,
          background: surface,
          boxShadow:
            "0 28px 50px -28px color-mix(in oklab, var(--royal) 45%, transparent), 0 10px 22px -16px rgba(0,0,0,0.28)",
        }}
      >
        {/* specular highlight */}
        <div className="absolute inset-y-0 left-[12%] w-[22%] bg-gradient-to-b from-white/45 via-white/12 to-transparent" />
        {/* label band */}
        <div className="absolute inset-x-0 top-[38%] h-px bg-foreground/10" />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div
            className={`font-hero text-[10px] font-extrabold uppercase tracking-[0.18em] ${
              pack.tone === "royal" ? "text-white/85" : "text-foreground/60"
            }`}
          >
            {pack.label}
          </div>
        </div>
      </div>
    </div>
  );
}
