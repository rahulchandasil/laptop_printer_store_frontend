import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);

        setProduct(response.data.product);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="text-center py-20">Loading product...</div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />

        <div className="text-center py-20">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-12">
        <button onClick={() => navigate(-1)} className="text-blue-600 mb-8">
          ← Back
        </button>

        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-md p-6 md:p-10">
          <div className="bg-slate-100 rounded-2xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[400px] object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-blue-600 font-semibold">
              {product.brand} • {product.category}
            </p>

            <h1 className="text-4xl font-bold text-slate-900 mt-3">
              {product.name}
            </h1>

            <p className="text-slate-600 mt-6 leading-7">
              {product.description}
            </p>

            <p className="text-3xl font-bold mt-8">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            <button
              onClick={() => addToCart(product._id)}
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductDetails;
