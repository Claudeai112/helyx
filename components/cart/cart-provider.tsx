"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { addToCart, removeFromCart, cartCount, cartSubtotalCents, type CartItem } from "@/lib/cart-store";

type CartCtx = { items: CartItem[]; add: (i: CartItem) => void; remove: (id: string) => void; count: number; subtotalCents: number };
const Ctx = createContext<CartCtx | null>(null);
const KEY = "helyx_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw) as CartItem[]; } catch {}
    return [];
  });
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items]);
  const value: CartCtx = {
    items,
    add: (i) => setItems((cur) => addToCart(cur, i)),
    remove: (id) => setItems((cur) => removeFromCart(cur, id)),
    count: cartCount(items),
    subtotalCents: cartSubtotalCents(items),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useCart(): CartCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
