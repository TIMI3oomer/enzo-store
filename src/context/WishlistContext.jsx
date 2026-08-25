import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";

const WishlistContext = createContext(null);
const STORAGE_KEY = "enzo_wishlist_v1";

export function WishlistProvider({ children }) {
  const { session } = useAuth();
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  // Sync with Supabase if logged in
  useEffect(() => {
    if (!session?.user?.id) return;
    let isCancelled = false;

    async function fetchSupabaseWishlist() {
      try {
        const { data, error } = await supabase
          .from("wishlist")
          .select("product_id, products(*)")
          .eq("user_id", session.user.id);

        if (!error && data && !isCancelled) {
          const dbProducts = data
            .map((entry) => entry.products)
            .filter(Boolean);

          // Merge local and remote
          setItems((prev) => {
            const merged = [...prev];
            for (const p of dbProducts) {
              if (!merged.some((m) => m.id === p.id)) {
                merged.push(p);
              }
            }
            return merged;
          });
        }
      } catch (err) {
        console.warn("[ENZO Wishlist] Supabase sync skipped (offline or not configured):", err.message);
      }
    }

    fetchSupabaseWishlist();
    return () => {
      isCancelled = true;
    };
  }, [session]);

  const isInWishlist = (productId) => {
    return items.some((item) => item.id === productId);
  };

  const toggleWishlist = async (product) => {
    if (!product || !product.id) return;
    const exists = isInWishlist(product.id);

    if (exists) {
      setItems((prev) => prev.filter((item) => item.id !== product.id));
      if (session?.user?.id) {
        supabase
          .from("wishlist")
          .delete()
          .match({ user_id: session.user.id, product_id: product.id })
          .catch(() => {});
      }
    } else {
      setItems((prev) => [...prev, product]);
      if (session?.user?.id) {
        supabase
          .from("wishlist")
          .insert({ user_id: session.user.id, product_id: product.id })
          .catch(() => {});
      }
    }
  };

  const removeFromWishlist = (productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
    if (session?.user?.id) {
      supabase
        .from("wishlist")
        .delete()
        .match({ user_id: session.user.id, product_id: productId })
        .catch(() => {});
    }
  };

  const clearWishlist = () => {
    setItems([]);
    if (session?.user?.id) {
      supabase
        .from("wishlist")
        .delete()
        .eq("user_id", session.user.id)
        .catch(() => {});
    }
  };

  const value = {
    items,
    count: items.length,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
