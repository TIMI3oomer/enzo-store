# ENZO — Bilingual Arabic-first Store

React + Vite + Tailwind (frontend) + Node/Express (backend) + Supabase
(database + auth). Arabic is the default language and drives real RTL
layout (not a translated LTR skin) — see the checkpoints below for
exactly what implements each requirement.

## 1. Setup

This project now has TWO things to run: the Node backend and the React
frontend. Use two terminal windows/tabs.

**Database (once):**
In your Supabase project's SQL editor, run, in this exact order:
1. `supabase/schema.sql`
2. `supabase/migration_v2.sql`
3. `supabase/migration_v3.sql`
4. `supabase/migration_v4.sql`

**Backend (`/server`):**
```bash
cd server
npm install
cp .env.example .env      # fill in SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
npm run dev                # starts on http://localhost:4000
```

**Frontend (project root):**
```bash
npm install
cp .env.example .env      # fill in Supabase URL + ANON key + VITE_API_URL
npm run dev                # starts on http://localhost:5173
```

To create the store owner's admin login:
1. Supabase Dashboard → Authentication → Users → Add user (email + password).
2. Supabase Dashboard → Table editor → `admin_users` → insert a row with
   that user's `id` as `user_id`.
3. Go to `/admin/login` on the site and sign in.

## 2. Project structure

```
src/                        -> React frontend
  lib/api.js                -> talks to the Node backend (all product/order/admin data)
  lib/supabaseClient.js     -> Supabase client used ONLY for Auth now
  context/                  -> Language, Cart, Auth
  pages/ , pages/admin/     -> storefront + admin screens

server/                     -> Node/Express backend (NEW)
  src/index.js              -> app entry: helmet, cors, rate limiting
  src/lib/supabaseAdmin.js  -> the ONLY place the service_role key is used
  src/middleware/auth.js    -> verifies Supabase tokens, admin gate
  src/routes/               -> products, categories, orders, admin
  src/utils/validation.js   -> zod schemas, validated before every write

supabase/
  schema.sql                -> tables + Row Level Security (defense in depth)
  migration_v2.sql          -> pants/training categories, customer accounts
  migration_v3.sql          -> place_order() -- atomic, price-safe checkout
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
language. No interface text is hardcoded inside components — everything
goes through `t("...")`.

**Checkpoint 4 — Bilingual product/category data model**
`supabase/schema.sql` stores `name`, `description`, `material`, `fit`,
`care_instructions` as `jsonb` columns shaped like `{ "ar": "...", "en": "..." }`
on a single `products` row — never duplicate products per language.

**Checkpoint 5 — Language switcher + persistence**
`src/components/LanguageSwitcher.jsx` renders "العربية | English".
Switching language never touches the router or the cart.

**Checkpoint 6 — Storefront pages**
Home, Shop (category + size filters + sort), Product detail, Cart,
Checkout, Order confirmation. All built with logical CSS properties.

**Checkpoint 7 — Admin dashboard**
`src/pages/admin/*` + `AdminLayout.jsx` give the store owner a fully
bilingual dashboard — never forced into English.

**Checkpoint 8 — Database security (Row Level Security)**
`supabase/schema.sql` enables RLS on every table as a defense-in-depth
layer, in addition to the backend's own checks (Checkpoint 13).

**Checkpoint 9 — Visual identity**
Black base (#0A0A0A), off-white text, a pink→orange gradient (from the
Instagram profile ring) reused as a recurring hover/focus signature.
Fonts: Anton (EN display) + Inter (EN body) + IBM Plex Sans Arabic (all
Arabic text).

**Checkpoint 10 — Pants + Trainings categories**
`supabase/migration_v2.sql` adds `pants` ("بناطيل") and `training`
("ترينج"). Category tabs on Shop pull live from the database, so no
frontend change was needed for the tabs themselves.

**Checkpoint 11 — Real filters on the Shop page**
Sort (newest / price low-high / price high-low) + size filter, now
resolved server-side by the backend (`GET /api/products?category=&size=&sort=`).

**Checkpoint 12 — Customer login / register / accounts**
`src/pages/Login.jsx`, `Register.jsx`, `Account.jsx`. Guest checkout still
fully works — logging in is optional and just links the order to the
account for order-history purposes.

**Checkpoint 13 — Node.js backend (NEW)**
This is the big structural change. Previously the React app talked to
Supabase directly with the public anon key, which meant:
- A customer could edit the order total in devtools before it was saved.
- Two people buying the last unit of a product at the same time could
  both "succeed," overselling stock.
- All write security depended entirely on Row Level Security policies,
  with no independent server-side validation layer.

Now:
- `server/` is a proper Express API. It's the only thing with the
  Supabase **service_role** key (`server/src/lib/supabaseAdmin.js`) —
  that key is never in the frontend, ever.
- `POST /api/orders` (`server/src/routes/orders.js`) accepts only
  product ids/sizes/quantities. It calls `place_order()`
  (`supabase/migration_v3.sql`), a Postgres function that looks up real
  prices, locks stock rows, checks availability, and creates the order +
  line items + stock decrement in one atomic transaction. There is no
  code path left where the client controls a price.
- Every admin write (`server/src/routes/admin.js`) requires a verified
  Supabase access token AND a row in `admin_users` (`requireAdmin`
  middleware), checked fresh on every request.
- `server/src/utils/validation.js` validates every request body with zod
  before it touches the database — a third, independent layer alongside
  the frontend's form validation and the database's CHECK constraints.
- `helmet`, `cors` (locked to your frontend's origin), a request size
  limit, and rate limiting on order creation are all in
  `server/src/index.js`.
- The frontend now calls this backend via `src/lib/api.js` for every
  product/order/admin operation. `supabaseClient.js` is kept only for
  Supabase Auth (login/register/session).

**Checkpoint 14 — Customer profiles + admin Customers page**
Supabase Auth's built-in `auth.users` table only holds login credentials
(email, password) and isn't meant to be extended directly. `supabase/migration_v4.sql`
adds a standard companion `profiles` table (phone, saved city/address),
linked 1-to-1 to `auth.users` and auto-created on signup via a Postgres
trigger. This is what backs:
- `src/pages/Account.jsx` — customers can now view and edit their own
  phone/address (`GET`/`PUT /api/account/profile`, enforced to their own
  row only via the verified token's user id, same pattern as `/orders/mine`).
- `src/pages/admin/Customers.jsx` — a new admin page merging Supabase
  Auth's user list with `profiles` and an order count per customer
  (`GET /api/admin/customers`), reachable from the sidebar.

**Checkpoint 15 — Black / white / gold palette + smoother language switch**
- `tailwind.config.js` replaced the pink/orange accent with a gold system
  (`enzo.gold`, `enzo.goldLight`, `enzo.goldDark`). Every CTA button
  already used the shared `bg-enzo-gradient` class, so they all updated
  from one config change. A separate `enzo.error` red was kept — on
  purpose — for delete buttons and validation messages only; that's a
  semantic/accessibility color, not part of the decorative brand palette,
  so it wasn't converted to gold.
- `src/context/LanguageContext.jsx` now wraps the ar↔en switch in the
  browser's View Transition API (`document.startViewTransition`, with
  `flushSync` forcing the DOM update to happen inside it), so the whole
  page cross-fades between RTL and LTR instead of snapping instantly.
  `src/index.css` defines the actual fade/scale timing
  (`::view-transition-old/new`). Browsers without support (e.g. Firefox)
  or people with "reduce motion" turned on automatically get an instant,
  unanimated switch instead — never a broken one.
- Audited every component for hardcoded `left-`/`right-`/`ml-`/`mr-`
  classes that would misalign under RTL; none were found outside of code
  comments, so no further alignment fixes were needed.

## 4. Things you need to change / decide

Search the code for `CHECKPOINT NOTE` to find every flagged spot. Main ones:

- `server/.env` — needs your Supabase URL + **service_role** key (Project
  Settings → API → service_role, NOT anon). Never put this in the
  frontend `.env`.
- `.env` (frontend) — needs Supabase URL + anon key + `VITE_API_URL`
  pointing at wherever you deploy the backend.
- `src/pages/admin/ProductForm.jsx` — image field is a comma-separated
  URL list for now; wire up Supabase Storage file upload when ready.
- `src/components/Footer.jsx` — replace placeholder contact info with
  real WhatsApp/Instagram/Maps links.
- Real product photos: add real image URLs per product in the admin panel.
- Deployment: the frontend (static) and backend (long-running Node
  process) need separate hosts — e.g. frontend on Vercel/Netlify, backend
  on Render/Railway/Fly.io — with `VITE_API_URL` and `FRONTEND_URL`
  pointed at each other's real URLs.

## 5. Responsive / RTL testing

Layout uses logical properties throughout, so RTL should hold at all the
breakpoints listed in the spec (320–1440px+). Manually re-check the
hamburger menu, cart drawer, and admin sidebar at each breakpoint after
adding real content, since real (longer) Arabic/English copy can reveal
wrapping issues that placeholder text doesn't.

