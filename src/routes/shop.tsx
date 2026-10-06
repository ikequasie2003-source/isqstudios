import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { SlidersHorizontal, X, ChevronDown, Eye, ShoppingBag, ArrowRight } from "lucide-react";
import { CartProvider } from "@/lib/cart";
import { Header, CartDrawer } from "@/components/site-chrome";
import { useCart } from "@/lib/cart";
import { tees, caps, sizes, gsmOptions, type Product, type Gsm, type Size } from "@/lib/products";
import { search } from "@/lib/search";
import { resolveCardImage } from "@/lib/media-resolver";
import shopPic1 from "@/assets/shop pic.jfif";
import shopPic2 from "@/assets/shop picc.jfif";
import shopPic3 from "@/assets/shop piccc.jfif";
import shopPic4 from "@/assets/shop picccc.jfif";
import shopPic5 from "@/assets/shop piccccc.jfif";
import shopPic6 from "@/assets/shop picccccc.jfif";
import shopPic7 from "@/assets/shop piccccccc.jfif";
import shopPicZ from "@/assets/shop picz.jfif";
import bg1 from "@/assets/bg1.jfif";
import bg2 from "@/assets/bg2.jfif";
import bg3 from "@/assets/bg3.jfif";
import bg4 from "@/assets/bg4.jfif";
import bg5 from "@/assets/bg5.jfif";
import bg7 from "@/assets/bg7.jfif";
import bg8 from "@/assets/bg8.jfif";
import bg9 from "@/assets/bg9.jfif";
import bg10 from "@/assets/bg10.jfif";
import bg11 from "@/assets/bg11.jfif";
import bg12 from "@/assets/bg12.jfif";
import bg13 from "@/assets/bg13.jfif";
import bg14 from "@/assets/bg14.jfif";
import bg15 from "@/assets/bg15.jfif";
import bg16 from "@/assets/bg16.jfif";
import bg17 from "@/assets/bg17.jfif";
import bg18 from "@/assets/bg18.jfif";
import bg19 from "@/assets/bg19.jfif";
import bg20 from "@/assets/bg20.jfif";
import bg21 from "@/assets/bg21.jfif";
import bg22 from "@/assets/bg22.jfif";
import bg23 from "@/assets/bg23.jfif";

const SHOP_BG_IMAGES = [
  shopPic1, shopPic2, shopPic3, shopPic4, shopPic5, shopPic6, shopPic7, shopPicZ,
  bg1, bg2, bg3, bg4, bg5, bg7, bg8, bg9, bg10, bg11, bg12,
  bg13, bg14, bg15, bg16, bg17, bg18, bg19, bg20, bg21, bg22, bg23,
];

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — ISQ Studios" },
      { name: "description", content: "Shop all ISQ Studios tees. Premium cotton, minimal design." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s.q === "string" ? s.q : "",
    cat: typeof s.cat === "string" ? s.cat : "",
  }),
  component: ShopPage,
});

function ShopPage() {
  const [tileIndices, setTileIndices] = useState(
    Array.from({ length: 12 }, (_, i) => i % SHOP_BG_IMAGES.length)
  );

  useEffect(() => {
    // Preload all background images
    SHOP_BG_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // Each tile cycles independently at a random interval between 5–20s
    const timers = Array.from({ length: 12 }, (_, i) => {
      const delay = 3000 + i * 800; // staggered start
      const interval = 5000 + Math.floor(Math.random() * 15000); // 5–20s each
      const timeout = setTimeout(() => {
        const timer = setInterval(() => {
          setTileIndices((prev) => {
            const next = [...prev];
            next[i] = (next[i] + 1) % SHOP_BG_IMAGES.length;
            return next;
          });
        }, interval);
        return () => clearInterval(timer);
      }, delay);
      return timeout;
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <CartProvider>
      <div className="relative min-h-screen text-foreground">
        {/* Mosaic tiled background — each tile cycles independently */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="grid h-full w-full" style={{
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(3, 1fr)",
          }}>
            {tileIndices.map((imgIdx, i) => (
              <div key={`${i}-${imgIdx}`} className="overflow-hidden relative">
                <img
                  src={SHOP_BG_IMAGES[imgIdx]}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{
                    animation: `tileFade 5s ease forwards`,
                    opacity: 0,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-black/40" />
          <style>{`
            @keyframes tileFade {
              0%   { opacity: 0; }
              100% { opacity: 1; }
            }
          `}</style>
        </div>
        <Header />
        <main className="font-semibold text-[15px] [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
          <Shop />
        </main>
        <CartDrawer />
      </div>
    </CartProvider>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

type SortOption = "featured" | "newest" | "price-asc" | "price-desc" | "best-selling";

type Filters = {
  gsm: Gsm[];
  colors: string[];
  sizes: string[];
  priceMin: number;
  priceMax: number;
  availability: ("in-stock" | "out-of-stock")[];
};

const DEFAULT_FILTERS: Filters = {
  gsm: [],
  colors: [],
  sizes: [],
  priceMin: 0,
  priceMax: 200,
  availability: [],
};

const COLOR_OPTIONS = ["Black", "Sea Blue", "White", "Cream", "Khaki", "Army Green", "Pink", "Wine"];
const AVAILABILITY_OPTIONS = [
  { value: "in-stock" as const, label: "In Stock" },
  { value: "out-of-stock" as const, label: "Out of Stock" },
];
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "best-selling", label: "Best Selling" },
];

// ─── Quick View Modal ─────────────────────────────────────────────────────────

function QuickView({ product, onClose }: { product: Product; onClose: () => void }) {
  const [size, setSize] = useState("M");
  const { add } = useCart();
  const isLight = ["#f5f2ea", "#e9dfc9"].includes(product.swatch);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-2xl flex-col overflow-hidden bg-background md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="aspect-[4/5] w-full md:w-1/2">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: product.swatch }}>
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
        </div>
        {/* Info */}
        <div className="flex flex-1 flex-col justify-between p-8">
          <div>
            <button onClick={onClose} className="absolute right-4 top-4 p-1 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
            <div className="eyebrow">ISQ Studios</div>
            <h2 className="mt-2 font-display text-2xl">{product.name}</h2>
            <p className="mt-1 text-sm uppercase tracking-[0.24em] text-muted-foreground">{product.color}</p>
            <p className="mt-4 text-xl text-[#C9A227] font-medium">${product.price}</p>
            {product.gsm && (
              <span className="mt-3 inline-block border border-border px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                {product.gsm} GSM
              </span>
            )}
            <div className="mt-6">
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-muted-foreground">Size</p>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`h-9 min-w-9 border px-2 text-[11px] uppercase tracking-widest transition-colors ${
                      size === s ? "border-[#111111] bg-[#111111] text-[#F7F4EE]" : "border-[#E3DED3] hover:border-[#111111]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-2">
            <button
              onClick={() => {
                if (product.gsm) {
                  add({ gsm: product.gsm, color: product.color, size: size as Size, qty: 1, name: product.name, image: product.image });
                }
                onClose();
              }}
              className="flex w-full items-center justify-center gap-2 bg-[#111111] py-3 text-xs uppercase tracking-[0.24em] text-[#F7F4EE] transition-opacity hover:opacity-80"
            >
              <ShoppingBag className="h-4 w-4" /> Add to Bag
            </button>
            <a
              href={`/product/${product.id}`}
              className="flex items-center justify-center gap-2 border border-[#111111] py-3 text-xs uppercase tracking-[0.24em] transition-colors hover:bg-[#111111] hover:text-[#F7F4EE]"
            >
              View Full Product <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shop Product Card ────────────────────────────────────────────────────────

function ShopProductCard({ product, onQuickView }: { product: Product; onQuickView: (p: Product) => void }) {
  const [size, setSize] = useState("M");
  const { add } = useCart();
  const isLight = ["#f5f2ea", "#e9dfc9"].includes(product.swatch);
  const image = resolveCardImage(product.category, product.gsm, product.color, product.image);
  const gsmVariants = gsmOptions.filter((g) =>
    tees.some((t) => t.color === product.color && t.gsm === g.value)
  );

  return (
    <article className="group flex flex-col">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-bone">
        {image ? (
          <img
            src={image}
            alt={`${product.color} ${product.name}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="h-full w-full transition-transform duration-700 group-hover:scale-[1.03]"
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
        {/* Hover overlay actions */}
        <div className="absolute inset-0 flex flex-col items-center justify-end gap-2 bg-black/0 p-3 opacity-0 transition-all duration-300 group-hover:bg-black/10 group-hover:opacity-100">
          <button
            onClick={() => onQuickView(product)}
            className="flex w-full items-center justify-center gap-2 bg-background/95 py-2.5 text-[11px] uppercase tracking-[0.24em] backdrop-blur transition-colors hover:bg-ink hover:text-cream"
          >
            <Eye className="h-3.5 w-3.5" /> Quick View
          </button>
          <button
            onClick={() => product.gsm && add({ gsm: product.gsm, color: product.color, size: size as Size, qty: 1, name: product.name, image })}
            className="flex w-full items-center justify-center gap-2 bg-ink py-2.5 text-[11px] uppercase tracking-[0.24em] text-cream transition-opacity hover:opacity-80"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Add to Bag
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-normal">Essential Tee</h3>
          <p className="shrink-0 text-sm tabular-nums">from ${Math.min(...gsmVariants.map((g) => g.price))}</p>
        </div>
        <p className="mt-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">{product.color}</p>

        {/* GSM badges */}
        <div className="mt-2 flex flex-wrap gap-1">
          {gsmVariants.map((g) => (
            <span
              key={g.value}
              className="border border-[#E3DED3] px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-[#555555]"
            >
              {g.label}
            </span>
          ))}
        </div>

        {/* Size selector */}
        <div className="mt-3 flex flex-wrap gap-1">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`h-7 min-w-7 border px-1.5 text-[10px] uppercase tracking-widest transition-colors ${
                size === s
                  ? "border-[#111111] bg-[#111111] text-[#F7F4EE]"
                  : "border-[#E3DED3] text-[#555555] hover:border-[#111111] hover:text-[#111111]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => product.gsm && add({ gsm: product.gsm, color: product.color, size: size as Size, qty: 1, name: product.name, image })}
            className="flex flex-1 items-center justify-center gap-1.5 border border-[#111111] bg-[#111111] py-2.5 text-[11px] uppercase tracking-[0.24em] text-[#F7F4EE] transition-colors hover:bg-[#C9A227] hover:border-[#C9A227]"
          >
            <ShoppingBag className="h-3 w-3" /> Add to Bag
          </button>
          <a
            href={`/product/${product.id}`}
            className="flex items-center justify-center border border-[#E3DED3] px-3 py-2.5 text-[11px] uppercase tracking-[0.24em] text-[#555555] transition-colors hover:border-[#111111] hover:text-[#111111]"
            aria-label="View product"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-border py-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-xs uppercase tracking-[0.24em]"
      >
        {title}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

function FilterPanel({
  filters,
  onChange,
  onReset,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
}) {
  const toggle = <T extends string>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const activeCount =
    filters.gsm.length +
    filters.colors.length +
    filters.sizes.length +
    filters.availability.length +
    (filters.priceMin > 0 || filters.priceMax < 200 ? 1 : 0);

  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <span className="text-xs uppercase tracking-[0.24em]">
          Filters {activeCount > 0 && <span className="ml-1 text-[#C9A227]">({activeCount})</span>}
        </span>
        {activeCount > 0 && (
          <button onClick={onReset} className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">
            Clear all
          </button>
        )}
      </div>

      {/* GSM */}
      <FilterSection title="GSM">
        <div className="space-y-2.5">
          {gsmOptions.map((g) => (
            <label key={g.value} className="flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={filters.gsm.includes(g.value)}
                onChange={() => onChange({ ...filters, gsm: toggle(filters.gsm, g.value) })}
                className="h-4 w-4 accent-foreground"
              />
              <span>{g.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">${g.price}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Color */}
      <FilterSection title="Color">
        <div className="space-y-2.5">
          {COLOR_OPTIONS.map((c) => {
            const swatch = tees.find((t) => t.color === c)?.swatch ?? "#ccc";
            return (
              <label key={c} className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={filters.colors.includes(c)}
                  onChange={() => onChange({ ...filters, colors: toggle(filters.colors, c) })}
                  className="h-4 w-4 accent-foreground"
                />
                <span
                  className="h-4 w-4 rounded-full border border-border"
                  style={{ backgroundColor: swatch }}
                />
                <span>{c}</span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Size */}
      <FilterSection title="Size">
        <div className="flex flex-wrap gap-1.5">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => onChange({ ...filters, sizes: toggle(filters.sizes, s as string) })}
              className={`h-8 min-w-8 border px-2 text-[11px] uppercase tracking-widest transition-colors ${
                filters.sizes.includes(s)
                  ? "border-[#111111] bg-[#111111] text-[#F7F4EE]"
                  : "border-[#E3DED3] hover:border-[#111111]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>${filters.priceMin}</span>
            <span>${filters.priceMax}</span>
          </div>
          <input
            type="range"
            min={0}
            max={200}
            step={5}
            value={filters.priceMax}
            onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })}
            className="w-full accent-foreground"
          />
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              max={filters.priceMax}
              value={filters.priceMin}
              onChange={(e) => onChange({ ...filters, priceMin: Number(e.target.value) })}
              className="w-full border border-border bg-transparent px-2 py-1.5 text-xs"
              placeholder="Min"
            />
            <input
              type="number"
              min={filters.priceMin}
              max={200}
              value={filters.priceMax}
              onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })}
              className="w-full border border-border bg-transparent px-2 py-1.5 text-xs"
              placeholder="Max"
            />
          </div>
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability">
        <div className="space-y-2.5">
          {AVAILABILITY_OPTIONS.map((a) => (
            <label key={a.value} className="flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={filters.availability.includes(a.value)}
                onChange={() => onChange({ ...filters, availability: toggle(filters.availability, a.value) })}
                className="h-4 w-4 accent-foreground"
              />
              <span>{a.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

// ─── Main Shop ────────────────────────────────────────────────────────────────

function Shop() {
  const { q: initialQ, cat: initialCat } = Route.useSearch();
  const [category, setCategory] = useState<"tees" | "caps">(initialCat === "caps" ? "caps" : "tees");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>("featured");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQ ?? "");

  // Sync search query from URL param on mount
  useEffect(() => {
    if (initialQ) setSearchQuery(initialQ);
  }, [initialQ]);

  // One card per GSM+color combination
  const colorProducts = useMemo(() => {
    return tees; // all variants, one per gsm+color
  }, []);

  const filtered = useMemo(() => {
    // Caps category — no filters apply
    if (category === "caps") return caps;

    // If search query active, use search engine results
    if (searchQuery.trim().length > 0) {
      return search(searchQuery).map((r) => r.product);
    }

    let result = colorProducts;

    if (filters.gsm.length > 0) {
      result = result.filter((p) => filters.gsm.includes(p.gsm!));
    }
    if (filters.colors.length > 0) {
      result = result.filter((p) => filters.colors.includes(p.color));
    }
    if (filters.availability.length > 0 && !filters.availability.includes("in-stock")) {
      result = [];
    }
    if (filters.priceMin > 0 || filters.priceMax < 200) {
      result = result.filter((p) => p.price >= filters.priceMin && p.price <= filters.priceMax);
    }

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result = [...result].reverse();
        break;
      default:
        break;
    }

    return result;
  }, [category, colorProducts, filters, sort, searchQuery]);

  const activeFilterCount =
    filters.gsm.length +
    filters.colors.length +
    filters.sizes.length +
    filters.availability.length +
    (filters.priceMin > 0 || filters.priceMax < 200 ? 1 : 0);

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-32 pt-16 lg:px-14">
      {/* Page Header — already has its own glass box */}
      <div className="mb-10 pb-8">
        <div className="inline-block rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-8 py-6 shadow-lg">
          <div className="eyebrow text-white/70">Collection 001</div>
          <h1 className="mt-2 font-display text-4xl md:text-5xl text-white">
            {category === "tees" ? "The Tee" : "The Cap"}
          </h1>
          <p className="mt-3 max-w-md text-sm text-white/70">
            {category === "tees"
              ? "Heavyweight cotton, considered cuts. Three weights. Eight tones. One silhouette."
              : "Structured six-panel. Cotton twill front, breathable mesh back. Adjustable snap."}
          </p>
        </div>
      </div>

      <div className="flex gap-10 lg:gap-14">
        {/* Desktop Sidebar — tees only */}
        {category === "tees" && (
          <aside className="hidden w-56 shrink-0 lg:block xl:w-64">
            <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-5 py-5 shadow-lg">
              <FilterPanel filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULT_FILTERS)} />
            </div>
          </aside>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Category tabs */}
          <div className="mb-4 inline-block rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-6 py-3 shadow-lg">
            <div className="flex gap-0">
              {(["tees", "caps"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setFilters(DEFAULT_FILTERS); setSearchQuery(""); }}
                  className={`pb-1 pr-8 text-xs uppercase tracking-[0.24em] transition-colors ${
                    category === cat
                      ? "border-b-2 border-white text-white"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {cat === "tees" ? "T-Shirts" : "Caps"}
                </button>
              ))}
            </div>
          </div>

          {/* Toolbar */}
          <div className="mb-6 inline-flex w-full items-center justify-between gap-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-5 py-3 shadow-lg">
            {category === "tees" && (
              <button
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-2 border border-white/30 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white lg:hidden"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center bg-[#C9A227] text-[10px] text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            )}
            <p className="text-xs text-white/70">
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
            </p>
            <div className="flex items-center gap-3 ml-auto">
              {/* Search bar — tees only, top right */}
              {category === "tees" && (
                <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1.5">
                  <svg className="h-3.5 w-3.5 shrink-0 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search…"
                    className="w-36 bg-transparent text-xs text-white outline-none placeholder:text-white/40 md:w-52"
                    aria-label="Search products"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} aria-label="Clear search">
                      <X className="h-3.5 w-3.5 text-white/60 hover:text-white" />
                    </button>
                  )}
                </div>
              )}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 border border-white/30 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white"
                >
                  {SORT_OPTIONS.find((s) => s.value === sort)?.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                </button>
              {sortOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
                  {SORT_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => { setSort(s.value); setSortOpen(false); }}
                      className={`block w-full px-4 py-2.5 text-left text-xs uppercase tracking-[0.24em] transition-colors hover:bg-white/10 text-white ${
                        sort === s.value ? "underline underline-offset-4" : "text-white/70"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="mb-6 inline-flex flex-wrap gap-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-5 py-3 shadow-lg w-full">
              {filters.gsm.map((g) => (
                <button key={g} onClick={() => setFilters({ ...filters, gsm: filters.gsm.filter((v) => v !== g) })}
                  className="flex items-center gap-1.5 border border-white/30 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-widest text-white hover:border-white">
                  {g} GSM <X className="h-3 w-3" />
                </button>
              ))}
              {filters.colors.map((c) => (
                <button key={c} onClick={() => setFilters({ ...filters, colors: filters.colors.filter((v) => v !== c) })}
                  className="flex items-center gap-1.5 border border-white/30 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-widest text-white hover:border-white">
                  {c} <X className="h-3 w-3" />
                </button>
              ))}
              {filters.sizes.map((s) => (
                <button key={s} onClick={() => setFilters({ ...filters, sizes: filters.sizes.filter((v) => v !== s) })}
                  className="flex items-center gap-1.5 border border-white/30 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-widest text-white hover:border-white">
                  {s} <X className="h-3 w-3" />
                </button>
              ))}
              <button onClick={() => setFilters(DEFAULT_FILTERS)}
                className="px-3 py-1 text-[11px] uppercase tracking-widest text-white/60 underline underline-offset-4 hover:text-white">
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid */}
          <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 shadow-lg">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <p className="font-display text-2xl text-white">No products found</p>
                <p className="mt-2 text-sm text-white/60">Try adjusting your filters</p>
                <button onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="mt-6 border border-white/40 px-6 py-3 text-xs uppercase tracking-[0.24em] text-white transition-colors hover:bg-white/20">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-x-4 gap-y-12 sm:gap-x-6">
                {filtered.map((p) => (
                  <ShopProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
          <div className="relative ml-auto flex h-full w-80 max-w-full flex-col bg-background">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <span className="text-xs uppercase tracking-[0.24em]">Filters</span>
              <button onClick={() => setDrawerOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-2">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                onReset={() => { setFilters(DEFAULT_FILTERS); setDrawerOpen(false); }}
              />
            </div>
            <div className="border-t border-border p-6">
              <button
                onClick={() => setDrawerOpen(false)}
              className="w-full bg-[#111111] py-3 text-xs uppercase tracking-[0.24em] text-[#F7F4EE] transition-colors hover:bg-[#C9A227]"
              >
                View {filtered.length} {filtered.length === 1 ? "Product" : "Products"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  );
}

