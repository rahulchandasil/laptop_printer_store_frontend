import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, ChevronRight, AlertCircle, ShoppingBag } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function OrderSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-slate-200"></div>
          <div className="h-3 w-24 rounded bg-slate-200"></div>
        </div>
        <div className="h-6 w-20 rounded-full bg-slate-200"></div>
      </div>
      <div className="flex gap-4">
        <div className="h-20 w-20 shrink-0 rounded-xl bg-slate-200"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 w-1/2 rounded bg-slate-200"></div>
          <div className="h-3 w-1/4 rounded bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
}

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/orders/my-orders");
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (err) {
      setError("Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-slate-200">
      <Navbar />
      
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            My Orders
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            View your purchases from the last 6 months.
          </p>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
            <h3 className="mb-2 text-lg font-semibold text-red-800">{error}</h3>
            <button
              onClick={fetchOrders}
              className="mt-4 rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="space-y-4">
            <OrderSkeleton />
            <OrderSkeleton />
            <OrderSkeleton />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mb-6 rounded-full bg-slate-100 p-6">
              <Package className="h-12 w-12 text-slate-300" />
            </div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">
              No orders in the last 6 months
            </h2>
            <p className="mb-8 text-slate-500">
              Your recent purchases will appear here.
            </p>
            <button
              onClick={() => navigate("/home")}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                <div className="flex flex-col border-b border-slate-100 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                  <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Order ID</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900 truncate">#{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Date placed</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total amount</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">₹{order.totalPrice?.toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Payment Status</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">Cash on Delivery</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:px-8">
                  <div className="mb-4 flex items-center justify-between">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(order.status)}`}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </span>
                    <Link
                      to={`/my-orders/${order._id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {order.items.map((item, index) => {
                      const productInfo = item.productId || {};
                      const productName = productInfo.name || item.name || "Product no longer available";
                      const productPrice = item.price || productInfo.price || 0;
                      const productImage = productInfo.image || item.image || "https://placehold.co/400?text=Unavailable";

                      return (
                        <div key={index} className="flex items-center gap-4">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                            <img 
                              src={productImage} 
                              alt={productName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">{productName}</h4>
                            <p className="mt-1 text-sm text-slate-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right font-medium text-slate-900">
                            ₹{(productPrice * item.quantity).toLocaleString("en-IN")}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyOrders;
