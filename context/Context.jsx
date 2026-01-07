"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { openCartModal } from "@/utlis/openCartModal";
import { useTranslation } from "react-i18next";

const DataContext = createContext();
const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || "/api";

export const useContextElement = () => {
  return useContext(DataContext);
};

export default function Context({ children }) {
  const { i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserId = (u) => (u?.user_id ? u.user_id : u?.id);

  // ฟังก์ชันกรองข้อมูลตามภาษาปัจจุบัน
  const filterByLanguage = useCallback(
    (items) => {
      if (!items || !Array.isArray(items)) return [];

      const currentLang = i18n.language === "th" ? "th" : "en";

      // Group by product_id
      const grouped = items.reduce((acc, item) => {
        const key = item.product_id;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {});

      // Select item matching current language, fallback to first item
      const filtered = Object.values(grouped).map((group) => {
        // หาภาษาที่ตรงกับปัจจุบัน
        let item = group.find((g) => {
          // ตรวจสอบจากชื่อว่าเป็นภาษาไทยหรือไม่
          const isThai = /[\u0E00-\u0E7F]/.test(g.name);
          return currentLang === "th" ? isThai : !isThai;
        });

        // ถ้าไม่เจอ ใช้ item แรก
        if (!item) item = group[0];

        return item;
      });

      return filtered;
    },
    [i18n.language]
  );

  const login = useCallback((userData) => {
    // console.log("Context: Logging in user", userData);
    setUser(userData);
    localStorage.setItem("user_data", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    // console.log("Context: Logging out user");
    setUser(null);
    setCartProducts([]);
    setWishList([]);
    localStorage.removeItem("user_data");
    localStorage.removeItem("access_token");
  }, []);

  const fetchDataForUser = useCallback(async () => {
    if (!user || !getUserId(user)) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const uid = getUserId(user);
    // console.log(`Context: Fetching data for user ID: ${uid}`);

    try {
      const [cartRes, wishlistRes] = await Promise.all([
        fetch(`${API_BASE_URL}/cart-wishlist/user/${uid}?type=cart`),
        fetch(`${API_BASE_URL}/cart-wishlist/user/${uid}?type=wishlist`),
      ]);

      if (!cartRes.ok)
        throw new Error(
          `Failed to fetch cart items (Status: ${cartRes.status})`
        );
      if (!wishlistRes.ok)
        throw new Error(
          `Failed to fetch wishlist (Status: ${wishlistRes.status})`
        );

      const cartData = await cartRes.json();
      const wishlistData = await wishlistRes.json();

      // กรองข้อมูลตามภาษาก่อน set state
      setCartProducts(filterByLanguage(cartData) || []);
      setWishList(filterByLanguage(wishlistData) || []);

      // console.log('✅ Filtered cart items:', filterByLanguage(cartData)?.length);
      // console.log('✅ Filtered wishlist items:', filterByLanguage(wishlistData)?.length);
    } catch (err) {
      setError(err.message);
      console.error("Context: Data fetching error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user, filterByLanguage]); //filterByLanguage

  //Re-fetch เมื่อเปลี่ยนภาษา
  useEffect(() => {
    fetchDataForUser();
  }, [fetchDataForUser, i18n.language]); // i18n.language

  useEffect(() => {
    const subtotal = cartProducts.reduce((acc, item) => {
      const price = item?.price || 0;
      return acc + (item.quantity || 1) * Number(price);
    }, 0);
    setTotalPrice(subtotal);
  }, [cartProducts]);

  const clearCart = useCallback(async () => {
    const uid = getUserId(user);
    if (!uid) {
      // console.log("No user logged in, skipping cart clear");
      return { success: false, message: "No user logged in" };
    }

    try {
      // console.log(`🗑️ Clearing cart for user ${uid}...`);

      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${API_BASE_URL}/cart-wishlist/user/${uid}?type=cart`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (response.ok) {
        // console.log("✅ Cart cleared successfully via API");
        setCartProducts([]);
        return { success: true, message: "Cart cleared successfully" };
      } else {
        const errorData = await response.json();
        console.error("❌ Failed to clear cart:", errorData);
        return {
          success: false,
          message: errorData.message || "Failed to clear cart",
        };
      }
    } catch (error) {
      console.error("❌ Error clearing cart:", error);
      return {
        success: false,
        message: error.message || "Network error while clearing cart",
      };
    }
  }, [user]);

  const clearCartAfterOrder = useCallback(
    async (orderId = null) => {
      // console.log(
      //   `🛒 Clearing cart after successful order${
      //     orderId ? ` #${orderId}` : ""
      //   }...`
      // );

      const result = await clearCart();

      if (result.success) {
        // console.log("✅ Cart cleared successfully after order");

        localStorage.setItem(
          "lastCartClear",
          JSON.stringify({
            timestamp: new Date().toISOString(),
            orderId: orderId,
            userId: getUserId(user),
          })
        );
      } else {
        console.error("❌ Failed to clear cart after order:", result.message);
        setCartProducts([]);
        // console.log("💡 Cleared local cart state as fallback");
      }

      return result;
    },
    [clearCart, user]
  );

  const addProductToCart = async (product, quantity = 1) => {
    const uid = getUserId(user);
    if (!uid) return alert("Please log in to add items to your cart.");
    if (!product || !product.id)
      return console.error("Invalid product provided to addProductToCart");

    const existingItem = cartProducts.find(
      (item) => item.product_id === product.id
    );

    if (existingItem) {
      // await และเปิด modal หลังจาก update เสร็จ
      await updateQuantity(existingItem.id, existingItem.quantity + quantity);
      if (typeof openCartModal === "function") {
        openCartModal();
      }
      return; //return เพื่อหยุดการทำงาน
    }

    try {
      const payload = {
        user_id: uid,
        product_id: product.id,
        quantity,
        type: "cart",
      };
      const response = await fetch(`${API_BASE_URL}/cart-wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("API call to create cart item failed");

      await fetchDataForUser();
      if (typeof openCartModal === "function") {
        openCartModal();
      }
    } catch (err) {
      console.error("Error adding product to cart:", err);
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!user) return;
    setCartProducts((prev) => prev.filter((item) => item.id !== cartItemId));
    try {
      const response = await fetch(
        `${API_BASE_URL}/cart-wishlist/${cartItemId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("API call to delete item failed");
    } catch (err) {
      console.error("Error removing from cart:", err);
      fetchDataForUser();
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (!user || newQuantity < 1) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/cart-wishlist/${cartItemId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );
      if (!response.ok) throw new Error("API call to update quantity failed");

      setCartProducts((prev) =>
        prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const toggleWishlist = async (product) => {
    const uid = getUserId(user);
    if (!uid) return alert("Please log in to manage your wishlist.");
    if (!product || !product.id) return;

    const existingItem = wishList.find(
      (item) => item.product_id === product.id
    );

    try {
      if (existingItem) {
        setWishList((prev) =>
          prev.filter((item) => item.id !== existingItem.id)
        );
        const response = await fetch(
          `${API_BASE_URL}/cart-wishlist/${existingItem.id}`,
          { method: "DELETE" }
        );
        if (!response.ok) throw new Error("Failed to remove from wishlist");
      } else {
        const payload = {
          user_id: uid,
          product_id: product.id,
          quantity: 1,
          type: "wishlist",
        };
        const response = await fetch(`${API_BASE_URL}/cart-wishlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Failed to add to wishlist");
        await fetchDataForUser();
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
      fetchDataForUser();
    }
  };

  const contextValue = {
    user,
    cartProducts,
    setCartProducts,
    wishList,
    totalPrice,
    isLoading,
    error,
    login,
    logout,
    addProductToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearCartAfterOrder,
    isAddedToCartProducts: (productId) =>
      cartProducts.some((item) => item.product_id === productId),
    toggleWishlist,
    isAddedtoWishlist: (productId) =>
      wishList.some((item) => item.product_id === productId),
    refreshCart: fetchDataForUser,
    getUserId: () => getUserId(user),
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
}
