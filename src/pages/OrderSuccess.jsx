import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function OrderSuccess() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-lg p-10 max-w-lg w-full text-center">

          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center text-4xl">
            ✓
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mt-6">
            Order Placed Successfully!
          </h1>

          <p className="text-slate-500 mt-4">
            Thank you for your order. Your order has been
            successfully placed.
          </p>

          <Link
            to="/home"
            className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;