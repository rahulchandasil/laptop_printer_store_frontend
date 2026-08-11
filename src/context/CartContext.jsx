import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
  });

  // Get the latest user from localStorage
  const getUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Invalid user data:", error);
      return null;
    }
  };

  // Fetch cart
  const fetchCart = async () => {
    const user = getUser();

    if (!user?.id) {
      return;
    }

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

  // Add to cart
  const addToCart = async (productId) => {
    const user = getUser();

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
      console.error("Add to cart error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to add product"
      );
    }
  };

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    const user = getUser();

    if (!user?.id) {
      alert("Please login first");
      return;
    }

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
      console.error("Update cart error:", error);
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    const user = getUser();

    if (!user?.id) {
      alert("Please login first");
      return;
    }

    try {
      const response = await api.delete(
        `/cart/${user.id}/${productId}`
      );

      setCart(response.data.cart);
    } catch (error) {
      console.error("Remove cart error:", error);
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