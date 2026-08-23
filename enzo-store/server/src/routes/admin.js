import { Router } from "express";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";
import { attachUser, requireAdmin } from "../middleware/auth.js";
import { productSchema, orderStatusSchema, parseOrThrow } from "../utils/validation.js";

const router = Router();

// CHECKPOINT NOTE (server/src/routes/admin.js):
// Every route below runs attachUser -> requireAdmin first (applied via
// router.use), so nothing here is reachable without a verified Supabase
// session that's also listed in admin_users. This is now the REAL
// enforcement point for admin actions — RLS in the database is a second,
// independent layer behind it, not the only layer.
router.use(attachUser, requireAdmin);

// ---------- Dashboard stats ----------
router.get("/stats", async (_req, res, next) => {
  try {
    const [{ count: products }, { count: pendingOrders }, { count: totalOrders }] = await Promise.all([
      supabaseAdmin.from("products").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabaseAdmin.from("orders").select("*", { count: "exact", head: true }),
    ]);
    res.json({ products: products || 0, pendingOrders: pendingOrders || 0, totalOrders: totalOrders || 0 });
  } catch (err) {
    next(err);
  }
});

// ---------- Products (full CRUD, including inactive) ----------
router.get("/products", async (_req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin.from("products").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get("/products/:id", async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin.from("products").select("*").eq("id", req.params.id).maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Product not found" });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/products", async (req, res, next) => {
  try {
    const body = parseOrThrow(productSchema, req.body);
    const { data, error } = await supabaseAdmin.from("products").insert(body).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

router.put("/products/:id", async (req, res, next) => {
  try {
    const body = parseOrThrow(productSchema, req.body);
    const { data, error } = await supabaseAdmin
      .from("products")
      .update(body)
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.delete("/products/:id", async (req, res, next) => {
  try {
    const { error } = await supabaseAdmin.from("products").delete().eq("id", req.params.id);
    if (error) throw error;
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// ---------- Orders (read + status update) ----------
router.get("/orders", async (_req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin.from("orders").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get("/orders/:id/items", async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin.from("order_items").select("*").eq("order_id", req.params.id);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.patch("/orders/:id/status", async (req, res, next) => {
  try {
    const body = parseOrThrow(orderStatusSchema, req.body);
    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status: body.status })
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// ---------- Categories ----------
router.post("/categories", async (req, res, next) => {
  try {
    const { slug, name } = req.body;
    const { data, error } = await supabaseAdmin.from("categories").insert({ slug, name }).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// ---------- Customers ----------
// CHECKPOINT NOTE: emails/login info live in Supabase Auth (auth.users),
// which isn't a normal queryable table -- it's reached through the admin
// Auth API (supabaseAdmin.auth.admin.listUsers()). This merges that with
// the "profiles" table (phone/address) added in migration_v4.sql, plus a
// quick order count per customer.
router.get("/customers", async (_req, res, next) => {
  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) throw authError;

    const { data: profiles, error: profileError } = await supabaseAdmin.from("profiles").select("*");
    if (profileError) throw profileError;

    const { data: orders, error: ordersError } = await supabaseAdmin.from("orders").select("user_id");
    if (ordersError) throw ordersError;

    const orderCounts = {};
    for (const o of orders) {
      if (!o.user_id) continue;
      orderCounts[o.user_id] = (orderCounts[o.user_id] || 0) + 1;
    }

    const profileMap = Object.fromEntries(profiles.map((p) => [p.user_id, p]));

    const customers = authData.users.map((u) => ({
      id: u.id,
      email: u.email,
      createdAt: u.created_at,
      fullName: profileMap[u.id]?.full_name || u.user_metadata?.full_name || "",
      phone: profileMap[u.id]?.phone || "",
      city: profileMap[u.id]?.default_city || "",
      address: profileMap[u.id]?.default_address || "",
      orderCount: orderCounts[u.id] || 0,
    }));

    res.json(customers);
  } catch (err) {
    next(err);
  }
});

export default router;
