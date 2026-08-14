import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/useCart";

export default function QuickViewModal({ product, isOpen, onClose }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // prevent background scroll
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!product) return null;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (isAdding) return;
    setIsAdding(true);
    await addToCart(product._id, 1);
    setIsAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleViewDetails = () => {
    onClose();
    navigate(`/product/${product._id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
            className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-500 backdrop-blur transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="relative flex min-h-[300px] w-full items-center justify-center bg-slate-50 p-8 md:w-1/2">
                <img
                  src={product.image || "https://placehold.co/600x600?text=No+Image"}
                  alt={product.name}
                  className="max-h-[400px] object-contain drop-shadow-xl"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/600x600?text=No+Image";
                  }}
                />
              </div>

              <div className="flex w-full flex-col justify-center p-8 md:w-1/2">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-700">
                    {product.brand}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-700">
                    {product.category}
                  </span>
                </div>

                <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {product.name}
                </h2>
                
                <p className="mb-6 text-2xl font-black text-slate-900">
                  ₹{product.price?.toLocaleString("en-IN")}
                </p>

                <div className="mb-8 space-y-4 text-sm text-slate-600">
                  <p className="line-clamp-3 leading-relaxed">{product.description}</p>
                </div>

                <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding || added}
                    className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:bg-slate-800 disabled:opacity-80"
                  >
                    {isAdding ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    ) : added ? (
                      <>
                        <Check className="h-4 w-4" /> Added
                      </>
                    ) : (
                      "Add to Cart"
                    )}
                  </button>
                  <button
                    onClick={handleViewDetails}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 sm:w-auto"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
