import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, ArrowLeft, Frown, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useCart } from "../context/useCart";
import ProductCard from "../components/products/ProductCard";

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-slate-100" />
      <div className="p-5">
        <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
        <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-slate-100" />
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="mt-6 flex items-end justify-between">
          <div>
            <div className="mb-1 h-3 w-8 animate-pulse rounded bg-slate-100" />
            <div className="h-6 w-20 animate-pulse rounded bg-slate-100" />
          </div>
          <div className="h-10 w-24 animate-pulse rounded-full bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

function Products() {
  const { category, brand } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(null);
  
  // Client-side states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(
        `/products?category=${category}&brand=${brand}`,
      );
      setProducts(response.data.products);
    } catch {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, brand]);

  const handleAddToCart = async (productId) => {
    try {
      setAddingToCart(productId);
      await addToCart(productId);
    } finally {
      setAddingToCart(null);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];
    
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        (p.description && p.description.toLowerCase().includes(lowerQuery))
      );
    }
    
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    return result;
  }, [products, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <button
          onClick={() => navigate(`/brands/${category}`)}
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-slate-50 rounded-lg px-2 py-1 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
          Back to Brands
        </button>

        <header className="mb-10 md:mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            {category}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            {brand} Collection
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600 leading-relaxed">
            Discover our premium selection of {brand} {category} products, designed to elevate your everyday experience.
          </p>
        </header>

        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
          <div className="relative flex-1 md:max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="block w-full rounded-xl border-0 bg-slate-50 py-3 pl-11 pr-10 text-sm text-slate-900 outline-none ring-1 ring-inset ring-slate-200 transition placeholder:text-slate-500 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 md:justify-end">
            <p className="text-sm font-medium text-slate-500">
              <span className="text-slate-900">{filteredAndSortedProducts.length}</span> products
            </p>

            <div className="relative flex items-center gap-2">
              <label htmlFor="sort" className="hidden text-sm font-medium text-slate-500 sm:block">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full rounded-xl border-0 bg-slate-50 py-3 pl-4 pr-10 text-sm font-medium text-slate-900 outline-none ring-1 ring-inset ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-inset focus:ring-slate-900 cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                }}
              >
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </section>

        {error ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50 py-16 px-6 text-center shadow-sm">
            <Frown className="h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-red-900">Oops! Something went wrong.</h3>
            <p className="mt-2 text-sm text-red-600 max-w-md">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
            >
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white py-24 px-6 text-center shadow-sm"
          >
            <Search className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900">No products found</h3>
            <p className="mt-2 text-sm text-slate-500 max-w-md">
              We couldn't find any products matching your current search criteria. Try adjusting your search term.
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredAndSortedProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={product._id}
                >
                  <ProductCard
                    product={product}
                    adding={addingToCart === product._id}
                    onAddToCart={() => handleAddToCart(product._id)}
                    onViewDetails={() => navigate(`/product/${product._id}`)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default Products;
