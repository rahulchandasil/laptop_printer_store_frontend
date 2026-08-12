import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";

function Brands() {
  const { category } = useParams();
  const navigate = useNavigate();

  // Basic fallback data
  const isLaptop = category?.toLowerCase() === "laptop";
  const brands = isLaptop 
    ? ["Dell", "HP", "Lenovo"] 
    : category?.toLowerCase() === "printer" 
      ? ["HP", "Canon", "Epson"] 
      : [];

  const title = category 
    ? `Choose Your ${category.charAt(0).toUpperCase() + category.slice(1)} Brand`
    : "Choose a Brand";

  const companyLogos = {
    Dell: "/logos/dell.png",
    HP: "/logos/hp.png",
    Lenovo: "/logos/lenovo.png",
    Canon: "/logos/canon.png",
    Epson: "/logos/epson.png",
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans selection:bg-slate-200">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8 hidden sm:block">
          <ol className="flex items-center gap-2 text-sm text-slate-500">
            <li>
              <Link to="/home" className="transition hover:text-slate-900">
                Home
              </Link>
            </li>
            <li><ChevronRight className="h-4 w-4" /></li>
            {category && (
              <>
                <li className="font-medium text-slate-900 capitalize" aria-current="page">
                  {category} Brands
                </li>
              </>
            )}
          </ol>
        </nav>

        {/* Mobile Back Button */}
        <button
          onClick={() => navigate("/home")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 sm:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        {/* Header Section */}
        <div className="mb-12 text-center sm:mb-16">
          {category && (
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 ring-1 ring-inset ring-blue-500/20"
            >
              {category} Collection
            </motion.span>
          )}
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl md:text-5xl"
          >
            {title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-base text-slate-500 sm:text-lg"
          >
            Shop premium products from the world's most trusted manufacturers. Select a brand below to explore their latest releases.
          </motion.p>
        </div>

        {/* Empty State */}
        {brands.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white py-24 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">No brands found</h2>
            <p className="mt-2 text-slate-500">We couldn't find any brands for this category.</p>
            <button
              onClick={() => navigate("/home")}
              className="mt-6 rounded-full bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Return Home
            </button>
          </div>
        ) : (
          /* Brand Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {brands.map((brand, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                key={brand}
                onClick={() => navigate(`/products/${category}/${brand}`)}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50"
              >
                {/* Logo Area */}
                <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-slate-50 ring-1 ring-slate-100 transition-transform duration-500 group-hover:scale-105">
                  <img
                    src={companyLogos[brand] || "/logos/default.png"}
                    alt={`${brand} logo`}
                    className="h-20 w-20 object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<span class="text-2xl font-bold text-slate-400">${brand.charAt(0)}</span>`;
                    }}
                  />
                </div>

                {/* Content Area */}
                <div className="flex flex-1 flex-col items-center text-center">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    {brand}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Explore the complete {brand} lineup
                  </p>
                  
                  {/* Action Button */}
                  <div className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-3 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-200 transition-all group-hover:bg-slate-950 group-hover:text-white group-hover:ring-slate-950">
                    View Products
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Brands;
