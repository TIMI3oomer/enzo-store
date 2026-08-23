import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext.jsx";
import { useLanguage, useLocalizedField } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";

const initialForm = { fullName: "", phone: "", city: "", address: "", notes: "", paymentMethod: "cod" };

// CHECKPOINT NOTE (Checkout.jsx):
// - Client-side validation only blocks submission; the database itself
//   also rejects malformed rows (see CHECK constraints in schema.sql), so
//   security doesn't depend on this form alone.
// - The order is inserted with `locale` set to the customer's current
//   language, so the admin can see which language the customer checked
//   out in.
// - order_items store a JSON snapshot of the product name at purchase
//   time, so a later product rename doesn't rewrite historical orders.
// - GUEST CHECKOUT IS STILL FULLY SUPPORTED. Logging in is optional: if a
//   session exists, the full name is prefilled from account metadata and
//   the order is linked to that account (user_id) so it shows up on
//   /account. If not, user_id is simply null -- see migration_v2.sql's
//   "create own or guest orders" policy, which allows both.
export default function Checkout() {
  const { t } = useTranslation("checkout");
  const { t: tc } = useTranslation("common");
  const { items, subtotal, clearCart } = useCart();
  const { lang } = useLanguage();
  const { session } = useAuth();
  const localize = useLocalizedField();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const name = session?.user?.user_metadata?.full_name;
    if (name) setForm((f) => ({ ...f, fullName: f.fullName || name }));
  }, [session]);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function validate() {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = t("validation.required");
    if (!form.phone.trim()) errs.phone = t("validation.required");
    else if (!/^[0-9+\-\s]{7,15}$/.test(form.phone.trim())) errs.phone = t("validation.invalidPhone");
    if (!form.city.trim()) errs.city = t("validation.required");
    if (!form.address.trim()) errs.address = t("validation.required");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (items.length === 0) return;
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError("");

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: form.fullName.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        notes: form.notes.trim() || null,
        payment_method: form.paymentMethod,
        subtotal,
        total: subtotal, // extend here if you add shipping cost logic
        locale: lang,
        user_id: session?.user?.id ?? null,
      })
      .select()
      .single();

    if (orderError) {
      setSubmitError(tc("errors.network"));
      setSubmitting(false);
      return;
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      size: item.size,
      quantity: item.quantity,
      unit_price: item.price,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

    if (itemsError) {
      setSubmitError(tc("errors.network"));
      setSubmitting(false);
      return;
    }

    clearCart();
    navigate(`/order-confirmation/${order.order_number}`);
  }

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 md:grid-cols-2">
      <form onSubmit={handleSubmit} className="text-start">
        <h1 className="mb-2 font-display text-2xl">{t("title")}</h1>

        {!session && (
          <p className="mb-6 text-sm text-enzo-muted">
            <Link to="/login" state={{ from: "/checkout" }} className="text-enzo-white underline">
              {tc("auth.signIn")}
            </Link>{" "}
            {tc("auth.orContinueAsGuest")}
          </p>
        )}

        <Field label={t("fullName")} error={errors.fullName}>
          <input value={form.fullName} onChange={update("fullName")} className="input" />
        </Field>
        <Field label={t("phone")} error={errors.phone}>
          <input value={form.phone} onChange={update("phone")} className="input" dir="ltr" />
        </Field>
        <Field label={t("city")} error={errors.city}>
          <input value={form.city} onChange={update("city")} className="input" />
        </Field>
        <Field label={t("address")} error={errors.address}>
          <input value={form.address} onChange={update("address")} className="input" />
        </Field>
        <Field label={t("notes")}>
          <textarea value={form.notes} onChange={update("notes")} className="input" rows={3} />
        </Field>

        <p className="mb-2 mt-4 text-sm font-medium">{t("paymentMethod")}</p>
        <div className="flex flex-col gap-2">
          {["cod", "visa", "reflect"].map((method) => (
            <label key={method} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="paymentMethod"
                checked={form.paymentMethod === method}
                onChange={() => setForm((f) => ({ ...f, paymentMethod: method }))}
              />
              {t(method)}
            </label>
          ))}
        </div>

        {submitError && <p className="mt-4 text-sm text-enzo-pink">{submitError}</p>}

        <button
          type="submit"
          disabled={submitting || items.length === 0}
          className="mt-8 w-full rounded-md bg-enzo-gradient py-3 font-semibold text-enzo-black disabled:opacity-40"
        >
          {t("placeOrder")}
        </button>
      </form>

      <div className="text-start">
        <h2 className="mb-4 font-display text-xl">{t("orderSummary")}</h2>
        <ul className="flex flex-col gap-3 border-b hairline pb-4">
          {items.map((item) => (
            <li key={item.key} className="flex justify-between text-sm">
              <span>
                {localize(item.name)} × {item.quantity}
                {item.size ? ` (${item.size})` : ""}
              </span>
              <span>{item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between font-semibold">
          <span>{t("total")}</span>
          <span>{subtotal}</span>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-enzo-pink">{error}</p>}
    </div>
  );
}
