import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";

function OrderSuccess() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-slate-200">
      <Navbar />

      <main className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/40 sm:p-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-50"
          >
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </motion.div>

          <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">
            Order Confirmed!
          </h1>

          <p className="mb-10 text-base leading-relaxed text-slate-500">
            Thank you for shopping with us. Your order has been successfully placed and is now being processed for delivery.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/home"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default OrderSuccess;