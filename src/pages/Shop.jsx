import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabaseClient.js";
import { useLocalizedField } from "../context/LanguageContext.jsx";
import ProductCard from "../components/ProductCard.jsx";

// CHECKPOINT NOTE (Shop.jsx):
// Category filter reads the slug from the URL (language-agnostic, e.g.
// /shop/t-shirts works the same in ar/en) and displays the category's
// localized name via useLocalizedField. Filters row uses flex-wrap +
// gap, which reverses direction automatically under dir="rtl".
export default function Shop() {
  const { t } = useTranslation("common");
  const { categorySlug } = useParams();
  const localize = useLocalizedField();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("categories").select("*").then(({ data }) => setCategories(data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    let query = supabase.from("products").select("*, categories(slug, name)").eq("is_active", true);
    if (categorySlug) {
      query = query.eq("categories.slug", categorySlug);
    }
    query.order("created_at", { ascending: false }).then(({ data }) => {
      setProducts(data || []);
      setLoading(false);
    });
  }, [categorySlug]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-display text-3xl">{t("nav.shop")}</h1>

      <div className="mb-8 flex flex-wrap gap-3">
        {categories.map((c) => (
          <a
            key={c.id}
            href={`/shop/${c.slug}`}
            className="rounded-full border hairline px-4 py-1.5 text-sm text-enzo-muted hover:border-enzo-white hover:text-enzo-white"
          >
            {localize(c.name)}
          </a>
        ))}
      </div>

      {loading ? (
        <p className="text-enzo-muted">…</p>
      ) : products.length === 0 ? (
        <p className="text-enzo-muted">{t("product.outOfStock")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
