import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Minus, Plus, ShoppingCart, ChevronRight, 
  ShieldCheck, RotateCcw, Truck, AlertCircle, ArrowLeft 
} from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useCart } from "../context/useCart";

function ProductDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-8 h-4 w-64 animate-pulse rounded bg-slate-200"></div>
      
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="aspect-[4/3] w-full animate-pulse rounded-3xl bg-slate-200 lg:aspect-square"></div>
        
        <div className="flex flex-col pt-4">
          <div className="mb-4 h-4 w-32 animate-pulse rounded bg-slate-200"></div>
          <div className="mb-6 h-10 w-3/4 animate-pulse rounded bg-slate-200"></div>
          
          <div className="mb-8 h-12 w-40 animate-pulse rounded bg-slate-200"></div>
          
          <div className="space-y-3 mb-10">
            <div className="h-4 w-full animate-pulse rounded bg-slate-200"></div>
            <div className="h-4 w-full animate-pulse rounded bg-slate-200"></div>
            <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200"></div>
          </div>
          
          <div className="flex gap-4">
            <div className="h-14 w-32 animate-pulse rounded-full bg-slate-200"></div>
            <div className="h-14 flex-1 animate-pulse rounded-full bg-slate-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.product);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (type) => {
    if (type === "decrement" && quantity > 1) {
      setQuantity(q => q - 1);
    } else if (type === "increment" && quantity < 10) {
      setQuantity(q => q + 1);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await addToCart(product._id, quantity);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navbar />
        <ProductDetailsSkeleton />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navbar />
        <div className="mx-auto flex max-w-xl flex-col items-center justify-center px-4 py-32 text-center">
          <div className="mb-6 rounded-full bg-slate-100 p-6">
            <AlertCircle className="h-12 w-12 text-slate-400" />
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">Product Not Found</h1>
          <p className="mb-8 text-slate-500">
            The product you're looking for may have been removed, or the link might be broken.
          </p>
          <button
            onClick={() => navigate("/home")}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-slate-200">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 hidden sm:block">
          <ol className="flex items-center gap-2 text-sm text-slate-500">
            <li>
              <Link to="/home" className="transition hover:text-slate-900">Home</Link>
            </li>
            <li><ChevronRight className="h-4 w-4" /></li>
            <li>
              <Link to={`/products/${product.category}/${product.brand}`} className="transition hover:text-slate-900 capitalize">
                {product.category}
              </Link>
            </li>
            <li><ChevronRight className="h-4 w-4" /></li>
            <li>
              <Link to={`/products/${product.category}/${product.brand}`} className="transition hover:text-slate-900 capitalize">
                {product.brand}
              </Link>
            </li>
            <li><ChevronRight className="h-4 w-4" /></li>
            <li className="font-medium text-slate-900" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Mobile Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 sm:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* LEFT: Image Gallery */}
          <section className="flex flex-col gap-4">
            <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 lg:aspect-square">
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute left-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-900 backdrop-blur ring-1 ring-slate-200">
                {product.brand}
              </div>
            </div>
          </section>

          {/* RIGHT: Product Info */}
          <section className="flex flex-col lg:py-6">
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                {product.category}
              </span>
            </div>

            <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl lg:leading-tight">
              {product.name}
            </h1>

            <div className="mb-8 flex items-end gap-3">
              <span className="text-4xl font-bold tracking-tight text-slate-900">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="mb-8 border-y border-slate-200 py-6">
              <p className="text-base leading-relaxed text-slate-600">
                {product.description}
              </p>
            </div>

            {/* Quantity and CTA */}
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-14 w-32 items-center justify-between rounded-full bg-slate-100 px-1 shadow-sm ring-1 ring-slate-200">
                <button
                  type="button"
                  onClick={() => handleQuantityChange("decrement")}
                  disabled={quantity <= 1}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-slate-900"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange("increment")}
                  disabled={quantity >= 10}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-slate-900"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="group relative flex h-14 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-slate-950 px-8 text-sm font-semibold text-white transition-all hover:bg-slate-800 disabled:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <AnimatePresence mode="wait">
                  {addingToCart ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                      Adding...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="h-5 w-5 transition-transform group-hover:-rotate-12" />
                      Add to Cart
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center ring-1 ring-slate-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                  <ShieldCheck className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">Secure Payment</h4>
                  <p className="mt-0.5 text-[10px] text-slate-500">100% protected</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center ring-1 ring-slate-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                  <Truck className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">Fast Delivery</h4>
                  <p className="mt-0.5 text-[10px] text-slate-500">2-3 working days</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center ring-1 ring-slate-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                  <RotateCcw className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">Easy Returns</h4>
                  <p className="mt-0.5 text-[10px] text-slate-500">30 days policy</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default ProductDetails;
