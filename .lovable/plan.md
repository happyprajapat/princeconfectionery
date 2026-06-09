## Prince Confectionery Departmental — Catalogue Website

A clean, browse-only catalogue site for 200+ wholesale products organized by category, with an admin panel for you to manage products and toggle their visibility (perfect for seasonal items).

---

## Public Website (anyone can view)

**Pages**
- **Home** — Hero with business name, tagline ("Wholesale Namkeen, Sweets, Biscuits & More — Tricity"), highlights of featured/seasonal categories, contact CTA (phone + WhatsApp).
- **Catalogue** — All visible products in a responsive grid. Filter by **category** sidebar/chips (Namkeen, Biscuits, Sweets, Snacks, Roasted, Confectionery, Dry Cakes, etc.). Search bar to find by name. Optional "Seasonal" filter chip.
- **Product detail** — Image, name, category, description, available pack sizes (e.g. 200g, 500g, 1kg), seasonal badge if applicable. "Contact us to order" button (WhatsApp + Call).
- **About** — Short business story, area served (Tricity), categories you stock.
- **Contact** — Phone, WhatsApp, address, map embed, business hours.

**Key behaviors**
- Only products marked **visible = true** in admin appear on the public site. Toggling a seasonal product off instantly hides it everywhere.
- Categories are also managed in admin; empty categories are hidden automatically.
- Mobile-first, fast loading even with 200+ products (pagination/lazy load images).
- No prices shown anywhere on the public site.
- No cart, no checkout, no online inquiry form on products.

---

## Admin Panel (login required — only you)

Accessible at `/admin` after logging in.

**Dashboard** — quick counts: total products, visible vs hidden, products per category, seasonal items currently live.

**Products**
- Table of all products with: image thumb, name, category, pack sizes, seasonal badge, **visibility toggle**.
- Search + filter by category + filter by visibility.
- Bulk actions: hide/show selected, delete selected. Useful at end of season to hide all "Diwali" items in one click.
- Add / edit product form: name, category, description, pack sizes (multiple), upload image, seasonal tag (optional season label like "Diwali", "Holi", "Summer"), visibility toggle.

**Categories**
- Add / edit / delete categories (Namkeen, Biscuits, Sweets, Snacks, Roasted, Confectionery, Dry Cakes, custom ones).
- Reorder categories (controls the order shown on public catalogue).

**Seasonal helper**
- One-click filter: "Show all seasonal products" → bulk hide/show by season tag, so you can flip the whole Diwali range on/off in seconds.

---

## Technical Details

**Stack**
- TanStack Start (already set up), React, Tailwind, shadcn/ui components.
- Lovable Cloud for database, authentication, image storage, and server logic.

**Data model**
- `categories` — id, name, slug, sort_order.
- `products` — id, name, slug, category_id, description, pack_sizes (array of strings), image_url, is_seasonal, season_label, is_visible, created_at.
- `profiles` + `user_roles` (admin role) — only users with the `admin` role can access the admin panel and write to the database. RLS policies enforce this server-side.

**Auth**
- Email + password login for admin. Your account is seeded as admin. Public visitors don't need to log in.

**Images**
- Uploaded to Lovable Cloud storage, served via CDN. Single image per product in v1.

**Routes**
- `/` home, `/catalogue`, `/catalogue/$category`, `/product/$slug`, `/about`, `/contact`
- `/auth` login, `/admin` dashboard, `/admin/products`, `/admin/products/new`, `/admin/products/$id/edit`, `/admin/categories`

---

## What's NOT included in v1 (can add later)
- Online ordering / cart / payments
- Retailer logins with personalized pricing
- Staff accounts with limited roles
- Orders, invoices, GST billing, ledger
- Sales reports

If you want any of those later, we layer them on. Ready to build v1?
