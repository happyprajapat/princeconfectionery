import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MessageCircle, Phone, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/site";
import { fetchAllCategories, fetchProductBySlug } from "@/lib/catalogue";

export const Route = createFileRoute("/product/$slug")({
  component: ProductPage,
  errorComponent: ({ error }) => (
    <SiteShell><div className="mx-auto max-w-3xl p-10 text-center"><p>{error.message}</p></div></SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl p-16 text-center">
        <h1 className="font-display text-3xl">Product not found</h1>
        <Link to="/catalogue" className="mt-4 inline-block text-primary hover:underline">Back to catalogue</Link>
      </div>
    </SiteShell>
  ),
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug),
  });
  const { data: categories = [] } = useQuery({ queryKey: ["all-categories"], queryFn: fetchAllCategories });

  if (isLoading) {
    return <SiteShell><div className="mx-auto max-w-6xl p-16"><div className="h-96 animate-pulse rounded-2xl bg-muted" /></div></SiteShell>;
  }
  if (!product) throw notFound();

  const category = categories.find((c) => c.id === product.category_id);
  const whatsappUrl = `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, I'd like to order: ${product.name}`)}`;

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/catalogue" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to catalogue
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-muted aspect-square">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center font-display text-6xl text-muted-foreground/30">P</div>
            )}
            {product.is_seasonal && (
              <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                <Sparkles className="h-3 w-3" /> {product.season_label || "Seasonal"}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            {category && (
              <Link
                to="/catalogue"
                search={{ category: category.slug }}
                className="text-xs font-medium uppercase tracking-[0.2em] text-primary hover:underline"
              >
                {category.name}
              </Link>
            )}
            <h1 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">{product.name}</h1>

            {product.description && (
              <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>
            )}

            {product.pack_sizes.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Available pack sizes</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.pack_sizes.map((s) => (
                    <span key={s} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 rounded-2xl border border-border bg-secondary/40 p-6">
              <p className="font-display text-lg font-semibold text-foreground">Wholesale enquiries</p>
              <p className="mt-1 text-sm text-muted-foreground">Contact us for current rates and bulk availability.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
                  <Phone className="h-4 w-4" /> Call now
                </a>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
