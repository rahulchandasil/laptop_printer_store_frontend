import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import { CartContext } from "./cartContext";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
  });
  const cartCount = cart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );
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
  const fetchCart = useCallback(async () => {
    const user = getUser();

    if (!user?.id) {
      return;
    }

    try {
      const response = await api.get(`/cart`);

      setCart(response.data.cart);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCart();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchCart]);

  // Add to cart
  const addToCart = async (productId, quantity = 1) => {
    const user = getUser();

    if (!user?.id) {
      alert("Please login first");
      return;
    }

    try {
      const response = await api.post(`/cart`, {
        productId,
        quantity,
      });

      setCart(response.data.cart);

      alert("Product added to cart");
    } catch (error) {
      console.error("Add to cart error:", error);

      alert(error.response?.data?.message || "Failed to add product");
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
      const response = await api.put(`/cart/${productId}`, {
        quantity,
      });

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
      const response = await api.delete(`/cart/${productId}`);

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
        cartCount,
        updateQuantity,
        removeFromCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
