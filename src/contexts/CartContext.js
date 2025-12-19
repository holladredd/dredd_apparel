import { createContext, useContext, useReducer, useEffect } from "react";
import { getCart, addToCart, updateCartItem, removeFromCart } from "@/lib/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const initialState = {
  items: [],
  loading: true,
};

function cartReducer(state, action) {
  switch (action.type) {
    case "SET_CART":
      return { ...state, items: action.payload, loading: false };
    case "UPDATE_ITEMS":
      return { ...state, items: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      dispatch({ type: "SET_CART", payload: [] });
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const data = await getCart();
      dispatch({ type: "SET_CART", payload: data.cart?.items || [] });
    } catch (error) {
      console.error("Failed to load cart:", error);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addItem = async (productId, size = "M", quantity = 1) => {
    try {
      const data = await addToCart(productId, size, quantity);
      if (data.success) {
        dispatch({ type: "UPDATE_ITEMS", payload: data.cart.items });
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      const data = await updateCartItem(itemId, quantity);
      if (data.success) {
        dispatch({ type: "UPDATE_ITEMS", payload: data.cart.items });
      }
    } catch (error) {
      console.error("Failed to update cart item:", error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const data = await removeFromCart(itemId);
      if (data.success) {
        dispatch({ type: "UPDATE_ITEMS", payload: data.cart.items });
      }
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const value = {
    items: state.items,
    loading: state.loading,
    totalItems,
    totalPrice,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    refreshCart: loadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
