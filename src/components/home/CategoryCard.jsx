import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

function CategoryCard({ title, description, image, accent = "blue", onClick, actionLabel }) {
  const shouldReduceMotion = useReducedMotion();

  const accentMap = {
    blue: "from-blue-600/10 via-blue-600/5 to-transparent text-blue-700 border-blue-200",
    slate: "from-slate-900/10 via-slate-900/5 to-transparent text-slate-900 border-slate-200",
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      className="group text-left w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-shadow hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
    >
      <div className={`relative h-56 bg-gradient-to-br ${accentMap[accent] || accentMap.blue}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.85),transparent_55%)]" />
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-contain p-8 transition duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-950">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {description}
            </p>
          </div>

          <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition group-hover:border-blue-300 group-hover:text-blue-600">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
          <span>{actionLabel}</span>
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </div>
      </div>
    </motion.button>
  );
}

export default CategoryCard;
