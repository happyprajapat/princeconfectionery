import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductForm } from "@/components/product-form";
import type { Product } from "@/lib/catalogue";

export const Route = createFileRoute("/admin/products_/$id/edit")({
  component: EditProduct,
});

function EditProduct() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["product-edit", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data as Product | null;
    },
  });

  return (
    <div>
      <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>
      <h1 className="mt-3 font-display text-3xl font-semibold">Edit product</h1>
      <p className="text-sm text-muted-foreground mb-8">Update details, image and visibility.</p>
      {isLoading ? (
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      ) : data ? (
        <ProductForm initial={data} productId={id} />
      ) : (
        <p>Product not found.</p>
      )}
    </div>
  );
}
