import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../lib/api.js";
import AdminLayout from "../../components/AdminLayout.jsx";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

// CHECKPOINT NOTE (admin/Orders.jsx):
// Reads/writes go through GET /api/admin/orders and PATCH
// /api/admin/orders/:id/status (backend), protected by requireAdmin.
export default function AdminOrders() {
  const { t } = useTranslation("admin");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await api.get("/admin/orders").catch(() => []);
    setOrders(data || []);
  }

  async function updateStatus(id, status) {
    await api.patch(`/admin/orders/${id}/status`, { status });
    load();
  }

  return (
    <AdminLayout title={t("orders.title")}>
      <div className="overflow-x-auto rounded-lg border hairline">
        <table className="w-full text-start text-sm">
          <thead className="bg-enzo-panel text-enzo-muted">
            <tr>
              <th className="px-4 py-3 text-start">{t("orders.orderNumber")}</th>
              <th className="px-4 py-3 text-start">{t("orders.customer")}</th>
              <th className="px-4 py-3 text-start">{t("orders.date")}</th>
              <th className="px-4 py-3 text-start">{t("orders.status")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t hairline">
                <td className="px-4 py-3">#{o.order_number}</td>
                <td className="px-4 py-3">{o.customer_name}</td>
                <td className="px-4 py-3">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <select
                    className="input py-1"
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {t(`orders.status${s[0].toUpperCase()}${s.slice(1)}`)}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
