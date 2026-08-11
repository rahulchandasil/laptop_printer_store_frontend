import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function Brands() {
  const { category } = useParams();
  const navigate = useNavigate();

  const brands =
    category === "laptop"
      ? ["Dell", "HP", "Lenovo"]
      : ["HP", "Canon", "Epson"];

  const title =
    category === "laptop"
      ? "Choose Your Laptop Brand"
      : "Choose Your Printer Brand";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-14">
        <button
          onClick={() => navigate("/home")}
          className="text-blue-600 font-medium mb-8"
        >
          ← Back
        </button>

        <div className="text-center">
          <p className="text-blue-600 font-semibold uppercase">
            {category}
          </p>

          <h1 className="text-4xl font-bold text-slate-900 mt-2">
            {title}
          </h1>

          <p className="text-slate-500 mt-3">
            Select a brand to explore its products.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {brands.map((brand) => (
            <div
              key={brand}
              onClick={() =>
                navigate(`/products/${category}/${brand}`)
              }
              className="bg-white rounded-2xl p-10 shadow-md hover:shadow-xl cursor-pointer transition text-center"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-800">
                {brand.charAt(0)}
              </div>

              <h2 className="text-2xl font-bold mt-6">
                {brand}
              </h2>

              <p className="text-slate-500 mt-2">
                Explore {brand} products
              </p>

              <button className="mt-6 bg-blue-600 text-white px-5 py-2.5 rounded-lg">
                View Products
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Brands;