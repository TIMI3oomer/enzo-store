import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, X, ArrowRight, ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocalizedField, useLanguage } from "../context/LanguageContext.jsx";
import { useCurrency } from "../context/CurrencyContext.jsx";
import { api } from "../lib/api.js";

export default function SearchModal({ isOpen, onClose }) {
  const { t } = useTranslation("common");
  const { lang } = useLanguage();
  const { formatPrice } = useCurrency();
  const localize = useLocalizedField();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      api
        .get(`/products?q=${encodeURIComponent(query.trim())}`)
        .then((data) => setResults(data || []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24">
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-2xl overflow-hidden rounded-xl border hairline bg-enzo-panel shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 border-b hairline px-4 py-3.5">
              <Search size={20} className="text-enzo-gold" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("search.placeholder")}
                className="w-full bg-transparent text-enzo-white placeholder-enzo-muted outline-none text-base sm:text-lg"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="rounded p-1 text-enzo-muted hover:text-enzo-white"
                  aria-label="clear"
                >
                  <X size={16} />
                </button>
              )}
              <button
                onClick={onClose}
                className="rounded border border-enzo-line px-2.5 py-1 text-xs text-enzo-muted hover:border-enzo-white hover:text-enzo-white"
              >
                ESC
              </button>
            </div>

            {/* Results or Suggestions */}
            <div className="max-h-[60vh] overflow-y-auto p-4">
              {loading ? (
                <div className="py-8 text-center text-sm text-enzo-muted animate-pulse">
                  {lang === "ar" ? "جاري البحث في المتجر..." : "Searching menswear catalog..."}
                </div>
              ) : query && results.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-enzo-muted">
                    {t("search.noResults", { query })}
                  </p>
                  <p className="mt-3 text-xs text-enzo-gold">
                    {t("search.suggestions")}
                  </p>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wider text-enzo-muted px-2">
                    {t("filters.showing", { count: results.length })}
                  </p>
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 rounded-lg p-2.5 transition-colors hover:bg-enzo-black/60 group"
                    >
                      <div className="h-16 w-14 flex-none overflow-hidden rounded bg-enzo-black">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={localize(product.name)}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-enzo-muted">ENZO</div>
                        )}
                      </div>
                      <div className="flex-1 text-start">
                        <p className="text-sm font-medium text-enzo-white group-hover:text-enzo-gold transition-colors">
                          {localize(product.name)}
                        </p>
                        <p className="text-xs text-enzo-muted line-clamp-1 mt-0.5">
                          {localize(product.description)}
                        </p>
                        <p className="text-xs font-semibold text-enzo-gold mt-1">
                          {formatPrice(product.price, lang)}
                        </p>
                      </div>
                      <div className="text-enzo-muted group-hover:text-enzo-gold transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                        {lang === "ar" ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-start px-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-enzo-muted mb-3">
                    {lang === "ar" ? "عمليات البحث الشائعة" : "Popular Searches"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { ar: "بولو إيطاليا", en: "Italia Polo" },
                      { ar: "بولو الأرجنتين", en: "Argentina Polo" },
                      { ar: "تيشيرت أوفر سايز 280GSM", en: "Heavyweight Tee" },
                      { ar: "بنطال بكسرات", en: "Pleated Chino" },
                      { ar: "طقم ترينينج", en: "Training Set" },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuery(lang === "ar" ? item.ar : item.en)}
                        className="rounded-full border hairline bg-enzo-black/40 px-3 py-1.5 text-xs text-enzo-white hover:border-enzo-gold hover:text-enzo-gold transition-colors"
                      >
                        {lang === "ar" ? item.ar : item.en}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
