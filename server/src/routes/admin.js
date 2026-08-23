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

export default router;
