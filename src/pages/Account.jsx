import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";

// CHECKPOINT NOTE (pages/Account.jsx):
// Shows a logged-in customer's own past orders via GET /api/orders/mine
// (backend), which verifies the Supabase access token and filters by that
// verified user's id server-side — a customer can never fetch anyone
// else's orders no matter what this page's code does, because the id
// comes from the token, not from anything the client sends.
export default function Account() {
  const { t } = useTranslation("common");
  const { session, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) return;
    api
      .get("/orders/mine")
      .then((data) => setOrders(data || []))
      .finally(() => setLoading(false));
  }, [session]);

  if (authLoading) return null;
  if (!session) return <Navigate to="/login" state={{ from: "/account" }} replace />;

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-start">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl">{t("auth.myAccount")}</h1>
        <button onClick={handleLogout} className="text-sm text-enzo-muted underline">
          {t("auth.logout")}
        </button>
      </div>

      <h2 className="mb-4 text-lg font-medium">{t("auth.myOrders")}</h2>
      {loading ? (
        <p className="text-enzo-muted">…</p>
      ) : orders.length === 0 ? (
        <p className="text-enzo-muted">{t("auth.noOrders")}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((o) => (
            <li key={o.id} className="flex items-center justify-between rounded-md border hairline p-4">
              <div>
                <p className="font-medium">#{o.order_number}</p>
                <p className="text-sm text-enzo-muted">{new Date(o.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-end">
                <p className="font-medium">{o.total}</p>
                <p className="text-sm text-enzo-muted">{o.status}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
