"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { addToCart, removeFromCart, changeVariant, cartCount, cartSubtotalCents, type CartItem } from "@/lib/cart-store";

type CartCtx = {
  items: CartItem[];
  add: (i: CartItem) => void;
  remove: (id: string) => void;
  changeVariant: (currentVariantId: string, newVariantId: string) => void;
  count: number;
  subtotalCents: number;
};
const Ctx = createContext<CartCtx | null>(null);
const KEY = "helyx_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]); // matches server render
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate client-only cart after mount
        setItems(JSON.parse(raw) as CartItem[]);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items]);
  const value: CartCtx = {
    items,
    add: (i) => setItems((cur) => addToCart(cur, i)),
    remove: (id) => setItems((cur) => removeFromCart(cur, id)),
    changeVariant: (currentVariantId, newVariantId) =>
      setItems((cur) => changeVariant(cur, currentVariantId, newVariantId)),
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
