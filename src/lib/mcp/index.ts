import { defineMcp } from "@lovable.dev/mcp-js";
import listCategories from "./tools/list-categories";
import listProducts from "./tools/list-products";
import getProduct from "./tools/get-product";

export default defineMcp({
  name: "prince-confectionery-mcp",
  title: "Prince Confectionery Catalogue",
  version: "0.1.0",
  instructions:
    "Read-only tools for browsing the Prince Confectionery wholesale catalogue (namkeen, sweets, biscuits, snacks, seasonal items). Use `list_categories` to discover categories, `list_products` (optionally filter by category slug or search) to browse, and `get_product` for a single item's full details.",
  tools: [listCategories, listProducts, getProduct],
});
