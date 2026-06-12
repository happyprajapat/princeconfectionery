import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/product-form";

export const Route = createFileRoute("/admin/products_/new")({
  component: NewProduct,
});

function NewProduct() {
  return (
    <div>
      <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>
      <h1 className="mt-3 font-display text-3xl font-semibold">New product</h1>
      <p className="text-sm text-muted-foreground mb-8">Add a product to your catalogue.</p>
      <ProductForm />
    </div>
  );
}
