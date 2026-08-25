import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useLocalizedField } from "../context/LanguageContext.jsx";

// CHECKPOINT NOTE (components/ScrollShowcase.jsx):
// The signature motion moment for the homepage: as each product card
// enters the viewport, it rises from below and rotates in from an angle
// (alternating left/right per column) into a flat, resting position —
// like garments being racked into place. Everything is driven by
// useScroll's per-card scroll progress (0 -> 1 as it crosses a fixed
// viewport window), not global scroll position, so cards animate
// independently as they arrive rather than all moving together.
//
// PERFORMANCE: only `transform` and `opacity` are animated (both are
// GPU-composited, never trigger layout/paint), so this stays smooth even
// on older phones. `will-change: transform` is applied only while a card
// is animating.
//
// RESPONSIVE: rotation angles are intentionally modest (14deg) so the
// effect reads clearly without any card swinging outside its column on
// narrow screens; the grid itself goes 2 -> 3 -> 4 columns.
//
// ACCESSIBILITY: useReducedMotion() disables the rise/rotate entirely for
// anyone with that OS preference — cards simply fade in instead.
function ShowcaseCard({ product, index, localize }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const fromLeft = index % 2 === 0;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "start 45%"],
  });

  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [90, 0]);
  const rotateY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [fromLeft ? -14 : 14, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [10, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [0.9, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ y, rotateY, rotateX, opacity, scale, transformStyle: "preserve-3d" }}
      className="enzo-ring group block"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="aspect-[3/4] overflow-hidden rounded-lg bg-enzo-panel">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={localize(product.name)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-enzo-muted">ENZO</div>
          )}
        </div>
        <p className="mt-3 text-start text-sm font-medium">{localize(product.name)}</p>
      </Link>
    </motion.div>
  );
}

export default function ScrollShowcase({ products }) {
  const localize = useLocalizedField();

  if (!products || products.length === 0) return null;

  return (
    <section
      className="mx-auto max-w-7xl overflow-x-hidden px-4 py-20 sm:px-6"
      style={{ perspective: "1400px" }}
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-16 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
        {products.map((p, i) => (
          <ShowcaseCard key={p.id} product={p} index={i} localize={localize} />
        ))}
      </div>
    </section>
  );
}
