import { Link } from "@tanstack/react-router";
import { Menu, X, Phone, Moon, Sun, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";
import { useTheme } from "@/hooks/use-theme";

const nav = [
  { to: "/", label: "Home" },
  { to: "/catalogue", label: "Catalogue" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl"
          : "bg-background/40 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-2 px-4 sm:px-6 lg:px-8 md:flex md:justify-between">
        {/* Mobile menu button — left */}
        <div className="flex md:hidden items-center">
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-muted"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Logo — centered on mobile, left on desktop */}
        <Link to="/" className="group flex items-center justify-center md:justify-start gap-3">
          <img
            src={SITE.crown}
            alt=""
            className="h-10 w-auto object-contain transition group-hover:scale-105 dark:invert"
          />
          <div className="hidden sm:block leading-tight text-left">
            <div className="font-display text-base font-extrabold tracking-tight text-foreground">
              Prince Confectionery
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-c">
              {SITE.tagline}
            </div>
          </div>
          <span className="sr-only">Prince Confectionery Departmental</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "text-primary bg-muted/60" }}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-full px-4 py-2 text-sm font-medium text-foreground/75 transition hover:text-primary hover:bg-muted/50"
            >
              {n.label}
            </Link>
          ))}

          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="ml-1 grid h-10 w-10 place-items-center rounded-full border border-border/60 text-foreground/80 transition hover:text-primary hover:border-primary/40"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <a
            href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
            target="_blank" rel="noreferrer"
            className="ml-1 inline-flex items-center gap-2 rounded-full border border-emerald/40 px-4 py-2 text-sm font-semibold text-emerald transition hover:bg-emerald/10"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <a
            href={`tel:${SITE.phone.replace(/\s/g, "")}`}
            className="ml-1 inline-flex items-center gap-2 rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:scale-105"
          >
            <Phone className="h-4 w-4" /> Call to Order
          </a>
        </nav>

        {/* Theme toggle — right on mobile */}
        <div className="flex md:hidden items-center justify-end">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-muted"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                activeProps={{ className: "text-primary bg-muted" }}
                activeOptions={{ exact: n.to === "/" }}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80"
              >
                {n.label}
              </Link>
            ))}
            <a
              href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
              target="_blank" rel="noreferrer"
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-full border border-emerald/40 px-4 py-2.5 text-sm font-semibold text-emerald"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 rounded-full gradient-brand px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Phone className="h-4 w-4" /> Call to Order
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
