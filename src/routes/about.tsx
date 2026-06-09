import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Award, Heart, MapPin, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Prince Confectionery Departmental" },
      { name: "description", content: "Tricity's trusted wholesale supplier of namkeen, sweets, biscuits and confectionery — serving retailers with quality and consistency." },
      { property: "og:title", content: "About Prince Confectionery Departmental" },
      { property: "og:description", content: "Wholesale partner to retailers across Chandigarh, Mohali and Panchkula." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteShell>
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">About us</p>
          <h1 className="mt-3 font-display text-5xl font-semibold text-foreground sm:text-6xl text-balance">
            A wholesale partner you can rely on, season after season.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Prince Confectionery Departmental supplies retailers across the Tricity with an ever-evolving range of namkeen, biscuits, sweets, snacks, roasted items, confectionery and dry cakes.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 grid gap-6 sm:grid-cols-2">
        {[
          { icon: <Award className="h-5 w-5" />, title: "Quality first", desc: "We source only what we'd happily sell to our own family — fresh, well-packed and consistent." },
          { icon: <Heart className="h-5 w-5" />, title: "Festive ready", desc: "Our seasonal range scales for Diwali, Holi, Rakhi and every major celebration." },
          { icon: <MapPin className="h-5 w-5" />, title: "Tricity coverage", desc: "Reliable delivery across Chandigarh, Mohali and Panchkula." },
          { icon: <Users className="h-5 w-5" />, title: "Built on relationships", desc: "Long-term partnerships with shopkeepers who trust us with their shelves." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-card p-6">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">{f.icon}</div>
            <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>
    </SiteShell>
  );
}
