import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Minus, Plus, ShoppingCart, ChevronRight, 
  ShieldCheck, RotateCcw, Truck, AlertCircle, ArrowLeft, Check,
  Cpu, HardDrive, Monitor, Palette, Box, Activity, Printer, Wifi, Maximize, Scan 
} from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useCart } from "../context/useCart";
import ProductCard from "../components/products/ProductCard";

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
  return Box;
};

const formatLabel = (key) => {
  const result = key.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

function ProductSpecifications({ product }) {
  const specsObject = product?.specifications || {};
  const specsEntries = Object.entries(specsObject).filter(([k, v]) => v !== undefined && v !== null && v !== "" && v !== "N/A");

  if (specsEntries.length === 0) return null;

  return (
    <div className="mb-10">
      <h3 className="mb-6 text-xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-3">Technical Specifications</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        {specsEntries.map(([key, value]) => {
          const Icon = getIconForKey(key);
          return (
            <div key={key} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                <Icon className="h-5 w-5 text-slate-500" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{formatLabel(key)}</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const [justAdded, setJustAdded] = useState(false);
  const prevAddingRef = useRef(addingToCart);
  
  const [addingRelated, setAddingRelated] = useState(null);

  useEffect(() => {
    if (prevAddingRef.current === true && addingToCart === false) {
      setJustAdded(true);
      const timer = setTimeout(() => setJustAdded(false), 2000);
      return () => clearTimeout(timer);
    }
    prevAddingRef.current = addingToCart;
  }, [addingToCart]);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await api.get(`/products/${id}`);
        const fetchedProduct = response.data.product;
        setProduct(fetchedProduct);
        setCurrentImageIndex(0);
        setQuantity(1);

        // Fetch related products
        const relatedRes = await api.get(`/products?category=${fetchedProduct.category}`);
        const filtered = relatedRes.data.products.filter(p => p._id !== fetchedProduct._id).slice(0, 4);
        setRelatedProducts(filtered);

      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductAndRelated();
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
  
  const handleAddRelatedToCart = async (e, productId) => {
    e.stopPropagation();
    try {
      setAddingRelated(productId);
      await addToCart(productId, 1);
    } finally {
      setAddingRelated(null);
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

  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [product.image];

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const savings = hasDiscount ? product.originalPrice - product.price : 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-slate-200">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* Mobile Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 lg:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Desktop Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 hidden lg:block">
          <ol className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <li><Link to="/home" className="transition hover:text-slate-900">Home</Link></li>
            <li><ChevronRight className="h-4 w-4" /></li>
            <li>
              <Link to={`/brands/${product.category}`} className="transition hover:text-slate-900 capitalize">
                {product.category}
              </Link>
            </li>
            <li><ChevronRight className="h-4 w-4" /></li>
            <li>
              <span className="text-slate-900 capitalize">
                {product.brand}
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* LEFT: Image Gallery */}
          <section className="flex flex-col gap-4">
            <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 lg:aspect-square flex items-center justify-center p-8">
              {product.isNewLaunch && (
                <div className="absolute left-6 top-6 z-10 inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                  ★ NEW
                </div>
              )}
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={images[currentImageIndex]}
                  alt={product.name}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/800x800?text=No+Image";
                  }}
                />
              </AnimatePresence>
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4 sm:grid-cols-5">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative aspect-square overflow-hidden rounded-2xl bg-white ring-1 transition-all ${
                      currentImageIndex === idx 
                        ? "ring-2 ring-slate-900 shadow-md" 
                        : "ring-slate-200 hover:ring-slate-400 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${idx + 1}`} 
                      className="h-full w-full object-contain p-2"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/200x200?text=No+Image";
                      }} 
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* RIGHT: Product Info */}
          <section className="flex flex-col">
            <div className="mb-3 flex items-center justify-between">
              <span className="inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-800">
                {product.brand}
              </span>
            </div>

            <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              {product.name}
            </h1>

            {/* Ratings */}
            {product.rating && (
              <div className="mb-6 flex items-center gap-2">
                <div className="flex items-center text-slate-900">
                  <span className="text-lg">★</span>
                </div>
                <span className="font-bold text-slate-700">{product.rating}</span>
                {product.reviewCount && (
                  <span className="text-sm font-medium text-slate-500">
                    ({product.reviewCount} Reviews)
                  </span>
                )}
              </div>
            )}

            {/* Pricing */}
            <div className="mb-6 flex flex-col items-start gap-1 pb-6 border-b border-slate-200">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black tracking-tight text-slate-900">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
                {hasDiscount && (
                  <span className="mb-1 text-lg font-medium text-slate-400 line-through">
                    ₹{Number(product.originalPrice).toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-slate-500">Inclusive of all taxes.</p>
              {hasDiscount && (
                <div className="mt-2 inline-flex items-center rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  Save ₹{Number(savings).toLocaleString("en-IN")}
                </div>
              )}
            </div>

            {/* Actions: Quantity & Cart */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-14 w-32 shrink-0 items-center justify-between rounded-2xl bg-white px-1 ring-1 ring-slate-200 shadow-sm">
                <button
                  type="button"
                  onClick={() => handleQuantityChange("decrement")}
                  disabled={quantity <= 1}
                  className="flex h-12 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-transparent focus:outline-none"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange("increment")}
                  disabled={quantity >= 10}
                  className="flex h-12 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-transparent focus:outline-none"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-1 gap-4">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={addingToCart || justAdded}
                  className="group flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-8 text-sm font-bold text-white shadow-md transition hover:bg-slate-800 disabled:bg-slate-800 disabled:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                >
                  {addingToCart ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  ) : justAdded ? (
                    <>
                      <Check className="h-5 w-5" /> Added
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h3 className="mb-4 text-xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-3">About this item</h3>
              <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-600">
                {product.description}
              </p>
            </div>

            {/* Product Specifications */}
            <ProductSpecifications product={product} />

            {/* Trust Badges & Delivery */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
              <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-700">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Secure Payment</h4>
                  <p className="text-xs font-medium text-slate-500">100% protected</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-700">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Fast Delivery</h4>
                  <p className="text-xs font-medium text-slate-500">Usually 2-3 days</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-slate-200">
            <h2 className="mb-8 text-2xl font-bold tracking-tight text-slate-900">You Might Also Like</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map(related => (
                <ProductCard
                  key={related._id}
                  product={related}
                  onViewDetails={() => navigate(`/product/${related._id}`)}
                  onAddToCart={(id) => handleAddRelatedToCart(window.event, id)}
                  adding={addingRelated === related._id}
                />
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default ProductDetails;
