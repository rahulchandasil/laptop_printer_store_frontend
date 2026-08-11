import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const items = cart?.items || [];

  const total = items.reduce((sum, item) => {
    return sum + item.productId.price * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Shopping Cart
            </h1>

            <p className="text-slate-500 mt-2">
              Review your selected products
            </p>
          </div>

          <button
            onClick={() => navigate("/home")}
            className="text-blue-600 font-medium"
          >
            ← Continue Shopping
          </button>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="text-6xl mb-5">🛒</div>

            <h2 className="text-2xl font-bold">
              Your cart is empty
            </h2>

            <p className="text-slate-500 mt-2">
              Add some products to get started.
            </p>

            <button
              onClick={() => navigate("/home")}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const product = item.productId;

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row gap-5"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full sm:w-32 h-32 object-cover rounded-xl bg-slate-100"
                    />

                    <div className="flex-1">
                      <p className="text-sm text-blue-600 font-medium">
                        {product.brand}
                      </p>

                      <h2 className="text-xl font-bold mt-1">
                        {product.name}
                      </h2>

                      <p className="text-lg font-semibold mt-3">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>

                      <div className="flex items-center justify-between mt-5">
                        <div className="flex items-center border rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(
                                product._id,
                                item.quantity - 1
                              )
                            }
                            className="px-4 py-2 hover:bg-slate-100"
                          >
                            −
                          </button>

                          <span className="px-5 py-2 border-x">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                product._id,
                                item.quantity + 1
                              )
                            }
                            className="px-4 py-2 hover:bg-slate-100"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            removeFromCart(product._id)
                          }
                          className="text-red-500 hover:text-red-600 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
              <h2 className="text-2xl font-bold">
                Order Summary
              </h2>

              <div className="flex justify-between mt-6 text-slate-600">
                <span>Items</span>
                <span>{items.length}</span>
              </div>

              <div className="border-t mt-5 pt-5 flex justify-between">
                <span className="font-semibold text-lg">
                  Total
                </span>

                <span className="font-bold text-2xl">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Cart;