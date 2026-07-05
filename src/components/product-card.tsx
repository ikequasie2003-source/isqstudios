import { useState } from "react";
import { Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import { sizes, type Product, type Size } from "@/lib/products";
import { resolveCardImage } from "@/lib/media-resolver";

export function ProductCard({ product }: { product: Product }) {
  const [size, setSize] = useState<Size>("M");
  const { add } = useCart();
  const isLight = ["#f5f2ea", "#e9dfc9"].includes(product.swatch);

  // Use admin-uploaded image if available, fall back to built-in
  const image = resolveCardImage(product.category, product.gsm, product.color, product.image);

  const handleAdd = () => {
    if (!product.gsm) return;
    add({ gsm: product.gsm, color: product.color, size, qty: 1, name: product.name, image });
  };

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-bone">
        {image ? (
          <img
            src={image}
            alt={`${product.color} ${product.name}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center transition-transform duration-700 group-hover:scale-[1.03]"
            style={{ backgroundColor: product.swatch }}
          >
            <svg viewBox="0 0 200 240" className={`h-3/5 w-3/5 ${isLight ? "opacity-15" : "opacity-25"}`} fill="none">
              <path
                d="M60 30 L100 15 L140 30 L175 50 L165 90 L145 82 L145 220 L55 220 L55 82 L35 90 L25 50 Z"
                stroke={isLight ? "#111" : "#fff"}
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
        <button
          onClick={handleAdd}
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center bg-background/90 text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
          aria-label={`Add ${product.color} ${product.name} to cart`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="pt-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-base font-normal">{product.name}</h3>
          <p className="text-sm tabular-nums">${product.price}</p>
        </div>
        <p className="mt-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">{product.color}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`h-8 min-w-8 border px-2 text-[11px] uppercase tracking-widest transition-colors ${
                size === s ? "border-ink bg-ink text-cream" : "border-border text-foreground hover:border-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={handleAdd}
          className="mt-3 w-full border border-ink py-2.5 text-[11px] uppercase tracking-[0.24em] transition-colors hover:bg-ink hover:text-cream"
        >
          Add to Bag
        </button>
      </div>
    </article>
  );
}
