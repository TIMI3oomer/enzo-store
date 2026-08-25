import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { api } from "../lib/api.js";
import ScrollShowcase from "../components/ScrollShowcase.jsx";

// CHECKPOINT NOTE (Home.jsx):
// Hero is deliberately typographic (big bilingual-ready headline) rather
// than a generic banner-plus-carousel, matching the bold/minimal streetwear
// identity from the ENZO Instagram. Below it, ScrollShowcase.jsx is the
// page's one signature motion moment — products rise and rotate into
// place in 3D as you scroll, then everything else on the page stays
// still and quiet by contrast (see frontend-design skill: "spend your
// boldness in one place"). Products come from the Node backend
// (GET /api/products); with an empty store, ScrollShowcase simply
// renders nothing rather than showing broken placeholders.
export default function Home() {
  const { t } = useTranslation("common");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then((data) => setProducts((data || []).slice(0, 8)));
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

      {/* New arrivals — the 3D scroll showcase */}
      <div>
        <h2 className="mx-auto max-w-7xl px-4 pt-4 text-start font-display text-2xl sm:px-6">
          {t("nav.shop")}
        </h2>
        <ScrollShowcase products={products} />
        <div className="mx-auto max-w-7xl px-4 pb-20 text-center sm:px-6">
          <Link to="/shop" className="text-sm font-medium text-enzo-gold underline underline-offset-4">
            {t("hero.cta")}
          </Link>
        </div>
      </div>
    </div>
  );
}
