import { Link } from "react-router-dom";

function HomeFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-950">
              TechStore
            </p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
              A focused laptop and printer storefront built for a cleaner shopping
              experience.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-950">Explore</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              <Link to="/home" className="hover:text-slate-950">
                Home
              </Link>
              <Link to="/brands/laptop" className="hover:text-slate-950">
                Laptops
              </Link>
              <Link to="/brands/printer" className="hover:text-slate-950">
                Printers
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-950">Account</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              <Link to="/login" className="hover:text-slate-950">
                Login
              </Link>
              <Link to="/register" className="hover:text-slate-950">
                Register
              </Link>
              <Link to="/cart" className="hover:text-slate-950">
                Cart
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} TechStore. All rights reserved.</p>
            <div className="flex gap-4">
              <span>Privacy</span>
              <span>Terms</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;
