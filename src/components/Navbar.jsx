import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/home" className="text-2xl font-bold">
          TechStore
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/home"
            className="hover:text-blue-400 transition"
          >
            Home
          </Link>

          <Link
            to="/cart"
            className="hover:text-blue-400 transition"
          >
            Cart
          </Link>

          {user && (
            <span className="hidden sm:block text-slate-300">
              Hi, {user.name}
            </span>
          )}

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;