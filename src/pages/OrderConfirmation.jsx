import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabaseClient.js";

// CHECKPOINT NOTE (OrderConfirmation.jsx):
// Looked up by order_number (a public, human-friendly sequential id),
// never by the internal uuid — this keeps the confirmation URL short and
// shareable while RLS still prevents reading any other order field a
// customer shouldn't see (policy only allows admins to SELECT orders, so
// today this page relies on the order_number the app already has from the
// insert response, not a fresh fetch — see note below if you want a fetch
// here later, you'll need a dedicated "public order lookup" RPC).
export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const { t } = useTranslation("checkout");

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-display text-2xl">{t("confirmation.success")}</h1>
      <p className="mt-6 text-enzo-muted">{t("confirmation.orderNumber")}</p>
      <p className="text-2xl font-semibold">#{orderNumber}</p>
      <p className="mt-4 text-enzo-muted">{t("confirmation.status")}</p>
      <p className="font-medium">{t("confirmation.pending")}</p>
      <Link to="/" className="mt-10 inline-block rounded-md bg-enzo-gradient px-6 py-3 font-semibold text-enzo-black">
        {t("confirmation.backHome")}
      </Link>
    </div>
  );
}
