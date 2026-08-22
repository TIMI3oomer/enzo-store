import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient.js";
import ProductCard from "../components/ProductCard.jsx";

// CHECKPOINT NOTE (Home.jsx):
// Hero is deliberately typographic (big bilingual-ready headline) rather
// than a generic banner-plus-carousel, matching the bold/minimal streetwear
// identity from the ENZO Instagram. "New arrivals" pulls the 8 newest
// active products straight from Supabase — no hardcoded product data.
export default function Home() {
  const { t } = useTranslation("common");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => setProducts(data || []));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 start-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-enzo-gradient opacity-20 blur-3xl"
        />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-5xl leading-tight sm:text-7xl"
        >
          {t("hero.title")}
        </motion.h1>
        <p className="mt-4 max-w-xl text-enzo-muted sm:text-lg">{t("hero.subtitle")}</p>
        <Link
          to="/shop"
          className="mt-8 rounded-md bg-enzo-gradient px-8 py-3 font-semibold text-enzo-black"
        >
          {t("hero.cta")}
        </Link>
      </section>

      {/* New arrivals */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="mb-8 font-display text-2xl">{t("nav.shop")}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
