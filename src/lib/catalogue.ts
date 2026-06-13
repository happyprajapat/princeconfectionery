import { supabase } from "@/integrations/supabase/client";

export type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  description: string | null;
  pack_sizes: string[];
  image_url: string | null;
  is_seasonal: boolean;
  season_label: string | null;
  is_visible: boolean;
  featured_order: number | null;
  created_at: string;
};

const BUCKET = "product-images";
const PUBLIC_MARKER = `/${BUCKET}/`;
const signedCache = new Map<string, { url: string; exp: number }>();

/**
 * Convert a stored image_url (which may be a legacy public URL or a storage path)
 * into a usable URL. Since the bucket is private, we generate signed URLs.
 */
export async function resolveImageUrl(stored: string | null): Promise<string | null> {
  if (!stored) return null;
  let path = stored;
  const idx = stored.indexOf(PUBLIC_MARKER);
  if (idx !== -1) path = stored.substring(idx + PUBLIC_MARKER.length);
  else if (/^https?:\/\//.test(stored)) return stored; // external URL
  // cache for ~6 days when expiry is 7 days
  const cached = signedCache.get(path);
  if (cached && cached.exp > Date.now()) return cached.url;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60 * 24 * 7);
  if (!data?.signedUrl) return null;
  signedCache.set(path, { url: data.signedUrl, exp: Date.now() + 6 * 24 * 60 * 60 * 1000 });
  return data.signedUrl;
}

async function resolveAll<T extends { image_url: string | null }>(items: T[]): Promise<T[]> {
  const urls = await Promise.all(items.map((p) => resolveImageUrl(p.image_url)));
  return items.map((p, i) => ({ ...p, image_url: urls[i] }));
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function fetchAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function fetchVisibleProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_visible", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return resolveAll((data ?? []) as Product[]);
}

export async function fetchAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return resolveAll((data ?? []) as Product[]);
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_visible", true)
    .not("featured_order", "is", null)
    .order("featured_order", { ascending: true })
    .limit(6);
  if (error) throw error;
  return resolveAll((data ?? []) as Product[]);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const product = data as Product;
  product.image_url = await resolveImageUrl(product.image_url);
  return product;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
