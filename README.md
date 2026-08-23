# ENZO — Bilingual Arabic-first Store

React + Vite + Tailwind + Supabase. Arabic is the default language and
drives real RTL layout (not a translated LTR skin) — see the checkpoints
below for exactly what implements each requirement.

## 1. Setup

```bash
npm install
cp .env.example .env      # then fill in your Supabase URL + anon key
npm run dev
```

Then, in your Supabase project's SQL editor, run everything in
`supabase/schema.sql`. That creates the tables, security policies, and a
few starter categories.

To create the store owner's admin login:
1. Supabase Dashboard → Authentication → Users → Add user (email + password).
2. Supabase Dashboard → Table editor → `admin_users` → insert a row with
   that user's `id` as `user_id`.
3. Go to `/admin/login` on the site and sign in.

## 2. Project structure

```
src/
  i18n/                 -> translation strings (ar + en), never hardcode UI text elsewhere
  context/
    LanguageContext.jsx -> sets <html lang/dir>, the whole RTL/LTR engine
    CartContext.jsx      -> cart, independent of language/checkout
    AuthContext.jsx       -> admin auth + admin_users check
  lib/supabaseClient.js  -> Supabase client (needs .env values)
  components/            -> Navbar, ProductCard, CartDrawer, AdminLayout, etc.
  pages/                 -> storefront pages
  pages/admin/           -> admin dashboard pages
supabase/schema.sql       -> full DB schema + Row Level Security policies
```

## 3. Checkpoints (what was built, and why)

**Checkpoint 1 — Project scaffold & tooling**
Vite + React + Tailwind + postcss-logical configured so RTL/LTR use real
CSS logical properties (`margin-inline`, `inset-inline`, `text-align:
start/end`) instead of hardcoded left/right. File: `tailwind.config.js`,
`postcss.config.js`.

**Checkpoint 2 — Language & direction engine**
`src/context/LanguageContext.jsx` is the single place that decides the
active language, persists it, and flips `<html lang dir>` — this is what
makes the *entire* layout mirror, not just the text. Default is Arabic
unless `localStorage.enzo_lang` says otherwise (requirement #1).

**Checkpoint 3 — Translation system**
`src/i18n/` holds `common.json` / `checkout.json` / `admin.json` per
language, matching the file layout requested in section 9 of the spec.
No interface text is hardcoded inside components — everything goes
through `t("...")`.

**Checkpoint 4 — Bilingual product/category data model**
`supabase/schema.sql` stores `name`, `description`, `material`, `fit`,
`care_instructions` as `jsonb` columns shaped like `{ "ar": "...", "en": "..." }`
on a single `products` row (requirement #4) — never duplicate products per
language. `useLocalizedField()` in `LanguageContext.jsx` reads the right
key at render time.

**Checkpoint 5 — Language switcher + persistence**
`src/components/LanguageSwitcher.jsx` renders "العربية | English" per the
spec. Switching language never touches the router (so the current
page/product stays put) or the cart (`CartContext` is fully separate
state), satisfying requirement #3.

**Checkpoint 6 — Storefront pages**
Home, Shop (with category filter), Product detail (RTL-safe gallery +
size selector), Cart, Checkout (Arabic/English form matching the exact
field list in requirement #7), Order confirmation (#8). All built with
logical CSS properties so they mirror correctly.

**Checkpoint 7 — Admin dashboard**
`src/pages/admin/*` + `AdminLayout.jsx` give the store owner a fully
bilingual dashboard (Dashboard stats, Products CRUD with explicit AR/EN
fields side-by-side, Orders with status updates) — the admin is never
forced into English (requirement #6).

**Checkpoint 8 — Security**
`supabase/schema.sql` enables Row Level Security on every table:
customers can only read active products/categories and create orders;
only a user listed in `admin_users` can read orders, or write
products/categories/order status. This is enforced by Postgres itself,
not just by hiding buttons in the UI (`ProtectedAdminRoute.jsx` is a UX
convenience only). Also: no service-role key is ever placed in frontend
code, and inputs are validated both client-side and via DB `check`
constraints.

**Checkpoint 9 — Visual identity**
`tailwind.config.js` + `src/index.css` encode the ENZO look pulled from
the Instagram reference: black base (#0A0A0A), off-white text, a
pink→orange gradient (from the profile picture's ring) reused as a
recurring hover/focus signature (`.enzo-ring`) instead of a generic
Shopify-black template. Fonts: Anton (EN display) + Inter (EN body) +
IBM Plex Sans Arabic (all Arabic text) — loaded from Google Fonts.

## 4. Things you need to change / decide

These are flagged with `CHECKPOINT NOTE` comments directly in the files —
search for that string to find every one of them. The main ones:

- `src/lib/supabaseClient.js` — needs your real Supabase URL + anon key in `.env`.
- `src/pages/admin/ProductForm.jsx` — image field is a comma-separated URL
  list for now; wire up Supabase Storage file upload when ready.
- `src/components/Footer.jsx` — replace placeholder contact info with real
  WhatsApp/Instagram/Maps links.
- `App.jsx` — no `/ar` and `/en` URL prefixes yet (language is a client
  context, not a route param). Add this later only if you need
  language-specific indexable URLs for SEO.
- Real product photos: none are included. Add real image URLs (ideally
  via Supabase Storage) per product in the admin panel.

## 5. Responsive / RTL testing

Layout uses logical properties throughout, so RTL should hold at all the
breakpoints listed in the spec (320–1440px+). Manually re-check the
hamburger menu, cart drawer, and admin sidebar at each breakpoint after
adding real content, since real (longer) Arabic/English copy can reveal
wrapping issues that placeholder text doesn't.

## 6. Update — Pants/Trainings categories, filters, customer accounts

**Checkpoint 10 — Pants + Trainings categories**
`supabase/migration_v2.sql` adds two new categories (`pants` /
"بناطيل" and `training` / "ترينج"). Run this file once in the Supabase
SQL editor (after `schema.sql`). The Shop page's category tabs come
straight from the `categories` table, so these appear automatically —
no frontend code change needed for the tabs themselves.

**Checkpoint 11 — Real filters on the Shop page**
`src/pages/Shop.jsx` was rewritten to add sort (newest / price low-high /
price high-low) and a size filter, alongside the category tabs. This also
fixed a real bug in the old version: filtering on a joined table
(`.eq("categories.slug", slug)`) doesn't actually narrow the product
rows returned by Supabase — it now resolves the category's id first and
filters `products.category_id` directly, which is correct.

**Checkpoint 12 — Customer login / register / accounts**
- `src/context/AuthContext.jsx` gained a `register()` method (Supabase
  Auth sign-up, storing full name in user metadata).
- `src/pages/Login.jsx` and `src/pages/Register.jsx` are the
  customer-facing auth pages (separate from the admin login at
  `/admin/login`, though both use the same underlying Supabase session —
  a customer account is never treated as an admin unless it's also in
  `admin_users`).
- `src/pages/Account.jsx` shows a logged-in customer's own past orders.
- `supabase/migration_v2.sql` adds `orders.user_id` plus RLS policies so
  a customer can only ever see/attach their own orders — enforced by
  Postgres, not just by hiding UI.
- **Guest checkout still works.** Logging in is optional: `Checkout.jsx`
  prefills the name field if signed in and links the order to the
  account, but proceeds fine with `user_id = null` for guests.
- Navbar now has an account icon (desktop) and an account/login link in
  the mobile menu.
