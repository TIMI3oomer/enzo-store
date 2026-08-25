import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X, ShoppingBag, Heart, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocalizedField, useLanguage } from "../context/LanguageContext.jsx";
import { useCurrency } from "../context/CurrencyContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

export default function QuickViewModal({ product, isOpen, onClose }) {
  const { t } = useTranslation("common");
  const { lang } = useLanguage();
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const localize = useLocalizedField();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  // Initialize selections
  const currentSize = selectedSize || product.sizes?.[0] || "Standard";
  const currentColor = selectedColor || product.colors?.[0] || null;
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, currentSize, quantity, currentColor);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-3xl overflow-hidden rounded-xl border hairline bg-enzo-panel shadow-2xl p-6 text-start"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 end-4 z-10 rounded-full bg-enzo-black/60 p-2 text-enzo-muted hover:text-enzo-white transition-colors"
              aria-label="close"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Media Gallery */}
              <div>
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-enzo-black">
                  {product.images?.[activeImage] ? (
                    <img
                      src={product.images[activeImage]}
                      alt={localize(product.name)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-enzo-muted">ENZO</div>
                  )}

                  {/* Badges */}
                  {product.badges?.length > 0 && (
                    <div className="absolute top-3 start-3 flex flex-col gap-1.5">
                      {product.badges.map((b, i) => (
                        <span
                          key={i}
                          className="rounded bg-enzo-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-enzo-black shadow-md"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images?.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`h-16 w-14 flex-none overflow-hidden rounded-md border transition-all ${
                          idx === activeImage ? "border-enzo-gold ring-1 ring-enzo-gold" : "border-enzo-line opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={img} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-enzo-gold font-semibold mb-1">
                    {product.sku || "ENZO MENSWEAR"}
                  </p>
                  <h2 className="font-display text-2xl text-enzo-white leading-tight">
                    {localize(product.name)}
                  </h2>

                  <div className="mt-2 flex items-baseline gap-3">
                    <span className="font-display text-2xl text-enzo-gold">
                      {formatPrice(product.price, lang)}
                    </span>
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="text-xs text-amber-400 font-medium">
                        {t("product.onlyLeft", { count: product.stock })}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-enzo-muted line-clamp-3">
                    {localize(product.description)}
                  </p>

                  {/* Colors */}
                  {product.colors?.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-medium text-enzo-muted">
                        {t("product.color")}: <span className="text-enzo-white">{localize(currentColor?.name)}</span>
                      </p>
                      <div className="flex gap-2">
                        {product.colors.map((c, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedColor(c)}
                            style={{ backgroundColor: c.hex }}
                            title={localize(c.name)}
                            className={`h-6 w-6 rounded-full border transition-transform ${
                              currentColor?.hex === c.hex ? "scale-125 border-enzo-gold ring-2 ring-enzo-gold/40" : "border-enzo-line hover:scale-110"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sizes */}
                  {product.sizes?.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-enzo-muted">{t("product.size")}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((s) => (
                          <button
                            key={s}
                            onClick={() => setSelectedSize(s)}
                            className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-all ${
                              currentSize === s
                                ? "border-enzo-gold bg-enzo-gold text-enzo-black font-bold"
                                : "border-enzo-line text-enzo-muted hover:border-enzo-white hover:text-enzo-white"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-2.5 pt-4 border-t hairline">
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0 || added}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-enzo-gradient py-3 text-sm font-bold text-enzo-black transition-transform active:scale-[0.98] disabled:opacity-40"
                    >
                      {added ? (
                        <>
                          <Check size={18} />
                          <span>{t("success.addedToCart")}</span>
                        </>
                      ) : product.stock === 0 ? (
                        <span>{t("product.outOfStock")}</span>
                      ) : (
                        <>
                          <ShoppingBag size={18} />
                          <span>{t("product.addToCart")}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`rounded-lg border hairline p-3 transition-colors ${
                        isWishlisted ? "bg-enzo-gold/10 border-enzo-gold text-enzo-gold" : "bg-enzo-black/60 text-enzo-muted hover:text-enzo-white"
                      }`}
                      aria-label={t("product.addToWishlist")}
                    >
                      <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <Link
                    to={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 text-xs font-medium text-enzo-muted hover:text-enzo-gold transition-colors py-1"
                  >
                    <span>{t("product.details")}</span>
                    {lang === "ar" ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
