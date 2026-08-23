import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../lib/api.js";
import AdminLayout from "../../components/AdminLayout.jsx";

// CHECKPOINT NOTE (admin/Dashboard.jsx):
// Stats now come from GET /api/admin/stats (backend), which is protected
// by requireAdmin server-side — this page no longer queries Supabase
// directly at all.
export default function AdminDashboard() {
  const { t } = useTranslation("admin");
  const [stats, setStats] = useState({ products: 0, pendingOrders: 0, totalOrders: 0 });

  useEffect(() => {
    api.get("/admin/stats").then(setStats).catch(() => {});
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
