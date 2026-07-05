import { createContext, useContext, useMemo, useState, useCallback, type ReactNode } from "react";
import { decrementStock, incrementStock, getVariant, buildSku, type Variant } from "@/lib/inventory";
import type { Gsm, Size } from "@/lib/products";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CartItem = {
  sku: string;          // variant SKU — primary key
  id: string;           // productId e.g. tee-260-black
  name: string;
  color: string;
  size: string;
  gsm?: Gsm;
  price: number;
  image?: string;
  qty: number;
};

export type AddToCartResult =
  | { ok: true }
  | { ok: false; reason: "out_of_stock" | "insufficient_stock" | "not_found"; available: number };

type CartCtx = {
  items: CartItem[];
  open: boolean;
  setOpen: (v: boolean) => void;
  /** Add a variant to cart. Returns result so callers can show error messages. */
  add: (params: {
    gsm: Gsm;
    color: string;
    size: Size;
    qty?: number;
    name: string;
    image?: string;
  }) => AddToCartResult;
  remove: (sku: string) => void;
  updateQty: (sku: string, newQty: number) => void;
  count: number;
  subtotal: number;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const Ctx = createContext<CartCtx | null>(null);

export const keyOf = (i: { id: string; size: string }) => `${i.id}__${i.size}`;

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const add = useCallback<CartCtx["add"]>(({ gsm, color, size, qty = 1, name, image }) => {
    // 1. Check inventory before touching state
    const result = decrementStock(gsm, color, size, qty);
    if (!result.ok) return result;

    const sku = buildSku(gsm, color, size);
    const variant = result.variant;

    setItems((prev) => {
      const existing = prev.find((p) => p.sku === sku);
      if (existing) {
        return prev.map((p) =>
          p.sku === sku ? { ...p, qty: p.qty + qty } : p,
        );
      }
      return [
        ...prev,
        {
          sku,
          id: variant.productId,
          name,
          color,
          size,
          gsm,
          price: variant.price,
          image,
          qty,
        },
      ];
    });

    setOpen(true);
    return { ok: true };
  }, []);

  const remove = useCallback((sku: string) => {
    setItems((prev) => {
      const item = prev.find((p) => p.sku === sku);
      if (item && item.gsm) {
        // Return stock to inventory
        incrementStock(item.gsm, item.color, item.size as Size, item.qty);
      }
      return prev.filter((p) => p.sku !== sku);
    });
  }, []);

  const updateQty = useCallback((sku: string, newQty: number) => {
    if (newQty < 1) return;

    setItems((prev) => {
      const item = prev.find((p) => p.sku === sku);
      if (!item || !item.gsm) return prev;

      const diff = newQty - item.qty;

      if (diff > 0) {
        // Need to reserve more stock
        const result = decrementStock(item.gsm, item.color, item.size as Size, diff);
        if (!result.ok) return prev; // not enough stock — don't update
      } else if (diff < 0) {
        // Returning stock
        incrementStock(item.gsm, item.color, item.size as Size, Math.abs(diff));
      }

      return prev.map((p) => (p.sku === sku ? { ...p, qty: newQty } : p));
    });
  }, []);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      open,
      setOpen,
      add,
      remove,
      updateQty,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.qty * i.price, 0),
    }),
    [items, open, add, remove, updateQty],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside provider");
  return c;
};

// ─── Convenience hook: live variant data for a specific gsm+color+size ────────

export function useVariant(gsm: Gsm | null, color: string, size: Size | null): Variant | undefined {
  if (!gsm || !size) return undefined;
  return getVariant(gsm, color, size);
}
