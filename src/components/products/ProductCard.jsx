import { useState } from "react";
import { ArrowRight, ShoppingCart, Heart, ChevronLeft, ChevronRight, Cpu, HardDrive, Monitor, Palette, Box, Activity, Printer, Wifi, Maximize, Scan } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const getIconForKey = (key) => {
  const k = key.toLowerCase();
  if (k.includes("processor") || k.includes("cpu")) return Cpu;
  if (k.includes("system") || k.includes("os")) return Box;
  if (k.includes("graphic") || k.includes("gpu")) return Activity;
  if (k.includes("memory") || k.includes("ram")) return HardDrive;
  if (k.includes("storage") || k.includes("ssd") || k.includes("hdd")) return HardDrive;
  if (k.includes("display") || k.includes("screen") || k.includes("resolution")) return Monitor;
  if (k.includes("color")) return Palette;
  if (k.includes("print") || k.includes("printer")) return Printer;
  if (k.includes("connect") || k.includes("wifi") || k.includes("network")) return Wifi;
  if (k.includes("paper") || k.includes("size")) return Maximize;
  if (k.includes("scan")) return Scan;
  if (k.includes("duplex")) return Box;
  return Box; // fallback icon
};

const formatLabel = (key) => {
  const result = key.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

function ProductSpecifications({ product }) {
  const [expanded, setExpanded] = useState(false);

  const specsObject = product?.specifications || {};
  const specsEntries = Object.entries(specsObject).filter(([k, v]) => v !== undefined && v !== null && v !== "" && v !== "N/A");

  if (specsEntries.length === 0) return null;

  const displaySpecs = expanded ? specsEntries : specsEntries.slice(0, 4);
  const hasMore = specsEntries.length > 4;

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      <ul className="space-y-3">
        {displaySpecs.map(([key, value]) => {
          const Icon = getIconForKey(key);
          return (
            <li key={key} className="flex items-start gap-3 text-sm">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <div>
                <p className="font-medium text-slate-500">{formatLabel(key)}</p>
                <p className="font-semibold text-slate-900">{value}</p>
              </div>
            </li>
          );
        })}
      </ul>
      {hasMore && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700 focus:outline-none"
        >
          {expanded ? "− View Less" : "+ View More"}
        </button>
      )}
    </div>
  );
}

function ProductCard({ product, onAddToCart, onViewDetails, adding }) {
  const shouldReduceMotion = useReducedMotion();
  const [imageFailed, setImageFailed] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [product.image];

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const savings = hasDiscount ? product.originalPrice - product.price : 0;
  const discountPercent = hasDiscount ? Math.round((savings / product.originalPrice) * 100) : 0;

  return (
    <motion.article
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md h-full"
    >
      <div 
        onClick={onViewDetails}
        className="relative block cursor-pointer bg-white pt-4 px-4"
      >
        {/* Badges */}
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
          {product.isNewLaunch && (
            <span className="inline-flex items-center gap-1 rounded bg-slate-900 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              ★ NEW LAUNCH
            </span>
          )}
          {!product.isNewLaunch && hasDiscount && (
            <span className="inline-flex items-center rounded bg-red-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-red-700">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={toggleWishlist}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-400 shadow-sm backdrop-blur transition hover:bg-white hover:text-red-500"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        {/* Image Gallery */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
          {!imageFailed ? (
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                src={images[currentImageIndex]}
                alt={product.name}
                loading="lazy"
                onError={() => setImageFailed(true)}
                className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              />
            </AnimatePresence>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm text-slate-400">
              Image unavailable
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-slate-600 shadow-sm backdrop-blur transition hover:bg-white hover:text-slate-900 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-slate-600 shadow-sm backdrop-blur transition hover:bg-white hover:text-slate-900 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div 
          onClick={onViewDetails}
          className="cursor-pointer mb-2"
        >
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Ratings */}
        {product.rating && (
          <div className="mb-3 flex items-center gap-1.5">
            <div className="flex items-center text-amber-400">
              {/* Simple star render based on rating */}
              <span className="text-sm">★</span>
            </div>
            <span className="text-sm font-bold text-slate-700">{product.rating}</span>
            {product.reviewCount && (
              <span className="text-xs text-slate-500">({product.reviewCount} Ratings)</span>
            )}
          </div>
        )}

        {/* Pricing */}
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <span className="text-sm text-slate-500 line-through">
                ₹{Number(product.originalPrice).toLocaleString("en-IN")}
              </span>
            )}
          </div>
          
          {hasDiscount && (
            <p className="mt-0.5 text-xs font-semibold text-green-600">
              Save ₹{Number(savings).toLocaleString("en-IN")}
            </p>
          )}
          <p className="mt-1 text-[11px] text-slate-500">Inclusive of all taxes.</p>
        </div>

        {/* Delivery */}
        <div className="mt-3 rounded bg-slate-50 p-2">
          <p className="text-xs font-medium text-slate-700">Estimated Delivery</p>
          <p className="text-[11px] text-slate-500">Typically delivers in 3-5 business days</p>
        </div>

        {/* Dynamic Specifications */}
        <ProductSpecifications product={product} />

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={onAddToCart}
          disabled={adding}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          {adding ? (
            "Adding..."
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
}

export default ProductCard;
