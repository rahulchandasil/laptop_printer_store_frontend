import { ArrowRight, ShoppingBag } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

function CTASection({ onBrowse }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-16 text-center shadow-2xl sm:px-12 sm:py-20 lg:px-16"
      >
        {/* Background Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-slate-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0,transparent_100%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 shadow-inner backdrop-blur-md">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to upgrade your tech?
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Join thousands of satisfied customers who trust us for their premium laptops and printing needs. Start browsing our collection today.
          </p>
          
          <div className="mt-10 flex items-center justify-center">
            <button
              type="button"
              onClick={onBrowse}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-slate-950 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Start Shopping
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default CTASection;
