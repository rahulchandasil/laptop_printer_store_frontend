import { ArrowRight, ShoppingCart } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

function ProductCard({ product, onAddToCart, onViewDetails, adding }) {
  const shouldReduceMotion = useReducedMotion();
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <motion.article
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-shadow hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
    >
      <button
        type="button"
        onClick={onViewDetails}
        className="block w-full text-left focus:outline-none"
        aria-label={`View details for ${product.name}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {!imageFailed ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 px-6 text-center text-sm text-slate-500">
              Product image unavailable
            </div>
          )}

          <div className="absolute left-4 top-4 inline-flex rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700 backdrop-blur">
            {product.brand}
          </div>
        </div>
      </button>

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {product.category}
            </p>
            <h3 className="mt-2 line-clamp-2 text-lg font-semibold tracking-tight text-slate-950">
              {product.name}
            </h3>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
          {product.description}
        </p>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">Price</p>
            <p className="text-2xl font-semibold tracking-tight text-slate-950">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>
          </div>

          <button
            type="button"
            onClick={onAddToCart}
            disabled={adding}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            {adding ? (
              "Adding..."
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add
              </>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={onViewDetails}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          View details
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.article>
  );
}

export default ProductCard;
