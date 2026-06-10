import { Link } from "@tanstack/react-router";
import { Phone, MessageCircle, MapPin, Clock, Mail, Instagram, User, FileText } from "lucide-react";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-navy text-white">
      <div className="absolute inset-0 bg-mesh opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white p-3 shadow-glow">
              <img src={SITE.logo} alt="Prince Confectionery logo" className="h-14 w-auto object-contain" />
            </div>
            <div>
              <div className="font-display text-xl font-bold leading-tight">Prince Confectionery</div>
              <div className="text-xs uppercase tracking-[0.22em] text-amber/90 mt-1">Quality You May Rely</div>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm text-white/70 leading-relaxed">
            Premium wholesale & retail supplier of namkeen, biscuits, sweets, bakery, roasted snacks,
            dry fruits and grocery — serving Tricity with quality and trust.
          </p>
          <div className="mt-5 space-y-1.5 text-xs text-white/60">
            <div className="flex items-center gap-2"><User className="h-3.5 w-3.5 text-amber" /> Proprietor: {SITE.owner}</div>
            <div className="flex items-center gap-2"><FileText className="h-3.5 w-3.5 text-amber" /> GSTIN: {SITE.gst}</div>
          </div>
          <div className="mt-6 flex gap-3">
            <a
              href={SITE.socials.instagram}
              target="_blank" rel="noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full glass-dark text-white transition hover:scale-110 hover:bg-white/20"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`}
              target="_blank" rel="noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full glass-dark text-white transition hover:scale-110 hover:bg-white/20"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="grid h-10 w-10 place-items-center rounded-full glass-dark text-white transition hover:scale-110 hover:bg-white/20"
              aria-label="Call"
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white/90">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/65">
            <li><Link to="/" className="transition hover:text-amber hover:translate-x-1 inline-block">Home</Link></li>
            <li><Link to="/catalogue" className="transition hover:text-amber hover:translate-x-1 inline-block">Catalogue</Link></li>
            <li><Link to="/about" className="transition hover:text-amber hover:translate-x-1 inline-block">About</Link></li>
            <li><Link to="/contact" className="transition hover:text-amber hover:translate-x-1 inline-block">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white/90">Reach us</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2.5"><Phone className="h-4 w-4 mt-0.5 text-amber" />{SITE.phone}</li>
            <li className="flex items-start gap-2.5"><Mail className="h-4 w-4 mt-0.5 text-amber" />{SITE.email}</li>
            <li className="flex items-start gap-2.5"><MapPin className="h-4 w-4 mt-0.5 text-amber" />{SITE.address}</li>
            <li className="flex items-start gap-2.5"><Clock className="h-4 w-4 mt-0.5 text-amber" />{SITE.hours}</li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/50">© {new Date().getFullYear()} Prince Confectionery Departmental. Crafted with care in Tricity.</p>
          <Link to="/auth" className="text-xs text-white/50 hover:text-amber transition">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
