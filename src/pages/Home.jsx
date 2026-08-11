import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-blue-600 font-semibold mb-3">
            Welcome to TechStore
          </p>

          <h1 className="text-4xl md:text-6xl font-bold text-slate-900">
            Find the right technology for your needs
          </h1>

          <p className="text-slate-600 mt-5 text-lg">
            Explore laptops and printers from trusted brands.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-14">
          {/* Laptop */}
          <div
            onClick={() => navigate("/brands/laptop")}
            className="group cursor-pointer bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition"
          >
            <div className="h-64 bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center">
              <div className="text-white text-8xl">
                💻
              </div>
            </div>

            <div className="p-8">
              <h2 className="text-3xl font-bold text-slate-900">
                Laptops
              </h2>

              <p className="text-slate-600 mt-3">
                Explore laptops from Dell, HP and Lenovo.
              </p>

              <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold group-hover:bg-blue-700">
                Explore Laptops →
              </button>
            </div>
          </div>

          {/* Printer */}
          <div
            onClick={() => navigate("/brands/printer")}
            className="group cursor-pointer bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition"
          >
            <div className="h-64 bg-gradient-to-br from-slate-700 to-slate-950 flex items-center justify-center">
              <div className="text-white text-8xl">
                🖨️
              </div>
            </div>

            <div className="p-8">
              <h2 className="text-3xl font-bold text-slate-900">
                Printers
              </h2>

              <p className="text-slate-600 mt-3">
                Explore printers from HP, Canon and Epson.
              </p>

              <button className="mt-6 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold group-hover:bg-slate-800">
                Explore Printers →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;