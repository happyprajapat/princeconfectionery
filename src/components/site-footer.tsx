import { Link } from "@tanstack/react-router";
import { Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg gradient-warm text-primary-foreground font-display text-lg font-bold">
              P
            </span>
            <span className="font-display text-lg font-semibold text-foreground">
              Prince Confectionery Departmental
            </span>
          </div>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Wholesale supplier of namkeen, biscuits, sweets, snacks, roasted items, confectionery and dry cakes across the Tricity region.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-foreground">Catalogue</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/catalogue" className="hover:text-primary">All products</Link></li>
            <li><Link to="/about" className="hover:text-primary">About us</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-foreground">Reach us</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-primary" />{SITE.phone}</li>
            <li className="flex items-start gap-2"><MessageCircle className="h-4 w-4 mt-0.5 text-primary" />WhatsApp</li>
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary" />{SITE.address}</li>
            <li className="flex items-start gap-2"><Clock className="h-4 w-4 mt-0.5 text-primary" />{SITE.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Prince Confectionery Departmental. All rights reserved.</p>
          <Link to="/auth" className="text-xs text-muted-foreground hover:text-primary">Admin login</Link>
        </div>
      </div>
    </footer>
  );
}
