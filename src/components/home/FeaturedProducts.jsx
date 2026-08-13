import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useCart } from "../../context/useCart";
import ProductCard from "../products/ProductCard";

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-slate-100" />
      <div className="p-5">
        <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
        <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-slate-100" />
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="mt-6 flex items-end justify-between">
          <div>
            <div className="mb-1 h-3 w-8 animate-pulse rounded bg-slate-100" />
            <div className="h-6 w-20 animate-pulse rounded bg-slate-100" />
          </div>
          <div className="h-10 w-24 animate-pulse rounded-full bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

function FeaturedProducts({ products = [], loading = false }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [addingToCart, setAddingToCart] = useState(null);

  const handleAddToCart = async (productId) => {
    try {
      setAddingToCart(productId);
      await addToCart(productId);
    } finally {
      setAddingToCart(null);
    }
  };

  // If we have no products and aren't loading, don't show the section.
  if (!loading && products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end md:mb-12">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
            <Sparkles className="h-3.5 w-3.5" />
            Trending Now
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Featured Products
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Discover some of our most popular and highly-rated technology products.
          </p>
        </div>
        
        <button
          onClick={() => navigate("/brands/laptop")}
          className="group hidden items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 sm:flex"
        >
          View All Products
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
          : products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  adding={addingToCart === product._id}
                  onAddToCart={() => handleAddToCart(product._id)}
                  onViewDetails={() => navigate(`/product/${product._id}`)}
                />
              </motion.div>
            ))}
      </div>
      
      <div className="mt-8 flex sm:hidden">
        <button
          onClick={() => navigate("/brands/laptop")}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
        >
          View All Products
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

export default FeaturedProducts;
