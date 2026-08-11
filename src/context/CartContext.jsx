import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCart = async () => {
    if (!user?.id) return;

    try {
      const response = await api.get(`/cart/${user.id}`);
      setCart(response.data.cart);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId) => {
    if (!user?.id) {
      alert("Please login first");
      return;
    }

    try {
      const response = await api.post(`/cart/${user.id}`, {
        productId,
        quantity: 1,
      });

      setCart(response.data.cart);
      alert("Product added to cart");
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to add product"
      );
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      const response = await api.put(
        `/cart/${user.id}/${productId}`,
        {
          quantity,
        }
      );

      setCart(response.data.cart);
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await api.delete(
        `/cart/${user.id}/${productId}`
      );

      setCart(response.data.cart);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);