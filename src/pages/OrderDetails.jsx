import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle, MapPin, Package, CreditCard, ChevronLeft, Check, Circle, XCircle, RotateCcw } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useCart } from "../context/useCart";

function OrderDetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-8 w-48 rounded bg-slate-200"></div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-40 rounded-3xl bg-slate-200"></div>
          <div className="h-64 rounded-3xl bg-slate-200"></div>
        </div>
        <div className="space-y-6">
          <div className="h-72 rounded-3xl bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
}

function OrderTimeline({ status }) {
  const normalizedStatus = status?.toLowerCase() || "pending";
  const isCancelled = normalizedStatus === "cancelled";
  
  const steps = isCancelled 
    ? [
        { key: "pending", label: "Ordered" },
        { key: "confirmed", label: "Confirmed" },
        { key: "cancelled", label: "Cancelled" }
      ]
    : [
        { key: "pending", label: "Ordered" },
        { key: "confirmed", label: "Confirmed" },
        { key: "processing", label: "Processing" },
        { key: "shipped", label: "Shipped" },
        { key: "delivered", label: "Delivered" }
      ];

  let currentIndex = 0;
  if (isCancelled) {
    currentIndex = 2; // Always end at cancelled if it's cancelled
  } else {
    const foundIndex = steps.findIndex(s => s.key === normalizedStatus);
    if (foundIndex !== -1) {
      currentIndex = foundIndex;
    }
  }

  return (
    <div className="mt-8 mb-4 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h3 className="mb-8 font-semibold text-slate-900">Order Tracking</h3>
      
      {/* Desktop & Tablet Timeline (Horizontal) */}
      <div className="hidden sm:block relative">
        <div className="absolute top-4 left-0 h-0.5 w-full bg-slate-100" />
        <div 
          className="absolute top-4 left-0 h-0.5 bg-slate-900 transition-all duration-500" 
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />
        
        <div className="relative flex justify-between">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isActive = idx === currentIndex;
            const isFuture = idx > currentIndex;
            const isCancelStep = step.key === "cancelled";
            
            return (
              <div key={step.key} className="flex flex-col items-center">
                <div className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white transition-colors
                  ${isCompleted ? 'border-slate-900 bg-slate-900 text-white' : ''}
                  ${isActive && !isCancelStep ? 'border-slate-900 text-slate-900' : ''}
                  ${isActive && isCancelStep ? 'border-red-500 bg-red-500 text-white' : ''}
                  ${isFuture ? 'border-slate-200 text-slate-300' : ''}
                `}>
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : isActive && isCancelStep ? (
                    <XCircle className="h-5 w-5" />
                  ) : isActive ? (
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-900" />
                  ) : (
                    <Circle className="h-2.5 w-2.5" />
                  )}
                </div>
                <p className={`mt-3 text-sm font-medium
                  ${(isCompleted || isActive) && !isCancelStep ? 'text-slate-900' : ''}
                  ${isActive && isCancelStep ? 'text-red-600' : ''}
                  ${isFuture ? 'text-slate-400' : ''}
                `}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Timeline (Vertical) */}
      <div className="sm:hidden relative pl-4 space-y-6">
        <div className="absolute top-4 bottom-4 left-7 w-0.5 bg-slate-100" />
        
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isActive = idx === currentIndex;
          const isFuture = idx > currentIndex;
          const isCancelStep = step.key === "cancelled";
          
          return (
            <div key={step.key} className="relative flex items-center gap-4">
              <div className={`z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 bg-white
                ${isCompleted ? 'border-slate-900 bg-slate-900 text-white' : ''}
                ${isActive && !isCancelStep ? 'border-slate-900 text-slate-900' : ''}
                ${isActive && isCancelStep ? 'border-red-500 bg-red-500 text-white' : ''}
                ${isFuture ? 'border-slate-200 text-slate-300' : ''}
              `}>
                {isCompleted ? (
                  <Check className="h-3 w-3" />
                ) : isActive && isCancelStep ? (
                  <XCircle className="h-4 w-4" />
                ) : isActive ? (
                  <div className="h-2 w-2 rounded-full bg-slate-900" />
                ) : (
                  <Circle className="h-2 w-2" />
                )}
              </div>
              <p className={`text-sm font-medium
                ${(isCompleted || isActive) && !isCancelStep ? 'text-slate-900' : ''}
                ${isActive && isCancelStep ? 'text-red-600' : ''}
                ${isFuture ? 'text-slate-400' : ''}
              `}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reordering, setReordering] = useState(false);
  const { fetchCart } = useCart();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/orders/${orderId}`);
        if (response.data.success) {
          setOrder(response.data.order);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleOrderAgain = async () => {
    if (!order || !order.items) return;
    try {
      setReordering(true);
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        navigate("/login");
        return;
      }
      const user = JSON.parse(userStr);

      // Filter out items that are deleted from DB (productId is null)
      const availableItems = order.items.filter(item => item.productId !== null);
      
      if (availableItems.length === 0) {
        alert("Sorry, none of the products in this order are available anymore.");
        setReordering(false);
        return;
      }

      // Add to cart sequentially to prevent race conditions on cart.save()
      for (const item of availableItems) {
        await api.post(`/cart/${user.id}`, {
          productId: item.productId._id || item.productId,
          quantity: item.quantity
        });
      }

      // Refresh cart context
      if (fetchCart) {
        await fetchCart();
      }
      
      navigate("/cart");
    } catch (err) {
      alert("Failed to add some items to your cart. Please try again.");
      console.error("Order again error:", err);
    } finally {
      setReordering(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-800 ring-green-600/20";
      case "cancelled": return "bg-red-100 text-red-800 ring-red-600/20";
      case "shipped": return "bg-blue-100 text-blue-800 ring-blue-600/20";
      case "processing":
      case "confirmed": return "bg-indigo-100 text-indigo-800 ring-indigo-600/20";
      default: return "bg-amber-100 text-amber-800 ring-amber-600/20"; // pending
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <OrderDetailsSkeleton />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navbar />
        <main className="mx-auto flex max-w-5xl flex-col items-center justify-center py-20 px-4 text-center">
          <AlertCircle className="mb-4 h-16 w-16 text-red-400" />
          <h2 className="mb-2 text-2xl font-bold text-slate-900">Oops!</h2>
          <p className="mb-8 text-slate-600">{error}</p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/my-orders")}
              className="rounded-full border border-slate-300 bg-white px-6 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to My Orders
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!order) return null;

  // Calculate actual subtotal from items using purchase-time prices
  let subtotal = 0;
  order.items.forEach(item => {
    const pPrice = item.price || item.productId?.price || 0;
    subtotal += (pPrice * item.quantity);
  });
  
  if (subtotal === 0) subtotal = order.totalPrice;

  const isDelivered = order.status?.toLowerCase() === "delivered";
  
  // Basic mock for payment status - currently backend only has order status
  let paymentStatus = "Pending";
  if (isDelivered) paymentStatus = "Paid";
  if (order.status?.toLowerCase() === "cancelled") paymentStatus = "Failed";

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-slate-200">
      <Navbar />
      
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Header Navigation */}
        <div className="mb-4">
          <Link to="/my-orders" className="mb-4 inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Orders
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                Order #{order._id.substring(order._id.length - 8).toUpperCase()}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-inset ${getStatusColor(order.status)}`}>
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </span>
              
              {isDelivered && (
                <button
                  onClick={handleOrderAgain}
                  disabled={reordering}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-400"
                >
                  <RotateCcw className={`h-4 w-4 ${reordering ? 'animate-spin' : ''}`} />
                  {reordering ? 'Processing...' : 'Order Again'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <OrderTimeline status={order.status} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Items List */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                <h3 className="flex items-center gap-2 font-semibold text-slate-900">
                  <Package className="h-5 w-5 text-slate-500" />
                  Ordered Products
                </h3>
              </div>
              <div className="divide-y divide-slate-100 p-6">
                {order.items.map((item, index) => {
                  const productInfo = item.productId || {};
                  // Use snapshot data from order item if available, fallback to product data, then fallback to unavailable
                  const productName = item.name || productInfo.name || "Product no longer available";
                  const productPrice = item.price || productInfo.price || 0;
                  const productImage = item.image || productInfo.image || "https://placehold.co/400?text=Unavailable";

                  return (
                    <div key={index} className="flex py-6 first:pt-0 last:pb-0 sm:gap-6 gap-4">
                      <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <img 
                          src={productImage} 
                          alt={productName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                          <div>
                            <h4 className="font-semibold text-slate-900">{productName}</h4>
                            <p className="mt-1 text-sm text-slate-500">Price: ₹{productPrice.toLocaleString("en-IN")}</p>
                          </div>
                          <p className="font-bold text-slate-900">
                            ₹{(productPrice * item.quantity).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="mt-auto pt-4">
                          <p className="text-sm font-medium text-slate-600 bg-slate-100 inline-block px-2.5 py-1 rounded-lg">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Order Summary */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                <h3 className="font-semibold text-slate-900">Order Summary</h3>
              </div>
              <div className="p-6">
                <dl className="space-y-4 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd className="font-medium text-slate-900">₹{subtotal.toLocaleString("en-IN")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Shipping</dt>
                    <dd className="font-medium text-green-600">Free</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Discount</dt>
                    <dd className="font-medium text-slate-900">₹0</dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 pb-2">
                    <dt className="text-base font-bold text-slate-900">Total</dt>
                    <dd className="text-2xl font-bold tracking-tight text-slate-950">
                      ₹{order.totalPrice?.toLocaleString("en-IN")}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Delivery & Payment Info */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                <h3 className="font-semibold text-slate-900">Information</h3>
              </div>
              <div className="p-6 space-y-6">
                
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    Delivery Address
                  </h4>
                  <div className="text-sm text-slate-600 ml-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="font-medium text-slate-900">{order.name}</p>
                    <p className="mt-1">{order.address}</p>
                    <p className="mt-2 text-slate-500">Phone: {order.mobile}</p>
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2">
                    <CreditCard className="h-4 w-4 text-slate-400" />
                    Payment Details
                  </h4>
                  <div className="text-sm text-slate-600 ml-6 space-y-2">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Method</span>
                      <span className="font-medium text-slate-900">Cash on Delivery</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-500">Status</span>
                      <span className={`font-medium ${paymentStatus === 'Paid' ? 'text-green-600' : paymentStatus === 'Failed' ? 'text-red-600' : 'text-amber-600'}`}>
                        {paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderDetails;
