import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import { CartContext } from "./cartContext";
import { useToast } from "./ToastContext";

export const CartProvider = ({ children }) => {
  const { addToast } = useToast();
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
      addToast("Please login first to add items to cart.", "error");
      return;
    }

    try {
      const response = await api.post(`/cart`, {
        productId,
        quantity,
      });

      setCart(response.data.cart);

      addToast("Product added to cart successfully.", "success");
    } catch (error) {
      console.error("Add to cart error:", error);

      addToast(error.response?.data?.message || "Failed to add product", "error");
    }
  };

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    const user = getUser();

    if (!user?.id) {
      addToast("Please login first", "error");
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
      addToast("Failed to update quantity", "error");
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    const user = getUser();

    if (!user?.id) {
      addToast("Please login first", "error");
      return;
    }

    try {
      const response = await api.delete(`/cart/${productId}`);

      setCart(response.data.cart);
      addToast("Item removed from cart", "info");
    } catch (error) {
      console.error("Remove cart error:", error);
      addToast("Failed to remove item", "error");
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
