import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import heroImage from "../../assets/hero.png";

function HomeHero({ onBrowseLaptops, onBrowsePrinters, heroProducts = [] }) {
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!heroProducts || heroProducts.length <= 1) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % heroProducts.length);
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentIndex, heroProducts]);

  const currentProduct = heroProducts && heroProducts.length > 0 ? heroProducts[currentIndex] : null;

  return (
    <section className="relative overflow-hidden bg-slate-50">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2 rounded-full bg-slate-200/50 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
              <Sparkles className="h-3.5 w-3.5" />
              New Collection
            </span>
          </motion.div>

          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="mt-6 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[1.1]"
          >
            Elevate your <br className="hidden lg:block" /> digital workspace.
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.2 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600 sm:text-xl"
          >
            Shop premium laptops and printers from the world's most trusted brands. Experience fast delivery and a seamless checkout process.
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.3 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <button
              onClick={onBrowseLaptops}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              Shop Laptops
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onBrowsePrinters}
              className="inline-flex items-center justify-center rounded-full border-2 border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition-all hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              Shop Printers
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95, y: 20 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="relative lg:ml-auto w-full max-w-lg flex flex-col gap-6"
        >
          {/* Main Hero Image & Details */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50">
            <div className="relative aspect-[4/3] w-full bg-slate-100/50 p-6 sm:p-8">
              {currentProduct ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentProduct._id}
                    initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                    exit={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-6"
                  >
                    <img
                      src={currentProduct.image}
                      alt={currentProduct.name}
                      className="h-48 sm:h-56 w-auto object-contain drop-shadow-xl mb-4"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="flex h-full items-center justify-center text-slate-400">Image Unavailable</div>';
                      }}
                    />
                    
                    <div className="w-full mt-auto rounded-2xl bg-white/90 p-4 shadow-sm backdrop-blur border border-slate-100 text-center">
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                        {currentProduct.brand} • {currentProduct.category}
                      </p>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                        {currentProduct.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 line-clamp-1">
                        {currentProduct.description}
                      </p>
                      <p className="mt-2 text-lg font-black text-slate-900">
                        ₹{currentProduct.price?.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <img
                  src={heroImage}
                  alt="Premium laptop and printer setup"
                  className="h-full w-full object-contain drop-shadow-xl transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="flex h-full items-center justify-center text-slate-400">Hero Image</div>';
                  }}
                />
              )}
            </div>
            
            {/* Progress Indicator */}
            {heroProducts && heroProducts.length > 1 && (
              <div className="absolute top-4 right-4 flex items-center justify-center rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
                {String(currentIndex + 1).padStart(2, '0')} / {String(heroProducts.length).padStart(2, '0')}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HomeHero;
