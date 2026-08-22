import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../lib/supabaseClient.js";
import AdminLayout from "../../components/AdminLayout.jsx";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

// CHECKPOINT NOTE (admin/Orders.jsx):
// Status updates go straight through Supabase; the "admin update orders"
// RLS policy in schema.sql is what actually allows this write — the
// admin-only screen is a UX convenience, not the security boundary.
export default function AdminOrders() {
  const { t } = useTranslation("admin");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data || []);
  }

  async function updateStatus(id, status) {
    await supabase.from("orders").update({ status }).eq("id", id);
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
