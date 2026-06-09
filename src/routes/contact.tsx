import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/site";
import { Phone, MessageCircle, MapPin, Clock, Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Prince Confectionery Departmental" },
      { name: "description", content: "Get in touch with Prince Confectionery Departmental for wholesale orders, rates and seasonal stock enquiries in the Tricity region." },
      { property: "og:title", content: "Contact Prince Confectionery Departmental" },
      { property: "og:description", content: "Call or WhatsApp us for wholesale enquiries across Chandigarh, Mohali and Panchkula." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const whatsappUrl = `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`;
  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Get in touch</p>
        <h1 className="mt-3 font-display text-5xl font-semibold text-foreground sm:text-6xl">Let's talk wholesale.</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Reach us by phone or WhatsApp for current rates, stock availability and orders.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <ContactCard icon={<Phone className="h-5 w-5" />} title="Phone" value={SITE.phone} href={`tel:${SITE.phone.replace(/\s/g, "")}`} cta="Call now" />
          <ContactCard icon={<MessageCircle className="h-5 w-5" />} title="WhatsApp" value="Quick replies, daily" href={whatsappUrl} cta="Chat on WhatsApp" external />
          <ContactCard icon={<Mail className="h-5 w-5" />} title="Email" value={SITE.email} href={`mailto:${SITE.email}`} cta="Send email" />
          <ContactCard icon={<MapPin className="h-5 w-5" />} title="Service area" value={SITE.address} cta="" />
        </div>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 text-primary" /> {SITE.hours}
        </div>
      </section>
    </SiteShell>
  );
}

function ContactCard({ icon, title, value, href, cta, external }: { icon: React.ReactNode; title: string; value: string; href?: string; cta: string; external?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">{icon}</div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      <p className="mt-1 font-display text-xl font-semibold text-foreground">{value}</p>
      {href && cta && (
        <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="mt-4 inline-flex text-sm font-medium text-primary hover:underline">
          {cta} →
        </a>
      )}
    </div>
  );
}
