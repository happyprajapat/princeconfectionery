import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

export default defineTool({
  name: "list_products",
  title: "List products",
  description:
    "List visible products in the Prince Confectionery catalogue. Optionally filter by category slug or search text, and limit results.",
  inputSchema: {
    category_slug: z.string().optional().describe("Filter by category slug (e.g. 'namkeen')."),
    search: z.string().optional().describe("Case-insensitive substring match on product name."),
    limit: z.number().int().min(1).max(200).optional().describe("Max results (default 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category_slug, search, limit }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false } },
    );
    let categoryId: string | undefined;
    if (category_slug) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category_slug)
        .maybeSingle();
      if (!cat) {
        return {
          content: [{ type: "text", text: `Unknown category slug: ${category_slug}` }],
          isError: true,
        };
      }
      categoryId = cat.id;
    }
    let q = supabase
      .from("products")
      .select("id,name,slug,category_id,description,pack_sizes")
      .eq("is_visible", true)
      .order("created_at", { ascending: false })
      .limit(limit ?? 50);
    if (categoryId) q = q.eq("category_id", categoryId);
    if (search) q = q.ilike("name", `%${search}%`);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { products: data ?? [] },
    };
  },
});
