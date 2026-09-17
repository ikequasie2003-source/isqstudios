import { useState } from "react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { SearchButton } from "@/components/search";
import { Logo } from "@/components/logo";

export function Header() {
  const { count, setOpen } = useCart();
  const [navOpen, setNavOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-[#E3DED3] bg-[#F7F4EE]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
        <a href="/" aria-label="ISQ Studios home" className="flex items-center">
          <Logo className="h-10 w-auto" style={{ animation: "flipY 12s linear infinite" }} />
        </a>
        <nav className="hidden flex-1 items-center justify-center gap-8 text-xs uppercase tracking-[0.24em] text-[#111111]/70 md:flex">
          <a href="/shop" className="transition-colors hover:text-[#C9A227]">Shop</a>
          <a href="/about" className="transition-colors hover:text-[#C9A227]">About</a>
          <a href="/contact" className="transition-colors hover:text-[#C9A227]">Contact</a>
          <a href="/shipping" className="transition-colors hover:text-[#C9A227]">Shipping & Returns</a>
        </nav>
        <div className="flex items-center justify-end gap-4">
          <SearchButton />
          <button
            onClick={() => setOpen(true)}
            className="relative flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#111111] transition-colors hover:text-[#C9A227]"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="tabular-nums">({count})</span>
          </button>
          <button className="md:hidden" onClick={() => setNavOpen(!navOpen)} aria-label="Menu">
            <span className="block h-px w-5 bg-[#111111]" />
            <span className="mt-1 block h-px w-5 bg-[#111111]" />
          </button>
        </div>
      </div>
      {navOpen && (
        <div className="border-t border-[#E3DED3] bg-[#F7F4EE] px-6 py-5 md:hidden">
          <nav className="flex flex-col gap-4 text-xs uppercase tracking-[0.24em] text-[#111111]">
            <a href="/shop" onClick={() => setNavOpen(false)} className="hover:text-[#C9A227] transition-colors">Shop</a>
            <a href="/about" onClick={() => setNavOpen(false)} className="hover:text-[#C9A227] transition-colors">About</a>
            <a href="/contact" onClick={() => setNavOpen(false)} className="hover:text-[#C9A227] transition-colors">Contact</a>
            <a href="/shipping" onClick={() => setNavOpen(false)} className="hover:text-[#C9A227] transition-colors">Shipping & Returns</a>
          </nav>
        </div>
      )}
    </header>
  );
}

export function CartDrawer() {
  const { open, setOpen, items, remove, updateQty, subtotal } = useCart();
  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/30 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[#F7F4EE] shadow-2xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#E3DED3] px-6 py-5">
          <h3 className="text-sm uppercase tracking-[0.24em] text-[#111111]">Your Bag</h3>
          <button onClick={() => setOpen(false)} aria-label="Close cart" className="text-[#555555] hover:text-[#111111] transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <p className="mt-16 text-center text-sm text-[#555555]">Your bag is empty.</p>
          ) : (
            <ul className="space-y-6">
              {items.map((it) => (
                <li key={it.sku} className="flex gap-4 border-b border-[#E3DED3] pb-6">
                  <div
                    className="h-24 w-20 flex-none bg-cover bg-center bg-[#EDE8DF]"
                    style={{ backgroundImage: it.image ? `url(${it.image})` : undefined, background: it.image ? undefined : it.color }}
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between text-sm text-[#111111]">
                      <div>
                        <p className="font-medium">{it.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-widest text-[#555555]">
                          {it.color} · {it.size}{it.gsm ? ` · ${it.gsm} GSM` : ""}
                        </p>
                        <p className="mt-0.5 text-[10px] uppercase tracking-widest text-[#555555]/60">
                          {it.sku}
                        </p>
                      </div>
                      <p className="tabular-nums text-[#C9A227] font-medium">${(it.price * it.qty).toFixed(2)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-[#E3DED3]">
                        <button className="p-2 text-[#111111] hover:bg-[#EDE8DF] transition-colors" onClick={() => updateQty(it.sku, it.qty - 1)}><Minus className="h-3 w-3" /></button>
                        <span className="w-8 text-center text-sm tabular-nums text-[#111111]">{it.qty}</span>
                        <button className="p-2 text-[#111111] hover:bg-[#EDE8DF] transition-colors" onClick={() => updateQty(it.sku, it.qty + 1)}><Plus className="h-3 w-3" /></button>
                      </div>
                      <button
                        className="text-xs uppercase tracking-widest text-[#555555] underline underline-offset-2 hover:text-[#111111] transition-colors"
                        onClick={() => remove(it.sku)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-[#E3DED3] px-6 py-5 bg-white">
          <div className="flex justify-between text-sm text-[#111111]">
            <span className="uppercase tracking-[0.24em]">Subtotal</span>
            <span className="tabular-nums font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <p className="mt-1 text-xs text-[#555555]">Shipping & taxes calculated at checkout.</p>
          <button
            disabled={items.length === 0}
            className="mt-4 w-full bg-[#111111] py-4 text-xs uppercase tracking-[0.24em] text-[#F7F4EE] transition-colors hover:bg-[#C9A227] disabled:opacity-40"
          >
            Checkout
          </button>
        </div>
      </aside>
    </>
  );
}
