import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { House, LogOut, Menu, ShoppingCart, UserCircle2, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useCart } from "../context/useCart";

function Navbar() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const shouldReduceMotion = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const cartCount = useMemo(
    () => cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0,
    [cart],
  );

  useEffect(() => {
    const handleStorage = () => {
      try {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/home" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
            TS
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight text-slate-950">
              TechStore
            </p>
            <p className="text-xs text-slate-500">Laptop & Printer Store</p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/home"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <House className="h-4 w-4" />
            Home
          </Link>

          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <ShoppingCart className="h-4 w-4" />
            Cart
            {cartCount > 0 ? (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-slate-950 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>

          {user ? (
            <div className="ml-2 flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
              <UserCircle2 className="h-5 w-5 text-slate-500" />
              <div className="leading-tight">
                <p className="text-xs text-slate-500">Signed in as</p>
                <p className="text-sm font-medium text-slate-950">
                  {user.name || user.email || "User"}
                </p>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Login
            </Link>
          )}

          {user ? (
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <motion.div
        initial={false}
        animate={
          mobileMenuOpen
            ? { height: "auto", opacity: 1 }
            : { height: 0, opacity: 0 }
        }
        transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: "easeOut" }}
        className="overflow-hidden border-t border-slate-200 bg-white md:hidden"
      >
        <div className="space-y-2 px-4 py-4 sm:px-6">
          <Link
            to="/home"
            onClick={closeMenu}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <House className="h-4 w-4" />
            Home
          </Link>

          <Link
            to="/cart"
            onClick={closeMenu}
            className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <span className="flex items-center gap-3">
              <ShoppingCart className="h-4 w-4" />
              Cart
            </span>
            {cartCount > 0 ? (
              <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>

          {user ? (
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <UserCircle2 className="h-4 w-4" />
              Login
            </Link>
          )}
        </div>
      </motion.div>
    </nav>
  );
}

export default Navbar;
