import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";

// CHECKPOINT NOTE (pages/Account.jsx):
// - Order history via GET /api/orders/mine, filtered server-side by the
//   verified token's user id.
// - Profile section (phone/saved address) reads and writes
//   GET/PUT /api/account/profile, backed by the `profiles` table added in
//   migration_v4.sql. This is what the admin's Customers page displays --
//   filling this in here is what makes that page useful.
export default function Account() {
  const { t } = useTranslation("common");
  const { session, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({ full_name: "", phone: "", default_city: "", default_address: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    api
      .get("/orders/mine")
      .then((data) => setOrders(data || []))
      .finally(() => setLoading(false));

    api.get("/account/profile").then((data) => {
      setProfile({
        full_name: data.full_name || session.user.user_metadata?.full_name || "",
        phone: data.phone || "",
        default_city: data.default_city || "",
        default_address: data.default_address || "",
      });
    });
  }, [session]);

  if (authLoading) return null;
  if (!session) return <Navigate to="/login" state={{ from: "/account" }} replace />;

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  const update = (key) => (e) => setProfile((p) => ({ ...p, [key]: e.target.value }));

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSavingProfile(true);
    setSavedMessage(false);
    try {
      await api.put("/account/profile", profile);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2000);
    } finally {
      setSavingProfile(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-start">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl">{t("auth.myAccount")}</h1>
        <button onClick={handleLogout} className="text-sm text-enzo-muted underline">
          {t("auth.logout")}
        </button>
      </div>

      {/* Profile / saved details */}
      <form onSubmit={handleSaveProfile} className="mb-12 rounded-lg border hairline p-5">
        <h2 className="mb-4 text-lg font-medium">{t("auth.fullName")}</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input className="input" placeholder={t("auth.fullName")} value={profile.full_name} onChange={update("full_name")} />
          <input className="input" placeholder={t("auth.email")} value={session.user.email} disabled dir="ltr" />
          <input className="input" dir="ltr" placeholder="Phone" value={profile.phone} onChange={update("phone")} />
          <input className="input" placeholder="City" value={profile.default_city} onChange={update("default_city")} />
          <input
            className="input sm:col-span-2"
            placeholder="Address"
            value={profile.default_address}
            onChange={update("default_address")}
          />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            disabled={savingProfile}
            className="rounded-md bg-enzo-gradient px-5 py-2 text-sm font-semibold text-enzo-black disabled:opacity-40"
          >
            Save
          </button>
          {savedMessage && <span className="text-sm text-enzo-muted">✓</span>}
        </div>
      </form>

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
