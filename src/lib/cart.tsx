import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  color: string;
  size: string;
  price: number;
  image?: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  count: number;
  subtotal: number;
};

const Ctx = createContext<CartCtx | null>(null);
const keyOf = (i: { id: string; size: string }) => `${i.id}__${i.size}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const add: CartCtx["add"] = (item) => {
    setItems((prev) => {
      const k = keyOf(item);
      const found = prev.find((p) => keyOf(p) === k);
      if (found) return prev.map((p) => (keyOf(p) === k ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { ...item, qty: 1 }];
    });
    setOpen(true);
  };
  const remove = (k: string) => setItems((prev) => prev.filter((p) => keyOf(p) !== k));
  const updateQty = (k: string, qty: number) =>
    setItems((prev) => prev.map((p) => (keyOf(p) === k ? { ...p, qty: Math.max(1, qty) } : p)));

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
    [items, open],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside provider");
  return c;
};
export { keyOf };
