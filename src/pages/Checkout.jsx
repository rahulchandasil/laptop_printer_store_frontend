import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronRight, Lock, User, Phone, MapPin, 
  CreditCard, ShieldCheck, AlertCircle, ShoppingBag 
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useCart } from "../context/useCart";
import api from "../services/api";

function CheckoutSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-7 xl:col-span-8 space-y-8">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200"></div>
        <div className="space-y-4">
          <div className="h-64 w-full animate-pulse rounded-2xl bg-slate-200"></div>
        </div>
      </div>
      <div className="lg:col-span-5 xl:col-span-4">
        <div className="h-96 w-full animate-pulse rounded-3xl bg-slate-200"></div>
      </div>
    </div>
  );
}

function Checkout() {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState(null);
  
  // Page load ready state
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkAuthAndData = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (e) {
        setIsAuthenticated(false);
      }
      setIsReady(true);
    };
    checkAuthAndData();
  }, []);

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => {
    return sum + Number(item.productId?.price || 0) * Number(item.quantity);
  }, 0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user types
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!user?.id) {
      setError("Please login first to place an order.");
      return;
    }

    // Basic extra validation (HTML5 covers most, but just in case)
    if (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);

      const orderItems = items.map((item) => ({
        productId: item.productId?._id || item.productId,
        quantity: Number(item.quantity),
      }));

      const orderPayload = {
        userId: user.id,
        items: orderItems,
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        address: formData.address.trim(),
        totalPrice: Number(total),
      };

      const response = await api.post("/orders", orderPayload);

      if (response.data.success === true) {
        // Refresh cart in context (usually backend clears it on order success, if not we should at least fetch)
        fetchCart && fetchCart();
        navigate("/order-success");
      } else {
        setError(response.data.message || "Failed to place order. Please try again.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "We couldn't place your order. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <CheckoutSkeleton />
        </main>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navbar />
        <div className="mx-auto flex max-w-xl flex-col items-center justify-center px-4 py-32 text-center">
          <div className="mb-6 rounded-full bg-slate-100 p-6">
            <Lock className="h-12 w-12 text-slate-400" />
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">Sign in to checkout</h1>
          <p className="mb-8 text-slate-500">
            Please log in to your account to complete your purchase securely.
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navbar />
        <main className="mx-auto flex max-w-xl flex-col items-center justify-center px-4 py-32 text-center">
          <div className="mb-6 rounded-full bg-slate-100 p-6">
            <ShoppingBag className="h-12 w-12 text-slate-300" />
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">Your cart is empty</h1>
          <p className="mb-8 text-slate-500">
            You need to add at least one item to your cart before proceeding to checkout.
          </p>
          <button
            onClick={() => navigate("/home")}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Continue Shopping
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-slate-200 pb-20 md:pb-0">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Header & Breadcrumbs */}
        <div className="mb-8 flex flex-col gap-4">
          <nav aria-label="Breadcrumb" className="hidden sm:block">
            <ol className="flex items-center gap-2 text-sm text-slate-500">
              <li>
                <Link to="/cart" className="transition hover:text-slate-900">Cart</Link>
              </li>
              <li><ChevronRight className="h-4 w-4" /></li>
              <li className="font-medium text-slate-900" aria-current="page">Checkout</li>
            </ol>
          </nav>
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Checkout
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Complete your order securely.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-16">
          
          {/* LEFT: Checkout Form */}
          <div className="lg:col-span-7 xl:col-span-7">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              
              {/* Error Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="overflow-hidden rounded-2xl bg-red-50 ring-1 ring-red-200"
                  >
                    <div className="flex items-start gap-3 p-4">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                      <div>
                        <h3 className="text-sm font-semibold text-red-800">Couldn't place order</h3>
                        <p className="mt-1 text-sm text-red-600">{error}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Delivery Information Section */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                    <span className="text-sm">1</span>
                  </div>
                  Delivery Information
                </h2>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        required
                        autoComplete="name"
                        className="block w-full rounded-xl border-0 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none ring-1 ring-inset ring-slate-200 transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="mobile" className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Phone className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        required
                        pattern="[0-9]{10}"
                        autoComplete="tel"
                        className="block w-full rounded-xl border-0 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none ring-1 ring-inset ring-slate-200 transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-slate-900"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500">We'll use this for delivery updates.</p>
                  </div>

                  <div>
                    <label htmlFor="address" className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Delivery Address
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute left-0 top-3.5 flex items-center pl-4">
                        <MapPin className="h-5 w-5 text-slate-400" />
                      </div>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="House/Flat No., Building Name, Street, City, State, PIN Code"
                        required
                        rows="4"
                        autoComplete="street-address"
                        className="block w-full resize-none rounded-xl border-0 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none ring-1 ring-inset ring-slate-200 transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Section (Visual only, as backend doesn't take payment types yet) */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                    <span className="text-sm">2</span>
                  </div>
                  Payment
                </h2>
                
                <div className="relative flex cursor-pointer rounded-2xl border-2 border-slate-900 bg-slate-50 p-4">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-6 w-6 text-slate-900" />
                      <div>
                        <p className="font-semibold text-slate-900">Cash on Delivery</p>
                        <p className="text-xs text-slate-500">Pay when your order arrives</p>
                      </div>
                    </div>
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-4 border-slate-900"></div>
                  </div>
                </div>
              </div>

              {/* Mobile CTA (shown at bottom) */}
              <div className="lg:hidden">
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={loading}
                  className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-slate-950 py-4 text-sm font-semibold text-white transition-all hover:bg-slate-800 disabled:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                      Placing Order...
                    </>
                  ) : (
                    <>
                      Place Order
                      <ShieldCheck className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-5 xl:col-span-5">
            <div className="sticky top-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-slate-50 px-6 py-5 sm:px-8 border-b border-slate-100">
                <h2 className="text-lg font-bold tracking-tight text-slate-900">Your Order</h2>
              </div>
              
              <div className="p-6 sm:p-8">
                {/* Product List */}
                <div className="mb-6 space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.productId._id} className="flex items-start gap-4">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        <img 
                          src={item.productId.image} 
                          alt={item.productId.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-center py-1">
                        <p className="text-sm font-semibold text-slate-900 line-clamp-1">{item.productId.name}</p>
                        <p className="mt-1 text-xs text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="py-1 text-right">
                        <p className="text-sm font-bold text-slate-900">
                          ₹{(item.productId.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Summary */}
                <dl className="space-y-3 text-sm text-slate-600 border-t border-slate-100 pt-6">
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd className="font-medium text-slate-900">₹{total.toLocaleString("en-IN")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Delivery</dt>
                    <dd className="font-medium text-slate-900">Free</dd>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 pb-2">
                    <dt className="text-base font-bold text-slate-900">Total</dt>
                    <dd className="text-2xl font-bold tracking-tight text-slate-950">
                      ₹{total.toLocaleString("en-IN")}
                    </dd>
                  </div>
                </dl>

                {/* Desktop CTA */}
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={loading}
                  className="group mt-8 hidden w-full items-center justify-center gap-2 rounded-full bg-slate-950 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 lg:flex"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                      Placing Order...
                    </>
                  ) : (
                    <>
                      Place Order
                      <ShieldCheck className="h-4 w-4 transition-transform group-hover:scale-110" />
                    </>
                  )}
                </button>
                
                <p className="mt-4 text-center text-xs text-slate-500 hidden lg:block">
                  By placing your order, you agree to our Terms of Service.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Checkout;
