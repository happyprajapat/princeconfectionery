# Prince Confectionery Departmental — Technical Handoff

> Audience: senior developer / AI assistant taking over the project.
> Last updated: current build. Live: https://princeconfectionery.lovable.app

---

## 1. Project Overview

**Purpose.** A premium, SSR-rendered B2B **product catalogue website** for *Prince Confectionery Departmental*, a Chandigarh-based wholesaler of namkeen, biscuits, sweets, bakery, roasted snacks, dry fruits and grocery. It is a *catalogue + enquiry* site, **not** an e-commerce store — there is no cart, no pricing, and no checkout. Enquiries are funnelled to WhatsApp/phone.

**Target users.**
- Primary: retailers / shopkeepers / kirana stores across Tricity (Chandigarh, Mohali, Panchkula) browsing the range before placing a wholesale order.
- Secondary: the owner (Prince Prajapat) as the sole admin, managing ~200 products through the admin panel.
- Tertiary: AI agents (ChatGPT/Claude/Cursor) via the built-in MCP server.

**Business goals.**
1. Replace the WhatsApp-PDF catalogue with a live, always-current online catalogue.
2. Let the owner self-manage products/categories/visibility without a developer.
3. Establish credibility (26 years, GST, brand distributorships) and drive WhatsApp enquiries.
4. Rank locally for "wholesale namkeen / biscuits Chandigarh" type queries.

**Completion: ~85%.** All core public pages, the full admin CRUD, auth, RLS, images, dark mode and MCP are done. Remaining work is polish: real product photography, richer SEO/structured data, enquiry persistence, and analytics.

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Frontend framework | **TanStack Start v1** (React 19, SSR + file-based routing via TanStack Router) |
| Backend | Same app — **TanStack server functions** (`createServerFn`) + server route handlers (`createFileRoute` + `server.handlers`). No separate API service, no edge functions. |
| Database | **Postgres** (Supabase, provisioned through Lovable Cloud) |
| Auth | **Supabase Auth** — email/password, JWT bearer tokens; role table + `has_role()` security-definer function |
| Server state | **TanStack Query v5** (`useQuery` / `queryClient`) |
| Client state | React local state + a tiny `useTheme` hook (localStorage + `.dark` class). No Redux/Zustand. |
| Styling | **Tailwind CSS v4** (CSS-first config in `src/styles.css`, `@theme inline` tokens) |
| UI kit | **shadcn/ui** on Radix UI primitives; **lucide-react** icons |
| Animation | **Framer Motion** v12 |
| Toasts | **Sonner** |
| Forms | react-hook-form + zod + @hookform/resolvers (available; product form is currently controlled-state) |
| Hosting | **Lovable** → Cloudflare Workers (edge SSR) via Nitro |
| Build tools | **Vite 7**, `@lovable.dev/vite-tanstack-config`, TanStack Router plugin, `@lovable.dev/mcp-js` Vite plugin |
| Package manager | **bun** (`bunfig.toml` with 24h supply-chain guard) |
| Third-party SDKs | `@supabase/supabase-js`, `@lovable.dev/mcp-js`, WhatsApp deep links (`wa.me`), Google Fonts |

> ⚠️ The app is compiled for the **Cloudflare Workers** runtime. It will 404 on Vercel/Netlify static deploys unless a Workers/Node adapter is configured. Publish via Lovable.

---

## 3. Folder Structure

```
.
├── src/
│   ├── routes/                       # File-based routes (URL = filename, dots = slashes)
│   │   ├── __root.tsx                # HTML shell: fonts <link>, theme bootstrap, header/footer, Sonner, scroll progress
│   │   ├── index.tsx                 # Home (505 lines): hero, stats, categories, featured 6, brands, why-us, enquiry form
│   │   ├── catalogue.tsx             # Full catalogue: search + category filter (URL search params)
│   │   ├── product.$slug.tsx         # Product detail page
│   │   ├── about.tsx                 # Company story / credentials
│   │   ├── contact.tsx               # Address, phone, WhatsApp, hours, map-less contact block
│   │   ├── auth.tsx                  # Sign in / sign up; calls claimAdminIfNone after login
│   │   ├── admin.tsx                 # Admin layout: role gate + sidebar nav + <Outlet />
│   │   ├── admin.index.tsx           # Dashboard: 6 stat cards, visibility donut, per-category breakdown
│   │   ├── admin.products.tsx        # Product table: search, category filter, visibility toggle, delete
│   │   ├── admin.products_.new.tsx   # Create product (un-nested `_` route so it renders standalone)
│   │   ├── admin.products_.$id.edit.tsx  # Edit product
│   │   ├── admin.categories.tsx      # Category CRUD + active/hidden toggle + sort order
│   │   ├── admin.featured.tsx        # Pick & order exactly 6 home-page featured products
│   │   ├── sitemap[.]xml.ts          # GET /sitemap.xml
│   │   ├── mcp.ts                    # AUTO-GENERATED MCP endpoint (do not edit)
│   │   ├── [.mcp]/…                  # AUTO-GENERATED MCP companion routes
│   │   └── [.well-known]/oauth-protected-resource.ts  # AUTO-GENERATED
│   ├── components/
│   │   ├── site-header.tsx           # Sticky glass nav: crown logo, links, dark-mode toggle, mobile sheet
│   │   ├── site-footer.tsx           # Large logo, shimmering tagline, contact, socials, GST
│   │   ├── site-shell.tsx            # Page width/padding wrapper
│   │   ├── product-form.tsx          # Shared create/edit form incl. image upload to Storage
│   │   ├── whatsapp-float.tsx        # Fixed floating WhatsApp CTA
│   │   └── ui/                       # shadcn/ui primitives
│   ├── lib/
│   │   ├── catalogue.ts              # Types + all catalogue queries + signed-URL image resolver + slugify
│   │   ├── site.ts                   # Single source of truth for business info, logos, brands
│   │   ├── admin.functions.ts        # `claimAdminIfNone` server fn (bootstraps first admin)
│   │   ├── mcp/index.ts              # defineMcp() — MCP server definition
│   │   ├── mcp/tools/*.ts            # list_categories, list_products, get_product
│   │   ├── config.server.ts          # Server-only config helpers
│   │   └── error-*.ts                # Error capture / reporting plumbing
│   ├── integrations/supabase/        # AUTO-GENERATED: client.ts, client.server.ts, auth-middleware.ts,
│   │                                 # auth-attacher.ts, types.ts — never edit by hand
│   ├── hooks/                        # use-auth, use-theme, use-mobile
│   ├── assets/                       # *.asset.json pointers to externalised logo images
│   ├── styles.css                    # Tailwind v4 theme: tokens, light/dark palettes, custom utilities
│   ├── router.tsx / start.ts / server.ts  # Router creation, Start instance (+ auth middleware), SSR entry
│   └── routeTree.gen.ts              # GENERATED — never edit
├── supabase/config.toml              # Managed
├── vite.config.ts                    # defineConfig + mcpPlugin()
├── bunfig.toml, components.json, tsconfig.json, eslint.config.js
└── public/robots.txt, favicon
```

---

## 4. Features Completed

**Catalogue**
- ~200 products across 11 categories, seeded from the owner's real price list.
- Category ordering enforced via `sort_order`; **Extras** pinned last.
- Product cards with image, name, pack sizes, category.
- Product detail pages at `/product/:slug` with description, pack sizes, WhatsApp enquiry CTA.

**Search & filters**
- Debounced text search on product name (client-side over the fetched set).
- Category filter chips; state is reflected in URL search params so filters are shareable/bookmarkable.
- Empty-state handling.

**Admin**
- Role-gated `/admin` layout (redirects non-admins).
- Product CRUD with image upload to a **private** Storage bucket.
- Per-product **visibility toggle** (replaces the removed "seasonal" concept).
- Category CRUD + **hide entire category** (hides the category *and* all its products, enforced in RLS, not just the UI).
- **Home Featured** manager: pick and order exactly 6 products.
- Redesigned dashboard: gradient hero, 6 stat cards, SVG donut for visible/hidden split, per-category breakdown bars, quick actions.

**Auth**
- Email/password sign-up & sign-in.
- Roles in a dedicated `user_roles` table (never on `profiles`) + `has_role()` SECURITY DEFINER function.
- `claimAdminIfNone` server function bootstraps the very first user as admin.
- `profiles` row auto-created by the `handle_new_user()` trigger.

**Design / UX**
- Fully responsive (mobile-first; tested down to ~360px).
- Light + **dark mode** with a nav toggle, persisted in localStorage, no flash on load.
- Framer Motion scroll reveals, animated counters, floating icons, hover lifts.
- Scroll-progress bar; shimmering footer tagline; glassmorphic sticky header.
- Floating WhatsApp button on every page.

**SEO**
- Per-route `head()` with unique title / description / og:title / og:description.
- Semantic HTML, single H1 per page, alt text on product images.
- `/sitemap.xml` server route and `robots.txt`.
- Server-side rendering means crawlers get full HTML.

**Forms**
- Wholesale enquiry form on the home page → composes a prefilled WhatsApp message.
- Contact page with tap-to-call, WhatsApp, email, address, hours.

**Integrations**
- MCP server at `/mcp` exposing three read-only tools (`list_categories`, `list_products`, `get_product`) so AI assistants can query the catalogue.

**Performance**
- SSR at the edge; route-level code splitting by the router plugin.
- Signed Storage URLs cached in-memory for ~6 days (7-day expiry).
- No chart library — the dashboard donut is hand-rolled SVG.
- Logos externalised as assets rather than bundled base64.

---

## 5. Features Partially Completed

| Feature | State | Remaining |
|---|---|---|
| Product images | Upload works; most of the ~200 seeded products have **no image** | Bulk photography + upload; add a per-category placeholder |
| Enquiry form | Sends to WhatsApp only | Persist to an `enquiries` table + admin inbox + email notification |
| SEO | Meta tags done | JSON-LD (`Organization`, `Product`, `LocalBusiness`), absolute `og:image` per product, canonical tags, sitemap `BASE_URL` is an empty string and must be set to the production origin |
| Search | Client-side substring | Server-side `ilike`/full-text with pagination once the catalogue grows |
| Admin dashboard | Static counts | Trend data, recently edited, low-content warnings |
| Category images/icons | Not implemented | `image_url`/`icon` column + UI |
| Google OAuth | Not configured | Enable the provider + button (email/password only today) |
| Analytics | None | GA4 / Plausible + WhatsApp click tracking |

---

## 6. Pending Tasks

**High priority**
- [ ] Upload real product images (biggest visible gap).
- [ ] Set `BASE_URL` in `src/routes/sitemap[.]xml.ts` to the production origin; include product URLs.
- [ ] Add JSON-LD structured data (LocalBusiness + Product) and canonical tags.
- [ ] Persist enquiries to the database with an admin inbox.
- [ ] Republish after every schema change (the live site lags preview otherwise).
- [ ] Server-side pagination/search on `/catalogue` before the list grows further.

**Medium priority**
- [ ] Bulk CSV import/export for products.
- [ ] Drag-and-drop reordering for categories and featured products.
- [ ] Image compression/resize on upload (WebP, max 1200px).
- [ ] Add Google sign-in.
- [ ] Analytics + WhatsApp conversion events.
- [ ] Product "related items" section.
- [ ] Skeleton loaders everywhere (a few lists still pop in).

**Low priority**
- [ ] Downloadable PDF catalogue generated from the DB.
- [ ] Multi-admin invitations with role management UI.
- [ ] Hindi/Punjabi language toggle.
- [ ] Product tags (vegan, gluten-free, gift-pack).
- [ ] Testimonials / retailer logos section.
- [ ] PWA / offline catalogue.

---

## 7. Database

Postgres on Supabase. Four tables in `public`, all with RLS enabled and explicit GRANTs.

**`categories`**
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | `gen_random_uuid()` |
| name | text NOT NULL | display name |
| slug | text NOT NULL | URL key |
| sort_order | int NOT NULL default 0 | drives display order; Extras is highest |
| is_active | bool NOT NULL default true | **false hides the category and all its products** |
| created_at | timestamptz | |

**`products`**
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| name, slug | text NOT NULL | slug is category-prefixed for uniqueness |
| category_id | uuid → categories.id | nullable |
| description | text | |
| pack_sizes | text[] NOT NULL default '{}' | e.g. `{200g,500g,1kg}` |
| image_url | text | Storage path or legacy public URL |
| is_visible | bool NOT NULL default true | admin show/hide |
| featured_order | int NULL | non-null ⇒ shown on home, ordered asc, limit 6 |
| created_at / updated_at | timestamptz | `updated_at` maintained by `update_updated_at_column()` |

**`profiles`** — `id` (= auth user id), `email`, `full_name`, `created_at`. Populated by the `handle_new_user()` trigger. Users may only read/update their own row; no deletes.

**`user_roles`** — `id`, `user_id`, `role` (`app_role` enum: `admin | user`), unique(user_id, role). Roles are deliberately **not** on `profiles` to prevent privilege escalation.

**Relationships.** `products.category_id → categories.id` (many-to-one). `profiles.id` and `user_roles.user_id` map to auth users (no FK to `auth.users` by design).

**Indexes.** PKs on all tables, unique on `user_roles(user_id, role)`. *Recommended additions:* `products(slug)` unique, `products(category_id)`, `products(is_visible)`, `products(featured_order)`, `categories(slug)` unique.

**Security rules (RLS).**
- Public read of categories: `is_active = true OR has_role(auth.uid(),'admin')`.
- Public read of products: `is_visible = true AND (category_id IS NULL OR its category is_active) OR has_role(...,'admin')` — so hiding a category truly hides its products at the data layer.
- All writes on `categories`, `products`, `user_roles` require `has_role(auth.uid(),'admin')`.
- `profiles` scoped strictly to `auth.uid() = id`.
- GRANTs: `anon` gets SELECT on `categories`/`products` only; `authenticated` gets the rest; `service_role` full.

**Storage.** Private bucket `product-images`; the client never uses public URLs — `resolveImageUrl()` mints 7-day signed URLs and caches them.

**DB functions.** `has_role(uuid, app_role)` (STABLE, SECURITY DEFINER), `handle_new_user()` (trigger), `update_updated_at_column()` (trigger).

---

## 8. APIs

There is **no bespoke REST API**. Data access is either the Supabase client (PostgREST, RLS-enforced) or in-app server functions.

| Endpoint / call | Purpose | Auth | Notes |
|---|---|---|---|
| Supabase PostgREST `/rest/v1/categories` | read/write categories | anon key (read), user JWT (write) | RLS enforced |
| Supabase PostgREST `/rest/v1/products` | read/write products | same | RLS enforced |
| Supabase Storage `/storage/v1/object/sign/product-images/*` | signed image URLs | anon/user | 7-day expiry, client-cached 6 days |
| Supabase Auth `/auth/v1/*` | sign-up, sign-in, session refresh | public | Supabase default rate limits (~30 req/h per IP on some auth endpoints) |
| `claimAdminIfNone` (server fn, POST) | make the first authenticated user an admin | requires bearer token via `requireSupabaseAuth` middleware | uses the service-role client server-side; no-ops once an admin exists |
| `GET /sitemap.xml` | sitemap | public | cached 1h |
| `ANY /mcp` | MCP Streamable HTTP endpoint | **public / unauthenticated** | read-only tools over already-public catalogue data |
| `GET /.well-known/oauth-protected-resource`, `/.mcp/*` | MCP metadata / tool listing | public | auto-generated |
| `https://wa.me/<number>?text=…` | enquiry hand-off | none | client-side deep link |

**Rate limits.** Supabase project-tier limits apply to PostgREST/Auth. No app-level rate limiting exists — worth adding on the MCP endpoint and any future enquiry POST.

---

## 9. Environment Variables

Injected by Lovable Cloud; do not hand-edit `.env`.

| Variable | Scope | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | client (build-inlined) | Supabase project URL for the browser client |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | client | anon/publishable key (safe to ship; RLS protects data) |
| `VITE_SUPABASE_PROJECT_ID` | client | project ref; needed if MCP OAuth is ever enabled |
| `SUPABASE_URL` | server | same URL for SSR / server functions |
| `SUPABASE_PUBLISHABLE_KEY` | server | anon key for server-side public reads and token verification |
| `SUPABASE_SERVICE_ROLE_KEY` | server, secret | **bypasses RLS** — only used by `client.server.ts` (admin bootstrap). Never expose. |
| `SUPABASE_DB_URL` | server, secret | direct Postgres connection (migrations/tooling) |
| `LOVABLE_API_KEY` | server, secret | Lovable AI Gateway key — provisioned, not yet used by app code |

Rules: `process.env.*` only inside handlers (server); `import.meta.env.VITE_*` in the browser.

---

## 10. Components

| Component | Responsibility |
|---|---|
| `__root.tsx` | Document shell: Google Fonts `<link>` (Poppins + Inter), no-flash theme script, header, `<Outlet />`, footer, floating WhatsApp, Sonner `<Toaster />`, scroll-progress bar |
| `site-header.tsx` | Sticky glassmorphic nav; crown-only logo (`dark:invert`), desktop links with active styles, dark-mode toggle, mobile sheet menu, "Enquire" CTA |
| `site-footer.tsx` | Large brand logo, shimmer-animated "Quality You May Rely" tagline, contact block, socials, GST, nav columns |
| `site-shell.tsx` | Consistent max-width + horizontal padding wrapper |
| `product-form.tsx` | Shared create/edit form: name (auto-slug), category select, description, pack-size chips, image upload to Storage with preview, visibility switch, save/cancel, toast feedback |
| `whatsapp-float.tsx` | Fixed bottom-right WhatsApp CTA with pulse animation |
| `ui/*` | shadcn/ui primitives (button, card, dialog, input, select, switch, table, sheet, sonner, …) |
| Route-local pieces | Home page contains `Hero`, `StatsStrip` (animated counters), `CategoryGrid`, `FeaturedProducts`, `BrandsSection`, `WhyChooseUs`, `EnquiryForm`; admin dashboard contains `StatCard` and an inline SVG donut |

Shared logic lives in hooks: `use-auth` (session + admin role), `use-theme` (dark mode), `use-mobile` (breakpoint), and `lib/catalogue.ts` (all queries).

---

## 11. Routes

| Route | File | Status |
|---|---|---|
| `/` | `index.tsx` | ✅ Complete |
| `/catalogue` | `catalogue.tsx` | ✅ Complete (server-side pagination pending) |
| `/product/$slug` | `product.$slug.tsx` | ✅ Complete (needs images + JSON-LD) |
| `/about` | `about.tsx` | ✅ Complete |
| `/contact` | `contact.tsx` | ✅ Complete (map embed optional) |
| `/auth` | `auth.tsx` | ✅ Complete (Google OAuth pending) |
| `/admin` | `admin.tsx` (layout) | ✅ Complete |
| `/admin` index | `admin.index.tsx` | ✅ Complete |
| `/admin/products` | `admin.products.tsx` | ✅ Complete |
| `/admin/products/new` | `admin.products_.new.tsx` | ✅ Complete |
| `/admin/products/$id/edit` | `admin.products_.$id.edit.tsx` | ✅ Complete |
| `/admin/categories` | `admin.categories.tsx` | ✅ Complete |
| `/admin/featured` | `admin.featured.tsx` | ✅ Complete |
| `/sitemap.xml` | `sitemap[.]xml.ts` | 🟡 Partial — `BASE_URL` empty, product URLs missing |
| `/mcp`, `/.mcp/*`, `/.well-known/oauth-protected-resource` | generated | ✅ Complete |
| `/enquiries` (admin inbox) | — | 📋 Planned |
| 404 page | — | 📋 Planned (router default today) |

Routing conventions: filename dots = URL slashes; `admin.products_.new.tsx` uses the trailing `_` to escape the `admin.products` layout (this fixed the earlier "Add product renders nothing" bug).

---

## 12. Design System

**Palette** — premium royal/indigo/violet with gold accents, all as CSS variables in `src/styles.css` and exposed to Tailwind via `@theme inline`. Semantic tokens (`--background`, `--foreground`, `--primary`, `--card`, `--muted`, `--border`, `--ring`) plus brand tokens (`--royal`, `--indigo-c`, `--violet-c`, `--amber-c`, `--orange-c`, `--gold-c`, `--emerald-c`, `--navy`). Dark mode is a `.dark` class overriding the same variables. **Never hardcode `text-white` / `bg-[#hex]`** — use tokens.

**Typography** — `--font-display: Poppins` (400–900) for headings, `--font-sans: Inter` for body, both loaded via `<link>` in `__root.tsx`. Heavy weights (700–900) and tight tracking on hero/section headings; uppercase micro-labels with wide tracking (`0.2em`).

**Icons** — lucide-react throughout, typically 16–20px, often inside gradient-filled rounded squares.

**Animations** — Framer Motion scroll reveals (fade + 20px rise, staggered), animated stat counters, hover lift (`-translate-y-0.5` + shadow), scroll-progress bar, footer shimmer keyframe, WhatsApp pulse. Transitions are 150–300ms ease-out.

**Layout rules** — radius scale from `--radius: 1rem` (cards `rounded-2xl`, hero `rounded-3xl`, pills `rounded-full`); consistent `site-shell` max width; grid gap 4–6; generous section padding (`py-16 sm:py-24`); glassmorphism (`backdrop-blur` + translucent border) on the header and overlays.

**Breakpoints** — Tailwind defaults: `sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`. Grids typically 1 → 2 (`sm`) → 3 (`lg`) → 4 (`xl`); admin stat grid 2 → 3 (`md`) → 6 (`lg`).

---

## 13. Known Bugs & Technical Debt

1. **Published site lags preview** — schema/code changes require an explicit republish; the owner previously reported "add product doesn't work" for exactly this reason.
2. **Vercel/Netlify deploys 404** — the build targets Cloudflare Workers; other hosts need an adapter.
3. **`sitemap.xml` has an empty `BASE_URL`**, emitting relative `<loc>` values, and omits product pages.
4. **Most products have no image**; cards fall back to a plain placeholder.
5. **Search/filter is client-side over the full fetched set** — the whole catalogue is downloaded on `/catalogue`; will degrade past a few hundred rows.
6. **Signed-URL cache is per-tab in-memory**; a full reload re-signs every visible image (N requests on first paint).
7. **Enquiries are fire-and-forget** — if WhatsApp fails to open, the lead is lost with no record.
8. **No 404/error route** — users hitting a bad slug get a generic router fallback.
9. **`has_role` is executable by `authenticated`** — required for RLS to work; the security linter flags it as a WARN. Documented as accepted, not a real issue.
10. **`list_categories.ts` has a `void z;` hack** to silence an unused import — cosmetic cleanup.
11. **No automated tests** at any level.
12. **Home page is 505 lines** — should be split into `src/components/home/*`.
13. **Slugs are category-prefixed** from the bulk seed, so product URLs are longer than ideal; changing them later breaks links.

---

## 14. Performance

- **Lighthouse:** not formally measured. Expect ~90+ on desktop for content pages; the `/catalogue` route is the weak spot (large payload + many signed-image requests).
- **Images:** uploaded originals are stored as-is — **no resizing, compression, or WebP conversion**. This is the top optimisation opportunity. Signed URLs cached client-side ~6 days.
- **Lazy loading:** route-level code splitting via the TanStack Router plugin; native lazy loading should be verified/added on below-the-fold product images.
- **Caching:** TanStack Query caches per query key; `/sitemap.xml` sends `Cache-Control: public, max-age=3600`; static assets are hashed and edge-cached. No CDN caching of HTML (SSR is per-request).
- **Bundle:** Framer Motion (~50KB gz) and the Supabase client are the largest deps. Radix components are tree-shaken per import. Charts were deliberately avoided (hand-rolled SVG donut). Avoid adding heavyweight libraries.
- **Wins available:** paginate the catalogue, batch/precompute signed URLs server-side, serve WebP thumbnails, `content-visibility: auto` on long grids.

---

## 15. Security

**Implemented**
- RLS enabled on every public table with explicit policies **and** GRANTs; no table is readable by default.
- Roles isolated in `user_roles` and checked only through the `SECURITY DEFINER` `has_role()` function — no client-trusted role flags, no localStorage admin checks.
- Admin writes are enforced in the database, not just the UI; hiding a category removes its products from the anon result set at the policy level.
- Private Storage bucket with short-lived signed URLs; no public object paths.
- Service-role key used only inside `client.server.ts`, imported dynamically inside a handler after auth verification, and never reachable from client bundles.
- Server functions that mutate privileged state use the `requireSupabaseAuth` middleware (Bearer-token verification via `getClaims`).
- `claimAdminIfNone` is idempotent — it no-ops once any admin exists, so it can't be replayed to gain admin.
- Secrets live in Lovable Cloud env, never in the repo; only publishable keys reach the browser.

**Remaining improvements**
- Rate-limit the public `/mcp` endpoint and any future enquiry endpoint.
- Add input validation (zod) on the enquiry form and on server functions once they accept user data.
- Add a CSP and standard security headers.
- Add an audit log for admin mutations.
- Consider MFA for the admin account, and OAuth-protect MCP if any non-public data is ever exposed there.
- Validate uploaded image MIME type and size server-side (currently client-side only).

---

## 16. Business Logic

**Categories** are the primary taxonomy: 11 of them, ordered by `sort_order` with **Extras forced last**. Setting `is_active = false` removes the category from public navigation *and* removes every product inside it from public queries — a single switch for retiring a whole seasonal range (this replaced the old per-product "seasonal" fields, which were dropped from the schema).

**Products** belong to at most one category. Each has a name, an auto-generated slug, a description, an array of `pack_sizes` (the wholesale-relevant attribute — deliberately no prices, since B2B pricing is negotiated), one image, and an `is_visible` flag for individual show/hide. Public visibility is the AND of `product.is_visible` and `category.is_active`.

**Featured products** are driven by `featured_order`: any product with a non-null value appears on the home page, sorted ascending, limited to 6. `/admin/featured` manages both selection and order.

**Brands** (Ginni Food Products, Shree Bajrang Food Products, Mom's Basket) are **not** database entities — they are hardcoded in `src/lib/site.ts` alongside all company details (phone, GST, address, hours, socials, logos). They represent distributorships shown in a marketing section. Note that several product *categories* share these brand names, so brand→product linking exists only implicitly through the category. Promoting brands to a real table with a `products.brand_id` FK is the natural next step if brand filtering is ever wanted.

**Enquiries** are not stored. The home-page form and every product CTA compose a prefilled WhatsApp message to `+91 81467 03048`. Conversion happens off-platform.

**Admin bootstrap:** the first user to sign up and hit `claimAdminIfNone` becomes the admin; all subsequent users are ordinary authenticated users with no catalogue write access.

---

## 17. Deployment

- **Hosting:** Lovable → Cloudflare Workers (edge SSR, built through Nitro). Production: `https://princeconfectionery.lovable.app`. Preview builds get a separate `-dev` URL.
- **Build command:** `bun run build` (`vite build`); dev is `bun run dev` on port 8080. `build:dev` prerenders in development mode.
- **Environment setup:** all Supabase variables are injected by Lovable Cloud at build/runtime; `.env` is generated. No manual setup is needed for a fresh clone inside Lovable. Outside Lovable you would need to supply the six Supabase variables and a Workers-compatible adapter.
- **Domain:** currently the default `lovable.app` subdomain; no custom domain attached. Adding one is a DNS + Lovable settings change and would also require updating `sitemap.xml`'s `BASE_URL` and any absolute `og:image` URLs.
- **CI/CD:** none beyond Lovable's publish flow — pushing changes updates preview; the owner must click **Publish** to promote to production. There are no tests or lint gates in a pipeline; `eslint` and `prettier` scripts exist and are run manually.
- **Migrations:** applied through the Lovable/Supabase migration tooling; Supabase TypeScript types are regenerated into `src/integrations/supabase/types.ts` afterwards.

---

## 18. Future Ideas (architecture-compatible)

1. **Enquiry pipeline** — `enquiries` table + admin inbox + status workflow + email via Lovable Email.
2. **Bulk operations** — CSV import/export, multi-select visibility toggling, bulk category reassignment.
3. **Image pipeline** — client-side resize/WebP before upload, plus a server function that generates thumbnails.
4. **Brands as first-class entities** — `brands` table, `products.brand_id`, brand landing pages (`/brand/$slug`), great for SEO.
5. **Rich SEO** — per-product JSON-LD, LocalBusiness schema, dynamic OG images, product URLs in the sitemap.
6. **AI features via the Lovable AI Gateway** (`LOVABLE_API_KEY` already provisioned): auto-generate product descriptions, semantic catalogue search with pgvector embeddings, an on-site "what do you stock?" assistant.
7. **Extend the MCP server** with authenticated write tools so the owner can add products from ChatGPT (requires the Supabase OAuth path).
8. **Order pad** — let logged-in retailers build a quantity list and send it as a formatted WhatsApp/PDF order (still no payments).
9. **PDF catalogue generator** from live data.
10. **Analytics + heatmaps** to see which categories drive enquiries.
11. **Retailer accounts** with saved lists and per-retailer visibility.
12. **Multi-language** (Hindi/Punjabi) via a light i18n dictionary.

---

## 19. Overall Project Health

**Healthy and close to production — roughly 85%.**

*Strengths:* clean separation between public and admin surfaces, a correct security model (roles in their own table, RLS + GRANTs, service role never client-reachable), SSR for SEO, a coherent and genuinely premium design system, real data already loaded (~200 products / 11 categories), and a self-service admin the owner can actually operate. TypeScript is clean (`tsgo` passes with zero errors).

*Risks:* no tests, no analytics, missing product imagery, the catalogue page's unpaginated client-side filtering, and the deploy-portability constraint (Workers-only). None are architectural — all are incremental.

*Production readiness:* the site can be published today and would serve retailers well. To call it "done" it needs images, structured data, and enquiry persistence. Estimated **2–3 focused weeks** to reach a polished 100%, with images being the long pole (content, not code).

---

## 20. Suggested Roadmap (next 20 tasks, in order)

1. Fix `sitemap.xml` `BASE_URL` and add all product URLs.
2. Add a proper 404 / not-found route with catalogue links.
3. Add JSON-LD: `LocalBusiness` on the root, `Product` on product pages.
4. Add canonical tags and absolute `og:image` per product page.
5. Build the image upload pipeline: client-side resize + WebP conversion.
6. Bulk-upload real product photography (content sprint with the owner).
7. Add a per-category placeholder image for products still missing photos.
8. Create the `enquiries` table with RLS (anon insert, admin read) + validation.
9. Wire the home-page and product enquiry forms to persist before opening WhatsApp.
10. Build `/admin/enquiries` inbox with status (new / contacted / closed).
11. Add email notification on new enquiry via Lovable Email.
12. Move catalogue search/filtering server-side with pagination (`ilike` + range).
13. Add the recommended Postgres indexes (`slug`, `category_id`, `is_visible`, `featured_order`).
14. Add analytics (GA4 or Plausible) with WhatsApp-click conversion events.
15. Add CSV import/export for products in the admin panel.
16. Add drag-and-drop reordering for categories and featured products.
17. Split `index.tsx` into `src/components/home/*` and add unit tests for `lib/catalogue.ts`.
18. Introduce Playwright smoke tests: home renders, catalogue filters, admin login, product create.
19. Promote brands to a `brands` table with `/brand/$slug` landing pages.
20. Attach a custom domain, add security headers/CSP, and run a full Lighthouse + security audit.

---

### Quick-start notes for the next developer

- Install: `bun install`. Dev: `bun run dev` (port 8080). Typecheck: `tsgo`.
- **Never edit** `src/routeTree.gen.ts`, `src/integrations/supabase/*` (generated), or the MCP auto-generated routes under `src/routes/mcp.ts`, `[.mcp]/`, `[.well-known]/`.
- All schema changes go through migrations, and **every new public table needs GRANTs plus RLS policies** or it will be unreachable.
- Business constants (phone, GST, address, brands, logos) live in exactly one place: `src/lib/site.ts`.
- All catalogue queries live in `src/lib/catalogue.ts` — add new reads there, not inline in components.
