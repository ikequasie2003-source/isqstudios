import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { SlidersHorizontal, X, ChevronDown, Eye, ShoppingBag, ArrowRight } from "lucide-react";
import { CartProvider } from "@/lib/cart";
import { Header, CartDrawer } from "@/components/site-chrome";
import { useCart } from "@/lib/cart";
import { tees, caps, sizes, gsmOptions, type Product, type Gsm, type Size } from "@/lib/products";
import { search } from "@/lib/search";
import { resolveCardImage } from "@/lib/media-resolver";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — ISQ Studios" },
      { name: "description", content: "Shop all ISQ Studios tees. Premium cotton, minimal design." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  component: ShopPage,
});

function ShopPage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main>
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
            <p className="mt-4 text-xl">${product.price}</p>
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
                      size === s ? "border-ink bg-ink text-cream" : "border-border hover:border-ink"
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
              className="flex items-center justify-center gap-2 bg-ink py-3 text-xs uppercase tracking-[0.24em] text-cream transition-opacity hover:opacity-80"
            >
              <ShoppingBag className="h-4 w-4" /> Add to Bag
            </button>
            <a
              href={`/product/${product.id}`}
              className="flex items-center justify-center gap-2 border border-ink py-3 text-xs uppercase tracking-[0.24em] transition-colors hover:bg-ink hover:text-cream"
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
              className="border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground"
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
                size === s ? "border-ink bg-ink text-cream" : "border-border text-foreground hover:border-ink"
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
            className="flex flex-1 items-center justify-center gap-1.5 border border-ink py-2.5 text-[11px] uppercase tracking-[0.24em] transition-colors hover:bg-ink hover:text-cream"
          >
            <ShoppingBag className="h-3 w-3" /> Add to Bag
          </button>
          <a
            href={`/product/${product.id}`}
            className="flex items-center justify-center border border-border px-3 py-2.5 text-[11px] uppercase tracking-[0.24em] transition-colors hover:border-ink"
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
          Filters {activeCount > 0 && <span className="ml-1 text-gold">({activeCount})</span>}
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
                  ? "border-ink bg-ink text-cream"
                  : "border-border hover:border-ink"
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
  const { q: initialQ } = Route.useSearch();
  const [category, setCategory] = useState<"tees" | "caps">("tees");
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
      {/* Page Header */}
      <div className="mb-10 border-b border-border pb-8">
        <div className="eyebrow">Collection 001</div>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">
          {category === "tees" ? "The Tee" : "The Cap"}
        </h1>
        <p className="mt-3 max-w-md text-sm text-foreground/70">
          {category === "tees"
            ? "Heavyweight cotton, considered cuts. Three weights. Eight tones. One silhouette."
            : "Structured six-panel. Cotton twill front, breathable mesh back. Adjustable snap."}
        </p>

        {/* Category tabs */}
        <div className="mt-6 flex gap-0 border-b border-border">
          {(["tees", "caps"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setFilters(DEFAULT_FILTERS); setSearchQuery(""); }}
              className={`pb-3 pr-8 text-xs uppercase tracking-[0.24em] transition-colors ${
                category === cat
                  ? "border-b-2 border-ink text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat === "tees" ? "T-Shirts" : "Caps"}
            </button>
          ))}
        </div>

        {/* Search bar — tees only */}
        {category === "tees" && (
          <div className="mt-6 flex max-w-md items-center gap-3 border-b border-ink pb-1">
            <svg className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by color, GSM, size… e.g. 260 GSM Black XL"
              className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground/60"
              aria-label="Search products"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} aria-label="Clear search">
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
        )}
        {searchQuery && category === "tees" && (
          <p className="mt-2 text-xs text-muted-foreground">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{searchQuery}"
          </p>
        )}
      </div>

      <div className="flex gap-10 lg:gap-14">
        {/* Desktop Sidebar — tees only */}
        {category === "tees" && (
          <aside className="hidden w-56 shrink-0 lg:block xl:w-64">
            <FilterPanel filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULT_FILTERS)} />
          </aside>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="mb-8 flex items-center justify-between gap-4">
            {/* Mobile filter button — tees only */}
            {category === "tees" && (
              <button
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-2 border border-border px-4 py-2.5 text-xs uppercase tracking-[0.24em] lg:hidden"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center bg-ink text-[10px] text-cream">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            )}

            <p className="text-xs text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
            </p>

            {/* Sort */}
            <div className="relative ml-auto">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 border border-border px-4 py-2.5 text-xs uppercase tracking-[0.24em]"
              >
                {SORT_OPTIONS.find((s) => s.value === sort)?.label}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 w-48 border border-border bg-background shadow-lg">
                  {SORT_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => { setSort(s.value); setSortOpen(false); }}
                      className={`block w-full px-4 py-2.5 text-left text-xs uppercase tracking-[0.24em] transition-colors hover:bg-bone ${
                        sort === s.value ? "text-foreground underline underline-offset-4" : "text-muted-foreground"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {filters.gsm.map((g) => (
                <button
                  key={g}
                  onClick={() => setFilters({ ...filters, gsm: filters.gsm.filter((v) => v !== g) })}
                  className="flex items-center gap-1.5 border border-border bg-bone px-3 py-1 text-[11px] uppercase tracking-widest hover:border-ink"
                >
                  {g} GSM <X className="h-3 w-3" />
                </button>
              ))}
              {filters.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilters({ ...filters, colors: filters.colors.filter((v) => v !== c) })}
                  className="flex items-center gap-1.5 border border-border bg-bone px-3 py-1 text-[11px] uppercase tracking-widest hover:border-ink"
                >
                  {c} <X className="h-3 w-3" />
                </button>
              ))}
              {filters.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilters({ ...filters, sizes: filters.sizes.filter((v) => v !== s) })}
                  className="flex items-center gap-1.5 border border-border bg-bone px-3 py-1 text-[11px] uppercase tracking-widest hover:border-ink"
                >
                  {s} <X className="h-3 w-3" />
                </button>
              ))}
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="font-display text-2xl">No products found</p>
              <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters</p>
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="mt-6 border border-ink px-6 py-3 text-xs uppercase tracking-[0.24em] transition-colors hover:bg-ink hover:text-cream"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ShopProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          )}
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
                className="w-full bg-ink py-3 text-xs uppercase tracking-[0.24em] text-cream"
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
