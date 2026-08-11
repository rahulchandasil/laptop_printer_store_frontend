import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useCart } from "../context/CartContext";

function Products() {
  const { category, brand } = useParams();
  const navigate = useNavigate();
const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/products?category=${category}&brand=${brand}`,
        );

        setProducts(response.data.products);
      } catch (error) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, brand]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate(`/brands/${category}`)}
          className="text-blue-600 mb-8"
        >
          ← Back to Brands
        </button>

        <div>
          <p className="text-blue-600 font-semibold uppercase">{category}</p>

          <h1 className="text-4xl font-bold text-slate-900 mt-1">
            {brand} Products
          </h1>
        </div>

        {loading && (
          <div className="text-center py-20">
            <p className="text-lg text-slate-500">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-lg mt-8">
            {error}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500">No products found.</p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition"
            >
              <div className="h-52 bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5">
                <p className="text-sm text-blue-600 font-medium">
                  {product.brand}
                </p>

                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {product.name}
                </h2>

                <p className="text-slate-500 text-sm mt-2 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mt-5">
                  <span className="text-xl font-bold">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Products;
