import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trash2, Plus, Minus, ArrowRight, ArrowLeft, 
  ShoppingBag, ShieldCheck, Lock
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useCart } from "../context/useCart";

function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart } = useCart();
  
  // Local state for UI feedback
  const [updatingIds, setUpdatingIds] = useState(new Set());
  const [removingIds, setRemovingIds] = useState(new Set());
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      setIsAuthenticated(!!user);
    };
    checkAuth();
    
    // Listen for changes
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const items = cart?.items || [];
  
  const validItems = items.filter((item) => item?.productId);
  
  const subtotal = validItems.reduce((sum, item) => {
    const price = Number(item?.productId?.price || 0);
    const quantity = Number(item?.quantity || 0);
    return sum + price * quantity;
  }, 0);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingIds(prev => new Set(prev).add(productId));
    try {
      await updateQuantity(productId, newQuantity);
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const handleRemove = async (productId) => {
    setRemovingIds(prev => new Set(prev).add(productId));
    try {
      await removeFromCart(productId);
    } finally {
      setRemovingIds(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navbar />
        <div className="mx-auto flex max-w-xl flex-col items-center justify-center px-4 py-32 text-center">
          <div className="mb-6 rounded-full bg-slate-100 p-6">
            <Lock className="h-12 w-12 text-slate-400" />
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">Sign in to view your cart</h1>
          <p className="mb-8 text-slate-500">
            You need to be signed in to view and manage your saved cart items.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-slate-200 pb-20 md:pb-0">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Shopping Cart
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Review your items before checkout.
            </p>
          </div>
          <Link
            to="/home"
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            Continue Shopping
          </Link>
        </div>

        {validItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-4 py-24 text-center shadow-sm sm:px-6"
          >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50">
              <ShoppingBag className="h-10 w-10 text-slate-300" />
            </div>
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900">Your cart is waiting for something great.</h2>
            <p className="mb-8 max-w-md text-slate-500">
              Explore our premium collection of products and find something you'll absolutely love.
            </p>
            <Link
              to="/home"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 relative pb-28 lg:pb-0">
            {/* LEFT: Cart Items */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="hidden border-b border-slate-200 pb-4 sm:grid sm:grid-cols-12 sm:gap-4">
                <div className="col-span-6 text-sm font-medium text-slate-500">Product</div>
                <div className="col-span-3 text-center text-sm font-medium text-slate-500">Quantity</div>
                <div className="col-span-3 text-right text-sm font-medium text-slate-500">Total</div>
              </div>

              <div className="divide-y divide-slate-100">
                <AnimatePresence mode="popLayout">
                  {validItems.map((item) => {
                    const product = item.productId;
                    const isUpdating = updatingIds.has(product._id);
                    const isRemoving = removingIds.has(product._id);

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        key={product._id}
                        className={`group flex flex-col gap-4 py-6 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4 ${isRemoving ? "pointer-events-none opacity-50" : ""}`}
                      >
                        {/* Product Info */}
                        <div className="flex gap-4 sm:col-span-6">
                          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-28 sm:w-28">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://placehold.co/200x200?text=No+Image";
                              }}
                            />
                          </div>
                          <div className="flex flex-col justify-center">
                            <span className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                              {product.brand}
                            </span>
                            <Link 
                              to={`/product/${product._id}`}
                              className="mb-1 text-base font-semibold leading-tight text-slate-900 transition hover:text-blue-600 line-clamp-2"
                            >
                              {product.name}
                            </Link>
                            <span className="text-sm font-medium text-slate-600">
                              ₹{product.price.toLocaleString("en-IN")}
                            </span>
                            
                            {/* Mobile Remove Button */}
                            <button
                              onClick={() => handleRemove(product._id)}
                              className="mt-3 inline-flex w-fit items-center gap-1.5 text-xs font-medium text-red-500 transition hover:text-red-700 sm:hidden"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center justify-between sm:col-span-3 sm:justify-center">
                          <div className={`flex h-10 w-28 items-center justify-between rounded-full bg-slate-50 px-1 shadow-sm ring-1 ring-slate-200 transition ${isUpdating ? "opacity-50" : ""}`}>
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(product._id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || isUpdating}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-transparent"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold text-slate-900">
                              {isUpdating ? <span className="block h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 mx-auto" /> : item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(product._id, item.quantity + 1)}
                              disabled={item.quantity >= 10 || isUpdating}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-transparent"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          {/* Mobile Total */}
                          <div className="sm:hidden text-right">
                            <span className="block text-xs text-slate-500">Total</span>
                            <span className="font-semibold text-slate-900">
                              ₹{(product.price * item.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>

                        {/* Desktop Total & Remove */}
                        <div className="hidden sm:col-span-3 sm:flex sm:flex-col sm:items-end sm:justify-center gap-2">
                          <span className="text-base font-bold tracking-tight text-slate-900">
                            ₹{(product.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                          <button
                            onClick={() => handleRemove(product._id)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 opacity-0 transition-all hover:text-red-500 group-hover:opacity-100 focus:opacity-100"
                            aria-label={`Remove ${product.name} from cart`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="sticky top-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="p-6 sm:p-8">
                  <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900">Order Summary</h2>
                  
                  <dl className="space-y-4 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <dt>Subtotal ({validItems.length} items)</dt>
                      <dd className="font-medium text-slate-900">₹{subtotal.toLocaleString("en-IN")}</dd>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <dt>Discount</dt>
                      <dd className="font-medium">− ₹0</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Delivery</dt>
                      <dd className="font-medium text-slate-900">Free</dd>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 pb-2">
                      <dt className="text-base font-bold text-slate-900">Total</dt>
                      <dd className="text-2xl font-bold tracking-tight text-slate-950">
                        ₹{subtotal.toLocaleString("en-IN")}
                      </dd>
                    </div>
                  </dl>

                  <button
                    onClick={() => navigate("/checkout")}
                    className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
                
                <div className="bg-slate-50 px-6 py-4 sm:px-8 border-t border-slate-100">
                  <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    Secure Checkout
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Sticky Checkout Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/80 p-4 shadow-[0_-8px_16px_-4px_rgba(0,0,0,0.1)] backdrop-blur-md lg:hidden pb-safe">
              <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Payment</span>
                  <span className="text-xl font-black text-slate-900">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <button
                  onClick={() => navigate("/checkout")}
                  className="flex flex-1 max-w-[200px] items-center justify-center gap-2 rounded-full bg-blue-600 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  Checkout
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;
