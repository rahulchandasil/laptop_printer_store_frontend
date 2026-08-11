import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import api from "../services/api";

function Checkout() {
  const navigate = useNavigate();

  const { cart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Invalid user data in localStorage:", error);
  }

  const items = cart?.items || [];

  const total = items.reduce((sum, item) => {
    return sum + Number(item.productId?.price || 0) * Number(item.quantity);
  }, 0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Your cart is empty");
      navigate("/cart");
      return;
    }

    if (!user?.id) {
      alert("Please login first");
      navigate("/login");
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

      console.log("Order payload:", orderPayload);

      const response = await api.post("/orders", orderPayload);

      if (response.data.success === true) {
        navigate("/order-success");
      }
    } catch (error) {
      console.error("FULL ORDER ERROR:", error);
      console.log("STATUS:", error.response?.status);
      console.log("RESPONSE:", error.response?.data);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to place order",
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Your cart is empty</h1>

            <button
              onClick={() => navigate("/home")}
              className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate("/cart")}
          className="text-blue-600 mb-8"
        >
          ← Back to Cart
        </button>

        <h1 className="text-4xl font-bold text-slate-900">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8 mt-10">
          {/* Customer Information */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-7">
            <h2 className="text-2xl font-bold">Delivery Information</h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="block mb-2 font-medium">Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Mobile Number</label>

                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  required
                  pattern="[0-9]{10}"
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Delivery Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete delivery address"
                  required
                  rows="5"
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-xl font-semibold"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
            <h2 className="text-2xl font-bold">Order Summary</h2>

            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId._id}
                  className="flex justify-between gap-4"
                >
                  <div>
                    <p className="font-medium">{item.productId.name}</p>

                    <p className="text-sm text-slate-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold">
                    ₹
                    {(item.productId.price * item.quantity).toLocaleString(
                      "en-IN",
                    )}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t mt-6 pt-5 flex justify-between">
              <span className="text-lg font-semibold">Total</span>

              <span className="text-2xl font-bold">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Checkout;
