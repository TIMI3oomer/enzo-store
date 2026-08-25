import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, ShoppingBag, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function Wishlist() {
  const { t } = useTranslation("common");
  const { lang } = useLanguage();
  const { items, count, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleMoveAllToCart = () => {
    for (const item of items) {
      addItem(item, item.sizes?.[0] || "L", 1, item.colors?.[0] || null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 text-start">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b hairline pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-enzo-gold mb-1">
            <Heart size={18} fill="currentColor" />
            <span className="text-xs font-bold uppercase tracking-widest">
              {t("wishlist.title")}
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-enzo-white">
            {t("wishlist.title")} ({count})
          </h1>
          <p className="text-xs text-enzo-muted mt-1">
            {t("wishlist.subtitle")}
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleMoveAllToCart}
              className="flex items-center gap-2 rounded-lg bg-enzo-gradient px-4 py-2 text-xs font-bold text-enzo-black shadow"
            >
              <ShoppingBag size={14} />
              <span>{t("wishlist.moveToCart")}</span>
            </button>
            <button
              onClick={clearWishlist}
              className="flex items-center gap-1 text-xs text-enzo-muted hover:text-enzo-error transition-colors p-2"
            >
              <Trash2 size={14} />
              <span>{t("wishlist.clearAll")}</span>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 rounded-2xl border hairline bg-enzo-panel p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-enzo-black text-enzo-gold mb-4 border hairline">
            <Heart size={28} />
          </div>
          <h2 className="font-display text-2xl text-enzo-white mb-1">{t("wishlist.empty")}</h2>
          <p className="max-w-md text-xs text-enzo-muted mb-6">
            {t("wishlist.emptyDesc")}
          </p>
          <Link
            to="/shop"
            className="flex items-center gap-2 rounded-lg bg-enzo-gradient px-6 py-3 text-xs font-bold text-enzo-black shadow"
          >
            <span>{t("wishlist.explore")}</span>
            {lang === "ar" ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
