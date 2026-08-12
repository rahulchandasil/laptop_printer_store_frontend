import { motion, useReducedMotion } from "motion/react";
import { Truck, ShieldCheck, CreditCard, Clock } from "lucide-react";

function ValueProps() {
  const shouldReduceMotion = useReducedMotion();

  const items = [
    {
      icon: Truck,
      title: "Free Express Shipping",
      description: "On all orders over $500.",
    },
    {
      icon: ShieldCheck,
      title: "1-Year Warranty",
      description: "Guaranteed protection on all tech.",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Encrypted and safe checkout.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "We're here when you need us.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-900 transition-colors hover:bg-blue-50 hover:text-blue-600">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default ValueProps;
