import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../lib/supabaseClient.js";
import AdminLayout from "../../components/AdminLayout.jsx";

// CHECKPOINT NOTE (admin/Dashboard.jsx):
// Simple at-a-glance stats. Expand this with real charts (e.g. recharts)
// once there's enough order history to make a chart meaningful — flagged
// here rather than building empty/fake charts now.
export default function AdminDashboard() {
  const { t } = useTranslation("admin");
  const [stats, setStats] = useState({ products: 0, pendingOrders: 0, totalOrders: 0 });

  useEffect(() => {
    async function load() {
      const [{ count: products }, { count: pendingOrders }, { count: totalOrders }] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("orders").select("*", { count: "exact", head: true }),
      ]);
      setStats({ products: products || 0, pendingOrders: pendingOrders || 0, totalOrders: totalOrders || 0 });
    }
    load();
  }, []);

  return (
    <AdminLayout title={t("nav.dashboard")}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label={t("nav.products")} value={stats.products} />
        <StatCard label={t("orders.statusPending")} value={stats.pendingOrders} />
        <StatCard label={t("nav.orders")} value={stats.totalOrders} />
      </div>
    </AdminLayout>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border hairline bg-enzo-panel p-6 text-start">
      <p className="text-sm text-enzo-muted">{label}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
    </div>
  );
}
