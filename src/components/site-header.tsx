import { Link } from "@tanstack/react-router";
import { Menu, X, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

const nav = [
  { to: "/", label: "Home" },
  { to: "/catalogue", label: "Catalogue" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
          ? "border-b border-border/60 bg-background/75 backdrop-blur-xl shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <img
            src={SITE.logo}
            alt="Prince Confectionery Departmental logo"
            className="h-11 w-auto object-contain"
          />
          <span className="sr-only">Prince Confectionery Departmental</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-md px-4 py-2 text-sm font-medium text-foreground/75 transition hover:text-primary"
            >
              {n.label}
            </Link>
          ))}
          <a
            href={`tel:${SITE.phone.replace(/\s/g, "")}`}
            className="ml-2 inline-flex items-center gap-2 rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:scale-105"
          >
            <Phone className="h-4 w-4" /> Call to Order
          </a>
        </nav>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden rounded-md p-2 text-foreground hover:bg-muted"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
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
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="mt-1 inline-flex items-center justify-center rounded-full gradient-brand px-4 py-2.5 text-sm font-semibold text-white"
            >
              Call to Order
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
